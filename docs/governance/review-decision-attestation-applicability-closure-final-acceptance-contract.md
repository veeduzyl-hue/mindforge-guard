# Review Decision Attestation Applicability Closure Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.5 = Governance Case Review Decision Attestation Applicability Closure v1`.

The attestation applicability closure artifact is accepted as a bounded
governance support artifact only when it remains:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It does not create a new governance object family and it does not alter the
audit main path.

## Final Acceptance

Final acceptance applies only to the existing attestation applicability closure
built from:

- aligned attestation profile
- aligned applicability profile
- aligned applicability explanation profile
- continuity / supersession grounded current attested view
- bounded current selection / selection explanation / selection receipt inputs
- bounded attestation applicability closure stability requirements

The accepted attestation applicability closure artifact must continue to require:

- attestation existence
- applicability existence
- applicability explanation existence
- unique current attested view
- current closure selection uniqueness
- current closure selection stability
- non-superseded current attestation
- continuity-grounded current closure view
- unambiguous attestation to applicability binding
- unambiguous applicability explanation binding
- complete supporting linkage
- strict case / review decision / canonical action hash alignment

The accepted attestation applicability closure artifact must continue to reject:

- missing attestation
- missing applicability
- missing applicability explanation
- superseded current attestation
- broken continuity
- unstable current selection support
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- closure-selection mismatch
- authority / execution / main-path drift

## Positioning Freeze

The attestation applicability closure artifact is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not an observability surface
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

`v6.5` is release-ready only when:

- final acceptance verification passes
- attestation applicability closure hardening verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `spawnSync git EPERM`, Git `safe.directory`
configuration errors, or repository initialization / `cwd` context problems
must be treated as environment problems, not semantic regressions, when rerun
in the initialized repository root passes.
