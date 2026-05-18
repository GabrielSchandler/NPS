create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.crm_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null check (status in ('running', 'success', 'failed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  rows_processed integer not null default 0,
  error_message text
);

create table if not exists public.crm_report_rows (
  id uuid primary key default gen_random_uuid(),
  report_key text not null,
  source_file_name text not null,
  row_number integer not null,
  row_hash text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_key, row_hash)
);

create index if not exists idx_crm_report_rows_report_key on public.crm_report_rows (report_key);
create index if not exists idx_crm_report_rows_imported_at on public.crm_report_rows (imported_at desc);

drop trigger if exists trg_crm_report_rows_updated_at on public.crm_report_rows;
create trigger trg_crm_report_rows_updated_at
before update on public.crm_report_rows
for each row
execute function public.set_updated_at();

create table if not exists public.nps_responses (
  id uuid primary key default gen_random_uuid(),
  external_response_id text not null unique,
  customer_name text not null,
  customer_code text,
  contract_code text,
  company_name text,
  unit_name text,
  operator_name text,
  survey_name text,
  score integer not null check (score between 0 and 10),
  classification text not null check (classification in ('promoter', 'neutral', 'detractor')),
  feedback text,
  responded_at timestamptz not null,
  reference_date date not null,
  source text not null default 'crm',
  raw_payload jsonb not null default '{}'::jsonb,
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_nps_responses_reference_date on public.nps_responses (reference_date desc);
create index if not exists idx_nps_responses_score on public.nps_responses (score);
create index if not exists idx_nps_responses_unit_name on public.nps_responses (unit_name);

drop trigger if exists trg_nps_responses_updated_at on public.nps_responses;
create trigger trg_nps_responses_updated_at
before update on public.nps_responses
for each row
execute function public.set_updated_at();

create or replace view public.nps_summary_overview as
select
  count(*)::integer as total_responses,
  round(avg(score)::numeric, 2) as average_score,
  round(
    (
      (
        count(*) filter (where score >= 9) -
        count(*) filter (where score <= 6)
      )::numeric / nullif(count(*), 0)
    ) * 100,
    2
  ) as nps_score,
  round((count(*) filter (where score >= 9)::numeric / nullif(count(*), 0)) * 100, 2) as promoters_pct,
  round((count(*) filter (where score <= 6)::numeric / nullif(count(*), 0)) * 100, 2) as detractors_pct,
  max(responded_at) as last_response_at
from public.nps_responses;

create or replace view public.nps_daily_summary as
select
  reference_date,
  count(*)::integer as total_responses,
  round(
    (
      (
        count(*) filter (where score >= 9) -
        count(*) filter (where score <= 6)
      )::numeric / nullif(count(*), 0)
    ) * 100,
    2
  ) as nps_score,
  round((count(*) filter (where score >= 9)::numeric / nullif(count(*), 0)) * 100, 2) as promoters_pct,
  round((count(*) filter (where score <= 6)::numeric / nullif(count(*), 0)) * 100, 2) as detractors_pct
from public.nps_responses
group by reference_date
order by reference_date desc;

create or replace view public.crm_report_row_counts as
select
  report_key,
  count(*)::integer as total_rows,
  max(imported_at) as last_imported_at
from public.crm_report_rows
group by report_key
order by report_key;
