# T1-03 execution evidence v0.1

Status: T1_03_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS. Final task-owned acceptance and required regressions are complete; later-task obligations remain open. Previous stopped attempt: PRESTART_BLOCKED, not semantic implementation failure.

Repository: D:/AI project/mindforge-guard. Branch: feat/v8-gate1-tranche1-t1-03-v0.1.
T1_02_COMMIT: c5a66b50cefc39002dea190af078a49a7c47e3d4.
T1_02_VERIFIER_CLOSURE_COMMIT = T1_03_PRE_CHANGE_HEAD = rollback point: 2b0e9facb48795533ad96545e318c54ce535515b.
Clean branch creation confirmed. Post-closure T1-01 50/50 + 33/33 and T1-02 13/13 + 20/20 exit 0, unchanged product hashes.

## Exact file allowlist

- packages/guard-core/src/mesr/repaired/claimState.ts
- packages/guard-core/src/mesr/repaired/evaluateClaim.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t1-03-controls.v0.1.json
- tests/fixtures/gate1/t1-03-results.v0.1.json
- docs/validation/v8-gate1-t1-03-evidence-v0.1.md

## Verbatim canonical task card

### T1-03 - One shared six-state claim selector

- **Gap IDs:** G02.
- **Objective:** Implement per-claim prohibition -> comparable conflict -> proven stale -> missing obligation -> completed determination precedence; preserve atomic/composite results and provenance.
- **Why now:** Later modules require one state owner instead of independently invented precedence.
- **Source ADR/contracts:** B02/ADR 0011; ADR 0008; B02 negative cases; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/claimState.ts`; `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T1-01/T1-02; proof records must satisfy admitted predicates, not caller-selected outcome labels.
- **B09 positive cases / controls:** Complete generic positive/negative controls; N12.complete -> INCONCLUSIVE; separate valid event/nonclaim path control.
- **B09 negative cases:** N01, N04, N05, N06a, N06b, N10, N11.subject, N11.time, N12.missing, N15, N16.allow, N16.block; E3-C.*; all N-family selector obligations and precedence combinations.
- **Existing regression tests:** R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No seventh state, old enum rename, report-verdict mapping, second selector or G05/G07 evidence-method implementation.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Label/flag produces support/conflict without evidence; missing basis becomes world false; separate evidence paths erase each other.
- **Completion evidence:** All six states with diagnostics and composite behavior; distinguish selector assertions from pending specialized proof evaluation. Plus every common evidence field in section 3.


## Verbatim inherited fields

## 3. Task cards and common requirements

For every T1/T2 task, the exact allowlist is its listed new product files plus the three new test files above, `tests/fixtures/gate1/<lowercase-task-id>-controls.v0.1.json`, `tests/fixtures/gate1/<lowercase-task-id>-results.v0.1.json`, and `docs/validation/v8-gate1-<lowercase-task-id>-evidence-v0.1.md`. Expand and record exact paths before starting; no directory wildcard permits editing other files. Shared test changes add only testing/translation/comparison, never semantic decisions or changed frozen expectations.

Every task card adopts these fields in full:

- **Compatibility constraints:** Every row of section 2; no schema/report/reason/public API migration, old source/enum edit or package version bump.
- **Default-off requirement:** Explicit new internal invocation only; no old caller/export/CLI/automatic artifact changes.
- **Completion evidence:** Before/after source/artifact hashes, commands/exits, case IDs and asserted fields, falsifier controls, replay results, remaining gaps, diff/allowlist, compatibility and authority reviews, git diff --check and rollback commit. Card-specific evidence below is additional.
- **Reversibility:** Reviewed removal/revert only of the task's new side modules/call sites. Preserve old behavior, all before/after evidence and B09 bytes. No data migration or historical rewrite.
- **Rollback condition:** Any material boundary violation or unexpected regression, plus the card-specific condition. Actual specification defects use SPECIFICATION_REOPEN_REQUIRED; never relax the oracle.

Auxiliary contract identifiers follow the owning ADR. A new side-contract identifier/version is not a product/package version bump or permission to revise B00-B08.

### Per-task compatibility matrix

Every task incorporates every row. A breaking proposal is COMPATIBILITY_MIGRATION_REQUIRED; none is required before Tranche 1 or admitted here.

