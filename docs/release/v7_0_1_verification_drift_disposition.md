# v7.0.1 Verification Drift Disposition

## 1. Status

- assessment-only
- docs-only
- no runtime change
- no verifier change
- no RELEASE.md change

## 2. Current Baseline

- assessment base main SHA: `14fbfeb4435b99c8b2f5317e0ff2642a5a79ecf3`
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

- current verifier execution from the local main worktree
- clean-checkout verifier execution from a temporary clone of `docs/v7.0.1-verification-drift-disposition`
- git history with `git log --follow --oneline` and `git log --follow --stat`
- `git blame` on each legacy verifier
- current docs and product-surface comparison
- overlap analysis against the current canonical verification matrix in `docs/VERIFY.md`
- reference audit with `git grep` for each legacy verifier name

### Execution Environment Caveat

- in the local main worktree, all three legacy verifiers failed first on `.vercel/.env.production.local`
- that path is not tracked by git
- that path is ignored by `.gitignore:11:.vercel/`
- `git status --ignored --short -- ".vercel"` reports `.vercel/` as ignored local state
- this means the initial local failure is a local environment path-interference result, not standalone proof that the verifier semantics are stale
- semantic disposition in this assessment is based on the separate clean-checkout execution evidence plus source and reference review
- this assessment did not read, print, copy, stage, or commit `.vercel/.env.production.local`

This assessment did not modify any verifier, release file, runtime file, package file, or License Hub surface.

## 4. Findings Summary

| Artifact | Local-worktree result | Clean-checkout result | Historical role | Current authority | Classification | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- |
| `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs` | Exit `1`; `unexpected changed path outside allowed hotfix set: .vercel/.env.production.local` | Exit `1`; `packages/guard/README.md must state v7.0.1 as the current package release` | One-time `v7.0.1` CLI packaging hotfix evidence for `b13d5ef` and `bf01487` | Not referenced by `package.json` or `docs/VERIFY.md`; release-note scoped | `TARGETED_RELEASE_EVIDENCE` | `SEPARATE_PR_REQUIRED` |
| `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs` | Exit `1`; `unexpected changed path outside positioning rewrite set: .vercel/.env.production.local` | Exit `1`; `License Hub home must keep install references inside the secondary technical install section` | Docs-only rewrite verifier for `aa7368b`, then aligned in `0283c81` | Current positioning authority is carried by later `v7.0.1` canonical verifiers and current docs | `SUPERSEDED_BY_LATER_FLOW` | `SEPARATE_PR_REQUIRED` |
| `scripts/verify_v7_0_1_public_install_references.mjs` | Exit `1`; `unexpected changed path outside allowed public install update: .vercel/.env.production.local` | Exit `1`; `apps/license-hub/app/page.tsx must keep install references inside a secondary technical install context` | Docs-only install-reference verifier for `9b6bfdd`, then aligned in `0283c81` | Current install-reference authority is partially duplicated by later `v7.0.1` canonical verifiers and current docs | `DUPLICATED_COVERAGE` | `SEPARATE_PR_REQUIRED` |
| `RELEASE.md` | No runtime failure; current text conflicts with the rest of the `v7.0.1` public baseline | n/a | Historical release-process tracker with `v6.12.0` and `v6.13.1` current-language residue | Not authoritative for the current `v7.0.1` public baseline in its present wording | n/a | `SEPARATE_PR_REQUIRED` |

## 5. Individual Findings

### A. `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs`

- original intent:
  - introduced in `b13d5efa0f9b2ae7ec396b2d9c41bd60c2206813` on 2026-05-13 alongside:
    - `docs/release/v7_0_1_cli_entrypoint_hotfix.md`
    - `packages/guard/bin/guard.mjs`
    - `packages/guard/package.json`
    - `packages/guard/README.md`
  - follow-up hardening in `bf014870874f0cc1a70af7ffd976eb188373afe8` kept the scope on package manifest normalization
  - the paired release note frames it as a bounded `v7.0.1` hotfix with a dedicated verifier and release note
- local environment failure:
  - exit `1`
  - first failure:
    - `unexpected changed path outside allowed hotfix set: .vercel/.env.production.local`
  - failure class:
    - working-tree environment gate
- clean-checkout execution result:
  - exit `1`
  - first failure:
    - `packages/guard/README.md must state v7.0.1 as the current package release`
  - failure class:
    - stale exact phrase
- source-level assertion review:
  - after the path-scope gate, the verifier requires package README text that is no longer present in the current [packages/guard/README.md](../../packages/guard/README.md)
  - it also requires `veeduzyl-mindforge-guard-7.0.1.tgz`, another release-stage phrase absent from the current package README
  - the current manifest and CLI entrypoint facts it checks remain historically meaningful, but the README assertions are tied to the original hotfix packet wording
- current reference audit:
  - current references:
    - `docs/release/v7_0_1_cli_entrypoint_hotfix.md`
    - this assessment document
    - self-reference inside the script allowed-change set
  - not referenced by:
    - root `package.json`
    - `docs/VERIFY.md`
    - any current canonical `verify:v7.0.1` aggregate
  - moving or deleting it without a reference-safe plan would break the historical release-note path that still points to the script
- semantic conflict:
  - yes
  - the clean-checkout failure shows direct conflict between current package README wording and the historical hotfix verifier's exact phrase expectations
- duplicate only:
  - no
  - this script still captures a distinct historical package hotfix packet, even though it is not a current canonical verifier
- historical replay value:
  - yes
  - it remains useful as historical release evidence for the original `v7.0.1` CLI packaging hotfix
