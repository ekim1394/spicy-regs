import { expect, test, describe } from "bun:test";
import { buildBaseQuery, buildWhereClause, escapeSqlString } from "./utils";
import { RegulationsDataTypes } from "./models";

describe("db/utils", () => {
  describe("escapeSqlString", () => {
    test("does not change safe strings", () => {
      expect(escapeSqlString("safe")).toBe("safe");
    });

    test("escapes single quotes", () => {
      expect(escapeSqlString("O'Reilly")).toBe("O''Reilly");
    });

    test("escapes multiple single quotes", () => {
      expect(escapeSqlString("'test'")).toBe("''test''");
    });
  });

  describe("buildBaseQuery", () => {
    test("constructs query for Dockets with agencyCode and docketId", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA", "EPA-HQ-OAR-2021-0001");
      expect(query).toContain("s3://mirrulations/raw-data/EPA/EPA-HQ-OAR-2021-0001/text-EPA-HQ-OAR-2021-0001/docket/*.json");
    });

    test("constructs query for Dockets with only agencyCode", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, "EPA");
      expect(query).toContain("s3://mirrulations/raw-data/EPA/*/*/docket/*.json");
    });

    test("constructs query for Dockets with no filters", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets);
      // Corrected expectation: 3 wildcards to match raw-data/AGENCY/DOCKET/TEXT-DOCKET/
      expect(query).toContain("s3://mirrulations/raw-data/*/*/*/docket/*.json");
    });

    test("escapes agencyCode in path", () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, "O'Reilly");
      expect(query).toContain("s3://mirrulations/raw-data/O''Reilly/*/*/docket/*.json");
    });
  });

  describe("buildWhereClause", () => {
    test("returns 1=1 when no filters provided", () => {
      const clause = buildWhereClause();
      expect(clause).toBe("1=1");
    });

    test("adds agency_code filter", () => {
      const clause = buildWhereClause("EPA");
      expect(clause).toBe("agency_code = 'EPA'");
    });

    test("adds docket_id filter", () => {
      const clause = buildWhereClause(undefined, "docket-1");
      expect(clause).toBe("docket_id = 'DOCKET-1'");
    });

    test("combines filters with AND", () => {
      const clause = buildWhereClause("EPA", "docket-1");
      expect(clause).toBe("agency_code = 'EPA' AND docket_id = 'DOCKET-1'");
    });

    test("safely handles single quotes in agencyCode", () => {
      const clause = buildWhereClause("O'Reilly");
      // Now expects the escaped version
      expect(clause).toBe("agency_code = 'O''REILLY'");
    });

    test("safely handles single quotes in docketId", () => {
      const clause = buildWhereClause(undefined, "docket'1");
      expect(clause).toBe("docket_id = 'DOCKET''1'");
    });
  });
});
