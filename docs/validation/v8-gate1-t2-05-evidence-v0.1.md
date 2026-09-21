# T2-05 Continuity and Current-Authority Rebinding Evidence v0.1

Date: 2026-09-21. Internal V8 evidence-assurance work; released commercial baseline remains v7.0.1.

Acceptance status: **T2_05_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**. T2-05 CLOSED / EVIDENCE CLOSED; G07 CLOSED. G06 and G03 remain OPEN / NOT STARTED.

## Checkpoint and scope

Starting HEAD / implementation entry / pre-change HEAD: `337c89220ec35a93ce44a878b931657124331288`.
Starting branch: `planning/v8-gate1-tranche2-t2-05-v0.1`; starting worktree CLEAN.
Implementation branch: `feat/v8-gate1-tranche2-t2-05-continuity-rebinding-v0.1`.

Exactly eight authorized paths:

- packages/guard-core/src/mesr/repaired/continuity.ts
- packages/guard-core/src/mesr/repaired/evaluateClaim.ts
- scripts/verify_v8_gate1_product_conformance.mjs
- scripts/gate1/b09-product-inputs.mjs
- scripts/gate1/b09-product-compare.mjs
- tests/fixtures/gate1/t2-05-controls.v0.1.json
- tests/fixtures/gate1/t2-05-results.v0.1.json
- docs/validation/v8-gate1-t2-05-evidence-v0.1.md

Authority: accepted implementation-entry v0.2, its bounded scope decision, ADR 0011 and ADR 0015. Earlier planning, implementation and external-review evidence remains immutable. No G06 or G03 implementation.

## BEFORE evidence and commands

The controls artifact's `before` object retains actual T1-01/02/03/04 and 603 Core fingerprints; 132 historical claim/hardening inputs and full outputs, including 37 T-family cases, N14, I17 and H33; four accepted T2 hashes; public report/render/index serialized bytes; parser/validator rejections; reason values/order; legacy T25; 23 regression receipts; and exact SHA-256 hashes of the entry's tracked source/artifact inventory.

1. `git status --short`; `git branch --show-current`; `git rev-parse HEAD`: exit 0, required HEAD, CLEAN.
2. `git switch -c feat/v8-gate1-tranche2-t2-05-continuity-rebinding-v0.1`: exit 0; branch and HEAD confirmed before edits.
3. `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-05 --before`: exit 1 only at the unchanged public-surface index/stat guard. Product fingerprints and four T2 hashes passed; 22/23 regression commands passed.
4. `git add -- scripts/gate1/b09-product-inputs.mjs scripts/gate1/b09-product-compare.mjs tests/fixtures/gate1/t2-05-controls.v0.1.json`: exit 0. Then `node scripts/verify_v7_0_1_public_surface_consistency.mjs`: exit 0. Its unchanged index guard requires working stats to match the index. This completed 23/23 BEFORE receipts before any product edit; the failed receipt remains in `before.initial_regression_attempts`.

Windows sandbox initialization failed before the first read; reviewed shell execution succeeded. No product behavior was changed to accommodate the environment.

Byte domains: source/control/protected-file and stdout hashes cover exact filesystem/UTF-8 bytes; semantic hashes use the existing canonical JSON digest; serialized replay hashes cover exact JSON.stringify UTF-8 bytes. No process identity, memory address or wall clock enters output. Recomputing private handles does not execute a new real-world check.

## Dimensions and retained joins

`continuity.ts` evaluates retained JSON in the existing evidence ledger using `retained-context-continuity/0.1` and private dossier `t2-05-retained-witnesses/0.1`. Each applicable dimension retains criterion/version, attribution, exact old/current witnesses, evidence digests, subject/revision/scope and time binding, limitations, missing/negative/conflicting facts and complete undecidability.

- Subject/revision: exact artifact identity/revision, or attributable bounded-equivalence proof. Same bytes/label does not replace identity or a changed-revision proof. Links point forward; predecessor identity remains exact.
- Scope: retained resource/action bounds or explicit compatible projection. Expanded scope with material-loss evidence is distinct from missing comparison. Names and substrings carry no compatibility rule.
- Environment: retained snapshots/digests and named materiality evidence. Changed settings may remain compatible; no comparison means unresolved.
- Policy: identities, versions, content/digests, explicit effective intervals and compatibility evidence. Version change alone implies neither continuity nor loss.
- Dependency: identities, versions, artifact digests, retained locks and impact evidence. Version/name equality alone is insufficient.
- Authority: principal, source, action, target, purpose, scope, interval, predecessor relationship and target-bound criterion. These are facts ABOUT authority. Guard issues, extends, delegates, approves, certifies and executes no authority.
- Revalidation: distinct attributable T2-01 event/result; explicit method/criterion/version/time and forward link; separately authenticated T2-04 basis with its own original T2-02 receipts and T2-03 finding. A successful new check cannot renew an expired predecessor, rewrite timestamps or inherit an old private custody finding.
- Review reuse: original review event/result and criterion; subject/scope/context continuity; time; currently applicable reviewer authority. Review occurrence and authority evidence create no institutional acceptance event. Authority diagnostics remain part of requests that require it for reuse.

