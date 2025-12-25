## 2024-05-23 - Initializing dbt Project
**Learning:** The dbt project structure was completely missing from the repo, despite instructions implying it existed. I had to bootstrap the entire project structure (`dbt_project.yml`, `profiles.yml`, directories).
**Action:** Always check for the existence of the `dbt` directory and `dbt_project.yml` before assuming the environment is set up. If missing, initialize it to establish the transformation pipeline.
