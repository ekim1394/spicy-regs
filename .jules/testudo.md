## 2024-02-14 - SQL Injection in Manual Query Building
**Issue:** The application relies on manual string concatenation for SQL queries because the underlying DuckDB client does not support parameterized queries in this context. This led to a SQL injection vulnerability in `buildWhereClause`.
**Learning:** When parameterized queries are not available, unit testing the query builder logic with malicious inputs (e.g., `' OR 1=1 --`) is the only line of defense.
**Action:** Always write unit tests for string-building utility functions that handle user input, specifically targeting injection patterns.
