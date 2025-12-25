# Testudo's Journal

## 2024-10-24 - Missing Wildcard in Base Query
**Issue:** `buildBaseQuery` generated an incorrect S3 path when no agency code was provided, missing a directory wildcard level (`text-docket`).
**Learning:** Logic branches that handle path construction (e.g. with vs without optional params) must be tested for structural consistency (depth of path) to avoid "off-by-one" directory errors.
**Action:** Added unit tests for all branches of `buildBaseQuery` to ensure path structure is consistent with the known S3 schema.
