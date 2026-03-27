# Review Decision Attestation Closure Explanation Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.6 = Governance Case Review Decision Attestation Closure Explanation Boundary v1`.

The attestation closure explanation artifact is accepted as a bounded governance
support artifact only when it remains:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It does not create a new governance object family and it does not alter the
audit main path.

## Final Acceptance

Final acceptance applies only to the existing attestation closure explanation
built from:

- aligned attestation applicability closure profile
- aligned attestation profile
- aligned applicability profile
- aligned applicability explanation profile
- continuity / supersession grounded current closure view
- bounded current selection and supporting linkage inputs
- bounded explanation selection and consumption requirements

The accepted attestation closure explanation artifact must continue to require:

- closure existence
- attestation existence
- applicability existence
- applicability explanation existence
- unique current explanation selection
- stable current explanation selection
- unique current closure selection
- stable current closure selection
- closure selection alignment
- attestation selection alignment
- unambiguous attestation to applicability binding
- applicability explanation alignment
- continuity lineage alignment
- complete supporting linkage
- strict case / review decision / canonical action hash alignment

The accepted attestation closure explanation artifact must continue to reject:

- missing closure
- missing attestation
- missing applicability
- missing applicability explanation
- non-unique current explanation selection
- unstable current explanation selection
- unstable current closure selection support
- unstable applicability selection context
- unstable applicability explanation selection context
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- explanation-selection mismatch
- authority / execution / main-path drift

## Positioning Freeze

The attestation closure explanation artifact is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not a main-path dependency

Permit aggregate re-export remains allowed only as aggregate export wiring.
It does not grant permit-lane consumption semantics, authority semantics,
execution semantics, audit-path takeover semantics, or compatibility drift.

## Compatibility Freeze

The following are frozen unchanged:

- audit main output
- audit main verdict
- actual audit exit code
- deny exit code `25`
- `--permit-gate`
- `--enforcement-pilot`
- `--limited-enforcement-authority`
- `guard action classify`

The following remain prohibited:

- new governance object behavior
- authority scope expansion
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- permit lane consumption
- main-path takeover

## Release Readiness

`v6.6` is release-ready only when:

- final acceptance verification passes
- attestation closure explanation hardening verification passes
- attestation closure explanation boundary verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `index.lock`, `spawnSync git EPERM`, Git
`safe.directory` configuration errors, or repository initialization / `cwd`
context problems must be treated as environment problems, not semantic
regressions, when rerun in the initialized repository root passes.
