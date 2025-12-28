with source as (
    select * from read_json_auto('{{ var("data_path") }}/docket-*.json')
),

renamed as (
    select
        data.id as docket_id,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        try_cast(data.attributes.modifyDate as timestamp) as last_modified_date,
        data.attributes.docketType as docket_type,
        data.attributes.organization as organization,
        data.links.self as api_url
    from source
)

select * from renamed
