# VERIFY.md - Release Verification Matrix

**Purpose**: Document the current verification surface for `mindforge-guard`.  
**Last Updated**: 2026-04-01  
**Released Baseline**: `v6.12.0`  
**Next Recommended Release**: `v6.13.0`

---

## 1. Released Baseline Verification

`v6.12.0 = Governance Case Closure Evidence Package Delivery Manifest / Acceptance Semantics Finalization v1`

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

The next recommended release `v6.13.0` formalizes the commercial edition promise surface.

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

- [docs/STATUS_v6.13_commercial_edition_boundary_completion.md](/D:/AI%20project/mindforge-guard/docs/STATUS_v6.13_commercial_edition_boundary_completion.md)

It is valid for:

- command availability facts
- gating behavior facts
- license lifecycle handling facts
- Community / Pro / Pro+ / Enterprise boundary evidence

## 4. Stable Compatibility Commitments

The current release and the next commercial boundary release both preserve:

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

`v6.13.0` formalizes:

- `license_required` for missing / invalid / expired / not_yet_valid license states
- `edition_mismatch` for valid-but-insufficient edition states

## 6. Smoke Notes

When run as part of release verification:

- `node packages/guard/src/runGuard.mjs audit . --staged`
- `node packages/guard/src/runGuard.mjs audit . --staged --permit-gate`

may pass with `staged diff=0`.

That is valid smoke evidence only. It is not a broader claim of arbitrary-change coverage.

## 7. See Also

- [RELEASE.md](/D:/AI%20project/mindforge-guard/RELEASE.md)
- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
