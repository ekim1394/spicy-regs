import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

/**
 * Escapes a string for use in a SQL query by doubling single quotes.
 * This prevents SQL injection attacks when interpolating strings into SQL.
 */
export function escapeSqlString(str: string): string {
  if (!str) return str;
  return str.replace(/'/g, "''");
}

/**
 * Sanitizes a string for use in a file path or URL segment.
 * Allows only alphanumeric characters, hyphens, and underscores.
 * Prevents path traversal and injection into S3 paths.
 */
export function sanitizePathSegment(str: string): string {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9\-_]/g, "");
}

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  // Sanitize inputs for path construction to prevent path traversal or invalid paths
  const safeAgencyCode = agencyCode ? sanitizePathSegment(agencyCode) : undefined;
  const safeDocketId = docketId ? sanitizePathSegment(docketId) : undefined;

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
    const escapedAgency = escapeSqlString(agencyCode.toUpperCase());
    whereClause.push(`agency_code = '${escapedAgency}'`);
  }
  if (docketId) {
    const escapedDocket = escapeSqlString(docketId.toUpperCase());
    whereClause.push(`docket_id = '${escapedDocket}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
