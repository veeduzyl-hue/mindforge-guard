# VERIFY.md - Release Verification Matrix

**Purpose**: Document the current verification surface for `mindforge-guard`.  
**Last Updated**: 2026-04-30  
**Released Baseline**: `v6.13.1`  
**Next Recommended Maintenance Release**: `v6.13.2`

---

## 1. Released Baseline Verification

The current published install package is `v6.13.1`.

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

`v6.14` remains preview / next-line verification only. It is not the current commercial release baseline. The current commercial release baseline remains `v6.13.1`.

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

`v6.15` remains preview / next-line verification only. It does not change the current commercial release baseline, which remains `v6.13.1`.

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

## 9. See Also

- [RELEASE.md](/D:/AI%20project/mindforge-guard/RELEASE.md)
- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
