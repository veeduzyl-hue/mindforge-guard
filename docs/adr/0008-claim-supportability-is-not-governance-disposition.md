# ADR 0008: Claim Supportability Is Not Governance Disposition

- Status: Accepted for V8.0 Phase 1 architecture

## Context

The existing EAK PoC has supportability-like findings, while the existing Governance Report owns `allow`, `require_review`, `inconclusive`, and `block`. Conflating these layers would turn evidence interpretation into a policy decision or silently change a released report contract.

## Decision

The semantic layer answers:

> What does the evidence support for this subject, scope, time, and provenance?

MESR/EAK v0.1 uses these claim support relations:

- `supports`;
- `partially_supports`;
- `contradicts`;
- `does_not_support`;
- `indeterminate`.

The Governance Report layer continues to use:

- `allow`;
- `require_review`;
- `inconclusive`;
- `block`.

Those report values are downstream governance or institutional dispositions. They are not MESR Core truth and are not execution authorization.

## Compatibility Mapping Rule

There is no one-to-one semantic shortcut from an EAK relation to a report disposition. Any future mapping must be explicit, versioned, deterministic, default-off while experimental, and preserve the existing report contract. Context, profile applicability, missing evidence, and existing governance logic remain visible inputs.

The current EAK PoC status mapping is therefore Phase 2 work. In particular, `unsupported` must not be rewritten to `does_not_support` unless an explicit claim boundary establishes that relation; otherwise it maps to `indeterminate`.

## Consequences

- EAK does not evolve into a Policy Decision Point.
- Governance Report remains the canonical downstream disposition carrier.
- Claim support can be compared across producers and modules without changing report verdict semantics.
- `audit` output, verdict, and exit behavior remain unchanged.
