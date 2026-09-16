# T1-01 implementation evidence v0.1

Status: T1_01_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS. The entry sections below were recorded before runtime edits; final observations are appended separately.

## Entry record

- task_id: T1-01; tranche: 1; gap_ids: G08.
- Title: Pinned canonical identity and byte-lock admission.
- Repository: D:/AI project/mindforge-guard.
- Branch: feat/v8-gate1-tranche1-t1-01-v0.1.
- B10_COMMIT / pre_change_head / rollback_point: dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc.
- Clean baseline: verified immediately after branch creation. B10 preservation committed exactly four documents; no implementation commit is authorized.
- Objective: validate existing canonical identity/version/digest, registry/Core basis, exact manifest byte/content locks and input shapes; retain attributable references. Return a checked basis or rejection, withholding semantic composition.
- Why required: requirements cannot be collected from unresolved identities.
- Source contracts: [plan](../planning/21_GATE1_IMPLEMENTATION_PLAN.md), [change control](../planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md), [ADR 0010](../adr/0010-mesr-canonical-id-relation-and-admission-contract.md), [ADR 0016](../adr/0016-mesr-module-version-lock-and-noninterference-contract.md), [B09 input admission](../../scripts/b09/input-admission.mjs).
- B09_COMMIT: a646f2b4576336321eda696c7dc2ee02749cadb2; byte-policy commit: 91f4a0c6b32d198e38531afb01c67f704c213733.
- Oracle: 0.2.0; raw SHA-256: 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88.

## Exact allowed_file_paths

1. packages/guard-core/src/mesr/repaired/admission.ts
2. packages/guard-core/src/mesr/repaired/contracts.ts
3. packages/guard-core/src/mesr/repaired/canonicalBytes.ts
4. scripts/verify_v8_gate1_product_conformance.mjs
5. scripts/gate1/b09-product-inputs.mjs
6. scripts/gate1/b09-product-compare.mjs
7. tests/fixtures/gate1/t1-01-controls.v0.1.json
8. tests/fixtures/gate1/t1-01-results.v0.1.json
9. docs/validation/v8-gate1-t1-01-evidence-v0.1.md

## B09_case_allowlist and assertion ownership

C01 identity/lock portion; C02, C05, C06.registry, C07, C20.producer, C20.consumer, C20.malformed, C21.>=0.1.0, C21.latest, C21.0.1.0-rc.1, C21.01.1.0, C22.array, C22.raw, C27; H01-H35 structural admission portions.

Composition rejection owns status, zero entries/mappings/profiles, and each listed identity/lock/shape diagnostic. C01 owns checked identity/bytes and attribution only; composition success remains T1-04. H08/H18/H28/H29/H32 preserve structurally valid false/empty/null data; their missing-binding/state assertions remain T1-02/03 and applicable Tranche 2 tasks. No supportability selector, requirement union, specialized assurance or full composition implementation is admitted.

## before_results recorded before runtime edits

- BEFORE_PASS: all 17 exact R-MESR (7), R-ISOLATION (2), R-PUBLIC (8) commands in plan section 2 completed with exit 0.
- BEFORE_PASS: node scripts/verify_v8_b09_repaired_experiment_3.mjs, exit 0, 172 cases; node scripts/verify_v8_b09_acceptance_resume.mjs, exit 0, 207/207 PASS, FAIL=0, ERROR=0, SKIPPED=0, 603 probes. Neither used write flags. Freeze manifest checks passed.
- BEFORE_EXPECTED_GAP: the three T1-01 product modules and differential runner do not exist at pre_change_head. No repaired product invocation is available. Historical runtime observations remain distinct from this absent side API.
- BEFORE_FAILURE: 0 in executed regression and frozen-reference checks. New product before observations and exact legacy byte controls will be captured by the new test harness before any runtime file is created.

## Facet admission and compatibility constraints

No new semantic facet, registry, ID or alias. Existing Core identity/version/entry content, full registry definition/boundary/reason-binding inventory and exact module content are the only identity basis. Canonical anchors are read from existing product modules. Context proofs must be independently pinned, attributable and retained; a submitted self-rewritten lock/proof is insufficient. Test-only context admission is finite and never establishes product semantic composition. Byte canonicalization follows ADR 0016, preserving arrays and rejecting non-JSON data and duplicate raw keys.

