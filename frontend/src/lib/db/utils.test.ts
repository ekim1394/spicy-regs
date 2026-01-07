import { describe, expect, it } from "bun:test";
import { RegulationsDataTypes } from "./models";
import { buildBaseQuery, buildWhereClause } from "./utils";

describe("buildBaseQuery", () => {
  it("should generate correct query for all data types with agency and docket", () => {
    const query = buildBaseQuery(
      RegulationsDataTypes.Dockets,
      "EPA",
      "EPA-HQ-OAR-2023-0001"
    );
    expect(query).toContain("s3://mirrulations/raw-data/EPA/EPA-HQ-OAR-2023-0001/text-EPA-HQ-OAR-2023-0001/docket/*.json");
    expect(query).toContain("SELECT");
    expect(query).toContain("FROM read_text(");
  });

  it("should generate correct query for only agency", () => {
    const query = buildBaseQuery(
      RegulationsDataTypes.Documents,
      "EPA"
    );
    expect(query).toContain("s3://mirrulations/raw-data/EPA/*/*/documents/*.json");
  });

  it("should generate correct query for no filters (wildcard)", () => {
    const query = buildBaseQuery(
      RegulationsDataTypes.Comments
    );
    // The implementation uses only 2 wildcards before the pattern when no filters are present
    // path = `s3://mirrulations/raw-data/*/*/${mapping.path_pattern}`;
    expect(query).toContain("s3://mirrulations/raw-data/*/*/comments/*.json");
  });
});

describe("buildWhereClause", () => {
  it("should generate correct WHERE clause for agency and docket", () => {
    const where = buildWhereClause("EPA", "EPA-HQ-OAR-2023-0001");
    expect(where).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  it("should generate correct WHERE clause for only agency", () => {
    const where = buildWhereClause("EPA");
    expect(where).toBe("agency_code = 'EPA'");
  });

  it("should generate correct WHERE clause for only docket", () => {
    const where = buildWhereClause(undefined, "EPA-HQ-OAR-2023-0001");
    expect(where).toBe("docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  it("should generate correct WHERE clause for no filters", () => {
    const where = buildWhereClause();
    expect(where).toBe("1=1");
  });

  it("should handle mixed case inputs by uppercasing", () => {
    const where = buildWhereClause("epa", "epa-hq-oar-2023-0001");
    expect(where).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
  });
});
