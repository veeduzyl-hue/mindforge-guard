# B09 repaired Experiment 3 results v0.1

**V8_B09_REPAIRED_EXPERIMENT_3_PASS_WITH_IMPLEMENTATION_GAPS. Gate 1 remains BLOCKED.**

Full final results: [acceptance-results.v0.2.json](../../tests/fixtures/experiment-3-repaired/acceptance-results.v0.2.json). The original [results.v0.2.json](../../tests/fixtures/experiment-3-repaired/results.v0.2.json) remains byte-identical to recovery.

## Recovery

- Repository: D:/AI project/mindforge-guard.
- Branch: validation/v8-b09-repaired-experiment-3-acceptance-v0.1.
- PHASE_B_COMMIT: 20a89e95c38d251f3812b76130b991501409a9ad.
- VERSION_BASELINE_COMMIT / B09 base / current HEAD: d3f959593aba6fba8fd51851190e03e2bd975ad0.
- Version-baseline parent is Phase B; current branch is directly at the version-baseline commit. Both ancestry checks passed.
- Tracked and staged diffs empty; only authorized B09 additions. No reset/rebase/stash/clean.
- Nine files recovered, no document drafts. [Recovery inventory](../../tests/fixtures/experiment-3-repaired/recovery-checkpoint.v0.1.json) pins original hashes.

| File | Classification | Disposition |
|---|---|---|
| scripts/b09/author-fixtures.mjs | COMPLETE_VALID | Preserve original bytes |
| scripts/b09/reference.mjs | PARTIAL_VALID | Preserve original bytes; add admission boundary |
| scripts/b09/runtime-observer.mjs | COMPLETE_VALID | Preserve original bytes |
| scripts/verify_v8_b09_repaired_experiment_3.mjs | COMPLETE_VALID | Preserve original bytes |
| tests/fixtures/experiment-3-repaired/basis.v0.2.json | COMPLETE_VALID | Preserve original bytes |
| tests/fixtures/experiment-3-repaired/cases.v0.2.json | COMPLETE_VALID | Preserve original bytes |
| tests/fixtures/experiment-3-repaired/oracle.v0.2.json | COMPLETE_VALID | Preserve original bytes |
| tests/fixtures/experiment-3-repaired/results.v0.2.json | COMPLETE_VALID | Preserve original bytes |
| tests/fixtures/experiment-3-repaired/runtime-observation-baseline.v0.2.json | PARTIAL_VALID | Enrich observed-record metadata; retain all original case hashes |

The original kernel is PARTIAL_VALID as an unrestricted entrypoint, but valid for its frozen corpus; its bytes are preserved and an admission layer completes the missing boundary. The hash-only observation file was PARTIAL_VALID against the resume reporting contract; all 172 original hashes remain with new measured observation rows. COMPLETE_VALID artifacts remain unchanged.

## A. FROZEN ORACLE

Oracle **0.2.0**, base input set **b09-repaired-e3/0.2.0**. Inputs were hashed before resumed execution; no basis/corpus/oracle bytes changed.

| Input | SHA-256 |
|---|---|
| basis.v0.2.json | 4e7942cf893946c499646ae5435fc991f7c82fe2aae78ad22892f45e98faadc3 |
| cases.v0.2.json | ea700128e400ec09aa08a360a2122be9750be8d5046d75af1eca3dfcb8339901 |
| oracle.v0.2.json | 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88 |

Canonical anchors, versions/digests, module lock, method, profile/claim set, subject/revision/scope/times, refs, states/nonclaims/gaps, composition, diagnostics and provenance are pinned. H01-H35 adds a separately authored admission oracle referencing the unchanged corpus hash. It does not rewrite B00-B08 or adapt expectations to current runtime.

**Specification conflicts: 0. ORACLE_REVISION_REQUIRED events on resume: 0.**

## B. REFERENCE EVALUATOR RESULT

| Measure | Result |
|---|---:|
| Unique cases | 207 |
| Preserved cases | 172 |
| Admission hardening cases | 35 |
| PASS | 207 |
| FAIL | 0 |
| ERROR | 0 |
| SKIPPED / reference NOT_APPLICABLE | 0 |
| Separate Core noninterference probes | 603 |

