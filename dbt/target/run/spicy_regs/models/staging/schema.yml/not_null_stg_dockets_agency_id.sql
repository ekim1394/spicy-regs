
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (








select agency_id
from "spicy_regs"."main"."stg_dockets"
where agency_id is null






    ) dbt_internal_test