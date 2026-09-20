# T2-02 exact-byte integrity implementation and evidence v0.1

Decision: **T2_02_IMPLEMENTATION_PASS_WITH_REMAINING_GAPS**.
G05 remains OPEN. T2-03 and G03 are not started.

## Checkpoint and exact boundary

- T2_02_IMPLEMENTATION_ENTRY_COMMIT = T2_02_IMPLEMENTATION_PRE_CHANGE_HEAD = `42937951ccff3518a121c41ab549cfede50a4849`.
- Starting branch: `planning/v8-gate1-tranche2-t2-02-v0.1`; starting worktree CLEAN.
- Implementation branch: `feat/v8-gate1-tranche2-t2-02-exact-byte-integrity-v0.1`, created directly from that HEAD and confirmed before edits.
- Actual changed-path set, exactly the accepted eight paths:

- `packages/guard-core/src/mesr/repaired/integrity.ts`
- `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`
- `scripts/verify_v8_gate1_product_conformance.mjs`
- `scripts/gate1/b09-product-inputs.mjs`
- `scripts/gate1/b09-product-compare.mjs`
- `tests/fixtures/gate1/t2-02-controls.v0.1.json`
- `tests/fixtures/gate1/t2-02-results.v0.1.json`
- `docs/validation/v8-gate1-t2-02-evidence-v0.1.md`

No selector, state set, Core registry/boundary, reason binding/code, admission,
requirements, canonical-byte helper, composition, T2-01 product/evidence, public
schema/parser/validator/report/renderer/export, CLI, package/version or licensing
path changes. No frozen B09 or planning evidence changes.

## Implementation and private authority

`integrity.ts` accepts explicit supplied base64 and attributable ledger records.
It applies the existing padded base64 alphabet plus exact decode/encode round-trip
validation (including pad bits), measures decoded octets, computes SHA-256, and
compares to the separately declared lowercase 64-hex reference. It does not derive
the expected reference, normalize/transcode bytes, reserialize text/JSON for the
comparison, dereference artifacts, perform filesystem/network I/O, sample a clock,
or create an EvidencePack. Empty octets remain representable by the existing
transport; malformed encodings are not repaired.

The result retains expected/recomputed digests, actual byte length, comparison
outcome, complete raw supplied records and requirement contexts, member namespace/
reference, representation/domain, subject/revision/scope, canonical claim/path/
version, checker/version, named method/version/descriptor, supplied comparison time,
distinct evaluation time, input/output references, provenance witnesses, limitations
and explicit nonclaims. Inspection can retain a measured comparison even when
missing/ambiguous associations prevent issuance of a receipt.

Only a complete admissible computation registers a deeply frozen receipt in a
module-private WeakMap. The reader requires original object identity and exact
canonical snapshots of input/path/contexts. Serialized evidence contains facts,
not WeakMap identity; copying or JSON reconstruction confers no authority. Replay
requires fresh computation. This is neither checker authentication nor verifier/
custody independence. Expected-source attribution is a supplied reference basis,
not proof of real-world provenance or truth. The supplied timestamp is retained,
not independent proof of wall-clock execution time.

`evaluateClaim.ts` adds an optional fifth private receipt argument. Existing
admission and requirement collection run first. Only the existing evidence.item
anchor with artifact.byte_equality consumes a valid receipt into its factual
positive/negative arrays. Without a valid receipt the exact historical branch runs.
A valid receipt avoids only the branch-local missing markers; no collected Core,
caller or context obligation is removed, including identically named obligations.
The original selector and composite owner are verified byte-identical.

Completed match is eligible for narrow SUPPORTED; complete mismatch is UNSUPPORTED
with both digests retained, never automatically CONFLICTED. Existing stronger
obligations/precedence still apply. No implication of authenticity, truth, custody,
verifier independence, outcome correctness, institutional acceptance, authority,
execution permission or compliance is added.

## BEFORE capture and execution attribution

Before product edits, `node %TEMP%/guard-t202-before.mjs` exited 0. Its exact
capture source is retained in controls.before.capture_source; it invokes the
accepted verifier's unchanged T2-01 semantic assertions and t201Preservation
machinery, plus the exact frozen 21-command regression list. The capture source
SHA-256 is `d4a4981587d86774fe9b2e9ad5244b0a05bd92e1c52a439a889915676d974842`.
The source verifier SHA-256 was `b81ae005dd50901884e90819c1569a052e681d50612e6cdac9cbb6523c1d07c1`.
Historical branch/lifecycle modes were not reported as executed or passed under a
new branch. Their full source is preserved; T2-02 has its own explicit scope lane.
An initial temporary extraction syntax error occurred before any product edit;
it produced no accepted baseline and was corrected before the successful capture.

