# Governance Case Review Decision Continuity & Supersession Boundary v1

`v5.6 Phase 1` freezes a bounded continuity and supersession layer for
`governance_case_review_decision` on top of the released `v5.5.0` baseline.

## Boundary

- review decision continuity remains a case-supporting governance artifact
- continuity does not create a new top-level governance object
- continuity remains recommendation-only
- continuity remains additive-only
- continuity remains non-executing
- continuity remains default-off
- continuity does not perform routing
- continuity does not perform finalization
- continuity does not expand authority scope
- continuity does not take over the audit main path
- continuity does not introduce risk integration
- continuity does not add UI or control-plane behavior

## Additive Continuity Fields

- `review_decision_id`
- `supersedes_review_decision_id`
- `superseded_by_review_decision_id`
- `review_decision_sequence`
- `continuity_mode`
- `supersession_reason`

## Bounded Continuity Modes

- `standalone`
- `superseding`
- `superseded`
- `parallel`

## Supersession Rules

- `supersedes_review_decision_id` must not self-reference
- supersession chains must not form cycles
- under the same `case_id` and `canonical_action_hash`, sequence must not regress
- `superseding` decisions must explicitly reference a prior review decision
- `superseded` decisions must not remain current
- `parallel` decisions are only legal in bounded peer-review scenarios
- illegal competing supersession of the same predecessor is rejected
- continuity breaks across `case_id` or `canonical_action_hash` reject supersession

## Preserved Runtime Semantics

- audit main output unchanged
- audit main verdict unchanged
- actual audit exit code unchanged
- deny exit code `25` unchanged
- `--permit-gate` unchanged
- `--enforcement-pilot` unchanged
- `--limited-enforcement-authority` unchanged
- `guard action classify` unchanged
