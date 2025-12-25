with source as (
    select * from read_json_auto('sample-data/mirrulations/docket-*.json')
),

renamed as (
    select
        data.id as docket_id,
        data.attributes.title as title,
        data.attributes.agencyId as agency_id,
        data.attributes.docketType as docket_type,
        data.attributes.modifyDate::timestamp as modified_at,
        data.attributes.organization as organization,
        data.links.self as self_link
    from source
)

select * from renamed
