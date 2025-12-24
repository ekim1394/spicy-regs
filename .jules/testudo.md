# Testudo's Journal

## 2025-02-12 - Initializing Testing Infrastructure
**Issue:** The `frontend` directory lacked any automated testing infrastructure or scripts, relying entirely on manual verification.
**Learning:** Even in small Next.js/Bun projects, installing a lightweight runner like `vitest` immediately exposes assumptions about utility functions (e.g., S3 path construction).
**Action:** Always check `package.json` for test scripts first. If missing, install `vitest` as it requires zero config for TypeScript support.

## 2025-02-12 - Verifying Query Construction
**Issue:** `buildBaseQuery` and `buildWhereClause` were untested critical paths for data retrieval, leading to potential regressions in S3 path generation.
**Learning:** Testing string interpolation functions requires precise assertions on the generated output structure to catch format mismatches (e.g., `docket/*.json` vs `docket-*.json`).
**Action:** Use `expect(output).toContain(substring)` for SQL generation tests rather than strict equality if the exact whitespace/formatting is variable, but be strict about critical path segments.
