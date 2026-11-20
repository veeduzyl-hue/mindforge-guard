# MindForge Guard — Architecture v0.2.x Internal Convergence / Integration Readiness v0.1

**Date:** 2026-11-20 UTC+08. **Task:** Track A of Owner-authorized Internal Engineering Convergence Sprint. **Evidence:** connected GitHub readback of PRs #367, #351, #364 and #368–#379; immutable exact PR head commits and main compare. **Authority:** READ / DOCS ONLY; this is NOT a merge plan authorization, release, acceptance, or a frozen v0.2.2 baseline.

## 1. Repository reality — do not mistake passing isolated PRs for release admission

- `main` current inspected HEAD: `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`. PR #351 v7.1.0-rc.0 packaged English candidate had merged into main previously, but an npm publication is NOT established by a GitHub merge. Existing 7.0.1 release/current product assumptions must be independently confirmed before an external distribution claim.
- Pinned study candidate PR #379 HEAD: `2e38044ecb65f4e026f9ffa7441a428277c3f985`. `compare_commits(main, PR379)` returned **ahead_by=107, behind_by=0, 69 changed files** (`.github` 15, `docs` 15, `experiments` 5, `packages` 9, `scripts` 25). This is an experimental history containing earlier I1 Native security work and is NOT a minimally scoped M3/P1/M5 integration branch.
- Architecture v0.2.2 is an Owner-directed DOCS-ONLY baseline **CANDIDATE**. OD-01–OD-07 were accepted for design, not runtime admission. OR-01–OR-05 retain their recorded open runtime conditions. The originally defined M4 matrix is **62/62 NOT RUN**, notwithstanding later individually named M3I/M3D/M3RC/M3FLOW or P1UX engineering suites.
- Keep old CI failures in the history of every PR. Where a later fixed HEAD passes, scope that PASS to the exact immutable checkout, fixtures, OS, trust domain and case IDs — never retroactively change older receipts.

## 2. Exact six-PR M3 → P1 → M5 stack (all currently DRAFT / UNMERGED)

| PR | Fixed head (first 12) | Actual change on its parent | Bounded evidence | Appropriate disposition | Cannot claim |
| --- | --- | --- | --- | --- | --- |
| #374 | `11337880c7e9` | M3 SELECT/INVENTORY; standalone fixture-only Node script, tests, workflow, docs (4 paths) | Linux/Windows x64 15/15 M3I PASS per platform | PRESERVE as source inventory research prototype | Arbitrary customer sources, fully safe reparse/race coverage, canonical inventory API |
| #375 | `8a9af158eb99` | M3 DISCOVER/DRAFT; 4 additive files | Linux/Windows 19/19 M3D + predecessor PASS | PRESERVE field location/digest candidate | Full YAML parse, semantic truth, actual authority approval |
| #376 | `ce1a235aecce` | M3 REVIEW/CONFIRM; 4 additive files | Linux/Windows 26/26 M3RC + predecessors PASS | PRESERVE synthetic review choices and ambiguity safety | Authenticated actor, witnessed human, corporate authorization, durable ledger |
| #377 | `b45c8f4b38a3` | 11-file fixed synthetic HR Pack clone → native Guard Validate/Report → HTML/delivery checksum; 4 additive files | CI 76 test IDs / OS, Owner-mediated Windows full path and 17/17 local checksums reported | PRESERVE as bounded demo and user workflow baseline | General M3 real-data Build, official secure I1 Review Bundle, production admission |
| #378 | `2a5365ea422b` | Role-based HTML stylesheet P1 legibility only; 4 files incl renderer + tests | static CSS/HTML content parity, Chromium role/mobile engineering smoke; 7 P1UX + M3FLOW regressions | CANDIDATE FOR INDEPENDENT SMALL CSS CHANGE EXTRACTION after Owner review | Full WCAG, end-user understanding or accessibility certification |
| #379 | `2e38044ecb65` | M5 independent human first-user reading/Windows kit docs and CI builder; 6 additive files | reading/Windows kit built, SHA checks/isolated offline Git clone | KEEP DRAFT as human-study packet; C distribution safety audit still required | Consent, real uncoached participant, M5 outcome, complete Git-history secret clearance |

The actual dependency chain is #374 → #375 → #376 → #377 → #378 → #379. Their PR base branches are inherited experimental parents, not main. Every step has a separate fixed SHA. The first M3 branch was based on PR #371 (`adb43e60a71729c5fab4ac8e1804804bc8d10038`), itself downstream of PRs #364/#368/#369/#370 and other I1 native experiments. **Therefore do NOT merge PR #379 directly into main**, and do NOT retarget the aggregate branch without a second provenance/diff and regression review.

## 3. Adjacent work: retain boundaries

