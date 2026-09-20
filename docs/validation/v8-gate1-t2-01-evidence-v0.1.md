# T2-01 bounded implementation evidence v0.1

Decision: **T2_01_IMPLEMENTATION_FAIL** (mandatory AFTER acceptance matrix incomplete). Product controls passed; no product-semantic regression was observed. One historical public-document task rejects this task’s authorized dirty paths before checking public content. This is not a T2-02/T2-03/G03 failure.

## Identity and scope

- T2_01_ENTRY_COMMIT: d2cd1460684b37e3a3ca8e8e1e958d15b3357d28
- T2_01_PRE_CHANGE_HEAD / PRODUCT_BEFORE_HEAD: d2cd1460684b37e3a3ca8e8e1e958d15b3357d28
- Branch: feat/v8-gate1-tranche2-t2-01-v0.1.
- Implementation remains uncommitted. No merge, tag, release or version bump.
- Exact seven-path allowlist:

- packages/guard-core/src/mesr/repaired/verificationEvent.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t2-01-controls.v0.1.json
- tests/fixtures/gate1/t2-01-results.v0.1.json
- docs/validation/v8-gate1-t2-01-evidence-v0.1.md

## Immutable BEFORE and inherited acceptance

The BEFORE fixture is immutable; SHA-256: 6f0fbc92fb7347c3fe814bd534fcd58740fd96794943d675519b7f5dbd52185e. Its status is BEFORE_PASS: 21/21 regressions; 1,422 protected file fingerprints; 50 T1-01, 13 T1-02, 38 T1-03, 46 T1-04 output fingerprints; 603 Core probes. Capture preceded all product edits. Original four literal witness declarations and 24 B09 task observations remain in the frozen capture. No AFTER output was reconstructed as BEFORE.

Accepted receipts: 14ffe82625313f75076d8dcc39950770523c128e, eb70e2cb5afb7c6fcd5e49766da9e5f90103471c, e82bf33ca54187d889e534a92514096e26379c12. Only six planning/entry documents changed between formal closure and entry. TRANCHE1_ACCEPTED_BASELINE_INHERITED=YES; CURRENT_PRODUCT_EQUIVALENT_TO_ACCEPTED_BASELINE=YES at BEFORE.

Historical T1-01 branch-mode result: NOT_APPLICABLE_BY_BRANCH_GUARD (HISTORICAL_TASK_BRANCH_CONTEXT_MISMATCH). T1-02/03/04 historical modes: NOT_RUN. No historical task mode was rerun for AFTER acceptance.

The distinct T2-01 preservation mode compares frozen API/output fingerprints. The historical verifier is checked in full against the entry Git blob after reversing only three explicit task-dispatch additions in memory. Existing historical branch/lineage checks and their falsifiers remain unchanged. No HEAD-specific return bypass, descendant exemption or aggregate historical-path admission is used. LINEAGE_GUARD=STRICT.

## Implementation and boundaries

The private module evaluates supplied offline JSON records and exact source/context/event associations. Its only four side annotations are NO_ATTRIBUTABLE_OCCURRENCE, ATTRIBUTABLE_OCCURRENCE, ATTRIBUTABLE_OCCURRENCE_WITH_RESULT, and ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED. They are not primary claim states; the side output has no state field.

Occurrence requires event identity, namespace/reference, subject/revision/scope, property, method/version, zoned event time, producer/checker attribution and retained associated output. Result additionally requires selected event/result association, input/output records, criterion, one explicit passed/failed/inconclusive value, limitations and matching fields. Missing, null, empty, whitespace, type and association errors retain distinct diagnostics and raw facts. No event, result, clock, actor, criterion, input or output is invented.

Only individually complete bound result records enter existing T1 bindings and evaluateClaims. All Core and caller obligations remain conjunctive. The reserved t2_01_result_basis requirement is computed from retained facts; collisions are rejected. Occurrence-only annotations coexist with UNRESOLVED stronger verification claims. Comparable conflicting results enter T1 together using a retained caller-supplied result-set reference; no passing/first/last/majority winner is chosen. Predicate/context ambiguity remains explicit.

Existing verification.occurred and the T1-03 selector are unchanged. No edits to evaluateClaim.ts, claimState.ts, requirements.ts, composition.ts, contracts.ts, registries, reason bindings or public exports. T1-04 finite Core noninterference remains preserved.

Witnesses are literal accepted hypothetical dossier declarations with explicitly supplied facts, not claims that a real check ran. Additional conflict and negative controls are test declarations only. Frozen B09 records lacking the richer native joins are retained without fabricated enrichment; their original T1 outputs are compared separately. No real Harness integration is claimed.

