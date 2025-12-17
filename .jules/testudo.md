## 2025-05-24 - Vitest Mocking for AWS SDK
**Issue:** `vi.mock` factory hoisting issues when mocking `@aws-sdk/client-s3` caused `ReferenceError` and "is not a constructor" errors.
**Learning:** `vi.mock` is hoisted to the top of the file. Any variables used inside the factory must be defined using `vi.hoisted`. Furthermore, when mocking a class export like `S3Client`, the mock implementation must be a class or a function that behaves like a constructor, not just a `vi.fn()` return value.
**Action:** Always use `vi.hoisted` for mock implementations of external libraries in Vitest, and explicitly define class mocks as `class MockName { ... }` to avoid constructor issues.
