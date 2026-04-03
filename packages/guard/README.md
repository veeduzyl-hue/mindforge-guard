# MindForge Guard

MindForge Guard is a deterministic governance CLI for bounded, auditable artifact production.

## Released Baseline

The current released governance baseline is `v6.12.0`.

It remains:

- supporting-artifact-only
- non-authoritative
- additive-only
- non-executing
- default-off

## Formal CLI Surface

Run from the repository root:

```bash
node packages/guard/bin/guard.mjs --version
node packages/guard/bin/guard.mjs --help
node packages/guard/bin/guard.mjs status
node packages/guard/bin/guard.mjs validate-policy
node packages/guard/bin/guard.mjs audit . --staged
node packages/guard/bin/guard.mjs snapshot .
node packages/guard/bin/guard.mjs action classify --text "write file README.md"
node packages/guard/bin/guard.mjs drift status --format json
node packages/guard/bin/guard.mjs license status
node packages/guard/bin/guard.mjs license show
node packages/guard/bin/guard.mjs license verify --file <file>
node packages/guard/bin/guard.mjs license install --file <file>
node packages/guard/bin/guard.mjs license remove
```

Paid analytics commands:

```bash
node packages/guard/bin/guard.mjs drift timeline
node packages/guard/bin/guard.mjs drift compare
node packages/guard/bin/guard.mjs assoc correlate
```

## Edition Boundary

| Edition | Formal command promise |
|---|---|
| Community | Core governance CLI + `drift status` + license lifecycle commands |
| Pro | Community + `drift timeline` |
| Pro+ | Pro + `drift compare` + `assoc correlate` |
| Enterprise | Same current CLI entitlement as Pro+; no extra runtime authority or extra commands promised in this release |

See:

- [docs/EDITIONS.md](../../docs/EDITIONS.md)
- [docs/LICENSE.md](../../docs/LICENSE.md)
- [docs/VERIFY.md](../../docs/VERIFY.md)

## License Activation UX

Guard installs the local license file to:

- Windows: `C:\Users\<user>\.guard\license.json`
- macOS/Linux: `~/.guard/license.json`

Recommended flow:

```bash
node packages/guard/bin/guard.mjs license verify --file downloaded-license.json
node packages/guard/bin/guard.mjs license install --file downloaded-license.json
node packages/guard/bin/guard.mjs license status
node packages/guard/bin/guard.mjs status
```

Get the signed license JSON from License Hub:

- customer portal download
- resend email from License Hub

Helpful surfaces:

- `guard license status` shows current state, install path, edition, and next step
- `guard license show` returns the structured local inspection result
- `guard status` includes the repo policy, drift summary, and local license guidance
