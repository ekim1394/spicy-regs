# Testudo's Journal

## 2025-02-19 - Critical Testing Gap: Missing SQL Sanitization & Unit Tests
**Issue:** The codebase completely lacks unit tests. Specifically, the `buildWhereClause` function in `frontend/src/lib/db/utils.ts` constructs SQL queries by directly interpolating string arguments. This logic is untested and prone to SQL injection, as input is not escaped.
**Learning:** Pure functions that generate code (like SQL) from user input must be rigorously tested with both happy-path and adversarial inputs (e.g., strings containing quotes). The absence of a test runner in a Next.js/Bun project is a major oversight.
**Action:** Establish a testing baseline by introducing `bun test` and creating a unit test for `frontend/src/lib/db/utils.ts`. Implement an `escapeSqlString` helper to sanitize inputs and enforce its usage via tests.
