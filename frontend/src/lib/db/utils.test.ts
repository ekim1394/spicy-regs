
import { describe, expect, it } from "bun:test";
import { buildWhereClause, escapeSqlString } from "./utils";

describe("db utils", () => {
  describe("escapeSqlString", () => {
    it("should escape single quotes", () => {
      const input = "O'Reilly";
      const expected = "O''Reilly";
      expect(escapeSqlString(input)).toBe(expected);
    });

    it("should return the string as is if no single quotes", () => {
      const input = "Hello World";
      expect(escapeSqlString(input)).toBe(input);
    });
  });

  describe("buildWhereClause", () => {
    it("should build correct where clause with agencyCode", () => {
        const result = buildWhereClause("EPA");
        expect(result).toContain("agency_code = 'EPA'");
    });

    it("should escape agencyCode with quotes", () => {
        const result = buildWhereClause("O'Reilly");
        expect(result).toContain("agency_code = 'O''REILLY'");
    });

    it("should build correct where clause with docketId", () => {
        const result = buildWhereClause(undefined, "CMS-2023-0001");
        expect(result).toContain("docket_id = 'CMS-2023-0001'");
    });

    it("should escape docketId with quotes", () => {
        const result = buildWhereClause(undefined, "CMS-2023-'0001'");
        expect(result).toContain("docket_id = 'CMS-2023-''0001'''");
    });

    it("should handle both parameters", () => {
        const result = buildWhereClause("EPA", "CMS-2023-0001");
        expect(result).toContain("agency_code = 'EPA'");
        expect(result).toContain("docket_id = 'CMS-2023-0001'");
        expect(result).toContain(" AND ");
    });

    it("should return 1=1 when no parameters provided", () => {
        const result = buildWhereClause();
        expect(result).toBe("1=1");
    });
  });
});
