import { expect, test, describe } from "bun:test";
import { escapeSqlString, buildWhereClause, buildBaseQuery } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("db utils", () => {
  describe("escapeSqlString", () => {
    test("should return empty string for null/undefined/empty input", () => {
      // @ts-expect-error - Testing invalid input
      expect(escapeSqlString(null)).toBe("");
      // @ts-expect-error - Testing invalid input
      expect(escapeSqlString(undefined)).toBe("");
      expect(escapeSqlString("")).toBe("");
    });

    test("should escape single quotes by doubling them", () => {
      expect(escapeSqlString("O'Reilly")).toBe("O''Reilly");
      expect(escapeSqlString("'test'")).toBe("''test''");
    });

    test("should handle strings without quotes correctly", () => {
      expect(escapeSqlString("normal string")).toBe("normal string");
    });
  });

  describe("buildWhereClause", () => {
    test("should build a valid where clause with both parameters", () => {
      const result = buildWhereClause("EPA", "EPA-HQ-OAR-2023-0072");
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0072'");
    });

    test("should sanitize inputs in where clause", () => {
      const result = buildWhereClause("EPA'", "DOCKET'");
      expect(result).toBe("agency_code = 'EPA''' AND docket_id = 'DOCKET'''");
    });

    test("should handle missing docketId", () => {
      const result = buildWhereClause("EPA");
      expect(result).toBe("agency_code = 'EPA'");
    });

    test("should handle missing parameters", () => {
      expect(buildWhereClause()).toBe("1=1");
    });
  });

  describe("buildBaseQuery", () => {
    test("should build query with sanitized agency code in path", () => {
      const result = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA'");
      expect(result).toContain("s3://mirrulations/raw-data/EPA''/*/*/");
    });

    test("should build query with sanitized docket id in path", () => {
       const result = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA", "DOCKET'");
       expect(result).toContain("s3://mirrulations/raw-data/EPA/DOCKET''/text-DOCKET''/");
    });
  });
});
