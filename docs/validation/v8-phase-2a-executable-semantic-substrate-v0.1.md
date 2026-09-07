# V8.0 Phase 2A - Executable Semantic Substrate v0.1

Status: Local Phase 2A acceptance evidence. This is an additive, internal, default-off semantic substrate; it does not complete Gate 2.

## Implemented Scope

- 30/30 MESR Core primitives as machine-readable TypeScript data;
- 24/24 claim boundaries as machine-readable TypeScript data;
- 56/56 existing reason codes bound exactly once to resolved Core and optional Software Domain semantics;
- deterministic five-relation claim-support evaluator;
- pure projection from existing EAK results to MESR semantic results;
- Core, Domain Pack, Crosswalk, and Institutional Profile manifest validation;
- fail-closed module collision rejection and canonical semantic snapshots;
- executable E3-C1 through E3-C4 and E3-D1 through E3-D3 fixtures.

## Executed Results

```text
Initial Claim Stability (E3-C1/C2/C3/C4) = PASS
Initial Composition Stability (E3-D1/D2/D3) = PASS
Runtime Portability (E3-A) = NOT RUN
Cross-Domain Interpretation (E3-B) = NOT RUN
Gate 2 - Semantic Portability Proven = NOT YET
```

The Crosswalk fixtures use explicitly test-only vocabulary. They do not assert real NIST, ISO, AIUC, OWASP, APAAI, or other normative mappings.

## Support Boundary

`does_not_support` is emitted only when a registered claim boundary applies and its additional bindings are incomplete. Missing evidence, unresolved semantic identifiers, incomplete ordinary bindings, or absence of a registered positive/negative relation yields `indeterminate`.

Existing EAK `unsupported` projects to `does_not_support` only when that registered-boundary condition is met; otherwise it projects to `indeterminate`. Existing EAK output is not changed.

## Canonical Semantic Snapshot

The canonical snapshot includes only Core semantic IDs, support relations with satisfied/missing binding status, applied claim boundaries, reason-binding status/required flags, and explicit non-claims. It excludes presentation metadata, non-semantic display order, module descriptions, unrelated timestamps, Crosswalk citation decoration, Profile labels, and external references.

## Compatibility Boundary

The implementation is not imported by the public `packages/guard-core/src/index.ts` and is not connected to `audit`, `permit`, `classify`, Governance Report rendering, or execution. Regression assertions compare the same existing fixture before and after an explicitly requested MESR projection and require deep equality for both the EAK result and Governance Report.

Preserved invariants:

- audit output, verdict, and exit semantics unchanged;
- deny exit code `25` unchanged;
- permit and classify behavior unchanged;
- recommendation-only, additive-only, non-executing, and default-off;
- no authority scope expansion.

## Targeted Verification

```text
npm run verify:mesr:registry
npm run verify:mesr:reason-bindings
npm run verify:mesr:claim-stability
npm run verify:mesr:composition
npm run verify:v8:semantic-foundation:phase2
```

These commands remain targeted and are not added to the canonical global `npm run verify` release baseline.
