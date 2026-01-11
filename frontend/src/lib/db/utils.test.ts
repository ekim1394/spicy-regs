import { describe, expect, test } from "bun:test";
import { buildWhereClause } from "./utils";

describe("db utils", () => {
  describe("buildWhereClause", () => {
    test("handles agencyCode only", () => {
      const result = buildWhereClause("EPA");
      expect(result).toBe("agency_code = 'EPA'");
    });

    test("handles docketId only", () => {
      const result = buildWhereClause(undefined, "EPA-2023-0001");
      expect(result).toBe("docket_id = 'EPA-2023-0001'");
    });

    test("handles both agencyCode and docketId", () => {
      const result = buildWhereClause("EPA", "EPA-2023-0001");
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-2023-0001'");
    });

    test("returns 1=1 when no inputs provided", () => {
      const result = buildWhereClause();
      expect(result).toBe("1=1");
    });

    test("escapes single quotes in agencyCode", () => {
      const result = buildWhereClause("O'Reilly");
      // Expecting standard SQL escaping (doubling the single quote)
      expect(result).toBe("agency_code = 'O''REILLY'");
    });

    test("escapes single quotes in docketId", () => {
        const result = buildWhereClause(undefined, "DOC'1");
        expect(result).toBe("docket_id = 'DOC''1'");
    });
  });
});
