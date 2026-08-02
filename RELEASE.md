# MindForge Guard Release Process

MindForge Guard uses npm as the official public install path for the buyer-facing CLI package.

A version-pinned `.tgz` package remains the bounded fallback delivery path for direct handoff, mirrored release assets, or support-led recovery installs.

That fallback path does not replace the current public npm install entry point and does not change Guard runtime authority.

## Current Released Baseline

The current released public baseline is:

- `v7.0.1`
- package: `@veeduzyl/mindforge-guard@7.0.1`

This release remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

## Current Install-Facing Release

The current published install-facing release is:

- `@veeduzyl/mindforge-guard@7.0.1`

Recommended public install command:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
```

Install delivery notes:

- npm remains the official public install path
- a version-pinned `.tgz` package remains the bounded fallback delivery path
- the `.tgz` fallback is not a replacement for the public npm install entry point
- install delivery does not change CLI semantics
- install delivery does not change license, pricing, checkout, or entitlement
- install delivery does not expand authority

## Historical Release Lineage

The following releases remain important historical lineage and evidence sources for the current `v7.0.1` line:

- `v6.12.0`
  - Governance Case Closure Evidence Package Delivery Manifest / Acceptance Semantics Finalization v1
- `v6.13.0`
  - Commercial Edition Boundary Completion
- `v6.13.1`
  - npm Installation Delivery Closeout

These historical releases are not the current public baseline and should not be described with present-tense current-baseline language.

## Current Release Verification

Run the current release verification from a clean working tree or a clean CI checkout. `verify:v7.0.1` is the documented aggregate for the four canonical `v7.0.1` released-baseline verifiers in [docs/VERIFY.md](docs/VERIFY.md); it does not automatically run every `verify_v7_0_1_*` script. The existing `verify` aggregate remains unchanged.

From the repository root:

```bash
npm.cmd run verify:v7.0.1
npm.cmd run verify
git diff --check
```

Use [docs/VERIFY.md](docs/VERIFY.md) as the current release verification matrix.

## Explicit Compatibility Boundaries

This release-process clarification remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

It does not change:

- runtime behavior
- CLI semantics
- audit / permit / classify semantics
- license, pricing, checkout, or entitlement
- package version or package exports

It does not introduce:

- approval, blocking, deployment, certification, or control-plane authority
- authority expansion
- a legacy verifier lifecycle decision
