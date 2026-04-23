# License Hub Sample 2 Success And Failure Path Baseline

This document records the current License Hub Sample 2 success result and the first bounded failure-path / ops-baseline verification scope.

Status summary:

- Current stage: failure path round 1 and read-only ops baseline preparation.
- Passed sample: Sample 2, `Pro+ Monthly`, paid path complete, portal license visible, monthly validity correct.
- Known failure sample: failed payment marked `potentially fraudulent`, classified as provider risk / payment rejection.
- Next scope: checkout close, unauthenticated portal, magic link reuse / expiry, webhook failure / retry observability, and read-only ops queries.

Boundary:

- documentation and verification planning only
- no storefront changes
- no checkout behavior changes
- no webhook behavior changes
- no magic link behavior changes
- no DB schema changes
- no signing / validity / portal auth changes
- additive-only
- bounded

Invariants preserved:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged
- `classify` behavior unchanged
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority scope expansion

## Sample 2 Success Record

Status: passed.

Sample type:

- Product: MindForge Guard License Hub
- Environment: live License Hub path
- SKU: `Pro+ Monthly`
- Paddle transaction state: `Complete`
- Paddle subscription state: `Active`
- License edition observed in portal: `pro_plus`
- Validity conclusion: monthly validity semantics correct

Successful chain:

1. Storefront purchase path selected `Pro+ Monthly`.
2. Paddle checkout completed.
3. Paddle subscription became active.
4. Billing webhook produced persisted License Hub records.
5. Neon contains corresponding records in `customers`, `orders`, `licenses`, `magic_link_tokens`, and `webhook_events`.
6. Portal login succeeded through the existing magic-link path.
7. `/portal/licenses` rendered the `pro_plus` license.
8. The issued license showed the expected monthly validity window.

Minimum evidence package fields:

- `sample_id`: `sample-2`
- `sku`: `Pro+ Monthly`
- `paddle_transaction_state`: `Complete`
- `paddle_subscription_state`: `Active`
- `customer_record_present`: yes
- `order_record_present`: yes
- `license_record_present`: yes
- `magic_link_token_record_present`: yes
- `webhook_event_record_present`: yes
- `portal_login_result`: success
- `portal_license_visible`: yes
- `portal_license_edition`: `pro_plus`
- `validity_semantics`: monthly
- `result`: pass

Evidence retention note:

- Do not commit buyer email, Paddle transaction id, subscription id, public license id, or magic link token values.
- Keep sensitive identifiers in Paddle, Neon, or a private operator evidence bundle.
- This repository record stores the non-secret pass/fail summary and the required evidence shape.

Pass conclusion:

- Sample 2 proves the live `Pro+ Monthly` paid path can complete from checkout through webhook persistence, license issuance, magic-link login, portal visibility, and monthly validity interpretation.

## Existing Failure Sample Record

Observed failure class:

- Payment result: failed payment
- Provider / risk label: potentially fraudulent

Classification:

- This is a payment risk / issuing-chain rejection.
- This is not evidence of a License Hub main-path outage.
- No successful paid entitlement should be inferred from this payment state.
- No new active license should be issued from this failed payment state.

Expected evidence shape:

- Paddle-side transaction or payment event shows failure / risk rejection.
- License Hub order state, if persisted, remains non-paid or otherwise not eligible for issuance.
- `licenses` has no new active license attributable to this failed payment.
- `webhook_events` may contain the provider event if it reached webhook persistence.

Failure conclusion:

- The observed `Failed payment` / `potentially fraudulent` case belongs to payment provider risk handling and card/payment rejection, not to a License Hub checkout, webhook, magic-link, portal, or validity bug.

## First-Round Failure Path Checklist

### 1. Checkout Opened Then Closed

Trigger:

- Open checkout from the storefront pricing card.
- Close the overlay or hosted checkout before payment completion.

Pass standard:

- User reaches `/paddle/cancel` or an equivalent cancel return path.
- No paid order is created from the abandoned attempt.
- No license is issued from the abandoned attempt.

Evidence:

- Return path and query string.
- Screenshot or page capture of cancel state.
- Read-only query showing no new paid order / license for the attempt.

### 2. Magic Link Expired

Trigger:

- Request a magic link.
- Use the token after its recorded expiration time.

Pass standard:

- Verification fails with the existing expired-token behavior.
- No authenticated portal session is established.
- Token state remains explainable through read-only evidence.

Evidence:

- Redirect or error path.
- `magic_link_tokens.expires_at`.
- `magic_link_tokens.consumed_at` remains unset.

### 3. Magic Link Reused

Trigger:

- Request a magic link.
- Consume it once successfully.
- Click the same link again.

Pass standard:

