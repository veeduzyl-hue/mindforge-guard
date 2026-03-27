# Governance Case Review Decision Attestation Traceability Hardening Phase 2

## Objective

`v6.4 Phase 2` stabilizes the existing
`review decision attestation traceability` boundary.

It does not expand the module. It narrows formation, linkage, export, and
compatibility guarantees so the traceability artifact is harder to misuse and
easier to verify.

## Hardening scope

Phase 2 hardens four areas:

- current attested view uniqueness
- attestation explanation alignment
- attestation receipt alignment
- supporting linkage integrity
- additive export and aggregate re-export stability

## Current-view constraints

Current traceability formation now requires:

- a current attestation already exists
- the attestation remains uniquely current
- the attestation explanation remains available and aligned
- the attestation receipt remains available and aligned
- the attestation remains non-superseded
- the continuity chain remains intact

Current traceability formation rejects:

- superseded attestation state
- broken continuity state
- missing unique-current-view guard
- missing attestation explanation alignment
- missing attestation receipt alignment

## Supporting linkage integrity

The traceability boundary now freezes strict alignment across:

- attestation
- attestation explanation
- attestation receipt
- selection explanation
- selection receipt
- applicability
- applicability explanation

Alignment remains bounded by:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`

The boundary rejects:

- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting readiness
- supporting semantics that drift toward authority or execution

## Export stabilization

The traceability export surface remains:

- aggregate-export-only
- permit-aggregate-export-only
- non-consuming from the permit lane
- non-executing
- non-authoritative
- non-takeover

`permit` continues to expose the artifact only through aggregate re-export and
does not gain attestation traceability runtime semantics.

## Compatibility freeze

Phase 2 preserves unchanged behavior for:

- audit main output
- audit main verdict
- actual audit exit code
- deny exit code `25`
- `--permit-gate`
- `--enforcement-pilot`
- `--limited-enforcement-authority`
- `guard action classify`

It also preserves:

- no new governance object
- no authority scope expansion
- no execution semantics
- no risk integration
- no UI / control plane
- no main-path takeover
- no signing / cryptographic trace seal
- no ledger / immutable trace platform
- no observability platform behavior
