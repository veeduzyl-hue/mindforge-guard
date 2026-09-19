# T2-01 implementation entry review

Date: 2026-09-19. Planning only; owner-review candidate, left uncommitted.
Decision: **T2_01_IMPLEMENTATION_ENTRY_READY**. This is dossier readiness, not implementation authorization or a product verification PASS.

## Recovery and baseline

- T2_01_PLANNING_COMMIT: `56171e4405bc123b8c64aeb3fff747598b489428`.
- T2_01_ENTRY_PRE_CHANGE_HEAD: `56171e4405bc123b8c64aeb3fff747598b489428`.
- Branch: `validation/v8-gate1-t2-01-implementation-entry-v0.1`.
- The preceding planning branch had exactly the three authorized planning files untracked. Only those files were staged, whitespace/scope checked, and committed as `docs(v8): plan T2-01 attributable verification evidence`. The entry branch was created from the clean planning commit.
- Resume recovery: branch, HEAD, short status and last five commits inspected; worktree clean. All three entry documents were `NOT_PRESENT`; no partial content required recovery. No unexpected files.
- Accepted dependency remains Tranche 1 closed with constraints. No historical tests were rerun. Historical wording in the three committed planning documents remains unchanged.

## Interface decision: A preserved, B additive

**A. Existing `verification.occurred` remains unchanged. B. T2-01 adds a private occurrence-side evaluation. C is not selected.** These are compatible decisions about different surfaces.

Source: [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), `evaluateClaims` verification branch, and [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts). Both existing `verification.occurred` and `verification.passed` require complete event/result records, including criterion, input/output witnesses and an admitted result. The canonical verification entry also requires result and limitations. Neither the collector nor selector exposes a general side-module state-basis injection API.

That does not require opening those modules. The private evaluator may establish a narrower factual occurrence annotation while the existing, stronger canonical request remains UNRESOLVED. A complete result can be translated to the existing event shape and evaluated through the existing requirements/`evaluateClaims` route. No occurrence annotation becomes a canonical claim, alias or SUPPORTED state. No fabricated result, criterion, input or limitations makes the stronger request pass.

The pre-interruption concern assumed that the weaker occurrence needed a positive shared claim-state result. The resume instruction explicitly permits a private factual annotation. This dossier adopts that separation; it does not relax T1 semantics. The side result has no primary-state selector. Missing result is neither a failed check nor UNSUPPORTED. Full routing and field predicates are specified in the [serialization contract](../architecture/t2-01-internal-event-result-serialization-v0.1.md).

## Anchor and witness admission

Canonical anchors, semantic version, registry/module digest basis, exact existing predicates, additional private predicates, binding routes, nonclaims and state interactions are recorded per obligation in the serialization contract. Existing anchors are reused. Private source/context association predicates and annotations do not register canonical IDs or extend Core supports.

The [witness dossier](../validation/v8-gate1-t2-01-entry-witness-dossier-v0.1.md) supplies complete synthetic planning declarations for passed, failed and inconclusive results, explicit occurrence-only evidence, missing facts, association failures, conflicting results and execution/count/assertion shortcuts. They are proposed inputs and review expectations, not observations of real checks or executed product fixtures.

## Exact future implementation allowlist

**SUFFICIENT** for this private annotation plus unchanged T1 delegation design:

1. `packages/guard-core/src/mesr/repaired/verificationEvent.ts`: local input/output types, predicates, annotation evaluator and bounded bridge to existing T1 APIs.
2. `scripts/verify_v8_gate1_product_conformance.mjs`: explicitly invoked T2-01 task dispatch, before/after controls, lineage and scope accounting; preserve existing task behavior and pins.
3. `scripts/gate1/b09-product-inputs.mjs`: lossless input translation and independently supplied test trust only; no inferred verification facts.
4. `scripts/gate1/b09-product-compare.mjs`: compare task-owned assertions only; no semantic evaluator or reference-engine copy.
5. `tests/fixtures/gate1/t2-01-controls.v0.1.json`: separately authorized implementation baseline and explicit controls.
6. `tests/fixtures/gate1/t2-01-results.v0.1.json`: actual implementation results, later.
7. `docs/validation/v8-gate1-t2-01-evidence-v0.1.md`: actual implementation evidence, later.

