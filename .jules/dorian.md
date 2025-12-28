## 2024-03-24 - Initializing dbt-duckdb Project
**Learning:** Initializing a `dbt-duckdb` project with local JSON files requires careful setup of `read_json_auto` paths. Since `dbt` runs from the project root, relative paths must be constructed from there (e.g., `../sample-data`).
**Action:** Always verify paths with `ls` relative to the execution directory before baking them into models.