Every plan section 2 compatibility row applies: EvidencePackV1 1.0.0, parser/validator, 56 reason values/order/emitters, report 1.0.0 and four verdicts/renderers/index, CLI/SDK/package exports, audit output/verdict/exit, deny 25, permit/classify, licensing/offline authority, Node/install/demo/buyer semantics, legacy MESR/EAK/CB-22 remain unchanged. Additive, recommendation-only, non-executing, default-off: explicit private invocation only.

## Authority constraints and rollback

Evidence != Authority != Execution; Identity/Capability/Access != Authority; Authority != Commitment; Execution success != Verification passed; Verification result != Verifier independence; Independent verification != Acceptance; Evidence sufficient != Institutional acceptance; Guard allow != Runtime ALLOW; Historical validity != Current standing; Producer != Verifier != Governance Authority != Acceptance Authority. No execution/acceptance authorization, autonomous approval/blocking, control plane, legal determination, certification or audit opinion.

Rollback on unknown identity/invalid lock admission, default caller change, test-to-product dependency, any regression or boundary violation. Reviewed removal of only new implementation paths; retain evidence and frozen history. No migration. Complete evidence must include before/after hashes and commands, falsifiers, exact case assertions, pending gaps, scope/compatibility/authority review and diff checks. T1-02 and later tasks remain unstarted; v7.0.1 remains commercial baseline; V8 remains unreleased.


## Final implementation and assertion result

T1-01 only is complete, uncommitted. All nine allowlisted files are new; no pre-existing tracked file was modified. No T1-02/T1-03/T1-04 or Tranche 2 product module exists in this change.

- `canonicalBytes.ts`: deterministic full JSON encoding, Unicode code-point object ordering, preserved arrays, measured UTF-8 bytes, SHA-256, and duplicate decoded-key rejection. Rejects nonfinite/non-JSON/accessor/cyclic/sparse/prototype inputs and raw BOM/invalid UTF-8 round trips.
- `contracts.ts`: separate structural checks for submitted composition and supplemental claim data. These checks never evaluate binding predicates, supportability states, events, integrity evidence, temporal standing or sufficiency. Request path labels come from explicitly supplied caller context and are never interpreted as semantic aliases.
- `admission.ts`: reads the existing Core registry, boundaries, reason bindings and Core manifest; checks pinned identities, exact module/dependency versions, complete manifest/lock sets, raw byte and full content digests, and independently supplied attributable proof pins. Neither submitted self-rewritten content/locks nor a self-rewritten proof establishes admission. Trusted caller context must be sourced independently from the producer; the test context explicitly retains FINITE_TEST_ONLY_NOT_PRODUCT_ADMISSION.
- Successful composition input yields CHECKED_BASIS with a seven-field mesr-composition-lock/0.1 envelope and pinned references; successful supplemental shape yields CHECKED_INPUT_SHAPE. Neither publishes semantic entries/mappings/profiles/claims. `semantic_composition = WITHHELD` on every result. Invalid input yields REJECTED with zero admitted outputs. These are admission statuses, not new claim states or governance verdicts.
- The test adapter reads frozen JSON only, preserves mutation and source-input digests, invokes product code, and compares task-owned fields against frozen expectations. Product has no dependency on the reference evaluator, scripts, fixtures or test helpers.

### Before versus after

Command before runtime files existed:

```text
node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01 --before
```

Exit 0. Captured 50 exact selected case inputs, actual legacy resolver observations (including out-of-typed-domain malformed-input errors), and absence of the new private API. The latter is BEFORE_EXPECTED_GAP for each selected new side-API obligation. The four legacy verdict controls all executed successfully before implementation; their complete serialized bytes are preserved in the controls artifact.

Final product command:

```text
node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01 --record
```

Exit 0. 50/50 T1-01 slices pass: C01 checked identity/lock and attribution, 14 C-family negative comparisons including every expected diagnostic field and zero admitted outputs, 30 H structural rejections, five H structurally admitted but unevaluated inputs. All 32 separately authored controls pass. Corrupted expectation, omitted result, deliberately admitted negative and dropped-binding input controls all cause assertion failure as required. Exceptions propagate and prevent evidence writing; no evaluator exception counts as semantic rejection.

