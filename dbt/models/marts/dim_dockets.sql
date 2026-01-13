with stg_dockets as (
    select * from {{ ref('stg_dockets') }}
)

select
    md5(coalesce(cast(docket_id as varchar), '')) as docket_key,
    docket_id,
    agency_id,
    title,
    docket_type,
    last_modified_date
from stg_dockets