## Observed execution

- Task command: node scripts/verify_v8_gate1_product_conformance.mjs --task T2-01 --record.
- Annotation cases: 370/370 PASS (exact inventory and input hashes in results).
- Bridge / boundary / bypass controls: 64/64 PASS.
- Complete passed, failed and inconclusive results delegate successfully to T1.
- Occurrence-only and missing result facts leave stronger claims unresolved.
- Identical results, passed/failed conflict, different criterion/subject/scope/time/event ID, retained candidate sets, order and majority controls passed.
- Reserved binding, annotation/state/VALID hints, fake event/checker/criterion/references and unretained-result bypasses rejected.
- Exit zero, counts, producer assertion, array metadata and report allow shortcuts rejected.
- Malformed envelope/duplicate JSON keys and unexpected helper-error controls produce no positive annotation.
- T1-01/02/03/04 semantic/output preservation: PASS.
- Core 603 noninterference: PASS. Protected hashes: 1,422 preserved.
- Legacy JSON/Markdown/HTML/index, parser/validator and reason ordering comparison: PASS.
- Exact frozen AFTER command set: 20/21 PASS. No substitutions.

The initial task process completed all task controls, all three replays, preservation and the first 18 regressions, then exited at regression 19 before writing its full output payload. The last two regressions were run directly and passed. Results preserve actual log receipts, case inventory and hashes; they do not pretend the unretained full output payload was recovered. The verifier was subsequently changed only to record all regression failures and return nonzero rather than discard completed evidence. Product/control definitions did not change, and accepted annotation controls were not unnecessarily rerun.

Type check passed with --noEmit --allowImportingTsExtensions --target ES2022 --module nodenext --moduleResolution nodenext --skipLibCheck --strictNullChecks. The initial invocation without strictNullChecks encountered existing admission.ts never-array inference errors; no existing source was edited.

## Required regression failure

Command: node scripts/verify_v7_0_1_public_surface_consistency.mjs. Exit 1. Exact assertion:

    unexpected changed path outside public surface consistency scope: scripts/gate1/b09-product-compare.mjs

Location: scripts/verify_v7_0_1_public_surface_consistency.mjs:229 (assertAllowedChangedPaths). Classification: HISTORICAL_PUBLIC_TASK_SCOPE_CONTEXT_MISMATCH. The script compares Git index stat entries to the worktree and allows only its historical public-document task paths; authorized T2-01 shared test edits are outside that set. It stops before public-content checks. No protected script, index stat metadata or staged state was altered to hide this failure.

This acceptance method needs an owner decision: the unchanged historical task cannot report 21/21 on the current dirty T2-01 scope. No authority to widen its eighth-path allowlist or substitute a different acceptance method is assumed.

## Replay and classification

- Replay 1: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
- Replay 2: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
- Replay 3: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
- T2_01_RESULT_HASH: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
- Hash domain: canonical outputs, comparisons and controls from each actual complete task evaluation; excludes regression status and the later receipt envelope.
- Determinism: PASS.

- EXPECTED_GAP_CLOSED = 370
- PARTIAL_CONFORMANCE_IMPROVED = 0
- UNCHANGED_CONFORMING = 24
- UNCHANGED_EXPECTED_GAP = 24
- NEW_REGRESSION = 1

Counts concern distinct assertion slices: 370 new private diagnostic/result assertions; 24 unchanged existing T1 output slices; 24 still-missing richer native-join slices. These are not whole-case totals. The 64 supplementary controls are reported separately. NEW_REGRESSION=1 records the one newly failing mandatory command, with its scope-context classification; no product-semantic regression is inferred.

## Compatibility and authority review

No observed public contract drift: protected source hashes and serialized public controls match BEFORE. EvidencePackV1, parser/validator, reason values/order/emitters, GovernanceReport and its four dispositions, public CLI/SDK/exports, audit output/verdict/exit, deny 25, permit, classify, licensing/offline authority and v7.0.1 defaults remain unchanged. The historical public-content command remains unpassed for the stated scope reason, so full mandatory acceptance is not claimed.

Recommendation-only, additive-only, non-executing and default-off. No runtime enforcement or authority expansion. Occurrence/result do not establish independent verification, byte integrity, authenticated verifier identity, custody, approval, safety, acceptance, compliance or execution permission. The module imports only existing product modules; no reference evaluator, fixture or validation script enters product code.

T2-02 exact-byte integrity: NOT_STARTED. T2-03 independence/custody: NOT_STARTED. G03 truthful Harness integration: OPEN / NOT_STARTED. G05 remains OPEN. These intentional deferrals do not explain the mandatory regression failure.

## Owner-review status

