/**
 * Tests for database utility functions.
 *
 * Note: This project uses Bun as the runtime and test runner.
 * We import from "bun:test" explicitly.
 */
import { expect, test, describe } from "bun:test";
import { buildWhereClause, escapeSqlString } from "./utils";

describe("escapeSqlString", () => {
  test("escapes single quotes by doubling them", () => {
    expect(escapeSqlString("O'Reilly")).toBe("O''Reilly");
    expect(escapeSqlString("' OR 1=1; --")).toBe("'' OR 1=1; --");
  });

  test("returns original string if no quotes", () => {
    expect(escapeSqlString("safe")).toBe("safe");
  });

  test("handles non-string input safely", () => {
      // @ts-ignore
      expect(escapeSqlString(null)).toBe(null);
       // @ts-ignore
      expect(escapeSqlString(undefined)).toBe(undefined);
  })
});

describe("buildWhereClause", () => {
  /*
   * Note: While parameterized queries are preferred for security,
   * the current implementation uses manual escaping via `escapeSqlString`
   * as an immediate fix for the SQL injection vulnerability.
   * Future refactoring should consider migrating to parameterized queries if the DB driver supports it.
   */
  test("escapes SQL injection attempts in agencyCode", () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const clause = buildWhereClause(maliciousInput, "some-id");

    // The resulting string should have the quote doubled.
    expect(clause).toContain(`agency_code = '${escapeSqlString(maliciousInput.toUpperCase())}'`);
  });

  test("escapes SQL injection attempts in docketId", () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const clause = buildWhereClause("some-agency", maliciousInput);

      expect(clause).toContain(`docket_id = '${escapeSqlString(maliciousInput.toUpperCase())}'`);
    });
});
