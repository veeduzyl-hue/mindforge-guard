# Governance Case Review Decision Attestation Closure Receipt Boundary v1

## Summary

`v6.7 phase 1` defines a bounded receipt artifact for the existing `attestation applicability closure` and `attestation closure explanation` surfaces.

The receipt records that the current closure and its current explanation were formed into a machine-verifiable supporting artifact package. It does not introduce a new governance object or a new authority surface.

## Boundary

The attestation closure receipt is limited to:

- current closure packaging
- current closure explanation packaging
- current closure selection confirmation
- current explanation selection confirmation
- closure / explanation linkage confirmation
- bounded aggregate export availability

## Contract Positioning

The receipt is:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

The receipt is not:

- a judgment source
- an authority source
- an execution binding
- a risk source
- a main-path dependency
- a governance object addition
- a control-plane / UI surface

## Required Alignment

The receipt requires aligned:

- `case_id`
- `review_decision_id`
- `canonical_action_hash`
- `closure_id`
- `closure_selection_id`
- `explanation_id`
- `explanation_selection_id`
- `attestation_id`
- `applicability_id`
- `applicability_explanation_id`
- `current_selection_id`

## Compatibility Freeze

This boundary must not change:

- audit main output
- audit main verdict
- actual audit exit code
- deny exit code `25`
- `--permit-gate`
- `--enforcement-pilot`
- `--limited-enforcement-authority`
- `guard action classify`
