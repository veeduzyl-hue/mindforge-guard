# T2-06 Profile-Bound Standalone Sufficiency Evidence v0.1

Internal V8 evidence-assurance work. The released commercial baseline remains v7.0.1.

Acceptance status: **T2_06_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**. T2-06 CLOSED / EVIDENCE CLOSED. G06 and G03 remain OPEN. T2-07 is UNBLOCKED_FOR_ENTRY / NOT STARTED.

## Checkpoint and scope

- Starting HEAD, implementation entry and pre-change HEAD: `1cc340b1123ed2e874ccaddf14f8f78d9232fa90`.
- Starting branch: `planning/v8-gate1-tranche2-g06-v0.1`; worktree CLEAN.
- Implementation branch: `feat/v8-gate1-tranche2-t2-06-profile-sufficiency-v0.1`.
- Authority: the accepted T2-06 implementation-entry v0.2, private-profile criteria v0.1 and bounded scope decision. These historical documents remain unchanged.

Exactly eight authorized paths:

```text
packages/guard-core/src/mesr/repaired/sufficiency.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-06-controls.v0.1.json
tests/fixtures/gate1/t2-06-results.v0.1.json
docs/validation/v8-gate1-t2-06-evidence-v0.1.md
```

No Core, contracts, selector, requirement collector, predecessor, public export, CLI, report, parser, validator, reason, license, package/version or historical-evidence edit is authorized.

## BEFORE evidence and frozen criteria

`git status --short`, `git branch --show-current`, `git rev-parse HEAD`: exit 0; exact checkpoint and clean tree. `git switch -c feat/v8-gate1-tranche2-t2-06-profile-sufficiency-v0.1`: exit 0, followed by branch/HEAD confirmation before edits.

The Windows sandbox failed to initialize (`helper_sandbox_lock_failed`, access denied). Reviewed shell execution provided the working fallback. This was an environment issue. A later oversized shell invocation did not start; the product-file addition and owner edit were subsequently applied through working tools. No acceptance relies on those failed invocations.

Before any product edit, the frozen criteria were independently recomputed with Python's standard JSON and SHA-256 primitives. Duplicate keys, nonfinite values, unexpected CR/BOM and noncanonical claim-set serialization were rejected. Only the frozen CRLF-to-LF and marker-adjacent separator rules were applied. The test translator independently reproduced the same receipts.

| Content | Canonical SHA-256 | UTF-8 bytes |
| --- | --- | ---: |
| Profile | ef051daa4b12093d195429746ac96ebadb5f85fa9497a3905ac77ba63f5390a0 | 26112 |
| Claim set | 6c374f3517c77c340a7807dc2c3e07df209a69dca75cff01157f305be89c4e68 | 381 |
| Method rules | b46e86d207e9edb048992915f362be1cd8a7890a67fa224a0e301951a9223643 | 25866 |

The profile and claim-set domains are fields inside their hashed content. Method domain `private.t2-06.method-rules/0.1` is recorded alongside the canonical JSON string of the full rules text. Object keys use code-point order, arrays preserve order, UTF-8 has no BOM or terminal LF. The three versioned IDs remain private bookkeeping only. The existing anchor content digest remains `839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b`.

