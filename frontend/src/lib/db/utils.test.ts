import { describe, expect, test } from "bun:test";
import { buildWhereClause } from "./utils";

describe("buildWhereClause", () => {
  test("returns 1=1 when no arguments are provided", () => {
    expect(buildWhereClause()).toBe("1=1");
  });

  test("returns agency_code clause when only agencyCode is provided", () => {
    expect(buildWhereClause("TEST")).toBe("agency_code = 'TEST'");
  });

  test("returns docket_id clause when only docketId is provided", () => {
    expect(buildWhereClause(undefined, "DOCKET-1")).toBe("docket_id = 'DOCKET-1'");
  });

  test("returns both clauses combined with AND when both are provided", () => {
    expect(buildWhereClause("TEST", "DOCKET-1")).toBe(
      "agency_code = 'TEST' AND docket_id = 'DOCKET-1'"
    );
  });

  test("uppercases inputs", () => {
    expect(buildWhereClause("test", "docket-1")).toBe(
      "agency_code = 'TEST' AND docket_id = 'DOCKET-1'"
    );
  });

  test("escapes SQL injection characters by doubling single quotes", () => {
    const maliciousInput = "TEST' OR '1'='1";
    // Expected behavior: ' becomes ''
    // agency_code = 'TEST'' OR ''1''=''1'
    expect(buildWhereClause(maliciousInput)).toBe(
      "agency_code = 'TEST'' OR ''1''=''1'"
    );
  });
});
