import { expect, test, describe } from "bun:test";
import { buildWhereClause } from "./utils";

describe("db/utils", () => {
  describe("buildWhereClause", () => {
    test("should generate correct where clause for agencyCode", () => {
      const result = buildWhereClause("EPA");
      expect(result).toBe("agency_code = 'EPA'");
    });

    test("should generate correct where clause for agencyCode and docketId", () => {
      const result = buildWhereClause("EPA", "EPA-123");
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-123'");
    });

    test("should handle empty inputs", () => {
        expect(buildWhereClause()).toBe("1=1");
    });

    test("should escape single quotes to prevent SQL injection", () => {
      const result = buildWhereClause("EPA' OR 1=1 --");
      // We expect the single quote to be escaped (doubled)
      expect(result).toBe("agency_code = 'EPA'' OR 1=1 --'");
    });
  });
});
