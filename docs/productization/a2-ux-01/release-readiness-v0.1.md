# A2-UX-01 Release Readiness v0.1

## Fixed baseline

- main: `46d77530a28b0a28d02e1c7ba29ccfa52e265849`
- sample pack tree: `f943fc9ced5f3087e70ecebcdf1cc7a5b323cce1`
- published package: `@veeduzyl/mindforge-guard@7.0.1`
- English HTML renderer is on main after PR #349 but not in npm v7.0.1.

## Candidate gates

1. Standalone ZIP contains exactly eleven fixed source files, byte-identical to source Git blobs.
2. Archive SHA-256 and manifest are generated and independently checked.
3. Pack Validate and Single-Agent Report work after extracting the standalone ZIP.
4. Source-branch renderer produces deterministic, offline English HTML without modifying source JSON.
5. Windows PowerShell 5.1 UTF-8 capture is tested and documented.
6. Linux and Windows CI both pass. A CI runner is not a substitute for fresh non-admin Windows human validation.
7. Commercial copy matches actually released capabilities; Community first report remains free and prices unchanged.
8. Separate Owner decision required for version bump, npm publish, tag, GitHub Release or website deployment.

## Not authorized

No pricing/entitlement changes, Paddle/License Hub/checkout edits, deployment, npm publication, version/tag change, CI merge gate, approval or execution authority, or reopening T2/T3/Producer/EAK/MESR/Sebbi.
