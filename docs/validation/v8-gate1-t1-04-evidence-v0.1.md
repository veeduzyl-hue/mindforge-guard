# Gate 1 T1-04 evidence v0.1

Status: T1_04_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS. Final acceptance, representation audit and same-state smokes passed. Owner-review package is uncommitted. This is not formal Tranche-1 closure.

## Task and accepted lineage

- Repository: D:/AI project/mindforge-guard
- Branch: feat/v8-gate1-tranche1-t1-04-v0.1
- Task: T1-04 - Atomic composition and finite Core noninterference
- Gap: G08 semantic composition / finite Core noninterference
- T1_04_PRE_CHANGE_HEAD / rollback point: ef3e5b7fbcd8854d99a680bf532816b50cc851cd
- T1_01_COMMIT: 7726fc7f58305e59ea7359d9658494b7695bfa4d
- T1_02_COMMIT: c5a66b50cefc39002dea190af078a49a7c47e3d4
- T1_02_VERIFIER_CLOSURE_COMMIT: 2b0e9facb48795533ad96545e318c54ce535515b
- T1_03_COMMIT: ff263558cf45d4ad3d42b98e1f983b9f89b1a883
- T1_03_VERIFIER_CLOSURE_COMMIT_1: 12d5529b608b13c2c518005721d60d558c9804ea
- T1_03_VERIFIER_CLOSURE_COMMIT_2: ef3e5b7fbcd8854d99a680bf532816b50cc851cd

Initial baseline was clean. Interrupted runs were resumed without reset, stash, rebase, branch recreation, historical edits, or commits. Recovery at the final checkpoint classified controls COMPLETE_VALID, composition/verifier/inputs/compare PARTIAL_VALID, and results/evidence NOT_PRESENT. The immutable BEFORE artifact was preserved throughout.

## Exact seven-path allowlist

- packages/guard-core/src/mesr/repaired/composition.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t1-04-controls.v0.1.json
- tests/fixtures/gate1/t1-04-results.v0.1.json
- docs/validation/v8-gate1-t1-04-evidence-v0.1.md

No directory wildcard, Tranche-2 path, G03 path, release asset, or version file is authorized. Shared adapter changes are append-only and the verifier checks their accepted source prefixes. Existing task allowlists and all accepted product/fixture/evidence Git blobs remain pinned. The historical closure verifier is validated from its exact accepted Git blob; pending T1-04 verifier edits are governed separately by the seven-path scope. The guard accepts no unknown future task or intervening commit.

## Canonical task card recovered from repository

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

Common compatibility/default-off/completion/reversibility fields from plan sections 2-3 and change-control contract apply in full: no public or default caller, no old schema/enum/reason/report changes, exact before/after hashes and commands, no reference evaluator import, immutable B09 and historical evidence. Rollback is a reviewed removal/revert of only T1-04 additions/shared test changes, retaining evidence; no destructive reset or data migration.

## Contract byte pins

SHA-256 of exact UTF-8 worktree bytes at BEFORE, still protected by unchanged source scope:

| Path | SHA-256 |
|---|---|
| docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md | bd6786d6f1fd18aa1caf85818967fb2d77ef430091b40bc89f27e4bb6b65a895 |
| docs/planning/22_GATE1_CHANGE_CONTROL_CONTRACT.md | 5662bf3538ec2af941f3f4a1371004afdb9b4077adea6d86817156962432da74 |
| docs/adr/0010-mesr-canonical-id-relation-and-admission-contract.md | 6ff26fa827194f98b7ddea6fc97aea3b2b92502b448febadf599fec315d00310 |
| docs/adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md | 2b12c78cde5138d9ccd1206fed42f2b2e19c0cd8b872ff90b5ffccc4168b26a2 |
| docs/adr/0016-mesr-module-version-lock-and-noninterference-contract.md | 28488378a64b6afe674500c766f98c98422438f93233f808e3994583b988addf |
| docs/validation/v8-b08-composition-hardening-cases-v0.1.md | 100e31ebb834395eaaab9b7f054c25d072f0a88af32b887d5aba088376d396ce |

## Immutable BEFORE

Artifact: tests/fixtures/gate1/t1-04-controls.v0.1.json

SHA-256: a9de9d4c1b25751efc217ae01457be56caede29ba058a9693f9329417fe06f6f

