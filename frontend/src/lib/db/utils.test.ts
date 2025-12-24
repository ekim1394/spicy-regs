import { expect, test, describe } from "bun:test";
import { buildWhereClause, buildBaseQuery } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildWhereClause", () => {
  test("returns '1=1' when no arguments are provided", () => {
    expect(buildWhereClause()).toBe("1=1");
  });

  test("returns agency condition when only agencyCode is provided", () => {
    const result = buildWhereClause("EPA");
    expect(result).toBe("agency_code = 'EPA'");
  });

  test("returns docket condition when only docketId is provided", () => {
    const result = buildWhereClause(undefined, "EPA-HQ-OAR-2023-0001");
    expect(result).toBe("docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  test("returns both conditions joined by AND when both are provided", () => {
    const result = buildWhereClause("EPA", "EPA-HQ-OAR-2023-0001");
    expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  test("handles lowercase inputs by uppercasing them", () => {
    const result = buildWhereClause("epa", "epa-hq-oar-2023-0001");
    expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  test("handles empty strings as undefined", () => {
      // Current implementation might treat empty strings as values to search for if not checked
      // let's see how it behaves. If it generates `agency_code = ''`, that might be valid SQL but likely not intended if it means "all agencies".
      // However, the function signature and usage implies these are filters.
      // Based on the code: if (agencyCode) check will fail for empty string.
      expect(buildWhereClause("")).toBe("1=1");
  });
});

describe("buildBaseQuery", () => {
  test("generates correct path for Dockets with no filters", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets);
    expect(query).toContain("s3://mirrulations/raw-data/*/*/*/docket/*.json");
    expect(query).toContain("FROM read_text('s3://mirrulations/raw-data/*/*/*/docket/*.json')");
  });

  test("generates correct path for Dockets with agencyCode", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA");
    expect(query).toContain("s3://mirrulations/raw-data/EPA/*/*/docket/*.json");
  });

  test("generates correct path for Dockets with agencyCode and docketId", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA", "EPA-HQ-2023");
    expect(query).toContain("s3://mirrulations/raw-data/EPA/EPA-HQ-2023/text-EPA-HQ-2023/docket/*.json");
  });

  test("includes required fields for Dockets", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets);
      expect(query).toContain("agency_code");
      expect(query).toContain("docket_id");
      expect(query).toContain("json_extract(f.content, '$.data.attributes.docketType') as docket_type");
  });
});
