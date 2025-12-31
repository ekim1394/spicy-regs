



select
    docket_id as unique_field,
    count(*) as n_records

from "spicy_regs"."main"."stg_dockets"
where docket_id is not null
group by docket_id
having count(*) > 1
