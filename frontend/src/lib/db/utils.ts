import { FIELD_MAPPINGS } from "./constants";
import { RegulationsDataTypes } from "./models";

export function buildBaseQuery(
  dataType: RegulationsDataTypes,
  agencyCode?: string,
  docketId?: string
): string {
  const mapping = FIELD_MAPPINGS[dataType];
  const fields = mapping.fields.join(",\n        ");

  let path = "";
  if (agencyCode && docketId) {
    path = `s3://mirrulations/raw-data/${agencyCode}/${docketId}/text-${docketId}/${mapping.path_pattern}`;
  } else if (agencyCode) {
    path = `s3://mirrulations/raw-data/${agencyCode}/*/*/${mapping.path_pattern}`;
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

/**
 * Escapes single quotes in a string by doubling them, making it safe for SQL.
 */
export function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

export function buildWhereClause(agencyCode?: string, docketId?: string): string {
  const whereClause: string[] = [];
  if (agencyCode) {
    const escaped = escapeSqlString(agencyCode.toUpperCase());
    whereClause.push(`agency_code = '${escaped}'`);
  }
  if (docketId) {
    const escaped = escapeSqlString(docketId.toUpperCase());
    whereClause.push(`docket_id = '${escaped}'`);
  }
  
  if (whereClause.length === 0) {
    return "1=1";
  }
  return whereClause.join(" AND ");
}
