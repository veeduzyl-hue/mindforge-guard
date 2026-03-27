# Governance Case Review Decision Attestation Applicability Closure Boundary v1

## Scope

`v6.5 Phase 1` establishes the minimum boundary for
`review decision attestation applicability closure`.

The artifact is limited to closing the current bounded
`review decision attestation` against the existing bounded
`review decision applicability` and bounded
`review decision applicability explanation`.

It does not introduce a new governance object family and it does not add
judgment, authority, execution, risk, UI, control-plane, or observability semantics.

## Inputs

The attestation applicability closure boundary only forms from already-established
bounded inputs:

- review decision attestation profile
- review decision applicability profile
- review decision applicability explanation profile

Each input must remain aligned on:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`

## Closure scope

The artifact only records:

- which attestation is being closed against applicability
- which applicability artifact is being closed
- which applicability explanation artifact is being closed
- whether the supporting linkage remains complete and aligned
- whether the attested current view remains continuity-grounded and non-superseded

It does not decide:

- whether the review decision judgment is valid
- whether permit passes
- whether audit verdict changes
- whether enforcement should trigger

## Preserved positioning

The attestation applicability closure artifact is frozen as:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It remains:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not an observability platform
- not a main-path takeover surface

## Export boundary

The export surface is additive-only:

- `caseReviewDecision` provides the primary artifact export
- `permit` only re-exports the artifact through the existing aggregate surface

`permit` does not gain attestation applicability closure consumption semantics.

## Formation requirements

Current attestation applicability closure formation requires:

- attestation already exists
- applicability already exists
- applicability explanation already exists
- attestation remains current and non-superseded
- continuity chain remains intact
- selection explanation linkage remains ready and aligned
- selection receipt linkage remains ready and aligned
- applicability linkage remains aligned
- applicability explanation linkage remains aligned

The boundary rejects:

- missing attestation
- missing applicability
- missing applicability explanation
- broken continuity current views
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting linkage

## Compatibility freeze

The boundary preserves unchanged behavior for:

- audit main output
- audit main verdict
- actual audit exit code
- deny exit code `25`
- `--permit-gate`
- `--enforcement-pilot`
- `--limited-enforcement-authority`
- `guard action classify`
