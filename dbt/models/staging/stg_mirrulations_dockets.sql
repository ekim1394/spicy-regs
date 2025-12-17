with source as (
    select * from {{ source('mirrulations', 'dockets') }}
),

renamed as (
    select
        data.id as docket_id,
        data.type as object_type,
        data.attributes.agencyId as agency_id,
        data.attributes.title as title,
        data.attributes.docketType as docket_type,
        data.attributes.modifyDate::timestamp as modified_at,
        data.attributes.organization as organization,
        data.attributes.dkAbstract as abstract,
        data.attributes.keywords as keywords,
        data.links.self as self_link
    from source
)

select * from renamed
