# Governance Case Review Decision Attestation Explanation Boundary v1

## Scope

`v6.2 Phase 1` establishes the minimum boundary for
`review decision attestation explanation`.

The artifact is limited to explaining why the current bounded
`review decision attestation` exists and which already-bounded supporting
artifacts it depends on.

It does not introduce a new governance object family and it does not add
judgment, authority, execution, risk, or UI semantics.

## Inputs

The attestation explanation boundary only forms from already-established
bounded inputs:

- review decision attestation profile
- selection explanation final acceptance
- selection receipt final acceptance
- review decision applicability profile
- review decision applicability explanation profile

Each input must remain aligned on:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`

## Explanation scope

The artifact only explains:

- why the current attestation is available
- why the supporting linkage remains complete
- why the current selection line stays aligned
- why continuity and supersession still support the attested current view

It does not decide:

- whether the review decision judgment is valid
- whether permit passes
- whether audit verdict changes
- whether enforcement should trigger

## Preserved positioning

The attestation explanation artifact is frozen as:

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
- not a main-path takeover surface

## Export boundary

The export surface is additive-only:

- `caseReviewDecision` provides the primary artifact export
- `permit` only re-exports the artifact through the existing aggregate surface

`permit` does not gain attestation explanation consumption semantics.

## Formation requirements

Current attestation explanation formation requires:

- attestation already exists
- attestation remains current and non-superseded
- continuity chain remains intact
- selection explanation linkage remains ready and aligned
- selection receipt linkage remains ready and aligned
- applicability linkage remains aligned
- applicability explanation linkage remains aligned

The boundary rejects:

- missing attestation
- broken continuity current views
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting readiness

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