B02, B05 I01-I18, B06 S01-S13, B07 T01-T27, B08 C01-C27, and repaired E3-A/B/C/D all **PASS**. All six states execute. Producer result, independence, byte equality, custody and acceptance remain separate. Digest mismatch gives bounded UNSUPPORTED and B03 REJECTED. Missing facts never synthesize canonical events or packs.

Historical support and bytes survive current UNRESOLVED/STALE results. The original strict TIME_WINDOW_EXPIRED comparison remains unchanged. Every invalid composition returns all three empty admission arrays. The 603 probes cover all Core entries/nonclaims and null/empty/false bindings under base/additive context.

### REFERENCE_EVALUATOR_FIX inventory

| ID | Timing | Defect / bounded repair |
|---|---|---|
| RFX-01 | Before interruption | Wrong-type evidence refs could reach set sorting and throw; frozen value/type predicates and safe diagnostic provenance handling were added. |
| RFX-02 | Before interruption | Caller predicate hints could weaken true/nonempty requirements; predicate authority moved to the frozen basis. |
| RFX-03 | Before interruption | Positive atomic labels or unresolved refs could substitute for witnesses; profile/claim digests and witness resolution were checked, with five added controls. |
| RFX-04 | Before interruption | Optional output/legacy fields needed explicit serialization and producer controls needed explicit normalization; repaired only test code. |
| RFX-05 | Resume | Added a typed admission boundary and H01-H35 for malformed envelopes, events/refs, custody/separation, base64, profile/temporal data, module shapes and manifest JSON. |

All are **REFERENCE_EVALUATOR_FIX**, not product-runtime fixes. Resume preserves the kernel/expected output bytes. Invalid shapes reject before typed evaluation. A deliberate parse-validation rejection is recorded; unexpected evaluator exceptions become ERROR/nonzero exit and cannot PASS. Correctly shaped missing/false/empty obligations retain UNRESOLVED.

The original approximately 167 count became 172 before interruption through five explicit controls listed in the acceptance specification. Resume adds 35 negative admission controls, yielding 207. No failed case was removed.

### Replay

Both verifiers ran three times, including the 603 probes. Claim states, gaps, nonclaims, diagnostics, admission and serialization match.

| Run | Final result SHA-256 |
|---|---|
| 1 | 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560 |
| 2 | 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560 |
| 3 | 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560 |

Replay/determinism: **PASS**. Relevant module/lock/relation and set-valued claim/ref permutations match; event order remains contractually preserved.

| Artifact | SHA-256 |
|---|---|
| Base oracle | 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88 |
| Base fixture set | 8ab45ee11c15fa94fe990593eea505fa6e0f09bd07da69c9905d1fef332b34a2 |
| Reference kernel | 6a2991a6b3a09c4d21d95c7b966e2c953400da01a202ee6179d671ca896a0d11 |
| Admission evaluator | 28cdfb2cf7b2b9586e0809d84ec79512ab2da7e21d58fd7e47a63f87cebcdf0a |
| Admission fixture extension | d39affa5646de8b3b647840dc8f46a2fce2a12b479d905e83385877de9e8e781 |
| Preserved pre-resume result | 4d6f9317647bc2681254e5090ee8a445bab5aab478fdd33b77e13060b1624ade |
| Runtime observations | caac4bc469c5bef7cf6fe87681c42178b18248803b1f5399cbe8a579172d5be9 |
| Final result | 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560 |

## C. CURRENT RUNTIME OBSERVATION

Runtime outputs were measured separately and compared to source-pinned observations. No implementation was changed to eliminate a gap.

| Classification | Count |
|---|---:|
| CONFORMS_TODAY | 25 |
| PARTIAL_CONFORMANCE | 5 |
| EXPECTED_GAP | 139 |
| UNEXPECTED_REGRESSION | 0 |
| NOT_APPLICABLE_TO_CURRENT_RUNTIME | 38 |

Original 172-case totals remain 25 / 5 / 139 / 0 / 3. The additional 35 admission-envelope cases are outside current typed APIs. All 207 reference cases execute; runtime non-applicability does not mean a skipped reference test. Matching a legacy enum/status establishes only that bounded subset.

Direct source/output assertions include:

