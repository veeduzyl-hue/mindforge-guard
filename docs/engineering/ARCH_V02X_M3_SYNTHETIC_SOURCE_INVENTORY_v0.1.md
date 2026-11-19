# Architecture v0.2.x — M3 Track A Synthetic Source Inventory candidate v0.1

**Engineering scope:** M3 SELECT → INVENTORY only. Standalone local experimental script, **not** the public `guard review --source` route, not M3 Source Onboarding generally, not a new Evidence Contract, and not any independent Assurance.
**Date:** 2026-11-19 UTC+08. **Fixed source parent:** PR #371 HEAD `adb43e60a71729c5fab4ac8e1804804bc8d10038`, intentionally **not** PRs #372–373 that concern delayed code signing. **Authorized boundary:** isolated, synthetic-only engineering, no main merge or release.

## 1. Governing M3 v0.1.1 contract

Source Inventory v0.1 is a **working artifact** only. M3 describes explicit SELECT → INVENTORY (file enumeration, structural source-kind classification, byte digests, source scope and sensitivity), then DISCOVER → DRAFT → REVIEW → CONFIRM → BUILD → VALIDATE → PACKAGE, with human confirmation on authority/policy/intent. **Only the first two stages are candidates here.** Existing First Report Pack is the only public-compatible target; all other contracts stay outside scope.

M3 v0.1.1 design forbids implicit current-working-directory scans, default recursion, network/telemetry/secret collection, path escapes or source copies. Sensitivity defaults to **unknown**, redaction to **not_assessed**, source SHA-256 proves bytes observed rather than source authenticity. PDF/images/binary and unknown extensions are **inventory_only**, without semantic extraction.

## 2. Bounded candidate source identity

- `scripts/arch_v02x_m3_source_inventory_synthetic.mjs` runs as an independent Node script, does not add flags/modes to Guard and has no npm pre/postinstall hook.
- Invocation requires an absolute `--source` path, `--target-contract first-report-pack`, `--format json`; an explicit environment opt-in `ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY=1`, and a **separate, disposable synthetic fixture root** carrying the exact marker file `.ARCH_V02X_M3_INVENTORY_SYNTHETIC_ONLY` with content `ARCH_V02X_SOURCE_INVENTORY_SYNTHETIC_ONLY` plus newline.
- The selected file/directory must be **inside that marked root**; no arbitrary actual user documents or Pack ingestion is admitted. Unmarked, relative, outside-root, symlink, path traversal and unsupported target inputs fail closed. Directory imports only top-level files; nested directories including `evidence/` are **not traversed**, with skipped count disclosed.
- Excludes `.git`, `.mindforge`, `node_modules`, `dist`, `build`, `.ssh`, `.env*`, common private-key names/extensions, hidden dotfiles and other build outputs; excluded files are not read, hashed or copied.
- Fixed **experimental**, not contract-frozen limits: 32 top-level entries, 4 MiB/file, 16 MiB cumulative source bytes. Oversize, unsupported-only, malformed/duplicate arguments and identity-change conditions fail closed. General production race-proof source capture and hardlink/reparse/junction coverage are **not established**.
- Output only to stdout, no new local working artifact persisted by the inventory script. Output includes opaque `source_###` identifiers, format class, byte count, exact content SHA-256, sensitivity `unknown`, redaction `not_assessed`, and inventory-only limits; **no** source content, environment, secrets, absolute host paths, or file names/relative locators by default. Private source locator mapping is a separately unimplemented feature.
- JSON `kind=mindforge_source_inventory`, `version=0.1`, schema **illustrative and candidate only**. Do not introduce as a canonical public Schema, API, EAK object or executable permission.

## 3. Synthetic-only demo

Use the bounded CI script `node scripts/verify_arch_v02x_m3_source_inventory_synthetic.mjs` on this branch. It creates its **own** newly marked disposable temporary root, copies the already committed synthetic HR sample and exercises source exclusion, exact hash, symlink refusal when supported, caps, Unicode, negative CLI and no-leak rules. It removes **only** that fresh test fixture, not actual customer evidence.

The standalone inventory script can be called only against that created synthetic fixture, not a real user directory. This is intentional until source data security and user confirmations are separately authorized. No profile, signing key or Azure resource is needed.

## 4. Test boundaries and source-record discipline

New test IDs are `M3I-01..M3I-15`; these are **not** the original M4 test IDs. All original **62** M4 acceptance scenarios remain `NOT RUN` pending exact scenario execution under a separate accepted plan. This candidate can be used as **supporting** evidence for future M4 `REL-05/REL-06/BND-01/BND-02/BND-07`, but cannot silently close them: those scenarios also cover full onboarding and Bundle behavior beyond this inventory prototype.

The binary `source_sha256` is not a producer attestation or independent signer proof. Data minimization test success is not a comprehensive sensitive-data leak proof. Windows junctions, arbitrary hostile concurrent filesystem changes, real-world parsing, original schema/EAK, actual personal data, M5 human sessions and paid Edition projection are not tested.

## 5. Next authorized engineering sequence (proposal, not automatic authorization)

After Owner accepts the bounded inventory fixture results, develop **DISCOVER/DRAFT** as a separate human-reviewable, versioned draft with exact field provenance (JSON Pointer/JSONL line/Markdown range). Authority, permissions, business owner and redaction classifications must remain **unconfirmed** until human review. Then separately design REVIEW/CONFIRM before any output canonical Pack build or integration into `guard review --source`. Do not silently synthesize authority or identity from observed tool calls.

## 6. Preserved product and governance gates

```text
ARCH_V02X_M3_SOURCE_INVENTORY=EXPERIMENT_ONLY
TRACK_A_DISCOVER_DRAFT_REVIEW_CONFIRM=NOT_IMPLEMENTED
M2_PUBLIC_SOURCE_ROUTE=NOT_AUTHORIZED
SIGNED_ADDON_DISTRIBUTION=DEFERRED_NOT_ESTABLISHED
WIN11_X64_SIGNED_NATIVE_POSITIVE=NOT_RUN
OR_01_TO_05=UNCHANGED
M4_ORIGINAL_62=NOT_RUN
M5_HUMAN_FIRST_USER=NOT_TESTED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
NO_SCHEMA_OR_LICENSE_CHANGE
```

**Stop boundary:** prototype source fixture only, no background fetch, no release, no actual Source Onboarding, no customer or real Pack import, no runtime signing, no authority expansion.
