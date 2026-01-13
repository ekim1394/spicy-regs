import { describe, it, expect } from "bun:test";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("db/utils", () => {
  describe("buildWhereClause", () => {
    it("should build a where clause with both agencyCode and docketId", () => {
      const result = buildWhereClause("EPA", "EPA-HQ-2023");
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-2023'");
    });

    it("should build a where clause with only agencyCode", () => {
      const result = buildWhereClause("EPA");
      expect(result).toBe("agency_code = 'EPA'");
    });

    it("should build a where clause with only docketId", () => {
      const result = buildWhereClause(undefined, "EPA-HQ-2023");
      expect(result).toBe("docket_id = 'EPA-HQ-2023'");
    });

    it("should return '1=1' when no params provided", () => {
      const result = buildWhereClause();
      expect(result).toBe("1=1");
    });

    it("should handle mixed casing by uppercasing values", () => {
      const result = buildWhereClause("epa", "epa-hq-2023");
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-2023'");
    });
  });

  describe("buildBaseQuery", () => {
    it("should build query for specific docket", () => {
      const result = buildBaseQuery(
        RegulationsDataTypes.Dockets,
        "EPA",
        "EPA-HQ-2023"
      );
      expect(result).toContain(
        "s3://mirrulations/raw-data/EPA/EPA-HQ-2023/text-EPA-HQ-2023/docket/*.json"
      );
    });

    it("should build query for agency wildcard", () => {
      const result = buildBaseQuery(RegulationsDataTypes.Comments, "EPA");
      expect(result).toContain(
        "s3://mirrulations/raw-data/EPA/*/*/comments/*.json"
      );
    });

    it("should build query for global wildcard", () => {
      const result = buildBaseQuery(RegulationsDataTypes.Documents);
      expect(result).toContain(
        "s3://mirrulations/raw-data/*/*/*/documents/*.json"
      );
    });
  });
});
