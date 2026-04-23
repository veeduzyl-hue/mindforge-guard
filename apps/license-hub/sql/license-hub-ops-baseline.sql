-- MindForge License Hub ops baseline
-- Boundary:
-- - read-only operations views only
-- - ops_notes intentionally skipped in this execution scope
-- - no checkout, webhook, pricing, or license issuance behavior changes

-- skipped on purpose:
-- create table if not exists ops_notes ...
-- create index if not exists idx_ops_notes_subject ...

create or replace view ops_recent_paid_orders as
select
  o.id as order_record_id,
  o."externalOrderId" as external_order_id,
  o."externalPaymentId" as external_payment_id,
  o."externalSubscriptionId" as external_subscription_id,
  o."paymentProvider" as payment_provider,
  o.status as order_status,
  o.edition,
  o."amountCents" as amount_cents,
  o.currency,
  o."statusReason" as status_reason,
  o."createdAt" as order_created_at,
  o."paidAt" as paid_at,
  o."updatedAt" as order_updated_at,
  c.id as customer_record_id,
  c.email as customer_email,
  c.name as customer_name,
  lic.id as latest_license_record_id,
  lic."licenseId" as latest_license_id,
  lic.status as latest_license_status,
  lic."issuedAt" as latest_license_issued_at,
  lic."notAfter" as latest_license_not_after
from orders o
join customers c
  on c.id = o."customerId"
left join lateral (
  select
    l.id,
    l."licenseId",
    l.status,
    l."issuedAt",
    l."notAfter"
  from licenses l
  where l."orderId" = o.id
  order by l."issuedAt" desc, l."createdAt" desc
  limit 1
) lic on true
where o.status = 'paid';

create or replace view ops_issued_licenses as
select
  l.id as license_record_id,
  l."licenseId" as license_id,
  l.status as license_status,
  l.edition,
  l."subjectEmail" as subject_email,
  l."schemaVersion" as schema_version,
  l."keyId" as key_id,
  l."issuedAt" as issued_at,
  l."notBefore" as not_before,
  l."notAfter" as not_after,
  l."revokedAt" as revoked_at,
  l."revokeReason" as revoke_reason,
  l."supersededAt" as superseded_at,
  l."orderId" as order_record_id,
  o."externalOrderId" as external_order_id,
  o."externalPaymentId" as external_payment_id,
  o."externalSubscriptionId" as external_subscription_id,
  o.status as order_status,
  o."paidAt" as paid_at,
  c.id as customer_record_id,
  c.email as customer_email,
  c.name as customer_name
from licenses l
join orders o
  on o.id = l."orderId"
join customers c
  on c.id = l."customerId";

create or replace view ops_webhook_failures as
select
  w.id as webhook_event_record_id,
  w.provider,
  w."eventId" as event_id,
  w."eventType" as event_type,
  coalesce(
    w."payloadJson" -> 'raw_payload' ->> 'event_type',
    w."payloadJson" -> 'raw_payload' ->> 'type',
    w."eventType"
  ) as source_event_type,
  w.status as webhook_status,
  w."errorMessage" as error_message,
  w."createdAt" as received_at,
  w."processedAt" as processed_at,
  c.id as customer_record_id,
  c.email as customer_email,
  o.id as order_record_id,
  o."externalOrderId" as external_order_id,
  l.id as license_record_id,
  l."licenseId" as license_id
from webhook_events w
left join customers c
  on c.id = w."customerId"
left join orders o
  on o.id = w."orderId"
left join licenses l
  on l.id = w."licenseId"
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
    when m."consumedAt" is not null then 'consumed'
    when m."expiresAt" < current_timestamp then 'expired'
    else 'pending'
  end as token_state,
  m."createdAt" as requested_at,
  m."expiresAt" as expires_at,
  m."consumedAt" as consumed_at
from magic_link_tokens m
left join customers c
  on c.id = m."customerId"
left join customers c_by_email
  on c_by_email.email = m.email;

create or replace view ops_customer_journey as
select
  c.id as customer_record_id,
  c.email as customer_email,
  'order_created'::text as event_type,
  o."createdAt" as event_at,
  o.id as order_record_id,
  o."externalOrderId" as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'order_status', o.status,
    'edition', o.edition,
    'amount_cents', o."amountCents",
    'currency', o.currency
  ) as detail_json
from orders o
join customers c
  on c.id = o."customerId"

union all

select
  c.id as customer_record_id,
  c.email as customer_email,
  'order_paid'::text as event_type,
  o."paidAt" as event_at,
  o.id as order_record_id,
  o."externalOrderId" as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'order_status', o.status,
    'edition', o.edition,
    'amount_cents', o."amountCents",
    'currency', o.currency,
    'external_payment_id', o."externalPaymentId"
  ) as detail_json
from orders o
join customers c
  on c.id = o."customerId"
where o."paidAt" is not null

union all

select
  c.id as customer_record_id,
  c.email as customer_email,
  'license_issued'::text as event_type,
  l."issuedAt" as event_at,
  o.id as order_record_id,
  o."externalOrderId" as external_order_id,
  l.id::text as license_record_id,
  l."licenseId" as license_id,
  null::text as magic_link_token_id,
  jsonb_build_object(
    'license_status', l.status,
    'edition', l.edition,
    'subject_email', l."subjectEmail",
    'not_after', l."notAfter"
  ) as detail_json
from licenses l
join customers c
  on c.id = l."customerId"
join orders o
  on o.id = l."orderId"

union all

select
  coalesce(c.id, c_by_email.id) as customer_record_id,
  coalesce(c.email, c_by_email.email, m.email) as customer_email,
  'magic_link_requested'::text as event_type,
  m."createdAt" as event_at,
  null::text as order_record_id,
  null::text as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  m.id::text as magic_link_token_id,
  jsonb_build_object(
    'purpose', m.purpose,
    'expires_at', m."expiresAt",
    'requested_email', m.email
  ) as detail_json
from magic_link_tokens m
left join customers c
  on c.id = m."customerId"
left join customers c_by_email
  on c_by_email.email = m.email

union all

select
  coalesce(c.id, c_by_email.id) as customer_record_id,
  coalesce(c.email, c_by_email.email, m.email) as customer_email,
  'magic_link_consumed'::text as event_type,
  m."consumedAt" as event_at,
  null::text as order_record_id,
  null::text as external_order_id,
  null::text as license_record_id,
  null::text as license_id,
  m.id::text as magic_link_token_id,
  jsonb_build_object(
    'purpose', m.purpose,
    'requested_email', m.email
  ) as detail_json
from magic_link_tokens m
left join customers c
  on c.id = m."customerId"
left join customers c_by_email
  on c_by_email.email = m.email
where m."consumedAt" is not null;
