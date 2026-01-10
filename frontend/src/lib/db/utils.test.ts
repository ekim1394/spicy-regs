
import { describe, expect, test } from "bun:test";
import { buildWhereClause, buildBaseQuery } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("utils", () => {
  describe("buildWhereClause", () => {
    test("should escape single quotes in agencyCode", () => {
      const result = buildWhereClause("O'Neil", "DOCKET-1");
      expect(result).toContain("agency_code = 'O''NEIL'");
    });

    test("should escape single quotes in docketId", () => {
      const result = buildWhereClause("NASA", "DOCKET-'OR 1=1--");
      expect(result).toContain("docket_id = 'DOCKET-''OR 1=1--'");
    });
  });

  describe("buildBaseQuery", () => {
    test("should sanitize agencyCode in path", () => {
      // Testing that special characters are stripped or handled
      // This expectation depends on how we implement sanitizePathSegment
      // For now, let's assume we want to prevent path traversal
      const result = buildBaseQuery(RegulationsDataTypes.Dockets, "../bad", "docket1");
      expect(result).not.toContain("../bad");
      // Ideally it should throw or sanitize. Let's assume sanitization for now.
    });
  });
});