| Protected surface | Required proof | Allowed change |
|---|---|---|
| EvidencePackV1 1.0.0 / canonical schema | Empty source diff; valid/invalid controls unchanged | None |
| Parser | JSON/Buffer/object behavior/errors preserved; parsing is not conformity | None |
| Validator | Required fields, closed keys, enum/time/hash checks/errors preserved | None |
| 56 reason values/definitions/bindings | Exact ordered inventory and binding tests | None |
| Reason ordering | Declaration order AND dynamic first-occurrence output order retained | None |
| Reason emitters | Predicates, 37/19 distinction, scoped translations, art_manifest bypass retained | None |
| GovernanceReportModel 1.0.0 | Exact JSON/renderer/index comparisons | None |
| allow / require_review / inconclusive / block | Rules, wording, precedence; no automatic state conversion | None |
| Public CLI / SDK / exports | No new options/output/imports/exports; current smoke passes | None |
| Audit output / verdict / exit | Existing checks and no default caller edits | None |
| Deny 25 / permit / classify | R-PUBLIC and unchanged implementation | None |
| Licensing / offline authority | Source/behavior unchanged; no identity/revocation reinterpretation | None |
| Node / install / demo / buyer semantics | Public Node >=18 and v7.0.1 scope preserved; internal runtime pin separate | None |
| Existing MESR/EAK/adapters | Five relations, CB-22, PoC labels, source and snapshots unchanged | None |
| New side artifacts | Explicit internal invocation, versioned provenance, no automatic report attachment | Additive/default-off only |

### Existing regression suites

These commands are available in the repository; [V8-000](../mesr/implementation-reconciliation.v0.1.json) retains 22 baseline plus 2 recovery PASS records. They were **not rerun by this B10 documentation review**. Future code tasks run selected suites before and after changes.

| Suite | Exact existing commands |
|---|---|
| R-MESR | `node scripts/verify_mesr_registry.mjs`; `node scripts/verify_mesr_reason_bindings.mjs`; `node scripts/verify_mesr_claim_stability.mjs`; `node scripts/verify_mesr_composition.mjs`; `node scripts/verify_mesr_runtime_portability.mjs`; `node scripts/verify_mesr_cross_domain.mjs`; `node scripts/verify_mesr_apaai_crosswalk.mjs` |
| R-ISOLATION | `node scripts/verify_v8_runtime_compatibility.mjs`; `node scripts/verify_v8_institutional_artifact_readiness.mjs` |
| R-EAK | `node scripts/verify_evidence_assurance_kernel_poc.mjs`; `node scripts/verify_external_evidence_local_normalization_fixture.mjs`; `node scripts/verify_external_evidence_local_assurance_report_fixture.mjs`; `node scripts/verify_external_evidence_local_assurance_composition.mjs` |
| R-PUBLIC | `node scripts/verify_governance_surface.mjs`; `node scripts/verify_governance_consumption_profile.mjs`; `node scripts/verify_audit_permit_gate.mjs`; `node scripts/verify_v7_0_example_evidence_pack.mjs`; `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs`; `node scripts/verify_v7_0_1_public_surface_consistency.mjs`; `node scripts/verify_v7_0_1_current_docs_baseline.mjs`; `node scripts/verify_v7_0_1_github_action_first_report.mjs` |
| R-OUTCOME | `node scripts/verify_outcome_foundation_contract.mjs`; `node scripts/verify_outcome_foundation_negative_contract.mjs` |
| R-HARNESS | `node scripts/verify_harness_evidence_ingestion.mjs` |

New tests additionally check product/test import isolation, no public/default caller reaching repaired modules, no input mutation, and exact legacy JSON/Markdown/HTML/index bytes for valid allow/require_review/inconclusive/block controls. Include parser/validator rejection controls and old reason-stream ordering. Licensing is protected by unchanged source and current CLI behavior; a proposed license edit is out of scope, not justified by smoke tests.


## Contract pins (exact worktree bytes)

docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md: bd6786d6f1fd18aa1caf85818967fb2d77ef430091b40bc89f27e4bb6b65a895

docs/planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md: 5662bf3538ec2af941f3f4a1371004afdb9b4077adea6d86817156962432da74

docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md: 2b12c78cde5138d9ccd1206fed42f2b2e19c0cd8b872ff90b5ffccc4168b26a2

