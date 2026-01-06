# Sentinel Journal

## 2024-05-24 - SQL Injection in Dynamic Query Construction
**Vulnerability:** Found `buildWhereClause` and `searchResources` functions constructing SQL queries by directly interpolating string arguments without sanitization. This allows SQL injection if arguments like `agencyCode` contain single quotes.
**Learning:** Even when using "modern" data stacks or local DBs (DuckDB), if queries are built as strings instead of using parameterized query bindings provided by the driver, manual escaping is required. The `duckdb-wasm` or `motherduck` client usage here seems to rely on string queries.
**Prevention:** Always use parameterized queries if the driver supports it. If not, centralize an escaping function (like `escapeSqlString`) and enforce its use in all query builders. Added `escapeSqlString` that doubles single quotes (`' -> ''`), which is standard for SQL.
