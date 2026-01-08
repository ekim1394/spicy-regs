with raw_data as (
    select * from read_json_auto('../sample-data/mirrulations/docket-*.json')
)

select
    data.id as docket_id,
    data.attributes.agencyId as agency_id,
    data.attributes.title as title,
    data.attributes.docketType as docket_type,
    try_cast(data.attributes.modifyDate as timestamp) as last_modified_date
from raw_data