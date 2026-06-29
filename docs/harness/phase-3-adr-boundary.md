# Harness Phase 3 ADR Boundary

## Purpose

This document freezes the Harness Phase 3 ADR boundary.
It is a planning and decision-boundary artifact only.
It is not a Phase 3 implementation document and does not authorize runtime work.

This boundary preserves Guard as a deterministic governance evidence layer that remains recommendation-only, additive-only, non-executing, non-control-plane, verification-only, and human-review-oriented.
It does not grant approve, block, deploy, certify, or execution-control authority.

## Source Route Review

The current route review conclusion is:

```text
Ready for implementation: no
```

That conclusion means the current path allows ADR and planning work only.
It does not allow Harness Phase 3 implementation to begin.

## Current Baseline

The current `main` baseline is:

```text
schema / fixtures
-> normalizer / renderer
-> contract validator
-> snapshot regression
-> reviewer packet
-> closeout boundary summary
-> phase 3 planning boundary draft
```

The baseline also remains true in the following ways:

- Phase 2 evidence loop completed a local preview surface.
- Phase 3 currently exists only as a planning draft.
- Harness verifiers remain standalone and default-off.
- `npm run verify` has not been expanded.
- `packages/guard/**` remains unchanged.
- `README.md` remains unchanged.
- `package.json` remains unchanged.
- `review/ramen-v5-freeze` remains independent.

## ADR Candidate Scope

This document lists ADR candidates only.
It does not implement any of them.

- evidence pack abstraction
- external adapter review workflow
- reviewer packet UX
- deterministic artifact retention policy
- preview-to-core promotion gate
- adapter compatibility contract

## ADR Entry Criteria

Any Phase 3 ADR should satisfy all of the following before it is accepted:

- route review accepted
- scope is non-runtime
- no `packages/guard/**` mutation
- no README positioning drift
- no `package.json` script expansion
- no ramen dependency
- no live external API dependency
- deterministic fixtures or examples are available if later needed
- rollback or rejection path is explicit

## Implementation Gate

Implementation must not begin unless all of the following are satisfied in addition to ADR entry:

- approved ADR
- explicit non-runtime implementation scope
- clear files allowed list
- standalone verifier plan
- no inclusion in `npm run verify` unless separately approved
- no authority expansion
- no runtime adapter dependency
- no Guard CLI wiring unless separately approved
- no `packages/guard/**` changes unless separately approved

## Explicit Non-Goals

Harness Phase 3 ADR work does not include:

- no runtime enforcement
- no production integration
- no Guard CLI wiring
- no approval or block authority
- no deployment or certification authority
- no control-plane behavior
- no live external API
- no ramen promotion
- no npm release
- no public announcement

## Runtime Boundary

This ADR boundary does not modify the following surfaces:

```text
packages/guard/**
audit
permit
classify
Guard runtime
Guard CLI
main README product narrative
package.json
```

This boundary also preserves `audit` output, verdict semantics, and exit semantics unchanged, with `permit` and `classify` behavior unchanged unless a later scope explicitly says otherwise.

## Adapter Boundary

External signed receipts may be used only as review evidence.
They are not a Guard standard, runtime dependency, certification path, or control-plane interface.

Any adapter-oriented ADR must keep adapters bounded to reviewer support and deterministic evidence handling.
No adapter may become approval authority, blocking authority, deployment authority, or execution-control authority through Phase 3 ADR work.

## Ramen Dependency Boundary

```text
review/ramen-v5-freeze remains an independent review branch.
ramen-receipt-v5 remains one example only.
Phase 3 ADR work must not depend on ramen promotion.
Any adapter-specific expansion should wait for Damian feedback.
```

This means ramen may inform later review discussion, but it does not enter `main` as a promoted runtime capability, certification path, or Guard-owned standard.

## Verification Expectations

The current verification surface that should continue to run is:

```bash
npm run verify:harness-phase2:evidence
npm run verify:harness-phase2:normalizer
npm run verify:harness-phase2:contract
npm run verify:harness-phase2:snapshots
npm run verify:harness-phase2:reviewer-packet
npm run verify
git diff -- packages/guard
git diff -- README.md
git diff -- package.json
```

No new verifier is introduced by this ADR boundary.
The active schema verifier remains `scripts/verify_harness_phase2_external_evidence_schema.mjs`.
This document does not rely on or reference a nonexistent `scripts/verify_harness_phase2_evidence_ingestion.mjs`.

## Decision Status

```text
Phase 3 implementation is not approved.
ADR planning is allowed.
Runtime promotion is not approved.
Ramen promotion is not approved.
```

## Recommendation

The next step should be ADR work only.
Implementation should remain blocked until a later ADR is approved with an explicit non-runtime scope, unchanged-surface protections, and a standalone verification plan.

This recommendation preserves Guard compatibility, keeps authority scope unchanged, avoids runtime drift, and maintains the current review-only posture.
