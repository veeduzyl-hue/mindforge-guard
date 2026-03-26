# Review Decision Attestation Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.1 = Governance Case Review Decision Attestation Boundary v1`.

The attestation artifact is accepted as a bounded governance support artifact
only when it remains:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It does not create a new governance object family and it does not alter the
audit main path.

## Final Acceptance

Final acceptance applies only to the existing attestation boundary built from:

- current selection final acceptance
- selection explanation final acceptance
- selection receipt final acceptance
- applicability profile
- applicability explanation profile
- aligned selected review decision profile

The accepted attestation artifact must continue to require:

- unique current selected view
- non-superseded current review decision
- continuity-grounded current view
- complete supporting linkage
- strict case / review decision / canonical action hash alignment

The accepted attestation artifact must continue to reject:

- superseded current view
- broken continuity
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting readiness

## Positioning Freeze

The attestation artifact is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not a main-path dependency

Permit aggregate re-export remains allowed only as aggregate export wiring.
It does not grant permit-lane consumption semantics, authority semantics,
execution semantics, or audit-path takeover semantics.

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

- signing / cryptographic attestation
- ledger / immutable trace platform behavior
- authority scope expansion
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- main-path takeover

## Release Readiness

`v6.1` is release-ready only when:

- final acceptance verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `spawnSync git EPERM` or Git `safe.directory`
configuration errors must be treated as environment problems, not semantic
regressions, when rerun outside the restricted environment passes.
