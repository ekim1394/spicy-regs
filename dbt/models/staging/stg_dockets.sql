/*
    Model: stg_dockets
    Purpose: Staging model to parse and clean raw docket JSON data from S3/local storage.

    Transformation Logic:
    1. Reads raw JSON files using DuckDB's `read_json_auto`.
    2. Extracts fields from the `attributes` nested JSON object.
    3. Maps `data.id` to `docket_id` as the primary key.
    4. Casts `modifyDate` to a proper TIMESTAMP type.
    5. Normalizes field names to snake_case.

    Key Relationships:
    - This model serves as the base for `dim_dockets` and joins with `fact_comments` via `docket_id`.
*/

with source as (
    select * from read_json_auto('{{ var("data_path") }}/docket-*.json')
)

select
    -- Primary Key: The unique identifier for the docket (e.g., ACF-2025-0038)
    data.id as docket_id,

    -- Resource type (should always be 'dockets')
    data.type as type,

    -- Extracting agency ID from the attributes struct
    (data.attributes).agencyId as agency_id,

    -- Extracting the main title of the docket
    (data.attributes).title as title,

    -- Casting the ISO8601 date string to a timestamp
    try_cast((data.attributes).modifyDate as timestamp) as last_modified_date,

    -- Organization handling the docket
    (data.attributes).organization as organization,

    -- Type of docket (e.g., Rulemaking, Nonrulemaking)
    (data.attributes).docketType as docket_type
from source
