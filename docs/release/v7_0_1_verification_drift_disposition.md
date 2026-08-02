# v7.0.1 Verification Drift Disposition

## 1. Status

- assessment-only
- docs-only
- no runtime change
- no verifier change
- no RELEASE.md change

## 2. Current Baseline

- current main SHA: `14fbfeb4435b99c8b2f5317e0ff2642a5a79ecf3`
- current package baseline: `@veeduzyl/mindforge-guard@7.0.1`
- current release tag: `v7.0.1` -> `698cf0b5f8886491d34b2aeb38d7bb2d033b759c`
- PR `#341` added the named `verify:v7.0.1` aggregate and documented the current released baseline scope
- PR `#341` aggregate scope:
  - `scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs`
  - `scripts/verify_v7_0_1_public_surface_consistency.mjs`
  - `scripts/verify_v7_0_1_current_docs_baseline.mjs`
  - `scripts/verify_v7_0_1_github_action_first_report.mjs`
- current passing official commands:
  - `npm.cmd run verify:v7.0.1`
  - `npm.cmd run verify`
  - `git diff --check`

## 3. Scope and Method

This assessment used:

- current verifier execution from the repository root
- git history with `git log --follow --oneline` and `git log --follow --stat`
- `git blame` on each legacy verifier
- current docs and product-surface comparison
- overlap analysis against the current canonical verification matrix in `docs/VERIFY.md`

This assessment did not modify any verifier, release file, runtime file, package file, or License Hub surface.

## 4. Findings Summary

| Artifact | Current result | Historical role | Current authority | Classification | Recommended action |
| --- | --- | --- | --- | --- | --- |
| `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs` | Exit `1`; fails on `unexpected changed path outside allowed hotfix set: .vercel/.env.production.local` | One-time `v7.0.1` CLI packaging hotfix evidence for `b13d5ef` and `bf01487` | Not referenced by `package.json` or `docs/VERIFY.md`; release-note scoped | `TARGETED_RELEASE_EVIDENCE` | `ARCHIVE_VERIFIER` |
| `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs` | Exit `1`; fails on `unexpected changed path outside positioning rewrite set: .vercel/.env.production.local` | Docs-only rewrite verifier for `aa7368b`, then aligned in `0283c81` | Current positioning authority is carried by later `v7.0.1` canonical verifiers and current docs | `SUPERSEDED_BY_LATER_FLOW` | `ARCHIVE_VERIFIER` |
| `scripts/verify_v7_0_1_public_install_references.mjs` | Exit `1`; fails on `unexpected changed path outside allowed public install update: .vercel/.env.production.local` | Docs-only install-reference verifier for `9b6bfdd`, then aligned in `0283c81` | Current install-reference authority is carried by later `v7.0.1` canonical verifiers and current docs | `DUPLICATED_COVERAGE` | `ARCHIVE_VERIFIER` |
| `RELEASE.md` | No runtime failure; current text conflicts with the rest of the `v7.0.1` public baseline | Historical release-process tracker with `v6.12.0` and `v6.13.1` current-language residue | Not authoritative for the current `v7.0.1` public baseline in its present wording | n/a | `SEPARATE_PR_REQUIRED` |

## 5. Individual Findings

### A. `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs`

- original intent:
  - introduced in `b13d5efa0f9b2ae7ec396b2d9c41bd60c2206813` on 2026-05-13 alongside:
    - `docs/release/v7_0_1_cli_entrypoint_hotfix.md`
    - `packages/guard/bin/guard.mjs`
    - `packages/guard/package.json`
    - `packages/guard/README.md`
  - follow-up hardening in `bf014870874f0cc1a70af7ffd976eb188373afe8` kept the scope on package manifest normalization
  - the release note explicitly frames it as a bounded `v7.0.1` hotfix with a dedicated verifier and release note
- current failure:
  - current run exits `1`
  - current failure message:
    - `unexpected changed path outside allowed hotfix set: .vercel/.env.production.local`
