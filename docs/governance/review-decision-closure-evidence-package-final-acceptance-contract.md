# Review Decision Closure Evidence Package Final Acceptance Contract

## Scope

This document records the final acceptance and compatibility freeze for
`v6.7 = Governance Case Review Decision Closure Receipt / Evidence Package Boundary v1`.

The accepted surface is the bounded combination of:

- closure receipt foundation as package input layer
- closure evidence package as bounded supporting-artifact deliverable surface

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

Final acceptance applies only to the existing closure evidence package built
from already-completed supporting artifacts:

- aligned current attestation applicability closure
- aligned current closure explanation
- aligned current closure receipt
- bounded package manifest / envelope
- bounded package composition rules
- bounded package export and consumption rules

The accepted package must continue to require:

- closure availability
- closure explanation availability
- closure receipt availability
- current receipt selection
- stable current receipt selection
- current closure selection alignment
- current explanation selection alignment
- complete package manifest
- bounded package composition
- bounded package export stability
- linkage-only packaging semantics
- strict case / review decision / canonical action hash alignment

The accepted package must continue to reject:

- missing closure
- missing closure explanation
- missing closure receipt
- cross-case mismatch
- cross-review-decision mismatch
- cross-canonical-action-hash mismatch
- authority / execution / main-path drift

## Positioning Freeze

The closure evidence package is frozen as:

- not a judgment source
- not an authority source
- not an execution binding
- not a risk source
- not a UI / control-plane surface
- not a narrative layer
- not an install-to-value flow
- not an SKU gating implementation
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

`v6.7` is release-ready only when:

- closure evidence package final acceptance verification passes
- closure evidence package boundary verification passes
- closure receipt foundation verification passes
- governance surface verification passes
- governance consumption verification passes
- audit / permit / classify smoke remains unchanged

Environment issues such as `index.lock`, `spawnSync git EPERM`, Git
`safe.directory` configuration errors, or temporary worktree initialization /
missing `.mindforge/config/policy.json` problems must be treated as environment
problems, not semantic regressions, when rerun in the initialized repository
root passes.