docs/adr/0008-claim-supportability-is-not-governance-disposition.md: fc9254d1f83b5effdad8ed2b46379a0cd9e1dd372d5bac29f144def9641ccb5b

docs/validation/v8-b02-claim-state-negative-cases-v0.1.md: 7a2698deafb19c8ff3d202f4cda427d9625d6ce320952254df5b44f3c81b8984

## Explicit clarification and boundary

ADR 0011 is authoritative. Applicable Core prohibition yields UNSUPPORTED for the prohibited inference, never world falsity. A separate world proposition without necessary basis remains UNRESOLVED; separately bound paths cannot erase nonclaims. Ordered selection: prohibition, comparable conflict, proven stale, missing obligation, completed determination. Composite support requires all required children. No specialized G05/G07/G06/G03 evaluation or T1-04 module composition.

Audit output/verdict/exit, deny 25, permit/classify unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority expansion.

BEFORE regression: `node scripts/verify_mesr_registry.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_reason_bindings.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_claim_stability.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_composition.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_runtime_portability.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_cross_domain.mjs` exit 0.

BEFORE regression: `node scripts/verify_mesr_apaai_crosswalk.mjs` exit 0.

BEFORE regression: `node scripts/verify_v8_runtime_compatibility.mjs` exit 0.

BEFORE regression: `node scripts/verify_v8_institutional_artifact_readiness.mjs` exit 0.

BEFORE regression: `node scripts/verify_governance_surface.mjs` exit 0.

BEFORE regression: `node scripts/verify_governance_consumption_profile.mjs` exit 0.

BEFORE regression: `node scripts/verify_audit_permit_gate.mjs` exit 0.

BEFORE regression: `node scripts/verify_v7_0_example_evidence_pack.mjs` exit 0.

BEFORE regression: `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs` exit 0.

BEFORE regression: `node scripts/verify_v7_0_1_public_surface_consistency.mjs` exit 1.

Baseline tooling failure: public-surface consistency exited 1 because its Git-index stat check requires staged task changes. No product file existed. Staged only authorized task paths; no test/expected value changed. Full Git diff against HEAD continues to guard staged plus unstaged scope. Retrying that command and remaining baseline commands below.

BEFORE regression closure: `node scripts/verify_v7_0_1_public_surface_consistency.mjs` exit 1.

The first retry detected the evidence append made after staging; staged the final capture first and buffered command records until all five completed.

BEFORE regression closure: `node scripts/verify_v7_0_1_public_surface_consistency.mjs` exit 0.

BEFORE regression closure: `node scripts/verify_v7_0_1_current_docs_baseline.mjs` exit 0.

BEFORE regression closure: `node scripts/verify_v7_0_1_github_action_first_report.mjs` exit 0.

BEFORE regression closure: `node scripts/verify_outcome_foundation_contract.mjs` exit 0.

BEFORE regression closure: `node scripts/verify_outcome_foundation_negative_contract.mjs` exit 0.

## Interrupted implementation recovery

Expected T1-03 branch and HEAD 2b0e9facb48795533ad96545e318c54ce535515b confirmed. Phase A remains closed. Previous command was quota-rejected before execution. Recovered BEFORE fixture SHA-256: 49ef95636eaf7f8c42feec84679751409bb4a56ade3226dc26249ef2d00eee0f. Recovered input adapter SHA-256: 0c2527edb60043c444ba1a3967f3f9eb527cb8010976fe8024fb95e887e1a719. Both COMPLETE_VALID, retained byte-for-byte. claimState.ts, evaluateClaim.ts, shared verifier, comparator and this evidence are PARTIAL_VALID. Results fixture NOT_PRESENT. Seven existing pending paths, all authorized.

The first after run failed on deep object equality of legacy controls: live undefined fields differ from their JSON-serialized baseline representation. Corrected the new assertion to compare exact JSON representations, matching the established legacy byte contract. No baseline bytes changed. Selector implementation moved into evaluateClaim.ts so claimState.ts contains only six-state model/types. Generic boolean proof is restricted to the named evidence-presence predicate and fixed expected true; no caller-selected field/expected value can redefine a canonical claim.

## Earlier AFTER regression execution (before final verifier hardening)

