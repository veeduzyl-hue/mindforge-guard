# T1-03 post-commit verifier closure v0.1

Classification: VALIDATION_HELPER_FIX, not PRODUCT_SEMANTIC_FIX.
Root cause: POST_COMMIT_SCOPE_LINEAGE_DEFECT. Pre-commit product smokes and all 27 final guard controls PASS. Post-commit confirmation is recorded in the owner handoff.

## Recovery checkpoint and authorized scope

Repository: D:/AI project/mindforge-guard.
Starting branch: feat/v8-gate1-tranche1-t1-03-v0.1.
T1_03_COMMIT / pre-change HEAD / rollback point: ff263558cf45d4ad3d42b98e1f983b9f89b1a883.
The starting tree and index were clean. Required accepted ancestry, oldest first:

- T1-01: 7726fc7f58305e59ea7359d9658494b7695bfa4d
- T1-02: c5a66b50cefc39002dea190af078a49a7c47e3d4
- T1-02 verifier closure: 2b0e9facb48795533ad96545e318c54ce535515b
- T1-03: ff263558cf45d4ad3d42b98e1f983b9f89b1a883

Exact repair allowlist (no product semantic file authorized):

- scripts/verify_v8_gate1_product_conformance.mjs
- docs/validation/v8-gate1-t1-03-post-commit-verifier-closure-v0.1.md

No reset, rebase, amend, stash, clean, revert or historical rewrite. T1-03 remains its original eight-path commit. Its allowlist is extracted from the committed evidence section, matched against the exact verifier inventory and its committed diff. T1-01 and T1-02 evidence inventories are checked the same way; T1-02 closure has its own exact two-file list.

## Reproduced failure before repair

Each established command below exited 1:

| Command | Stage | Product semantic assertions reached |
|---|---|---|
| node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01 | ENTRY_SCOPE / assertTaskScope.validate | NO |
| node scripts/verify_v8_gate1_product_conformance.mjs --task T1-02 | ENTRY_SCOPE / assertTaskScope.validate | NO |
| node scripts/verify_v8_gate1_product_conformance.mjs --task T1-03 | ENTRY_SCOPE / assertTaskScope.validate | NO |

All three stopped at the original line 440, invoked through lines 450 and 27:

AssertionError: Outside verifier closure history: docs/validation/v8-gate1-t1-03-evidence-v0.1.md

This first offending path was authorized T1-03 content, not an unrelated historical edit. No product regression was established. The old rule flattened every changed path in the range T1-02..HEAD and required each to belong to the T1-02 two-file closure list. It did not attribute the later accepted T1-03 commit to its own task.

## Corrected lineage model

The verifier reads every commit since the accepted pre-T1-01 baseline dbdb14ed9cf2f1b7e293f44bf9df1007f8ae15fc, including intermediate changes that a later commit reverts. It requires the four accepted commits above, in exact order with their exact single parents and complete own path sets. It checks all required task/closure anchors with Git object existence and ancestry checks. Evidence-derived task lists must equal the fixed authorized lists. No directory wildcard or ancestry-only exemption exists.

TASK_OWNED_COMMITTED_PATH is attributed to its pinned task commit. AUTHORIZED_INTERVENING_INFRASTRUCTURE_PATH is attributed to the pinned T1-02 closure, or the single content-pinned T1-03 closure described next. Every other intervening commit/path fails. Pending tracked, staged and untracked paths are checked separately against only this recovery's two-file list; even formerly authorized T1-03 product/fixture/evidence paths are now forbidden pending changes.

The new closure's Git ID cannot be embedded in its own committed verifier without a circular hash. Its admission is therefore bound to one direct child of the exact T1-03 commit, exact subject test(v8): preserve task-attributed Gate1 lineage validation, the exact two changed paths, and pinned verifier/evidence bytes. No second descendant, empty extra commit, merge or arbitrary same-path rewrite is accepted. The completed Git ID is recorded in the owner handoff, not invented here.

The verifier content SHA-256 normalizes only the two literal closure digest declarations to the literal <PIN>; all other UTF-8 source bytes are hashed unchanged. Both literal values are independently checked against the active constants. Evidence uses exact raw UTF-8 bytes. This is validation-helper content admission, not a product semantic or authority mechanism.

Normalized verifier SHA-256: 454fe8856bd25a71d1e51299d72245ca648669949539ed3a4258a58b008e0f25.
Original verifier raw SHA-256: d9d524c36f6c55c9359a8e681523bd287e4cc4caa815f3b924a7a481c564bf6c.
The evidence intentionally contains no self-hash; its exact raw hash is pinned in the verifier. No historical digest was rewritten.

## Guard controls and executed product smokes

The initial repaired guard passed 22 controls on each smoke: accepted lineage; authorized T1-03 evidence/product/fixture paths; unknown task; missing task anchor; nonexistent Git anchor; nonancestor anchor; extra historical path in each of four accepted commits; unrelated intervening commit; unaccepted descendant; extra empty descendant; five forbidden pending paths (including old T1-03 product/fixture/evidence); enlarged and truncated accepted task allowlists.

Negative controls mutate actual Git-derived inventories and call the same guard used at entry; they assert the specific failure category. Nonancestor/existence controls use real Git checks. They do not rewrite fixtures, fabricate product PASS results, or create temporary Git history. Additional exact-content and four content/pin-tamper controls are required by the final guard and run with the final content pins.

Initial post-fix commands (no --record or --before flags):

| Task | Exit | Task slices | Supplemental product controls | Product replay SHA-256 (three identical replays) |
|---|---:|---:|---:|---|
| T1-01 | 0 | 50/50 | 33/33 | ee0099cad7efc4f01b2c9c70c00c302e2377efc712fd2e5f46afe114b989e648 |
| T1-02 | 0 | 13/13 | 20/20 | 3ce6366c8760383e4fa2690811a71e8a26612cd76a1d8a172bb658a5d6a93872 |
| T1-03 | 0 | 38/38 | 56/56 | 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf |

T1_03_RESULT_HASH = 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf.
T1-03 EXPECTED_GAP_CLOSED=35; PARTIAL_CONFORMANCE_IMPROVED=3; UNCHANGED_CONFORMING=0; UNCHANGED_EXPECTED_GAP=0; NEW_REGRESSION=0.
T1-01 whole-run metadata digest can change with verifier provenance/HEAD; its product replay digest remains unchanged. No accepted result file is regenerated.

## Compatibility, authority and byte continuity

The verifier pins every accepted task/closure artifact except the shared verifier to its exact T1-03 raw blob, at both current HEAD and worktree. That includes both shared adapters, all six repaired product modules, all T1-01/02/03 fixtures and accepted evidence. Smoke entry also checks all 19 frozen B09 worktree and Git blob pins. Original verifier text outside assertTaskScope is byte-identical, verified by exact prefix/suffix comparison; task semantic assertions, expectations, case selection and result hashing remain untouched.

PRODUCT_CODE_CHANGED=NO; T1_03_PRODUCT_REGRESSION=NO; fixtures changed=NO; accepted T1-03 evidence changed=NO; B09_FROZEN_EVIDENCE_CHANGED=NO; PUBLIC_CONTRACT_DRIFT=NO; AUTHORITY_EXPANSION=NO; REFERENCE_EVALUATOR_IMPORTED_INTO_PRODUCT=NO.

EvidencePackV1 1.0.0/parser/validator, 56 reason-code values/order/emitters, GovernanceReportModel 1.0.0/four verdicts/renderers/index, public CLI/SDK/package exports, audit output/verdict/exit, deny 25, permit/classify, licensing/offline authority and v7.0.1 defaults retain unchanged source. Product smokes compare legacy report/parser/validator/reason controls. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion or control-plane drift.

B09 full acceptance NOT_RERUN: this is a test-helper-only change outside the frozen evaluation path. Frozen files remain byte-identical. Historical T1-03 19/19 AFTER regressions remain accepted historical evidence, not newly executed by this closure.

## Handoff boundary

This document records recovery and pre-commit checks; the separate closure commit ID and final post-commit smoke results must be recorded in the owner handoff after they exist. Commit only these two paths with the authorized subject. Then run all three smokes on that actual commit before creating the T1-04 branch. A failure prevents T1-04 preparation.

T1-04 implementation NOT STARTED. G08 composition remains pending. Tranche 2 G05/G07/G06 and G03 integration NOT STARTED. No Tranche-1 formal closure, V8 release readiness, merge, tag, release or version bump is claimed. Rollback means separately reviewed withdrawal of only this verifier closure with evidence preserved; none is performed.

Representation: new evidence UTF-8 without BOM, LF, final newline. The verifier preserves original surrounding bytes and uses LF for its replaced guard. Product and frozen artifact byte domains are unchanged.

## Final pre-commit closure checks

On 2026-09-17 all three established commands were rerun after adding the five pinned-content controls. Each exited 0, with 27/27 guard controls PASS and the same product counts/replay hashes as the table above. VERIFIER_LINEAGE_GUARD=STRICT. No --record/--before flag was used; no accepted fixture changed. The final evidence append updates only its own pinned digest; normalized verifier content is unchanged.

CLI unknown-task control: node scripts/verify_v8_gate1_product_conformance.mjs --task UNKNOWN_TASK exited 1 at task admission before product evaluation, as required.

## Additional post-commit scope defect and same-scope follow-up

Initial closure commit: 12d5529b608b13c2c518005721d60d558c9804ea, preserved without amendment. On this commit all 27 entry controls PASS; T1-02 and T1-03 exit 0 with unchanged product hashes. T1-01 exits 1 at line 222 in public-source-and-import-isolation: Protected baseline files changed: docs/validation/v8-gate1-t1-03-post-commit-verifier-closure-v0.1.md. Unlike the original entry failure, earlier T1-01 product assertions were reached and passed before this second validation scope assertion failed. No product semantic assertion failed.

The T1-01 secondary net-diff allowlist also needed the exact authorized closure evidence path. Before this document became tracked, that secondary git diff did not see it; the staged pre-commit T1-03 check did not exercise the T1-01-only control. This is an additional POST_COMMIT_SCOPE_LINEAGE_DEFECT. The failing command and first closure commit remain historical evidence.

The follow-up changes only the same two authorized paths. It adds the one exact evidence path to T1-01's secondary public-source scope list, with no directory exemption or changed product expectation. The entry guard separately enforces its commit/content attribution. The first closure is now a fixed accepted commit with its own two-path list. The only next admissible commit is one exact-content-pinned direct child of that fixed initial closure, with the same authorized commit subject and two-path scope. More descendants, merges, unrelated paths and content changes still fail. The new commit ID will be reported after creation.

Current normalized verifier SHA-256: 85862308a501af5e867548f3704a6b68669fb0e879bda99d37d5cb308b369c13. Earlier normalized hash and direct-child-of-T1-03 description above describe the preserved initial closure. Its bytes remain available at that exact commit; they are not rewritten. The newly authorized evidence append is intentionally outside the immutable T1-01/02/03 semantic artifacts, which remain pinned to T1-03.

Final follow-up requires 28 guard controls (the extra historical-path falsifier covers the pinned initial closure) and all three product smokes before and after its own commit. T1-04 remains blocked until those actual commands pass.

Follow-up pre-commit execution: all three established smoke commands exited 0 after the second scope repair; 28/28 entry controls PASS in each. T1-01 50/50 + 33/33, T1-02 13/13 + 20/20, T1-03 38/38 + 56/56 PASS. All three task product replay hashes remain identical to the original table, including T1_03_RESULT_HASH 90c5d486390952f194544f0114d786891d5ff6ba616d341a5a6f647d7f1898bf. Product assertions and all accepted fixtures remain unchanged. Final post-commit results remain an owner-handoff record.

## Second recovery: complete the shared historical attribution model

Recovered HEAD and T1_03_VERIFIER_CLOSURE_COMMIT_1 from Git: 12d5529b608b13c2c518005721d60d558c9804ea. Exactly the two closure paths were staged; no unstaged or untracked changes. Both existing commits remain unchanged. The earlier follow-up commit command was quota-rejected before execution.

Classification of defect 2: SECONDARY_POST_COMMIT_SCOPE_ATTRIBUTION_DEFECT, not PRODUCT_REGRESSION. The original committed public-source-and-import-isolation callback was replayed in memory against actual Git/filesystem data and reproduced the exact rejected closure-evidence path. No source/fixture was reverted and no reproduction file was written. This targeted callback replay did not run product assertions; the earlier full smoke on closure commit 1 did reach passing product assertions before failing at this secondary scope check. The recovered full T1-01 smoke also exited 0 with its staged intermediate fix and unchanged three product hashes. These are distinct observations, not a claim that the repaired tree still fails.

A complete search of HEAD/head/pre_change_head, owned/allowlist, Git diff/log/show/rev-list/merge-base and closure references found two scope owners: assertTaskScope and the duplicate owned array in public-source-and-import-isolation. The duplicate global list is removed. assertTaskScope now returns a frozen path inventory derived only AFTER every historical commit is validated against its own exact list and every pending path is validated against the current closure list. The secondary net-diff check consumes that validated inventory, retaining its baseline protection and product import isolation checks without independently guessing which future accepted task/closure path is allowed. No third historical allowlist remains.

Other historical checks are intentionally retained: three BEFORE-capture merge-base ancestry assertions (T1-01/02/03), fixed accepted-anchor and per-parent validation, frozen B09 worktree/HEAD blob hashes, immutable task-artifact raw-byte comparisons, and provenance HEAD fields in results. None requires current HEAD to equal an old task HEAD or applies a current-task-only list to all historical commits. New tasks/closures still require explicit bounded entry in the one attribution model; arbitrary descendants are not accepted.

The five fixed accepted commits retain exact commit hash, task/closure identity, exact allowlist and single-parent ancestry. The second closure remains limited to one direct child of closure commit 1, two exact paths and pinned verifier/evidence content. Its authorized subject is now test(v8): complete task-attributed Gate1 history validation, as specified by the latest recovery instruction. Earlier same-subject plans above are historical checkpoints.

Four added falsifiers reject T1-03 historical evidence falsely assigned to T1-02, that evidence falsely assigned to the T1-02 closure, an extra unauthorized file on the second closure, and an unaccepted commit with otherwise identical allowed paths. Total final guard controls: 32. The required task/closure/pending/intervening classes remain separate.

Current final normalized verifier SHA-256: 290e69204d2404767fcbde923acad03bc5208763e3486791687928443adf8f43. Only the same two repair paths changed; no product module, fixture, accepted implementation evidence, ADR or B09 artifact changed. T1-04 remains unstarted pending all three same-HEAD final smokes.

Final model pre-commit verification: all three commands node scripts/verify_v8_gate1_product_conformance.mjs --task T1-01 / T1-02 / T1-03 exited 0 on the same HEAD 12d5529b608b13c2c518005721d60d558c9804ea after the shared-inventory change. Each reported STRICT and 32/32 guard controls PASS; each confirmed HEAD unchanged during execution. Product results remain T1-01 50/50 + 33/33, T1-02 13/13 + 20/20, T1-03 38/38 + 56/56, with all three replay hashes unchanged. NEW_REGRESSION=0. No fixture recording flags were used. Final same-HEAD post-commit execution will be reported after commit 2 exists.