41 C-family cases + 5 H controls (H22-H25, H31), each with original input, input digest, actual T1-01 admission, and legacy resolver observation. BEFORE_CONFORMING=0; BEFORE_PARTIAL_CONFORMANCE=0; BEFORE_EXPECTED_GAP=46 for the not-yet-present T1-04 API. Existing legacy/admission behavior is preserved as evidence, never relabeled T1-04 closure. The 603 probe records preserve actual Core-only T1-03 outputs and explicitly absent composition outputs. No AFTER product output was used to reconstruct BEFORE.

17/17 BEFORE regressions PASS. First attempt stopped at the old public-surface consistency verifier because it compares .git/index stat data and requires authorized task changes staged. Only authorized paths were staged; the historical verifier and expectations were unchanged. This environment prerequisite was also recorded in accepted T1-03 evidence. The completed BEFORE capture occurred before composition.ts existed.

## Product implementation and boundary

composition.ts is a private, explicit side path. It calls T1-01 admission, invokes the unchanged legacy resolver only after shape checks, and publishes all semantic entries/mappings/profiles together only after every admission/composition check passes. Invalid results have empty active collections, empty resolved_modules and no core_basis_input. No valid subset is activated.

The requested set is finite and explicit. Exact module/semantic identity, version, canonical content and supplied raw-byte locks remain T1-01 responsibilities. Dependencies retain identity/version/digest tuples; missing, mismatched, cyclic and unsupported forward resolution reject. Existing Core/software modules supply canonical meaning; no second registry, general resolver, dynamic latest, discovery, network, loader or scheduling is introduced.

Core and software inventory comparisons identify support widening, nonclaim removal and binding weakening. Full inventory changes need their existing admitted contract; a rewritten caller lock/proof or conformance label cannot substitute. Crosswalks stay maps_to only, profiles presentation-only, and their compatibility basis must be nonempty, pinned and resolve to supplied module versions. Effective-change requests cannot replace Core requirements/nonclaims/state precedence.

Typed alias/supersession/dependency graphs are checked separately. Cycle witnesses use sorted traversal and canonical rotation. Descriptive adjacent_to/orthogonal_to cycles remain inert; no alias, entailment, stronger_than or weaker_than traversal activates. Module load order preserves the legacy type/localeCompare order under pinned Node/ICU. Auxiliary diagnostics use code-point tuple ordering; only nonsemantic outer inventories are normalized. Manifest array order/raw bytes retain their lock meaning.

T1-02 remains the predicate/requirement/nonclaim owner. collectComposedRequirements delegates to that collector through an in-process admitted composition and its exact Core-only basis. Forged/serialized VALID objects and rejected compositions are not accepted. T1-03 remains the only state selector; composition.ts imports neither claimState nor evaluateClaim. CLAIM_COMPOSITE_SUPPORTABILITY != SEMANTIC_MODULE_COMPOSITION.

## Diagnostic representation and legacy preservation

The result retains the complete raw T1-01 admission object and exact legacy issue bytes/order separately. Auxiliary diagnostics give more specific composition reasons: missing dependencies supplement the admission version mismatch; a canonical dependency cycle explains the Core-manifest umbrella mismatch; named semantic failures explain unproved admission. These do not delete raw failures or permit activation. All five C oracle fields (status, semantic_entries, mappings, profiles, diagnostics) are fully compared with no oracle diagnostic filtering. H rows retain their exact frozen status obligation plus explicit all-or-zero checks.

Initial product comparison was the actual execution output MATCH 46 (41 complete C comparisons; 5 malformed H rejections). Later acceptance adds full assertions rather than changing expectations. Complete legacy resolver outputs were independently compared against BEFORE: 38/38 equality, with 8 shape failures correctly not passed to typed resolution. Legacy resolver source remains unchanged.

## Finite probes and falsifiers

The exact frozen probe recipe is 30 Core base requests, every entry.required_bindings value replaced in turn with null, empty string, empty array and false, plus every Core nonclaim with a caller-positive assertion. Total: 603. The fixture inputs are checked exactly against BEFORE; there are no invented probes to increase the count.

