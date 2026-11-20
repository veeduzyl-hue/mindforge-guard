# MindForge Guard — Clean-Main First Report P1 CSS Extraction v0.1

**2026-11-20, Owner-authorized P1 minimal extraction only.** Source baseline: `main` immutable commit `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`. Accepted experimental P1 reference: PR #378 fixed CSS renderer at `2a5365ea422b6dfb7f3d7bba81138e1e53862be1`. **Scope:** presentation CSS, no PR #374–#379/M3/I1 experiment history merged into main.

## 1. Exact source trust and minimality

- Readback showed original renderer `packages/guard/src/presentation/role_based_html_report.mjs` blob ID **`b246e41c65c134eebdbdb7f1742b7d2663fdadd2`** is identical in clean `main` and the PR #377 predecessor.
- The PR #378 P1 renderer blob is **`8078a934badae529bdaba1423bbf193ec0cdb761`**. Its bytes are the original renderer with **exactly one 3,018-character CSS insertion**, tagged `FIRST_REPORT_P1_LEGIBILITY_V01`. No JS/source/report content, HTML markup, CSP, schema, execution, license or hash logic is altered.
- This branch checks out the fixed old `main` commit, copies the exact known P1 renderer blob, and adds only its own independent test, this document and small CI. The existing 107-commit PR #379 ancestry is NOT part of this main-based change.

## 2. Regression and bounded visual acceptance

Dedicated `scripts/verify_first_report_p1_css_main_extraction.mjs` is derived from PR #378's seven tests but pins frozen `main` as baseline, checks the exact P1 target renderer Git blob, and compares all non-CSS HTML bytes to the original render for the same sample Report JSON.

Tests assert unchanged CSP / raw JSON / field values / hash / non-enforcement, valid original HTML input behavior, 11 explicit palette pairs with static ratio >=4.5:1, three reader views and CSS focus states, source underlines, print/mobile/reduced motion rules. Existing `scripts/verify_v7_role_based_report_render.mjs` and Guard regression must pass on Linux/Windows Server 2022 x64.

**WCAG:** a static CSS-pair calculation does not establish complete WCAG 2.2 conformance, true screen reader behavior or M5 participant understanding. The prior real Chromium smoke is supporting-only for PR #378, not an independent end-user finding.

## 3. Explicit admissibility and decision

| Gate | Status |
| --- | --- |
| Copy exact CSS from experimental to clean main | CANDIDATE IN ISOLATED BRANCH |
| Existing report meaning and response | MUST remain byte-identical outside CSS |
| Full Guard tests and P1 visible reading path | CI PENDING until fixed-head execution |
| M5 real first user | NOT TESTED |
| Original M4 62 | NOT RUN |
| PR #383 strict source gate | EXPERIMENTAL, NOT IN THIS EXTRACTION |
| PR #384 shallow source | EXPERIMENTAL, NOT IN THIS EXTRACTION |
| `main` merge | NOT AUTHORIZED / REQUIRES EXPLICIT OWNER ACCEPTANCE |
| npm release / package publication | NOT AUTHORIZED |

## 4. Proposed clean integration flow

After exact-HEAD CI and independent visual review, the Owner can decide if this small **Draft PR targeting main** should become a separately authorized merge. No additional M3 standalone experimental scripts, Native unsigned addon, real-data import gate, License/EAK/Edition or M5 full Git history may be included by implication. If `main` changes, reread the original renderer and re-evaluate diff/CI.

```text
P1_LEGIBILITY_CLEAN_MAIN_EXTRACTION=CANDIDATE
ORIGINAL_REPORT_SEMANTICS=UNCHANGED_EXPECTED
M4_ORIGINAL_62=NOT_RUN
M5_HUMAN=NOT_TESTED
I1_SIGNED_NATIVE_ADDON=DEFERRED
OR_01_TO_05=UNCHANGED
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```
