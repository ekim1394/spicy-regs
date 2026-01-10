import { describe, expect, test } from "bun:test";
import { buildWhereClause, buildBaseQuery, escapeSqlString, sanitizePathSegment } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildWhereClause", () => {
  test("returns '1=1' when no arguments are provided", () => {
    expect(buildWhereClause()).toBe("1=1");
  });

  test("returns valid clause for agencyCode", () => {
    expect(buildWhereClause("TEST")).toBe("agency_code = 'TEST'");
  });

  test("returns valid clause for docketId", () => {
    expect(buildWhereClause(undefined, "DOCKET-123")).toBe("docket_id = 'DOCKET-123'");
  });

  test("returns valid clause for both agencyCode and docketId", () => {
    expect(buildWhereClause("TEST", "DOCKET-123")).toBe(
      "agency_code = 'TEST' AND docket_id = 'DOCKET-123'"
    );
  });

  test("escapes single quotes in agencyCode to prevent SQL injection", () => {
    const maliciousCode = "TEST' OR 1=1 --";
    expect(buildWhereClause(maliciousCode)).toBe("agency_code = 'TEST'' OR 1=1 --'");
  });

  test("escapes single quotes in docketId", () => {
    const maliciousDocket = "DOCKET'--";
    expect(buildWhereClause(undefined, maliciousDocket)).toBe("docket_id = 'DOCKET''--'");
  });
});

describe("buildBaseQuery", () => {
  test("generates correct path with all parameters", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "TEST", "DOCKET-123");
    expect(query).toContain("s3://mirrulations/raw-data/TEST/DOCKET-123/text-DOCKET-123/docket/*.json");
  });

  test("sanitizes path segments to prevent traversal", () => {
     const query = buildBaseQuery(RegulationsDataTypes.Dockets, "TEST/..", "DOCKET");
     // Expect "TEST" and "DOCKET" (slash and dots removed by sanitization)
     expect(query).toContain("s3://mirrulations/raw-data/TEST/DOCKET/text-DOCKET/docket/*.json");
  });
});
