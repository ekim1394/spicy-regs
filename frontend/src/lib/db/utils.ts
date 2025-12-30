import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

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

  // Escape inputs to prevent SQL injection in the read_text path string
  const safeAgencyCode = agencyCode ? escapeSqlString(agencyCode) : undefined;
  const safeDocketId = docketId ? escapeSqlString(docketId) : undefined;

  let path = "";
  if (safeAgencyCode && safeDocketId) {
    path = `s3://mirrulations/raw-data/${safeAgencyCode}/${safeDocketId}/text-${safeDocketId}/${mapping.path_pattern}`;
  } else if (safeAgencyCode) {
    path = `s3://mirrulations/raw-data/${safeAgencyCode}/*/*/${mapping.path_pattern}`;
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
