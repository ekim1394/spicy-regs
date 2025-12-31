with source as (
    select * from read_json_auto('{{ var('data_path') }}/docket-*.json')
)

select
    -- Primary Key
    data.id as docket_id,

    -- Attributes
    (data.attributes).agencyId as agency_id,
    (data.attributes).title as title,
    (data.attributes).docketType as docket_type,

    -- Dates (coerced)
    try_cast((data.attributes).modifyDate as timestamp) as last_modified_date,

    -- Metadata
    '{{ var('data_path') }}' as source_path,
    current_timestamp as ingestion_timestamp

from source