BEFORE command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-06 --before`; exit **0**. Actual product APIs passed T1-01/02/03/04 fingerprints and 603 Core probes; all five predecessor semantic inventories/hashes matched; 137 historical inputs/outputs were captured, including historical sufficiency/S-family and H08/H16/H17/H18/H19/H33. All 23 regression commands exited 0. The controls artifact's immutable `before` object retains exact commands, stdout hashes, public JSON/Markdown/HTML/index strings, parser/validator results, reason order, legacy verdicts, fingerprints and protected source byte hashes. Authorized verifier/helper files were staged for the existing public-surface index check; product code was still untouched.

Source/control hashes cover exact filesystem bytes; frozen-history checks also compare Git blobs. Semantic result hashes use canonical JSON. Serialized replay hashes use exact `JSON.stringify` UTF-8 bytes. Source packs retain canonical JSON UTF-8 bytes and SHA-256 with their declared private schema. These byte domains are distinct and explicitly retained.

## Private implementation

The only owned request is `mesr.core.claim.claim@0.1.0 / evidence.sufficient / sufficiency`. The implementation authenticates full profile, claim-set and method content against the three separately pinned admission receipts. A changed profile with a matching self-authored digest is not admitted. It introduces no registry, policy DSL, public profile API, canonical ID or alias.

The closed private envelope retains the exact source-pack bytes/schema/digest, source inventory, native verification, original byte-comparison envelopes, tuple, composition, inherited routes and provenance. Malformed private envelopes retain validation errors; absent or invalid findings leave the canonical owner's historical branch unchanged. Well-formed missing evidence remains missing.

| Dimension | Actual procedure |
| --- | --- |
| R00 | Authenticate pinned content and Core anchor; fresh B08 composition; exact outer metadata/locks; E and source bytes; full inventory; expanded Core/entry/context/caller predicate/source union for outer and genuine atomic result. Each obligation retains exact target, binding, predicate/version, source, result, evidence and limitations. Same-name sources remain distinct. Unknown routes/predicates do not discharge requirements. |
| R01 | Fresh `evaluateVerificationEvent` over native retained records and the separate original canonical context for `verification.passed / pass`. Retain event/namespace, subject/revision/scope, property, method/version/criterion, original time, actors, all refs, limitations and actual owner result. |
| R02 | Fresh `compareExactBytes` plus `readIntegrityReceipt` for every original and direct relied-on input/output member, using its own original input/path/contexts and attributed expected reference. Retain bytes, length, member/domain/representation, event/checker/method and content joins. |
| R03 | Always present. When A1 is positive, compare every intermediate and final transformed member against its own reference/domain. No successful sample substitutes for all members. |
| A0 | Complete exact tuple, unit-tests property, subject/revision/artifacts/environment, one included scope, empty excluded scope, explicit equal reliance/evaluation instant and original event no later than evaluation. Missing basis is unresolved; complete false comparison is bounded non-support. |
| A1 | Enumerate actual native records, candidates, relied-on members and all dependency edges against the source-digest-bound manifest. Cycles, ambiguity, omitted members/edges or unresolved references remain unresolved. Negative requires complete original-only evidence and explicit empty transformation provenance. |
| X0 | Only R03, with positive A0, negative A1, full original/manifest evidence, fixed justification and no independent transformed-member obligation. R03 remains visible as `permitted_exclusion`. |
| M1 | Missing mandatory basis precedes complete exclusion, completed negative, complete undecidable and positive. Every member result and collateral stronger fact remains retained. No absent input becomes a mismatch or failed check. |
| NM0 | Zero permitted non-material gaps. Caller non-material assertions are retained but cannot discharge any requirement. No scores, weights, severity or probability. |

`no_material_gap` is derived only from complete positive A0, complete A1, the full R00-R03 and inherited inventory, complete applicability/materiality, all required atomic support and justified exclusions, with no stronger blocker. Empty gaps, labels, references or all visible atomic claims supported cannot establish it.

Inherited independence/custody, currentness and continuity/authority requirements use fresh T2-03/04/05 execution and their unchanged readers in the original envelopes. Their original T2-01/02/03/04 prerequisites are reconstructed, never disabled. Original historical paths and both times are retained. These routes run only for inherited obligations. Wrong route/facet/time/reader context remains unresolved. New synthetic equal-time continuity witnesses are explicitly supplemental; no historical predecessor fixture is changed.

## Finding and sole state owner

Only product execution registers a finding in a module-private WeakMap. The finding and owned retained snapshots are deeply frozen; caller inputs remain mutable and unmodified. Real predecessor identities are retained privately, independently of serialized snapshots. The reader binds the complete current envelope, full input/Core/trust/contexts and the owner's freshly collected requirements. Subject, revision, artifact, scope, environment, both times, profile/rules, locks, witnesses, provenance and requirements are therefore replay-bound.

Plain, copied, serialized, reconstructed, mutated or wrong-context findings are inert. Caller `sufficient`, `no_material_gap`, material-gap labels, StateBasis, predecessor labels/hashes and fixture expectations confer no evidence. Conflicting separately supplied channels fall back to the unchanged old branch. A fresh evaluation of serialized *input evidence* may create a new genuine finding; serializing a finding cannot preserve its identity.

`evaluateClaims` preserves all eight existing argument positions and adds only the approved ninth private channel. Only the exact sufficiency branch reads it. A valid finding avoids only that branch's own `profile_bound_sufficiency_basis` placeholder; no string filtering or inherited-obligation removal occurs. Existing structural checks remain active. The unchanged private selector owns all six states and precedence: prohibition, comparable conflict, historical applicability loss, missing basis, completed negative, complete undecidable, positive. No new selector or state exists.

No valid finding means exact old output, including diagnostics. Imports and private-module existence do not upgrade historical S cases. Fresh supplemental controls provide new evidence, not historical repairs.

## Verification and boundaries

The separately attributable lane uses actual product calls. Translators retain evidence and apply declared mutations; comparators compare owner outputs. The independent falsifiers reject corrupt expectations, dropped bindings, omitted/duplicate cases, false whole-case PASS, unexpected exceptions and expectation-driven product decisions. Unexpected exceptions are classified ERROR and fail comparison.

Controls cover S01-S13 standalone obligations, S04/S10/S11.absent positives, S04 label-only/bad digest, S02/S03/S07 variants, S08 conflict/stale, S09 complete undecidability, and H08/H16/H17/H18/H19. Further controls cover hidden/missing/duplicate/unknown/extra claims; complete materiality; all original/intermediate/final member accounting; A0/A1/X0; missing-versus-negative precedence; NM0; inherited routes; same-name collisions; closed envelopes; protected contexts; serialized handles; deep immutability; and caller-input nonmutation.

PRE_COMMIT requires exact entry HEAD and only the eight authorized paths. POST_COMMIT requires a clean direct single-parent child of that entry and exactly the eight committed paths. Future descendants, merge parents, ninth paths and dirty committed state are rejected. Historical lifecycle guards and assertions are restored byte-for-byte in a structural preservation check; only T2-06 dispatch, attributable returns and one complete predecessor assertion replay are added. Every historical semantic assertion still executes; repeated large regression suites are omitted only for the post-commit smoke.

Required regression groups R-EAK, R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME use the same 23-command inventory as BEFORE. Public JSON/MD/HTML/index, EvidencePackV1, parser/validator, reasons/order, four legacy verdicts, CLI/exports/default callers and licensing/offline authority are checked through exact byte/source and executable regression evidence.

Preserved invariants: audit output/verdict/exit and deny exit 25 unchanged; permit and classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. No public/commercial, install/demo, report, execution or control-plane behavior changes.

BASE requires no report link. Report-association portions of S controls remain deferred to T2-07; standalone sufficiency proves no report association. G03 remains `DEFERRED_TO_G03`; no producer integration, Harness mapping, ingestion or canonical EvidencePack creation is implemented. Missing producer facts remain missing.

Rollback/stop conditions: ninth path; changed frozen criteria; selector/requirement/admission/Core change; no-finding or public output regression; private context bypass; changed predecessor hash; failed mandatory proof; unstable replay; authority expansion. Do not weaken semantics for tooling. A validation failure is reported separately; a post-commit lifecycle failure must not be hidden by amending the accepted commit.

## Measured acceptance receipt

Command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-06 --record`; exit **0**.