AFTER regression: `node scripts/verify_mesr_registry.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_reason_bindings.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_claim_stability.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_composition.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_runtime_portability.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_cross_domain.mjs` exit 0.

AFTER regression: `node scripts/verify_mesr_apaai_crosswalk.mjs` exit 0.

AFTER regression: `node scripts/verify_v8_runtime_compatibility.mjs` exit 0.

AFTER regression: `node scripts/verify_v8_institutional_artifact_readiness.mjs` exit 0.

AFTER regression: `node scripts/verify_governance_surface.mjs` exit 0.

AFTER regression: `node scripts/verify_governance_consumption_profile.mjs` exit 0.

AFTER regression: `node scripts/verify_audit_permit_gate.mjs` exit 0.

AFTER regression: `node scripts/verify_v7_0_example_evidence_pack.mjs` exit 0.

AFTER regression: `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs` exit 0.

AFTER regression: `node scripts/verify_v7_0_1_public_surface_consistency.mjs` exit 0.

AFTER regression: `node scripts/verify_v7_0_1_current_docs_baseline.mjs` exit 0.

AFTER regression: `node scripts/verify_v7_0_1_github_action_first_report.mjs` exit 0.

AFTER regression: `node scripts/verify_outcome_foundation_contract.mjs` exit 0.

AFTER regression: `node scripts/verify_outcome_foundation_negative_contract.mjs` exit 0.

## Final closure recovery (2026-09-17)

The original branch, accepted ancestry and HEAD/rollback 2b0e9facb48795533ad96545e318c54ce535515b are preserved. T1_01_COMMIT = 7726fc7f58305e59ea7359d9658494b7695bfa4d. Phase A remains closed. No branch recreation, BEFORE recapture, product reimplementation, or T1-03 commit occurred. Earlier recovery statements above describe their historical checkpoint, not the final filesystem.

All eight allowed paths now exist. The BEFORE capture, adapter and final results artifact are COMPLETE_VALID. The results format has no separate completeness status field: COMPLETE_VALID here means recovered inputs, source hashes, assertions, outputs, classification counts and deterministic digest have all been checked. The controls fixture remains the immutable BEFORE capture; supplemental AFTER controls and their full observations are stored in the results fixture to avoid rewriting history.

The final successful targeted command was `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-03 --record`, exit 0, including all 56 controls and three complete atomic/composite/control replays after the last product and verifier changes. Closure recovery recomputed its stored digest and source hashes without rerunning successful semantic acceptance. Initial 42/54-control counts were intermediate; authoritative final count is 56.

### Implementation and semantic boundary

claimState.ts defines exactly SUPPORTED, UNSUPPORTED, UNRESOLVED, CONFLICTED, STALE, INCONCLUSIVE and supporting types. evaluateClaim.ts owns the single private selector; callers cannot invoke it with forged state flags. It reuses T1-01 admission and T1-02 collection and retains each complete original collection beneath the state projection.

ADR 0011 precedence is Core prohibition -> comparable conflict -> proven applicability loss -> missing obligation -> completed determination. Within a completed conjunction, negative or undecidable required parts prevent whole positive support. This is attributable blocker precedence, not a severity-max or report verdict mapping.

- SUPPORTED: complete, admitted, applicable positive basis for the bounded claim. Recorded verification/presence results retain producer attribution; they do not establish independent truth or execute a method.
- UNSUPPORTED: applicable Core prohibition or complete applicable negative determination. Missing evidence alone is never a negative determination.
- UNRESOLVED: missing binding, unknown identity/mapping, missing reference, missing applicability/method basis or no admitted determination.
- CONFLICTED: admitted mutually incompatible determinations of the same predicate, subject, scope and applicable time, with both references preserved. Different subject/scope/time is not a conflict; ambiguous different predicates remain unresolved. Pass/fail contradiction does not negate event occurrence.
- STALE: the bounded named applicability-loss primitive requires attributable formerly-applicable and now-inapplicable observations under the same context. Historical age/labels alone do not prove stale. G07 interval/current-standing evaluation remains withheld.
- INCONCLUSIVE: complete applicable recorded method basis reports inability to decide; absent, skipped or malformed checking is not inconclusive success.

