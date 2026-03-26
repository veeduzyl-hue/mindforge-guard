# Review Decision Attestation Receipt Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.3 = Governance Case Review Decision Attestation Receipt Boundary v1`.

The attestation receipt artifact is accepted as a bounded governance
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

Final acceptance applies only to the existing attestation receipt boundary
built from:

- aligned attestation profile
- aligned attestation explanation profile
- continuity / supersession grounded current attested view
- bounded selection explanation / selection receipt inputs
- bounded applicability / applicability explanation inputs

The accepted attestation receipt artifact must continue to require:

- attestation existence
- attestation explanation existence
- unique current attested view
- non-superseded current attestation
- continuity-grounded current receipt view
- complete supporting linkage
- strict case / review decision / canonical action hash alignment

The accepted attestation receipt artifact must continue to reject:

- missing attestation
- missing attestation explanation
- superseded current attestation
- broken continuity
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- missing supporting readiness
- authority / execution semantics drift

## Positioning Freeze

The attestation receipt artifact is frozen as:

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

- attestation receipt traceability surface
- signing / cryptographic receipt attestation
- ledger / immutable trace platform behavior
- authority scope expansion
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- main-path takeover

## Release Readiness

`v6.3` is release-ready only when:

- final acceptance verification passes
- attestation receipt hardening verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `spawnSync git EPERM`, Git `safe.directory`
configuration errors, or a temporary worktree missing
`.mindforge/config/policy.json` must be treated as environment problems,
not semantic regressions, when rerun in the initialized repository root
passes.
