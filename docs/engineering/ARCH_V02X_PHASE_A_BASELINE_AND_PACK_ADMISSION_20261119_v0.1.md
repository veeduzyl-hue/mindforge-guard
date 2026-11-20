# Architecture v0.2.x — Phase A baseline and isolated Pack admission receipt v0.1

**Date:** 2026-11-19 (UTC+08)  
**Work:** ARCH-V02X-PHASE-A-20261119  
**Evidence class:** repository-source readback + pre-existing bounded CI receipts + Owner-directed design documents; no new execution  
**Decision:** `PHASE_A_BASELINE_REVIEW=COMPLETED_WITH_EXPLICIT_GAPS`  
**Engineering gate:** `ISOLATED_SYNTHETIC_PACK_ONLY=OWNER_AUTHORIZED_FOR_BOUNDED_EXPERIMENT`  
**Product gate:** `PRODUCT_IMPLEMENTATION_AND_RELEASE_ADMISSION=HOLD`

## 1. Identity and governing boundaries

| Object | Identity / disposition |
| --- | --- |
| Current GitHub main at this review | `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c` (PR #351 merged; main source package identifies `7.1.0-rc.0`; not evidence of npm release) |
| Public installed release comparison | `@veeduzyl/mindforge-guard@7.0.1` per M5; no fresh npm registry/installation check in Phase A |
| Architecture | v0.2.1 `ACCEPT_WITH_CONDITIONS`; v0.2.2 `DOCS_ONLY_BASELINE_CANDIDATE`, **not** Owner-frozen implementation contract |
| M2/M3 | v0.1.1 detailed design, Owner-directed; no general runtime admission |
| Owner directions | OD-01 through OD-07 accepted on 2026-11-06; acceptance does not close runtime gates |
| M4 | v0.1.1, 62 proposed tests, all `NOT RUN` as M4 scenarios |
| M5 | `PARTIAL_PASS`; human first-user `NOT TESTED`; real customer workflow `NOT TESTED`; product readiness `NOT READY` |
| Existing I-1 implementation baseline selected for reuse | PR #364, branch `experiment/i1-win-default-fail-closed-20261112`, fixed head `2ef69b61971b54d9366be5b7fa1ea6d2a05927f8`; **Draft**, not merged to main |
| T2/S04/G03 | `T2_FORMAL_CLOSURE=BLOCKED`; `S04_FACTUAL_ADMISSION=UNRESOLVED`; `G03_IMPLEMENTATION=FROZEN`; unchanged |

The Phase A review reconciles these different identities; it does **not** describe PR #364's real Writer as part of `main`, and it does **not** attribute the PR #364 Windows CI results to this later derivative commit.

## 2. What is already implemented vs. what remains proposed

The bounded I-1 candidate provides `guard review --pack <existing> --out <new> [--format text|json]`, an in-memory Pack snapshot, existing Pack Validation and Single-Agent Report composition, a local Review Bundle, manifest, checksums, and separate native Pack exit-status retention. Its First Report scope is smaller than the full future M2/M3 design. Existing I-1 tests, Windows ACL PoC, and independent receipt-vault experiments are different evidence objects.

Do not reimplement the I-1 Bundle Writer. Candidate reuse is only within the same isolated branch lineage and only after new fixed-head verification. The original Linux/macOS Writer protections remain bounded; Windows Server 2022 / Windows 11 ARM64 synthetic ACL results do not establish Windows 10, Windows 11 x64, signed native addon distribution, independent custody, or customer-data admission.

## 3. OR-01 through OR-05, exact closure criteria and scoped disposition

| Gate | Global status | Minimum closure evidence | Pack-only experimental treatment |
| --- | --- | --- | --- |
| OR-01 Audit side effects | **OPEN** | Exact Side-effect Ledger, consent before any Audit or migration, unchanged sources and no writes before consent | Repo/Audit route **OUT OF SCOPE**. Pack writes only explicit new output path; verify no source mutation, no hidden writes |
| OR-02 Analytics cut | **OPEN** | Pre-Audit historical cut, per-component timestamps/watermarks, exclusion of current event | Repo analytics **OUT OF SCOPE**; no Timeline/Compare/Correlation |
| OR-03 Edition transparency | **DESIGN DIRECTION ACCEPTED / RUNTIME OPEN** | Cross-Edition equality for material facts, limitations, redactions and gaps | No paid components or Edition-specific filtering in Pack-only path. Does **not** close multi-Edition parity |
| OR-04 Bundle data handling | **OPEN / SECURITY HOLD** | Source-ref/digest default, path containment, no symlink escapes, no raw source copy, controlled partials, atomic/no-overwrite publication, sensitive output handling, retention unknowns | Reuse existing I-1 hardening; add user-facing pre-share sensitivity disclosure; keep Windows default-deny, no real input, no automated cleanup or false custody |
| OR-05 Exit taxonomy | **OPEN** | Distinguish Policy configured hard-block, License 21, Permit 25; preserve native component exit/status; run compatibility negatives | Pack-only 0/2/3/4; no Policy, Permit, License, `audit`, `classify`, `drift` implementation changes. Whole OR-05 stays OPEN |

All five global OR statuses remain open where stated; passing a subset of Pack tests must not change them. OD-03 atomic/no-overwrite and OD-04 path/allowlist rules are mandatory experimental negative tests, not assumptions.

## 4. Authorized minimal engineering slice — separate from production authorization

**Owner authorization in the 2026-11-19 conversation** approves Phase A and an ensuing **very small, isolated, synthetic-only Pack Review engineering experiment**. It is not a blanket approval of full M2/M3, the public CLI contract, main merge, npm publish or customer use.

**Engineering target:** derive a single isolated branch from fixed PR #364 head; make one additive, human-visible disclosure change to the existing Pack Review summary, explicitly stating that derived Bundle JSON may contain input-supplied narratives/identifiers and must be reviewed before sharing. Keep the existing output/validator/manifest fields and route semantics unchanged. Add a focused regression script to check success/limitation paths on POSIX and Windows default-deny behavior; do not assert unexecuted platform coverage. Add branch-only CI only if required for fixed-head verification.

**No implementation of:** Source Onboarding, interactive mode picker, Repo Review, I-2/I-3/I-4, M2 global CLI grammar, EAK/MESR, new schemas/status enums, paid feature gates, verification authority, telemetry/network, raw data collection, retention deletion, backups, or customer Evidence.

**Stop/fail closed:** arbitrary external inputs, unverified Windows DACL, missing native addon, changed paths/identities, non-atomic publication, output collision, unclear partial/commit outcome, unapproved file changes. Never silently fall back to insecure Windows `mkdir/chmod` staging.

## 5. Evidence expectations and acceptance

- Record exact parent/head SHA, changed paths and commit identity on a separate engineering branch.
- Test: help/usage; invalid option no-output; positive Pack on a permitted **synthetic** POSIX runner; native validation/report status preservation; actual Bundle checksum verification; no raw Pack copy; no input mutation; explicit sensitivity disclosure in text and JSON; Windows default-deny with no Bundle, **not** a Windows product-success claim.
- New fixed-head CI receipts are required before any `ENGINEERING_VERIFIED_BOUNDED` statement. A source review or a previously green parent SHA is not a new-head PASS.
- Original M4 62 cases remain `NOT RUN`; focused I-1/ARCH tests have separate test IDs and must not be mapped silently into M4 PASS.
- M5 human validation and authorized sanitized real workflow are independent release gates; no first-user or commercial claims.

## 6. Excluded downstream actions and stopping boundary

`NO_MAIN_MERGE` · `NO_NPM_PUBLISH` · `NO_GITHUB_RELEASE` · `NO_CUSTOMER_DATA` · `NO_REAL_CLEANUP` · `NO_T2_T3_OR_SEBBI_STATE_CHANGE` · `NO_SCHEMA_OR_LICENSE_CHANGE`.

**Phase A conclusion:** `COMPLETED_WITH_EXPLICIT_GAPS`. The bounded **synthetic engineering experiment** is allowed under the current Owner instruction. The global architecture still requires final Owner baseline acceptance, OR runtime evidence and M5 human feedback before product integration, support claims or release.

## 7. Traceability

- Architecture v0.2.2, M2 v0.1.1, M3 v0.1.1, M4 v0.1.1, M5 v0.1: Owner-directed 2026-11-06 documents, reviewed read-only.
- Current repository: https://github.com/veeduzyl-hue/mindforge-guard
- Prior Pack Review: https://github.com/veeduzyl-hue/mindforge-guard/blob/feat/i1-real-writer-dataflow-01-20261112/docs/engineering/i1-pack-review-v0.1.md
- Selected I-1 head: https://github.com/veeduzyl-hue/mindforge-guard/pull/364
- I-1 Recovery: https://github.com/veeduzyl-hue/mindforge-guard/pull/359
- M5 Linux/Windows evidence (bounded): https://github.com/veeduzyl-hue/mindforge-guard/actions/runs/40627033967