The fixed boolean primitive binds evidence_presence, the canonical evidence item, present=true, exact context and evidence ledger references. Arbitrary properties, reversed expected values, labels and self-selected criteria cannot redefine the claim. Invalid proof/input is rejected or remains unresolved; invalid composite shape throws TypeError and cannot return SUPPORTED.

Atomic paths preserve source attribution, missing requirements, nonclaims, exclusion reasons, unknown identities, conflict references, historical basis and diagnostic ordering. Core prohibited inference is UNSUPPORTED while the separate world proposition lacking required basis is UNRESOLVED; both diagnostics may coexist. UNSUPPORTED != WORLD_FALSE; NONCLAIM != NEGATIVE_WORLD_EVIDENCE; world_falsity_asserted remains false. A valid separate positive path does not erase another path's prohibition.

Composite supportability consumes actual immutable in-process atomic results, requires every required child to be supported, and retains all supplied children including rejected/unrequested children. Duplicate, missing, fabricated or context-mismatched children cannot manufacture support. There is no majority vote, best-child selection or silent child dropping. Unresolved child absence remains unresolved; conflicting child evidence remains attributable. CLAIM_COMPOSITE_SUPPORTABILITY != MODULE_SEMANTIC_COMPOSITION; semantic_composition is WITHHELD_FOR_T1_04.

### Exact task-owned evidence

BEFORE: 38 observations; BEFORE_EXPECTED_GAP=38, BEFORE_PARTIAL_CONFORMANCE=0, BEFORE_CONFORMS=0. Original BEFORE SHA-256: 49ef95636eaf7f8c42feec84679751409bb4a56ade3226dc26249ef2d00eee0f. Never regenerated after implementation.

Final: 38/38 task-owned selector slices PASS; 56/56 supplemental controls PASS. Every comparison field reports selector_assertions=PASS. Task-owned closure is not full specialized-case closure.

Case IDs:

- N01
- N02
- N03
- N04
- N05
- N06a
- N06b
- N07
- N08
- N09
- N10
- N11.subject
- N11.time
- N12.complete
- N12.missing
- N13
- N14
- N15
- N17.failed
- N17.skipped
- N16.allow
- N16.block
- N18
- E3-C.Runtime_ALLOW
- E3-C.Guard_allow
- E3-C.external_ALLOW
- E3-C.VERIFIED
- E3-C.APPROVED
- E3-C.SAFE
- E3-C.ACCEPTED
- E3-C.COMPLIANT
- E3-C.IDENTITY
- E3-C.AUTHORITY
- E3-C.TESTS_PASSED
- E3-C.ACCEPTANCE
- E3-C.HISTORICAL_VALID
- E3-C.CURRENT_STANDING
- N08.predicate_override

Final classification counts:

- EXPECTED_GAP_CLOSED = 35
- PARTIAL_CONFORMANCE_IMPROVED = 3
- UNCHANGED_CONFORMING = 0
- UNCHANGED_EXPECTED_GAP = 0
- NEW_REGRESSION = 0

| Partial case | Task-owned result | Full frozen expectation | Later obligation / retained missing basis |
|---|---|---|---|
| N06b/current | UNRESOLVED; T1_03_STATE_SLICE_ONLY | STALE | G07 explicit interval/current-standing evaluation; currentness. Generic proven stale primitive passes separately. |
| N14/decision | UNRESOLVED; T1_03_STATE_SLICE_ONLY | SUPPORTED | G03/institutional occurrence evidence; institutional_evidence_basis. No institutional decision method is claimed. |
| N18/independence | UNRESOLVED; T1_03_STATE_SLICE_ONLY | SUPPORTED | G05 independent checking; independent_verification_basis. Observation inference remains UNSUPPORTED; separate valid pass-path isolation passes. |

These pending specialized obligations are not T1-03 failures. Comparisons preserve the frozen full expected state, observed state and pending_specialized_proof; oracle and missing-marker corruption are explicit failing falsifiers. None of these three cases is FULL_CASE_CLOSURE.

Exact supplemental control IDs (all PASS):

