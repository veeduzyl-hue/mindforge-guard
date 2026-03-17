# MindForge Guard

MindForge Guard is a commercial CLI for deterministic AI coding governance.

It is positioned as:
- AI Coding Safety Layer
- Evolving toward a Deterministic Execution Authority Layer

Guard is CLI-first, offline-capable, and built around stable exit codes plus machine-readable JSON artifacts.
Current checkpoint release: `v1.1.0`, adding canonical action classify plus local contract hardening.

## Current Stable Release

- Current release: `v1.1.0`
- `v1.1.0` is the current Canonical Action checkpoint release
- This release adds `guard action classify` and a validated `canonical_action` artifact
- Execution-path integrations remain out of scope for this release, including audit / drift / permit / policy enforcement hookups

## Core Commands

Basic surface:

```bash
node packages/guard/bin/guard.mjs --version
node packages/guard/bin/guard.mjs --help
node packages/guard/bin/guard.mjs status
```

Governance workflow:

```bash
node packages/guard/bin/guard.mjs validate-policy
node packages/guard/bin/guard.mjs audit . --staged
node packages/guard/bin/guard.mjs snapshot .
```

New in `v1.1.0`:

```bash
node packages/guard/bin/guard.mjs action classify --text "write file README.md"
```

This returns a `canonical_action` JSON artifact with local schema validation and fail-closed behavior for invalid classify output.

Signal and analytics surface:

```bash
node packages/guard/bin/guard.mjs drift status --format json
node packages/guard/bin/guard.mjs drift timeline
node packages/guard/bin/guard.mjs drift compare
node packages/guard/bin/guard.mjs assoc correlate
```

## License and Edition Behavior

Canonical edition model:

- `community`
- `pro`
- `pro_plus`
- `enterprise`

Current CLI gating:

| Command | Community | Pro | Pro Plus | Enterprise |
|---|---|---|---|---|
| `guard drift status` | Yes | Yes | Yes | Yes |
| `guard drift timeline` | No | Yes | Yes | Yes |
| `guard drift compare` | No | No | Yes | Yes |
| `guard assoc correlate` | No | No | Yes | Yes |

Without the required license, gated commands fail closed with structured JSON and exit code `21`.

## Exit Codes

Guard preserves these stable exit semantics:

| Code | Meaning |
|---|---|
| `0` | Success |
| `10` | Soft governance block |
| `20` | Hard governance block |
| `21` | License required |
| `30` | Command-scoped validation or runtime contract error |

## Documentation

- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
- [docs/SECURITY.md](/D:/AI%20project/mindforge-guard/docs/SECURITY.md)
- [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md)
- [docs/ROADMAP_GUARD_1X.md](/D:/AI%20project/mindforge-guard/docs/ROADMAP_GUARD_1X.md)

## Notes

- `guard audit . --staged` requires a git-accessible repository state.
- `guard snapshot .` requires a previously generated audit artifact.
- `v1.1.0` establishes a bounded Canonical Action checkpoint.
- Execution-path integrations remain out of scope for this release.
