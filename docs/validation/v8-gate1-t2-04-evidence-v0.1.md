# T2-04 Explicit Reliance-Time Applicability — Evidence Closure v0.1

Date: 2026-09-21. Internal V8 evidence-assurance work; public/commercial baseline remains v7.0.1.

Status: **T2_04_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**. T2-04 CLOSED / EVIDENCE CLOSED. G07 remains OPEN.

## Checkpoint and boundary

- Implementation entry and pre-change HEAD: `39f7dd66bf150aea04225266212881318c64cd53`.
- Starting branch: `planning/v8-gate1-tranche2-g07-v0.1`; starting worktree CLEAN.
- Implementation branch: `feat/v8-gate1-tranche2-t2-04-reliance-time-applicability-v0.1`.
- Owned facet: `standing.current`, exact request path, on `mesr.core.temporal.basis@0.1.0`.
- Authority: [accepted entry v0.2](../planning/v8-gate1-t2-04-implementation-entry-v0.2.md), [ADR 0015](../adr/0015-historical-current-standing-and-reliance-time-contract.md), and [ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md).

Exact implementation allowlist and final intended changed-path set:

```text
packages/guard-core/src/mesr/repaired/temporalApplicability.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-04-controls.v0.1.json
tests/fixtures/gate1/t2-04-results.v0.1.json
docs/validation/v8-gate1-t2-04-evidence-v0.1.md
```

No selector, shared contract, requirement union, Core entry, reason binding, public export, public CLI, report model/renderer, licensing implementation, version file, frozen B09 artifact, or earlier task artifact is changed.

## BEFORE capture

The controls artifact retains the actual pre-product-edit T1/Core fingerprints, historical inputs and full product outputs, public serialized outputs and reason ordering, parser/validator controls, T25 inputs and outputs, historical task hashes, regression stdout/exits/source hashes, and tracked-file SHA-256 inventory. Hashes name their representation: source/stdout hashes cover filesystem/UTF-8 bytes; semantic result hashes use the existing verifier's canonical JSON method; serialized replay hashes cover exact JSON.stringify UTF-8 bytes.

Commands and outcomes:

1. `git status --short`; `git branch --show-current`; `git rev-parse HEAD`: exit 0; CLEAN, required HEAD.
2. `git switch -c feat/v8-gate1-tranche2-t2-04-reliance-time-applicability-v0.1`: exit 0; branch and HEAD confirmed before editing.
3. `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-04 --before`: first attempt exited 1 at a new verifier inventory lookup (H controls belong to admission inventory). Product files were still unchanged. Corrected the lookup in the authorized verifier.
4. Repeated BEFORE command: T1-01/02/03/04, all 603 Core probes, 171 T2-03 cases/76 controls, four T2-02 cases/81 controls, and 370 T2-01 cases/64 controls passed. Each accepted task hash reproduced across three evaluations. Twenty inherited regression commands passed; the public-surface consistency command exited 1 at its index/stat changed-path guard before semantic assertions.
5. Staged only authorized files, then reran `node scripts/verify_v7_0_1_public_surface_consistency.mjs`: exit 0, unchanged protected verifier. That verifier compares working-file stats against the Git index, so staging satisfies its original guard. No guard was removed or rewritten. The original failed receipt remains in `before.initial_regression_attempts`.
6. `node scripts/verify_outcome_foundation_contract.mjs` and `node scripts/verify_outcome_foundation_negative_contract.mjs`: exit 0. These add the canonical R-OUTCOME obligations to the inherited 21-command inventory.
7. Actual `createExperiment0Cases` canonical pack, `inspectEvidenceCoverage`, and `generateGovernanceReport` calls captured T25 equality/earlier outputs before product edits. Equality omits TIME_WINDOW_EXPIRED; strict earlier emits it. No B09 reference evaluator is imported.

BEFORE completion: 23/23 regression commands passed; full retained baseline in `t2-04-controls.v0.1.json.before`. Windows sandbox initialization failed before the first shell read; reviewed elevated shell execution succeeded. This was an environment condition, not a product result.

## Product behavior

`temporalApplicability.ts` evaluates explicitly supplied retained JSON in the existing evidence ledger. It derives temporal facts and named missing obligations. It never selects a canonical claim state, samples a clock, looks up network status, executes a check, or registers semantic IDs.