- exact-six-states
- complete-positive
- complete-explicit-negative
- boolean-positive
- missing-not-world-false
- unknown-id-retained
- unknown-evidence-ref
- false-empty-null-missing
- prohibited-inference-versus-world-question
- caller-positive-cannot-override-core
- caller-cannot-force-any-state
- caller-contradiction-is-not-proof
- comparable-conflict-attribution
- different-subject-time-not-conflict
- conflict-retains-missing-obligation
- inconclusive-complete-versus-missing
- historical-not-current
- generic-proven-loss
- never-valid-not-stale
- stale-label-not-proof
- proof-value-and-context-falsifiers
- path-isolation-and-separate-positive
- producer-result-is-not-independent
- no-verification-is-not-failed
- public-dispositions-not-states
- precedence-combinations
- composite-all-supported
- composite-unresolved-not-negative
- composite-conflicted
- composite-stale
- composite-undecidable
- composite-explicit-negative
- composite-prohibition-before-conflict
- composite-dropped-duplicate-fabricated-child
- composite-permutation
- evidence-and-request-permutations
- invalid-input-never-supported
- corrupted-expectation-fails
- withheld-expectation-corruption-fails
- withheld-obligation-loss-fails
- dropped-result-fails
- false-positive-fails
- lost-collection-binding-fails
- product-test-import-isolation
- different-scope-not-conflict
- different-predicate-not-conflict-or-support
- result-conflict-is-not-occurrence-conflict
- false-expected-and-arbitrary-property-rejected
- malformed-proof-never-supported
- producer-label-without-bound-record
- cross-event-output-reference
- invalid-evaluation-time
- unrequested-composite-child-preserved
- composite-context-mismatch
- composite-invalid-shape-is-error
- selector-not-callable-with-caller-flags

### Determinism and artifact identity

Hashes below use the runner's canonical serialized object SHA-256, covering all primary states, basis/missing/nonclaim/conflict references, child states, diagnostics and all stored supplemental control observations.

Replay 1 hash: 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf

Replay 2 hash: 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf

Replay 3 hash: 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf

T1_03_RESULT_HASH: 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf

Determinism: PASS. This result hash is the semantic replay envelope digest, not the raw pretty-printed results-file hash. Frozen-row-only product_replay_hashes are all 087781c05af0a8344fcdfef2f8a2ba70d3ed2f6405b2f5fea24b3908563d46f0; those remained unchanged through final test-side hardening.

Source/worktree raw-byte SHA-256 inventory (not a claim that stale index blobs match):

| Path | Bytes | SHA-256 |
|---|---:|---|
| packages/guard-core/src/mesr/repaired/claimState.ts | 599 | 3781ecb60c90c9f7e5f3d49f375424b7429db42a9fb25b749daeecd30673a201 |
| packages/guard-core/src/mesr/repaired/evaluateClaim.ts | 17410 | 8e72c42fe02cc9fadc7e92755c1ed177e81faedbc189413a2950c6cd9c86af5c |
| scripts/verify_v8_gate1_product_conformance.mjs | 60524 | d9d524c36f6c55c9359a8e681523bd287e4cc4caa815f3b924a7a481c564bf6c |
| scripts/gate1/b09-product-inputs.mjs | 5367 | 0c2527edb60043c444ba1a3967f3f9eb527cb8010976fe8024fb95e887e1a719 |
| scripts/gate1/b09-product-compare.mjs | 12774 | f4abf3aed48ea3eb63dfeb7a4dd305678794074125395cfa8cddf3108eb1bcd4 |
| tests/fixtures/gate1/t1-03-controls.v0.1.json | 1488210 | 49ef95636eaf7f8c42feec84679751409bb4a56ade3226dc26249ef2d00eee0f |
| tests/fixtures/gate1/t1-03-results.v0.1.json | 5726698 | c22a4e746227fca60b5b9d158f99d8f5d07d0ba59766d619dbcc1616292fc76a |

This evidence file is intentionally excluded from its own hash inventory. Source hashes cover exact bytes, without newline normalization; canonical semantic hashes are a separate domain.

### TypeScript debt attribution

Classification: PRE_EXISTING_TOOLING_OR_TYPECHECK_DEBT. Direct compiler process exit codes below are 2 for diagnostics and 0 for success (earlier shell-level failures were reported as 1). No diagnostic points at either T1-03 new file.

Common command prefix: `node node_modules/typescript/bin/tsc --noEmit --allowImportingTsExtensions --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck`.