- root cause:
  - the script performs a working-tree path-scope check before semantic assertions
  - current repository state includes ignored root `.vercel/` content
  - the verifier's ignored-path filter excludes `apps/license-hub/.env*` and `apps/license-hub/.next/`, but not root `.vercel/`
  - separate from that immediate failure, the script also asserts package README phrases that are no longer present in the current `packages/guard/README.md`, including:
    - `The current package release is \`v7.0.1\`.`
    - `veeduzyl-mindforge-guard-7.0.1.tgz`
  - that means a clean checkout would avoid the working-tree failure, but the script would still be tied to stale release-stage README wording
- overlap:
  - no current canonical verifier in `docs/VERIFY.md` or `package.json` uses this script
  - current official `v7.0.1` verification instead routes through the four verifiers added to `verify:v7.0.1`
  - this script remains specific to the original package hotfix packet, not the current released baseline matrix
- risk of updating:
  - rewriting the script to fit current README wording would blur the boundary between historical hotfix evidence and current canonical baseline
  - restoring tarball-oriented wording in the current package README would reintroduce release-stage assertions that are no longer the current authority
- risk of retaining:
  - ad hoc execution continues to produce confusing failure noise
  - readers can mistake it for a current canonical verifier even though the repository no longer treats it that way
- recommendation:
  - keep the script content unchanged in this assessment
  - treat it as historical `v7.0.1` release evidence and close it through a separate lifecycle PR that archives or clearly de-authorizes it
- confidence: high

### B. `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs`

- original intent:
  - introduced in `aa7368b2d2528a6a1b5fa69c48e08181e261cebe` on 2026-05-13 with broad docs-only copy movement across:
    - License Hub home/docs/product pages
    - `docs/commercial/*`
    - `docs/commercial/v7_0_1_single_agent_governance_positioning.md`
  - later updated in `0283c81b09274b868f2415b9dda3462c412a5577` to align verifier assertions with single-agent positioning and related implementation verifiers
- current failure:
  - current run exits `1`
  - current failure message:
    - `unexpected changed path outside positioning rewrite set: .vercel/.env.production.local`
- root cause:
  - like the other two legacy verifiers, it fails first on working-tree path scope because root `.vercel/` is not excluded by its ignored-path filter
  - after that gate, its semantic assertions mostly describe the current single-agent commercial story that is now already expressed by current product surfaces
- overlap:
  - current canonical `v7.0.1` verification already covers this surface through:
    - `verify_v7_0_1_license_hub_after_purchase_copy.mjs`
    - `verify_v7_0_1_public_surface_consistency.mjs`
    - `verify_v7_0_1_current_docs_baseline.mjs`
  - `docs/VERIFY.md` documents those scripts as the current released baseline and explicitly excludes out-of-scope `v7.0.1` verifiers
  - `package.json` only wires the four canonical `v7.0.1` scripts into `verify:v7.0.1`
- risk of updating:
  - keeping this verifier "current" would create a second authority chain for public positioning
  - future copy updates would have to satisfy both canonical baseline verifiers and a legacy rewrite verifier
- risk of retaining:
  - it continues to look current because its assertions were partially refreshed in `0283c81`
  - that can confuse reviewers about which verifier set is actually authoritative
- recommendation:
  - close it as a superseded flow, not as an active canonical verifier
  - use a follow-up lifecycle PR to archive or clearly de-authorize it once the repository records that the later `v7.0.1` verification chain owns this surface
- confidence: medium-high

### C. `scripts/verify_v7_0_1_public_install_references.mjs`

- original intent:
  - introduced in `9b6bfdd55bc54fb279c6a3f1eeaa44ff2fcd89bb` on 2026-05-13 to update public install references to `v7.0.1`
  - later updated in `0283c81b09274b868f2415b9dda3462c412a5577` to align install placement and supporting text with the single-agent positioning rewrite
- current failure:
  - current run exits `1`
  - current failure message:
    - `unexpected changed path outside allowed public install update: .vercel/.env.production.local`