BEFORE includes full serialized historical equality outputs, all accepted T1/Core
fingerprints, T2-01 370/64 assertion counts and three hashes, complete legacy
report/renderer/index/parser/validator/reason controls, 21 command exits/stdout hashes,
and raw hashes for all 1,433 pre-change tracked paths. Current protection covers
1429 paths; the four already-existing editable paths have attributed deltas.
Protected paths are also checked against the entry's Git diff and inventory.

## Positive, negative and historical controls

Actual product APIs executed 4 complete controls and 81 boundary/preservation/falsifier
controls, each replayed three times with fresh receipts:

- New I09 complete basis: SUPPORTED for byte equality; sole-producer custody is not upgraded.
- New I10 complete basis: SUPPORTED for byte equality; independence and acceptance unchanged.
- Explicit non-ASCII octets E8 AF 81 E6 8D AE: SUPPORTED; measured length 6 versus 2 UTF-16 text units. The base64 characters are not the hash subject.
- New complete I08 mismatch: UNSUPPORTED; declared zero digest and actual recomputation both retained.
- I06/I07/I08/I09/I10/I15/N17.failed/N17.skipped: exact complete historical output equality with no receipt; all historical integrity claims remain UNRESOLVED. H30 remains REJECTED. Label-only references are not upgraded.
- Forged/plain/copied/serialized receipts, match/observed-digest labels, test expectations, reference labels, verification.passed and T2-01 substitutions remain inert. Receipt mutation throws; nested evidence is frozen.
- Cross-claim/path/member/representation/domain/subject/revision/scope/time/evaluation-time/method/source/length/registry and requirement-context reuse reproduces the exact no-receipt output.
- Missing bytes/comparison/expected witness/provenance/limitations/checker version, wrong digest/member/input/output associations, missing/wrong algorithm, wrong method, uppercase digest, invalid/unzoned times and malformed base64 cannot issue a receipt.
- Duplicate/competing expected or comparison witnesses cannot select a passing result by order. Wrong byte counts retain the actual measurement while withholding authority.
- Caller/context obligations named integrity_comparison_basis or integrity.bytes_base64 survive valid matches; Core missing obligations survive match/mismatch. Malformed input and unadmitted Core are rejected before receipt use. Unrelated claims retain identical complete outputs. Composite acceptance requires actual product result identity.

Two initial test assumptions were corrected before acceptance: claim arrays are
sorted, and the existing requirements evaluator records unknown claim identities as
UNRESOLVED with unresolved_identities (rather than rejecting the whole input).
The final control compares this exact historical behavior. No product semantics
were changed to fit those assumptions; failed drafts are not counted as PASS.

## T1 and T2-01 preservation

`node scripts/verify_v8_gate1_product_conformance.mjs --task T2-02 --record`
exited 0. The separately attributed lane replays accepted inputs through actual
admission, requirement, evaluation and composition APIs and compares complete
fingerprints and frozen legacy serialized controls. T1-01/02/03/04 and 603 Core
PASS, including admission failures, requirement unions, six-state behavior,
composition and Core/composed requirement equality.

| Inventory | Executed count | AFTER fingerprint SHA-256, equal to BEFORE |
|---|---:|---|
| t101 | 50 | `bda42af1509046f1bc12f664f989ab9e9375ce40ce8220dd6564119e5dc5efbc` |
| t102 | 13 | `0e2dfda1ea73ae669ec4ea899b5ca35b3299bdfaaf24eac5ef8714c20d1c250d` |
| t103 | 38 | `459710614cea647cec886d3d47d4894d68a72fbbc114439eeed8c4ffd7eced9c` |
| t104 | 46 | `92cf2276a1ffda2cb89d090acc7ff58ca767f9019ac25f0d8f5be49e6e7006e7` |
| core_probes | 603 | `c8cbbb66749144f54d94e4e90e00812f569637261cf34b4b10ed7fff8094eac1` |

T2-01: unchanged 370 annotation assertions and 64 bridge/boundary assertions PASS.
Three replays equal the accepted T2_01_RESULT_HASH:
`4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`.
T2-01 evidence was not rewritten. Every historical verifier assertion and branch
/lifecycle guard is preserved by reversing only the T2-02 dispatch/early-return
additions in memory and comparing the entire original verifier. Existing adapter
prefixes and the state selector/composite owner are also compared exactly.

## Required BEFORE / AFTER regression matrix

