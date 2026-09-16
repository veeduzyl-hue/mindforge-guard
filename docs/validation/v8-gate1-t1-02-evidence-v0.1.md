# T1-02 implementation evidence v0.1

Status: T1_02_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS. Entry/baseline sections retain their original chronology; recovery and final acceptance are recorded below.

Repository: D:/AI project/mindforge-guard. Branch: feat/v8-gate1-tranche1-t1-02-v0.1.

T1_01_COMMIT / T1_02_PRE_CHANGE_HEAD / rollback point: 7726fc7f58305e59ea7359d9658494b7695bfa4d. Clean tree confirmed on branch creation. T1-01 post-commit reproduction PASS: 50/50, 33/33, identical product output digest ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648. The result envelope hash changes with HEAD metadata; product results are identical. Final committed T1-01 evidence SHA-256: ca883deedc9620c7e0a93b0afe3f73c1aa45d1eb2cd29d5f145073cf512a59bb.

## Frozen exact file allowlist

- packages/guard-core/src/mesr/repaired/requirements.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t1-02-controls.v0.1.json
- tests/fixtures/gate1/t1-02-results.v0.1.json
- docs/validation/v8-gate1-t1-02-evidence-v0.1.md

## Verbatim canonical task card

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


## Verbatim inherited task fields

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


## Source contract pins

- docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md: bd6786d6f1fd18aa1caf85818967fb2d77ef430091b40bc89f27e4bb6b65a895
- docs/planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md: 5662bf3538ec2af941f3f4a1371004afdb9b4077adea6d86817156962432da74
- docs/adr/0010-mesr-canonical-id-relation-and-admission-contract.md: 6ff26fa827194f98b7ddea6fc97aea3b2b92502b448febadf599fec315d00310
- docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md: 2b12c78cde5138d9ccd1206fed42f2b2e19c0cd8b872ff90b5ffccc4168b26a2
- docs/validation/v8-b02-claim-state-negative-cases-v0.1.md: 7a2698deafb19c8ff3d202f4cda427d9625d6ce320952254df5b44f3c81b8984

## Dependency and facet boundary

Only T1-01 pinned Core identity/bytes and structural admission are consumed. CHECKED_BASIS is not semantic truth or admitted contextual composition. Raw contextual modules remain withheld for T1-04; T1-02 can only retain additional contextual obligations, never activate contextual supports or remove Core nonclaims. Existing T1-01 product and historical fixture/evidence bytes remain frozen. Shared test changes are limited to the plan-authorized adapter/comparison/runner paths.

The product reads canonical Core entries and boundaries directly. Named predicates bind their existing requirements to nonempty references; evidence_refs and witnesses require nonempty reference arrays; verification_executed requires true. Additional explicitly bound boolean/numeric predicates preserve false/zero as valid data without implying events. Unknown predicate definitions remain unsatisfied. Every result retains subject, scope, supplied time, exact input digest and source references. Research request paths/claims are facet labels, not canonical aliases; observation and verification anchors preserve separate evidence paths. No specialized event, independence, time, sufficiency, six-state or composition evaluation is authorized.

## Baseline execution

Pending capture before requirements.ts exists. Exact frozen cases: N03, N04, N07, N08, N09, N08.predicate_override, I10.unresolved_ref, N18, H08, H28, H29. Positive generic Core and caller-added controls are separately authored. B09 oracle version 0.2.0, SHA-256 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88; historical classifications are immutable.

## Authority and compatibility entry review

Every compatibility row above applies. Audit output/verdict/exit, deny 25, permit/classify unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Required bindings/nonclaims never confer permission or enforcement. No public exports/default callers. v7.0.1 remains commercial baseline. T1-03/T1-04/Tranche 2 unstarted; no Tranche 1 exit claim.

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

BEFORE regression: `node scripts/verify_v7_0_1_public_surface_consistency.mjs` exit 0.

BEFORE regression: `node scripts/verify_v7_0_1_current_docs_baseline.mjs` exit 0.

BEFORE regression: `node scripts/verify_v7_0_1_github_action_first_report.mjs` exit 0.

BEFORE regression: `node scripts/verify_outcome_foundation_contract.mjs` exit 0.

BEFORE regression: `node scripts/verify_outcome_foundation_negative_contract.mjs` exit 0.

