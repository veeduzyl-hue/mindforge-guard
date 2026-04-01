# MindForge Guard

MindForge Guard is a deterministic governance CLI for AI coding and decision surfaces.

## Product Position

Guard is:

- a deterministic governance layer
- a bounded evidence / packaging / acceptance product
- recommendation-only
- additive-only
- non-executing
- default-off where applicable

Guard is not:

- an execution authority
- a control plane
- a dashboard-first product
- a main-path takeover runtime

## Current Released Baseline

The current released governance baseline is:

- `v6.12.0 = Governance Case Closure Evidence Package Delivery Manifest / Acceptance Semantics Finalization v1`

`v6.12.0` remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

## Next Commercial Boundary Release

The recommended next release is:

- `v6.13.0 = Commercial Edition Boundary Completion`

`v6.13.0` does not rewrite `v6.12.0`.
It promotes the already-implemented Community / Pro / Pro+ / Enterprise edition line into a formal commercial promise surface.

## Formal CLI Surface

Core commands available in every edition:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs --help
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
node packages/guard/src/runGuard.mjs action classify --text "write file README.md"
node packages/guard/src/runGuard.mjs drift status --format json
node packages/guard/src/runGuard.mjs license status
node packages/guard/src/runGuard.mjs license show
node packages/guard/src/runGuard.mjs license install <file>
node packages/guard/src/runGuard.mjs license remove
```

Paid analytics commands:

```bash
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
```

## Commercial Editions

| Edition | Formal command promise |
|---|---|
| Community | Core governance CLI + `drift status` + license lifecycle commands |
| Pro | Community + `drift timeline` |
| Pro+ | Pro + `drift compare` + `assoc correlate` |
| Enterprise | Same current CLI entitlement as Pro+; no extra runtime authority or extra commands promised in this release |

See:

- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
- [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md)
- [RELEASE.md](/D:/AI%20project/mindforge-guard/RELEASE.md)