No edits to these paths occurred here. `evaluateClaim.ts`, `claimState.ts`, `requirements.ts`, `contracts.ts`, `composition.ts`, registries, reason bindings and exports need no change for this design. Local private types stay in the new module; richer nested source records are translated to the existing string-valued event representation only where fully bound.

If a future requirement demands that weak occurrence alone yield SUPPORTED for existing `verification.occurred`, or demands a new shared state-basis API, stop with `IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED`. In particular, changing the event-admission branch in `packages/guard-core/src/mesr/repaired/evaluateClaim.ts` would require separate admission and a semantic decision; it is not authorized by READY. Removing Core required bindings is prohibited, not a routine scope extension.

## Future phases and acceptance

1. Boundary start, after explicit implementation authorization: record actual clean pre-change HEAD, admitted seven paths, B09 pins and task-owned case slices; capture actual before results and R-EAK/R-MESR/R-ISOLATION/R-PUBLIC baseline from [plan section 2](21_GATE1_IMPLEMENTATION_PLAN.md). Freeze private fields and annotation semantics without changing T1.
2. Hardening: implement only the local side module and bridge; test every dossier witness and individual missing-field variants, source/namespace/context mismatches, conflict preservation, caller-positive bypass attempts and complete inconclusive versus missing facts. A side-only occurrence must coexist with unchanged stronger-claim missing obligations. Test private-context gates without moving precedence into the wrapper.
3. Acceptance: record actual task assertions, falsifiers, deterministic replay hashes, old report/CLI/SDK byte controls, source/import isolation, unchanged reason values/order and T1/T1-04 noninterference. Run selected regressions once before/after as required; failures remain visible. Preserve B09 and historical review bytes. No whole-case G05 closure from occurrence/result slices.

Implementation planning references the existing T2-01 N/I/E3/H case inventory in [planning admission](24_T2_01_PLANNING_ADMISSION.md); the new witnesses supplement it. No test runner, oracle, Harness, product probe or regression suite was executed in this dossier run. Future PR framing: private attributable occurrence/result side evidence, with unchanged stronger T1 claims. No merge, release, tag or public promotion is implied.

## Boundaries, compatibility and rollback

- T2-01 owns attributable occurrence and exact result only. T2-02 owns exact bytes, digest recomputation, byte equality and integrity proof. T2-03 owns authenticated verifier identity, principal separation, control independence and custody independence.
- Verification occurred != independent; verification result != integrity; verification passed != SUPPORTED automatically; verification passed != authority; verification absent != failed.
- T1-03 remains the only shared six-state selector. T1-04 admission, canonical identity/version/digests, required-binding union, nonclaims and Core noninterference remain intact. No module override or alternate registry.
- G03 remains OPEN. The repository-pinned Harness baseline provides aggregates and producer metadata, not verification events. G05/G07/G06 also remain open; this dossier closes no product gap.
- Audit output/verdict/exit unchanged; deny exit 25 unchanged; permit unchanged; classify unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. EvidencePackV1, GovernanceReport, public CLI/SDK/exports, reason codes, licensing/offline authority, install/demo and v7.0.1 commercial behavior remain unchanged.
- Public migration = NO. Authority expansion = NO. No control-plane, dashboard or orchestration expansion.
- Rollback boundary for this dossier is the planning commit above. Withdraw only these three uncommitted entry documents if rejected; preserve the planning commit. Future implementation records its own accepted rollback commit and uses reviewed revert/removal of its scoped additions, preserving all evidence. No destructive history operations.

## Entry checklist

| Review item | Finding |
|---|---|
| Occurrence/result interface | RESOLVED through A + B; no weaker canonical claim |
| Existing verification.occurred / six-state selector | PRESERVED / PRESERVED |
| Anchors / private serialization / truthful witnesses | PASS / PASS / PASS at planning level |
| Missing-fact preservation / T2-02 / T2-03 / T1-04 | PASS / PASS / PASS / PASS |
| Seven-path allowlist | SUFFICIENT |
| G03 remains open | YES |
| Public migration / authority expansion | NO / NO |
| Product implementation started | NO |

**T2_01_IMPLEMENTATION_ENTRY_READY**. Stop for owner review with exactly three entry documents uncommitted. Readiness does not authorize implementation.