Development failure retained: initial T1-02 before runner exited 1 because the shared legacy byte-control function was scoped inside the T1-01 branch. Moved that unchanged function to shared test scope; no product implementation existed, and no before artifact had been written.

## Owner-authorized recovery checkpoint

HEAD and branch match the recorded T1-01 commit. Pending paths are within the seven-path allowlist; no staged/unrelated modification. The interrupted comparison/acceptance write was rejected by quota review and did not execute.

| Recovered path | Classification | Action |
|---|---|---|
| requirements.ts | PARTIAL_VALID | Preserve implementation, verify and minimally harden task-owned behavior |
| b09-product-inputs.mjs | COMPLETE_VALID | Preserve bytes, SHA-256 33a18a06b0a63f9dccddd278c87889a1d1d7b3b52610998e93395ebdb01f1f0d |
| b09-product-compare.mjs | PARTIAL_VALID | Existing T1-01 complete; add absent T1-02 comparisons |
| product verifier | PARTIAL_VALID | Before capture complete; finish after verification |
| t1-02-controls.v0.1.json | COMPLETE_VALID | Preserve entire original capture, SHA-256 2e0edbf7952d17bd27b8716f94b4cb0df039eed05d4313a0241300b419efccf7 |
| t1-02-results.v0.1.json | NOT_PRESENT | Generate only after actual successful product acceptance |
| T1-02 evidence | PARTIAL_VALID | Retain entry/before records and append closure |

Recovered BEFORE_CONFORMS=0, BEFORE_PARTIAL=0, BEFORE_EXPECTED_GAP=13, BEFORE_NOT_APPLICABLE=0. These are absent new-API observations, captured before requirements.ts existed; no before recapture is permitted. The original 19 commands each have recorded exit 0.

T1-01 guard classification: POST_COMMIT_REPRODUCIBILITY_FIX; STRICT. Executed the exact committed changed-path assertion against its actual nine paths (pass) and each appended unrelated README.md, packages/guard-core/src/reasonCodes.ts, unrelated/other.ts (all throw). This is a synthetic guard falsifier, not an edit to those paths. Ancestor pin and protected baseline comparison remain. The six frozen T1-01 product/fixture/evidence files equal committed blobs. Recovery smoke: 50/50, 33/33, unchanged product digest ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648; all 19 B09 worktree/blob pins pass.

## Bounded implementation and facet dossier

requirements.ts rechecks the original Core-only composition input through T1-01, reads canonical Core entries/boundaries directly, and returns a frozen per-path requirement collection. Unknown IDs/versions remain in unresolved_identities; no aliases or state selection. Raw contextual compositions reject with CONTEXTUAL_COMPOSITION_WITHHELD. Independently supplied, subject/scope/time/source-bound context declarations add requirements conjunctively; they are not semantic-module admission. No context can replace a Core predicate or nonclaim.

| Facet | Canonical basis and source | T1-02 obligation | Withheld |
|---|---|---|---|
| Generic evidence item | mesr.core.evidence.item@0.1.0; ADR 0010/0011; N03/N04 | Core requirements and exact nonclaims; caller additions retained | All claim support states |
| Evidence-item boundary requests | Same anchor; exact CB-01/CB-11 claim labels | Boundary requirements and exclusions even without caller observed-state hints; no alias between differently spelled claims | Authority/sufficiency determination |
| Verification request facets | mesr.core.evidence.verification@0.1.0; B02 N07/N08/N09/N12 | Registry bindings, named method descriptor, nonempty resolvable evidence references; false stays present | Event result/occurrence, independence, integrity, six states |
| Observation inference | mesr.core.evidence.observation@0.1.0; CB-07; B02 N18 | Registry nonclaims plus path-scoped CB-07 requirements/exclusion; retain canonical nonclaim verification alongside the explicit projection label | Verification support and state precedence |
| Sufficiency evidence-set facet | mesr.core.claim.claim@0.1.0; H08 | Required evidence_refs type/value only, retaining false | Profile/material-gap/sufficiency semantics |
| Additional obligations | ADR 0011, separate source-bound context or caller additions | Named conjunctions; caller hints never replace minimum predicates; unknown definitions remain defined=false/satisfied=false | Claim support, module admission, authority |

