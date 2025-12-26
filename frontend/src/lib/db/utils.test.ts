import { describe, expect, test } from "bun:test";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("buildBaseQuery", () => {
  test("generates correct query for Dockets with agencyCode and docketId", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA", "EPA-HQ-2023-0001");
    expect(query).toContain("s3://mirrulations/raw-data/EPA/EPA-HQ-2023-0001/text-EPA-HQ-2023-0001/docket/*.json");
    expect(query).toContain("json_extract(f.content, '$.data.attributes.docketType') as docket_type");
  });

  test("generates correct query for Comments with agencyCode only", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Comments, "EPA");
    expect(query).toContain("s3://mirrulations/raw-data/EPA/*/*/comments/*.json");
    expect(query).toContain("json_extract(f.content, '$.data.id') as comment_id");
  });

  test("generates correct query for Documents with no filters", () => {
    const query = buildBaseQuery(RegulationsDataTypes.Documents);
    expect(query).toContain("s3://mirrulations/raw-data/*/*/*/documents/*.json");
    expect(query).toContain("json_extract(f.content, '$.data.id') as document_id");
  });
});

describe("buildWhereClause", () => {
  test("generates correct WHERE clause with agencyCode and docketId", () => {
    const where = buildWhereClause("EPA", "EPA-HQ-2023-0001");
    expect(where).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-2023-0001'");
  });

  test("generates correct WHERE clause with agencyCode only", () => {
    const where = buildWhereClause("EPA");
    expect(where).toBe("agency_code = 'EPA'");
  });

  test("generates correct WHERE clause with docketId only", () => {
    const where = buildWhereClause(undefined, "EPA-HQ-2023-0001");
    expect(where).toBe("docket_id = 'EPA-HQ-2023-0001'");
  });

  test("generates '1=1' when no filters provided", () => {
    const where = buildWhereClause();
    expect(where).toBe("1=1");
  });
});
