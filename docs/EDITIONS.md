# Guard Editions And Command Map

MindForge Guard currently exposes four canonical editions:

- `community`
- `pro`
- `pro_plus`
- `enterprise`

This page maps the implemented CLI commands to the current edition boundary. It lists only commands that are actually exposed by the CLI.

## Edition Summary

- `community`: base local governance CLI and local license lifecycle commands
- `pro`: Community plus `guard drift timeline`
- `pro_plus`: Pro plus `guard drift compare` and `guard assoc correlate`
- `enterprise`: same current CLI entitlement as Pro+ in this release, with no extra runtime authority added

## Command Map

| Command | Community | Pro | Pro+ | Enterprise | Notes |
|---|---|---|---|---|---|
| `guard status` | Yes | Yes | Yes | Yes | Local status summary; works without a paid license |
| `guard init` | Yes | Yes | Yes | Yes | Creates `.mindforge/config/policy.json` in the current repo |
| `guard validate-policy` | Yes | Yes | Yes | Yes | Validates the repo policy file |
| `guard audit . --staged` | Yes | Yes | Yes | Yes | Repo-local audit path |
| `guard snapshot .` | Yes | Yes | Yes | Yes | Uses the latest local audit artifact |
| `guard action classify --text "<string>"` | Yes | Yes | Yes | Yes | Deterministic action classification |
| `guard drift status` | Yes | Yes | Yes | Yes | Signal-only drift summary; no policy required |
| `guard drift timeline` | No | Yes | Yes | Yes | Edition-gated; also needs local drift event data |
| `guard drift compare` | No | No | Yes | Yes | Edition-gated; also needs local drift event data |
| `guard assoc correlate` | No | No | Yes | Yes | Edition-gated analytics command |
| `guard license verify --file <file>` | Yes | Yes | Yes | Yes | Verifies a downloaded license file before install |
| `guard license install --file <file>` | Yes | Yes | Yes | Yes | Installs a validated license file locally |
| `guard license status` | Yes | Yes | Yes | Yes | Human-readable installed license summary |
| `guard license show` | Yes | Yes | Yes | Yes | Structured JSON license inspection |
| `guard license remove` | Yes | Yes | Yes | Yes | Removes the installed local license file |

## Gate Behavior

- `guard drift timeline` requires `pro`
- `guard drift compare` requires `pro_plus`
- `guard assoc correlate` requires `pro_plus`
- blocked paid commands exit with `21`
- missing or otherwise non-usable local license states return `license_required`
- valid but insufficient editions return `edition_mismatch`

## Notes For Buyers And Operators

- Community users do not need a paid license to use the base CLI surface.
- Pro, Pro+, and Enterprise users install a signed local license JSON with `guard license install --file <file>`.
- Enterprise does not add extra runtime commands in the current release line; it preserves the same CLI entitlement as Pro+.

Internal and supporting runtime artifacts exist elsewhere in the codebase, but they are not listed here unless they are exposed as a public CLI command.