| Comparison classification | T1-01 owned assertion slices |
|---|---:|
| EXPECTED_GAP_CLOSED | 50 |
| PARTIAL_CONFORMANCE_IMPROVED | 0 |
| UNCHANGED_CONFORMING | 0 |
| UNCHANGED_EXPECTED_GAP | 0 |
| NEW_REGRESSION | 0 |

These counts compare the absent new API with its implemented T1-01 obligations. They do not replace historical B09 classifications, count six primary gaps as closed, or mean 50 whole cases achieved repaired semantic conformance. Each exact case ID, before observation, product output, comparison field and remaining obligation is recorded in the JSON artifacts. Historical legacy observations and all 139 frozen EXPECTED_GAP observations remain unchanged.

32 independent controls cover unknown identities and versions, closed composition fields, missing/extra locks and manifests, Core presence, byte lengths, duplicate raw keys including escaped equivalents, nonfinite JSON, BOM, malformed UTF-8, rewritten locks/proofs, non-JSON values/accessors/cycles/prototypes, exact raw-format versus content-domain separation, an explicitly checked Core-only basis, Unicode byte counts/key ordering, malformed JSON, input permutations, immutable result objects, and public/import isolation.

Three actual product executions yielded the same output hash:

```text
ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648
```

The existing frozen final runner also passed after implementation: 207/207, FAIL=0, ERROR=0, SKIPPED=0; historical final hash 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560 unchanged. The base runner executed 603 probes before implementation; the final runner reads their frozen result rather than rerunning them. No claim of 603 product composition probes is made; those belong to T1-04.

## Existing regression commands

Each command below exited 0 before runtime edits and in the final post-change matrix.

| Suite | Exact command | Before | After |
|---|---|---:|---:|
| R-MESR | `node scripts/verify_mesr_registry.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_reason_bindings.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_claim_stability.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_composition.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_runtime_portability.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_cross_domain.mjs` | 0 | 0 |
| R-MESR | `node scripts/verify_mesr_apaai_crosswalk.mjs` | 0 | 0 |
| R-ISOLATION | `node scripts/verify_v8_runtime_compatibility.mjs` | 0 | 0 |
| R-ISOLATION | `node scripts/verify_v8_institutional_artifact_readiness.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_governance_surface.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_governance_consumption_profile.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_audit_permit_gate.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_v7_0_example_evidence_pack.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_v7_0_1_public_surface_consistency.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_v7_0_1_current_docs_baseline.mjs` | 0 | 0 |
| R-PUBLIC | `node scripts/verify_v7_0_1_github_action_first_report.mjs` | 0 | 0 |

Additional checks: exact allow/require_review/inconclusive/block JSON/Markdown/HTML/index equality; parser string/Buffer/object positive controls and malformed JSON; validator/report rejection for null, empty object, unknown field, schema version and invalid time; all 56 reason values and dynamic output ordering; unchanged tracked source/default callers; zero test-to-product imports; 19/19 frozen worktree and raw Git blobs match the immutable manifest. Scope is limited to the pinned Node v24.15.0 environment; public Node >=18 declarations and entrypoints remain unchanged.

### Failures retained as development evidence

1. The initial new comparison checked in-memory optional `details: undefined` against JSON-persisted data, which omits that property. It failed before product comparison. Changed only the test comparator to compare serialized JSON, matching the specified byte domain; did not regenerate before evidence or change legacy code.
2. The Windows shell pipeline replaced literal Unicode characters while writing a supplemental test. Its Unicode ordering assertion failed. Replaced those test literals with explicit Unicode escapes and reran successfully; no product weakening.
3. The unchanged runtime compatibility scanner reported `unc_path_literal` on a quote/backslash sequence inside the new JSON token regular expression. Rewrote that regular expression equivalently using a Unicode escape for the quote; both the original scanner and JSON positive/negative controls pass. The scanner was not edited.

The Windows sandbox initialization failure affected shell and some patch calls; reviewed escalated shell execution completed authorized work. A later usage-limit rejection interrupted final closure after this draft was written. The owner-authorized resume below completes that checkpoint. These transient tooling/test failures are not hidden or represented as successful initial runs.

## Public contract and authority review

PUBLIC_CONTRACT_DRIFT = NO. AUTHORITY_EXPANSION = NO.