- N03: caller-required bindings omit registry obligations and yield legacy supports.
- N15: CB-22 remains does_not_support for the producer-only independence path; world-level missing evidence remains separately unresolved.
- I05.failed: nonempty failed external checks receive independently_verified while verification_posture is not_verified.
- S01: legacy allow coexists with repaired sufficiency UNRESOLVED.
- S10/N16.block: actual valid require_review/block report bytes are retained.
- T25: equal-time versus earlier-than legacy expiry is unchanged.
- C02/C05/C07/C09/C27: duplicate-ID, version, content and noninterference debt is localized.

Changed source or unexpected legacy output fails verification; mismatches are not indiscriminately relabeled as expected gaps. Six bounded later surfaces are recorded in the [gap ledger](../planning/19_B09_IMPLEMENTATION_GAP_LEDGER.md); B10 is not started.

## Commands and boundary

All commands below passed. Both B09 commands ran three recorded times; eight existing compatibility verifiers passed.

~~~text
node scripts/verify_v8_b09_repaired_experiment_3.mjs
node scripts/verify_v8_b09_acceptance_resume.mjs
node scripts/verify_mesr_registry.mjs
node scripts/verify_mesr_reason_bindings.mjs
node scripts/verify_mesr_claim_stability.mjs
node scripts/verify_mesr_composition.mjs
node scripts/verify_evidence_assurance_kernel_poc.mjs
node scripts/verify_v8_runtime_compatibility.mjs
node scripts/verify_audit_permit_gate.mjs
node scripts/verify_outcome_foundation_contract.mjs
~~~

Git status/diff/stat/check/name-only/untracked/cached checks and product import/export scan completed. B09 is not imported by product packages. Untracked additions are checked separately because ordinary diff omits them.

Audit output / verdict / exit unchanged; deny exit code 25 unchanged; permit behavior unchanged; classify behavior unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. No control-plane, dashboard or orchestration drift. CLI/JSON, licensing/offline authority, install and demo paths unchanged.

No product/runtime, EvidencePackV1/schema, reason-code, GovernanceReportModel, MESR/EAK, Harness, Experiment 2B, Research OS, AGENTS or package/release-version changes. B09 stays uncommitted. No merge/tag/release, B10 start or Gate 1 opening.

## Per-case index