All canonical entry version/content digests and requirement ownership appear in each binding origin; Core registry and module byte/content pins appear in checked_basis. Predicate names are nonempty_reference, nonempty_array, true and explicitly declared boolean/nonnegative_integer/reference_array_allow_empty for additive context. Presence, predicate definition and satisfaction are separate fields; no truthiness inference. Missing evaluation_time is recorded, never filled from a clock. This is association completeness, not G07 applicability evaluation.

Resume hardening preserved the original implementation structure. Added canonical_nonclaim provenance so the CB-07 projection cannot hide the original exclusion; added explicit missing evaluation_time; anchored CB-01/CB-11 to the canonical evidence item so omitting caller hints cannot remove their obligations. Initial requirements.ts recovery hash was 6dd09e7c588dbfe66f366df3ec9231898c2691fd09520c98bd7af6c97240c398. No T1-01 product byte changed.

### Oracle slice and N18 diagnostic distinction

Exact frozen cases: N03, N04, N07, N08, N09, N08.predicate_override, I10.unresolved_ref, N18, H08, H28, H29. Two independently declared positives: control.generic and control.caller_added. Thirteen task-owned slices, fourteen per-path collection records because N18 has two paths. All exact effective requirements, retained values, named predicates, missing bindings, unknown identities, exclusions and provenance are asserted.

N18's frozen selector output has INFERENCE_PROHIBITED and an empty missing_bindings array on the observation path. This intermediate collector additionally retains missing checked_property from CB-07, as ADR 0011 requires retaining all applicable diagnostics. The comparator explicitly distinguishes this collection-only obligation from the frozen state output; it does not claim whole-case equivalence or alter the original oracle. Independent-verification path requirements/nonclaims remain separate and unchanged whether evaluated alone or alongside the observation path.

### Targeted execution before regression closure

node scripts/verify_v8_gate1_product_conformance.mjs --task T1-02 --record: 13/13 task slices and 19/19 supplemental groups PASS. Three identical product replay hashes: 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872. EXPECTED_GAP_CLOSED=13; all other comparison counts zero. These compare the previously absent new private API only. T1-03 state obligations remain PENDING_STATE_EVALUATION; T1-04 composition remains WITHHELD.

Normalized claims remain byte-identical under request/semantic-ID/requirement/context permutations. Exact input_digest and context_digest retain actual submitted representation/order, so these provenance hashes are intentionally excluded from the normalized semantic comparison. Three identical executions compare the complete product envelope.

Falsifiers reject corrupted expected missing bindings, omitted results, deliberate false positives and dropped input bindings. Shared verifier adds an exact seven-path dirty/untracked scope check, three unrelated-path negative controls and six committed T1-01 byte pins. Shared T1-01 scope accounting recognizes only the explicitly plan-authorized T1-02 paths; all original 50 assertions, 33 controls and frozen fixtures remain unchanged.

## Post-change regression execution

- `node scripts/verify_mesr_registry.mjs`: exit 0
- `node scripts/verify_mesr_reason_bindings.mjs`: exit 0
- `node scripts/verify_mesr_claim_stability.mjs`: exit 0
- `node scripts/verify_mesr_composition.mjs`: exit 0
- `node scripts/verify_mesr_runtime_portability.mjs`: exit 0
- `node scripts/verify_mesr_cross_domain.mjs`: exit 0
- `node scripts/verify_mesr_apaai_crosswalk.mjs`: exit 0
- `node scripts/verify_v8_runtime_compatibility.mjs`: exit 0
- `node scripts/verify_v8_institutional_artifact_readiness.mjs`: exit 0
- `node scripts/verify_governance_surface.mjs`: exit 0
- `node scripts/verify_governance_consumption_profile.mjs`: exit 0
- `node scripts/verify_audit_permit_gate.mjs`: exit 0
- `node scripts/verify_v7_0_example_evidence_pack.mjs`: exit 0
- `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs`: exit 0
- `node scripts/verify_v7_0_1_public_surface_consistency.mjs`: exit 0
- `node scripts/verify_v7_0_1_current_docs_baseline.mjs`: exit 0
- `node scripts/verify_v7_0_1_github_action_first_report.mjs`: exit 0
- `node scripts/verify_outcome_foundation_contract.mjs`: exit 0
- `node scripts/verify_outcome_foundation_negative_contract.mjs`: exit 0

