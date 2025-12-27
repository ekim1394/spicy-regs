# Testudo's Journal

## 2025-02-12 - Missing Unit Tests for Critical Query Builders
**Issue:** The `buildBaseQuery` and `buildWhereClause` functions in `frontend/src/lib/db/utils.ts` were completely untested. These functions are responsible for constructing the S3 paths and SQL WHERE clauses used to fetch data. A regression here would silently break data retrieval or cause incorrect data to be loaded.
**Learning:** Pure functions that generate complex strings (like SQL or file paths) based on multiple inputs are high-value targets for unit testing because they are easy to isolate and prone to subtle logic errors (e.g., missing wildcards, incorrect string interpolation).
**Action:** Always verify that utility functions, especially those constructing queries or paths, have comprehensive unit tests covering all input permutations (e.g., with/without optional arguments).