| Exact suffix to common prefix | Exit | Exact diagnostic locations |
|---|---:|---|
| packages/guard-core/src/mesr/repaired/admission.ts | 2 | admission.ts(33,5), (33,27), (33,41), (33,55): TS2322: Type 'undefined[]' is not assignable to type 'readonly never[]'. Type 'undefined' is not assignable to type 'never'. |
| --strict packages/guard-core/src/mesr/repaired/requirements.ts | 2 | requirements.ts(86,76): TS7006: Parameter 'row' implicitly has an 'any' type. |
| packages/guard-core/src/mesr/repaired/claimState.ts packages/guard-core/src/mesr/repaired/evaluateClaim.ts | 2 | Same four admission.ts TS2322 diagnostics only. |
| --strict packages/guard-core/src/mesr/repaired/claimState.ts packages/guard-core/src/mesr/repaired/evaluateClaim.ts | 2 | Same requirements.ts TS7006 diagnostic only. |
| --strictNullChecks packages/guard-core/src/mesr/repaired/claimState.ts packages/guard-core/src/mesr/repaired/evaluateClaim.ts | 0 | No diagnostics. |

Attribution proof: admission.ts, contracts.ts, canonicalBytes.ts and requirements.ts match raw committed T1-02 blobs byte-for-byte. Checking historical admission.ts or requirements.ts alone reproduces the exact failures without either new module in their dependency graph. These additional ad-hoc compiler configurations are outside the canonical 19-command T1-03 acceptance matrix. Historical files were not edited to clear them.

### B09 and immutable history

B09: NOT_RERUN in final T1-03 closure. Last actual acceptance is 207/207 PASS, FAIL=0, ERROR=0, SKIPPED=0, recorded in T1-02 evidence. T1-03 product code was added afterward, but is outside the B09 evaluation dependency path: the frozen acceptance runner imports scripts/b09/reference.mjs, input-admission.mjs and runtime-observer.mjs; the observer uses legacy supportEvaluator/moduleManifest/temporalBasis, EAK, Governance Report and coverage modules. No existing caller or export was redirected to repaired/claimState.ts or repaired/evaluateClaim.ts, and no B09 helper imports gate1 helpers. Therefore the user-specified intersection condition for rerun is false.

Closure recovery verified all 19 frozen worktree AND committed Git blob pins, plus all 39 source-inventory hashes. B09 frozen evidence changed=NO. Accepted T1-01/T1-02 product/fixture/evidence bytes remain frozen. Reference evaluator code was not copied/imported into product; validation helpers alone invoke product.

### Compatibility, authority and scope review

PUBLIC_CONTRACT_DRIFT=NO; AUTHORITY_EXPANSION=NO; REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT=NO. The exact allowlist contains only two new internal product files, additive test-side helpers, T1-03 fixtures and this evidence; protected source paths have no diff. EvidencePackV1 1.0.0, parser/validator, 56 reason-code values/order/emitters, GovernanceReportModel 1.0.0 and allow/require_review/inconclusive/block rules remain unchanged. No public CLI/SDK/package export, output/exit, audit verdict, deny 25, permit, classify, licensing/offline authority or v7.0.1 default behavior changes.

SUPPORTED != Authorized/Safe/Accepted. UNSUPPORTED and UNRESOLVED != Runtime Block. Claim State != Governance Report Verdict. No authorization, approval, autonomous block, enforcement, institutional acceptance authority, legal determination, certification or audit opinion is produced. Recommendation-only, additive-only, non-executing, default-off; no control-plane or main-path takeover.

Remaining G02 obligations within T1-03: none. G08 semantic module composition/noninterference closure remains T1-04; WITHHELD_FOR_T1_04. Tranche 2 G05 verifier independence/integrity, G07 temporal current-standing and G06 profile-bound sufficiency remain open. G03 producer/Harness closure remains deferred. T1-04 started=NO; Tranche 2 started=NO. Neither G08 nor Tranche 1 nor G05/G07/G06 is claimed complete.

### Final regression prerequisite

The required legacy verify_v7_0_1_public_surface_consistency.mjs reads .git/index directly and compares tracked working-tree size/mtime, then rejects unstaged paths outside its original public-doc scope. It requires refreshed staged entries for the four already-authorized changed paths (this evidence, comparator, verifier and results); this is a test prerequisite, not cosmetic staging. No historical test is changed or bypassed. T1-03 remains uncommitted. Final execution records are buffered until that check completes, so logging does not invalidate its own prerequisite. The final evidence append may remain unstaged.