| Source | Present evidence | Disposition |
| --- | --- | --- |
| #367 | Phase A docs-only review, v0.2.2 remains candidate; M4 62 NOT RUN | RETAIN for review; not engineering approval |
| #368–#371 | I1 private NTFS ACL default-deny, synthetic Pack / Windows hosted native positives, owner Windows x64 installed-CLI default-deny | Experimental/native branch only; do not import unsigned addon into the released CLI |
| #372/#373 | Bounded unsigned signer negatives and Azure operator guide | DEFER signing and any billable Azure service by latest Owner instruction; no cert/private key available |
| M4 v0.1.1 | 62 named compatibility/negative scenarios in REL/SCH/HNS/EAK/LIC/CLI/BND/ANA/VS families | Test applicability and P0 slice only. Keep EACH original case NOT RUN unless exact original scenario is actually executed |
| M5 independent first-user | No eligible, consented, independent uncoached Track B outcome | Human validation still NOT TESTED. Owner-mediated local run is separate evidence |

## 4. Integration and negative/admission matrix

| Gate / question | Current status | Minimum evidence to change it | Owner decision |
| --- | --- | --- | --- |
| G-A0 exact main/parent provenance | READ_BACK_BOUNDED | Compare source history, changed-path/commit allowlist and upstream branch trust for each extracted change | REQUIRED before any extraction |
| G-A1 isolated M3I/M3D/M3RC/M3FLOW synthesis | VERIFIED_BOUNDED_SYNTHETIC | Tests prove fixture-only route on approved OS/head; no public commands assumed | Retain as experimental baselines |
| G-A2 product package exposure | NOT AUTHORIZED | Standalone minimal cherry-pick proposals, clean production base, full Guard regressions + contract compatibility | Explicit separate engineering authorization |
| G-A3 source protection, privacy and private-ACL Bundle | HOLD_FOR_REAL_DATA | P0 M4 exact scenarios, secure storage/atomicity and real trust boundaries | No customer uploads |
| G-A4 original M4 62 case execution | NOT RUN | Per-case actual required executable, fixture, actor/environment and recorded expected/observed result | Separate execution admission (no broad implicit PASS) |
| G-A5 real independent first-user M5 | NOT TESTED | Genuine opted-in uncoached session; dated observed errors, task duration, comprehension and consent | Separate M5 acceptance |
| G-A6 M5 Windows external kit | OWNER_REVIEW_REQUIRED | Historical secret scan, artifact content inventory, offline-source trust, no unknown binaries/key exposure | Do not distribute before review |
| G-A7 P1 role-based legibility | VERIFIED_BOUNDED_ENGINEERING | First-time human readability/keyboard behavior, accessible zoom tests and actual feedback for broader claim | Treat WCAG as not certified |
| G-A8 signed Native Addon distribution | DEFERRED_NOT_ESTABLISHED | Validated signer/profile, signed artifact, independent release trust, verified installer and rollback | Do not resume without Owner |
| G-A9 main merge / npm or signed release | NOT AUTHORIZED | Separate exact-PR Owner acceptance, comprehensive source/CI/supply-chain/regression and customer-admission gates | NO MERGE / NO RELEASE |

## 5. Practical extractability and merge strategy — proposals ONLY

**Do not merge the experimental branch stack as-is.** If the Owner later authorizes integration, create new branches from an independently pinned clean **main** and extract only genuinely applicable files in small groups: (1) CSS-only #378 presentation after semantics/renderer tests, (2) standalone M3 scripts as non-shipping prototype (only if no bundle/CLI hook makes them public), and (3) M5 paperwork after Track C distribution preflight. Each extracted branch must show its exact cherry-pick/file-diff proof, version identity, dependency closure and CI. This is a design proposal; NOT AUTHORIZATION to write to main.

Do not assume the M3 prototype can be used on arbitrary customer data; the currently implemented `BUILD` copies an approved **fixed synthetic HR teaching fixture** after explicit source mapping-location checks. It is not a general data-to-Pack transformer.

## 6. Two-week acceptance sequence (parallel, not silent permission expansion)

Week 1 Track A: pin baseline + full PR dependency matrix; identify 107-commit trunk divergence, classify candidate code and Owner gates. Track B: original M4 P0 slice eligibility/negative bridge; Track C: full Git history/supply-chain preflight and minimal distribution decisions.

Week 2 proposal: if P0 evidence and Owner instructions permit, validate a second unseen synthetic case to expose template coupling, then prepare an independently reviewed narrow extraction; do not permit arbitrary real input. In parallel keep M5 external participants uncoached and source-identity pinned.

## 7. Explicit no-claims

