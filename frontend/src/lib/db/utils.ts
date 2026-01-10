import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

export function escapeSqlString(str: string): string {
  // Escape single quotes by doubling them
  return str.replace(/'/g, "''");
}

export function sanitizePathSegment(segment: string): string {
  // Allow only alphanumeric characters, hyphens, and underscores
  return segment.replace(/[^a-zA-Z0-9\-_]/g, "");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  const sanitizedAgencyCode = agencyCode ? sanitizePathSegment(agencyCode) : undefined;
  const sanitizedDocketId = docketId ? sanitizePathSegment(docketId) : undefined;

  let path = "";
  if (sanitizedAgencyCode && sanitizedDocketId) {
    path = `s3://mirrulations/raw-data/${sanitizedAgencyCode}/${sanitizedDocketId}/text-${sanitizedDocketId}/${mapping.path_pattern}`;
  } else if (sanitizedAgencyCode) {
    path = `s3://mirrulations/raw-data/${sanitizedAgencyCode}/*/*/${mapping.path_pattern}`;
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
