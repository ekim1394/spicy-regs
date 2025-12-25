import { describe, expect, test } from "bun:test";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildBaseQuery", () => {
  test("generates correct query for Dockets with agencyCode and docketId", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "USCG", "USCG-2023-0001");
    expect(query).toContain("s3://mirrulations/raw-data/USCG/USCG-2023-0001/text-USCG-2023-0001/docket/*.json");
    expect(query).toContain("split_part(filename, '/', 5) as agency_code");
    expect(query).toContain("split_part(filename, '/', 6) as docket_id");
  });

  test("generates correct query for Dockets with agencyCode only", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "USCG");
    expect(query).toContain("s3://mirrulations/raw-data/USCG/*/*/docket/*.json");
  });

  test("generates correct query for Dockets with no agency or docket (global)", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets);
    // This expects the BUGFIXED version (3 wildcards)
    // If the code is buggy, this test will fail, confirming the bug.
    // If I wanted to assert current behavior, I'd use 2 wildcards.
    // Testudo philosophy: Write reliable tests. A test asserting broken behavior is only useful for regression of bugs?
    // I will write what I EXPECT it to be.
    expect(query).toContain("s3://mirrulations/raw-data/*/*/*/docket/*.json");
  });
});

describe("buildWhereClause", () => {
  test("generates WHERE clause with agencyCode", () => {
    const clause = buildWhereClause("USCG");
    expect(clause).toBe("agency_code = 'USCG'");
  });

  test("generates WHERE clause with docketId", () => {
    const clause = buildWhereClause(undefined, "USCG-2023-0001");
    expect(clause).toBe("docket_id = 'USCG-2023-0001'");
  });

  test("generates WHERE clause with agencyCode and docketId", () => {
    const clause = buildWhereClause("USCG", "USCG-2023-0001");
    expect(clause).toBe("agency_code = 'USCG' AND docket_id = 'USCG-2023-0001'");
  });

  test("generates default WHERE clause when no params provided", () => {
    const clause = buildWhereClause();
    expect(clause).toBe("1=1");
  });

  test("handles lowercase input by uppercasing", () => {
    const clause = buildWhereClause("uscg", "uscg-2023-0001");
    expect(clause).toBe("agency_code = 'USCG' AND docket_id = 'USCG-2023-0001'");
  });
});
