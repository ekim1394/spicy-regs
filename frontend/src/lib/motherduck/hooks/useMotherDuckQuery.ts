"use client";

import { useCallback } from 'react';
import { useMotherDuckClientState } from '@/lib/motherduck/context/motherduckClientContext';
import { RegulationsDataTypes } from '@/lib/db/models';
import { buildBaseQuery, buildWhereClause } from '@/lib/db/utils';

export interface UseMotherDuckQueryResult<T> {
  evaluateQuery: (sql: string) => Promise<T[]>;
  getData: (
    dataType: RegulationsDataTypes,
    agencyCode: string,
    docketId?: string
  ) => Promise<T[]>;
  searchResources: (query: string, agencyCode?: string) => Promise<T[]>;
  // Persistence methods
  createTable: (tableName: string, dataType: RegulationsDataTypes) => Promise<void>;
  insertFromS3: (tableName: string, dataType: RegulationsDataTypes, agencyCode: string, docketId?: string) => Promise<number>;
  getPersistedData: (tableName: string, agencyCode?: string, docketId?: string) => Promise<T[]>;
}

// Column definitions for each data type
const TABLE_SCHEMAS: Record<RegulationsDataTypes, string> = {
  [RegulationsDataTypes.Dockets]: `
    agency_code VARCHAR,
    docket_id VARCHAR,
    year VARCHAR,
    raw_json TEXT,
    docket_type VARCHAR,
    modify_date TIMESTAMP,
    title TEXT,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `,
  [RegulationsDataTypes.Comments]: `
    agency_code VARCHAR,
    docket_id VARCHAR,
    year VARCHAR,
    raw_json TEXT,
    comment_id VARCHAR,
    category VARCHAR,
    comment TEXT,
    document_type VARCHAR,
    modify_date TIMESTAMP,
    posted_date TIMESTAMP,
    receive_date TIMESTAMP,
    subtype VARCHAR,
    title TEXT,
    withdrawn BOOLEAN,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `,
  [RegulationsDataTypes.Documents]: `
    agency_code VARCHAR,
    docket_id VARCHAR,
    year VARCHAR,
    raw_json TEXT,
    document_id VARCHAR,
    category VARCHAR,
    document_type VARCHAR,
    comment_start_date TIMESTAMP,
    comment_end_date TIMESTAMP,
    modify_date TIMESTAMP,
    posted_date TIMESTAMP,
    receive_date TIMESTAMP,
    page_count INTEGER,
    withdrawn BOOLEAN,
    title TEXT,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `,
};

// Helper bindParams to interpolate manually since contextEvaluateQuery might not support it
const bindParams = (sql: string, params: any[]) => {
    let paramIdx = 0;
    return sql.replace(/\?/g, () => {
        const val = params[paramIdx++];
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        return val;
    });
};


/**
 * Hook for executing MotherDuck queries in client components.
 * Uses the MotherDuckClientProvider context for connection management.
 */
