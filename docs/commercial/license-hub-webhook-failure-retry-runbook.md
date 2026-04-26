# License Hub Webhook Failure / Retry Observability Runbook

This runbook is retained for a bounded post-launch operator-only safety-window rehearsal.

License Hub is already live. Do not treat this document as an active public launch blocker or storefront work item.

Boundary:

- no storefront changes
- no pricing changes
- no portal UI changes
- no SQL baseline changes
- no schema changes
- no automatic production-risk action
- additive-only
- bounded
- non-executing unless the gate is explicitly opened
- no authority expansion

## Preconditions

- Use a planned human safety window.
- Confirm the Neon read-only ops views are available.
- Choose one controlled test webhook event or marker before opening the gate.
- Keep real customer identifiers, event ids, license ids, and email addresses out of committed evidence.
- Confirm `LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED` is unset or `false` before and after the rehearsal.

## Gate

Default state:

```text
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=false
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS=
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS=
```

Open the gate only for the chosen selector:

```text
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=true
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS=<single-test-event-id>
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS=
```

or:

```text
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=true
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS=
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS=<single-test-marker>
```

Supported marker fields:

- `data.custom_data.mindforge_webhook_failure_marker`
- `data.custom_data.webhook_failure_marker`
- `data.custom_data.license_hub_webhook_failure_marker`
- `data.metadata.mindforge_webhook_failure_marker`
- `data.metadata.webhook_failure_marker`
- `data.metadata.license_hub_webhook_failure_marker`
- top-level equivalents of those marker names

## Expected failure behavior

With the gate open and the selector matched:

- signature verification still runs normally
- the webhook event ledger is created or reused
- processing fails before `applyBillingLifecycle`
- `webhook_events.status` becomes `error`
- `webhook_events.errorMessage` contains `controlled webhook failure injection`
- no order state transition should be caused by the injected failure
- no active license should be issued by the injected failure

## Expected retry behavior

Before retry:

- set `LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=false`, or remove the event id / marker selector
- restart or redeploy as required by the environment so the default-off config is active

On retry:

- the same provider/event id should reuse the existing webhook event ledger
- processing should move from `error` to `processed`
- final order and license state should match the billing event
- duplicate delivery after `processed` should return idempotently
- no duplicate active license should be created for the order

## Observability queries

Failure row:

```sql
select *
from ops_webhook_failures
where event_id = '<test-event-id>'
order by received_at desc
limit 20;
```

Customer journey:

```sql
select *
from ops_customer_journey
where customer_email = '<test-customer-email>'
order by event_at desc nulls last;
```

Issued licenses:

```sql
select *
from ops_issued_licenses
where customer_email = '<test-customer-email>'
order by issued_at desc
limit 20;
```

Paid orders:

```sql
select *
from ops_recent_paid_orders
where customer_email = '<test-customer-email>'
order by paid_at desc nulls last
limit 20;
```

Direct ledger inspection when needed:

```sql
select
  id,
  provider,
  "eventId",
  "eventType",
  status,
  "errorMessage",
  "processedAt",
  "orderId",
  "licenseId"
from webhook_events
where "eventId" = '<test-event-id>'
order by "createdAt" desc
limit 20;
```

## Close standard

- Failure is visible in `webhook_events` and `ops_webhook_failures`.
- Retry reaches `processed`.
- Duplicate replay after success is idempotent.
- Final paid order state is correct for the test event.
- Exactly one active license exists for the order when the event is a successful payment.
- No active license exists when the event is a failure / rejection.
- Gate is restored to default off.
- Non-secret evidence summary is recorded in the verification baseline or private evidence bundle.

## Restore default state

```text
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=false
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS=
LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS=
```

Confirm after restore:

```sql
select *
from ops_webhook_failures
order by received_at desc
limit 50;
```
