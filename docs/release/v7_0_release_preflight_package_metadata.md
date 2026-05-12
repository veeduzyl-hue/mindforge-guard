# v7.0 Release Preflight / Package Metadata Hardening

## Status

- release preflight / package metadata hardening
- no tag created by this PR
- no GitHub Release published by this PR
- no package published by this PR
- package version prepared for v7.0.0
- npm pack / dry-run still required after this PR
- package contents review still required after this PR
- package metadata license aligned to packaged LICENSE
- current package target is `packages/guard`
- Wave 4 License Hub / mindforge.run Copy Candidate requires separate explicit approval

## Scope

- align `packages/guard/package.json` package metadata for the `v7.0.0` package target
- align `packages/guard/README.md` package release wording and fallback tarball example for `v7.0.0`
- record that package metadata hardening is complete before any tag / GitHub Release / package publish decision

## Not Included

- no tag creation
- no GitHub Release publication
- no npm/package publish
- no npm pack artifact retained by this PR
- no License Hub change
- no pricing change
- no checkout change
- no Paddle change
- no license API change
- no runtime authority change
- no entitlement change
- no GitHub Action launch
- no Marketplace launch
- no mindforge.run change

## Boundary

- recommendation-only preserved
- additive-only preserved
- non-executing preserved
- default-off where applicable preserved
- non-control-plane preserved
- human-review-oriented preserved
- `audit` / `permit` / `classify` / `drift` / `license` semantics unchanged
- deny exit code `25` unchanged

## Follow-up Before Release Execution

- run `npm pack --dry-run` for `packages/guard`
- review package contents before publish
- review GitHub Release body before publication
- require separate explicit approval for tag, GitHub Release, and npm publish