Historical assessments are evaluated separately from missing CURRENT witnesses. Proved expiry remains STALE with a missing dependency snapshot retained as a diagnostic. STALE requires the requested facet's preserved historical support plus proved material loss. Never-valid loss is bounded non-support. Missing method inputs remain UNRESOLVED; complete undecidability is INCONCLUSIVE. No universal materiality policy is inferred.

## Private finding and canonical owner

A module-private WeakMap registers only product-created, deeply frozen findings. Full input/core/trust/requirement contexts/collected obligations bind each finding. Plain, copied, serialized/reconstructed, mutated and wrong-context handles are inert. Caller booleans and StateBasis objects cannot manufacture identity. Authentication establishes product computation over supplied evidence, not real-world truth or authority.

Each historical/current/revalidation T2-04 handle is read through its unchanged reader using its original input, contexts, collection and standing path. Both explicit reference times must match. An old envelope is never renamed to authority or another revision. A directly supplied T2-04 argument must agree with the authenticated original current-envelope join.

`evaluateClaims` adds only an eighth trailing optional input and a valid-finding branch for standing.current / authority.current on the accepted temporal anchor. The unchanged private selector remains the sole state owner. Collected Core/caller/context obligations remain intact, including names colliding with branch placeholders. Only valid T2-05 findings isolate legacy boolean-loss shortcuts. No-finding and invalid-finding behavior stays exact.

Standing requires applicable T2-04 evidence plus required continuity dimensions. Authority requires its own target-bound evidence and applicable context. Neither automatically supports the other. Acceptance and sufficiency remain separate.

Precedence: prohibition > comparable conflict > historical loss > missing > complete negative > complete undecidable > positive > fallback. Collateral diagnostics remain intact.

## Frozen-label boundary

Actual pre-change T14 contains a producer-anchor path named `old_authority_inference`, requesting `authority.current`. Its historical result is UNRESOLVED, with `admitted_mapping_and_evidence` missing and no collected exclusion. The entry's description of this as an existing prohibition must not be mistaken for an existing UNSUPPORTED serialized result. Exact baseline output and producer nonclaims are preserved, including when a valid finding supports the separate temporal-anchor authority path. A path label supplies neither a canonical alias nor authority evidence.

Prohibition precedence is separately proven using the existing canonical `current_standing` exclusion with observed `historical_evidence_valid`, through actual owner/composite results. Frozen T14 is not rewritten or enriched. Historical missing witnesses and unsupported mappings remain explicit limitations, not automatic upgrades.

## Acceptance surface and lifecycle

Supplemental controls have new identities and provenance. They cover T07, T15, T21.complete (INCONCLUSIVE), T08, T09.subject/scope, T10, T11, T12.policy/dependency, T13.policy/dependency, T14, T16, T20, T21.missing and T27. Explicit N14/I17/H33 assertions and all 37 frozen T-family outputs preserve history; H33 remains structural REJECTED.

Falsifiers cover labels/versions/same bytes; missing criteria; compatible versus material changes; six-state precedence; independent facets; review/revalidation omissions; original-channel joins; serialized handles; registry/trust and both times; predecessor timestamp/result/byte/custody replay; source restoration; Core/caller/context obligations and name collisions; all competing records; permutation invariance; corrupt expectations; dropped bindings; false whole-case PASS; and unexpected exceptions (ERROR).

PRE_COMMIT_IMPLEMENTATION requires the exact entry HEAD and only eight allowed paths. POST_COMMIT_ACCEPTED_IMPLEMENTATION requires a clean direct single-parent child with exactly those eight committed paths. Falsifiers reject future descendants, merge parents, a ninth path and dirty committed state. Historical guards remain exact; only attributed dispatch/returns and bounded post-commit replay counts are added.

Full acceptance runs three fresh evaluations with identical serialized outputs, a fresh-process replay, T1/Core fingerprints, all prior T2 semantic assertions/hashes, historical/default/public preservation, protected-source hashes, and R-EAK/R-MESR/R-ISOLATION/R-PUBLIC/R-OUTCOME. The public index/stat check runs after staging authorized paths. Post-commit smoke repeats one T2-05 and one prior-task replay plus source/control/public/historical checks, without repeating large regressions.

During semantic development, attempts exited 1 on fixture ledger bindings, a structurally invalid flag fixture, a non-required Core-binding test, and a frozen path label incorrectly treated as a canonical exclusion. They are not acceptance passes. An added fresh historical-byte/custody falsifier then found a missing historical-obligation propagation: the historical T2-04 missing array now remains in the T2-05 request under an explicit historical prefix; a valid current envelope cannot mask it. Corrections preserve admission and Core behavior.

