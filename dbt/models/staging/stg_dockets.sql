with source as (
    select * from {{ source('mirrulations', 'dockets') }}
)

select
    -- JSON is nested in 'data' key
    data.id as docket_id,
    data.type as type,
    data.attributes.agencyId as agency_id,
    data.attributes.title as title,
    data.attributes.docketType as docket_type,
    try_cast(data.attributes.modifyDate as timestamp) as modify_date
from source
