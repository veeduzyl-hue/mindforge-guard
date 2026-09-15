# Gate 1 Change Control Contract

Status: **MANDATORY_FOR_ADMITTED_INTERNAL_TASKS**, 2026-09-16. Authority: [B10 decision](20_B10_FINAL_GATE_REVIEW.md); scope: [enumerated task cards](21_GATE1_IMPLEMENTATION_PLAN.md). B10 itself performs no implementation and commits nothing.

## 1. Entry record for every task

Before edits, record:

| Required field | Rule |
|---|---|
| task_id / tranche / gap_ids | One narrow obligation from the admitted plan; no unrelated semantic gaps |
| pre_change_HEAD / branch / repository | Exact commit and clean or explicitly accounted-for scoped tree |
| rollback_point | Exact known-good commit; preserve its evidence |
| file_allowlist | Expand every exact product/test/evidence path; no directory wildcard |
| contracts / facet admission | Pinned B00-B08 sources, canonical anchors/version/digests, requirements/nonclaims and named predicates |
| B09 basis | B09_COMMIT, oracle version/hash, freeze bytes, relevant case IDs and asserted fields |
| before_result | Actual product observation before change; retain missing/unimplemented outcomes without pretending to have repaired conformance |
| regression baseline | Exact selected existing commands/exits and old byte controls; failures explained before implementation |
| compatibility review | Every protected surface and each migration answer from B10 |
| authority review | Every invariant in section 3; no newly inferred authority |

Initial known-good B09 commit: `a646f2b4576336321eda696c7dc2ee02749cadb2`. Byte-policy commit: `91f4a0c6b32d198e38531afb01c67f704c213733`. Future task records must use their actual reviewed pre-change HEAD, not silently reuse B09 after other changes.

## 2. Verification and completion record

1. Execute relevant B09 cases against actual new product code through the independently reviewed product differential harness. Preserve all negative input mutations and compare every task-owned assertion. A frozen-reference-only PASS is not product repair.
2. Execute existing regression suites selected in the task card before and after changes. Add default-off import checks and unchanged legacy JSON/MD/HTML/index/verdict controls. Test both positive complete basis and negative missing/false/empty/unknown/prohibited cases. Unexpected exceptions are ERROR, not rejection PASS.
3. At tranche exit execute the complete admitted case/probe set and three deterministic product replays; retain exact result hashes. Intermediate cases with pending outputs remain explicitly partial.
4. Record post-change source HEAD when committed later, or exact worktree source digests while uncommitted; input/oracle/method versions and hashes; before/after outputs; selected case IDs and assertion fields; commands/exits; changed and remaining gaps. Never invent a commit for uncommitted work.
5. Inspect `git status --short`, `git diff --stat`, `git diff --check`, `git diff --name-only`, `git diff --cached --name-only` and `git ls-files --others --exclude-standard`. Check untracked files separately; ordinary diff omits them. Every changed path must be in the task allowlist.
6. Perform public-surface diff review, compatibility review and authority review independently of test PASS. Confirm source/exports/default callers and byte controls, not just a flag named default_off.
7. Retain a task evidence record, a reviewed rollback point and a completion decision. A failure or partial result remains evidence; do not rewrite it to look like a pass. Scope drift requires a new bounded admission before dependent work.

The plan defines exact regression commands and proposed product test paths. Those commands are future implementation requirements, not B10 execution claims. No task combines unrelated gaps or opportunistic cleanup; no broad refactor, version bump or release action.

## 3. Compatibility and authority invariants

Preserve EvidencePackV1 1.0.0, parser/validator behavior, all 56 reason serialized values and ordering/emission, GovernanceReportModel 1.0.0 and allow/require_review/inconclusive/block rules/wording, renderers/index, public CLI/SDK/JSON/Node support, audit output/verdict/exit, deny exit 25, permit/classify, licensing/offline authority and current v7.0.1 buyer/install/demo semantics.

Every task is ADDITIVE, DEFAULT_OFF, INTERNAL_API_FIRST and VERSIONED_SIDE_ARTIFACT. Existing MESR/EAK five relations, CB-22, PoC statuses and snapshots remain unchanged. New product modules must not import/copy the B09 engine or hide a second registry/evaluator. One canonical new side-state owner is shared by all admitted modules.

