with dockets as (

    select * from {{ ref('stg_mirrulations__dockets') }}

),

final as (

    select
        md5(coalesce(cast(docket_id as varchar), '')) as docket_sk,
        docket_id,
        title,
        agency_id,
        docket_type,
        modify_date
    from dockets

)

select * from final
