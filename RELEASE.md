# MindForge Guard Release Process

This repository ships MindForge Guard primarily through GitHub Releases. npm publish remains optional.

## Preconditions

- Node.js `>=18`
- npm available
- clean working tree
- no committed release tarballs

## 1. Update Release Metadata

Update:

- [packages/guard/package.json](/D:/AI%20project/mindforge-guard/packages/guard/package.json)
- [package-lock.json](/D:/AI%20project/mindforge-guard/package-lock.json)

## 2. Local CLI Verification

From the repository root:

```bash
node packages/guard/bin/guard.mjs --version
node packages/guard/bin/guard.mjs --help
node packages/guard/bin/guard.mjs status
node packages/guard/bin/guard.mjs audit . --staged
node packages/guard/bin/guard.mjs snapshot .
node packages/guard/bin/guard.mjs drift status --format json
node packages/guard/bin/guard.mjs drift timeline
node packages/guard/bin/guard.mjs drift compare
node packages/guard/bin/guard.mjs assoc correlate
```

Use [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md) as the public verification matrix.

## v1.0.2 Release Note Draft

`v1.0.2` is a stabilization and trust-hardening release.

### Fixed

- fixed `guard audit` runtime crash
- fixed `guard snapshot` missing-module crash
- removed silent success from gated drift analytics paths
- enforced fail-closed behavior for missing required drift input data
- aligned drift schemas with emitted payloads
- unified commercial edition naming to `community / pro / pro_plus / enterprise`
- restored runnable repo-root CLI verification flow

### Behavior Changes

- `guard audit . --staged` now returns JSON instead of crashing
- `guard snapshot .` now returns JSON instead of crashing
- `guard drift timeline` and `guard drift compare` no longer return misleading empty success payloads
- gated analytics commands now fail closed with structured JSON and stable exit codes

### Out Of Scope

- no v1.1 Canonical Action implementation
- no Risk v1 redesign
- no Drift architecture redesign
- no UI or control plane work
