# Gate 1 Bounded Implementation Plan

Status: **ADMITTED_WITH_CONSTRAINTS / NOT_IMPLEMENTED**, under [B10](20_B10_FINAL_GATE_REVIEW.md), 2026-09-16. Public/commercial baseline remains v7.0.1.

## 1. Ownership and minimum scope

Implement one explicit versioned side-evaluation path inside canonical Guard product modules. Preserve existing MESR/EAK entrypoints as compatibility surfaces. Read the existing canonical registry/boundaries; one shared binding/nonclaim/six-state implementation is reused by assurance, time and sufficiency modules. No competing registry or hidden second engine.

`VALIDATION_ONLY_REFERENCE_EVALUATOR != CANONICAL_PRODUCT_RUNTIME`.

B09 reference.mjs is a test instrument. Product code must not import scripts/b09, fixtures, expected results or test helpers; copy the reference engine wholesale; dispatch on fixture IDs; or embed test-language shortcuts. Test adapters translate evidence structure only: no expected state, synthesized event, guessed binding or semantic decision enters product input. Product implementation must satisfy the contracts independently of reference implementation.

No new canonical ID or automatic alias is admitted here. Each facet needs a task-local dossier binding it to existing canonical anchors/versions/digests, named predicates, nonclaims, provenance, B00-B08 contracts and B09 cases. Research short names remain facet labels, not aliases. Preserve all 41+3 reconciliation verdicts; unrelated/unvalidated candidates remain excluded.

Every product path below is a proposed **new file** under `packages/guard-core/src/mesr/repaired/`. These are private internal modules, explicitly invoked by a new internal caller/test. No export from `packages/guard-core/src/index.ts`, CLI wiring, automatic generation or environment-triggered activation. The nested directory preserves the existing runtime-compatibility verifier's exact top-level MESR .ts inventory; its recursive language/import checks still apply. Do not weaken that verifier.

```text
T1-01 identity/lock bytes (G08)
 -> T1-02 binding/nonclaims (G02)
 -> T1-03 shared six-state selection (G02)
 -> T1-04 composition/noninterference (G08)
 -> Tranche 1 exit
 -> T2-01 event/result -> T2-02 integrity -> T2-03 independence (G05)
 -> T2-04 applicability -> T2-05 continuity/rebinding (G07)
 -> T2-06 sufficiency -> T2-07 outward report link (G06)
 -> Tranche 2 exit
 -> reserved producer integration after separate factual/integration admission
```

G08 is split around G02 to avoid circular admission. T1-01 checks authoritative pinned identity/bytes; it does not establish full semantic-composition admission. G02 evaluates that pinned Core basis. Arbitrary contextual compositions remain withheld until T1-04 proves noninterference. G05 historical event/result evaluation does not depend on future G07 current-standing evaluation.

## 2. Acceptance and regression protocol

Every task adopts the [change-control contract](22_GATE1_CHANGE_CONTROL_CONTRACT.md) and every compatibility row below.

### Frozen evidence versus product execution

