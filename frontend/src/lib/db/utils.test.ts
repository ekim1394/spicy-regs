import { describe, it, expect } from 'bun:test';
import { escapeSqlString, buildWhereClause, buildBaseQuery } from './utils';
import { RegulationsDataTypes } from './models';

describe('utils', () => {
  describe('escapeSqlString', () => {
    it('should escape single quotes', () => {
      const input = "O'Connor";
      const expected = "O''Connor";
      expect(escapeSqlString(input)).toBe(expected);
    });

    it('should handle strings without quotes', () => {
      const input = "SimpleString";
      expect(escapeSqlString(input)).toBe(input);
    });

    it('should handle empty strings', () => {
      expect(escapeSqlString("")).toBe("");
    });
  });

  describe('buildWhereClause', () => {
    it('should escape agencyCode', () => {
      const agencyCode = "AGEN'CY";
      const result = buildWhereClause(agencyCode);
      expect(result).toContain("agency_code = 'AGEN''CY'");
    });

    it('should escape docketId', () => {
      const docketId = "DOCKET'ID";
      const result = buildWhereClause(undefined, docketId);
      expect(result).toContain("docket_id = 'DOCKET''ID'");
    });
  });

  describe('buildBaseQuery', () => {
    it('should escape agencyCode in path', () => {
      const agencyCode = "AGEN'CY";
      const result = buildBaseQuery(RegulationsDataTypes.Dockets, agencyCode);
      expect(result).toContain("s3://mirrulations/raw-data/AGEN''CY/*/*/");
    });
  });
});
