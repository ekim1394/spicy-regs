
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (






select
    docket_id as unique_field,
    count(*) as n_records

from "spicy_regs"."main"."stg_dockets"
where docket_id is not null
group by docket_id
having count(*) > 1






    ) dbt_internal_test