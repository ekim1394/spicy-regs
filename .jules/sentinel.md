## 2024-02-14 - Manual SQL Escaping in Query Builders
**Vulnerability:** SQL Injection in `buildWhereClause` and `buildBaseQuery`.
**Learning:** The application constructs SQL strings for DuckDB WASM/MotherDuck clients which may not support parameterized queries in all contexts (e.g. S3 path construction). We rely on manual string interpolation.
**Prevention:** Must use `escapeSqlString` helper to escape single quotes in all user inputs before interpolation.
