import { runQuery, initDb } from "./client";
import { RegulationsDataTypes } from "./models";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { initializeDatabase } from "./config";

async function refreshCache(
  agencyCode: string,
  docketId: string | undefined, // docketId can be undefined/null
  dataType: RegulationsDataTypes
) {
  if (!agencyCode) {
    throw new Error("agency_code is required");
  }

  const tableName = `${dataType}_cache`;
  const { clause: whereClause, params: whereParams } = buildWhereClause(agencyCode, docketId);

  console.log(`Refreshing ${dataType} cache for agency code: ${agencyCode}, docket id: ${docketId}`);

  await runQuery(`DELETE FROM ${tableName} WHERE ${whereClause}`, whereParams);

  const query = buildBaseQuery(dataType, agencyCode, docketId);
  const countResult = await runQuery<{ count: number }>(`SELECT COUNT(*) as count FROM (${query}) q`);
  const countRow = countResult[0];
  const count = countRow ? Object.values(countRow)[0] : 0;

  if (Number(count) === 0) {
     console.warn(`No records found for agency ${agencyCode} to cache.`);
     return;
  }

  console.log(`Inserting ${count} records into ${tableName}`);
  
  await runQuery(`
    INSERT INTO ${tableName}
    SELECT *, CURRENT_TIMESTAMP as cached_at
    FROM (${query}) q
  `);
  
  console.log(`Refreshed ${dataType} cache successfully`);
}

export async function getData(
  dataType: RegulationsDataTypes,
  agencyCode: string,
  docketId?: string,
  maxCacheAgeHours = Infinity
): Promise<any[]> {
  await initDb();
  await initializeDatabase(); 

  const tableName = `${dataType}_cache`;
  const { clause: whereClause, params: whereParams } = buildWhereClause(agencyCode, docketId);

  const cacheAgeResult = await runQuery(`
    SELECT 
        COUNT(*) as count,
        MAX(cached_at) as last_updated,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - MAX(cached_at)))/3600 as age_hours
    FROM ${tableName} 
    WHERE ${whereClause}
  `, whereParams);

  const row = cacheAgeResult[0];
  const count = Number(Object.values(row)[0]);
  const ageHours = row.age_hours !== null ? Number(row.age_hours) : null;
  
  if (count > 0 && ageHours !== null && ageHours < maxCacheAgeHours) {
    console.log("Using cached data");
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
    return runQuery(query, whereParams);
  } else {
    try {
        await refreshCache(agencyCode, docketId, dataType);
        const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
        return runQuery(query, whereParams);
    } catch (e) {
        console.error("Error refreshing cache, falling back to live query", e);
        let query = buildBaseQuery(dataType, agencyCode, docketId);
        let params: any[] = [];
        if (agencyCode || docketId) {
             const { clause, params: p } = buildWhereClause(agencyCode, docketId);
             const wc = clause.replace(/agency_code/g, 'f.agency_code').replace(/docket_id/g, 'f.docket_id');
             query += ` WHERE ${wc}`;
             params = p;
        }
        return runQuery(query, params);
    }
  }
}

export async function searchResources(query: string, agencyCode?: string): Promise<any[]> {
  await initDb();
  await initializeDatabase();
  
  const tables = ['dockets_cache', 'documents_cache', 'comments_cache'];

  const queryParams: any[] = [];
  const queryParts = [];

  for (const table of tables) {
      const type = table.split('_')[0];
      let where = `title ILIKE ?`;
      queryParams.push(`%${query}%`); // DuckDB handles ' automatically in params

      if (agencyCode) {
          where += ` AND agency_code = ?`;
          queryParams.push(agencyCode);
      }

      queryParts.push(`
      SELECT 
        '${type}' as type,
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
  
  try {
     return await runQuery(fullQuery, queryParams);
  } catch (e) {
     console.error("Search query failed", e);
     return [];
  }
}
