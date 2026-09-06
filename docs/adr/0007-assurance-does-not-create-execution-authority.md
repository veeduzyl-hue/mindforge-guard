# ADR 0007: Assurance Does Not Create Execution Authority

- Status: Accepted for V8.0 Phase 1 architecture

## Context

Evidence verification and assurance vocabulary can be mistaken for approval or permission. Guard already preserves a recommendation-only, non-executing boundary; V8.0 must make the boundary machine-testable as semantic capabilities expand.

## Decision

No EAK result or assurance artifact can automatically become:

- permit or deny authority;
- approval or execution permission;
- runtime blocking or enforcement;
- certification;
- legal compliance determination.

This applies to `supports`, `partially_supports`, `contradicts`, `does_not_support`, `indeterminate`, missing evidence, assurance posture, residual uncertainty, and every Governance Report disposition.

Guard verifies consequential transitions. Guard does not execute, approve, authorize, certify, or own them.

## Enforcement Of The Decision

- MESR entries must state explicit non-claims.
- EAK outputs must contain claim-support relations, not execution commands.
- Module manifests must prohibit authority-producing overrides.
- Institutional Profiles must not alter semantic outcomes.
- Any future execution-adjacent consumer remains separate, explicit, default-off, and outside this V8.0 semantic layer.

## Consequences

Existing `audit`, `permit`, and `classify` behavior remains unchanged. Deny exit code `25` remains unchanged. No new runtime enforcement, network service, or hidden policy path is introduced by this ADR.
