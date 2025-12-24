import { describe, it, expect } from 'vitest';
import { buildWhereClause, buildBaseQuery } from './utils';
import { RegulationsDataTypes } from './models';

describe('buildWhereClause', () => {
  it('returns "1=1" when no arguments are provided', () => {
    expect(buildWhereClause()).toBe('1=1');
  });

  it('filters by agencyCode', () => {
    expect(buildWhereClause('epa')).toBe("agency_code = 'EPA'");
  });

  it('filters by docketId', () => {
    expect(buildWhereClause(undefined, 'epa-2023-0001')).toBe("docket_id = 'EPA-2023-0001'");
  });

  it('filters by both agencyCode and docketId', () => {
    expect(buildWhereClause('epa', 'epa-2023-0001')).toBe("agency_code = 'EPA' AND docket_id = 'EPA-2023-0001'");
  });

  it('handles case insensitivity for agencyCode', () => {
    expect(buildWhereClause('EpA')).toBe("agency_code = 'EPA'");
  });
});

describe('buildBaseQuery', () => {
  it('generates correct query for Dockets', () => {
    const query = buildBaseQuery(RegulationsDataTypes.Dockets, 'EPA');
    expect(query).toContain("s3://mirrulations/raw-data/EPA/*/*/docket/*.json");
    expect(query).toContain("SELECT");
    expect(query).toContain("agency_code");
    expect(query).toContain("docket_id");
  });

  it('generates correct query for Comments', () => {
    const query = buildBaseQuery(RegulationsDataTypes.Comments, 'EPA', 'EPA-HQ-OAR-2023-0001');
    expect(query).toContain("s3://mirrulations/raw-data/EPA/EPA-HQ-OAR-2023-0001/text-EPA-HQ-OAR-2023-0001/comments/*.json");
  });

  it('generates correct query for Documents with no agency or docket filter', () => {
    const query = buildBaseQuery(RegulationsDataTypes.Documents);
    // Based on the code in utils.ts: path = `s3://mirrulations/raw-data/*/*/${mapping.path_pattern}`;
    // So it should be `s3://mirrulations/raw-data/*/*/documents/*.json`
    expect(query).toContain("s3://mirrulations/raw-data/*/*/documents/*.json");
  });
});
