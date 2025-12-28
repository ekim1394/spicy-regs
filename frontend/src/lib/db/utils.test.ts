import { describe, it, expect } from "bun:test";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildBaseQuery", () => {
  it("should build a query for dockets with no agency or docket ID", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets);
    // The path pattern for Dockets is "docket/*.json"
    expect(query).toContain("s3://mirrulations/raw-data/*/*/docket/*.json");
    expect(query).toContain("f.content AS raw_json");
  });

  it("should build a query for comments with agency code only", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Comments, "NASA");
    // The path pattern for Comments is "comments/*.json"
    expect(query).toContain("s3://mirrulations/raw-data/NASA/*/*/comments/*.json");
  });

  it("should build a query for documents with agency code and docket ID", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Documents, "NASA", "NASA-2023-0001");
    // The path pattern for Documents is "documents/*.json"
    expect(query).toContain("s3://mirrulations/raw-data/NASA/NASA-2023-0001/text-NASA-2023-0001/documents/*.json");
  });
});

describe("buildWhereClause", () => {
  it("should return '1=1' when no arguments are provided", () => {
    expect(buildWhereClause()).toBe("1=1");
  });

  it("should filter by agency code and uppercase it", () => {
    const clause = buildWhereClause("nasa");
    expect(clause).toBe("agency_code = 'NASA'");
  });

  it("should filter by docket ID and uppercase it", () => {
    const clause = buildWhereClause(undefined, "nasa-2023-0001");
    expect(clause).toBe("docket_id = 'NASA-2023-0001'");
  });

  it("should filter by both agency code and docket ID", () => {
    const clause = buildWhereClause("nasa", "nasa-2023-0001");
    expect(clause).toBe("agency_code = 'NASA' AND docket_id = 'NASA-2023-0001'");
  });
});
