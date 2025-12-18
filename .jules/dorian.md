## 2025-02-18 - dbt-duckdb External Sources
**Learning:** `dbt-duckdb` source external configuration requires careful setup or `dbt-external-tables`. Using `read_json_auto` directly in the staging model with relative paths (e.g., `../sample-data/...`) is a robust and simpler alternative for local file ingestion in this environment.
**Action:** Prefer `read_json_auto` for local file ingestion when source compilation fails.
