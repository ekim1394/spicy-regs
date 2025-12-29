import { describe, expect, test } from "bun:test";
import { buildWhereClause } from "./utils";

describe("buildWhereClause", () => {
  test("SECURITY: should prevent SQL injection via agencyCode", () => {
    const maliciousAgency = "CMS' OR 1=1 --";
    const where = buildWhereClause(maliciousAgency);
    // Should now be escaped: CMS'' OR 1=1 --
    expect(where).toContain("agency_code = 'CMS'' OR 1=1 --'");
    // Should NOT contain the unescaped quote
    expect(where).not.toContain("agency_code = 'CMS' OR");
  });

  test("SECURITY: should prevent SQL injection via docketId", () => {
    const maliciousDocket = "CMS-2024-001' OR '1'='1";
    const where = buildWhereClause(undefined, maliciousDocket);
    expect(where).toContain("docket_id = 'CMS-2024-001'' OR ''1''=''1'");
    expect(where).not.toContain("docket_id = 'CMS-2024-001' OR");
  });
});
