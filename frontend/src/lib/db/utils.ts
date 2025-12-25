import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

export function escapeSqlString(value: string): string {
  if (!value) return "";
  return value.replace(/'/g, "''");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  // We should escape these inputs because they are injected into the read_text SQL string
  // If we don't, a single quote in agencyCode can break the SQL syntax 's3://...'.
  const safeAgencyCode = agencyCode ? escapeSqlString(agencyCode) : agencyCode;
  const safeDocketId = docketId ? escapeSqlString(docketId) : docketId;

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
    const safeAgencyCode = escapeSqlString(agencyCode.toUpperCase());
    whereClause.push(`agency_code = '${safeAgencyCode}'`);
  }
  if (docketId) {
    const safeDocketId = escapeSqlString(docketId.toUpperCase());
    whereClause.push(`docket_id = '${safeDocketId}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
