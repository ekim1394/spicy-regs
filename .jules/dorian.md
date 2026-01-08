## 2025-02-18 - [Initializing dbt with DuckDB JSON extraction]
**Learning:** DuckDB's `read_json_auto` can ingest raw JSON files directly, but nested fields must be accessed using struct syntax like `(data.attributes).fieldName`.
**Action:** Use this pattern for all staging models to flatten JSON structures into relational tables.
