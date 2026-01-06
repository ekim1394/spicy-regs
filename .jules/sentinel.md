## 2024-02-14 - [SQL Injection in Query Builder]
**Vulnerability:** SQL Injection in dynamic query construction within `frontend/src/lib/db/service.ts` and `utils.ts` due to unescaped string interpolation.
**Learning:** Even internal helper functions like `buildWhereClause` must treat inputs as untrusted if they are used to construct SQL strings. The lack of parameterized query support in the current lightweight DuckDB setup necessitates manual escaping, but this must be applied consistently.
**Prevention:** Implement and enforce usage of `escapeSqlString` for all string interpolations in SQL queries. Ideally, migrate to parameterized queries when the database driver/ORM allows.

## 2024-02-14 - [Test Environment Ambiguity]
**Vulnerability:** Ambiguous test runner configuration led to confusion about whether to use `bun:test` or a Node-based runner.
**Learning:** Repositories using `bun` as a package manager but lacking explicit `test` scripts can be confusing for automated tools and new contributors.
**Prevention:** Always define a `test` script in `package.json` (e.g., `"test": "bun test"`) to explicitly declare the intended test runner. Ensure `tsconfig.json` includes necessary types (e.g., `"types": ["bun-types"]`).
