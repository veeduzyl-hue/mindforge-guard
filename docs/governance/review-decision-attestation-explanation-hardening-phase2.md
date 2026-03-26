# Governance Case Review Decision Attestation Explanation Hardening Phase 2

## Objective

`v6.2 Phase 2` stabilizes the existing
`review decision attestation explanation` boundary.

It does not expand the module. It narrows formation, linkage, export, and
compatibility guarantees so the explanation artifact is harder to misuse and
easier to verify.

## Hardening scope

Phase 2 hardens four areas:

- current attested view uniqueness
- continuity and supersession rejection
- supporting linkage integrity
- additive export and aggregate re-export stability

## Current-view constraints

Current explanation formation now requires:

- a current attestation already exists
- the attestation remains uniquely current
- the attestation remains non-superseded
- the continuity chain remains intact

Current explanation formation rejects:

- superseded attestation state
- broken continuity state
- missing unique-current-view guard

## Supporting linkage integrity

The explanation boundary now freezes strict alignment across:

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

The explanation export surface remains:

- aggregate-export-only
- permit-aggregate-export-only
- non-consuming from the permit lane
- non-executing
- non-authoritative
- non-takeover

`permit` continues to expose the artifact only through aggregate re-export and
does not gain attestation explanation runtime semantics.

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
