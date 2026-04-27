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

## Official Install Path

Install the public CLI package with npm:

```bash
npm install -g @veeduzyl/mindforge-guard
```

## Fallback Install Path

If npm registry install is unavailable, install the shipped package tarball directly:

```bash
npm install -g ./veeduzyl-mindforge-guard-6.13.1.tgz
```

## First Commands After Install

Run these commands after install to confirm the CLI is present and working:

```bash
guard --version
guard --help
guard status
guard validate-policy
guard drift status --format json
```

Run these inside a repository when you want working-tree governance output:

```bash
guard audit . --staged
guard snapshot .
guard action classify --text "write file README.md"
```

Paid analytics commands:

```bash
guard drift timeline
guard drift compare
guard assoc correlate
```

## Edition Boundary

| Edition | Formal command promise |
|---|---|
| Community | Core governance CLI + `drift status` + license lifecycle commands |
| Pro | Community + `drift timeline` |
| Pro+ | Pro + `drift compare` + `assoc correlate` |
| Enterprise | Same current CLI entitlement as Pro+; no extra runtime authority or extra commands promised in this release |

See:

- [EDITIONS.md](./EDITIONS.md)
- [License Guide](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/LICENSE.md)
- [Verification Guide](https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/VERIFY.md)
- [Product Baseline](../../docs/product/current-product-baseline.md)
- [Release Checklist](../../docs/release/release-readiness-checklist.md)

## License Activation UX

Guard installs the local license file to:

- Windows: `C:\Users\<user>\.guard\license.json`
- macOS/Linux: `~/.guard/license.json`

Recommended flow:

```bash
guard license verify --file downloaded-license.json
guard license install --file downloaded-license.json
guard license status
guard status
```

Get the signed license JSON from License Hub:

- customer portal download
- resend email from License Hub

Helpful surfaces:

- `guard license status` shows current state, install path, edition, and next step
- `guard license show` returns the structured local inspection result
- `guard status` includes the repo policy, drift summary, and local license guidance

## Help

- `guard --help` lists the formal CLI surface
- `guard license show` prints structured local license inspection
- [MindForge Guard homepage](https://mindforge.run)
- [Issue tracker](https://github.com/veeduzyl-hue/mindforge-guard/issues)
