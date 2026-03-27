# Governance Case Review Decision Attestation Closure Explanation Boundary v1

## Scope

`v6.6 Phase 1` establishes the minimum boundary for
`review decision attestation closure explanation`.

The artifact is limited to explaining the current bounded
`review decision attestation applicability closure` against the already-bounded
`review decision attestation`, `review decision applicability`, and
`review decision applicability explanation` surfaces.

It does not introduce a new governance object family and it does not add
judgment, authority, execution, risk, UI, control-plane, or runtime semantics.

## Inputs

The attestation closure explanation boundary only forms from already-established
bounded inputs:

- review decision attestation applicability closure profile
- review decision attestation profile
- review decision applicability profile
- review decision applicability explanation profile

Each input must remain aligned on:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`

## Explanation scope

The artifact only records:

- which closure is being explained
- why the current closure selection remains valid
- why the attestation to applicability binding remains unambiguous
- why the applicability explanation alignment remains valid
- why the continuity lineage remains aligned
- why the closure can still be treated as the current bounded supporting-artifact closure

It does not decide:

- whether the review decision judgment is valid
- whether permit passes
- whether audit verdict changes
- whether enforcement should trigger

## Preserved positioning

The attestation closure explanation artifact is frozen as:

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

`permit` does not gain attestation closure explanation consumption semantics.

## Formation requirements

Current attestation closure explanation formation requires:

- attestation applicability closure already exists
- attestation already exists
- applicability already exists
- applicability explanation already exists
- the current closure remains uniquely selected and stable
- the attestation to applicability binding remains unambiguous
- the applicability explanation binding remains aligned
- the continuity lineage remains aligned

The boundary rejects:

- missing closure
- missing attestation
- missing applicability
- missing applicability explanation
- broken current closure validity
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
