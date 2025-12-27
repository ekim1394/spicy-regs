{{ config(materialized='table') }}

with staging as (
    select * from {{ ref('stg_dockets') }}
)

select
    -- Surrogate Key
    md5(coalesce(cast(docket_id as varchar), '')) as docket_key,

    docket_id,
    agency_id,
    docket_type,
    title,
    last_modified_date

from staging
