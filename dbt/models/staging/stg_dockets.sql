with source as (
    select * from read_json_auto('sample-data/mirrulations/docket-*.json')
)

select
    -- Select natural key
    data.id as docket_id,
    data.type,
    (data.attributes).title::varchar as title,
    (data.attributes).agencyId::varchar as agency_id,
    (data.attributes).dkAbstract::varchar as abstract,
    (data.attributes).docketType::varchar as docket_type,
    (data.attributes).modifyDate::timestamp as modified_at
from source
