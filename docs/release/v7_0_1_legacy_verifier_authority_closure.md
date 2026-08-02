# v7.0.1 Legacy Verifier Authority Closure

## 1. Status

- documentation-only authority closure
- scripts retained in place
- no verifier modification
- no physical archive
- no move
- no deletion
- no runtime or CLI change

## 2. Decision

The three assessed verifier scripts are retained as historical targeted release evidence. They are not current canonical v7.0.1 release gates and are not part of `npm run verify:v7.0.1`.

Current authority is defined by the canonical aggregate documented in `docs/VERIFY.md` and the current `package.json` verify commands.

A filename that includes `v7.0.1` does not automatically make a script part of the current released baseline.

Do not use a wildcard or glob to treat all `verify_v7_0_1_*` scripts as the current acceptance suite.

## 3. Current Canonical Verification Authority

The current canonical `v7.0.1` verifier authority is:

- `scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs`
- `scripts/verify_v7_0_1_public_surface_consistency.mjs`
- `scripts/verify_v7_0_1_current_docs_baseline.mjs`
- `scripts/verify_v7_0_1_github_action_first_report.mjs`

Current commands:

- `npm.cmd run verify:v7.0.1`
- `npm.cmd run verify`

Run the current aggregate from a clean working tree or a clean CI checkout.

The existing `verify` aggregate remains unchanged.

## 4. Historical Verifier Disposition

| Verifier | Classification | Current clean-checkout result | Authority status | Retention decision |
| --- | --- | --- | --- | --- |
| `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs` | `TARGETED_RELEASE_EVIDENCE` | `packages/guard/README.md must state v7.0.1 as the current package release` | historical only | retained unchanged at current path |
| `scripts/verify_v7_0_1_commercial_positioning_rewrite.mjs` | `SUPERSEDED_BY_LATER_FLOW` | `License Hub home must keep install references inside the secondary technical install section` | historical rewrite-stage evidence only | retained unchanged at current path |
| `scripts/verify_v7_0_1_public_install_references.mjs` | `DUPLICATED_COVERAGE` | `apps/license-hub/app/page.tsx must keep install references inside a secondary technical install context` | historical install-reference closure evidence only | retained unchanged at current path |

### CLI entrypoint hotfix

- classification: `TARGETED_RELEASE_EVIDENCE`
- authority: historical only
- retention: retained unchanged at current path
- current release gate: no

### Commercial positioning rewrite

- classification: `SUPERSEDED_BY_LATER_FLOW`
- authority: historical rewrite-stage evidence only
- retention: retained unchanged at current path
- current release gate: no

### Public install references

- classification: `DUPLICATED_COVERAGE`
- authority: historical install-reference closure evidence only
- retention: retained unchanged at current path
- current release gate: no

## 5. Failure Interpretation

Legacy verifier failure in a current clean checkout does not automatically mean that the current canonical `v7.0.1` baseline has failed.

The CLI hotfix verifier preserves a historical exact-phrase contract.

The commercial-positioning and public-install verifiers preserve historical ordering contracts.

Current page and README authority should be judged by the canonical verifiers and the current documentation set.

Historical verifier failure cannot override a current canonical PASS result.

Historical verifiers must not be described as current release acceptance requirements.

## 6. Historical Replay Guidance

Interpret the original release-stage contracts through their corresponding historical commits and release documents.

Current main does not promise to keep satisfying every older release-stage exact wording or ordering assertion.

The scripts stay in place to preserve historical traceability and reference stability.

Retaining a historical script does not preserve current verifier authority.

Do not restore stale product wording on current main just to make older verifiers pass.

## 7. Reference Preservation

The CLI hotfix verifier is still referenced by its historical release note.

The commercial-positioning and public-install verifiers are still referenced by other historical verifier scripts.

For that reason, this closure does not move or delete any file.

All existing historical paths remain valid.

This document does not claim that all historical verifiers can be replayed successfully against current main.

## 8. Explicit Non-Goals

- no runtime behavior change
- no CLI semantic change
- no audit / permit / classify change
- no license / pricing / checkout / entitlement change
- no package version or export change
- no verifier rewrite
- no verifier move
- no verifier deletion
- no package.json change
- no authority expansion
- no External Evidence service implementation

## 9. Final Decision

`DOCUMENTATION_ONLY_DEAUTHORIZATION_COMPLETE;`
`LEGACY_SCRIPTS_RETAINED_IN_PLACE;`
`CURRENT_CANONICAL_AGGREGATE_UNCHANGED`