Each probe compares the protected BEFORE output, current Core-only product output, C01 composition output and C24 descriptive-context output. Core manifests and activated entries are equal in full; T1-02 collection equality preserves predicate/source/path semantics. Nonclaims remain UNSUPPORTED and named missing bindings remain missing. Composition cannot change definitions, IDs, positive/nonclaim sets, binding requirements, claim boundaries, state meaning or precedence. This is a finite proof for the admitted inventory, not universal semantic interoperability or specialized Tranche-2 assurance.

24 module permutations each for C01/C24 plus reversal of all 46 cases give 94 recorded permutation rows. Supplemental mutations also compare reversed outputs. Supplemental controls include fake VALID, forged resolution, duplicate identities, digest/version errors, Core overrides/widening/nonclaim/binding changes, predicate weakening, profile masking, unknown changes, alias/lifecycle/entailment/incompatible mappings, empty/missing compatibility proof, duplicate JSON keys, partial activation, self-authored proof/locks, malformed/cyclic JSON, immutable result isolation, and injected unexpected helper errors. Unexpected exceptions propagate as errors, never become rejection PASS or VALID fallback. Corrupted oracle, dropped result/diagnostic/binding and deliberate false-positive controls make the comparator fail.

An early harness-only comparison failure exposed JSON serialization omitting undefined properties; comparison now uses the same serialized representation as the frozen capture. The nonclaim assertion uses T1-03's existing string-array contract. Neither legacy output nor the frozen oracle was edited. Initial complete acceptance produced three equal f660567b1863468097f36b1bff11a219654f4071e21374550e44c68a2afdccf9 hashes with 37 controls; final hardening adds empty-dossier and duplicate-key controls and requires new final replays below.

## Required commands and prior-task preservation

BEFORE and AFTER use these exact commands; complete stdout/source hashes/exits are retained in the JSON evidence:

- `node scripts/verify_mesr_registry.mjs`
- `node scripts/verify_mesr_reason_bindings.mjs`
- `node scripts/verify_mesr_claim_stability.mjs`
- `node scripts/verify_mesr_composition.mjs`
- `node scripts/verify_mesr_runtime_portability.mjs`
- `node scripts/verify_mesr_cross_domain.mjs`
- `node scripts/verify_mesr_apaai_crosswalk.mjs`
- `node scripts/verify_v8_runtime_compatibility.mjs`
- `node scripts/verify_v8_institutional_artifact_readiness.mjs`
- `node scripts/verify_governance_surface.mjs`
- `node scripts/verify_governance_consumption_profile.mjs`
- `node scripts/verify_audit_permit_gate.mjs`
- `node scripts/verify_v7_0_example_evidence_pack.mjs`
- `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs`
- `node scripts/verify_v7_0_1_public_surface_consistency.mjs`
- `node scripts/verify_v7_0_1_current_docs_baseline.mjs`
- `node scripts/verify_v7_0_1_github_action_first_report.mjs`