Final comparator review hardening: N18 collection-only checked_property is unioned with every original oracle missing-binding obligation, never substituted for that list. A dedicated corrupted-N18-obligation control proves no oracle obligation can be hidden by the intermediate diagnostic mapping. This is test-only hardening after the 19-command matrix; no product byte changed. Targeted T1-02 and T1-01 are rerun below.

## Final acceptance and preservation

- T1-02: 13/13 task-owned slices PASS; 20/20 supplemental groups PASS. Final targeted command and final T1-01 command each exited 0 after comparator hardening.
- Before regressions: 19/19 PASS; after regressions: 19/19 PASS. The exact commands and exits are retained above.
- T1-01: 50/50 slices and 33/33 controls PASS; original product output hash unchanged: ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648. Post-commit verifier guard STRICT.
- B09: node scripts/verify_v8_b09_acceptance_resume.mjs exited 0, 207/207 PASS, FAIL=0, ERROR=0, SKIPPED=0. Frozen historical result hash remains 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560. No authoring/write flags. Historical 603 probe records are preserved; no T1-02 execution of T1-04 composition probes is claimed.
- All 19 B09 frozen worktree/Git blob pins match. Frozen manifest/source-contract pins are also preserved by T1-01 checks. Frozen B09 files changed=0.
- Complete original legacyControls function and original T1-01 helper prefixes compare byte-for-byte with T1_01_COMMIT. The completed input adapter and entire before fixture retain their recovered hashes.

| Comparison | Count |
|---|---:|
| EXPECTED_GAP_CLOSED | 13 |
| PARTIAL_CONFORMANCE_IMPROVED | 0 |
| UNCHANGED_CONFORMING | 0 |
| UNCHANGED_EXPECTED_GAP | 0 |
| NEW_REGRESSION | 0 |

Every row is a requirement/nonclaim collection slice. No primary six-state output is emitted, and no later obligation is counted as closed. Three complete product replays hash to 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872.

## Final artifact provenance

UTF-8 without BOM, LF and final newline. SHA-256 below covers exact complete worktree bytes, not normalized JSON. These files remain uncommitted; no post-change commit is invented. Product replay hashes instead cover the deterministic canonical serialized product-output object.

| Artifact | Bytes | Worktree SHA-256 |
|---|---:|---|
| packages/guard-core/src/mesr/repaired/requirements.ts | 13642 | 48b7dfdd6d99eabf5e0d4602607db30308d8f48b46e61f8b2f7921cc3a46265b |
| scripts/verify_v8_gate1_product_conformance.mjs | 38953 | 9aa88e6df73ebcafda68309a7d6f71abd6de89a0047867fa21851c8679220ed4 |
| scripts/gate1/b09-product-inputs.mjs | 4924 | 33a18a06b0a63f9dccddd278c87889a1d1d7b3b52610998e93395ebdb01f1f0d |
| scripts/gate1/b09-product-compare.mjs | 9916 | 9b6dc04f8fe25f67fb2664efcd9109291adfdc8502f3db246dca1b88768a643e |
| tests/fixtures/gate1/t1-02-controls.v0.1.json | 144995 | 2e0edbf7952d17bd27b8716f94b4cb0df039eed05d4313a0241300b419efccf7 |
| tests/fixtures/gate1/t1-02-results.v0.1.json | 1437243 | 817514c034c750b9225fe09bbf13ad3728474256bb7d0b68964c1ede11a84866 |

Existing attributes remain unchanged. MJS/JSON/MD use text with eol=lf; requirements.ts uses text=auto with core.autocrlf=true. Its current worktree and staged blobs are LF, while a later checkout may create a distinct CRLF worktree representation. Final staging compares every worktree file to its raw index blob; staging is not a commit. This evidence file intentionally has no self-hash.

## Public contract and authority review

PUBLIC_CONTRACT_DRIFT=NO. EvidencePackV1 1.0.0/schema/parser/validator unchanged; all 56 reason serialized values, definition/binding inventory, dynamic ordering and emitters unchanged; GovernanceReportModel 1.0.0, four verdicts and JSON/Markdown/HTML/index bytes unchanged. Public CLI, SDK/package exports, license/offline authority and v7.0.1 defaults unchanged. Audit output/verdict/exit unchanged; deny 25 unchanged; permit unchanged; classify unchanged. Compatibility checks include source isolation plus unchanged four-verdict byte controls, parser/validator positives/negatives and old reason ordering.