EvidencePack serialized shape/schema/parser/validator unchanged; Governance Report serialized shape and four verdicts unchanged; 56 reason values, declaration order, dynamic ordering and emitters unchanged; CLI output/exit and SDK/package exports unchanged; current default behavior unchanged. Audit output/verdict/exit unchanged, deny 25 unchanged, permit unchanged, classify unchanged. Licensing/offline authority, install/demo/version/commercial surfaces unchanged. No new public caller or export reaches the new private modules.

Recommendation-only, additive-only, non-executing, default-off, no authority scope expansion. Rejecting this auxiliary admission never blocks a real action. No execution authorization, autonomous approval/blocking, enforcement control plane, acceptance authority, legal determination, compliance certification or audit opinion. Producer/Verifier/Governance/Acceptance roles remain separate. Reference evaluator imported into product = NO. B09 frozen evidence changed = NO.

## Remaining gaps and rollback

- G08 semantic composition, relation/dependency graphs and finite Core noninterference remain T1-04. C01 is not a complete composition PASS; no contextual semantic activation is emitted.
- G02 binding/nonclaim union and six-state evaluation remain T1-02/T1-03. H08 evidence_refs and H28 verification_executed have shape coverage only.
- H18 sufficiency.requirement.tests remains T2-06 with T1 state/binding prerequisites. H29 method and H32 verification_event remain the relevant T1/T2-01 obligations. All five retain their exact frozen missing-binding/state expectations, explicitly pending in the result record.
- G05 independence/integrity/events, G07 temporal standing, G06 sufficiency/report association remain their later task cards. G03 real producer integration remains deferred and unadmitted. No T1-02+ closure or Tranche 1 exit is claimed.
- Rollback point: dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc. Review removal/revert of the new side modules and test callers only; retain this evidence, before/after artifacts and all B09 history. No destructive Git action or migration.

T1-02 started = NO. T1-01 committed = NO. B10 alone was committed as explicitly requested. No merge, tag, release or version bump. v7.0.1 remains commercial baseline; internal V8 remains unreleased.

## Artifact provenance and final scope

New files use UTF-8 without BOM, LF, final newline. Raw SHA-256 below hashes full worktree bytes, including LF. JSON result `source_hashes` pins all six new product/test code files. Their before state was ABSENT at pre_change_head; protected existing source is pinned by that commit plus B09 inventories. These are uncommitted worktree hashes, not claims of Git persistence. Only the B10 baseline and frozen B09 blob persistence are committed.

| Artifact | Bytes | Raw SHA-256 |
|---|---:|---|
| `tests/fixtures/gate1/t1-01-controls.v0.1.json` | 321851 | `08ae91fc35c07a66b0cde60822c8449984283f5ef5007b1bd62554bdd2819616` |
| `tests/fixtures/gate1/t1-01-results.v0.1.json` | 95614 | `cc9e33fc5c11957e5e3dcbdc438b4a52b4d116f589e77c3bde7e6276f70bf58b` |

| Pinned source contract | Worktree raw SHA-256 |
|---|---|
| `docs/adr/0010-mesr-canonical-id-relation-and-admission-contract.md` | `6ff26fa827194f98b7ddea6fc97aea3b2b92502b448febadf599fec315d00310` |
| `docs/adr/0016-mesr-module-version-lock-and-noninterference-contract.md` | `28488378a64b6afe674500c766f98c98422438f93233f808e3994583b988addf` |
| `docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md` | `bd6786d6f1fd18aa1caf85818967fb2d77ef430091b40bc89f27e4bb6b65a895` |
| `docs/planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md` | `5662bf3538ec2af941f3f4a1371004afdb9b4077adea6d86817156962432da74` |
| `tests/fixtures/experiment-3-repaired/freeze.v0.2.json` | `03ef69e99e644963535fe815fe7b12f37971ce2a85a0c26f76f1820e886fb8cf` |

Final working tree: exactly the nine allowlisted new files, untracked/unstaged/uncommitted. Tracked diff/stat/name-only/full diff and staged paths are empty. Ordinary `git diff` omits these new files; the final scope review also checks every untracked file individually for whitespace, UTF-8/LF and exact allowlist membership. No frozen evidence or existing product path is changed.

## Owner-authorized final closure after quota interruption

Recovery verified repository D:/AI project/mindforge-guard, branch feat/v8-gate1-tranche1-t1-01-v0.1, HEAD dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc, empty tracked/staged changes, and exactly the nine allowlisted untracked files. The earlier final-decision draft was provisional until the interrupted final checks completed here. No reset/stash/clean/rebase/deletion or implementation restart occurred.

