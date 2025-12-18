import { describe, it, expect } from 'vitest';
import { buildBaseQuery, buildWhereClause } from './utils';
import { RegulationsDataTypes } from './models';

describe('db/utils', () => {
  describe('buildWhereClause', () => {
    it('should return "1=1" when no parameters are provided', () => {
      const result = buildWhereClause();
      expect(result).toBe('1=1');
    });

    it('should return agency_code clause when only agencyCode is provided', () => {
      const result = buildWhereClause('EPA');
      expect(result).toBe("agency_code = 'EPA'");
    });

    it('should return docket_id clause when only docketId is provided', () => {
      const result = buildWhereClause(undefined, 'EPA-HQ-OAR-2023-0001');
      expect(result).toBe("docket_id = 'EPA-HQ-OAR-2023-0001'");
    });

    it('should return both clauses joined by AND when both are provided', () => {
      const result = buildWhereClause('EPA', 'EPA-HQ-OAR-2023-0001');
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
    });

    it('should uppercase inputs', () => {
      const result = buildWhereClause('epa', 'epa-hq-oar-2023-0001');
      expect(result).toBe("agency_code = 'EPA' AND docket_id = 'EPA-HQ-OAR-2023-0001'");
    });
  });

  describe('buildBaseQuery', () => {
    // Helper to extract the path from the query for easier assertion
    const extractPath = (query: string) => {
      const match = query.match(/FROM read_text\('([^']+)'\)/);
      return match ? match[1] : null;
    };

    it('should build correct path for all wildcard query', () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets);
      const path = extractPath(query);
      // Source uses `s3://mirrulations/raw-data/*/*/${mapping.path_pattern}`
      expect(path).toBe('s3://mirrulations/raw-data/*/*/docket/*.json');
    });

    it('should build correct path for agency wildcard query', () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, 'EPA');
      const path = extractPath(query);
      // Source uses `s3://mirrulations/raw-data/${agencyCode}/*/*/${mapping.path_pattern}`
      expect(path).toBe('s3://mirrulations/raw-data/EPA/*/*/docket/*.json');
    });

    it('should build correct path for specific docket query', () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets, 'EPA', 'EPA-HQ-OAR-2023-0001');
      const path = extractPath(query);
      // Logic from source: `s3://mirrulations/raw-data/${agencyCode}/${docketId}/text-${docketId}/${mapping.path_pattern}`
      expect(path).toBe('s3://mirrulations/raw-data/EPA/EPA-HQ-OAR-2023-0001/text-EPA-HQ-OAR-2023-0001/docket/*.json');
    });

    it('should select correct fields for DOCKETS', () => {
      const query = buildBaseQuery(RegulationsDataTypes.Dockets);
      expect(query).toContain('f.content AS raw_json');
      expect(query).toContain('agency_code');
      expect(query).toContain('docket_id');
      expect(query).toContain('year');
    });
  });
});
