
/*
    Model: stg_dockets
    Description: Ingests raw docket JSON data from the sample data directory.
    Source: JSON files matching 'docket-*.json' pattern.
    Transformation:
        - Extracts nested fields from the 'data' root object.
        - Maps CamelCase JSON attributes to snake_case SQL columns.
        - Casts 'modifyDate' to TIMESTAMP using try_cast for safety.
        - Renames 'id' to 'docket_id' to serve as the primary key.
*/

with source as (
    -- Read raw JSON files using DuckDB's read_json_auto function
    -- The data_path variable is defined in dbt_project.yml
    select * from read_json_auto('{{ var('data_path') }}/docket-*.json')
)

select
    -- Primary Key
    data.id as docket_id,

    -- Attributes
    data.attributes.agencyId as agency_id,
    data.attributes.title as title,
    data.attributes.docketType as docket_type,

    -- Date Casting: Ensure robust date handling
    try_cast(data.attributes.modifyDate as timestamp) as last_modified_date
from source
