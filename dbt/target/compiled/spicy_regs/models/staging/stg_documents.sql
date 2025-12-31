with source as (
    select * from read_json_auto('../sample-data/mirrulations/document-*.json')
)

select
    -- Primary Key
    data.id as document_id,

    -- Foreign Keys
    (data.attributes).docketId as docket_id,

    -- Attributes
    (data.attributes).title as title,
    (data.attributes).documentType as document_type,
    (data.attributes).docAbstract as abstract,
    (data.attributes).frDocNum as fr_doc_num,
    (data.attributes).withdrawn::boolean as is_withdrawn,

    -- Dates (coerced)
    try_cast((data.attributes).postedDate as timestamp) as posted_date,
    try_cast((data.attributes).modifyDate as timestamp) as last_modified_date,
    try_cast((data.attributes).receiveDate as timestamp) as receive_date,
    try_cast((data.attributes).commentStartDate as timestamp) as comment_start_date,
    try_cast((data.attributes).commentEndDate as timestamp) as comment_end_date,

    -- Metadata
    '../sample-data/mirrulations' as source_path,
    current_timestamp as ingestion_timestamp

from source