| Proof | Measured result |
| --- | --- |
| Supplemental controls | 115 PASS |
| Handle/context/precedence/comparator checks | 54 PASS |
| T1-01 / T1-02 / T1-03 / T1-04 | PASS / PASS / PASS / PASS |
| Core probes | 603 PASS |
| Historical/default-off outputs | 137 exact outputs preserved |
| R-EAK / R-MESR / R-ISOLATION / R-PUBLIC / R-OUTCOME | PASS; 23/23 commands exited 0 |
| Protected source/artifacts | 1458 exact byte hashes unchanged |
| PUBLIC_CONTRACT_DRIFT | NO |
| AUTHORITY_EXPANSION | NO |
| NEW_REGRESSION | 0 |

- T2_01_RESULT_HASH = `4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`
- T2_02_RESULT_HASH = `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`
- T2_03_RESULT_HASH = `fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34`
- T2_04_RESULT_HASH = `98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf`
- T2_05_RESULT_HASH = `d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f`

- T2_06_REPLAY_1 = `b300dfb6ea935fcd3687fb04df6bf6314fd8a572a78363b9768461b64b2d2c33`
- T2_06_REPLAY_2 = `b300dfb6ea935fcd3687fb04df6bf6314fd8a572a78363b9768461b64b2d2c33`
- T2_06_REPLAY_3 = `b300dfb6ea935fcd3687fb04df6bf6314fd8a572a78363b9768461b64b2d2c33`

