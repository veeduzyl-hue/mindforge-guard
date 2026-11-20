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

## 10. Authorized follow-on engineering closeout — PR #383–#385

**Owner authorization:** continue the previously recommended P0 input trust remediation contract, P0 M5 source-history exposure reduction, and P1 CSS-only extraction without main merge or product release. This section reconciles three distinct GitHub evidence objects; NONE upgrades the original M4/M5 gates.

| Work | Exact tested candidate HEAD | Actual bounded result | HOLD or remaining work |
| --- | --- | --- | --- |
| P0 source trust / [PR #383](https://github.com/veeduzyl-hue/mindforge-guard/pull/383) | `475d0705b581c7535dfe6fb4e5832b0e75432a51` | Linux + Windows Server x64 15/15 synthetic P0G probes per platform, fixed canonical sample accepted, hidden/binary/symlink/junction/hardlink and out-of-root inputs rejected in new **standalone, default-off** gate | Legacy canonical Pack Parser STILL accepts broader files/symlink hashing. General M3 real-data admission NOT AUTHORIZED; no silent parser/hash migration. M4 62 NOT RUN. |
| P0-2 shallow offline source / [PR #384](https://github.com/veeduzyl-hue/mindforge-guard/pull/384) | `b240f3b83db171634bebb124e0e78acf55751cf8` | Linux + Windows hosted tests rebuilt an exact P1 shallow checkout with **one** reachable Git commit / clean workspace / no remotes / no ancestor objects, executed fixed synthetic PREPARE→COMPLETE, 17/17 digest checks and native report hash parity | NOT a fully Git-free archive: one commit and author metadata remain, one earlier current-tree marker unresolved; not distributed, private full Windows M5 kit still HOLD. M5 real user NOT TESTED. |
| P1 exact renderer CSS extraction / [PR #385](https://github.com/veeduzyl-hue/mindforge-guard/pull/385) | `4b55a20db00bae382845f7d62bfc35c7d29e2340` | Branch directly from main HEAD `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`; exact 3,018-character CSS insertion from PR #378 with **only 4 changed paths**, 7/7 P1UX tests on Linux + Windows and old renderer/Guard/A2 UX regressions | Draft **unmerged**. Full WCAG, first-time-user M5, release acceptance not proven. Needs independent Owner merge authorization. |

**CI source identity:** PR #383 #44672956448 / #44673001571 both `SUCCESS`; PR #384 #44673504008 / #44673539892 both `SUCCESS`; PR #385 #44674054488 / #44674103769 both `SUCCESS`; PR #385 also inherited A2 UX regression #44674103989 `SUCCESS`. CI labels remain scoped to the exact source/head and test context; they do not establish independent Assurance.

### Decision sequence (not automatic permission expansion)

1. **P0 source contract:** retain PR #383 as standalone synthetic gate. Require a separate Source Admission Transition & Backward Compatibility Owner decision before changing legacy Pack Parser or exposing a real-data source path.
2. **P0 M5 distribution:** keep complete-history Track B kit HOLD. PR #384 shows a narrower exact-SHA one-commit route is feasible; it remains an internal candidate until source-tree and commit-metadata review, independent secret scan, and signed/pinned external package distribution conditions. For faster actual independent user feedback, prefer privately reviewing the **HTML-only Track A** package with no Git source history.
3. **P1 product UX:** PR #385 is a small independently testable clean-main CSS-only candidate. Owner may separately accept/review a merge, but this document does not authorize it. Avoid bundling the 107-commit M3/I1 experiment ancestry.

```text
FOLLOW_ON_SPRINT=THREE_CANDIDATES_IMPLEMENTED_AND_TESTED_BOUNDED
P0_SOURCE_GATE=STANDALONE_SYNTHETIC_ONLY
LEGACY_SOURCE_PARSER_GAPS=OPEN
P0_M5_HISTORY_MINIMIZATION=ONE_COMMIT_SHALLOW_CANDIDATE_ONLY
FULLY_GIT_FREE_M5_WINDOWS_PACKAGE=NOT_IMPLEMENTED
EXTERNAL_WINDOWS_FULL_KIT=HOLD
P1_CSS_CLEAN_MAIN_EXTRACTION=VERIFIED_BOUNDED_DRAFT
OWNER_PR383_384_385_ACCEPTANCE=PENDING
M4_ORIGINAL_62=NOT_RUN
M5_INDEPENDENT_FIRST_USER=NOT_TESTED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP at Owner review of PR #383–#385 and this amended matrix.** No real-data importer authorization, release, verified signer trust, changed Schema/EAK/License, credential exposure ruling or M5 actual human finding is implied.

## 11. Superseding update: Owner-reviewed P1 merger and two P0 follow-ups — 2026-11-20

**This section supersedes the earlier status for PR #385 only.** The earlier 'NO MAIN MERGE' statement records the then-current pre-authorization state; it must not be retroactively overwritten. Other previous candidate and frozen gate statuses remain as recorded unless explicitly updated below.

### Owner-limited PR #385 squash merge

- Owner explicitly reviewed PR #385 and authorized continuation with the previously recommended small CSS-only integration. GitHub PR was marked ready, then **squash-merged** using `expected_head_sha=4b55a20db00bae382845f7d62bfc35c7d29e2340`.
- GitHub reported merge commit `6701f40fce4307118fca47176e81d6be7d05ef3e`; post-merge main branch and renderer Git blob were independently re-read. Exactly 4 files were merged: report CSS-only renderer, scoped test, design note and CI. No other M3/I1 prototype ancestry was imported.
- Prior fixed-HEAD Linux/Windows P1 and A2 UX CI all SUCCESS; no new release, npm publish, Native signing, user/data admission or M5 human validation was performed.

### P0 source compatibility decision — PR #386

- New Draft PR #386 from post-merge clean main `6701f40...` contains **one documentation file only** recommending a versioned, explicit opt-in strict Source Admission route **Option B**, while retaining legacy Pack Parser behavior/hash for the existing `--pack` command. This is a proposed Owner contract, not an accepted engineering/public-API change.
- A pre-existing P1 extraction workflow incorrectly triggered on unrelated main-targeting PRs and refused PR #386 (run #44682625339) because it required the original #385 four-file diff. That is an **unrelated CI scoping failure**, not an M4 Product Source Admission test or a parser regression.

### Independent M5 Gitleaks second-opinion — PR #387

- Independent, official SHA-pinned Gitleaks v8.30.1 scanned fixed M5 P1 SHA `2a5365ea422b6dfb7f3d7bba81138e1e53862be1` in two separate modes. Git ancestry scan reported **one** `private-key` rule finding and fixed current-tree scan reported **one** `private-key` rule finding; they may refer to the same bytes, not two distinct credentials.
- PR #387 Push #44683202331 and PR #44683246562 both `FAILED/HOLD` **as designed** (exit 31) after scan execution; only sanitized category counts were uploaded. A real private key was NOT confirmed and NO 'false positive' or 'secret free' conclusion was made. Previous PR #382 seven delimiter-only observations remain separate; no raw source path/key values shared.
- External M5 Windows full Git-history kit remains `HOLD`; HTML-only reading kit is separate Owner-review candidate. An access-controlled confidential manual triage plus developer/legal disclosure review is a distinct next security step.

### CI lifecycle defect after PR #385 — PR #388

- One-file CI fix Draft PR #388 (`c68ed58e8ac96f78de3c142dc155fbccd95f80e9`) restricts the P1 regression workflow to relevant renderer/test/workflow changes and removes obsolete four-file extraction assertions. Linux/Windows P1 regression **7 PASS per platform**, run #44683796148 `SUCCESS`.
- No P1 renderer source changed in this repair; it is NOT merged, and Owner has NOT authorized a second main merge. Prior PR #386 red CI remains historical evidence and is not reclassified.

### Current exact dispositions

```text
MAIN_HEAD_AFTER_OWNER_APPROVED_PR385_MERGE=6701f40fce4307118fca47176e81d6be7d05ef3e
PR385=MERGED_SQUASH_CSS_ONLY
PR386_SOURCE_ADMISSION_STRATEGY=DRAFT_OWNER_DECISION_PENDING
PR387_INDEPENDENT_GITLEAKS=EXECUTED_WITH_1_RULE_FINDING_PER_SCOPE
PR388_CI_SCOPE_REPAIR=VERIFIED_BOUNDED_DRAFT_UNMERGED
LEGACY_PACK_SOURCE_TRUST_GAPS=OPEN
M5_FULL_WINDOWS_GIT_HISTORY_HANDOFF=HOLD
M4_ORIGINAL_62=NOT_RUN
M5_INDEPENDENT_REAL_HUMAN=NOT_TESTED
SIGNED_NATIVE_ADDON=DEFERRED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
NO_ADDITIONAL_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP at Owner review for PR #386, #387 and #388.** The PR #385 accepted merge does not confer authority to merge any other PR, publish, certify secret-free history, or ingest customer sources.

## 12. Owner-authorized PR #388 merge and bounded Option B/M5 triage — 2026-11-20

**Owner review authorization:** Owner accepted the previous recommended next steps. This section records three independent actions against fixed source identities and their strict stop conditions; all earlier evidence remains historical and is not rewritten.

### Completed limited CI repair merge — #388

- PR #388 fixed candidate HEAD `c68ed58e8ac96f78de3c142dc155fbccd95f80e9` (one workflow YAML path) had 7/7 P1 regression PASS on both Linux and Windows Server 2022 x64, run #44683796148. Main branch source was `6701f40fce4307118fca47176e81d6be7d05ef3e`.
- Owner-authorized limited PR #388 Squash Merge succeeded with GitHub merge commit `6cfc5fbc109c9d39ea6c592c121c419f81009051`, confirmed exactly one workflow change and unchanged renderer/product code. P1 CI trigger now filters only report-related PR changes; docs-only PR #386's prior unrelated CI failure remains historical, not relabeled PASS.

### Option B accepted for bounded design, new clean-main prototype #389

- PR #386 docs decision was accepted as **bounded design direction**, not general customer source admission or a product/public CLI change. Updated PR #386 head `309c126703ffe4141909993bda4e55d233056e6d`; it remains Draft unmerged with original compatibility options preserved.
- PR #389 starts directly at post-PR388 clean main `6cfc5fbc...`, exact head `88552a78a72b9a6651e97ab4093319282deafa50`. It imports the byte-identical PR #383 synthetic gate and its tests, adds the explicit `strict-v0.1-synthetic` pre/postcheck bridge around **unchanged** existing Guard Pack Validate, documentation and separate CI. Exactly 6 changed paths and no I1/M3 107-commit stacked history.
- Push #44686196440 and PR #44686279555 both COMPLETED/SUCCESS on hosted Linux and Windows Server x64. Each OS: 15/15 original P0G cases + 12/12 SRC-TXB bridge cases, **27 PASS/0 FAIL/0 NOT_TESTED**; native legacy valid Pack hash/status parity retained. Directly calling the old Parser still admits broader extra/symlinked inputs, and hostile source TOCTOU/secure snapshot remains unestablished.

### Independent fixed P1 secret finding structural triage — #387

- Updated PR #387 exact head `15a149ec22415995146edc5a60cf658f3cc8a6d5`. Official SHA-pinned Gitleaks v8.30.1 separately found one `private-key` category rule hit in P1 Git ancestry and one in extracted P1 current tree. Push #44686875498 and PR #44686880778 both **FAILED/HOLD intentionally** because the safety gate requires further adjudication.
- One reported current-tree source location was internally resolved and verified byte-identical to fixed P1 Git object, without disclosing file name/path or raw match. Automated check found **one BEGIN/END paired private-key delimiter block** but **zero PEM private keys parseable** by Node crypto. This is neither proof of a valid leaked key nor an independent human false-positive clearance. Encrypted/other formats and Git author/legal metadata remain unreviewed; full Windows Git-history M5 handoff stays HOLD.

### Current exact statuses

```text
MAIN_HEAD=6cfc5fbc109c9d39ea6c592c121c419f81009051
PR385=MERGED_CSS_ONLY
PR388=MERGED_CI_ONLY
PR386_OPTION_B=OWNER_ACCEPTED_BOUNDED_DESIGN_DIRECTION_DRAFT_UNMERGED
PR389_SYNTHETIC_STRICT_SOURCE_BRIDGE=27_PASS_PER_OS_DRAFT_UNMERGED
LEGACY_PACK_PARSER_GAPS=OPEN_DIRECT_LEGACY_PATH
SECURE_IMMUTABLE_REAL_DATA_SNAPSHOT=NOT_ESTABLISHED
PR387_GITLEAKS=RULE_FINDINGS_UNRESOLVED
PR387_CURRENT_TREE_PAIRED_PEM_MARKER_COUNT=1
PR387_CURRENT_TREE_CRYPTO_PARSEABLE_PRIVATE_KEY_COUNT=0
M5_WINDOWS_FULL_GIT_HISTORY_EXTERNAL_HANDOFF=HOLD
M5_INDEPENDENT_REAL_FIRST_USER=NOT_TESTED
M4_ORIGINAL_62=NOT_RUN
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
SEBBI=HOLD
SIGNED_NATIVE_ADDON=DEFERRED
NO_ADDITIONAL_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**Next separate Owner decisions:** accept/hold PR #389 as a bounded prototype (not product), commission controlled human adjudication of PR #387’s single current-tree rule match plus historical metadata, decide whether to use M5 reading-only Track A before any Windows full-source Track B external test. None of these is automatic execution/merge permission.