1. Preserve B09 oracle 0.2.0, its 172 base cases, H01-H35, 603 probe obligations and all historical bytes. Never regenerate expectations to accommodate product output.
2. The two frozen B09 runners additionally pin old source inventories and legacy observations. They are historical reproduction instruments, not switchable product-repair harnesses. This plan's new-file-only approach should preserve those pins. If later separately authorized source changes require a pristine B09 worktree for historical reproduction, retain it and issue a new comparison record; never remove frozen assertions.
3. T1-01 introduces new test-only files: `scripts/verify_v8_gate1_product_conformance.mjs`, `scripts/gate1/b09-product-inputs.mjs`, `scripts/gate1/b09-product-compare.mjs`. Proposed command: `node scripts/verify_v8_gate1_product_conformance.mjs --task <TASK_ID>`. They do not exist yet; B10 implements no verifier.
4. This runner reads frozen JSON, materializes H mutations exactly, invokes actual new product modules and compares outputs to the original oracle. Mapping preserves omissions, IDs, byte domains, negative mutations and evidence provenance. Expected values never influence product input. Test-side serialization/comparison is independently reviewable; product results must come from product execution.
5. Intermediate slices declare exactly which output fields/paths they own. Every selected assertion must execute and pass. Remaining fields are recorded as named pending gaps, never filtered into whole-case PASS. Tranche exits compare the complete admitted obligation set. Diagnostic representation mappings must be explicit and lossless for required oracle fields; no discarded failures.
6. Exceptions, duplicate/unmatched/omitted cases, missing assertions or nondeterminism fail. Corrupted-expectation, dropped-binding and deliberate false-positive controls must demonstrate that the runner fails. Expected semantic rejection is different from evaluator error.
7. Three deterministic product replays at tranche exit must have identical new result hashes. A new product evidence envelope has new source/method/provenance and need not share B09's historical result hash. Historical bytes retain their original hash.
8. Append new before/after product observations with task, source HEAD/digests, oracle hash, exact cases/assertions, outcomes and remaining gaps. Never rewrite the historical 139 EXPECTED_GAP rows.

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

## 3. Task cards and common requirements

For every T1/T2 task, the exact allowlist is its listed new product files plus the three new test files above, `tests/fixtures/gate1/<lowercase-task-id>-controls.v0.1.json`, `tests/fixtures/gate1/<lowercase-task-id>-results.v0.1.json`, and `docs/validation/v8-gate1-<lowercase-task-id>-evidence-v0.1.md`. Expand and record exact paths before starting; no directory wildcard permits editing other files. Shared test changes add only testing/translation/comparison, never semantic decisions or changed frozen expectations.

Every task card adopts these fields in full:

- **Compatibility constraints:** Every row of section 2; no schema/report/reason/public API migration, old source/enum edit or package version bump.
- **Default-off requirement:** Explicit new internal invocation only; no old caller/export/CLI/automatic artifact changes.
- **Completion evidence:** Before/after source/artifact hashes, commands/exits, case IDs and asserted fields, falsifier controls, replay results, remaining gaps, diff/allowlist, compatibility and authority reviews, git diff --check and rollback commit. Card-specific evidence below is additional.
- **Reversibility:** Reviewed removal/revert only of the task's new side modules/call sites. Preserve old behavior, all before/after evidence and B09 bytes. No data migration or historical rewrite.
- **Rollback condition:** Any material boundary violation or unexpected regression, plus the card-specific condition. Actual specification defects use SPECIFICATION_REOPEN_REQUIRED; never relax the oracle.

Auxiliary contract identifiers follow the owning ADR. A new side-contract identifier/version is not a product/package version bump or permission to revise B00-B08.

### T1-01 - Pinned canonical identity and byte-lock admission

- **Gap IDs:** G08.
- **Objective:** Validate existing canonical identity/version/digest, registry/Core basis, exact manifest byte/content locks and input shapes; retain attributable admission references. Return a checked basis or rejection, not full semantic-composition PASS.
- **Why now:** Requirements cannot be collected from unresolved identities.
- **Source ADR/contracts:** B01/ADR 0010; B08/ADR 0016; B09 input admission; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/admission.ts`; `packages/guard-core/src/mesr/repaired/contracts.ts`; `packages/guard-core/src/mesr/repaired/canonicalBytes.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** B10 constrained admission; clean scoped baseline.
- **B09 positive cases / controls:** C01 identity/lock portion; exact-byte and explicitly admitted registry controls.
- **B09 negative cases:** C02, C05, C06.registry, C07, C20.producer, C20.consumer, C20.malformed, C21.>=0.1.0, C21.latest, C21.0.1.0-rc.1, C21.01.1.0, C22.array, C22.raw, C27; H01-H35 structural admission portions.
- **Existing regression tests:** R-MESR + R-ISOLATION + R-PUBLIC.
- **Explicit non-goals:** No new registry/ID/alias, general version solver, relation traversal, full noninterference claim or default resolver replacement.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Unknown identity or invalid lock admitted; default caller changed; test-to-product dependency.
- **Completion evidence:** Checked identity/byte domains and attribution, malformed rejection, and explicit withholding of unproved semantic composition. Plus every common evidence field in section 3.

