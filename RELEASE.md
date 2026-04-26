# MindForge Guard Release Process

MindForge Guard should use npm as the official public install path for the buyer-facing CLI package.

A packaged `.tgz` install artifact remains the bounded fallback delivery path for direct handoff, mirrored release assets, or support-led recovery installs.

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

- `v6.13.1 = npm Installation Delivery Closeout`

Why `v6.13.1`:

- it stays on the current commercial release line
- it makes npm the explicit official buyer install path
- it keeps a local `.tgz` install fallback without changing CLI semantics
- it fixes package-delivery clarity without reopening the `v6.13.0` boundary

## Scope Of `v6.13.1`

`v6.13.1` should formalize:

- official public install path = npm package install
- fallback install path = direct `.tgz` package install
- clean published package manifest with no stale local file dependency
- explicit first-run license verify/install/status guidance
- install-facing README and release wording alignment

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
$env:npm_config_cache='D:\AI project\mindforge-guard\.npm-cache'; npm.cmd pack --json --workspace @veeduzyl/mindforge-guard
tar -tf veeduzyl-mindforge-guard-6.13.1.tgz
git diff --check
```

Use [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md) as the release verification matrix.
