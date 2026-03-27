# Governance Case Review Decision Attestation Traceability Boundary v1

## Scope

`v6.4 Phase 1` establishes the minimum boundary for
`review decision attestation traceability`.

The artifact is limited to tracing the current bounded
`review decision attestation`, its bounded
`review decision attestation explanation`, and its bounded
`review decision attestation receipt`.

It does not introduce a new governance object family and it does not add
judgment, authority, execution, risk, UI, observability-platform, or trace-platform semantics.

## Inputs

The attestation traceability boundary only forms from already-established
bounded inputs:

- review decision attestation profile
- review decision attestation explanation profile
- review decision attestation receipt profile

Each input must remain aligned on:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`

## Traceability scope

The artifact only records:

- which attestation is being traced
- which attestation explanation is being traced
- which attestation receipt is being traced
- whether the supporting linkage remains complete
- whether the attested current view remains continuity-grounded and non-superseded

It does not decide:

- whether the review decision judgment is valid
- whether permit passes
- whether audit verdict changes
- whether enforcement should trigger

## Preserved positioning

The attestation traceability artifact is frozen as:

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
- not a trace platform
- not a main-path takeover surface

## Export boundary

The export surface is additive-only:

- `caseReviewDecision` provides the primary artifact export
- `permit` only re-exports the artifact through the existing aggregate surface

`permit` does not gain attestation traceability consumption semantics.

## Formation requirements

Current attestation traceability formation requires:

- attestation already exists
- attestation explanation already exists
- attestation receipt already exists
- attestation remains current and non-superseded
- continuity chain remains intact
- attestation explanation linkage remains complete and aligned
- attestation receipt linkage remains complete and aligned
- selection explanation linkage remains ready and aligned
- selection receipt linkage remains ready and aligned
- applicability linkage remains aligned
- applicability explanation linkage remains aligned

The boundary rejects:

- missing attestation
- missing attestation explanation
- missing attestation receipt
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
