## 2024-05-23 - SQL Injection via String Interpolation
**Vulnerability:** SQL injection in `buildWhereClause` and `searchResources` via direct interpolation of user inputs (`agencyCode`, `docketId`).
**Learning:** `toUpperCase()` is not a sufficient sanitizer for SQL injection. `duckdb-wasm` (at least the version/implementation used) does not easily support parameterized queries for all query types via the standard `query` method wrapper `runQuery` in this repo, leading to reliance on string concatenation.
**Prevention:** Implement and use a robust `escapeSqlString` function that doubles single quotes (standard SQL escaping) when parameterized queries are not feasible. Always test with payloads containing single quotes and SQL keywords.
