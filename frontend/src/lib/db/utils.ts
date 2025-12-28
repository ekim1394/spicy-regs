import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

/**
 * Escapes a string for use in a SQL query by doubling single quotes.
 * This is a basic protection against SQL injection for DuckDB.
 * @param str The string to escape
 * @returns The escaped string
 */
export function escapeSqlString(str: string): string {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  // Escape inputs used in SQL string literal (path)
  const escapedAgencyCode = agencyCode ? escapeSqlString(agencyCode) : undefined;
  const escapedDocketId = docketId ? escapeSqlString(docketId) : undefined;

  let path = "";
  if (escapedAgencyCode && escapedDocketId) {
    path = `s3://mirrulations/raw-data/${escapedAgencyCode}/${escapedDocketId}/text-${escapedDocketId}/${mapping.path_pattern}`;
  } else if (escapedAgencyCode) {
    path = `s3://mirrulations/raw-data/${escapedAgencyCode}/*/*/${mapping.path_pattern}`;
  } else {
    path = `s3://mirrulations/raw-data/*/*/${mapping.path_pattern}`;
  }

  return `
    SELECT
        f.agency_code,
        f.docket_id,
        f.year,
        f.content AS raw_json,
        ${fields}
    FROM (
        SELECT
            filename,
            content,
            split_part(filename, '/', 5) as agency_code,
            split_part(filename, '/', 6) as docket_id,
            split_part(split_part(filename, '/', 6), '-', 2) as year
        FROM read_text('${path}')
    ) f
    `;
}

export function buildWhereClause(agencyCode?: string, docketId?: string): string {
  const whereClause: string[] = [];
  if (agencyCode) {
    whereClause.push(`agency_code = '${escapeSqlString(agencyCode).toUpperCase()}'`);
  }
  if (docketId) {
    whereClause.push(`docket_id = '${escapeSqlString(docketId).toUpperCase()}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
