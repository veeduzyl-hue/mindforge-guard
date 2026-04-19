-- MindForge License Hub ops baseline
-- Boundary:
-- - read-only operations views only
-- - optional manual ops_notes table only
-- - no checkout, webhook, pricing, or license issuance behavior changes

create table if not exists ops_notes (
  id bigserial primary key,
  subject_type text not null,
  subject_id text not null,
  note_text text not null,
  author_email text,
  created_at timestamp(3) not null default current_timestamp,
  updated_at timestamp(3) not null default current_timestamp
);

create index if not exists idx_ops_notes_subject
  on ops_notes (subject_type, subject_id, created_at desc);

create or replace view ops_recent_paid_orders as
select
  o.id as order_record_id,
  o.external_order_id,
  o.external_payment_id,
  o.external_subscription_id,
  o.payment_provider,
  o.status as order_status,
  o.edition,
  o.amount_cents,
  o.currency,
  o.status_reason,
  o.created_at as order_created_at,
  o.paid_at,
  o.updated_at as order_updated_at,
  c.id as customer_record_id,
  c.email as customer_email,
  c.name as customer_name,
  lic.id as latest_license_record_id,
  lic.license_id as latest_license_id,
  lic.status as latest_license_status,
  lic.issued_at as latest_license_issued_at,
  lic.not_after as latest_license_not_after
from orders o
join customers c
  on c.id = o.customer_id
left join lateral (
  select
    l.id,
    l.license_id,
    l.status,
    l.issued_at,
    l.not_after
  from licenses l
  where l.order_id = o.id
  order by l.issued_at desc, l.created_at desc
  limit 1
) lic on true
where o.status = 'paid';

create or replace view ops_issued_licenses as
select
  l.id as license_record_id,
  l.license_id,
  l.status as license_status,
  l.edition,
  l.subject_email,
  l.schema_version,
  l.key_id,
  l.issued_at,
  l.not_before,
  l.not_after,
  l.revoked_at,
  l.revoke_reason,
  l.superseded_at,
  l.order_id as order_record_id,
  o.external_order_id,
  o.external_payment_id,
  o.external_subscription_id,
  o.status as order_status,
  o.paid_at,
  c.id as customer_record_id,
  c.email as customer_email,
  c.name as customer_name
from licenses l
join orders o
  on o.id = l.order_id
join customers c
  on c.id = l.customer_id;

create or replace view ops_webhook_failures as
select
  w.id as webhook_event_record_id,
  w.provider,
  w.event_id,
  w.event_type,
  coalesce(
    w.payload_json -> 'raw_payload' ->> 'event_type',
    w.payload_json -> 'raw_payload' ->> 'type',
    w.event_type
  ) as source_event_type,
  w.status as webhook_status,
  w.error_message,
  w.created_at as received_at,
  w.processed_at,
  c.id as customer_record_id,
  c.email as customer_email,
  o.id as order_record_id,
  o.external_order_id,
  l.id as license_record_id,
  l.license_id
from webhook_events w
left join customers c
  on c.id = w.customer_id
left join orders o
  on o.id = w.order_id
left join licenses l
  on l.id = w.license_id
where w.status = 'error';

create or replace view ops_magic_link_activity as
select
  m.id as magic_link_token_id,
  coalesce(c.id, c_by_email.id) as customer_record_id,
  coalesce(c.email, c_by_email.email, m.email) as customer_email,
  coalesce(c.name, c_by_email.name) as customer_name,
  m.email as requested_email,
  m.purpose,
  case
    when m.consumed_at is not null then 'consumed'
    when m.expires_at < current_timestamp then 'expired'
    else 'pending'
  end as token_state,
  m.created_at as requested_at,
  m.expires_at,
  m.consumed_at
from magic_link_tokens m
left join customers c
  on c.id = m.customer_id
left join customers c_by_email
  on c_by_email.email = m.email;

create or replace view ops_customer_journey as
select
  c.id as customer_record_id,
  c.email as customer_email,
  'order_created'::text as event_type,
  o.created_at as event_at,
  o.id as order_record_id,
  o.external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'order_status', o.status,
    'edition', o.edition,
    'amount_cents', o.amount_cents,
    'currency', o.currency
  ) as detail_json
from orders o
join customers c
  on c.id = o.customer_id

union all

select
  c.id as customer_record_id,
  c.email as customer_email,
  'order_paid'::text as event_type,
  o.paid_at as event_at,
  o.id as order_record_id,
  o.external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'order_status', o.status,
    'edition', o.edition,
    'amount_cents', o.amount_cents,
    'currency', o.currency,
    'external_payment_id', o.external_payment_id
  ) as detail_json
from orders o
join customers c
  on c.id = o.customer_id
where o.paid_at is not null

union all

select
  c.id as customer_record_id,
  c.email as customer_email,
  'license_issued'::text as event_type,
  l.issued_at as event_at,
  o.id as order_record_id,
  o.external_order_id,
  l.id as license_record_id,
  l.license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'license_status', l.status,
    'edition', l.edition,
    'subject_email', l.subject_email,
    'not_after', l.not_after
  ) as detail_json
from licenses l
join customers c
  on c.id = l.customer_id
join orders o
  on o.id = l.order_id

union all

select
  coalesce(c.id, c_by_email.id) as customer_record_id,
  coalesce(c.email, c_by_email.email, m.email) as customer_email,
  'magic_link_requested'::text as event_type,
  m.created_at as event_at,
  null::text as order_record_id,
  null::text as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  m.id as magic_link_token_id,
  jsonb_build_object(
    'purpose', m.purpose,
    'expires_at', m.expires_at,
    'requested_email', m.email
  ) as detail_json
from magic_link_tokens m
left join customers c
  on c.id = m.customer_id
left join customers c_by_email
  on c_by_email.email = m.email

union all

select
  coalesce(c.id, c_by_email.id) as customer_record_id,
  coalesce(c.email, c_by_email.email, m.email) as customer_email,
  'magic_link_consumed'::text as event_type,
  m.consumed_at as event_at,
  null::text as order_record_id,
  null::text as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  m.id as magic_link_token_id,
  jsonb_build_object(
    'purpose', m.purpose,
    'requested_email', m.email
  ) as detail_json
from magic_link_tokens m
left join customers c
  on c.id = m.customer_id
left join customers c_by_email
  on c_by_email.email = m.email
where m.consumed_at is not null;
