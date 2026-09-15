# B09 repaired Experiment 3 decision

**V8_B09_REPAIRED_EXPERIMENT_3_PASS_WITH_IMPLEMENTATION_GAPS**

## Decision

The frozen oracle and reference acceptance pass. Current implementation gaps remain explicit; repaired runtime conformance is not established. **Gate 1 BLOCKED. B10 NOT STARTED.** No production implementation, merge, tag or release follows.

| Checkpoint | Value |
|---|---|
| Repository | D:/AI project/mindforge-guard |
| Branch | validation/v8-b09-repaired-experiment-3-acceptance-v0.1 |
| PHASE_B_COMMIT | 20a89e95c38d251f3812b76130b991501409a9ad |
| VERSION_BASELINE_COMMIT | d3f959593aba6fba8fd51851190e03e2bd975ad0 |
| B09 base / current HEAD | d3f959593aba6fba8fd51851190e03e2bd975ad0 |

Prerequisite commits separately preserve 11 Phase B and 6 version-baseline documents. The historical release-candidate body remains preserved; only its reviewed historical-state header was added. B09 changes none of those committed documents.

## Independent acceptance

| Surface | Decision |
|---|---|
| B02 negatives | PASS |
| B05 I01-I18 | PASS |
| B06 S01-S13 | PASS |
| B07 T01-T27 | PASS |
| B08 C01-C27 | PASS |
| E3-A | PASS for bounded synthetic inputs; actual Harness closure unavailable |
| E3-B | PASS |
| E3-C | PASS within the closed no-name-only-mapping contract |
| E3-D | PASS |
| Malformed input/admission | PASS; exceptions never count as success |
| Three-run replay/permutations | PASS |
| Specification conflicts | 0 |
| Unexpected regressions | 0 |
| B10 input gaps | 6, unimplemented |

207 cases: **207 PASS / 0 FAIL / 0 ERROR / 0 SKIPPED**. Another 603 Core noninterference probes execute through the preserved verifier. Runtime: **25 CONFORMS_TODAY / 5 PARTIAL_CONFORMANCE / 139 EXPECTED_GAP / 0 UNEXPECTED_REGRESSION / 38 NOT_APPLICABLE_TO_CURRENT_RUNTIME**. Runtime non-applicability does not skip a reference test.

## Frozen evidence

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

All three final replay hashes are 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560. Base corpus, oracle, kernel and pre-resume result bytes are unchanged. Admission hardening is separately versioned/digest-bound; no B00-B08 expectation changed. Any later semantic change requires **ORACLE_REVISION_REQUIRED** and a newly explained/reviewed version.

## Review records

- [Acceptance specification](../experiments/experiment-3-repaired-acceptance-v0.2.md)
- [Results, recovery, fixes and case observations](../validation/v8-b09-repaired-experiment-3-results-v0.1.md)
- [Six-item implementation gap ledger](19_B09_IMPLEMENTATION_GAP_LEDGER.md)
- [Final machine acceptance](../../tests/fixtures/experiment-3-repaired/acceptance-results.v0.2.json)
- [Runtime-only observations](../../tests/fixtures/experiment-3-repaired/runtime-observation-baseline.v0.2.json)
- [Replay records](../../tests/fixtures/experiment-3-repaired/replay.v0.2.json)
- [Exact-byte freeze](../../tests/fixtures/experiment-3-repaired/freeze.v0.2.json)

These uncommitted artifacts are ready for owner acceptance review. The ledger is a B09 deliverable, not an executed B10 plan or an opened gate.

## Compatibility and worktree

Audit output / verdict / exit unchanged; deny exit code 25 unchanged; permit behavior unchanged; classify behavior unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. No control-plane, dashboard or orchestration drift. CLI/JSON, licensing/offline authority, install and demo paths unchanged.

Runtime/product: **NO changes**. Evidence Contract: **NO**. Reason codes: **NO**. Governance Report: **NO**. MESR/EAK product runtime: **NO**. Harness: **NO**. Experiment 2B: **NO**. Research OS: **NO**. AGENTS.md: **NO**. Package/release versions: **NO**. B10 started: **NO**. Gate 1 opened: **NO**.

Final additions are only B09 scripts, fixtures and experiment/validation/planning documentation. Tracked and cached diffs remain empty; whitespace/scope checks pass. B09 stays **uncommitted**, with no merge/tag/release/reset/rebase/stash/clean.

V8_B09_REPAIRED_EXPERIMENT_3_PASS_WITH_IMPLEMENTATION_GAPS
