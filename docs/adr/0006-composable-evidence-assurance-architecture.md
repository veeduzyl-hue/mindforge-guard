# ADR 0006: Composable Evidence Assurance Architecture

- Status: Accepted for V8.0 Phase 1 architecture

## Context

Guard must interpret evidence from multiple producers and domains without copying every external vocabulary into Core or allowing modules to change existing meaning.

## Decision

Adopt this composition model:

```text
Stable Core
+ Additive Domain Packs
+ External Crosswalks
+ Institutional Profiles
```

Core defines meaning. Modules extend context. No module may silently redefine evidence meaning. This invariant is named **Semantic Non-Interference**.

- `core` is the only module type allowed to define `mesr.core.*` meaning.
- `domain_pack` may add domain semantics and bindings in its own namespace.
- `crosswalk` may map an external concept to a MESR semantic ID; it does not inherit or reproduce the external source's normative authority.
- `institutional_profile` may change wording, grouping, presentation, and emphasis only.

## Rejection Rule

A module is invalid if it overrides a Core definition, semantic ID, required binding, claim boundary, support relation, explicit non-claim, or temporal rule. Examples that must be rejected include:

- `verified = approved`;
- `identity_verified = authority_verified`;
- `signature_valid = artifact_true`;
- `framework_mapped = legally_compliant`;
- `assessment_passed = execution_authorized`.

## Consequences

- Adding a Crosswalk or Institutional Profile cannot change `supports_claim()`.
- Domain-specific requirements remain outside the thin Core.
- Future module loading requires deterministic collision detection and fail-closed rejection.
- No module gains verdict, approval, certification, or execution authority.
