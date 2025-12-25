import { describe, it, expect } from "bun:test";
import { buildWhereClause, buildBaseQuery } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildWhereClause", () => {
  it("should prevent SQL injection in agencyCode", () => {
    const maliciousInput = "IRS'; DROP TABLE users; --";
    const result = buildWhereClause(maliciousInput, undefined);

    // Currently (VULNERABLE), it produces: agency_code = 'IRS'; DROP TABLE USERS; --'
    // We expect it to be escaped properly.

    // We are asserting for the SECURE behavior, so this test should FAIL initially.
    expect(result).not.toContain("IRS';");
    expect(result).toContain("IRS'';");
  });

  it("should prevent SQL injection in docketId", () => {
    const maliciousInput = "DOCKET'; DROP TABLE users; --";
    const result = buildWhereClause(undefined, maliciousInput);

    expect(result).not.toContain("DOCKET';");
    expect(result).toContain("DOCKET'';");
  });
});

describe("buildBaseQuery", () => {
  it("should prevent SQL injection in s3 path via agencyCode", () => {
    const maliciousInput = "IRS'); DROP TABLE users; --";
    // We need a dummy dataType, assuming 'Dockets' exists or similar.
    // I need to import RegulationsDataTypes to use it.
    // Based on memory, RegulationsDataTypes.Dockets is likely.

    const result = buildBaseQuery(RegulationsDataTypes.Dockets, maliciousInput, "docket1");

    // If vulnerable: read_text('s3://.../IRS'); DROP TABLE USERS; --/...')
    // We expect the single quote to be escaped in the SQL string.

    expect(result).not.toContain("IRS');");
    expect(result).toContain("IRS'');");
  });
});
