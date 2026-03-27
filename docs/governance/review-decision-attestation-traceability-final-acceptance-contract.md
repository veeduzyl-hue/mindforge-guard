# Review Decision Attestation Traceability Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.4 = Governance Case Review Decision Attestation Traceability Boundary v1`.

The attestation traceability artifact is accepted as a bounded governance
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

Final acceptance applies only to the existing attestation traceability boundary
built from:

- aligned attestation profile
- aligned attestation explanation profile
- aligned attestation receipt profile
- continuity / supersession grounded current attested view
- bounded selection explanation / selection receipt inputs
- bounded applicability / applicability explanation inputs

The accepted attestation traceability artifact must continue to require:

- attestation existence
- attestation explanation existence
- attestation receipt existence
- unique current attested view
- non-superseded current attestation
- continuity-grounded current traceability view
- complete supporting linkage
- strict case / review decision / canonical action hash alignment

The accepted attestation traceability artifact must continue to reject:

- missing attestation
- missing attestation explanation
- missing attestation receipt
- superseded current attestation
- broken continuity
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting readiness
- authority / execution / platform drift

## Positioning Freeze

The attestation traceability artifact is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not an observability surface
- not a main-path dependency

Permit aggregate re-export remains allowed only as aggregate export wiring.
It does not grant permit-lane consumption semantics, authority semantics,
execution semantics, audit-path takeover semantics, or platform behavior.

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

- signing / cryptographic trace attestation
- ledger / immutable trace platform behavior
- observability platform behavior
- authority scope expansion
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- main-path takeover

## Release Readiness

`v6.4` is release-ready only when:

- final acceptance verification passes
- attestation traceability hardening verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `spawnSync git EPERM`, Git `safe.directory`
configuration errors, or repository initialization / `cwd` context problems
must be treated as environment problems, not semantic regressions, when rerun
in the initialized repository root passes.
