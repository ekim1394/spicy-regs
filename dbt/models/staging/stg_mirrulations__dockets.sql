with source as (

    select * from read_json_auto('../sample-data/mirrulations/docket-*.json')

),

renamed as (

    select
        data->>'id' as docket_id,
        data->>'type' as type,
        data->'attributes'->>'title' as title,
        data->'attributes'->>'agencyId' as agency_id,
        data->'attributes'->>'docketType' as docket_type,
        (data->'attributes'->>'modifyDate')::timestamp as modify_date
    from source

)

select * from renamed
