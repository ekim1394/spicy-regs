
with source as (
    select
        *
    from read_json_auto('{{ var('data_path') }}/docket-*.json')
),

renamed as (
    select
        data.id as docket_id,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        data.attributes.docketType as docket_type,
        try_cast(data.attributes.modifyDate as timestamp) as last_modified_date,
        data.attributes.dkAbstract as description,
        data.attributes.keywords as keywords,
        data.attributes.organization as organization,
        data.attributes.category as category,
        data.attributes.objectId as object_id
    from source
)

select * from renamed
