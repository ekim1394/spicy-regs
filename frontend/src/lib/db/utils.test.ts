import { describe, it, expect } from "bun:test";
import { buildBaseQuery, buildWhereClause } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("Database Utils", () => {
  describe("buildBaseQuery", () => {
    it("should build correct path for Dockets with no filters", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets);
      expect(query).toContain("s3://mirrulations/raw-data/*/*/*/docket/*.json");
    });

    it("should build correct path for Comments with agency filter", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Comments, "IRS");
      expect(query).toContain("s3://mirrulations/raw-data/IRS/*/*/comments/*.json");
    });

    it("should build correct path for Documents with agency and docket filters", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Documents, "IRS", "IRS-2023-0001");
      expect(query).toContain("s3://mirrulations/raw-data/IRS/IRS-2023-0001/text-IRS-2023-0001/documents/*.json");
    });
  });

  describe("buildWhereClause", () => {
    it("should return 1=1 when no filters provided", () => {
      expect(buildWhereClause()).toBe("1=1");
    });

    it("should filter by agency code (uppercased)", () => {
      expect(buildWhereClause("irs")).toBe("agency_code = 'IRS'");
    });

    it("should filter by docket id (uppercased)", () => {
      expect(buildWhereClause(undefined, "irs-2023-0001")).toBe("docket_id = 'IRS-2023-0001'");
    });

    it("should filter by both agency code and docket id", () => {
      expect(buildWhereClause("irs", "irs-2023-0001")).toBe("agency_code = 'IRS' AND docket_id = 'IRS-2023-0001'");
    });
  });
});
