with source as (
    select * from {{ source('raw_dockets', 'dockets_json') }}
),

renamed as (
    select
        -- Surrogate Key (Manual implementation to avoid dbt-utils dependency bloat)
        md5(coalesce(cast(data.id as varchar), '')) as docket_key,

        -- Natural Keys
        data.id as docket_id,
        (data.attributes).agencyId as agency_id,
        (data.attributes).docketType as docket_type,

        -- Attributes
        (data.attributes).title as title,
        (data.attributes).dkAbstract as description,

        -- Dates (Strict Casting)
        try_cast((data.attributes).modifyDate as timestamp) as last_modified_date,

        -- Metadata
        data.type as object_type,
        data.links.self as self_link

    from source
)

select * from renamed
