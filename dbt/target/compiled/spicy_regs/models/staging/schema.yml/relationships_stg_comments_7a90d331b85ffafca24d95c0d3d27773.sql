



with child as (
    select docket_id as from_field
    from "spicy_regs"."main"."stg_comments"
    where docket_id is not null
),

parent as (
    select docket_id as to_field
    from "spicy_regs"."main"."stg_dockets"
)

select
    from_field

from child
left join parent
    on child.from_field = parent.to_field

where parent.to_field is null
