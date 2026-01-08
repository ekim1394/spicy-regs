## 2025-01-08 - Initial Project Setup
**Learning:** The dbt project was missing from the environment, requiring manual initialization and dependency installation (`dbt-core`, `dbt-duckdb`). Standard paths for `dbt` binaries might vary, requiring explicit path verification.
**Action:** Always verify the existence of the dbt project and its dependencies before attempting to run commands. When initializing, ensure `profiles.yml` and `dbt_project.yml` are correctly placed and referenced via `DBT_PROFILES_DIR` if not using standard locations.