Final T1-04 acceptance command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-04 --record --regressions`. Native Node module invocation with the same argv was used to limit error printing; no assertions, runtime inputs or commands were bypassed.

Same final product/test source state, all exit 0:

- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01`: 50/50 slices, 33/33 controls, PASS. Product replay hash ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648.
- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-02`: 13/13 slices, 20/20 controls, PASS. Replay hash 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872.
- `node scripts/verify_v8_gate1_product_conformance.mjs --task T1-03`: 38/38 slices, 56/56 controls, PASS. Replay hash 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf.

VERIFIER_LINEAGE_GUARD=STRICT. Unknown task, missing/tampered/nonancestor anchor, unauthorized historical/closure/pending paths, intervening commits and tampered/dropped allowlists reject. Prior product meaning and accepted fixtures are unchanged.

## B09 and public/authority review

B09=NOT_RERUN. Both frozen runners import scripts/b09/reference.mjs and runtime-observer.mjs (acceptance also imports input-admission.mjs). Observer uses existing moduleManifest/supportEvaluator/temporalBasis/EAK/report/coverage surfaces. Their full static local import closure contains 24 unchanged files and no repaired module. Exact paths, import edges and source digests are retained in the final result. No reference evaluator is imported or copied into product. All 19 frozen worktree artifacts and their accepted Git blobs match the frozen manifest.

Public-contract review: EvidencePackV1 1.0.0, parser/validator, all 56 reason values/order/emitters, GovernanceReportModel 1.0.0 and allow/require_review/inconclusive/block, JSON/Markdown/HTML/index output bytes, public CLI/SDK/package exports, audit output/verdict/exit, deny 25, permit, classify, licensing/offline authority and v7.0.1 defaults are unchanged. Four legacy report dispositions and invalid parser/validator controls are compared with BEFORE; protected implementation paths have empty diffs. No default/public caller reaches repaired modules.

Authority review: recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. VALID_COMPOSITION != AUTHORITY, SAFE, ACCEPTED, COMPLIANT or EXECUTION_PERMISSION. MODULE_ADMITTED != TRUSTED_TO_EXECUTE. No runtime enforcement, orchestration, control plane, report verdict takeover, institutional acceptance, legal determination, certification or audit opinion.

Remaining work outside T1-04: G05 verification/integrity/independence, G07 current standing/continuity, G06 profile sufficiency/report association, and G03 truthful Harness integration. WITHHELD_FOR_TRANCHE_2 is explicit. No Tranche-2/G03 implementation, commit, merge, tag, release, version bump or formal Tranche-1 closure is authorized/performed.

## Final acceptance and scope

Final acceptance is complete. The records below supersede only the draft pending status; historical attempts and immutable BEFORE remain preserved.


## Final closure chronology and representation policy

After final hardening, all three 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554 task replays and 17/17 AFTER regressions had passed. The final metadata audit then compared ordinary reasonCodes.ts CRLF worktree bytes directly with its LF Git blob and stopped before writing the result fixture. Finding: SOURCE_REPRESENTATION_COMPARISON_DEFECT, not PRODUCT_REGRESSION, B09_EVIDENCE_MUTATION or PUBLIC_CONTRACT_DRIFT.

The repair is REPRESENTATION_LAYER_ONLY: ordinary tracked sources are compared using git hash-object --path=<tracked-path> with the repository Git clean/text rules, without -w or source mutation. Both original raw SHA-256 domains are recorded; raw equality is not asserted for normalized text. The 19 frozen B09 artifacts still require exact worktree and Git-blob equality to their frozen expected SHA-256. No product code, C/probe/control/permutation expectation, prior-task expectation, lineage allowlist or public/authority assertion was changed by the repair. Closure metadata also records previously executed smoke/legacy checks.

The repaired verifier then completed a fresh three-replay set and the exact 17-command AFTER matrix, exit 0, and successfully wrote the result fixture. Final product, inputs and comparator fingerprints remained unchanged. Final T1-01/T1-02/T1-03 were subsequently executed again on this exact final verifier/product state, all exit 0. The new fidelity model was separately falsified using only in-memory inputs: two LF/CRLF positives and six real-content negatives, 8/8 PASS. These are source-fidelity checks, not additions to the 39 semantic supplemental controls.

| Source-fidelity control | Expected equivalent | Result |
|---|---|---|
| same-text-LF | true | PASS |
| same-text-CRLF | true | PASS |
| text-token-change | false | PASS |
| deleted-line | false | PASS |
| added-semantic-token | false | PASS |
| changed-reason-value | false | PASS |
| changed-export | false | PASS |
| changed-import | false | PASS |

## Final machine-readable acceptance

Result artifact: tests/fixtures/gate1/t1-04-results.v0.1.json

| Surface | Result |
|---|---|
| C cases | 41/41 PASS |
| H malformed controls | 5/5 PASS |
| Supplemental controls | 39/39 PASS |
| Core noninterference probes | 603/603 PASS |
| Permutation records | 94/94 PASS |
| Legacy callable full-output equality | 38/38 PASS; 8 shape-rejected inputs not called |
| BEFORE regressions | 17/17 PASS |
| Final AFTER regressions | 17/17 PASS |
| Ordinary source normalized content | 24/24 PASS |
| Source-fidelity positive/negative controls | 8/8 PASS |
| Frozen B09 worktree / Git blobs | 19/19 and 19/19 PASS; STRICT |
| Same-state T1-01 | 50/50 slices; 33/33 controls PASS |
| Same-state T1-02 | 13/13 slices; 20/20 controls PASS |
| Same-state T1-03 | 38/38 slices; 56/56 controls PASS |
| Verifier lineage | STRICT |

Final case IDs: C01, C02, C03.within, C04, C05, C06.literal, C06.registry, C07, C08.override, C08.collision, C09, C10, C11, C12, C13, C14, C15.source, C15.profile, C16.crosswalk, C16.profile, C17.target, C17.provenance, C18, C19, C20.producer, C20.consumer, C20.malformed, C21.>=0.1.0, C21.latest, C21.0.1.0-rc.1, C21.01.1.0, C22.array, C22.raw, C23, C24, C25, C26.supersedes, C26.refines, C26.stronger_than, C26.weaker_than, C27, H22, H23, H24, H25, H31.

Valid finite composition, identity/version/digest/content locks, dependency validation, Core nonclaim preservation, binding non-weakening, relation/cycle safety and atomic invalid rejection: PASS. Duplicate modules/semantic IDs, Core overrides/support widening, fake VALID, empty compatibility dossier and duplicate JSON keys: REJECTED. Malformed/error paths fail closed; no positive fallback. PARTIAL_ACTIVATION=NONE. LEGACY_RESOLVER_REGRESSION=0.

The results counts field covers 41 C-family cases; supplemental_h_counts covers the five H rows separately. Aggregate task-case classification below includes both, while 603 probe obligations remain separately counted.

| Classification | C-family | H controls | All 46 task cases |
|---|---|---|---|
| EXPECTED_GAP_CLOSED | 41 | 5 | 46 |
| PARTIAL_CONFORMANCE_IMPROVED | 0 | 0 | 0 |
| UNCHANGED_CONFORMING | 0 | 0 | 0 |
| UNCHANGED_EXPECTED_GAP | 0 | 0 | 0 |
| NEW_REGRESSION | 0 | 0 | 0 |

## Final hash domains

BEFORE_SHA256 = a9de9d4c1b25751efc217ae01457be56caede29ba058a9693f9329417fe06f6f

PRODUCT_COMPOSITION_SEMANTIC_HASH = 54f1ca57cfcd5fd65e06dbe92bd6b1fc58ee65a09db17323c189a96e122ba166

FINAL_REPLAY_1_HASH = 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554

FINAL_REPLAY_2_HASH = 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554

FINAL_REPLAY_3_HASH = 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554

T1_04_RESULT_HASH = 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554

VALIDATION_ENVELOPE_HASH = ff5d09b28521a18bb95db0f0110ac818b9ca0a21bdf6ca8669a00cb70c2917ab

These are distinct domains. Product hash covers actual composition outputs. Replay hashes cover the complete task evaluation payload named in hash_domains, including the 603 probe results and controls; they exclude later verifier metadata. The full persisted validation-envelope hash additionally covers source fingerprints, representation audits, regressions and same-state smokes, excluding only its own hash field. The prior f660567b1863468097f36b1bff11a219654f4071e21374550e44c68a2afdccf9 hash is historical pre-final-hardening evidence only. Product/evaluation outputs stayed stable across the representation-only repair; the envelope has its own digest. DETERMINISM=PASS.

| Final product/test path | Worktree raw SHA-256 |
|---|---|
| packages/guard-core/src/mesr/repaired/composition.ts | dd0f076aa569cd773f872de21ac647fc8b3fc174430d7cb30fbd76d7b2a940f9 |
| scripts/verify_v8_gate1_product_conformance.mjs | 64b9876cc5834e871b0baa021c3ed175d973b7d3b1091a02b5fae557358fd280 |
| scripts/gate1/b09-product-inputs.mjs | 5a1e1be48d94336f944d3939351b14f7c81bd3c09e0ceed560398b8c65931256 |
| scripts/gate1/b09-product-compare.mjs | 6e3ed8906148c190cf9895c1da6b904397d53a95ce0ee3256c4c6511c77d4499 |

## B09 exact source dependency evidence

B09=NOT_RERUN. The two roots are scripts/verify_v8_b09_acceptance_resume.mjs and scripts/verify_v8_b09_repaired_experiment_3.mjs. All 24 reachable local source files below exclude repaired/ modules; the results artifact retains every import edge. Each row has NORMALIZED_CONTENT_EQUIVALENT=YES. Raw byte digests are intentionally distinct where checkout representation differs. No source was rewritten to force equality.

| Reachable source | WORKTREE_RAW_SHA256 | GIT_BLOB_SHA256 |
|---|---|---|
| packages/guard-core/src/errors.ts | 156718c991213fd50f0c13dcc434b45179ac7bcd13e77b7e945f3e088fcd0b81 | da131c15e115aebf1a1555db9881439b28a682f39d76090a39f9f4657ad1398e |
| packages/guard-core/src/evidenceAssuranceKernel.ts | 0b7f6c2052b8e7fdebec8b3abfbdeaf0a69c62d427c221c96541f5af6dfd0edd | 65d89532ad3e9d0642b4a9db05cce112e666925f40b925ebaf9d4233ef6e8b45 |
| packages/guard-core/src/externalEvidence/registryTypes.ts | 1dbf8bff0f38e8ff005320c5060fab26848532977733426f3348d1660de53e23 | 5fdc22355a709236626187b56dd55b77ce237f95c194901b97bc2102f87bf261 |
| packages/guard-core/src/externalEvidence/types.ts | 25b4dd155b971e82dbc861c2a1b1b89e1d547a662db717d2b82cf5ae619ede75 | 09a1143ae43cb74466947c9f797512add3bf874dee3dd539d982cabdd4b7eb04 |
| packages/guard-core/src/externalEvidence/verificationTypes.ts | dec40ce89aeca3e9f5a75812021a39d911886b550f9923fd502c8d00b8ac4737 | d2401e074d0788b32c97cde580382b7a29a447ffbc9587500b2bf4901f98087c |
| packages/guard-core/src/generateGovernanceReport.ts | 95247bd5e50136cb1b5fece20b3f8ee1375af94dd9b68a8c4f2d1b1d37bfbdf9 | a5d3188698761e4804dddfa050fd36e9664706e5980311408f191d258ba3fb21 |
| packages/guard-core/src/inspectEvidenceCoverage.ts | bde012606681ca7203d0254bb350e5f212b5a7f03b19956d95a07b2eb721efc6 | d98392bae4014c6d63b82ffe89c915df94cd45671a58ebcdc5144e22e740d4b8 |
| packages/guard-core/src/mesr/claimBoundaries.ts | 1553a37b2f7af353e4647d6009fa2d1b9b50cc89f22cfe728cdd51552cd03454 | 1553a37b2f7af353e4647d6009fa2d1b9b50cc89f22cfe728cdd51552cd03454 |
| packages/guard-core/src/mesr/coreRegistry.ts | 8982d4355ecca8f0d3a5b59c7d4be1c7488f82098e3d97c710135dcbc8dc51d5 | 8982d4355ecca8f0d3a5b59c7d4be1c7488f82098e3d97c710135dcbc8dc51d5 |
| packages/guard-core/src/mesr/moduleManifest.ts | 45aa69385ae32149c63753b7f1a76bec45d7a820beb441119fe7e7973f2fc191 | 45aa69385ae32149c63753b7f1a76bec45d7a820beb441119fe7e7973f2fc191 |
| packages/guard-core/src/mesr/softwareDomainSeed.ts | cb6ba396e112d1a4580980fc4109cdfc612c93f689018a2301cbdde53e0c880e | cb6ba396e112d1a4580980fc4109cdfc612c93f689018a2301cbdde53e0c880e |
| packages/guard-core/src/mesr/supportEvaluator.ts | 2841616bb1f20e630a3bfe43debad2527d79410c7b54ae724cff0fd4b63b44b1 | 2841616bb1f20e630a3bfe43debad2527d79410c7b54ae724cff0fd4b63b44b1 |
| packages/guard-core/src/mesr/temporalBasis.ts | 9ffe4471a3a31e35e7ee65dd011daaff3baff49290609254f015e5ffc24d445e | 9ffe4471a3a31e35e7ee65dd011daaff3baff49290609254f015e5ffc24d445e |
| packages/guard-core/src/mesr/types.ts | 26f694c046f51476c01c090b2e8ae1670fdf24be0fc40d7726451c30f52da7cc | 26f694c046f51476c01c090b2e8ae1670fdf24be0fc40d7726451c30f52da7cc |
| packages/guard-core/src/parseEvidencePack.ts | f63d8fba409605daf060318d470b6e303cc1a2b24afa54e781ba2bada218ae32 | f8d960427968f446abcc2bdde78b599c5c625b2c000f909d63b6a56dd4a10b1d |
| packages/guard-core/src/reasonCodes.ts | d24ad17e1c50552f18f2508f589f3c594c0ddb77f41ae05a8977adae257e8198 | 1463f61593d71159c0c9632546b904b97be005ff77590c7feb713a201e854f3e |
| packages/guard-core/src/reportModel.ts | 1aeac46d08bae242da7995dbcf2f2b6f2e38dd6f89749b5c6cf47b67f6b2e64b | 1aef0f82331b02f9412c5a9379882649b8664774ed99ba58af44226c990ef3b1 |
| packages/guard-core/src/validateEvidencePack.ts | e89b508006b28a5445776a08bc9aaae33f648992580f40dc80220b6c8546cbbd | 047dce7dbaf9d2be8fccae57b820c2ec72d2e7ed8493146dfb42074661ca2e46 |
| scripts/b09/input-admission.mjs | 28cdfb2cf7b2b9586e0809d84ec79512ab2da7e21d58fd7e47a63f87cebcdf0a | 28cdfb2cf7b2b9586e0809d84ec79512ab2da7e21d58fd7e47a63f87cebcdf0a |
| scripts/b09/reference.mjs | 6a2991a6b3a09c4d21d95c7b966e2c953400da01a202ee6179d671ca896a0d11 | 6a2991a6b3a09c4d21d95c7b966e2c953400da01a202ee6179d671ca896a0d11 |
| scripts/b09/runtime-observer.mjs | 32ed6a6e38e437f5782ae431f9c74d49e0b5d966e396f8ab7ff6e92606b5b70c | 32ed6a6e38e437f5782ae431f9c74d49e0b5d966e396f8ab7ff6e92606b5b70c |
| scripts/fixtures/evidence_assurance_experiment_0_cases.mjs | 70a68ce681a32735e76bfefcdfb5a5722cc5abf449b29555317cb612ae70b7b5 | 70a68ce681a32735e76bfefcdfb5a5722cc5abf449b29555317cb612ae70b7b5 |
| scripts/verify_v8_b09_acceptance_resume.mjs | 2578634bdf32afd5661b5de757133da905309e2d4ad8370d4dc20001478c37fc | 2578634bdf32afd5661b5de757133da905309e2d4ad8370d4dc20001478c37fc |
| scripts/verify_v8_b09_repaired_experiment_3.mjs | 85388c6447083d7b5a6fd2b073ce898b675f1a24b5bd994cec2fa19b3eadecdc | 85388c6447083d7b5a6fd2b073ce898b675f1a24b5bd994cec2fa19b3eadecdc |

B09_FROZEN_BYTE_POLICY=STRICT; B09_FROZEN_EVIDENCE_CHANGED=NO. The results artifact contains all 19 expected/worktree/Git digests. The ordinary-source normalization policy does not apply to or weaken those frozen checks.

## Owner-review decision and final scope

PUBLIC_CONTRACT_DRIFT=NO. AUTHORITY_EXPANSION=NO. REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT=NO. Audit output/verdict/exit, deny 25, permit and classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Existing EvidencePackV1/parser/validator/reason/report/CLI/SDK/licensing and v7.0.1 behavior remain unchanged.

Remaining G08 T1-04 obligations: NONE within the admitted finite inventory. Remaining G05/G07/G06: independent verification/integrity, temporal/current-standing/continuity, profile-bound sufficiency/report association, WITHHELD_FOR_TRANCHE_2. Remaining G03: truthful Harness canonical integration, not started or authorized here.

TRANCHE_1_IMPLEMENTATION_TASKS_COMPLETE_CANDIDATE=YES. TRANCHE_1_FORMALLY_CLOSED=NO. Formal closure requires separate owner review. T1-04 committed=NO; Tranche 2 started=NO; G03 started=NO. No merge/tag/release/version bump. Rollback point remains ef3e5b7fbcd8854d99a680bf532816b50cc851cd.

Final scope is exactly the seven allowlisted paths, with no eighth path, no Tranche-2/G03/B09-frozen/release changes and no accepted earlier product changes. All seven task files are staged for byte-fidelity verification, not committed. Worktree/staged Git-blob equality is checked after this document is written; no committed persistence is claimed.

T1_04_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS
