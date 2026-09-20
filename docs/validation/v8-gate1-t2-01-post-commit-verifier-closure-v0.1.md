# T2-01 post-commit verifier closure v0.1

Classification: VALIDATION_HELPER_FIX. No product semantic fix.

T2_01_ENTRY_COMMIT: d2cd1460684b37e3a3ca8e8e1e958d15b3357d28
T2_01_IMPLEMENTATION_COMMIT: 112d19ca84f13cc74447a41dfde5df49d9f9e49b

## Original failure

Reproduced on clean implementation HEAD with:
node scripts/verify_v8_gate1_product_conformance.mjs --task T2-01

Exit 1 at assertT201PreservationScope, line 980:
Uncommitted T2-01 must retain its accepted entry.
Actual 112d19ca84f13cc74447a41dfde5df49d9f9e49b;
expected d2cd1460684b37e3a3ca8e8e1e958d15b3357d28.
Product semantic assertions reached before repair: NO.
Root cause: the pre-commit lifecycle rule was applied after the accepted
implementation commit. POST_COMMIT_VERIFIER_LIFECYCLE_DEFECT.

## Exact scope

Accepted implementation commit seven-path scope: PASS, checked with
git show --name-only --format= 112d19ca84f13cc74447a41dfde5df49d9f9e49b.

- packages/guard-core/src/mesr/repaired/verificationEvent.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t2-01-controls.v0.1.json
- tests/fixtures/gate1/t2-01-results.v0.1.json
- docs/validation/v8-gate1-t2-01-evidence-v0.1.md

Authorized closure scope, exactly two files:

- scripts/verify_v8_gate1_product_conformance.mjs
- docs/validation/v8-gate1-t2-01-post-commit-verifier-closure-v0.1.md

## Lifecycle model

PRE_COMMIT_IMPLEMENTATION requires HEAD equal to the entry and permits only
the seven implementation paths. POST_COMMIT_ACCEPTED_IMPLEMENTATION requires
the pinned ACCEPTED_TASK_IMPLEMENTATION_COMMIT, exact parent, seven paths,
and actual ancestry. At implementation HEAD only this authorized two-path
closure may be pending. Index and worktree paths are checked separately.

One closure child is admissible with the exact parent, title
test(v8): preserve accepted T2-01 implementation lifecycle, exact two paths,
and normalized verifier/evidence content pins. Normalization replaces only
the two self-referential pin declarations. Closure HEAD requires a clean tree.
Unrelated descendants, intervening commits, and pending paths are rejected.
The planning branch name does not relax commit attribution.

All six implementation files outside the verifier are checked against the
accepted Git blobs. All 1,422 protected file fingerprints remain checked.
Historical T1 verifier assertions, T1/Core preservation function, task
semantic assertions and expectations are compared to accepted source bytes.
Post-commit fixture recording is forbidden.

## Verification method and results

The task smoke runs the actual 370 annotations and 64 bridge/boundary controls
and three replay hashes. T1/Core and final 21/21 regression receipts are reused
from the unchanged accepted results fixture, explicitly labeled inherited.
They are not reported as newly executed. Original 20/21 history and its
HISTORICAL_PUBLIC_TASK_SCOPE_CONTEXT_MISMATCH classification remain intact.

Expected task result hash:
4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102

Post-fix task smoke: PASS (exit 0); semantic assertions reached: YES.
370/370 annotations and 64/64 bridge/boundary controls passed.
Three replay hashes equal the accepted result hash above.
VERIFIER_LIFECYCLE_GUARD = STRICT; all 15 lifecycle controls passed.

| Control | Required observation | Actual |
| --- | --- | --- |
| Pre-commit valid entry | PASS | PASS |
| Accepted implementation | PASS | PASS |
| Unauthorized eighth path | FAIL/reject | Rejected |
| Wrong implementation commit | FAIL/reject | Rejected |
| Nonancestor implementation | FAIL/reject | Rejected |
| Unknown task | FAIL/reject | Rejected |
| Tampered task allowlist | FAIL/reject | Rejected |
| Unrelated intervening commit | FAIL/reject | Rejected |
| Unrelated pending path | FAIL/reject | Rejected |
| Missing accepted anchor | FAIL/reject | Rejected |
| Pre-commit unrelated path | FAIL/reject | Rejected |
| Pending product change after implementation | FAIL/reject | Rejected |
| Unattributed descendant | FAIL/reject | Rejected |
| Closure verifier content tamper | FAIL/reject | Rejected |
| Closure evidence content tamper | FAIL/reject | Rejected |

Negative controls mutate inventories or contents in memory and call the same
guard used for actual Git state. No temporary commits or fixture edits occur.

Historical public regression: PASS (exit 0).
Command: node scripts/verify_v7_0_1_public_surface_consistency.mjs
Output: PASS: v7.0.1 public surface consistency verified.
Actual public-content assertions reached: YES.
The public verifier retains its accepted source. Its existing task-scope
precondition is satisfied by staging the two authorized closure paths;
actual public-content assertions executed successfully.
Final same-commit reruns are required after the closure commit; their terminal
receipts determine acceptance and do not rewrite this pinned evidence.

## Boundaries

PRODUCT_CODE_CHANGED = NO
FIXTURES_CHANGED = NO
ACCEPTED_IMPLEMENTATION_EVIDENCE_CHANGED = NO
PUBLIC_CONTRACT_DRIFT = NO
AUTHORITY_EXPANSION = NO

Existing verification.occurred and T1-03 six-state selector remain preserved.
Audit output/verdict/exit and deny exit 25, permit/classify behavior remain
unchanged. Recommendation-only, additive-only, non-executing, default-off
boundaries remain intact. No independent verification or integrity closure
is claimed. T2-02/T2-03 NOT_STARTED; G03/G05 OPEN.

Occurrence/result != byte integrity; declared digest != recomputed digest;
recomputed digest != byte equality unless domain/basis match;
artifact reference != verified custody.
