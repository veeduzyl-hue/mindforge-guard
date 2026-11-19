# MindForge Guard Architecture v0.2.x — M3 REVIEW → CONFIRM v0.1

**Scope:** strictly bounded **synthetic-only**, standalone M3 Track A stage candidates. Original source authority: M3 Evidence Onboarding & Review Bundle Contract **v0.1.1**, §§ 5, 6.2, 6.3, 7.1–7.2. Fixed engineering parent: PR #375 at `8a9af158eb9966123df84d22a2ff5093faa47ecb`. Status: **CANDIDATE / NOT A FROZEN PRODUCT CONTRACT**.

## 1. What REVIEW and CONFIRM actually do

SELECT/INVENTORY from PR #374 and DISCOVER/DRAFT from PR #375 remain the only data-source readers. The new `scripts/arch_v02x_m3_review_confirm_synthetic.mjs` delegates to those fixed modules: every review call therefore reruns the inventory validation, source-byte digest checks and bounded structural discovery from an explicitly marked **temporary synthetic fixture**. Review exposes source references, source digest, JSON Pointer/line number, candidate target, proposed semantic class, field state, uncertainty/loss notes and an exact SHA-256 fingerprint of the **canonical structure** (excluding random per-invocation IDs and timestamps).

REVIEW accepts `--format json|text`; it never loads a decision file and emits only unconfirmed fields. The resulting `status=REVIEW_REQUIRED_UNCONFIRMED` is not a governance verdict. `review` writes **no output file**; a human must actively inspect any original source outside this tool if values need review, because this deliberately does not reveal them.

CONFIRM accepts an **explicitly authored, separate, synthetic-only decision file**. It must be located under the same marked temporary fixture root but outside the selected source directory/file, with exact name `mapping-decisions.synthetic.json`. This file is a local test fixture, not a real user identity credential or approval. One `confirm|reject|defer` choice is required **for every mapping item**, with a finite review basis and finite note-code vocabulary; no free-form reviewer PII, secret, arbitrary text or unreviewed notes are accepted. No default confirmation and no silent omitted mapping.

Every `confirm` requires `basis=source_reviewed` but the **truthfulness of that statement is not independently witnessed**. An `ambiguous` target can only be deferred in v0.1; the engine cannot silently select a winner, even if its synthetic decision file attempts to confirm or reject. A `defer` must have `basis=not_confirmed`. Rejection is an explicit local decision, **not** a negative governance verdict or independently validated field fact.

CONFIRM emits a **proposed working artifact**, `kind=mindforge_mapping_confirmation`, `version=0.1`, with `mapping_id`, `confirmed_at`, a list of `mapping_item_id`, `decision`, `reviewer_label`, `reviewer_role`, `basis` and `notes`, plus `identity_assurance=not_verified` and `organizational_authority=not_established`. It deliberately adds `record_class=SYNTHETIC_FIXTURE_DECISIONS_NOT_REAL_HUMAN_WITNESS` and `verified_actor_identity=NOT_ESTABLISHED`. This is **not** an authenticated human session, producer attestation, institutional acceptance, execution permission, legal signature or independent Assurance.

## 2. Normalized input contract

All three explicit env gates must be `1` and the Inventory fixture root must be an **absolute, specially marked** newly-created synthetic directory:

```text
ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY=1
ARCH_V02X_M3_DISCOVER_SYNTHETIC_ONLY=1
ARCH_V02X_M3_REVIEW_SYNTHETIC_ONLY=1
ARCH_V02X_M3_INVENTORY_FIXTURE_ROOT=<ABSOLUTE_NEW_SYNTHETIC_ROOT>
```

With a separately prepared copy of the already-committed **synthetic** HR First Report example inside that root, run:

```shell
node scripts/arch_v02x_m3_review_confirm_synthetic.mjs --mode review --source <ABSOLUTE_SYNTHETIC_SAMPLE_DIRECTORY> --target-contract first-report-pack --format json
node scripts/arch_v02x_m3_review_confirm_synthetic.mjs --mode review --source <ABSOLUTE_SYNTHETIC_SAMPLE_DIRECTORY> --target-contract first-report-pack --format text
```

Use the JSON `draft_fingerprint_sha256`, `source_digest_set_sha256` and exact `mapping_item_id` set, obtained from that same synthetic REVIEW output, to prepare this **illustrative, incomplete template** outside the selected source folder but inside the marked fixture root. Never copy this incomplete template into production:

```json
{
  "kind": "mindforge_mapping_confirmation_request_synthetic",
  "version": "0.1",
  "draft_fingerprint_sha256": "sha256:<64 lowercase hex from REVIEW>",
  "source_digest_set_sha256": "sha256:<64 lowercase hex from REVIEW>",
  "reviewer_label": "synthetic_reviewer",
  "reviewer_role": "review_owner",
  "synthetic_acknowledgement": "SYNTHETIC_MAPPING_REVIEW_ONLY_NOT_IDENTITY_OR_AUTHORITY",
  "decisions": [
    {"mapping_item_id": "mapitem_001", "decision": "defer", "basis": "not_confirmed", "notes": ["synthetic_value_not_validated"]}
  ]
}
```

