
with source_data as (
    -- Read JSON files directly using DuckDB's read_json_auto
    select *
    from read_json_auto('../sample-data/mirrulations/docket-*.json')
)

select
    data.id as docket_id,
    data.attributes.agencyId as agency_id,
    data.attributes.title as title,
    data.attributes.docketType as docket_type,
    try_cast(data.attributes.modifyDate as timestamp) as modify_date,
    data.attributes.keywords as keywords,
    data.attributes.dkAbstract as abstract,
    data.attributes.organization as organization,
    data.attributes.category as category,
    data.attributes.objectId as object_id,
    data.links.self as self_link
from source_data
