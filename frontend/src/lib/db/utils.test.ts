
import { describe, expect, test } from "bun:test";
import { buildWhereClause } from "./utils";

describe("buildWhereClause", () => {
  test("should build where clause with agencyCode", () => {
    const clause = buildWhereClause("EPA");
    expect(clause).toBe("agency_code = 'EPA'");
  });

  test("should build where clause with docketId", () => {
    const clause = buildWhereClause(undefined, "EPA-HQ-OAR-2023-0001");
    expect(clause).toBe("docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  test("should build where clause with both", () => {
    const clause = buildWhereClause("EPA", "EPA-HQ-OAR-2023-0001");
    expect(clause).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
  });

  test("should return 1=1 if no params", () => {
    const clause = buildWhereClause();
    expect(clause).toBe("1=1");
  });

  test("should prevent sql injection if escaped", () => {
      const clause = buildWhereClause("EPA' OR 1=1 --");
      expect(clause).toBe("agency_code = 'EPA'' OR 1=1 --'");
  });
});
