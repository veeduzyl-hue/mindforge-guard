# MindForge Guard Release Process

MindForge Guard ships primarily through GitHub Releases. npm publish remains optional.

## Current Released Baseline

The currently released governance baseline is:

- `v6.12.0 = Governance Case Closure Evidence Package Delivery Manifest / Acceptance Semantics Finalization v1`

This release remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

## Recommended Next Release

The recommended next release is:

- `v6.13.0 = Commercial Edition Boundary Completion`

Why `v6.13.0`:

- it keeps `v6.12.0` intact as the already-released governance baseline
- it promotes the existing edition functionality into a formal commercial promise surface
- it is a product-boundary uplift, not a patch to `v6.12.0`

## Scope Of `v6.13.0`

`v6.13.0` should formalize:

- Community / Pro / Pro+ / Enterprise boundaries
- license gate JSON contract
- edition mismatch JSON contract
- exit-code commitments for gated commercial surfaces
- accepted edition evidence

It should not add:

- authority expansion
- permit-lane consumption
- execution binding
- main-path takeover
- risk integration
- UI / control-plane behavior

## Release Verification

From the repository root:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs --help
node packages/guard/src/runGuard.mjs status
npm run verify:core
npm run verify:v612
node scripts/verify_commercial_edition_boundary.mjs
```

Use [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md) as the release verification matrix.
