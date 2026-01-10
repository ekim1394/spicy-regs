
with source as (
    select * from read_json_auto('{{ var('data_path') }}/document-*.json')
),
renamed as (
    select
        data.id as document_id,
        data.attributes.docketId as docket_id,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        data.attributes.documentType as document_type,
        try_cast(data.attributes.postedDate as timestamp) as posted_date,
        try_cast(data.attributes.modifyDate as timestamp) as last_modified_date,
        try_cast(data.attributes.commentStartDate as timestamp) as comment_start_date,
        try_cast(data.attributes.commentEndDate as timestamp) as comment_end_date,
        data.attributes.docAbstract as description,
        data.attributes.objectId as object_id,
        data.attributes.openForComment as open_for_comment
    from source
)
select * from renamed
