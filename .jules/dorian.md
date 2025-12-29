## 2024-05-23 - Initial Project Audit
**Learning:** The dbt project was completely missing from the environment despite documentation implying its existence.
**Action:** Initialized the `spicy_regs` dbt project from scratch, establishing the `dbt` directory, `dbt_project.yml`, and `profiles.yml` to support local DuckDB execution.

## 2024-05-23 - Data Quality & NULL Handling
**Learning:** Source data (JSON) contains fields like `modifyDate` and `agencyId` nested within `attributes`. These can be NULL or missing.
**Action:** Implemented strict type casting and NULL handling in `stg_dockets`. Used explicit `md5` hashing for surrogate keys instead of `dbt_utils` to avoid unnecessary dependency overhead and file limits in the dev environment.
