# Review Decision Closure Evidence Package Explanation Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.8 = Governance Case Closure Evidence Package Explanation / Narrative Boundary v1`.

The accepted surface is the bounded explanation / narrative layer built on the
existing closure evidence package only.

The accepted surface remains:

- derived-only
- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It does not create a new governance authority object and it does not alter the
audit main path.

## Final Acceptance

Final acceptance applies only to the existing closure evidence package
explanation built from already-completed supporting artifacts:

- aligned current closure evidence package
- aligned current narrative selection
- bounded narrative sections
- bounded interpretation surface
- bounded section-to-artifact linkage
- bounded explanation consumer / export surface

The accepted explanation must continue to require:

- package availability
- current narrative selection
- unique current narrative requirement
- stable current narrative selection
- complete narrative sections
- stable narrative section alignment
- stable section artifact binding
- stable section consumer consistency
- stable cross-surface alignment
- bounded interpretation surface
- bounded consumption compatibility

The accepted explanation must continue to reject:

- missing package
- unstable current narrative selection
- narrative selection mode drift
- section interpretation drift
- section-to-artifact mismatch
- consumer alignment drift
- cross-surface drift
- authority / execution / main-path drift

## Positioning Freeze

The closure evidence package explanation is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not a new governance authority object
- not a permit lane consumer
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

- authority scope expansion
- runtime governance object with decision semantics
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- permit lane consumption
- main-path takeover

## Release Readiness

`v6.8` explanation boundary is ready for release preparation only when:

- explanation final acceptance verification passes
- explanation hardening verification passes
- explanation boundary verification passes
- closure evidence package boundary verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit smoke remains unchanged

Environment issues such as `index.lock`, `spawnSync git EPERM`, or Git
permission / initialization problems must be treated as environment problems,
not semantic regressions, when rerun in the initialized repository root passes.
