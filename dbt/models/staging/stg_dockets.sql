with source as (
    select * from read_json_auto('../sample-data/mirrulations/docket-*.json')
)

select
    -- Extract ID and attributes
    data.id as docket_id,
    data.type as type,
    (data.attributes).agencyId as agency_id,
    (data.attributes).docketType as docket_type,
    (data.attributes).title as title,

    -- Cast dates properly
    try_cast((data.attributes).modifyDate as timestamp) as last_modified_date

from source