export function useMotherDuckQuery<T = any>(): UseMotherDuckQueryResult<T> {
  const { evaluateQuery: contextEvaluateQuery } = useMotherDuckClientState();

  const evaluateQuery = useCallback(async (sql: string): Promise<T[]> => {
    const result = await contextEvaluateQuery(sql);
    return result.data.toRows() as T[];
  }, [contextEvaluateQuery]);

  /**
   * Create a table in MotherDuck for persisting data
   */
  const createTable = useCallback(async (
    tableName: string,
    dataType: RegulationsDataTypes
  ): Promise<void> => {
    const schema = TABLE_SCHEMAS[dataType];
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
    console.log('[MotherDuck] Creating table:', tableName);
    await contextEvaluateQuery(query);
    console.log('[MotherDuck] Table created successfully:', tableName);
  }, [contextEvaluateQuery]);

  /**
   * Insert data from S3 into a persisted MotherDuck table
   * Returns the number of rows inserted
   */
  const insertFromS3 = useCallback(async (
    tableName: string,
    dataType: RegulationsDataTypes,
    agencyCode: string,
    docketId?: string
  ): Promise<number> => {
    // Build query to read from S3
    const s3Query = buildBaseQuery(dataType, agencyCode, docketId);
    
    // Insert into the persisted table
    const insertQuery = `
      INSERT INTO ${tableName}
      SELECT *, CURRENT_TIMESTAMP as cached_at
      FROM (${s3Query}) q
    `;
    
    console.log('[MotherDuck] Inserting data from S3 for:', { tableName, agencyCode, docketId });
    await contextEvaluateQuery(insertQuery);
    
    // Get count of inserted rows
    // Parameterize or escape agencyCode? It's used in count query.
    // agencyCode is a string.
    const countQuery = `SELECT COUNT(*) as count FROM ${tableName} WHERE agency_code = '${agencyCode.replace(/'/g, "''")}'`;
    const countResult = await contextEvaluateQuery(countQuery);
    const count = (countResult.data.toRows() as any[])[0]?.count || 0;
    console.log('[MotherDuck] Inserted rows:', count);
    
    return Number(count);
  }, [contextEvaluateQuery]);

  /**
   * Get data from a persisted MotherDuck table
   */
  const getPersistedData = useCallback(async (
    tableName: string,
    agencyCode?: string,
    docketId?: string
  ): Promise<T[]> => {
    const { clause: whereClause, params: whereParams } = buildWhereClause(agencyCode, docketId);
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause} LIMIT 100`;
    
    console.log('[MotherDuck] Querying persisted table:', tableName);
    const result = await contextEvaluateQuery(bindParams(query, whereParams));
    return result.data.toRows() as T[];
  }, [contextEvaluateQuery]);

  /**
   * Get data directly from S3 (no persistence)
   */
  const getData = useCallback(async (
    dataType: RegulationsDataTypes,
    agencyCode: string,
    docketId?: string
  ): Promise<T[]> => {
    // Build query using existing utility functions
    let query = buildBaseQuery(dataType, agencyCode, docketId);
    let params: any[] = [];
    
    // Add WHERE clause if filtering
    if (agencyCode || docketId) {
      const { clause, params: p } = buildWhereClause(agencyCode, docketId);
      const whereClause = clause
        .replace(/agency_code/g, 'f.agency_code')
        .replace(/docket_id/g, 'f.docket_id');
      query += ` WHERE ${whereClause}`;
      params = p;
    }

    query += ` LIMIT 100`; // Limit results for performance
    
    console.log('[MotherDuck] Executing getData query for:', { dataType, agencyCode, docketId });
    
    const result = await contextEvaluateQuery(bindParams(query, params));
    return result.data.toRows() as T[];
  }, [contextEvaluateQuery]);

  const searchResources = useCallback(async (
    searchQuery: string,
    agencyCode?: string
  ): Promise<T[]> => {
    const tables = ['dockets', 'documents', 'comments'];
    
    // Escape single quotes to prevent SQL injection
    // Using manual escaping if we assume contextEvaluateQuery doesn't support params.
    // But we should use bindParams if possible.
    
    const queryParts = [];
    const queryParams: any[] = [];

    for (const table of tables) {
        let where = `title ILIKE ?`;
        queryParams.push(`%${searchQuery}%`);

        if (agencyCode) {
            where += ` AND agency_code = ?`;
            queryParams.push(agencyCode);
        }

        queryParts.push(`
        SELECT 
          '${table}' as type,
          title, 
          docket_id, 
          agency_code,
          year,
          raw_json
        FROM ${table}
        WHERE ${where}
      `);
    }
    
    const fullQuery = queryParts.join(" UNION ALL ") + " LIMIT 50";
    
    console.log('[MotherDuck] Executing search query for:', { searchQuery, agencyCode });
    
    const result = await contextEvaluateQuery(bindParams(fullQuery, queryParams));
    return result.data.toRows() as T[];
  }, [contextEvaluateQuery]);

  return {
    evaluateQuery,
    getData,
    searchResources,
    createTable,
    insertFromS3,
    getPersistedData,
  };
}
