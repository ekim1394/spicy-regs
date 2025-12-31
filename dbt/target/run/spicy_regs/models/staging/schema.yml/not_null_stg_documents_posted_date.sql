
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (








select posted_date
from "spicy_regs"."main"."stg_documents"
where posted_date is null






    ) dbt_internal_test