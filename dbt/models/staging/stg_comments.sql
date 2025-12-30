with source as (
    select * from read_json_auto('{{ var("data_path") }}/comment-*.json')
),

renamed as (
    select
        data.id as comment_id,
        data.attributes.docketId as docket_id,
        data.attributes.commentOnDocumentId as document_id,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        data.attributes.comment as comment_text,
        try_cast(data.attributes.postedDate as timestamp) as posted_date,
        try_cast(data.attributes.modifyDate as timestamp) as last_modified_date,
        try_cast(data.attributes.receiveDate as timestamp) as receive_date,
        data.attributes.firstName as first_name,
        data.attributes.lastName as last_name,
        data.attributes.organization as organization,
        data.links.self as link
    from source
)

select * from renamed