### T1-02 - Immutable binding union and path-scoped nonclaims

- **Gap IDs:** G02.
- **Objective:** Collect registry + Core boundary + admitted context + caller-added requirements; apply named value predicates and path-scoped exclusions; preserve false/empty data and missing/unsatisfied diagnostics.
- **Why now:** Callers must not weaken the obligations used by the state selector.
- **Source ADR/contracts:** B01/ADR 0010; B02/ADR 0011; B02 negative cases; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/requirements.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T1-01 checked pinned Core basis.
- **B09 positive cases / controls:** Complete generic Core control; caller-added obligation retained; N18 separate-path obligation control.
- **B09 negative cases:** N03, N04, N07, N08, N09, N08.predicate_override, I10.unresolved_ref; H08/H28/H29; supplemental null/whitespace/zero/false/witness/unknown-predicate controls.
- **Existing regression tests:** R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No legacy evaluator edit, world-falsity inference or specialized verification/time evaluator.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Caller omission/positive part/predicate hint removes a requirement or nonclaim; unknown IDs are dropped.
- **Completion evidence:** Exact effective requirements, predicate results and retained path-scoped nonclaims. Plus every common evidence field in section 3.

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

### T1-04 - Atomic composition and finite Core noninterference

- **Gap IDs:** G08.
- **Objective:** Complete admission over four existing types: dependencies/typed graphs, compatibility dossiers, unchanged Core supports/nonclaims/predicates, deterministic diagnostics and all-or-zero output. Call existing resolver only after shape admission and retain legacy issues separately.
- **Why now:** Contextual support routes need proof that they preserve the binding/state substrate.
- **Source ADR/contracts:** B01/ADR 0010; B02/ADR 0011; B08/ADR 0016; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/composition.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T1-01 through T1-03; T1-01 alone does not authorize full composition.
- **B09 positive cases / controls:** C01, C24, valid permutations and 603 product Core noninterference probes.
- **B09 negative cases:** All C01-C27 variants; H22-H25/H31; C09/C10/C11/C23/C26/C27; full zero-entry output, invalid forward resolution.
- **Existing regression tests:** R-MESR + R-ISOLATION + R-PUBLIC.
- **Explicit non-goals:** No scheduler/distribution service, producer/consumer module type, automatic alias/entailment, active stronger/weaker or probabilistic proof.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Partial activation, support widening, binding weakening, altered legacy diagnostic or noninterference mismatch.
- **Completion evidence:** All 41 C-family cases fully compared; 603 product probes, three deterministic replays and legacy resolver equality. Plus every common evidence field in section 3.

### T2-01 - Attributable verification occurrence and result

- **Gap IDs:** G05.
- **Objective:** Evaluate event occurrence/result with subject/scope/method/event time/output refs; preserve producer-attributed result separately from successful independent checking.
- **Why now:** Command exit and aggregate labels cannot supply the event basis for independence.
- **Source ADR/contracts:** B03 R3/R4/R7; B05/ADR 0013; B02/ADR 0011; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/verificationEvent.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** Tranche 1 exit.
- **B09 positive cases / controls:** N02, E3-A.ci, E3-A.harness_style, E3-B.producer occurrence/result portions; complete passed/failed/inconclusive controls.
- **B09 negative cases:** N01, N12.missing, I04, I05.failed, I05.skipped, I12.subject, I12.scope, I12.time, I13, I14.missing, I16; E3-A.ci.execution_only, E3-A.harness_style.execution_only, E3-B.absent; H09/H10/H26/H27/H29/H32.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC.
- **Explicit non-goals:** No Harness normalization, fabricated check from counts, independence promotion or EAK buildVerifications edit.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Missing/cross-context event supports a result; command exit becomes a check; old EAK bytes change.
- **Completion evidence:** Bound occurrence/result with exact old values retained and no invented event/independence assertion. Plus every common evidence field in section 3.