Recommendation-only, additive-only, non-executing, default-off. No authority scope expansion, execution authorization, autonomous approval/blocking, control plane, acceptance authority, legal determination, certification or audit opinion. Missing references/requirements withhold a claim basis for downstream evaluation; they do not block real actions.

REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT=NO. Product imports only canonical Core, boundaries and the original T1-01 modules. It has no scripts/b09, scripts/gate1 or fixture dependency. No expected state or synthetic verification event is supplied by the input adapter. Method labels inside frozen producer inputs remain attributed input data, never implementation dependencies. AUTHORITY_EXPANSION=NO.

## Final scope, remaining obligations and rollback

The seven paths in the frozen allowlist are exactly the seven pending files: one new private product module, three shared test/helper updates, two task-owned JSON artifacts and this evidence document. All six nonshared T1-01 paths are byte-identical to T1_01_COMMIT. No public/legacy product source changes. Final staged and ordinary whitespace checks pass; staged diff, working diff, name lists and untracked inventory are inspected separately.

T1-03 started=NO; T1-04 started=NO; Tranche 2 started=NO. Their product files added=0. No opportunistic cleanup. Semantic composition=WITHHELD_FOR_T1_04. State selection=PENDING_T1_03 / PENDING_STATE_EVALUATION. G02 remains open for shared six-state precedence, atomic/composite supportability and proof-grounded state evaluation. G08 full composition/noninterference remains T1-04; G05/G07/G06 and G03 integration remain outside this task. No Tranche 1 exit, merge, tag, release or version bump.

T1_01_COMMIT=T1_02_PRE_CHANGE_HEAD=rollback point=7726fc7f58305e59ea7359d9658494b7695bfa4d. Rollback means reviewed withdrawal of only T1-02 changes while retaining this evidence, original before observations and all frozen history; no destructive Git operation or migration is required.

Final working tree: exactly seven authorized staged, uncommitted paths, ready for owner acceptance review. T1-02 committed=NO.

T1_02_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS

## Final closure resume on 2026-09-17

The previous final read-only staged-byte audit was rejected by automatic quota review before execution. No implementation, fixture, result or staged file was lost. This owner-authorized resume completes that audit and the explicitly requested final regressions. No T1-01/T1-02 restart occurred.

Recovery verified the same branch and HEAD 7726fc7f58305e59ea7359d9658494b7695bfa4d, exactly seven staged task-owned paths, no unstaged/untracked path, and no extra T1-03/T1-04/Tranche 2 artifact. Exact task card remains copied verbatim from the unchanged canonical plan.

| Recovered artifact | Classification | Resume action |
|---|---|---|
| requirements.ts | COMPLETE_VALID | Read/verify only; no rewrite |
| shared product verifier | COMPLETE_VALID | Read/execute only; no rewrite |
| b09-product-inputs.mjs | COMPLETE_VALID | Read/verify only; no rewrite |
| b09-product-compare.mjs | COMPLETE_VALID | Read/verify only; no rewrite |
| T1-02 controls fixture | COMPLETE_VALID | Preserve original before capture byte-for-byte |
| T1-02 results fixture | COMPLETE_VALID | Preserve final outputs/source hashes byte-for-byte |
| T1-02 evidence document | PARTIAL_VALID at entry; COMPLETE_VALID after this closure | Append only this final resume record |

Completed the previously interrupted seven-file worktree/index byte comparison: all WORKTREE_SHA256 equal STAGED_BLOB_SHA256; all use UTF-8 without BOM, LF, final newline. Six completed artifacts retain every SHA-256 in the final artifact table above. Evidence SHA-256 before this append was 796f0df06ac8ad777a61174657abafa29542dd579478ccaa5828194d6ca1232b (worktree and index). This is explicitly a pre-append hash, not a self-hash of the final document. No .gitattributes/config change.

### Required final executions after all implementation/helper edits

