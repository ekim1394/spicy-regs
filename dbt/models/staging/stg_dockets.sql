with source as (
    select * from read_json_auto('{{ var("data_path") }}/docket-*.json')
),

renamed as (
    select
        data.id as docket_id,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        data.attributes.docketType as docket_type,
        try_cast(data.attributes.modifyDate as timestamp) as last_modified_date
    from source
)

select * from renamed