### T2-02 - Exact-byte integrity comparison

- **Gap IDs:** G05.
- **Objective:** Compare explicitly supplied bounded bytes with attributed expected SHA-256 in the same byte domain; measure bytes and record checker/method/time, both digests and outcome.
- **Why now:** Independence/sufficiency must consume actual comparisons, not digest presence.
- **Source ADR/contracts:** B03 R5/R6; B05/ADR 0013; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/integrity.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T2-01 provenance and Tranche 1 contracts.
- **B09 positive cases / controls:** I09 byte equality; complete I10 byte basis; supplemental non-ASCII byte-count control.
- **B09 negative cases:** I06, I07, I08, I15, N17.failed, N17.skipped; H30; missing comparison, raw/derivative mismatch and wrong byte count.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC.
- **Explicit non-goals:** No arbitrary filesystem/network lookup, authenticity/truth/custody inference or canonical pack creation.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Normalization substitutes for raw bytes; mismatch passes; expected hash lacks provenance.
- **Completion evidence:** Byte domain/length/digests and actual comparison event; missing proof UNRESOLVED, completed equality mismatch UNSUPPORTED. Plus every common evidence field in section 3.

### T2-03 - Principal separation and custody-bound independent checking

- **Gap IDs:** G05.
- **Objective:** Evaluate actual producer/executor/verifier principals and control/custody evidence under named separation policy using T2-01/02; retain separate result/independence/custody claims.
- **Why now:** Successful checking and byte matching alone do not establish independence.
- **Source ADR/contracts:** B05/ADR 0013; B02/ADR 0011; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/independence.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T2-01/T2-02; current reliance separately depends on G07.
- **B09 positive cases / controls:** I10, I18, N18 independent-event paths; N02 producer result with unresolved independence.
- **B09 negative cases:** I01-I18 non-temporal obligations, N15, I10.unresolved_ref, common control/different labels, missing identity/separation/custody; H14/H15.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC.
- **Explicit non-goals:** No identity issuance, trust service, IAM, institutional acceptance or old EAK/adapter relabeling.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Different IDs/external verified/nonempty checks bypass separation/custody; independent check implies acceptance.
- **Completion evidence:** I-family non-temporal comparisons with distinct attributed result/custody/independence states and retained exclusions. Plus every common evidence field in section 3.

### T2-04 - Explicit reliance-time applicability

- **Gap IDs:** G07.
- **Objective:** Evaluate freshness, interval endpoints, revocation, supersession and snapshot horizon at explicit reliance/evaluation instants; retain raw timestamps and historical support.
- **Why now:** Historical evidence needs separate applicability evaluation before current reliance.
- **Source ADR/contracts:** B07/ADR 0015; B02/ADR 0011; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/temporalApplicability.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** Tranche 1 exit; completed G05 for check-based historical evidence.
- **B09 positive cases / controls:** T02.before, T17, explicit complete historical/current controls and interval rules.
- **B09 negative cases:** T01, T02.at, T03, T04, T05, T06, T18.evaluation_time, T18.reliance_time, T19, T20, T22.rule, T22.absent, T23, T24.timezone, T24.interval, T26.complete, T26.missing; H11-H13/H34.
- **Existing regression tests:** R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No hidden clock, live revocation, historical rewrite/renewal, license change or TIME_WINDOW_EXPIRED reinterpretation.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Missing currentness becomes current; never-valid basis becomes STALE; old evidence is rewritten.
- **Completion evidence:** Explicit rule/snapshot/reliance trace; STALE versus UNRESOLVED; unchanged T25.equal/T25.earlier legacy strict expiry. Plus every common evidence field in section 3.

### T2-05 - Context continuity and current-authority rebinding evidence

