import { expect, test, describe } from "bun:test";
import { buildWhereClause } from "./utils";

describe("buildWhereClause", () => {
  test("returns 1=1 when no arguments are provided", () => {
    expect(buildWhereClause()).toBe("1=1");
  });

  test("filters by agencyCode correctly", () => {
    expect(buildWhereClause("abc")).toBe("agency_code = 'ABC'");
  });

  test("filters by docketId correctly", () => {
    expect(buildWhereClause(undefined, "doc-123")).toBe("docket_id = 'DOC-123'");
  });

  test("filters by both agencyCode and docketId", () => {
    expect(buildWhereClause("abc", "doc-123")).toBe("agency_code = 'ABC' AND docket_id = 'DOC-123'");
  });

  test("sanitizes single quotes in agencyCode to prevent SQL injection", () => {
    const input = "O'Brien";
    // Current behavior (potentially unsafe) would produce: agency_code = 'O'BRIEN'
    // Desired behavior (safe) should produce: agency_code = 'O''BRIEN'
    // or handle it in a way that doesn't break SQL syntax.
    // The current implementation uppercases, so "O'Brien" -> "O'BRIEN".
    // If we escape, it should be "O''BRIEN".
    expect(buildWhereClause(input)).toBe("agency_code = 'O''BRIEN'");
  });

  test("sanitizes single quotes in docketId to prevent SQL injection", () => {
    const input = "doc'123";
    expect(buildWhereClause(undefined, input)).toBe("docket_id = 'DOC''123'");
  });

  test("handles malicious injection attempt", () => {
    // Input: ' OR 1=1 --
    // Uppercase: ' OR 1=1 --
    // Unsafe: ' ' OR 1=1 -- '
    // Safe: ' '' OR 1=1 -- '
    const input = "' OR 1=1 --";
    expect(buildWhereClause(input)).toBe("agency_code = ''' OR 1=1 --'");
  });
});
