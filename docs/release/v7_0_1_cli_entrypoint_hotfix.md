# v7.0.1 CLI Entrypoint Hotfix

## Summary

- restore packaged CLI entrypoint execution for `guard`
- prepare `@veeduzyl/mindforge-guard` package metadata for `v7.0.1`
- preserve recommendation-only, additive-only, non-executing, default-off, and human-review-oriented boundaries

## Root Cause

`packages/guard/bin/guard.mjs` imported `../src/runGuard.mjs` but did not invoke `runGuard`.

That left the published npm `guard` shim resolving to the packaged bin file while the bin file itself performed no CLI execution work, so `--version`, `-v`, and `--help` completed with no output.

## Boundary

- only `packages/guard/bin/guard.mjs` is changed for runtime behavior
- package version is advanced from `7.0.0` to `7.0.1`
- package README release wording is updated for the current package release
- this hotfix adds a dedicated verifier and release note only
- no `audit` / `permit` / `classify` / `drift` / `license` semantics change
- deny exit code `25` unchanged
- no License Hub, pricing, checkout, entitlement, runtime authority, GitHub Action, Marketplace, or mindforge.run changes

## Runtime Smoke Checks

- `node packages/guard/bin/guard.mjs --version`
- `node packages/guard/bin/guard.mjs -v`
- `node packages/guard/bin/guard.mjs --help`
- `--version` result: `guard 7.0.1`
- `-v` result: `guard 7.0.1`
- `--help` result: help and usage text printed successfully

## npm Pack Dry-run

- `cd packages/guard`
- `npm pack --dry-run`
- dry-run filename preview: `veeduzyl-mindforge-guard-7.0.1.tgz`
- package size: `293.8 kB`
- unpacked size: `2.5 MB`
- total files: `287`
- dry-run completed without publishing a package
- no `.tgz` artifact was retained in the repository working tree

## Verification

- `node scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs`
- `node scripts/verify_v7_0_npm_pack_dry_run_review.mjs`
- `node scripts/verify_v7_0_release_preflight_package_metadata.mjs`
- `node scripts/verify_v7_0_commercial_release_gate_review.mjs`
- `verify_v7_0_1_cli_entrypoint_hotfix.mjs`: pass
- `verify_v7_0_commercial_release_gate_review.mjs`: pass
- `verify_v7_0_npm_pack_dry_run_review.mjs`: fails because the existing verifier is pinned to package version `7.0.0`
- `verify_v7_0_release_preflight_package_metadata.mjs`: fails because the existing verifier is pinned to package version `7.0.0`

## Changed Files

- `packages/guard/bin/guard.mjs`
- `packages/guard/package.json`
- `packages/guard/README.md`
- `docs/release/v7_0_1_cli_entrypoint_hotfix.md`
- `scripts/verify_v7_0_1_cli_entrypoint_hotfix.mjs`