- **Gap IDs:** G07.
- **Objective:** Evaluate supplied subject/scope/environment/policy/dependency comparisons with admitted materiality criteria; assess new revalidation/rebinding evidence without refreshing old records.
- **Why now:** Temporal validity alone does not bind old evidence to changed software or current authority.
- **Source ADR/contracts:** B07/ADR 0015; B05/ADR 0013; B02/ADR 0011; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/continuity.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T2-04 and G05 check evidence.
- **B09 positive cases / controls:** T07, T15 and complete continuity controls; T21.complete -> bounded INCONCLUSIVE when its method cannot decide.
- **B09 negative cases:** T08, T09.subject, T09.scope, T10, T11, T12.policy, T12.dependency, T13.policy, T13.dependency, T14, T16, T20, T21.missing, T27; N14/I17/H33; full T-family exit.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No authority/contact service, acceptance decision, automatic revalidation or historical edit.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Version strings alone establish material loss; old approval implies current acceptance; evidence creates execution permission.
- **Completion evidence:** All 37 T-family cases and cross-gap temporal assertions compared with preserved historical bytes. Plus every common evidence field in section 3.

### T2-06 - Profile-bound standalone sufficiency artifact

- **Gap IDs:** G06.
- **Objective:** Implement closed B06 side envelope and complete frozen-profile/claim-set/material-gap evaluation using shared state and G05/G07 evidence; distinguish missing, material gap and undecidable outcomes.
- **Why now:** Sufficiency depends on evaluable underlying evidence and applicability obligations.
- **Source ADR/contracts:** B06/ADR 0014 and side-artifact specification; B02/B05/B07/B08; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/sufficiency.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T1-04 and T2-01 through T2-05 for profile-required obligations.
- **B09 positive cases / controls:** S04, S10, S11.absent standalone portion; complete no_material_gap control.
- **B09 negative cases:** S01-S13 standalone obligations; S04.label_only, S04.bad_profile_digest, S02.*, S03.*, S07.*, S08.*, S09; H08/H16-H19; hidden required claim/empty gap-list controls.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No report injection, new semantic module type, production service, sufficient=false default, verdict or acceptance override.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Incomplete/label-only profile supports sufficiency; presentation profile changes meaning; missing fields receive invented defaults.
- **Completion evidence:** Closed-envelope validation, all required claim results, full materiality coverage, bound versions/digests and six-state result. Plus every common evidence field in section 3.

### T2-07 - Outward association to immutable legacy reports

- **Gap IDs:** G06.
- **Objective:** Validate optional side-artifact -> report identity/schema/exact-byte digest/source-pack association; record link failure separately from standalone sufficiency.
- **Why now:** Consumers need traceability while preserving report 1.0.0.
- **Source ADR/contracts:** B06/ADR 0014 and report-reference contract; B04/ADR 0012; exact paths in the evidence index.
- **Exact code surfaces:** `packages/guard-core/src/mesr/repaired/reportAssociation.ts`; plus section 3's task-specific test/evidence allowlist.
- **Dependencies:** T2-06.
- **B09 positive cases / controls:** S10, S11.absent and exact matching report-link control.
- **B09 negative cases:** S11.mismatch, S01, N16.allow, N16.block; wrong pack association, optional/required missing link and all four legacy verdict byte controls.
- **Existing regression tests:** R-EAK + R-MESR + R-ISOLATION + R-PUBLIC + R-OUTCOME.
- **Explicit non-goals:** No renderer/index/CLI change, reverse link, stronger allow, enum conversion or auto-generation.
- **Compatibility / default-off / reversibility:** All section 3 common requirements apply without exception.
- **Rollback condition:** Mismatched bytes associate assurance; report/renderer/index bytes or verdict semantics change.
- **Completion evidence:** Full S-family comparison and exact JSON/MD/HTML/index equality; link diagnostics independent of standalone state unless profile requires link. Plus every common evidence field in section 3.

### T3-01 - Producer supplementary-fact admission dossier (interface only)

