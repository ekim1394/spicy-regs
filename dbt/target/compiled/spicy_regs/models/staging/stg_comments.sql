with source as (
    select * from read_json_auto('../sample-data/mirrulations/comment-*.json')
)

select
    -- Primary Key
    data.id as comment_id,

    -- Foreign Keys
    (data.attributes).commentOnDocumentId as document_id,
    (data.attributes).docketId as docket_id,

    -- Attributes
    (data.attributes).title as title,
    (data.attributes).firstName as first_name,
    (data.attributes).lastName as last_name,
    (data.attributes).organization as organization,

    -- Dates (coerced)
    try_cast((data.attributes).postedDate as timestamp) as posted_date,
    try_cast((data.attributes).modifyDate as timestamp) as last_modified_date,
    try_cast((data.attributes).receiveDate as timestamp) as receive_date,

    -- Metadata
    '../sample-data/mirrulations' as source_path,
    current_timestamp as ingestion_timestamp

from source