# Harness Phase 3 Planning Boundary Draft

## Purpose

This document is a Harness Phase 3 planning draft.
It defines the proposed planning boundary for the next Harness step and is not an implementation document.

This draft does not introduce runtime code, verifier changes, package script changes, Guard CLI wiring, production integration, or release readiness claims.
It exists to freeze scope, preserve compatibility, and decide whether a later Phase 3 implementation should begin at all.

## Phase 2 Baseline

Harness Phase 2 completed the current bounded review-evidence loop:

`schema / fixtures`
`-> normalizer / renderer`
`-> contract validator`
`-> snapshot regression`
`-> reviewer packet`
`-> closeout boundary summary`

The completed baseline remains deterministic, recommendation-only, additive-only, non-executing, verification-only, non-control-plane, and human-review-oriented.
Phase 2 established a bounded review evidence surface without changing Guard runtime behavior.

## Phase 3 Candidate Directions

Phase 3 should remain planning-first.
The current candidate directions are listed for review only and are not implemented by this draft:

- adapter review workflow hardening
- reviewer packet ergonomics
- fixture expansion
- evidence pack diffing
- reviewer-facing comparison views
- Phase 3 architecture decision record
- external adapter review after Damian feedback

These candidates should remain bounded to deterministic review evidence and reviewer support surfaces.
None of them should become runtime authority, approval power, deployment control, certification control, or control-plane behavior.

## Entry Criteria

Harness Phase 3 implementation should not begin until all of the following are true:

- Phase 2 PRs are merged and verified
- `main` is clean
- Guard runtime remains untouched
- README product narrative remains unchanged
- an explicit scope document is approved
- there is no dependency on ramen review outcome unless the proposed work is adapter-specific
- there is no control-plane authority expansion

If those criteria are not met, the correct next step is planning clarification rather than implementation.

## Explicit Non-Goals

Harness Phase 3 planning does not include:

- no runtime enforcement
- no production integration
- no Guard CLI wiring
- no approval / block authority
- no deployment / certification authority
- no live external API
- no ramen promotion
- no npm release
- no public announcement

This draft also does not claim production readiness, runtime enforcement readiness, control-plane behavior, or execution approval authority.

## Runtime Boundary

Harness Phase 3 planning must not modify `packages/guard/**`.
It must not modify `audit`, `permit`, or `classify`.
It must not change Guard runtime behavior, CLI semantics, output contracts, verdict semantics, exit behavior, or the main verification path.

Any future Phase 3 implementation must remain outside the Guard runtime unless a later, separately approved scope explicitly says otherwise.

## External Adapter Boundary

External signed receipts may be used only as review evidence.
An adapter must not become a Guard standard, runtime dependency, certification path, approval path, deployment path, or control plane.

Any future adapter-specific work must preserve the evidence-layer posture:

- review evidence only
- deterministic where applicable
- human-review-oriented
- recommendation-only
- additive-only
- non-executing

## Ramen Review Dependency

`review/ramen-v5-freeze` remains an independent review branch.
`ramen-receipt-v5` remains one example only.
Phase 3 planning should not depend on ramen promotion.
Any adapter-specific expansion should wait for Damian feedback.

This means the existence of ramen review materials may inform later comparison or adapter-specific planning, but they do not gate the Phase 3 planning draft itself and do not enter `main` as a promoted runtime capability.

## Human Review Model

Harness Phase 3 should remain human-review-oriented.
It may improve reviewer clarity, evidence presentation, comparison surfaces, or review workflow hardening, but it must not replace human judgment.

Phase 3 should not emit a final governance verdict.
It should not create approval, blocking, deployment, certification, or execution-control authority.
It should continue to support human inspection, reviewer follow-up, and bounded evidence interpretation only.

## Compatibility Requirements

This planning draft preserves Guard compatibility. It does not change audit, permit, classify, Guard runtime, packages/guard/**, package.json, or the main README product narrative.

This draft also preserves recommendation-only, additive-only, non-executing, default-off where applicable, and no authority scope expansion.

## Open Questions

- Which single reviewer-facing outcome should be the primary Phase 3 objective: workflow hardening, comparison views, or ADR freeze?
- Should evidence pack diffing be treated as a reviewer aid only, or deferred until an architecture decision record narrows its contract?
- Which candidate directions can be verified with isolated standalone scripts without altering `npm run verify`?
- What exact adapter boundary language should be frozen before any post-Damian adapter-specific work begins?
- Which reviewer packet ergonomics changes are valuable enough to justify a Phase 3 implementation rather than remaining planning-only?

## Recommendation

The recommended next step is to complete Phase 3 planning and an accompanying architecture decision record before any runtime-adjacent or adapter-specific implementation begins.

The primary conclusion is:

- do planning first
- freeze the Phase 3 boundary in writing
- choose one bounded reviewer-facing objective
- defer implementation until scope approval is explicit

This keeps the Harness line aligned with Guard posture, preserves compatibility, avoids authority drift, and prevents accidental promotion of external adapter review work into main-path product behavior.
