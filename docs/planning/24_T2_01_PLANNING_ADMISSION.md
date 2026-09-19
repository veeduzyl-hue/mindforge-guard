# T2-01 planning admission

Date: 2026-09-19. Planning only; uncommitted for owner review.
Decision: **T2_01_IMPLEMENTATION_PLANNING_READY_WITH_BLOCKERS**.
Readiness does not authorize implementation.

## Baseline and dependency readiness

- Branch: planning/v8-gate1-tranche2-t2-01-v0.1.
- TRANCHE_1_FORMAL_CLOSURE_COMMIT: e82bf33ca54187d889e534a92514096e26379c12.
- T2_01_PLANNING_PRE_CHANGE_HEAD: e82bf33ca54187d889e534a92514096e26379c12; clean before these documents.
- Accepted dependency: TRANCHE_1_CLOSED_WITH_CONSTRAINTS and TRANCHE_2_PLANNING_ADMISSIBLE. G02/G08 are CLOSED within admitted foundational/finite scope. G05/G07/G06/G03 remain OPEN.
- The two closure documents were committed without rewriting. Their original uncommitted wording remains historical. No Tranche-1 validation was repeated.

## Canonical task card

Source: [canonical plan](21_GATE1_IMPLEMENTATION_PLAN.md#t2-01---attributable-verification-occurrence-and-result), T2-01 and inherited sections 1-3; [change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md).

| Field | Canonical extraction |
|---|---|
| Exact title | T2-01 - Attributable verification occurrence and result |
| Gap | G05 |
| Objective | Evaluate event occurrence/result with subject/scope/method/event time/output refs; preserve producer-attributed result separately from successful independent checking. |
| Why now | Command exit and aggregate labels cannot supply the event basis for independence. |
| Dependency | Tranche 1 exit; satisfied by accepted closure with constraints. |
| Sources | B03 R3/R4/R7; B05/ADR 0013; B02/ADR 0011. Exact links in planning evidence. |
| Product surface | packages/guard-core/src/mesr/repaired/verificationEvent.ts |
| Test/evidence surfaces | Exact six paths listed below, inherited from section 3. |
| Positive cases | N02, E3-A.ci, E3-A.harness_style, E3-B.producer occurrence/result portions; complete passed/failed/inconclusive controls. |
| Negative/falsifier cases | N01, N12.missing, I04, I05.failed, I05.skipped, I12.subject, I12.scope, I12.time, I13, I14.missing, I16; E3-A.ci.execution_only, E3-A.harness_style.execution_only, E3-B.absent; H09/H10/H26/H27/H29/H32. |
| Required regressions | R-EAK + R-MESR + R-ISOLATION + R-PUBLIC; exact commands in plan section 2, future implementation only. |
| Non-goals | No Harness normalization, fabricated check from counts, independence promotion or EAK buildVerifications edit. |
| Compatibility | Every plan section 2 row; no schema/report/reason/public API migration, old source/enum edit or package version bump. |
| Default-off | Explicit new internal invocation only; no old caller/export/CLI/automatic artifact changes. |
| Rollback condition | Missing/cross-context event supports a result; command exit becomes a check; old EAK bytes change; any material boundary violation or unexpected regression. Specification defects require SPECIFICATION_REOPEN_REQUIRED, not oracle relaxation. |
| Completion evidence | Bound occurrence/result with exact old values retained and no invented event/independence; before/after source/artifact hashes, commands/exits, case IDs/asserted fields, falsifiers, replays, remaining gaps, diff/allowlist, compatibility/authority reviews, whitespace check and rollback commit. |
| Reversibility | Reviewed removal/revert only of task side modules/call sites; preserve old behavior, all before/after evidence and B09 bytes. No data migration or historical rewrite. |

## Scope, inputs, available and missing facts

T2-01 owns attributable verification occurrence and result only. The [candidate contract](../architecture/t2-01-attributable-verification-occurrence-result-contract-v0.1.md) defines their minimum basis. The [field inventory](../validation/v8-gate1-t2-01-planning-evidence-v0.1.md#fieldsource-inventory) classifies every fact and its availability.

Inputs are explicitly supplied offline records: event identity, subject/revision, scope, checked property, method/version, actual event time, event/output references and producer/checker attribution. Result adds exact outcome, criterion, inputs, outputs and limitations. Canonical verification_id/status/artifact_refs and producer metadata can preserve declarations; structure alone does not supply the missing event associations. Command/type/coverage labels are not automatically method/criterion/scope.

Missing event facts remain missing. No generated ID, current clock, producer ID, empty witness, guessed criterion or default result fills gaps. Supplied assertions retain their provenance and limitations; they are not automatically authenticated.

Occurrence and result are separate dimensions: no attributable occurrence; occurrence established; occurrence with bound result; occurrence with unresolved result. These are planning descriptions, not new primary states. Neither occurrence nor pass selects SUPPORTED. T1-03 remains the sole shared selector; T1-04 preserves canonical identity, bindings, nonclaims, precedence and Core noninterference. No new canonical ID, silent alias or support widening.

## Deferrals and G03

- DEFER_TO_T2_02: exact bytes/domains/counts, expected/observed digests and recomputation/equality assurance. Subject/digest references here are declarations.
- DEFER_TO_T2_03: verified principal identity, separation/control predicates, independence and custody. Event-bound attribution remains required here; independent-principal proof is not T2-01 success.
- G03 stays OPEN. B03's pinned Harness 0.5.0 baseline has aggregate counts/paths, not canonical verification events. Enriched event mapping and actual integration require separate admission. No external Harness checkout was audited here.
- G07 current standing and G06 sufficiency/report association remain later tasks. Historical event association does not establish current applicability. G05 is not closed by this planning slice.

## Implementation allowlist candidate

Future paths only; none may be edited in this planning run:

1. packages/guard-core/src/mesr/repaired/verificationEvent.ts
2. scripts/verify_v8_gate1_product_conformance.mjs
3. scripts/gate1/b09-product-inputs.mjs
4. scripts/gate1/b09-product-compare.mjs
5. tests/fixtures/gate1/t2-01-controls.v0.1.json
6. tests/fixtures/gate1/t2-01-results.v0.1.json
7. docs/validation/v8-gate1-t2-01-evidence-v0.1.md

Reuse T1 without modifying its files. Shared test changes translate structure and compare results only, never insert semantic decisions or invented facts. Additional implementation paths require separate admission. Planning evidence is distinct from future implementation evidence.

## Test/evidence plan candidate and rollback

After separate implementation authorization:

1. Boundary: freeze the task-local dossier against existing anchors/versions/digests, named predicates, bindings/nonclaims and source pointers. Record actual implementation pre-change HEAD, before observations and selected regression baseline.
2. Hardening: implement only the private event/result surface and exact card slices. Author complete pass/fail/inconclusive inputs explicitly; omit mandatory facts individually; test cross-context joins, conflicting results and aggregate/exit/report shortcuts. Preserve pending integrity/independence/currentness/sufficiency obligations. Exercise T1-03 delegation and T1-04 noninterference without a second selector.
3. Acceptance: record every task-owned assertion, falsifier and before/after result; run the four selected regression suites and legacy JSON/Markdown/HTML/index controls for all report dispositions, parser/validator rejections, reason ordering, import isolation and no default caller. Tranche-exit replay obligations remain at tranche exit. No whole-case closure from partial slices. No such execution occurred here.

Proposal rollback boundary: e82bf33ca54187d889e534a92514096e26379c12. A future implementation records its actual accepted pre-change commit. Withdraw only reviewed new side paths/call sites, preserving T1 and evidence. No reset/history rewrite or schema/data migration. A fourth planning path is not admitted.

## Public compatibility and authority

Audit output/verdict/exit unchanged; deny 25 unchanged; permit behavior unchanged; classify behavior unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. EvidencePackV1 1.0.0, parser/validator, 56 reason values/order/emitters, GovernanceReportModel 1.0.0/dispositions, public CLI/SDK/exports, existing MESR/EAK, licensing/offline authority, install/demo paths and v7.0.1 defaults remain unchanged. No public-contract migration is required.

Evidence != Authority != Execution. Verification occurrence != Authority. Verification result != Approval, Safe, Institutional Acceptance or Compliance. Verification passed != Outcome Correct, automatic SUPPORTED, Authority, Accepted, Compliant or Execution Permission. No runtime enforcement or control-plane authority.

## Open blockers and recommendation

The canonical task card is complete. Implementation-entry blockers remain:

- Resolve task-local existing canonical anchors/versions/digests, named predicates and admitted binding routes; this limited read does not invent them or copy the reference evaluator.
- Supply complete event/result witnesses and field-level provenance. Review exact internal serialization and the distinction between check attribution and authenticated principal identity without weakening ADR 0013.
- Harness mapping remains separately blocked under G03. That does not preclude future internal evaluation of explicitly supplied attributable non-Harness records.
- Future implementation needs explicit owner authorization, scoped baseline observations and regressions. Accepted historical T1 compiler debt remains unmodified and untested here.

## Planning admission questions

| Question | Answer |
|---|---|
| 1. Tranche-1 dependency satisfied? | YES |
| 2. Occurrence contract sufficiently defined? | PARTIAL |
| 3. Result contract sufficiently defined? | PARTIAL |
| 4. Occurrence/result separated? | YES |
| 5. Independence excluded from T2-01? | YES |
| 6. Integrity deferred to T2-02? | YES |
| 7. Independence/custody deferred to T2-03? | YES |
| 8. Missing verification facts remain explicit? | YES |
| 9. T1-03 selector preserved? | YES |
| 10. T1-04 noninterference preserved? | YES |
| 11. G03 remains open? | YES |
| 12. Public-contract migration required? | NO |
| 13. Authority expansion required? | NO |
| 14. Implementation rollback bounded? | YES |

Semantics have a source-backed minimum; exact binding/serialization admission and complete witnesses remain unresolved. No implementation, test/replay, Harness work, merge, tag, release or version bump occurred. Stop for owner review with exactly three planning documents uncommitted.

T2_01_IMPLEMENTATION_PLANNING_READY_WITH_BLOCKERS