## Final executed acceptance and owner handoff

Final exact AFTER matrix executed after the final product/comparator/verifier edits, with no substitutions: 19/19 PASS. BEFORE remains 19/19 PASS from the original capture above. Earlier index-stat prerequisite failures remain visible in history; no BEFORE result was regenerated. Each command below exited 0 in the final AFTER execution on 2026-09-17.

| Exact command | BEFORE final exit | Final AFTER exit |
|---|---:|---:|
| node scripts/verify_mesr_registry.mjs | 0 | 0 |
| node scripts/verify_mesr_reason_bindings.mjs | 0 | 0 |
| node scripts/verify_mesr_claim_stability.mjs | 0 | 0 |
| node scripts/verify_mesr_composition.mjs | 0 | 0 |
| node scripts/verify_mesr_runtime_portability.mjs | 0 | 0 |
| node scripts/verify_mesr_cross_domain.mjs | 0 | 0 |
| node scripts/verify_mesr_apaai_crosswalk.mjs | 0 | 0 |
| node scripts/verify_v8_runtime_compatibility.mjs | 0 | 0 |
| node scripts/verify_v8_institutional_artifact_readiness.mjs | 0 | 0 |
| node scripts/verify_governance_surface.mjs | 0 | 0 |
| node scripts/verify_governance_consumption_profile.mjs | 0 | 0 |
| node scripts/verify_audit_permit_gate.mjs | 0 | 0 |
| node scripts/verify_v7_0_example_evidence_pack.mjs | 0 | 0 |
| node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs | 0 | 0 |
| node scripts/verify_v7_0_1_public_surface_consistency.mjs | 0 | 0 |
| node scripts/verify_v7_0_1_current_docs_baseline.mjs | 0 | 0 |
| node scripts/verify_v7_0_1_github_action_first_report.mjs | 0 | 0 |
| node scripts/verify_outcome_foundation_contract.mjs | 0 | 0 |
| node scripts/verify_outcome_foundation_negative_contract.mjs | 0 | 0 |

Preservation commands executed after the final verifier edits:

- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01`: exit 0; 50/50 slices, 33/33 controls PASS. Three product replay hashes remain ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648. Printed whole-run metadata digest is 253aa05e3f4b8904370a655387f7ff20ac7c410aa4b45ed9e6bd4353602217d4; this includes changed verifier provenance and is not the preserved product-output digest. No --record flag; accepted T1-01 fixture untouched.
- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-02`: exit 0; 13/13 slices, 20/20 controls PASS. Three product replay hashes remain 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872. No --record flag; accepted T1-02 fixture untouched.
- Verifier lineage guard: STRICT. Required accepted ancestors and every intervening committed path are checked. Pending changes are restricted to the exact eight T1-03 paths. Unknown tasks, absent/nonancestor anchors, unrelated pending paths and unrelated committed history remain failing controls. T1-01 identity/version/raw-byte/unknown/self-authored-proof/admission controls and T1-02 union/attribution/false-null-empty/unknown-reference/path-isolation controls pass unchanged.

Staging prerequisite completed with tool approval: only the four already-staged entries named above were refreshed. Immediately before this final evidence append, all eight staged blobs matched working files byte-for-byte. Final append remains unstaged intentionally; no further staging is needed for appearance and no commit is made. Final state: seven paths fully staged plus this evidence path staged with its final closure update unstaged. Staged=YES; Committed=NO. HEAD and rollback remain 2b0e9facb48795533ad96545e318c54ce535515b.

Final scope review: actual pending paths equal the exact eight-path allowlist, no ninth path, no untracked files. T1-04 files=0; Tranche-2 files=0; B09 frozen files changed=0; T1-01/T1-02 product files unchanged. No version/release changes, opportunistic cleanup, merge or tag. The staged and unstaged diff checks and final scope checks are required to remain clean after this evidence-only append. All implementation and test sources are unchanged from the passing final runs.

G02 T1-03 obligations are complete. G08/T1-04, G05/G07/G06 Tranche 2 and deferred G03 remain exactly as stated above; no broader closure or commercial availability is claimed. Implementation is ready for owner acceptance, intentionally uncommitted.

T1_03_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS
