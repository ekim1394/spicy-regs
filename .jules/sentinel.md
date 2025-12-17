## 2024-05-23 - SQL Injection in DuckDB-WASM
**Vulnerability:** Found critical SQL injection vulnerability in `frontend/src/lib/db/service.ts` where user input was interpolated directly into SQL queries. The application uses DuckDB-WASM.
**Learning:** `duckdb-wasm` supports prepared statements via `conn.prepare(sql)` and `stmt.query(...params)`, but the existing wrapper `runQuery` only supported raw SQL strings. The common pattern of `replace(/'/g, "''")` is insufficient for preventing SQL injection.
**Prevention:** Always use parameterized queries. I updated `runQuery` to support params and refactored `buildWhereClause` to return parameters alongside the SQL clause.