- **Gap ID:** G03, DEFERRED_NONBLOCKING. Adapter implementation remains outside current authorization.
- **Objective / why now:** Make missing facts and truthful future field sources reviewable before canonical handoff. A negative missing-fact oracle does not supply a real producer positive.
- **Source contracts:** B03 closure R1-R7 and 137-row field map; B01/B02/B05 and applicable Tranche 1/2 contracts.
- **Exact current code surface:** None. Future dossier allowlist: `docs/validation/v8-gate1-t3-01-producer-dossier-v0.1.md` and `tests/fixtures/gate1/t3-01-source-map.v0.1.json`. Distinguish real evidence from synthetic controls. No Harness/schema/parser/EAK/adapter source is writable.
- **Dependencies:** Interface preparation may preserve known gaps now. Adapter admission additionally needs Tranche 2 exit and real owner/authority/scope/time/provenance/redaction/determinism/event/byte facts for the selected scenario, plus a separate integration decision.
- **B09 positive controls:** E3-A.ci and E3-A.harness_style retain equal bounded claims and different provenance. They do not demonstrate actual Harness canonical closure. New attributable CANONICAL_STRUCTURALLY_VALID positive tests must exist before adapter admission without changing B09.
- **B09 negatives:** I16, S13, T27, E3-A.ci.execution_only, E3-A.harness_style.execution_only, E3-A.actual_harness_gaps: retain missing facts/no canonical pack. Byte/tuple/shape mismatch rejects.
- **Additional negative tests before adapter admission:** B03 tuple mismatch; missing owner/model/actor; null event time; duplicate/cross-task joins; aggregate counts cannot synthesize verification; absent/mismatched bytes; byte/character confusion; unknown block reason; unavailable provenance booleans; nonempty records cannot be discarded; schema/validator disagreement; no downstream call after rejection.
- **Existing regression tests:** R-HARNESS + R-EAK + R-ISOLATION + R-PUBLIC with future integration; dossier-only work uses deterministic field/provenance/byte checks.
- **Non-goals / compatibility / default-off:** No adapter implementation, canonical pack emission, EAK/report invocation, producer rewrite, new module type or stronger producer role. All protected surfaces unchanged.
- **Rollback condition:** Any invented fact, unproven real-producer positive or premature handoff. Preserve the rejected dossier and failure evidence.
- **Completion evidence:** Each required-in-parent field retains one source class and real source/absence; supplier/byte/time/provenance pins; complete positive/negative closure checklist and proposed future adapter allowlist. Dossier completion alone does not admit an adapter.
- **Reversibility:** Withdraw candidate dossier; no runtime or persisted canonical output exists.

## 4. Tranche entry and exit contracts

### Tranche 1 - Canonical semantic/state substrate

- **Entry conditions:** B10 constrained decision; pre-change HEAD and clean scoped tree; unchanged B09 hashes; exact T1 allowlist and facet dossier; existing baseline regression results recorded; no public/default path to new modules.
- **Task IDs / code surfaces:** T1-01 through T1-04, only their enumerated new product/test/evidence files.
- **B09 cases required:** All 41 C-family cases and 603 product Core probes; all N-family selector/requirement/nonclaim obligations; E3-C.* collision obligations; H01-H35 shape obligations and applicable binding controls. Record G05/G06/G07 assertions still pending. A partially exercised cross-gap case is not whole-case conformance.
- **Existing product regression suite:** R-MESR, R-ISOLATION, R-PUBLIC, R-OUTCOME. Frozen B09 reproduction separately verifies historical byte/source continuity.
- **PUBLIC CONTRACT CHANGE = NO. DEFAULT PATH CHANGE = NO.**
- **Exit conditions:** Full pinned identity and finite composition admission; one binding/nonclaim/state owner; no pending foundational obligation; all selected assertions and 603 product probes pass; three deterministic product replays; old source/diagnostics/bytes and public behavior preserved; explicit G05/G06/G07 remainder.
- **Rollback point:** Pre-T1-01 HEAD; reviewed removal/revert of only new side modules/callers, retaining all evidence.

