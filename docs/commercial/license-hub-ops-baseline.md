# License Hub Ops Baseline

This document defines the minimum manual operations baseline for the live MindForge Guard license hub.

Boundary:

- read-only operations views first
- `ops_notes` table and index deferred for this round
- no admin panel expansion
- no checkout changes
- no billing webhook behavior changes
- no license issuance semantic changes
- no pricing changes
- no large schema refactor

## Design Result

Recommended fixed views:

- `ops_recent_paid_orders`
  - Purpose: fast visibility into recently paid orders, the owning customer, and the latest linked license for manual reconciliation.
- `ops_issued_licenses`
  - Purpose: inspect issued licenses with their order and customer context, including revoke and supersede state.
- `ops_webhook_failures`
  - Purpose: isolate failed webhook processing with customer, order, and license linkage for rapid debugging.
- `ops_magic_link_activity`
  - Purpose: inspect request / expiry / consume state for portal login and license download magic links.
- `ops_customer_journey`
  - Purpose: produce a single customer-centric event stream across order creation, payment, license issuance, and magic link activity.

Deferred optional table:

- `ops_notes`
  - Purpose: manual operator notes attached to an order, license, customer, webhook event, or other support subject without changing product-path tables.
  - Current Neon execution range: skipped.
  - Minimal fields:
    - `id`
    - `subject_type`
    - `subject_id`
    - `note_text`
    - `author_email`
    - `created_at`
    - `updated_at`

## Change Boundary

This ops baseline preserves the existing live path:

- checkout remains unchanged
- billing webhook logic remains unchanged
- license issuance semantics remain unchanged
- pricing remains unchanged
- no admin panel is introduced
- no existing schema is renamed or restructured

Compatibility conclusion:

- compatible
- additive-only
- recommendation-only operational surface
- non-executing
- default-off until the SQL is manually applied
- no authority scope expansion

## SQL Baseline

Apply:

- [apps/license-hub/sql/license-hub-ops-baseline.sql](../../apps/license-hub/sql/license-hub-ops-baseline.sql)

Characteristics:

- all views are read-only selects over existing tables
- `ops_notes` table/index creation is intentionally omitted from the current SQL execution range
- `create or replace view` keeps repeated apply and rollback simple

## Neon Usage

In Neon SQL Editor:

1. Open the target database used by license hub.
2. Paste the contents of `apps/license-hub/sql/license-hub-ops-baseline.sql`.
3. Run the script once.
4. Query the views directly.

Current execution scope:

- Apply `ops_recent_paid_orders`.
- Apply `ops_issued_licenses`.
- Apply `ops_webhook_failures`.
- Apply `ops_magic_link_activity`.
- Apply `ops_customer_journey`.
- Skip `create table if not exists ops_notes`.
- Skip `create index if not exists idx_ops_notes_subject`.

Example queries:

```sql
select *
from ops_recent_paid_orders
order by paid_at desc nulls last
limit 20;
```

```sql
select *
from ops_issued_licenses
where customer_email = 'buyer@example.com'
order by issued_at desc;
```

```sql
select *
from ops_webhook_failures
order by received_at desc
limit 50;
```

```sql
select *
from ops_magic_link_activity
where customer_email = 'buyer@example.com'
order by requested_at desc;
```

```sql
select *
from ops_customer_journey
where customer_email = 'buyer@example.com'
order by event_at desc;
```

## Suggested Operator Patterns

- Use `ops_recent_paid_orders` to confirm a paid order reached the DB and whether a license is already linked.
- Use `ops_issued_licenses` when the user has a public license id and needs subject / order context.
- Use `ops_webhook_failures` first when payment completed externally but license issuance did not happen.
- Use `ops_magic_link_activity` when a portal login complaint is likely token expiry or reuse.
- Use `ops_customer_journey` to reconstruct the sequence for one customer during support handling.
- Do not enable `ops_notes` in this round.