The example has **only one decision and must be expanded to every reviewed mapping ID** or it fails with `EXPLICIT_DECISION_REQUIRED_FOR_EVERY_MAPPING`. Permitted reviewer roles: `workflow_owner`, `technical_owner`, `review_owner`, `other`. Allowed note codes only: `synthetic_checked_structure`, `synthetic_value_not_validated`, `synthetic_conflict_unresolved`. The reviewer label is deliberately the non-PII literal `synthetic_reviewer` in this candidate.

```shell
node scripts/arch_v02x_m3_review_confirm_synthetic.mjs --mode confirm --source <ABSOLUTE_SYNTHETIC_SAMPLE_DIRECTORY> --target-contract first-report-pack --format json --confirmation-file <ABSOLUTE_SYNTHETIC_ROOT>/mapping-decisions.synthetic.json
```

**Never run these commands against actual documents, credentials, historical Guard source directories or customer files.** The sample test driver automates disposable fixtures without asserting that a human was present.

## 3. Exact failure-closed contract

Missing synthetic gates/source marker, wrong mode, duplicate or unsupported flags, unapproved target, an off-root or symlinked decision file, a decision file within selected evidence sources, malformed/oversized/non-UTF-8 JSON, unexpected request fields/free-text notes/PII, missing/duplicate/unknown mapping ID, invalid role/decision/basis, attempted ambiguous mapping acceptance and stale fingerprint/source digest **must BLOCK** with exit code `24` and no partial Confirmation Record.

A decision request is pinned to deterministic Source Inventory digests and complete ordered DISCOVER/DRAFT structure; it is re-evaluated on confirm. Source mutation since review requires a *new review*, not replaying an old confirmation. This is **not** a persistent transaction log. Running confirm twice on unchanged fixtures creates independent transient responses; replay suppression, multi-operator review integrity and inter-process race hardening are NOT IMPLEMENTED.

Both review and confirm are **read-only** as to source and repository and print no original values or arbitrary comments. Synthetic test harnesses may create and remove only their own disposable fixture directories. No stored mapping transaction, UI identity verification, independent signing key, cloud audit, authorization or telemetry exists.

## 4. Hard human-confirmation gates retained

M3 §§ 6.3, 7.1–7.2 are controlling: intended task and success criteria, allowed/prohibited actions, authority, policy and control objectives, all Owner roles, data sensitivity/retention, expected versus observed behavior **cannot be inferred from a trace or a selected mapping**. The output always records `hard_confirmation_fields_satisfied=0`, `hard_confirmation_fields=NOT_CONFIRMED`, `identity_assurance=not_verified`, and `organizational_authority=not_established`. Tool usage in JSONL is observation, not permission. Source SHA-256 proves bytes, not authenticity.

Reviewing the mapping of `tools.yaml#/tools/0/tool_name` only means the syntactic field location was locally selected; it does **not** make the tool permitted, certified, safe, trusted or operational.

## 5. Test and acceptance status semantics

New test IDs: `M3RC-01..M3RC-26`, separately from PR #374 `M3I-*` and PR #375 `M3D-*`. CI must run Guard v7.0.1 regressions, both predecessor suites, then this suite on Linux x64 and Windows Server 2022 x64. Expected checks: REVIEW JSON/text disclosure, all three decision actions, all-defer, missing or duplicate coverage, stale binding, reviewer PII/role and note-code refusals, ambiguity, out-of-scope/symlink decision input, bad JSON, modified source and no repository mutation. Report `NOT_TESTED` (never PASS) if a Windows host cannot construct a symlink fixture.

Original **M4 62** compatibility cases remain `NOT RUN` regardless of passing synthetic M3RC tests. **M5 real Human First-User** remains `NOT TESTED`. A synthetic selection is *not* proof that any human actually reviewed an item. No public CLI route or source data trust claim is approved.

## 6. Next stage is BUILD/VALIDATE/PACKAGE — separately gated

Only after distinct Owner review may a next engineering scope use a complete and appropriately reviewed Confirmation Record to construct a contract-specific draft Pack and invoke the existing validator. This v0.1 implementation **does not** build a Pack, write a Review Bundle or grant any review/production acceptance. Multi-role identity proof, human workflow UX, field-level confirmation of actual values, secure replay log, reliable native install and cross-Edition parity remain open.

## 7. Explicit retained boundaries

```text
M3_REVIEW_CONFIRM=ISOLATED_SYNTHETIC_ONLY
REAL_HUMAN_REVIEW_WITNESSED=FALSE
REVIEWER_IDENTITY_ASSURANCE=NOT_VERIFIED
ORGANIZATIONAL_AUTHORITY=NOT_ESTABLISHED
BUSINESS_OR_POLICY_CONFIRMATION=NOT_PERFORMED
CANONICAL_EVIDENCE_PACK=NOT_GENERATED
REVIEW_BUNDLE=NOT_GENERATED
M2_PUBLIC_SOURCE_CLI=NOT_AUTHORIZED
M4_ORIGINAL_62=NOT_RUN
M5_REAL_HUMAN_FIRST_USER=NOT_TESTED
SIGNED_ADDON_DISTRIBUTION=DEFERRED_NOT_ESTABLISHED
WIN11_X64_SIGNED_NATIVE_POSITIVE=NOT_RUN
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
OWNER_ACCEPTANCE=PENDING
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
NO_AUTHORITY_EXPANSION
```

Stop at a Draft PR awaiting separate Owner acceptance. This feature is an experiment, not a released Guard user feature.