Implementation and evidence are left uncommitted within the exact seven paths. Final decision remains T2_01_IMPLEMENTATION_FAIL until the required regression acceptance method is resolved. Preserve the frozen BEFORE and all recorded historical evidence.

## Mandatory regression acceptance closure

Final owner-review decision: **T2_01_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**. This appendix supersedes the original failed acceptance conclusion above. The original 20/21 run, exact scope failure and HISTORICAL_PUBLIC_TASK_SCOPE_CONTEXT_MISMATCH remain preserved verbatim.

Owner explicitly authorized exact-path staging, attribute-aware fidelity checks, the unchanged historical public regression, and then the exact frozen 21-command matrix. Classification: **HISTORICAL_PUBLIC_SCOPE_ACCEPTANCE_CLOSED_BY_AUTHORIZED_STAGING**. No product semantics, historical verifier or acceptance command changed.

### Seven-path staging and content fidelity

HEAD: d2cd1460684b37e3a3ca8e8e1e958d15b3357d28. Exactly seven authorized paths were staged, with no unrelated staged or unstaged path. Raw worktree hashes and effective Git attributes were recorded before staging. core.autocrlf=true; verificationEvent.ts is text=auto, and the six other files use text/eol=lf. No .gitattributes or file content was changed for staging.

For each path, git hash-object --path=<path> <path> equaled its staged blob ID. Raw worktree bytes also equaled staged blob bytes for all seven. The prospective LF-to-CRLF warning for the TS file did not alter its current bytes. STAGED_CONTENT_REPRESENTS_CURRENT_ACCEPTED_WORKTREE=YES.

These hashes identify the exact staged snapshot before adding this closure receipt and appendix. Full attributes and Git object IDs are retained in acceptance_closure.

| Path | Worktree and staged raw SHA-256 |
|---|---|
| packages/guard-core/src/mesr/repaired/verificationEvent.ts | 3c0a89acec980450b6e2d6a2aa98e250bef9fdd9dc683036ebe18bd8b3948e8e |
| scripts/verify_v8_gate1_product_conformance.mjs | 9c19dbea30a951a7cb11d8dee64461ff8ef759077dd2209bab217f69926308dc |
| scripts/gate1/b09-product-inputs.mjs | 0b4bc28756b37c0835b157ff5df11e36acb927a5a638a717fad58b083df2bd2f |
| scripts/gate1/b09-product-compare.mjs | d290e708a64660fe07908020ed0b249fcf0cff84af3b59a00163d4f473d80c2e |
| tests/fixtures/gate1/t2-01-controls.v0.1.json | 6f0fbc92fb7347c3fe814bd534fcd58740fd96794943d675519b7f5dbd52185e |
| tests/fixtures/gate1/t2-01-results.v0.1.json | e997c2d87802ff0d2153014fdee40014f3a3bf27dee5167051673b8c58519138 |
| docs/validation/v8-gate1-t2-01-evidence-v0.1.md | 4ae1bcbc3b03a44f19f3a51f93f3f2a8cc84c6d7ed69921d15e4f3367a8095b7 |

All seven files retained these hashes through the complete 21-command run. The six non-evidence task files, including the previous result receipt, remained unchanged through that run. Afterward, only the results JSON closure receipt and this appendix changed. Product/test/control definitions remained byte-identical; the accepted 370/370 annotation controls, 64/64 bridge/boundary/bypass controls and three equal replay hashes were retained without unnecessary reruns.

### Historical public verifier and final exact AFTER matrix

After authorized staging, node scripts/verify_v7_0_1_public_surface_consistency.mjs exited 0 and printed PASS: v7.0.1 public surface consistency verified. Its actual public-content assertions executed. The same unmodified command passed again in the exact matrix below. Every script hash matched frozen BEFORE.

