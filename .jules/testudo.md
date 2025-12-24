# Testudo's Journal

## 2025-05-18 - First Steps: Establishing a Beachhead
**Issue:** The `frontend` codebase completely lacked a testing infrastructure. There were no test files, and `package.json` had no test script.
**Learning:** Even modern stacks like Next.js/Bun don't enforce testing by default. Without a visible "test" script, developers are implicitly encouraged to skip testing.
**Action:** Initialized the testing culture by adding the first unit test for core database utilities and configured `bun test`. Future additions must maintain this momentum by adding tests for every new feature.