- **Times:** `evaluation_time` and `reliance_time` are separately required and bound. Equality requires two explicit supplied values. Original timestamp spelling remains in the immutable dossier; normalized instants are comparison-only. The versioned method accepts valid offset instants at millisecond-or-coarser precision; ambiguous zones, invalid calendar dates, leap seconds, or finer precision remain unresolved without rounding or tolerance.
- **Applicable criterion:** retained policy ID, version, issuer, provenance, exact scope/path/facet, effective interval/convention, required-input inventory and limitations are checked. Reference-only labels do not supply a criterion. The bounded method version defines deterministic comparisons, not a universal TTL.
- **Freshness:** the retained relevant verification event time must match the freshness witness. An explicit claim-specific max-age and `<` or `<=` rule decides the boundary. Age without the rule cannot establish loss.
- **Validity:** both retained interval endpoints and the explicitly admitted convention are required. All four explicit endpoint conventions are supported; arbitrary intervals are not silently treated as half-open. Missing expiry cannot establish permanence. Not-yet-effective exclusion does not invent historical validity.
- **Revocation:** exact basis/subject/revision/scope, source, recorded/effective times, provenance, retained issuer competence/category/interval, and snapshot association are required. An out-of-scope record has no force on this target. A later effective revocation does not stale earlier reliance.
- **Supersession:** retained predecessor and successor identities/versions/digests, admitted canonical anchor, attributable successful successor event, and a separate exact-basis displacement rule/effective time/rationale/compatibility limits are checked. A successor label or version difference alone is unresolved. No aliases or Core semantics are retargeted.
- **Snapshot:** source/publisher, retained contents, as-of and effective period, exact subject coverage, status categories, completeness basis, limitations, omissions and horizon are checked. Missing records in an incomplete snapshot prove no absence. Reliance beyond horizon needs the separately retained, snapshot-digest-bound prospective rule; its limitations explicitly deny any future non-revocation guarantee.
- **History:** preserved support is recomputed from the retained successful T2-01 event/result, exact historical context, original T2-02 member receipts, and original T2-03 identity/separation/custody/check finding. The historical instant must also satisfy the admitted temporal rule, interval, freshness and complete snapshot, with no effective historical loss. Serialized state labels or caller booleans cannot establish this basis. Old records are retained byte/content-equivalently; no timestamps are rewritten.

**STALE requires preserved historical support plus proved applicability loss at the requested reliance context.** Expiry, freshness excess, effective revocation and displacement have distinct loss reasons. Missing currentness, rule, expiry, snapshot or reference time alone cannot create STALE. Complete bounded non-support and complete undecidable status remain distinct from loss of formerly supported applicability.

## Private finding and state owner

A module-private WeakMap registers product-created, deeply frozen findings with the full input/core/trust/contexts/collected-requirements context and exact request path. Serialized evidence contains no process-local authority. Copied, fabricated, serialized/reconstructed or wrong-context objects are inert; frozen mutation fails. Fresh evaluation recomputes private handles from retained facts without pretending to run a new external check.

The seventh, trailing optional argument to `evaluateClaims` preserves the existing T2-02 and T2-03 argument positions. Only the exact temporal facet/anchor branch consumes the finding. It projects authenticated losses, exclusions, contradictions, undecidable facts, missing facts and positive completion into the existing arrays. Only its own generic `currentness` placeholder is replaced; collected caller/Core/context requirements with the same name remain missing. Continuity, authority, acceptance and collateral obligations remain separate.

When a valid T2-04 finding is consumed, the old `bound-applicability-loss/0.1` route is locally isolated and retained in ignored-evidence diagnostics. With no valid finding, the old route and complete historical outputs remain exact. Import alone changes no semantics. The verifier reconstructs the pre-change state-owner file after removing only the authorized additions, and similarly reconstructs the historical verifier prefix after removing T2-04 dispatch/attributed-return additions.

The unchanged private selector preserves prohibition > conflict > stale > missing > completed negative > complete undecidable > positive > fallback. Conflict over stale and stale over retained collateral missing facts are tested directly. The existing Core prohibition uses the distinct `current_standing` spelling; the stronger prohibition is therefore tested through the existing owner composite with actual prohibited and temporal child results, without inventing an alias or changing Core.

## Evidence coverage

