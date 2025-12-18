## 2024-05-23 - Introduced Vitest for Unit Testing

**Issue:** The project lacked a configured test runner, leaving critical business logic (like query building in `utils.ts`) untested and vulnerable to regression.

**Learning:** Vitest is an excellent choice for this Next.js/Vite ecosystem because it integrates seamlessly, requires minimal configuration, and is fast. Setting it up with `happy-dom` provides a lightweight environment sufficient for logic and component testing.

**Action:**
1.  Use `bun add -d vitest happy-dom` to install.
2.  Add a `test` script: `"test": "vitest"`.
3.  Create a simple `vitest.config.ts`.
4.  Focus initial tests on pure logic files (`utils.ts`, `lib/`) as they provide high value with low setup cost.