- node scripts/verify_v8_gate1_product_conformance.mjs --task T1-02: exit 0, 13/13 slices, 20/20 supplemental controls, FAIL=0, ERROR=0, NEW_REGRESSION=0. No --record flag; preserved results fixture unchanged.
- Three full product replays again yield 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872. Requirement/source/nonclaim/predicate/missing-reference/unknown-ID ordering remains deterministic; permutation controls pass.
- N18_PATH_ISOLATION=PASS. Both paths match their respective standalone outputs; final corrupted-N18-oracle control rejects rather than hiding an obligation.
- node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01: exit 0, 50/50 slices, 33/33 controls; product hash ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648 unchanged.
- Unknown task UNKNOWN_TASK and unimplemented T1-03 each exit 1 with AssertionError at task validation. These are expected rejection controls; no T1-03 implementation ran.
- Original committed T1-01 changed-path assertion was extracted verbatim and executed: authorized paths pass; adding packages/guard-core/src/reasonCodes.ts throws. T1_01_POST_COMMIT_GUARD=STRICT. Current exact task-scope falsifiers also pass.

The exact same 19 baseline commands were rerun in this final resume after the last N18/helper edit:

| Command | Final exit |
|---|---:|
| node scripts/verify_mesr_registry.mjs | 0 |
| node scripts/verify_mesr_reason_bindings.mjs | 0 |
| node scripts/verify_mesr_claim_stability.mjs | 0 |
| node scripts/verify_mesr_composition.mjs | 0 |
| node scripts/verify_mesr_runtime_portability.mjs | 0 |
| node scripts/verify_mesr_cross_domain.mjs | 0 |
| node scripts/verify_mesr_apaai_crosswalk.mjs | 0 |
| node scripts/verify_v8_runtime_compatibility.mjs | 0 |
| node scripts/verify_v8_institutional_artifact_readiness.mjs | 0 |
| node scripts/verify_governance_surface.mjs | 0 |
| node scripts/verify_governance_consumption_profile.mjs | 0 |
| node scripts/verify_audit_permit_gate.mjs | 0 |
| node scripts/verify_v7_0_example_evidence_pack.mjs | 0 |
| node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs | 0 |
| node scripts/verify_v7_0_1_public_surface_consistency.mjs | 0 |
| node scripts/verify_v7_0_1_current_docs_baseline.mjs | 0 |
| node scripts/verify_v7_0_1_github_action_first_report.mjs | 0 |
| node scripts/verify_outcome_foundation_contract.mjs | 0 |
| node scripts/verify_outcome_foundation_negative_contract.mjs | 0 |

FINAL_AFTER_REGRESSIONS=19/19 PASS. Before baseline remains its original 19/19 PASS, never regenerated.

B09=NOT_RERUN in this final resume: last actual acceptance was 207/207 PASS, and requirements.ts remains SHA-256 48b7dfdd6d99eabf5e0d4602607db30308d8f48b46e61f8b2f7921cc3a46265b with no product edit after that run. All 19 frozen worktree and committed Git blobs match the immutable manifest again; full pending-path comparison contains zero B09 paths. No expensive historical replay was needed.

### Final boundary reaffirmation

Binding union, caller non-removal/non-weakening, source attribution, value predicates, false/empty/null/absent distinctions, unknown IDs, missing references and path-scoped nonclaims all PASS. Empty caller required_bindings is a valid empty additive set; Core requirements remain present. All product outputs retain PENDING_STATE_EVALUATION. No final six-state result, authority, enforcement or composition activation.

PUBLIC_CONTRACT_DRIFT=NO; AUTHORITY_EXPANSION=NO; REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT=NO; B09_FROZEN_EVIDENCE_CHANGED=NO. Audit output/verdict/exit, deny 25, permit/classify, EvidencePack/parser/validator, 56 reason values/order/emitters, four report verdicts/renderers, CLI/SDK/exports and licensing/offline v7.0.1 defaults remain unchanged. Recommendation-only, additive-only, non-executing, default-off.

Final comparison counts remain EXPECTED_GAP_CLOSED=13, PARTIAL_CONFORMANCE_IMPROVED=0, UNCHANGED_CONFORMING=0, UNCHANGED_EXPECTED_GAP=0, NEW_REGRESSION=0. G02 six-state selection/precedence and atomic/composite supportability remain T1-03. Full semantic composition/noninterference remains T1-04. Neither task nor Tranche 2 started. No Tranche 1 exit is claimed.

Only this evidence file was edited in final resume. Exactly seven authorized paths remain staged and uncommitted; HEAD and rollback point remain 7726fc7f58305e59ea7359d9658494b7695bfa4d. No commit, merge, tag, release or version bump. Final scope and whitespace checks include staged changes because ordinary git diff is empty after staging.

T1_02_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS
