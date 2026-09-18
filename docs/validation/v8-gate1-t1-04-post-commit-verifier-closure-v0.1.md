# T1-04 post-commit verifier closure v0.1

Status: four post-fix task smokes PASS on the same pre-closure working HEAD. VALIDATION_HELPER_FIX; not PRODUCT_SEMANTIC_FIX.

T1_04_COMMIT = 14ffe82625313f75076d8dcc39950770523c128e.

Original assertion: Unaccepted intervening commit count (original verifier line 486). Historical lineage validation stopped before product semantic assertions. PRODUCT_REGRESSION = NO.

The pending-task guard admitted only five registered historical entries plus the final T1-03 closure, pinned HEAD to ef3e5b7fbcd8854d99a680bf532816b50cc851cd, and used the seven T1-04 paths as pending scope. After preservation, the seventh historical commit was not attributed to T1-04. The repair registers both the already accepted final T1-03 closure and the accepted T1-04 implementation with exact hashes, parents and unchanged allowlists. Latest accepted ownership supplies current shared-tool blobs; historical blobs remain pinned in their original commits.

Exact authorized repair scope:

- scripts/verify_v8_gate1_product_conformance.mjs
- docs/validation/v8-gate1-t1-04-post-commit-verifier-closure-v0.1.md

Accepted T1-04 seven-path scope was checked using git show --name-only --format= 14ffe82625313f75076d8dcc39950770523c128e and matches the accepted evidence's Exact seven-path allowlist section. No eighth path.

Only one follow-up closure is admissible: direct child of T1_04_COMMIT, subject test(v8): register accepted T1-04 lineage, exact two paths above and pinned verifier/evidence content. Its actual Git commit hash is resolved from the checked history and printed as closure_commit. Only the two new digest declarations are normalized, following the previous closure's self-reference policy. Further or unrelated descendants reject.


## Observed verification

T1-04 is an ACCEPTED_TASK_IMPLEMENTATION_COMMIT; all prior entries and exact allowlists remain preserved. On 2026-09-19 (Node v24.15.0), all four commands node scripts/verify_v8_gate1_product_conformance.mjs --task <task> exited 0 on working HEAD 14ffe82625313f75076d8dcc39950770523c128e with this pending two-file closure. Product semantic assertions executed.

| Task | Result | Cases | Replay hash |
|---|---|---|---|
| T1-04 | PASS | 41 | 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554 |
| T1-01 | PASS | 50 | ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648 |
| T1-02 | PASS | 13 | 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872 |
| T1-03 | PASS | 38 | 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf |

PRODUCT_COMPOSITION_SEMANTIC_HASH = 54f1ca57cfcd5fd65e06dbe92bd6b1fc58ee65a09db17323c189a96e122ba166.
T1_04_RESULT_HASH = 42bfa5098db56a574e76209f83b630745f90c881785947e6d90eef9e30c6d554.
Both match the committed acceptance. The accepted validation envelope is unchanged: ff5d09b28521a18bb95db0f0110ac818b9ca0a21bdf6ca8669a00cb70c2917ab (not a hash of this later run). T1-01's summary result_hash includes validation metadata; its product replay domain is preserved above.

LINEAGE_GUARD = STRICT; 59/59 lineage controls PASS for each task. Accepted T1-04 history passes. The same validator rejects: unauthorized eighth T1-04 path; unknown task/task commit; missing/nonancestor anchors; unrelated intervening commit; unauthorized closure parent/subject/paths/content/pins; tampered/dropped allowlists; unrelated pending path. Frozen T1-04 product/fixtures/evidence also reject as pending edits. Each task retains strict frozen B09 worktree/Git checks.

The prescribed T1-04 smoke internally executes three full replays (41 C, 5 H, 39 controls, 603 probes, 94 permutations). Those assertions were retained. No extra standalone suite, 17-command regression matrix, B09 runner or --record invocation occurred. T1-02's 20 controls and T1-03's 56 controls passed. NEW_REGRESSION = 0 throughout.

## Exact closure-commit gate

These are observed pre-commit results, not a predicted post-commit PASS. After committing exactly these two files, rerun all four commands on the exact resulting closure commit. Require all four PASS on the same closure HEAD and STRICT before creating validation/v8-gate1-tranche1-formal-closure-v0.1. Guard output records head and resolved closure_commit. The exact commit hash and final outcomes are recorded in the execution completion report; they cannot be embedded in their own immutable commit. Do not amend the accepted implementation or this closure to accommodate a failure.

## Preserved boundaries

PRODUCT_CODE_CHANGED = NO. FIXTURES_CHANGED = NO. ACCEPTED_T1_04_EVIDENCE_CHANGED = NO. PUBLIC_CONTRACT_CHANGED = NO. AUTHORITY_CHANGED = NO.

Audit output/verdict/exit and deny 25 unchanged; permit and classify unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. No runtime/public caller/SDK/licensing/release/version change. Classification: VALIDATION_HELPER_FIX, not PRODUCT_SEMANTIC_FIX.

Formal review started = NO. Tranche 2 started = NO. G03 started = NO. Stop after creating the formal-closure branch.