| Recovered artifact | Classification | Closure action |
|---|---|---|
| Three product modules | COMPLETE_VALID | Full boundary review; preserve exact bytes and all three prior hashes |
| Input/comparison helpers | COMPLETE_VALID | Preserve exact bytes and existing 50-case slice |
| Product verifier | PARTIAL_VALID for resume evidence requirements | Add metadata assertions, explicit per-obligation before/after records and one regex-equivalence control |
| Controls fixture | PARTIAL_VALID metadata; valid before observations | Append task ID, pinned source contracts, case/input references, expected admission results, explicit withheld semantics and negative-control references |
| Results fixture | PARTIAL_VALID metadata; valid product execution | Re-execute the same slice and retain identical product outputs; add explicit before/after, withholding and execution counts |
| Evidence document | PARTIAL_VALID final closure | Correct interruption status, add this recovery record and complete final checks |

Both fixtures were PRESENT before recovery. Neither was recreated from B09 historical outputs. Original controls raw SHA-256 was 5120b8544c22972bd41a9d267bdef65e247136469270591fb277db5e7d6aec09; original results raw SHA-256 was f0847bf37bf957090f1b3d49c957e8cb727a7e8da22c490fcae4a97a7a783460. Controls metadata retains the exact original key inventory and capture digest: reconstruction of those original fields with the original JSON encoding must reproduce the original file hash. No before observation, legacy serialized byte control, pre-change HEAD, oracle pin or trust pin changed. Results retain prior source/replay/output hashes and assert that every current product output is identical to the recovered output envelope. Updated raw artifact hashes above reflect added evidence metadata, not new product behavior.

The only files edited during resume are the product verifier, the two Gate1 JSON artifacts and this evidence document. All nine allowlisted files remain new relative to B10; no other file is modified. T1-02 files = 0; T1-03 files = 0; T1-04 files = 0.

### Final targeted execution

- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01 --record`: exit 0, 50/50 PASS, FAIL=0, ERROR=0; unchanged case count and product output hash; three identical replays. All 32 original boundary controls remain PASS, plus one newly required regex-equivalence control, for 33/33. This additional control does not expand the 50-case slice.
- All exact 17 commands in the regression table were executed again during final closure, each exit 0: 17/17 PASS. Their pre-change evidence remains 17/17 PASS.
- `node scripts/verify_v8_b09_acceptance_resume.mjs`: executed once in resume because the final canonical-byte token regex edit in the interrupted run occurred after its last B09 execution. Exit 0, 207/207 PASS, FAIL=0, ERROR=0, SKIPPED=0, unchanged historical result hash. No subsequent product edit occurred; no further B09 rerun was needed.
- The product verifier checked all 19 frozen files against both worktree bytes and raw Git blobs again. No B09 frozen path changed.
- Exact four-verdict JSON/Markdown/HTML/index bytes, parser/validator rejection controls, 56 reason values/order and old source/default callers remained unchanged.

### VALIDATION_HELPER_FIX: VERIFIED_EQUIVALENT

Correction to the resume prompt's description: the original repository runtime-compatibility verifier was never modified. Its text scanner flagged a quote/backslash sequence in the NEW private product helper `canonicalBytes.ts`; the correction was in that helper's JSON token regex, not a newly introduced replacement compatibility verifier. This is a validation-helper source-representation fix, not a PRODUCT_SEMANTIC_FIX.

Both changed character-class quote occurrences now spell the same U+0022 character with a Unicode escape. The regex operators, alternatives, quantifiers, anchoring and other character members are unchanged. Replacing each Unicode escape with the literal quote reconstructs the predecessor regex. The resume control compares the two regexes across all 65,536 UTF-16 code units in both literal and escaped token positions (131,072 comparisons), plus six escape/truncation/trailing-input controls; all 131,078 comparisons match. The existing repository path scanner still runs unchanged and passes. Both regexes are standard JavaScript expressions without filesystem/platform branching; no path rejection rule is disabled or suppressed.

### Exact before/after obligation table

Scope is the new T1-01 admission API, absent at pre_change_head. Each BEFORE is EXPECTED_GAP on that explicit basis; each AFTER is CONFORMS_TODAY for only the asserted admission facet. These rows do not overwrite the frozen legacy-runtime classifications. `results.before_after` records assertion fields, actual output references, and all pending obligations. Every row explicitly retains WITHHELD_FOR_LATER_TASK for later semantics; no whole-case semantic closure is inferred.

| Case | Before | After | Comparison |
|---|---|---|---|
| C01 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C02 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C05 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C06.registry | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C07 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C20.producer | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C20.consumer | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C20.malformed | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C21.>=0.1.0 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C21.latest | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C21.0.1.0-rc.1 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C21.01.1.0 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C22.array | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C22.raw | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| C27 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H01 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H02 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H03 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H04 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H05 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H06 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H07 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H08 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H09 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H10 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H11 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H12 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H13 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H14 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H15 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H16 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H17 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H18 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H19 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H20 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H21 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H22 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H23 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H24 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H25 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H26 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H27 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H28 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H29 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H30 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H31 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H32 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H33 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H34 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |
| H35 | EXPECTED_GAP | CONFORMS_TODAY | EXPECTED_GAP_CLOSED |

Totals: EXPECTED_GAP_CLOSED=50; PARTIAL_CONFORMANCE_IMPROVED=0; UNCHANGED_CONFORMING=0; UNCHANGED_EXPECTED_GAP=0; NEW_REGRESSION=0. These are T1-01 obligation counts. The H08/H18/H28/H29/H32 semantic obligations remain WITHHELD_FOR_LATER_TASK, as does complete G08 composition in T1-04.

### Final boundary and scope acceptance

STRUCTURAL_ADMISSION != SEMANTIC_COMPOSITION. CANONICAL_BYTES != EVIDENCE_INTEGRITY. CONTENT_DIGEST_MATCH != INDEPENDENT_CUSTODY. IDENTITY_ADMISSION != AUTHORITY. Canonical admission != Verification != Acceptance != Execution permission. Structural checks on event/time/sufficiency record shapes do not evaluate any of those semantic claims. No new public API, canonical registry, alias, selector, authority or default-path activation was added. REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT = NO. PUBLIC_CONTRACT_DRIFT = NO. AUTHORITY_EXPANSION = NO.

Final tracked `git diff --stat`, `git diff --name-only`, full `git diff`, staged paths and `git diff --check` are empty/successful. Exact allowlist membership and each untracked file were checked separately. All nine files use UTF-8 without BOM, LF and final newline, with no trailing whitespace. Per-file no-index whitespace checks had no whitespace errors. Git's no-index exit 1 indicates a new-file difference; it is not a whitespace failure. Git also emits the existing policy's LF-to-CRLF notice for the three new TypeScript files. Those exact notices were recorded separately, worktree hashes were rechecked unchanged, and neither repository attributes nor Git configuration was changed. Hash claims remain explicitly about current uncommitted bytes; future checkout/commit byte continuity must be measured rather than assumed.

All six recorded new code hashes match the filesystem. The three product hashes still match their pre-resume values. No opportunistic cleanup, version/release file change, commit, merge, tag or publication occurred. T1-02 remains unstarted. Rollback point remains dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc.

T1-01's task-owned behavior and required final checks are complete. G08 remains partly open because full semantic composition/noninterference is expressly assigned to T1-04. The implementation is ready for owner review, with all nine new files untracked, unstaged and uncommitted.

T1_01_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS

## Owner-authorized T1-01 Git preservation

The preceding uncommitted statuses and hashes are historical observations, retained unchanged. This preservation pass stages and commits exactly the nine authorized files. Product code and the two historical JSON artifacts retain their original bytes.

The verifier alone required a persistence correction before commit: its baseline HEAD equality became an ancestor check, and its empty tracked diff requirement became an exact nine-path allowlist against the same pre-change baseline. All protected baseline paths remain checked. Without this correction staging/committing would invalidate the former untracked-only assumptions. No task assertion, oracle, product input/output or supplemental control was relaxed. Historical result source hashes remain historical; the new verifier hash is recorded below.

Pre-commit product conformance: 50/50 slices, 33/33 controls, NEW_REGRESSION=0, three identical product hashes ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648. Required regressions: 17/17 exit 0. All 19 frozen worktree/Git blobs pass. B09 207/207 remains the previously verified unchanged frozen acceptance; no product bytes changed, so no B09 rerun is required.

Byte measurement before appending this preservation section:

| Artifact | WORKTREE_SHA256 | STAGED_BLOB_SHA256 | Effective attributes | EOL behavior |
|---|---|---|---|---|
| docs/validation/v8-gate1-t1-01-evidence-v0.1.md | ccd76c796971104aa7b4577f9e660ffabc94febd831c0ca3018c9505f78d8b46 | ccd76c796971104aa7b4577f9e660ffabc94febd831c0ca3018c9505f78d8b46 | text=set; eol=lf | LF worktree and staged blob |
| packages/guard-core/src/mesr/repaired/admission.ts | 1a6d7ecbeaa5ca2fe48d262ddba1d0d89410c409ab93dd7fa2fc917e8443d37c | 1a6d7ecbeaa5ca2fe48d262ddba1d0d89410c409ab93dd7fa2fc917e8443d37c | text=auto; eol unspecified | LF worktree and staged blob |
| packages/guard-core/src/mesr/repaired/canonicalBytes.ts | b20ca04e8dd68edcc90276dc0a50cceecb64b0f4162ef115dc0e488773461a5c | b20ca04e8dd68edcc90276dc0a50cceecb64b0f4162ef115dc0e488773461a5c | text=auto; eol unspecified | LF worktree and staged blob |
| packages/guard-core/src/mesr/repaired/contracts.ts | 8130f8452f58c5dea089ceabcaf5c448dfe6972436b501ed2abf4aac598fe7d4 | 8130f8452f58c5dea089ceabcaf5c448dfe6972436b501ed2abf4aac598fe7d4 | text=auto; eol unspecified | LF worktree and staged blob |
| scripts/gate1/b09-product-compare.mjs | 304e7dc94368e27638b02c7922a20598f28cdf732249b46c73d41ca371dfff51 | 304e7dc94368e27638b02c7922a20598f28cdf732249b46c73d41ca371dfff51 | text=set; eol=lf | LF worktree and staged blob |
| scripts/gate1/b09-product-inputs.mjs | 8a8762b64ba30c3472323784568837d8e44c3be4d7cfb82b63cb5f1e29aa2f12 | 8a8762b64ba30c3472323784568837d8e44c3be4d7cfb82b63cb5f1e29aa2f12 | text=set; eol=lf | LF worktree and staged blob |
| scripts/verify_v8_gate1_product_conformance.mjs | bab2d2e1fa4e70c7ea3b4a6f99b7ec6acca8981ddc02eedc876736ce80cb37b8 | bab2d2e1fa4e70c7ea3b4a6f99b7ec6acca8981ddc02eedc876736ce80cb37b8 | text=set; eol=lf | LF worktree and staged blob |
| tests/fixtures/gate1/t1-01-controls.v0.1.json | 08ae91fc35c07a66b0cde60822c8449984283f5ef5007b1bd62554bdd2819616 | 08ae91fc35c07a66b0cde60822c8449984283f5ef5007b1bd62554bdd2819616 | text=set; eol=lf | LF worktree and staged blob |
| tests/fixtures/gate1/t1-01-results.v0.1.json | cc9e33fc5c11957e5e3dcbdc438b4a52b4d116f589e77c3bde7e6276f70bf58b | cc9e33fc5c11957e5e3dcbdc438b4a52b4d116f589e77c3bde7e6276f70bf58b | text=set; eol=lf | LF worktree and staged blob |

The verifier is restaged after its documented correction. No staging normalization changes these LF bytes. core.autocrlf=true means the three TypeScript files may check out with CRLF later; that would be a different worktree byte representation and must be measured separately. No attributes or Git configuration changed. The evidence-file hash in this table deliberately covers its historical pre-append representation, avoiding a self-hash claim. Final staged evidence bytes are checked against the worktree and reported by the preservation execution; subsequent T1-02 evidence will retain that final committed hash.

T1-02 remains unstarted at this checkpoint. Public contracts, audit output/verdict/exit, deny 25, permit/classify and licensing are unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority expansion.

Preserved execution failure: the first regression sequence stopped at public-surface consistency because the verifier persistence edit was temporarily unstaged; that existing verifier inspects unstaged changed paths. After restaging the authorized edit, the unchanged public-surface verifier passed, followed by current-docs and GitHub Action checks (all exit 0). All 17 required checks therefore have final exit-0 results. No public verifier or product source was changed to obtain that result.