```text
ARCH_V02X_INTEGRATION_BASELINE=DOCS_ONLY_CANDIDATE
MAIN_HEAD_AS_READ=3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c
PR379_COMMIT_AHEAD_OF_MAIN=107
PR379_CHANGED_PATHS_AHEAD_OF_MAIN=69
PR374_TO_379=ALL_DRAFT_UNMERGED
OWNER_FINAL_BASELINE_ACCEPTANCE=PENDING
OR_01_TO_05=UNCHANGED
M4_ORIGINAL_62=NOT_RUN
M5_INDEPENDENT_FIRST_USER=NOT_TESTED
SIGNED_ADDON_DISTRIBUTION=DEFERRED_NOT_ESTABLISHED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP at Owner review of this matrix.** Any later change in `main`, a PR head, M4 case state or artifact digest must trigger a new readback, not a silent amendment.

## 8. Executed Sprint v0.1 readback — P0 findings and source identities

**Track A:** Draft PR #380 is this document-only integration matrix; original fixed parent PR #379 head `2e38044ecb65f4e026f9ffa7441a428277c3f985`. Main remains as read `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`; PR #379 ahead by 107 commits / 69 paths, including I1 experimental ancestry. **NO DIRECT MAIN MERGE**.

**Track B:** independent Draft PR #381, source `6b4503478fe58636ca25a06d29ed741a3c9240be`. Push CI #44667390315 and PR CI #44667442879 both COMPLETED/SUCCESS in hosted Linux/Windows x64 (this is **diagnostic execution** only). Six scoped supporting probes produced **two P0 GAP findings**: legacy Pack Validate accepted synthetic extra hidden/binary source and reflected it in Pack digest (`REL-05`-related), and accepted a synthetic symlink to an outside-root source with digest changed (`REL-06/BND-07`-related). Four other supporting checks were enforced on the current standalone interfaces. **Zero of 62 original M4 cases closed**: these are explicitly non-equivalent representative probes. Do not generalize a new `guard review --source` path until input confinement, filtering and backward compatibility are separately designed and authorized.

**Track C:** independent Draft PR #382, source `9e5568bb83fbb2fb94e8d954c08bd1a4c3aaaa43`. Push #44668365818 and PR #44668371754 both completed FAILED/HOLD **as intentionally gated**. The fixed M5 P1 Git history `2a5365ea422b6dfb7f3d7bba81138e1e53862be1` contained 1,250 reachable commits and 2,483 unique blobs / 21,710,832 bytes read. Seven distinct blobs contained a PRIVATE KEY BEGIN marker; **zero** formed a structurally paired Base64-encoded PEM block by the constrained private triage. This is **not proof of a valid secret nor an independent no-secrets verdict**. No raw bytes, matches, paths or Git personal metadata were published. Hold Windows full-history external kit pending confidential classification / independent scanner and Owner release approval. Reading-only HTML kit is a separate candidate.

**Version/trust boundary:** CI green in B means probe harness completed, not case PASS; CI red in C means the security gate correctly refused ambiguous history. Both preserve old failures and exact proof boundaries. Any actual PEM/credential found by follow-on private investigation must trigger a separate preservation/rotation/incident Owner decision, not automatic public Git rewrite.

### Recommended next three bounded Owner dispositions

1. `P0-SOURCE-ADMISSION`: request a separate remediation design for Pack parser hidden/binary/symlink-root handling, with compatibility tests on existing valid packs and explicit rejection of untrusted real sources. Do NOT make a silent parser or canonical Schema change.
2. `P0-M5-DISTRIBUTION`: keep Windows Git-history kit HOLD; commission independent private secret scanner and legal/historical-metadata review, or choose the HTML-only report track before a first independent user.
3. `P1-NARROW-CANDIDATE-EXTRACTION`: only after gaps are acknowledged, present exact minimal candidate change subsets (for example CSS-only P1) for separate Owner acceptance. Do not retarget/merge #374–#379 aggregate history.

```text
INTERNAL_CONVERGENCE_SPRINT_V01=A_B_C_EXECUTED_WITH_FINDINGS
TRACK_A_DOCS_ONLY_REVIEW=COMPLETED_OWNER_ACCEPTANCE_PENDING
TRACK_B_SUPPORTING_PROBES=6_RUN_2_GAPS_0_ORIGINAL_M4_CLOSED
TRACK_C_FIXED_P1_HISTORY=2483_BLOBS_SCREENED_7_PEM_MARKERS_0_STRUCTURAL_PEM_BLOCKS
TRACK_C_WINDOWS_FULL_KIT_EXTERNAL_HANDOFF=HOLD
M4_ORIGINAL_62=NOT_RUN
M5_REAL_HUMAN_FIRST_USER=NOT_TESTED
OR_01_TO_05=UNCHANGED
PRODUCT_ADMISSION=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP for separate Owner decisions.** This addendum does not authorize parser remediation, public distribution, identity/secret adjudication, source-history rewrite, or a product release.

## 9. Final M5 history marker scope refinement (without disclosure)

Following the initial Track C HOLD, final PR #382 source HEAD `f43862f93741a0e377358e820f2f45f8d92f8424` executed the same pinned P1 scan under Linux and Windows. Fixed P1 contains **1,356 unique current-tree blob IDs**. Of the **7** PRIVATE KEY BEGIN marker-bearing reachable blobs, **1** is present in the fixed current tree and **6** occur only in history. **0** of the seven are structurally paired/long Base64 PEM candidate blocks according to the limited detector.

CI #44669102299 (push) and #44669107597 (PR) remain FAILED/HOLD as designed; that is the correct distribution admission signal. These counts are a private-classification prioritization, **not** credential validity proof, secret-free clearance, Git history declassification, or an authorization to publish the full Windows M5 kit. The earlier C source SHA/result remain historical evidence in the prior section.

Final Track A/B/C closeout remains: no main merge, original M4 62 NOT RUN, M5 independent first-user NOT TESTED, external Windows git-bundle handoff HOLD, and source trust P0 remediation separately required.