R-MESR 7/7, R-ISOLATION 2/2, R-EAK 4/4 and R-PUBLIC 8/8 PASS both before and after.
Every command below actually executed; no inherited row was marked executed.
Full BEFORE hashes and AFTER stdout/source hashes are in the JSON fixtures.

| Command | BEFORE exit | AFTER exit | AFTER stdout SHA-256 |
|---|---:|---:|---|
| `node scripts/verify_mesr_registry.mjs` | 0 | 0 | `27b44de12c3cc1027ed81c4e8428e6cd830e359f4eb73dd46809295807c7dc1f` |
| `node scripts/verify_mesr_reason_bindings.mjs` | 0 | 0 | `f13e72889d28248625bba98d337c232282ea8c0e8e02a311191cc0c3bfe3fac6` |
| `node scripts/verify_mesr_claim_stability.mjs` | 0 | 0 | `1fef93b0bfa4b995441314633581ad8f847e1121b442756100a938be43ac04d4` |
| `node scripts/verify_mesr_composition.mjs` | 0 | 0 | `33c6a9c12419985363611e86616ad95211eeb22019ceac861a32fca35878ff0d` |
| `node scripts/verify_mesr_runtime_portability.mjs` | 0 | 0 | `6246178f816e5f10e4e81b3c156e4a63791c7dbdc68004ef124ed8ce2433b64e` |
| `node scripts/verify_mesr_cross_domain.mjs` | 0 | 0 | `3e42917d3097cdd4bf29107fb5b212ecfa588d01bbe79c208aa569da4fcd5718` |
| `node scripts/verify_mesr_apaai_crosswalk.mjs` | 0 | 0 | `04e4c6016641f575bebc75fffa43ff16f70244cffdd80057cebbebde0922ef9d` |
| `node scripts/verify_v8_runtime_compatibility.mjs` | 0 | 0 | `34a498b6d7c488b46053e85d8d4a57a1ab7832801764158d9375f552b76e751a` |
| `node scripts/verify_v8_institutional_artifact_readiness.mjs` | 0 | 0 | `f89984210010f4db5ce739108a2097e12cfa274d6cdc2f13987386002b1b7641` |
| `node scripts/verify_evidence_assurance_kernel_poc.mjs` | 0 | 0 | `4e135771af995ec5035f1c95804e2ac34aa8b94e801fac9fa352f5adb2ecd0ea` |
| `node scripts/verify_external_evidence_local_normalization_fixture.mjs` | 0 | 0 | `699fa082797809571aa5dd440d3f8d359281a0a44adb664fc9b97e0d8bfc96ec` |
| `node scripts/verify_external_evidence_local_assurance_report_fixture.mjs` | 0 | 0 | `93e939d24d0006b043e20980545c243107914a4dbb41512fd840c41ae942ef6a` |
| `node scripts/verify_external_evidence_local_assurance_composition.mjs` | 0 | 0 | `82b82c12ed97f1edad3fb052553ca57fea860165e17bf023c623b78cdaf334f0` |
| `node scripts/verify_governance_surface.mjs` | 0 | 0 | `7c1d3bb409f69f4612e79fe28e180853827878f0b3c1befb820a732e7f40b214` |
| `node scripts/verify_governance_consumption_profile.mjs` | 0 | 0 | `d4fe7972b1ac55432ace076b56327359f397e29d6c15440e739711f0f7b74b68` |
| `node scripts/verify_audit_permit_gate.mjs` | 0 | 0 | `38d6221a05780f8374657a75016e926810175d298f584e058b066864ddb83357` |
| `node scripts/verify_v7_0_example_evidence_pack.mjs` | 0 | 0 | `1a7fe24a57cdd5eefd694b70b3aa7ff5336948affbb4aa98f7ec56fdaaee09f3` |
| `node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs` | 0 | 0 | `6fb02dcce1495a16a65ccf48ccc09e02ac69c4f34f31d033e68387da63ba7dd2` |
| `node scripts/verify_v7_0_1_public_surface_consistency.mjs` | 0 | 0 | `d88d8e12e3852a64c502aa2e0dc60c5c64d9d91da44add8f882dd1eca43b3f10` |
| `node scripts/verify_v7_0_1_current_docs_baseline.mjs` | 0 | 0 | `5eda00a3e7b6febb1493287ffd926237fb2ed1e795ff33668b38bed6d1a06c07` |
| `node scripts/verify_v7_0_1_github_action_first_report.mjs` | 0 | 0 | `e1be24a7741f4f0b97ff4d17fed78690e06f7d22f7c363129a50317157b5b38d` |

