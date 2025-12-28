## 2024-05-23 - DuckDB WASM SQL Injection
**Vulnerability:** Raw SQL string concatenation used for queries in DuckDB WASM, allowing SQL injection via `agencyCode` and `docketId` parameters.
**Learning:** DuckDB WASM's `query` method (as implemented in this project's `runQuery` wrapper) does not support native parameterized queries in the same way strictly-typed SQL clients do, leading to developers defaulting to string interpolation.
**Prevention:** Always use a dedicated escaping helper (like `escapeSqlString`) when building SQL strings for DuckDB WASM if native parameters are unavailable or difficult to integrate. Ideally, refactor to use prepared statements if possible in the future.