| Case | Reference result | Execution | Current runtime | Gaps |
|---|---|---|---|---|
| N01 | verification.occurred:occurred=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| N02 | verification.independent:independence=UNRESOLVED; verification.independent:producer_inference=UNSUPPORTED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G05 |
| N03 | evidence_presence:generic=UNRESOLVED | PASS | EXPECTED_GAP | G02 |
| N04 | evidence_sufficiency:generic=UNSUPPORTED | PASS | EXPECTED_GAP | G02 |
| N05 | verification.passed:pass=CONFLICTED | PASS | EXPECTED_GAP | G02, G05 |
| N06a | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| N06b | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| N07 | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| N08 | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| N09 | verification.passed:pass=UNRESOLVED | PASS | PARTIAL_CONFORMANCE | G05 |
| N10 | claim_identity:generic=UNRESOLVED | PASS | EXPECTED_GAP | G02 |
| N11.subject | verification.passed:pass=SUPPORTED | PASS | PARTIAL_CONFORMANCE | G05 |
| N11.time | verification.passed:pass=SUPPORTED | PASS | PARTIAL_CONFORMANCE | G05 |
| N12.complete | verification.passed:pass=INCONCLUSIVE | PASS | EXPECTED_GAP | G02, G05 |
| N12.missing | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| N13 | evidence.present:presence=SUPPORTED; evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| N14 | acceptance.decision_occurred:decision=SUPPORTED; institutional.acceptance:acceptance=UNRESOLVED | PASS | EXPECTED_GAP | G07 |
| N15 | verification.independent:independence=UNRESOLVED; verification.independent:producer_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G05 |
| N17.failed | artifact.byte_equality:integrity=UNRESOLVED; verification.independent:independence=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| N17.skipped | artifact.byte_equality:integrity=UNRESOLVED; verification.independent:independence=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| N16.allow | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| N16.block | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| N18 | verification.independent:independence=SUPPORTED; verification.independent:observation_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I01 | verification.independent:independence=UNSUPPORTED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I02 | verification.independent:independence=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| I03 | verification.independent:independence=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| I04 | verification.independent:independence=UNRESOLVED; verification.independent:producer_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G05 |
| I05.failed | verification.independent:independence=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I05.skipped | verification.independent:independence=UNRESOLVED; verification.occurred:occurred=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I06 | artifact.byte_equality:integrity=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| I07 | artifact.byte_equality:integrity=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| I08 | artifact.byte_equality:integrity=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I09 | artifact.byte_equality:integrity=SUPPORTED; custody.independent:custody=UNSUPPORTED; verification.independent:independence=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I10 | artifact.byte_equality:integrity=SUPPORTED; institutional.acceptance:acceptance=UNRESOLVED; verification.independent:independence=SUPPORTED | PASS | EXPECTED_GAP | G02, G05, G07 |
| I11 | verification.independent:independence=UNSUPPORTED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| I12.subject | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I12.scope | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I12.time | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I13 | verification.passed:pass=CONFLICTED | PASS | EXPECTED_GAP | G02, G05 |
| I14.complete | verification.passed:pass=INCONCLUSIVE | PASS | EXPECTED_GAP | G02, G05 |
| I14.missing | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I15 | artifact.byte_equality:integrity=UNRESOLVED | PASS | EXPECTED_GAP | G05 |
| I16 | action.succeeded:action=SUPPORTED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05, G03 |
| I17 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| I18 | verification.independent:independence=SUPPORTED; verification.independent:observation_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G05 |
| S01 | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.profile_id | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.claim_set_id | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.scope | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.evaluation_time | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.evidence_refs | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S02.material_gap_result | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S03.registry | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S03.method | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S03.module_lock | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S04 | evidence.sufficient:sufficiency=SUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S05 | evidence.sufficient:sufficiency=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S06 | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S07.omit | evidence.sufficient:sufficiency=UNRESOLVED; evidence.sufficient:weakening_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S07.false | evidence.sufficient:sufficiency=UNRESOLVED; evidence.sufficient:weakening_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S07.empty | evidence.sufficient:sufficiency=UNRESOLVED; evidence.sufficient:weakening_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S08.conflict | evidence.sufficient:sufficiency=CONFLICTED | PASS | EXPECTED_GAP | G02, G06 |
| S08.stale | evidence.sufficient:sufficiency=STALE | PASS | EXPECTED_GAP | G06 |
| S09 | evidence.sufficient:sufficiency=INCONCLUSIVE | PASS | EXPECTED_GAP | G06 |
| S10 | evidence.sufficient:sufficiency=SUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S11.mismatch | evidence.sufficient:sufficiency=SUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S11.absent | evidence.sufficient:sufficiency=SUPPORTED | PASS | EXPECTED_GAP | G02, G06 |
| S12 | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S13 | evidence.sufficient:sufficiency=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05, G06, G03 |
| T01 | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T02.at | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T02.before | standing.current:current=SUPPORTED | PASS | EXPECTED_GAP | G07 |
| T03 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T04 | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T05 | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T06 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T07 | standing.current:current=SUPPORTED | PASS | EXPECTED_GAP | G07 |
| T08 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T09.subject | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T09.scope | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T10 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T11 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T12.policy | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T12.dependency | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T13.policy | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T13.dependency | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T14 | authority.current:authority=UNRESOLVED; authority.current:old_authority_inference=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G07 |
| T15 | authority.current:authority=SUPPORTED; institutional.acceptance:acceptance=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T16 | acceptance.decision_occurred:decision=SUPPORTED; institutional.acceptance:acceptance=UNRESOLVED | PASS | EXPECTED_GAP | G07 |
| T17 | standing.current:current=SUPPORTED | PASS | EXPECTED_GAP | G07 |
| T18.evaluation_time | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T18.reliance_time | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T19 | standing.current:current=CONFLICTED | PASS | EXPECTED_GAP | G02, G07 |
| T20 | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T21.complete | standing.current:current=INCONCLUSIVE | PASS | EXPECTED_GAP | G02, G07 |
| T21.missing | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T22.rule | standing.current:current=STALE | PASS | EXPECTED_GAP | G02, G07 |
| T22.absent | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T23 | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T24.timezone | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T24.interval | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T25.equal | standing.current:current=SUPPORTED | PASS | EXPECTED_GAP | G07 |
| T25.earlier | standing.current:current=SUPPORTED | PASS | EXPECTED_GAP | G07 |
| T26.complete | standing.current:current=UNSUPPORTED | PASS | EXPECTED_GAP | G02, G07 |
| T26.missing | standing.current:current=UNRESOLVED | PASS | EXPECTED_GAP | G02, G07 |
| T27 | authority.current:authority=UNRESOLVED | PASS | EXPECTED_GAP | G07, G03 |
| E3-A.ci | verification.independent:independence=UNRESOLVED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G05 |
| E3-A.ci.execution_only | action.succeeded:action=SUPPORTED; verification.independent:independence=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05, G03 |
| E3-A.harness_style | verification.independent:independence=UNRESOLVED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G05 |
| E3-A.harness_style.execution_only | action.succeeded:action=SUPPORTED; verification.independent:independence=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05, G03 |
| E3-B.absent | verification.independent:independence=UNRESOLVED; verification.occurred:occurred=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| E3-B.producer | verification.independent:independence=UNRESOLVED; verification.independent:producer_inference=UNSUPPORTED; verification.passed:pass=SUPPORTED | PASS | EXPECTED_GAP | G05 |
| E3-C.Runtime_ALLOW | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.Guard_allow | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.external_ALLOW | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.VERIFIED | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.APPROVED | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.SAFE | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.ACCEPTED | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.COMPLIANT | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.IDENTITY | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.AUTHORITY | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.TESTS_PASSED | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.ACCEPTANCE | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.HISTORICAL_VALID | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| E3-C.CURRENT_STANDING | world.fact:collision=UNRESOLVED | PASS | CONFORMS_TODAY | ? |
| C01 | VALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C02 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C03.within | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C04 | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C05 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C06.literal | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C06.registry | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C07 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C08.override | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C08.collision | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C09 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C10 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C11 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C12 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C13 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C14 | INVALID_COMPOSITION | PASS | PARTIAL_CONFORMANCE | G08 |
| C15.source | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C15.profile | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C16.crosswalk | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C16.profile | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C17.target | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C17.provenance | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C18 | INVALID_COMPOSITION | PASS | CONFORMS_TODAY | ? |
| C19 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C20.producer | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | G08 |
| C20.consumer | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | G08 |
| C20.malformed | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | G08 |
| C21.>=0.1.0 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C21.latest | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C21.0.1.0-rc.1 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C21.01.1.0 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C22.array | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C22.raw | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C23 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C24 | VALID_COMPOSITION | PASS | PARTIAL_CONFORMANCE | G08 |
| C25 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C26.supersedes | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C26.refines | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C26.stronger_than | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C26.weaker_than | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| C27 | INVALID_COMPOSITION | PASS | EXPECTED_GAP | G08 |
| S04.label_only | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| S04.bad_profile_digest | evidence.sufficient:sufficiency=UNRESOLVED | PASS | EXPECTED_GAP | G06 |
| N08.predicate_override | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| I10.unresolved_ref | verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05 |
| E3-A.actual_harness_gaps | action.succeeded:action=SUPPORTED; verification.independent:independence=UNRESOLVED; verification.passed:pass=UNRESOLVED | PASS | EXPECTED_GAP | G02, G05, G03 |
| H01 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H02 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H03 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H04 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H05 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H06 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H07 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H08 | evidence.sufficient:sufficiency=UNRESOLVED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H09 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H10 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H11 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H12 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H13 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H14 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H15 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H16 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H17 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H18 | evidence.sufficient:sufficiency=UNRESOLVED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H19 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H20 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H21 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H22 | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H23 | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H24 | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H25 | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H26 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H27 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H28 | verification.passed:pass=UNRESOLVED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H29 | verification.passed:pass=UNRESOLVED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H30 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H31 | INVALID_COMPOSITION | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H32 | verification.passed:pass=UNRESOLVED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H33 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H34 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
| H35 | REJECTED | PASS | NOT_APPLICABLE_TO_CURRENT_RUNTIME | ? |