- root cause:
  - immediate failure is the same working-tree path-scope gate that does not exclude root `.vercel/`
  - semantically, its assertions are largely already satisfied by current docs and License Hub pages:
    - current install commands point to `@veeduzyl/mindforge-guard@7.0.1`
    - current pages place install guidance in `Secondary technical install`
    - current README and current product docs reference `v7.0.1`
- overlap:
  - overlap with canonical `v7.0.1` coverage is strong:
    - install and public copy consistency are already covered by `verify_v7_0_1_public_surface_consistency.mjs`
    - current docs baseline alignment is already covered by `verify_v7_0_1_current_docs_baseline.mjs`
    - License Hub onboarding/install guidance is already covered by `verify_v7_0_1_license_hub_after_purchase_copy.mjs`
- risk of updating:
  - a refreshed legacy verifier would duplicate current install-surface assertions already owned by the canonical baseline matrix
  - duplicate coverage increases maintenance cost without adding a new bounded guarantee
- risk of retaining:
  - it continues to fail in normal local environments because of the path-scope rule
  - it suggests there is still an independent install-reference authority when the current matrix already covers that area
- recommendation:
  - treat it as duplicate legacy coverage and close it through the same lifecycle PR family as the commercial positioning verifier
- confidence: high

## 6. RELEASE.md Drift

- current conflicting claims:
  - `RELEASE.md` says the current released governance baseline is `v6.12.0`
  - `RELEASE.md` says the current published install-facing release is `v6.13.1`
  - `RELEASE.md` still frames `v6.13.1` as the current install-facing scope and verification path
- current authoritative sources that disagree:
  - `README.md` says `v7.0.1` is the current public commercial baseline
  - `docs/VERIFY.md` says the released baseline is `v7.0.1` and documents the current canonical `verify:v7.0.1` aggregate
  - `packages/guard/package.json` is version `7.0.1`
  - `packages/guard/README.md` installs `@veeduzyl/mindforge-guard@7.0.1`
  - `docs/product/current/v7_0_1_commercial_baseline.md` says `v7.0.1` is the current public commercial baseline
  - the repository has a `v7.0.1` tag at `698cf0b5f8886491d34b2aeb38d7bb2d033b759c`
- proposed bounded docs-only correction scope:
  - update `RELEASE.md` so its current-language sections point at the real `v7.0.1` baseline
  - preserve historical `v6.12.0` and `v6.13.x` release notes as archived lineage, not as present-tense current baseline claims
  - align release verification pointers with `docs/VERIFY.md` instead of preserving stale current-install wording
- historical language that should remain archived or clearly marked:
  - `v6.12.0` governance baseline lineage
  - `v6.13.0` commercial edition boundary lineage
  - `v6.13.1` npm-installation closeout lineage

## 7. Proposed Follow-up PRs

### PR-A: RELEASE.md Current Baseline Alignment

Scope only, not implementation:

- rewrite current-language sections in `RELEASE.md` so they no longer present `v6.12.0` or `v6.13.1` as current
- preserve historical release pointers for `v6.12` and `v6.13`
- align release verification references with the current `v7.0.1` public baseline and `docs/VERIFY.md`

### PR-B: v7.0.1 Legacy Verifier Lifecycle Closure

Scope only, not implementation:

- document that the three assessed verifiers are not part of the canonical `verify:v7.0.1` baseline
- archive or clearly de-authorize:
  - `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs`
  - `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs`
  - `scripts/verify_v7_0_1_public_install_references.mjs`
- retain historical evidence value without rewriting the original release-stage assertions into current authority

## 8. Explicit Non-Goals

This assessment does not propose or implement changes to:

- runtime
- CLI semantics
- audit / permit / classify
- license
- pricing
- checkout
- entitlement
- package exports
- package version
- External Evidence service implementation
- authority expansion

## 9. Final Decision

`BOTH_FOLLOW_UP_PRS_REQUIRED`