- First use succeeds.
- Second use fails with the existing used-token behavior.
- Token is not reusable.

Evidence:

- First successful portal entry path.
- Second failure path.
- `magic_link_tokens.consumed_at` is set.

### 4. Portal Access Without Login

Trigger:

- Open `/portal` or `/portal/licenses` without a valid session.

Pass standard:

- User is redirected to `/login`.
- Portal content is not rendered to an unauthenticated user.

Evidence:

- Attempted path.
- Final redirected path.
- Screenshot or response record showing login surface.

### 5. Webhook Failure / Retry Observability

Trigger:

- Use a controlled webhook failure that is safe for the current environment.
- Replay a valid retry for the same business case.

Pass standard:

- Failure is observable as an HTTP failure and, when persistence is reached, `webhook_events.status = error`.
- Retry reaches `processed`.
- Final order / license state is consistent after retry.

Evidence:

- Failure request / response record.
- Retry request / response record.
- Read-only query over `webhook_events` or `ops_webhook_failures`.
- Read-only query confirming final order and license state.

Important note:

- Pure signature failures may return before persistence and therefore may not create a `webhook_events` row.
- For DB-backed observability, prefer a controlled failure that reaches event persistence.

### 6. Existing Payment Failure Archive

Trigger:

- Use the already observed failed payment marked `potentially fraudulent`.

Pass standard:

- Failure is archived as provider-side risk / payment rejection.
- No active License Hub entitlement is inferred.
- No active license is issued from the failed payment.

Evidence:

- Paddle failure / risk state.
- Read-only order lookup if the event reached persistence.
- Read-only license lookup showing no issued active license for the failed payment.

## Ops Baseline Read-Only Minimum

Existing repo sources:

- SQL: [apps/license-hub/sql/license-hub-ops-baseline.sql](../../apps/license-hub/sql/license-hub-ops-baseline.sql)
- Design note: [docs/commercial/license-hub-ops-baseline.md](./license-hub-ops-baseline.md)

Current minimum necessary read-only views:

- `ops_recent_paid_orders`
- `ops_issued_licenses`
- `ops_webhook_failures`
- `ops_magic_link_activity`
- `ops_customer_journey`

Optional manual annotation table, not required for this round:

- `ops_notes`
- Current Neon execution range skips `create table if not exists ops_notes`.
- Current Neon execution range skips `create index if not exists idx_ops_notes_subject`.

Why this is the minimum:

- `ops_recent_paid_orders` confirms paid order state and linked license context.
- `ops_issued_licenses` confirms license issuance, status, edition, and validity window.
- `ops_webhook_failures` isolates failed webhook processing that reached persistence.
- `ops_magic_link_activity` explains requested, expired, and consumed login tokens.
- `ops_customer_journey` reconstructs the customer timeline without adding product authority.
- `ops_notes` is isolated manual annotation only and must not become workflow state.

Recommended landing order:

1. Review the SQL against the target Neon database.
2. Apply `ops_recent_paid_orders`.
3. Apply `ops_issued_licenses`.
4. Apply `ops_webhook_failures`.
5. Apply `ops_magic_link_activity`.
6. Apply `ops_customer_journey`.
7. Defer `ops_notes` unless manual annotations become necessary.
8. Run read-only evidence queries for Sample 2 and the failure samples.

Recommended first queries:

```sql
select *
from ops_recent_paid_orders
order by paid_at desc nulls last
limit 20;
```

```sql
select *
from ops_issued_licenses
where edition = 'pro_plus'
order by issued_at desc
limit 20;
```

```sql
select *
from ops_magic_link_activity
order by requested_at desc
limit 20;
```

```sql
select *
from ops_webhook_failures
order by received_at desc
limit 50;
```

```sql
select *
from ops_customer_journey
where customer_email = '<sample-2-buyer-email>'
order by event_at desc;
```

## Next Execution Order

1. Archive the non-secret Sample 2 pass evidence using the fields in this document.
2. Archive the existing `Failed payment` / `potentially fraudulent` case as payment-provider risk rejection.
3. Run checkout-open-then-close.
4. Run portal access without login.
5. Run magic link reused.
6. Run magic link expired.
7. Run webhook failure / retry observability with a controlled persisted failure.
8. Apply or confirm the read-only ops baseline in Neon.
9. Re-run the read-only queries and attach query outputs to the private evidence bundle.

## Compatibility Conclusion

This closeout stage remains documentation and read-only operations preparation.

- checkout unchanged
- webhook unchanged
- magic link unchanged
- schema unchanged
- signing / validity unchanged
- portal auth unchanged
- `audit` / `permit` / `classify` unchanged
- additive-only
- bounded
- non-executing
- no authority scope expansion