- 65 separately identified NEW supplemental evidence controls; no enrichment of frozen T02/T05/T06/T22.
- Canonical T02.before/at, T17, T01/T03/T04, T05/T06, T18's two missing-time cases, T19/T20, T22.rule/absent, T23, T24.timezone/interval and T26.complete/missing.
- Freshness exact boundaries; four-convention evaluator; explicit equal times; equivalent timezone spelling; invalid calendars; precision/unknown-zone rejection; bounded prospective use.
- Age-only, absent expiry, successor/version-only, missing coverage, out-of-scope/later revocation, never-valid history, not-yet-effective evidence, missing historical witness and beyond-horizon expiry falsifiers.
- 36 additional executed private-handle/context/precedence assertions, including subject/revision/scope/facet/path/time/rule/snapshot/history/member/custody/registry replay, caller-state shortcuts, context-name collisions, clock avoidance, original-history retention, legacy-route isolation and comparator falsifiers.
- No-finding and invalid-finding exact historical comparisons; frozen incomplete evidence remains incomplete. H11/H12/H13/H34 remain structurally REJECTED, without coercion or continuity implementation.
- T1 admission, requirement union, six-state projection, composition and all 603 Core probes use actual product API fingerprints, not inherited PASS labels.
- T2-01/02/03 semantic suites reproduce the accepted hashes; protected source hashes and source-restoration assertions preserve their private interfaces and lifecycle guards.
- R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME execute all canonical commands. Four inherited EAK/external-evidence checks also execute, for 23 regression receipts.

## Lifecycle, determinism and remaining scope

PRE_COMMIT_IMPLEMENTATION requires the exact entry HEAD and changed paths within the eight-path allowlist. POST_COMMIT_ACCEPTED_IMPLEMENTATION requires a clean direct single-parent child of that entry and the exact committed eight paths. Guard falsifiers reject unrelated descendants, merge parents, a ninth path and dirty committed state. Accepted source/control/result hashes are rechecked; post-commit mode does not rewrite evidence or rerun large regression suites.

Three fresh process-local evaluations compare both canonical result hashes and exact serialized bytes. A further fresh-process evaluation must reproduce the same result and demonstrate serialized handles remain inert.

Remaining gaps: T2-05 context continuity, G06 and G03. G07 remains OPEN. T2-05 is not started; it becomes UNBLOCKED_FOR_PLANNING / ENTRY only after T2-04 acceptance. This work establishes no current-authority rebinding, institutional acceptance, execution permission or G07/G06/G03 closure.

Rollback/stop conditions: any ninth required path; selector/shared-contract/Core change; no-finding output regression; historical result-hash mismatch; public byte/exit/license drift; unverifiable private context; unstable replay; or a failing mandatory proof. Scope expansion requires a separate decision. A post-commit lifecycle failure must be reported as a verifier lifecycle defect or product regression; do not amend the accepted implementation to hide it.

## Validation execution notes

The initial AFTER `--record` run exited 1 at the new public-baseline comparison because live parser diagnostics contain `details: undefined`, while persisted JSON omits it. The comparison now uses the same JSON serialization boundary as the existing historical preservation verifier. No parser or public output was changed. The two authorized helper files retain their exact Git-source prefixes; worktree CRLF was normalized to the existing Git LF representation before their byte-prefix checks.

Post-commit smoke recomputes one fresh T2-04 result and one fresh result from each accepted historical T2 lane, verifies source/control hashes and all historical no-finding/public/T25 outputs, and inherits unchanged accepted T1/Core fingerprints. It does not rerun the 23 regression commands or repeat the already accepted triple replays. Historical task modes and their lifecycle guards remain exact; the lighter replay count is guarded exclusively by the new T2-04 post-commit lifecycle.

Preserved invariants: audit output/verdict/exit unchanged; deny exit code 25 unchanged; permit behavior unchanged; classify behavior unchanged; recommendation-only; additive-only; non-executing; default-off; no authority scope expansion. No control-plane, dashboard, orchestration or main-path takeover.

## Measured acceptance