- recommendation:
  - keep unchanged in this assessment
  - require a separate lifecycle PR to decide whether to retain it as historical evidence, explicitly de-authorize it, archive it, move it, or remove it with updated references
- confidence: high

### B. `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs`

- original intent:
  - introduced in `aa7368b2d2528a6a1b5fa69c48e08181e261cebe` on 2026-05-13 with broad docs-only copy movement across:
    - License Hub home/docs/product pages
    - `docs/commercial/*`
    - `docs/commercial/v7_0_1_single_agent_governance_positioning.md`
  - later updated in `0283c81b09274b868f2415b9dda3462c412a5577` to align verifier assertions with single-agent positioning and related implementation verifiers
- local environment failure:
  - exit `1`
  - first failure:
    - `unexpected changed path outside positioning rewrite set: .vercel/.env.production.local`
  - failure class:
    - working-tree environment gate
- clean-checkout execution result:
  - exit `1`
  - first failure:
    - `License Hub home must keep install references inside the secondary technical install section`
  - failure class:
    - ordering assertion
- source-level assertion review:
  - this verifier does not merely check for the existence of a `Secondary technical install` section
  - it uses `assertSecondaryTechnicalInstall(...)` and requires the first occurrence of `@veeduzyl/mindforge-guard@7.0.1` to appear after that section heading
  - current [apps/license-hub/app/page.tsx](../../apps/license-hub/app/page.tsx) contains the section at line `320`, but the first install command appears earlier at line `83`
  - the clean-checkout failure therefore reflects a live ordering assertion, not the absence of the section
- current reference audit:
  - current references:
    - `scripts/verify_v7_0_license_hub_copy_implementation.mjs`
    - `scripts/verify_v7_0_mindforge_run_implementation_pack.mjs`
    - `scripts/verify_v7_0_1_public_install_references.mjs`
    - this assessment document
    - self-reference inside the script allowed-change set
  - not referenced by:
    - root `package.json`
    - `docs/VERIFY.md`
  - because other historical verifiers still reference it, direct movement or deletion would not be reference-safe
- semantic conflict:
  - yes
  - the clean-checkout failure shows that current License Hub home ordering does not satisfy this legacy verifier's stricter install-placement rule
- duplicate only:
  - not fully
  - it overlaps heavily with later canonical positioning coverage, but its exact ordering assertion is not identical to the newer verifier set
- historical replay value:
  - yes
  - it preserves the specific rewrite-stage contract that was asserted during the May 13, 2026 positioning pass
- recommendation:
  - keep unchanged in this assessment
  - require a separate lifecycle PR to decide whether the ordering rule should be explicitly de-authorized, archived as historical replay evidence, or otherwise closed in a reference-safe way
- confidence: high

### C. `scripts/verify_v7_0_1_public_install_references.mjs`

- original intent:
  - introduced in `9b6bfdd55bc54fb279c6a3f1eeaa44ff2fcd89bb` on 2026-05-13 to update public install references to `v7.0.1`
  - later updated in `0283c81b09274b868f2415b9dda3462c412a5577` to align install placement and supporting text with the single-agent positioning rewrite
- local environment failure:
  - exit `1`
  - first failure:
    - `unexpected changed path outside allowed public install update: .vercel/.env.production.local`
  - failure class:
    - working-tree environment gate
- clean-checkout execution result:
  - exit `1`
  - first failure:
    - `apps/license-hub/app/page.tsx must keep install references inside a secondary technical install context`
  - failure class:
    - ordering assertion
- source-level assertion review:
  - this verifier also checks ordering, not just presence
  - it uses `assertSecondaryInstallContext(...)`, which only passes when the first `@veeduzyl/mindforge-guard@7.0.1` appears after `Secondary technical install`
  - current surfaces do contain the section:
    - home section heading at line `320`
    - docs section heading at line `217`
    - product section heading at line `163`
  - but on the home and docs pages the first install string appears earlier:
    - home install command first appears at line `83`
    - docs install command first appears at line `70`
  - the clean-checkout result therefore reflects a real ordering mismatch, not missing install guidance
- current reference audit:
  - current references:
    - `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs`
    - `scripts/verify_v7_0_license_hub_copy_implementation.mjs`
    - `scripts/verify_v7_0_mindforge_run_implementation_pack.mjs`
    - this assessment document
    - self-reference inside the script allowed-change set
  - not referenced by:
    - root `package.json`
    - `docs/VERIFY.md`
  - direct movement or deletion would require updating other historical verifier references first
- semantic conflict:
  - yes
  - the clean-checkout failure shows the legacy install-placement assertion conflicts with current page ordering
- duplicate only:
  - partially
  - current canonical verifiers already cover public install correctness at a broader level, but this legacy verifier still carries its own stricter ordering rule
- historical replay value:
  - yes
  - it preserves the exact install-reference closure rule asserted in the May 13, 2026 docs pass
- recommendation:
  - keep unchanged in this assessment
  - require a separate lifecycle PR to decide whether to retain it as historical replay evidence, explicitly de-authorize its stricter ordering rule, archive it, move it, or remove it in a reference-safe way
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
- perform reference-safe lifecycle closure before any physical script move or deletion
- define whether `archive` means:
  - documentation-only de-authorization
  - physical file movement
  - or full removal after all references are updated
- preserve historical replayability where needed
- avoid moving or deleting scripts unless:
  - all references are updated
  - historical evidence remains recoverable
  - the repository records the intended authority boundary clearly

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

Notes:

- PR-A is confirmed required for current-baseline clarity in `RELEASE.md`
- PR-B is required for verifier authority clarity
- the concrete PR-B mechanism for archive, move, delete, or de-authorization is not authorized by this assessment and remains a separate lifecycle decision