- T2_06_RESULT_HASH = `b300dfb6ea935fcd3687fb04df6bf6314fd8a572a78363b9768461b64b2d2c33`
- Fresh-process T2_06_RESULT_HASH = `b300dfb6ea935fcd3687fb04df6bf6314fd8a572a78363b9768461b64b2d2c33`
- SERIALIZED_REPLAY_1 = `067c7e53cc65ee86909dfe99a636c94b641020bec8c928b17b2e4f401a3e84b8`
- SERIALIZED_REPLAY_2 = `067c7e53cc65ee86909dfe99a636c94b641020bec8c928b17b2e4f401a3e84b8`
- SERIALIZED_REPLAY_3 = `067c7e53cc65ee86909dfe99a636c94b641020bec8c928b17b2e4f401a3e84b8`

All three serialized outputs were compared byte-for-byte. The fresh process ran the semantic controls and finding-serialization falsifiers again. No process identity, memory location or clock enters serialized evidence.

Artifact/source SHA-256 (raw filesystem bytes):

- packages/guard-core/src/mesr/repaired/sufficiency.ts: `9082fabaff5b63c8cd353784cf1b68eb5e4239accc5eeffcc83da6b06bf38f34`
- packages/guard-core/src/mesr/repaired/evaluateClaim.ts: `33a87b15c365728aff241939662aed4050e3e2ab995b044314c74d7cd3200d59`
- scripts/verify_v8_gate1_product_conformance.mjs: `1e21b422b9d6f9f835ac2642c1c8d7d3821fd4743198a11a421ba6fa3303c8c5`
- scripts/gate1/b09-product-inputs.mjs: `9f8fbff5c17d842542a25edf221e2da43463d09c9b12fec6946354799b9726d6`
- scripts/gate1/b09-product-compare.mjs: `bd92659102ab9c70c0dc4aa5ebb5299072604b4b1ab537a1cbb1f632b4499bd8`
- CONTROLS_SHA256: `bbac452419882b977192ea55ded6323eed306666efcb16eac65bde63502e39f6`
- RESULTS_FILE_SHA256: `9b6b319031a307c600ccb1a6aadaa7db42967510ffbf09b2c8dba9886db2e8ee`
- BEFORE_CANONICAL_SHA256: `b55707c1193fcca9d3f6dccf87fa3364abb651f6cbc2479390909bcdc1ff6a38`

All protected path hashes and per-command BEFORE/AFTER exits/stdout hashes are retained in the controls/results artifacts; the table reports measured counts, not inherited PASS labels.

Development evidence: the first supplemental input was structurally rejected for missing producer attribution; new continuity witnesses initially lacked complete time/snapshot joins. Those inputs were completed without changing predecessor semantics. Final review added exact R01 native-check matching for inherited routes and continuity artifact/environment matching. Targeted missing-member probes exposed absent-content/identity exceptions; these now retain unresolved diagnostics, with regression controls for seven absent member fields and a nonexistent reader path. Malformed types retain validation errors. A 19-case missing-envelope/edge sweep executed without exceptions. Three partial full-acceptance attempts were deliberately interrupted during hardening and are not counted as acceptance passes. The command above is the completed acceptance run on the final product/verifier source.

T2-06 = CLOSED / EVIDENCE CLOSED.

T2-07 = UNBLOCKED_FOR_ENTRY / NOT STARTED. Report association was not implemented.

G06 = OPEN because T2-07 is outstanding.

G03 = OPEN / DEFERRED_TO_G03. No Harness/producer/ingestion work was started.

The one implementation commit and actual clean post-commit smoke are reported externally to avoid a self-referential commit hash. Post-commit command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-06`. Require POST_COMMIT_ACCEPTED_IMPLEMENTATION, HEAD^ equal to the entry, exact eight committed paths, all six task hashes unchanged and a CLEAN worktree. No large regression suite is repeated unless a mismatch appears.

Evidence-file formatting hygiene: the complete accepted result initially occupied 138766933 bytes (SHA-256 `f495d7e3bd2b65bc44fbcc4bf5b518dc11de0fa636096d4cceac44d832f5b21c`). Each per-case output was then serialized on one line, retaining all values and case records. Exact parsed-object equality was asserted before replacement. Final size: 70632543 bytes. This changes only fixture whitespace; semantic/replay hashes, control/source receipts and accepted proof results remain unchanged. The clean post-commit replay verifies the parsed result again.