The exact eight paths were staged before the unchanged public verifier, which
checks worktree/index metadata. This preserves its existing scope assertions.
Staging did not imply acceptance. Source hashes below remained unchanged during
the complete successful AFTER run; subsequent changes only close result/evidence
receipts. Index/worktree fidelity is checked before commit.

## Deterministic accepted result

Hash domain: the canonical serialization of semantic_results (outputs, comparisons
and process-local controls), using the existing verifier digest helper. Receipt
identity, memory addresses, process IDs and sampled time are absent.

| Replay | T2_02_RESULT_HASH |
|---|---|
| 1 | `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5` |
| 2 | `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5` |
| 3 | `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5` |

Three additional fresh Node processes each executed the same complete T2-02
semantic controls once, with fresh module-private receipt maps, and exited 0 with
that same hash. Command: `node %TEMP%/guard-t202-replay.mjs --task T2-02`.
Worker SHA-256: `832e7f3fa77c452779de6cbd81a9d1c4f31b048c23349d80e5da651eaf001133`.
The worker is the existing verifier with absolute import/CWD resolution, a single
run() instead of the three in-process repetitions, and an early return before
T2-01/large suites. It substitutes no assertions or product implementation. The
portable reproduction is the committed T2-02 command; it runs all three in-process
replays, and its post-commit mode also proves the same deterministic hash.

## Source and contract closure

| Accepted source path | Raw SHA-256 |
|---|---|
| `packages/guard-core/src/mesr/repaired/integrity.ts` | `5a27b6421f472f269d61ba95a14fbf20d4da46a38cb9c8f3e7a348c0dc230299` |
| `packages/guard-core/src/mesr/repaired/evaluateClaim.ts` | `dcae3fce1502937297cc566e636b0af56e629abf16c9e04ff4d79137667390b9` |
| `scripts/verify_v8_gate1_product_conformance.mjs` | `d4cb58dc0c7c0ab2eeab12b64d2b76721ff3efefccb8398527ef68ada75eb912` |
| `scripts/gate1/b09-product-inputs.mjs` | `1a6622ad7bbd3a54cf9a33c4ca754eb44b75fe2aab985c0343d4163295e0a557` |
| `scripts/gate1/b09-product-compare.mjs` | `429db61bdd49c9ac4714f8d009936d5a854953f7286cd2ee06d03e5e08303ef9` |

- PUBLIC_CONTRACT_DRIFT = NO.
- AUTHORITY_EXPANSION = NO.
- NEW_REGRESSION = 0.
- EvidencePackV1/parser/validator behavior, GovernanceReportModel and serialized report/Markdown/HTML/index bytes, reason-code values/order and public exports unchanged.
- Audit output/verdict/exit, deny exit code 25, permit/classify, license gating/offline authority and v7.0.1 defaults unchanged, supported by the required regressions and protected implementation hashes.
- Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion or control-plane/dashboard/orchestration drift.

## Commit and post-commit closure protocol

The implementation is eligible for one commit only after this PASS decision and
`git diff --check`, `git diff --name-only`, `git status --short`, staged-content
fidelity and exact eight-path checks. Its resulting SHA is reported as
T2_02_IMPLEMENTATION_COMMIT in the task completion record; it cannot be embedded in
its own committed bytes. No historical commit is amended.

The T2-02 verifier permits PRE_COMMIT_IMPLEMENTATION only at the exact entry HEAD
with the eight-path pending allowlist. POST_COMMIT_ACCEPTED_IMPLEMENTATION requires
one direct child of the entry, exactly the eight committed paths and a CLEAN tree.
Lifecycle falsifiers reject a later descendant, merge parent, ninth path and dirty
committed state. From that clean commit, run the same T2-02 command without
--record: it rechecks the semantic controls, both task hashes, legacy public bytes,
protected sources and lifecycle. Large T1/Core/21-suite results are explicitly
inherited from the accepted unchanged receipts, not falsely marked rerun.
The actual post-commit outcome and commit SHA are recorded in the final task report.

## Remaining gaps and rollback

T2-03 still owns verifier/principal separation, common-control/conflict facts,
verifier independence and custody independence. G03 still owns truthful Harness
integration into canonical EvidencePack. Neither is started or claimed closed.
G05 remains OPEN until its remaining subtask obligations close.

Rollback/review is required if normalized bytes replace exact octets, mismatch
passes, expected reference provenance is missing, authority expands, historical
no-receipt/public behavior drifts, or protected paths/acceptance proofs fail.
Any reviewed revert is limited to this bounded implementation; preserve historical
B09/T1/T2-01/external-review evidence. No automatic destructive action is introduced.
