import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

export function escapeSqlString(input: string): string {
  return input.replace(/'/g, "''");
}

export function sanitizePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  let path = "";
  if (agencyCode && docketId) {
    const safeAgency = sanitizePathSegment(agencyCode);
    const safeDocket = sanitizePathSegment(docketId);
    path = `s3://mirrulations/raw-data/${safeAgency}/${safeDocket}/text-${safeDocket}/${mapping.path_pattern}`;
  } else if (agencyCode) {
    const safeAgency = sanitizePathSegment(agencyCode);
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
    const safeAgency = escapeSqlString(agencyCode.toUpperCase());
    whereClause.push(`agency_code = '${safeAgency}'`);
  }
  if (docketId) {
    const safeDocket = escapeSqlString(docketId.toUpperCase());
    whereClause.push(`docket_id = '${safeDocket}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
