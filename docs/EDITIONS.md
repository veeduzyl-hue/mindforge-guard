# Guard Editions

MindForge Guard uses four canonical commercial editions:

- `community`
- `pro`
- `pro_plus`
- `enterprise`

The currently released governance baseline is `v6.12.0`.
The recommended next commercial boundary release is `v6.13.0`.

## Community

| Field | Boundary |
|---|---|
| Available commands | `status`, `validate-policy`, `audit`, `snapshot`, `action classify`, `drift status`, `license install/status/show/remove` |
| Gated commands | `drift timeline`, `drift compare`, `assoc correlate` |
| Intended users | individual developers, repo-local evaluation users, baseline governance consumers |
| Supported scenarios | local governance checks, artifact production, policy validation, repo status inspection |
| Formal promise surface | Yes |
| Compatibility requirement | Community commands must remain backward-compatible across commercial promotion releases |

## Pro

| Field | Boundary |
|---|---|
| Available commands | Community + `drift timeline` |
| Gated commands | `drift compare`, `assoc correlate` |
| Intended users | paid single-team users who need timeline-oriented drift visibility |
| Supported scenarios | trend review, lightweight historical drift inspection, paid analytics upgrade from Community |
| Formal promise surface | Yes |
| Compatibility requirement | Pro must preserve all Community behavior unchanged and add only `drift timeline` entitlement |

## Pro+

| Field | Boundary |
|---|---|
| Available commands | Pro + `drift compare`, `assoc correlate` |
| Gated commands | none inside the current paid analytics CLI surface |
| Intended users | advanced analysis users who need comparison and association analytics |
| Supported scenarios | comparative drift analysis, association analysis, fuller paid analytics workflows |
| Formal promise surface | Yes |
| Compatibility requirement | Pro+ must preserve Community and Pro behavior unchanged and add only the higher analytics entitlements |

## Enterprise

| Field | Boundary |
|---|---|
| Available commands | Same current CLI entitlement as Pro+ |
| Gated commands | none beyond current Pro+ analytics CLI surface |
| Intended users | procurement-managed organizations that require an Enterprise SKU without changing runtime governance posture |
| Supported scenarios | org purchasing, standardization, contractual procurement, same CLI command surface as Pro+ in the current release |
| Formal promise surface | Yes, with a minimal current boundary |
| Compatibility requirement | Enterprise must not imply extra runtime authority, extra execution semantics, or extra CLI commands unless explicitly released later |

## Gate Rules

| Command | Community | Pro | Pro+ | Enterprise |
|---|---|---|---|---|
| `status` | Yes | Yes | Yes | Yes |
| `validate-policy` | Yes | Yes | Yes | Yes |
| `audit` | Yes | Yes | Yes | Yes |
| `snapshot` | Yes | Yes | Yes | Yes |
| `action classify` | Yes | Yes | Yes | Yes |
| `drift status` | Yes | Yes | Yes | Yes |
| `drift timeline` | No | Yes | Yes | Yes |
| `drift compare` | No | No | Yes | Yes |
| `assoc correlate` | No | No | Yes | Yes |
| `license install / status / show / remove` | Yes | Yes | Yes | Yes |

## Formal Contract Notes

- gate exit code: `21`
- missing / invalid / expired / not_yet_valid license states return `license_required`
- valid-but-insufficient editions return `edition_mismatch`
- success remains `0`
- command-scoped validation / runtime failure remains `30`

## Release Evidence

The canonical release-boundary evidence for `v6.13.0` is:

- [docs/STATUS_v6.13_commercial_edition_boundary_completion.md](/D:/AI%20project/mindforge-guard/docs/STATUS_v6.13_commercial_edition_boundary_completion.md)

Use it for:

- edition boundary facts
- gating contract facts
- preserved invariant statements
