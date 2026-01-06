import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

export function escapeSqlString(str: string): string {
  if (!str) return '';
  // DuckDB/PostgreSQL escape single quotes by doubling them
  return str.replace(/'/g, "''");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  let path = "";
  // Sanitize inputs to prevent path traversal or injection issues, although these are used in S3 paths
  // Using escapeSqlString here primarily to catch any potential quote injection if the path was constructed differently
  // For S3 paths, we should also worry about traversal, but we assume agencyCode and docketId are valid IDs.
  // We'll rely on the fact that they are used in a string literal in the SQL below.
  const safeAgency = agencyCode ? escapeSqlString(agencyCode) : '';
  const safeDocket = docketId ? escapeSqlString(docketId) : '';

  if (agencyCode && docketId) {
    path = `s3://mirrulations/raw-data/${safeAgency}/${safeDocket}/text-${safeDocket}/${mapping.path_pattern}`;
  } else if (agencyCode) {
    path = `s3://mirrulations/raw-data/${safeAgency}/*/*/${mapping.path_pattern}`;
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
    whereClause.push(`agency_code = '${escapeSqlString(agencyCode.toUpperCase())}'`);
  }
  if (docketId) {
    whereClause.push(`docket_id = '${escapeSqlString(docketId.toUpperCase())}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