| Exact command | Exit | Complete stdout SHA-256 |
|---|---:|---|
| node scripts/verify_mesr_registry.mjs | 0 | 27b44de12c3cc1027ed81c4e8428e6cd830e359f4eb73dd46809295807c7dc1f |
| node scripts/verify_mesr_reason_bindings.mjs | 0 | f13e72889d28248625bba98d337c232282ea8c0e8e02a311191cc0c3bfe3fac6 |
| node scripts/verify_mesr_claim_stability.mjs | 0 | 1fef93b0bfa4b995441314633581ad8f847e1121b442756100a938be43ac04d4 |
| node scripts/verify_mesr_composition.mjs | 0 | 33c6a9c12419985363611e86616ad95211eeb22019ceac861a32fca35878ff0d |
| node scripts/verify_mesr_runtime_portability.mjs | 0 | 6246178f816e5f10e4e81b3c156e4a63791c7dbdc68004ef124ed8ce2433b64e |
| node scripts/verify_mesr_cross_domain.mjs | 0 | 3e42917d3097cdd4bf29107fb5b212ecfa588d01bbe79c208aa569da4fcd5718 |
| node scripts/verify_mesr_apaai_crosswalk.mjs | 0 | 04e4c6016641f575bebc75fffa43ff16f70244cffdd80057cebbebde0922ef9d |
| node scripts/verify_v8_runtime_compatibility.mjs | 0 | 34a498b6d7c488b46053e85d8d4a57a1ab7832801764158d9375f552b76e751a |
| node scripts/verify_v8_institutional_artifact_readiness.mjs | 0 | f89984210010f4db5ce739108a2097e12cfa274d6cdc2f13987386002b1b7641 |
| node scripts/verify_evidence_assurance_kernel_poc.mjs | 0 | 4e135771af995ec5035f1c95804e2ac34aa8b94e801fac9fa352f5adb2ecd0ea |
| node scripts/verify_external_evidence_local_normalization_fixture.mjs | 0 | 699fa082797809571aa5dd440d3f8d359281a0a44adb664fc9b97e0d8bfc96ec |
| node scripts/verify_external_evidence_local_assurance_report_fixture.mjs | 0 | 93e939d24d0006b043e20980545c243107914a4dbb41512fd840c41ae942ef6a |
| node scripts/verify_external_evidence_local_assurance_composition.mjs | 0 | 82b82c12ed97f1edad3fb052553ca57fea860165e17bf023c623b78cdaf334f0 |
| node scripts/verify_governance_surface.mjs | 0 | 7c1d3bb409f69f4612e79fe28e180853827878f0b3c1befb820a732e7f40b214 |
| node scripts/verify_governance_consumption_profile.mjs | 0 | d4fe7972b1ac55432ace076b56327359f397e29d6c15440e739711f0f7b74b68 |
| node scripts/verify_audit_permit_gate.mjs | 0 | 38d6221a05780f8374657a75016e926810175d298f584e058b066864ddb83357 |
| node scripts/verify_v7_0_example_evidence_pack.mjs | 0 | 1a7fe24a57cdd5eefd694b70b3aa7ff5336948affbb4aa98f7ec56fdaaee09f3 |
| node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs | 0 | 6fb02dcce1495a16a65ccf48ccc09e02ac69c4f34f31d033e68387da63ba7dd2 |
| node scripts/verify_v7_0_1_public_surface_consistency.mjs | 0 | d88d8e12e3852a64c502aa2e0dc60c5c64d9d91da44add8f882dd1eca43b3f10 |
| node scripts/verify_v7_0_1_current_docs_baseline.mjs | 0 | 5eda00a3e7b6febb1493287ffd926237fb2ed1e795ff33668b38bed6d1a06c07 |
| node scripts/verify_v7_0_1_github_action_first_report.mjs | 0 | e1be24a7741f4f0b97ff4d17fed78690e06f7d22f7c363129a50317157b5b38d |

AFTER=21/21 PASS. No substitutions or skipped rows. All 1,422 protected fingerprints still match. The full historical T1 verifier, including branch/lineage guards and falsifiers, was verified unchanged except for the previously accepted explicit task-dispatch additions. LINEAGE_GUARD=STRICT. Historical branch-bound T1 task modes were not invoked.

### Final accepted state

- T1-01/02/03/04 semantic preservation: PASS; prior frozen comparisons retained with unchanged sources and inputs.
- Core 603 noninterference: PASS. Protected 1,422: PASS.
- Product/test semantic changes during closure: NO.
- Original failed-run evidence and machine-readable matrix: PRESERVED.
- Final NEW_REGRESSION=0. Other assertion-slice counts unchanged.
- PUBLIC_CONTRACT_DRIFT=NO. AUTHORITY_EXPANSION=NO.
- audit output/verdict/exit, deny 25, permit, classify, licensing/offline authority and v7.0.1 defaults unchanged.
- Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion.
- Replay 1 = Replay 2 = Replay 3 = T2_01_RESULT_HASH: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102.
- T2-02: NOT_STARTED. T2-03: NOT_STARTED. G03: OPEN / NOT_STARTED. G05 remains OPEN.
- Final decision: T2_01_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS.
- Final closure receipts are staged with the other authorized files; no commit, merge, tag, release or version bump.

The results root decision and acceptance_closure.final_decision identify this final decision. Existing execution_receipt, after_regressions, after_regressions_pass, counts and acceptance_limitation retain the prior failure history. acceptance_closure.final_after_regressions and final_counts contain the superseding accepted receipt.