Acceptance command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-04 --record`; exit **0**.

| Proof | Measured result |
| --- | --- |
| T2-04 evidence/control expectations | 65 PASS |
| Additional handle/context/precedence assertions | 36 PASS |
| T1-01 / T1-02 / T1-03 / T1-04 | PASS / PASS / PASS / PASS |
| Core product probes | 603 PASS |
| Historical no-finding + invalid-finding preservation | 135 exact BEFORE/AFTER cases, including 40 standing.current cases |
| T25.equal / T25.earlier | Exact legacy strict-expiry behavior preserved |
| H11 / H12 / H13 / H34 | REJECTED / REJECTED / REJECTED / REJECTED |
| R-MESR / R-ISOLATION / R-PUBLIC / R-OUTCOME | PASS; 23/23 total regression commands exit 0 |
| Protected tracked source/artifacts | 1443 hashes unchanged |
| PUBLIC_CONTRACT_DRIFT | NO |
| AUTHORITY_EXPANSION | NO |
| NEW_REGRESSION | 0 |

Accepted historical semantic hashes:

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
```

Three fresh T2-04 product evaluations:

```text
REPLAY_1 = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
REPLAY_2 = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
REPLAY_3 = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
T2_04_RESULT_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
FRESH_PROCESS_REPLAY_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
```

Exact serialized-output replay hashes (JSON.stringify UTF-8 bytes):

```text
SERIALIZED_REPLAY_1 = 1f65e0d7a20147118fb0bdc7f7ce6262adaf6a89109534439cff4d38304d9d6d
SERIALIZED_REPLAY_2 = 1f65e0d7a20147118fb0bdc7f7ce6262adaf6a89109534439cff4d38304d9d6d
SERIALIZED_REPLAY_3 = 1f65e0d7a20147118fb0bdc7f7ce6262adaf6a89109534439cff4d38304d9d6d
```

All three serialized outputs were compared for exact equality. Fresh process-local handles were recomputed; copied/serialized handles remained inert. The fresh-process lane executed the same 65 controls and 36 assertions. No WeakMap identity, address, pointer or clock appears in serialized evidence.

Artifact byte hashes:

```text
CONTROLS_SHA256 = d68c285c3d2ade4badcdd278e4d458c23a8f5439540b5389c7e44064d78ef91d
RESULTS_FILE_SHA256 = 7728b0283b56b0b75692bc453a7c8b9fd9a34cc9590e15e911683ebf79709b9a
packages/guard-core/src/mesr/repaired/temporalApplicability.ts = cfc35365dc881c7142a2ab66abe9cabc4017b3fd14befa218b1451135b8f97fb
packages/guard-core/src/mesr/repaired/evaluateClaim.ts = aac4be5d410390f7d5c29348a5b7f883dd32cc7404fa37c9588b806805259a21
scripts/verify_v8_gate1_product_conformance.mjs = 349b3e027d12a05178194362746d729278bbaa1c362bb4278825b42290f51768
scripts/gate1/b09-product-inputs.mjs = b47d4a0e4c4c35316dcc5855d3308680e7e5bc7c12aa84a27b892dc98f73c956
scripts/gate1/b09-product-compare.mjs = 156c6c26ee6b8191f4bb2a558a7073a2ca4e571a10ce142dc99a8c061d1673b2
```

Exact per-command BEFORE/AFTER exits, stdout and source hashes are retained in the controls/results JSON. Pre-commit source restoration verifies the old state owner and historical verifier, and the exact Git prefix of each historical translator; selector/requirement/Core/private historical channels remain unchanged.

```text
IMPLEMENTATION_DECISION = T2_04_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS
T2-04 = CLOSED / EVIDENCE CLOSED
T2-05 = UNBLOCKED_FOR_PLANNING / ENTRY; NOT_STARTED; OPEN
G07 = OPEN
G06 = OPEN; NOT_STARTED
G03 = OPEN; NOT_STARTED
```

One implementation commit is authorized after final eight-path diff hygiene. The actual implementation commit and post-commit smoke outcome are reported outside this committed document, avoiding a self-referential commit hash or a second documentation commit. Required post-commit command: `node scripts/verify_v8_gate1_product_conformance.mjs --task T2-04`. It must pass from CLEAN state, require `HEAD^` equal to the entry hash, reproduce the four task hashes, and leave CLEAN state. No post-commit result is claimed in this pre-commit evidence document.

Final hygiene: the first diff check found one redundant trailing LF in the new temporal module. Removed only that LF; the previous exact source is reconstructible by appending one LF to the final file and matches the original acceptance source hash. A fresh `--replay-only` product run exited 0 with the same T2_04_RESULT_HASH. The results artifact retains both full-acceptance source hashes and final source hashes with this explicit hygiene receipt. No semantic changes or large-suite rerun were needed.
