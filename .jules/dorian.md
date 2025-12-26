## 2025-02-18 - Initializing Missing Data Pipeline
**Learning:** The project lacked a `dbt` directory despite instructions implying its existence. The memory mentioned "dbt profile... within the `dbt` directory", but it was absent.
**Action:** When initializing a project from scratch based on memory, ensure all paths (like `sample-data` relative locations) are correctly verified before creating `profiles.yml` and models. I utilized `read_json_auto` with a relative path `../sample-data` because the dbt project root is in `dbt/`.

## 2025-02-18 - DBT Workflow & Artifacts
**Learning:** I encountered a "Table does not exist" error because I ran `dbt test` without running `dbt run` first. `dbt test` validates the *existing* database objects, it does not create them. Also, `target/` and `.duckdb` files must be gitignored to avoid polluting the repo.
**Action:** Always follow the sequence `dbt run` -> `dbt test` when verifying changes. Ensure `.gitignore` is properly configured for new dbt projects.
