
import { describe, expect, test } from "bun:test";
import { buildBaseQuery, buildWhereClause, escapeSqlString, sanitizePathSegment } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("db/utils", () => {
  describe("escapeSqlString", () => {
    test("doubles single quotes", () => {
      expect(escapeSqlString("O'Reilly")).toBe("O''Reilly");
    });

    test("leaves safe strings alone", () => {
        expect(escapeSqlString("EPA")).toBe("EPA");
    });
  });

  describe("sanitizePathSegment", () => {
      test("removes non-alphanumeric chars", () => {
          expect(sanitizePathSegment("../evil")).toBe("evil");
      });

      test("allows alphanumeric and dashes", () => {
          expect(sanitizePathSegment("EPA-2020-0001")).toBe("EPA-2020-0001");
      });
  });

  describe("buildWhereClause", () => {
    test("returns 1=1 when no args provided", () => {
      expect(buildWhereClause()).toBe("1=1");
    });

    test("builds clause for agencyCode", () => {
      expect(buildWhereClause("epa")).toBe("agency_code = 'EPA'");
    });

    test("builds clause for docketId", () => {
      expect(buildWhereClause(undefined, "epa-2020-0001")).toBe("docket_id = 'EPA-2020-0001'");
    });

    test("builds clause for both", () => {
      expect(buildWhereClause("epa", "epa-2020-0001")).toBe(
        "agency_code = 'EPA' AND docket_id = 'EPA-2020-0001'"
      );
    });

    test("safely handles SQL injection attempts", () => {
      const maliciousInput = "'; DROP TABLE students; --";
      // Should now be escaped
      // "'; DROP TABLE students; --" -> uppercased -> "'; DROP TABLE STUDENTS; --" -> escaped -> "''; DROP TABLE STUDENTS; --"
      expect(buildWhereClause(maliciousInput)).toBe("agency_code = '''; DROP TABLE STUDENTS; --'");
    });
  });

  describe("buildBaseQuery", () => {
    test("builds query for dockets with agencyCode", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, "epa");
      expect(query).toContain("s3://mirrulations/raw-data/epa/*/*/docket/*.json");
    });

    test("builds query for dockets with agencyCode and docketId", () => {
        const query = buildBaseQuery(RegulationsDataTypes.Dockets, "epa", "epa-123");
        expect(query).toContain("s3://mirrulations/raw-data/epa/epa-123/text-epa-123/docket/*.json");
    });

    test("safely handles path injection attempts", () => {
        const query = buildBaseQuery(RegulationsDataTypes.Dockets, "../evil");
        // Should remove ../ and just use "evil"
        expect(query).toContain("s3://mirrulations/raw-data/evil/*/*/docket/*.json");
        expect(query).not.toContain("../");
    });
  });
});
