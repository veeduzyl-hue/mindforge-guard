# Review Decision Closure Evidence Package Consumption Summary Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.9 = Governance Case Closure Evidence Package Consumption Summary / Delivery Readiness Boundary v1`.

The accepted surface is the bounded consumption summary / delivery-readiness
layer built on the existing closure evidence package and explanation only.

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
consumption summary built from already-completed supporting artifacts:

- aligned current closure evidence package
- aligned current package explanation stabilized surface
- bounded summary ref linkage
- bounded delivery-readiness reading surface
- bounded summary consumer / export surface

The accepted consumption summary must continue to require:

- package surface availability
- explanation surface availability
- explanation stabilized surface availability
- stable summary ref alignment
- stable explanation stabilized-surface semantics
- stable current narrative selection
- stable narrative section alignment
- stable section artifact binding
- stable section consumer consistency
- stable cross-surface alignment
- stable delivery-readiness interpretation
- stable delivery-readiness consumer consistency
- bounded consumption compatibility

The accepted consumption summary must continue to reject:

- summary ref derivation drift
- cross-case or cross-review binding drift
- explanation stabilized-surface semantics drift
- reason-code allowlist drift
- consumer alignment drift
- cross-surface drift
- authority / execution / main-path drift

## Positioning Freeze

The closure evidence package consumption summary is frozen as:

- not a readiness judgment source
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
- runtime governance object with readiness-decision semantics
- execution takeover
- risk integration
- UI / dashboard / control plane behavior
- permit lane consumption
- main-path takeover

## Release Readiness

`v6.9` consumption summary boundary is ready for release preparation only when:

- consumption summary final acceptance verification passes
- consumption summary hardening verification passes
- consumption summary boundary verification passes
- explanation final acceptance verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit smoke remains unchanged

Environment issues such as `index.lock`, `spawnSync git EPERM`, or Git
permission / initialization problems must be treated as environment problems,
not semantic regressions, when rerun in the initialized repository root passes.
