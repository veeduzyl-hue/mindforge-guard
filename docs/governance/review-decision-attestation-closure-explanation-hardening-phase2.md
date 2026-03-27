# Governance Case Review Decision Attestation Closure Explanation Hardening Phase 2

## Scope

`v6.6 Phase 2` hardens the existing
`review decision attestation closure explanation` boundary by freezing
explanation consistency and current-selection stability.

The phase does not add a new governance object family and does not expand the
artifact into judgment, authority, execution, risk, UI, control-plane, or
main-path semantics.

## Hardening targets

Phase 2 freezes:

- current explanation selection as unique and stable
- closure selection alignment as machine-verifiable
- attestation selection alignment as machine-verifiable
- applicability / applicability explanation current-selection alignment as required
- explanation consumption as bounded supporting-artifact output only

## Preserved positioning

The artifact remains:

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
- not a permit lane consumer
- not a main-path takeover surface

## Compatibility freeze

Phase 2 preserves unchanged behavior for:

- audit main output
- audit main verdict
- actual audit exit code
- deny exit code `25`
- `--permit-gate`
- `--enforcement-pilot`
- `--limited-enforcement-authority`
- `guard action classify`

## Rejected drift

The phase rejects:

- non-unique current explanation selection
- unstable closure selection context
- unstable applicability selection context
- unstable applicability explanation selection context
- explanation consumer selection mismatch
- authority / execution / main-path drift
