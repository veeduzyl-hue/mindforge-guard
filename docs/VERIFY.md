# VERIFY.md - Release Verification Matrix

**Purpose**: Document the current verification surface for `mindforge-guard`.  
**Last Updated**: 2026-05-18  
**Released Baseline**: `v7.0.1`  
**Next Recommended Maintenance Release**: `v7.0.2`

---

## 1. Released Baseline Verification

The current published install package is `v7.0.1`.

It continues the released verification line built on:

- `v6.12.0 = Governance Case Closure Evidence Package Delivery Manifest / Acceptance Semantics Finalization v1`
- `v6.13.0 = Commercial Edition Boundary Completion`

The released baseline remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

Required commands:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs --help
node packages/guard/src/runGuard.mjs status
npm run verify:core
npm run verify:v612
```

## 2. Commercial Edition Boundary Verification

The current commercial release line preserves the commercial edition promise surface introduced in `v6.13.0`.

Required targeted verification:

```bash
node scripts/verify_commercial_edition_boundary.mjs
node packages/guard/src/runGuard.mjs --help
node packages/guard/src/runGuard.mjs status
```

This verification confirms:

- Community / Pro / Pro+ / Enterprise edition normalization
- `license_required` gate contract for missing / invalid / expired / not_yet_valid licenses
- `edition_mismatch` gate contract for valid-but-insufficient editions
- stable gated exit code `21`
- unchanged audit / classify / main-path posture

## 3. Release Evidence

The canonical release-boundary evidence for `v6.13.0` is:

- [docs/archive/status/STATUS_v6.13_commercial_edition_boundary_completion.md](/D:/AI%20project/mindforge-guard/docs/archive/status/STATUS_v6.13_commercial_edition_boundary_completion.md)

It is valid for:

- command availability facts
- gating behavior facts
- license lifecycle handling facts
- Community / Pro / Pro+ / Enterprise boundary evidence

## 4. Stable Compatibility Commitments

The current release line preserves:

- `audit` main output unchanged
- `audit` verdict unchanged
- `audit` exit semantics unchanged
- permit behavior unchanged unless explicitly scoped
- classify behavior unchanged unless explicitly scoped
- recommendation-only posture
- additive-only posture
- non-executing posture
- default-off posture
- no authority scope expansion

## 5. Exit Semantics

Current commercial gate contract:

- success: `0`
- license gate: `21`
- command-scoped validation / runtime error: `30`

The commercial edition boundary formalizes:

- `license_required` for missing / invalid / expired / not_yet_valid license states
- `edition_mismatch` for valid-but-insufficient edition states

## 6. Smoke Notes

When run as part of release verification:

- `node packages/guard/src/runGuard.mjs audit . --staged`
- `node packages/guard/src/runGuard.mjs audit . --staged --permit-gate`

may pass with `staged diff=0`.

That is valid smoke evidence only. It is not a broader claim of arbitrary-change coverage.

## 7. v6.14 Preview Verification

`v6.14` remains preview / next-line verification only. It is not the current public install package baseline. The current public install package baseline remains `v7.0.1`.

The `v6.14` authority preview line remains:

- additive-only
- recommendation-only
- non-executing
- default-off

Operational preview verification:

```bash
node scripts/verify_v6_14_authority_boundary_fixtures.mjs
node scripts/verify_v6_14_authority_check_preview.mjs
node scripts/verify_v6_14_authority_preview_acceptance.mjs
```

For this preview line, `outside_scope` remains a decision result only.

## 8. v6.15 Preview Verification

`v6.15` remains preview / next-line verification only. It does not change the current public install package baseline, which remains `v7.0.1`.

The `v6.15` authority explain preview line remains:

- additive-only
- preview-only
- fixture-backed
- explanation-only
- non-enforcing
- derived-only
- default-off
- machine-verifiable

Operational preview verification:

```bash
node scripts/verify_v6_15_authority_explain_preview.mjs
node scripts/verify_v6_15_authority_explain_acceptance.mjs
node scripts/verify_v6_15_authority_explain_final_acceptance.mjs
```

This preview line preserves:

- `guard authority check --preview --json --fixture-file <file>` unchanged
- `guard authority explain --preview --json --fixture-file <file>` additive-only
- `state_validity_at_bind_time` with `enforced: false`
- reserved-only `admissibility_result`
- reserved-only `commitment_candidate`
- deferred `commitment_receipt`
- no exit `21`
- no exit `25`

## 9. v6.16 Preview Verification

`v6.16` remains preview / next-line verification only. It does not change the current public install package baseline, which remains `v7.0.1`.

The `v6.16` grounding / provenance preview line remains:

- additive-only
- preview-only
- fixture-backed
- explanation-only
- supporting-only
- non-enforcing
- default-off
- machine-verifiable

Operational preview verification:

```bash
node scripts/verify_v6_16_grounding_boundary_fixtures.mjs
node scripts/verify_v6_16_grounding_explain_preview.mjs
node scripts/verify_v6_16_grounding_explain_acceptance.mjs
node scripts/verify_v6_16_grounding_explain_final_acceptance.mjs
```

This preview line preserves:

- `guard grounding explain --preview --json --fixture-file <file>` additive-only
- explicit `evidence_adequacy` as supporting-only and non-authoritative
- reserved-only `admissibility_readiness`
- no exit `21`
- no exit `25`

## 10. v6.17 Final Acceptance Verification

`v6.17` remains internal final-acceptance verification only. It does not change the current public install package baseline, which remains `v7.0.1`.

Internal final acceptance verification:

```bash
node scripts/verify_v6_17_admissibility_explain_final_acceptance.mjs
```

## 11. v6.18 Preview Verification

`v6.18` remains internal preview-only verification. It does not change the current public install package baseline, which remains `v7.0.1`.

Internal preview verification:

```bash
node scripts/verify_v6_18_authority_drift_boundary_fixtures.mjs
node scripts/verify_v6_18_authority_drift_preview.mjs
node scripts/verify_v6_18_authority_drift_acceptance.mjs
node scripts/verify_v6_18_authority_drift_final_acceptance.mjs
```

This preview line preserves:

- `guard authority drift --preview --json --fixture-file <file>` as an additive-only internal preview surface
- explanation-only execution-time authority validity output
- `execution_authority_granted: false`
- `blocking_effect: false`
- `enforcement_action: "none"`
- no exit `21`
- no exit `25`
- no current commercial entitlement change

## 12. v7.0.1 License Hub After-Purchase Onboarding Verification

`v7.0.1` License Hub onboarding remains a bounded commercial copy update only. It does not change runtime behavior, pricing values, checkout behavior, entitlement, or CLI semantics.

Required targeted verification:

```bash
node scripts/verify_v7_0_1_license_hub_after_purchase_copy.mjs
```

This verification confirms:

- after-purchase onboarding copy is present on License Hub home and docs surfaces
- first-run local install and license commands are present
- report-reading guidance includes authority boundary, execution evidence, missing evidence, and risk/drift signals
- the commercial boundary still states that Guard does not approve, block, deploy, certify, or control execution
- Enterprise copy preserves `No extra runtime authority`

## 13. v7.0.1 Public Surface Consistency Verification

`v7.0.1` public surface consistency remains a bounded docs, metadata, link, and copy cleanup only. It does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, or CLI semantics.

Required targeted verification:

```bash
node scripts/verify_v7_0_1_public_surface_consistency.mjs
```

This verification confirms:

- README, npm package README, and public guide surfaces align on the v7.0.1 single-agent governance evidence story
- the current public first-report guide is `docs/product/current/first-governance-report.md`
- the superseded `v7_0_first_report.md` page no longer presents candidate or not-public-launch language
- License Hub public docs links point to the current first-report guide
- deny exit code `25` remains unchanged

## 14. v7.0.1 Current Docs Baseline Verification

`v7.0.1` current docs baseline verification remains a bounded docs, verifier, and link hygiene update only. It does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, or CLI semantics.

Required targeted verification:

```bash
node scripts/verify_v7_0_1_current_docs_baseline.mjs
```

This verification confirms:

- current buyer-facing docs state that `v7.0.1` is the current public commercial baseline
- current edition and trust docs align with the single-agent governance evidence story
- historical `v6.13` baseline guidance remains available as a superseded pointer instead of the current baseline page
- Enterprise keeps the same bounded runtime posture with No extra runtime authority

## 15. v7.0.1 GitHub Action First Report Verification

`v7.0.1` GitHub Action first-report readiness remains a bounded GitHub Action demo, docs, and verifier update only. It does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, CLI semantics, License Hub production behavior, or Vercel production deployment settings.

Required targeted verification:

```bash
node scripts/verify_v7_0_1_github_action_first_report.mjs
```

This verifier checks that the GitHub Action is manually triggered, installs `@veeduzyl/mindforge-guard@7.0.1`, runs the first-report commands, uploads deterministic review artifacts, and does not present itself as an approval, blocking, deployment, or compliance workflow.

It confirms the workflow produces review artifacts only and does not approve, block, deploy, certify, or control execution.

## 16. v7.1 Adoption Readiness Docs Verification

`v7.1` adoption readiness remains a bounded docs, examples, templates, report-handoff, and verifier update only. It does not change runtime behavior, pricing values, checkout behavior, Paddle behavior, license signing, entitlement, CLI semantics, License Hub production behavior, or Vercel production deployment settings.

Required targeted verification:

```bash
node scripts/verify_v7_1_adoption_readiness_docs.mjs
```

This verifier checks that the Bring Your Own Workflow guide, Evidence Pack templates, human-readable report sample, external copy-paste GitHub Action workflow, design partner walkthrough, and Security Review Packet v1 are present and preserve the bounded runtime posture.

It confirms the adoption-readiness surface produces review artifacts only and does not approve, block, deploy, certify, guarantee legal compliance, or control execution.

## 17. See Also

- [RELEASE.md](/D:/AI%20project/mindforge-guard/RELEASE.md)
- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