Rollback/stop: ninth path; selector/shared-contract/Core change; historical/no-finding mismatch; private-context bypass; public byte/exit/license drift; unstable replay; failing mandatory proof. Do not amend an accepted commit to hide a lifecycle defect; distinguish product regression from verifier/tooling failure.

Invariants confirmed by acceptance: audit output/verdict/exit and deny 25 unchanged; permit/classify unchanged; recommendation-only; additive-only; non-executing; default-off; no authority scope expansion. No public exports, CLI, licensing, install/demo, report/parser/validator, version or release change; no control-plane/dashboard/orchestration/runtime takeover.

The actual implementation commit and post-commit result are reported outside this committed document to avoid self-referential hashes.

## Deterministic replay measured during full acceptance

The three fresh T2-05 evaluations completed before prior-task preservation/regressions finished:

- REPLAY_1 = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
- REPLAY_2 = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
- REPLAY_3 = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
- T2_05_RESULT_HASH = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
- SERIALIZED_REPLAY_1 = 9c689f8b533e267bfa0f44417a5631a80bb5b16b70988e8ed7c264aa861f92c7
- SERIALIZED_REPLAY_2 = 9c689f8b533e267bfa0f44417a5631a80bb5b16b70988e8ed7c264aa861f92c7
- SERIALIZED_REPLAY_3 = 9c689f8b533e267bfa0f44417a5631a80bb5b16b70988e8ed7c264aa861f92c7

All serialized outputs were compared for exact equality. All required preservation and regression checks subsequently passed.

## Measured acceptance

Command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-05 --record`; exit **0**.

| Proof | Result |
| --- | --- |
| Supplemental controls | 68 PASS |
| Handle/context/precedence/falsifier checks | 80 PASS |
| T1-01 / T1-02 / T1-03 / T1-04 | PASS / PASS / PASS / PASS |
| Core probes | 603 PASS |
| No-finding and invalid-finding preservation | 132 exact BEFORE/AFTER outputs |
| T-family exit | All 37 exact historical outputs retained |
| H33 | REJECTED |
| R-EAK / R-MESR / R-ISOLATION / R-PUBLIC / R-OUTCOME | PASS; 23/23 command exits 0 |
| Protected source/artifacts | 1450 exact byte hashes unchanged |
| PUBLIC_CONTRACT_DRIFT | NO |
| AUTHORITY_EXPANSION | NO |
| NEW_REGRESSION | 0 |

- T2_01_RESULT_HASH = `4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`
- T2_02_RESULT_HASH = `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`
- T2_03_RESULT_HASH = `fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34`
- T2_04_RESULT_HASH = `98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf`

Fresh-process replay: `d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f`; exact semantic hash reproduced. All 68 controls and 80 additional checks ran in that fresh process.

Final hygiene removed exactly one redundant terminal LF from continuity.ts. The original full-acceptance source reconstructs by appending one LF, and its original SHA-256 remains in the results receipt. The final source passed the fresh replay command above (exit 0), with unchanged T2_05_RESULT_HASH. No semantic edit or large-suite repetition was needed.

Final artifact/source byte hashes:

- packages/guard-core/src/mesr/repaired/continuity.ts: `2f807a498681b548378cbccd64f85660f7ca50cbd03f1ab5a9602acb55c99f45`
- packages/guard-core/src/mesr/repaired/evaluateClaim.ts: `12f1346d97f175cce33226bf8a29c3a009da2d47e557ccc7f48fa359fa534286`
- scripts/verify_v8_gate1_product_conformance.mjs: `68e6010827d2c05da8ba8933511e2ddcd5b19b6cf49c8fa04eaf81ab0650c22d`
- scripts/gate1/b09-product-inputs.mjs: `01f9f660eb89ac34d9f249eee4320c9a028d9535acfae6aeaae0dea522d51d18`
- scripts/gate1/b09-product-compare.mjs: `2a59ac818e2b3c15f6651d5656bc024554a0a3def3a0bd90ed0e1e32cd54231d`
- CONTROLS_SHA256: `73055b7c0a34827fef12dd2efb823789fa1c0d30f77fc83cfd523308f7c47faa`
- RESULTS_FILE_SHA256: `7961f95a7b0ffdae37379b6a6f4604c62ee06f08a5a5e69905aced2515fd515f`

Per-command BEFORE/AFTER exits, stdout/source hashes, historical input/output bytes, owned assertion fields and all replay receipts reside in the controls/results artifacts.

T2_05_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS

T2-05 = CLOSED / EVIDENCE CLOSED

G07 = CLOSED (T2-04 and T2-05 closed)

G06 = OPEN / NOT STARTED

G03 = OPEN / NOT STARTED

One implementation commit is authorized after final eight-path hygiene. Post-commit command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-05`. It must pass from CLEAN state with HEAD^ equal to the entry HEAD, preserve all five task hashes, and leave CLEAN state. This document records pre-commit acceptance; the resulting commit and actual smoke outcome are reported externally.
