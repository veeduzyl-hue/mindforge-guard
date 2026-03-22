# Governance Case Review Decision Boundary v1

`v5.5 Phase 1` freezes a minimal governance case review decision boundary on top of
the released `v5.4.0` evidence baseline.

## Boundary

- review decision is a case-supporting governance artifact
- review decision is not a new top-level governance object
- review decision is recommendation-only
- review decision is additive-only
- review decision is non-executing
- review decision is default-off
- review decision does not trigger execution
- review decision does not perform routing
- review decision does not perform finalization
- review decision does not expand authority scope
- review decision does not take over the audit main path
- review decision does not perform risk judgment
- review decision does not add UI or control-plane behavior

## Continuity

- continuity validation is limited to linkage validation
- canonical lineage must match the case evidence continuity chain
- `case_id` must match the case evidence continuity chain
- `linked_evidence_ids` must include the canonical evidence link for the case
- `linked_resolution_ids` must match the linked evidence continuity chain
- `linked_escalation_ids` must match the linked evidence continuity chain
- `linked_closure_ids` must match the linked evidence continuity chain
- bounded `review_status` values are restricted to:
  - `accepted`
  - `rejected`
  - `needs_more_evidence`
  - `maintain_escalation`
- bounded `evidence_sufficiency` values are restricted to:
  - `sufficient`
  - `insufficient`
  - `inconclusive`

## Preserved Runtime Semantics

- audit main output unchanged
- audit main verdict unchanged
- actual audit exit code unchanged
- deny exit code `25` unchanged
- `--permit-gate` unchanged
- `--enforcement-pilot` unchanged
- `--limited-enforcement-authority` unchanged
- `guard action classify` unchanged