```text
Evidence != Authority != Execution
Identity != Authority
Capability != Authority
Access != Authority
Authority != Commitment
Execution Success != Verification Passed
Verification Passed != Independent Verification
Independent Verification != Acceptance
Evidence Sufficient != Institutional Acceptance
Guard allow != Runtime ALLOW
Guard allow != Evidence Sufficient
Acceptance Authority != Execution Authority
Historical Validity != Current Standing
Producer != Verifier
Verifier != Governance Authority
Governance Authority != Acceptance Authority
```

Harness is an Evidence Producer, not Verifier Authority, Governance Authority or Acceptance Authority. Missing owner/authority/scope/time/provenance/custody/verification/integrity remain missing or unresolved; invalid canonical closure rejects according to B03. No adapter fabricates facts, treats an unchecked digest as integrity, or calls EAK/report after missing/rejected closure. No autonomous blocking/approval, execution authorization, control plane, orchestration, IAM replacement, legal determination, certification, audit opinion or regulatory approval. Auxiliary admission rejection withholds an artifact; it does not control an action.

### Explicit reference/runtime separation

`VALIDATION_ONLY_REFERENCE_EVALUATOR != PRODUCT_RUNTIME`.

`VALIDATION_ONLY_REFERENCE_EVALUATOR != CANONICAL_PRODUCT_RUNTIME`.

Packages must not import scripts/b09, copy its reference logic wholesale or depend on frozen validation scripts for product behavior. Product modules independently satisfy the same contracts and frozen B09 oracle. They reuse the one canonical side-state substrate defined in the plan; no second hidden MESR semantic engine is admitted.

## 4. Freeze and byte continuity

B09 oracle, fixtures, scripts, historical results/observations, replay records and `tests/fixtures/experiment-3-repaired/freeze.v0.2.json` remain byte-identical. B00-B08 contracts, Experiment 2B and delivered historical review evidence remain immutable. The manifest's historical HEAD remains historical. Preserve the narrowly scoped `.gitattributes` policy without broadening it in B10.

```text
ORACLE_HASH = 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88
FINAL_RESULT_HASH = 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560
```

For new evidence, specify representation/encoding/line endings, byte length, exact digest domain, source provenance, evaluation/reliance times and immutable input references. Measure both worktree bytes and raw Git blobs before claiming committed persistence. A write/re-serialization/line-ending transformation is a new representation; never silently inherit the old digest. Preserve semantic, provenance, temporal and artifact-byte continuity. This requirement authorizes no new product feature or broad byte-policy rewrite.

The frozen runners pin old source and observations as well as expectations. Keep historical reproduction separate from new product conformance records. Do not remove source pins, update frozen observations or use write/capture/authoring flags to make a new implementation appear compatible. A separately authorized future source change may require historical reproduction in an isolated pristine B09 checkout; this is evidence separation, not permission to change the oracle.

## 5. Stop, reopen and rollback

- **SPECIFICATION_REOPEN_REQUIRED:** Actual contradiction/defect in the frozen specification or oracle. Stop affected implementation, capture exact failing input/expected/observed results, contract references and impact. Do not silently patch B00-B08/B09.
- **COMPATIBILITY_MIGRATION_REQUIRED:** Proposed old schema/enum/API/CLI/report/default-path migration. Exclude from Tranche 1 and return for a separate migration/consumer decision; no migration is currently necessary or admitted.
- **Freeze mismatch:** Preserve the mismatching bytes and diagnostics; stop dependent acceptance. Never refreeze or replace expected hashes in place.
- **Unexpected regression or authority expansion:** Stop the task; preserve evidence; repair within the admitted new-file scope or use reviewed rollback. Do not reinterpret the failure as an expected old gap.
- **G03 missing facts:** Keep canonical output absent/unresolved or rejected. Dossier preparation may continue; actual integration remains unadmitted until its factual/test/allowlist entry passes separately.

A future oracle revision must have a new oracle version, new freeze manifest and explicit supersession record explaining the defect, changed expectations and compatibility impact; preserve the predecessor bytes/results. No fifth reconciliation verdict, sixth gap category or seventh primary state is introduced.

Rollback is a reviewed revert/removal of only the newly admitted side paths and callers, to the recorded known-good boundary. No reset/rebase/stash/clean, destructive cleanup, historical artifact deletion or authority transfer is implied. Preserve all evidence even when implementation is withdrawn.

## 6. Engineering admission is not release

GATE1_IMPLEMENTATION_READY != V8 RELEASED. This contract authorizes no public V8 launch/tag, new edition/pricing, MESR standard, EAK production-service, universal interoperability, compliance/regulatory assurance or marketing claim. No automatic commit, merge, tag, release or package publication. Commercial baseline stays v7.0.1; internal V8 remains unreleased.
