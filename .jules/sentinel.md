## 2024-05-23 - DuckDB WASM Parameterization Gap
**Vulnerability:** SQL Injection risk due to manual string concatenation.
**Learning:** The `runQuery` wrapper for DuckDB WASM does not support parameterized queries (prepared statements) directly in its current implementation, leading developers to concatenate strings.
**Prevention:** Must use `escapeSqlString` helper for ALL user inputs when building SQL queries.