### Tranche 2 - Assurance, current standing and sufficiency

- **Entry conditions:** Tranche 1 exit; default-off retained; task-owned event, byte, principal, temporal and profile dossiers; explicit offline inputs. No speculative trust/authority service dependency.
- **Task IDs / code surfaces:** T2-01 through T2-07 and exact common test/evidence allowlists; reuse T1 state/admission modules, no second engine.
- **B09 cases required:** All 207 cases via the new product differential adapter, including H01-H35 and every cross-gap N/I/S/T/E3/C expectation, plus 603 product probes. Actual Harness must retain the correct missing-fact outcome: conformance to that negative oracle is not canonical integration. Compare states, nonclaims, missing bindings, diagnostics, atomic composition, provenance obligations and requested closure disposition.
- **Existing product regression suite:** All six R suites, all four report-verdict byte controls, and separate frozen B09 legacy reproduction.
- **PUBLIC CONTRACT CHANGE = NO. DEFAULT PATH CHANGE = NO.**
- **Exit conditions:** All admitted bounded product comparisons/probes PASS with zero unexpected errors/regressions; three equal new result hashes; independence/temporal/profile boundaries and legacy report/public bytes preserved. No generality or G03 factual-closure claim.
- **Rollback point:** Accepted Tranche 1 HEAD; withdraw only Tranche 2 side paths and preserve T1 plus evidence.

### Tranche 3 - Reserved truthful producer closure

- **Entry conditions:** CLOSED for adapter engineering. T3-01 interface/dossier preparation is the only current admission. Real integration needs Tranche 2 exit, truthful supplementary facts, admitted scenario/mapping, actual positive closure tests, exact adapter file allowlist and a separate explicit integration decision.
- **Task IDs / code surfaces:** T3-01 only. No umbrella integration task or runtime adapter path is admitted by B10.
- **B09 cases required:** T3-01 E3-A/I16/S13/T27 controls remain frozen. Separately versioned source-backed positive/missing/rejected/structural-handoff tests must supplement, never weaken, those negatives.
- **Existing product regression suite:** R-HARNESS/R-EAK/R-ISOLATION/R-PUBLIC plus all impacted T1/T2 product tests if later integration is admitted.
- **PUBLIC CONTRACT CHANGE = NO. DEFAULT PATH CHANGE = NO.** A contrary proposal returns as COMPATIBILITY_MIGRATION_REQUIRED.
- **Exit for current scope:** Complete source dossier and unresolved-fact list with no canonical emission; real integration has no claimed exit until its separate admission/testing exist.
- **Rollback point:** Tranche 2 baseline; withdraw candidate interface without changing producer or Guard histories.

## 5. Change and release boundaries

B09 remains immutable. A true defect triggers SPECIFICATION_REOPEN_REQUIRED and stops affected implementation. A future oracle requires a new version, new freeze manifest and explicit supersession trail; no rewrite of old evidence or B00-B08 to obtain PASS.

Every task records pre-change HEAD, exact allowlist, before/after results, relevant B09 execution, existing regressions, public-surface diff, authority/compatibility review, git diff --check, rollback point and completion evidence. Preserve semantic/provenance/temporal/byte continuity. Existing B09 .gitattributes exceptions stay narrow and unchanged.

Review implementation in task-sized changes. No unrelated cleanup/refactor, automatic commit/merge, product/package version bump, tag, release or package publication is authorized by B10. GATE1_IMPLEMENTATION_READY != V8 RELEASED. No launch, pricing/edition expansion, MESR standard, EAK production service, universal interoperability, compliance/regulatory assurance or marketing claim follows.

Audit output/verdict/exit, deny 25, permit and classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority expansion/control-plane/dashboard/orchestration drift. Evidence, identity, access, capability, verification, sufficiency and history never become execution or acceptance authority. Producer != Verifier != Governance Authority != Acceptance Authority.
