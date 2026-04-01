# MindForge Guard

**Commercial runtime governance for AI coding workflows.**

MindForge Guard is a command-line product for teams that want **verifiable governance**, **clear commercial edition boundaries**, and **analytics-based upgrade paths** for AI-assisted coding workflows — without turning the system into an execution authority or control plane.

## Why it exists

Most AI coding tools stop at assistance.  
MindForge Guard adds a usable commercial boundary on top of governance workflows:

- a real **Community** baseline
- a clear **Pro / Pro+ / Enterprise** upgrade path
- a formal **license gate contract**
- a **verifiable** release surface

This makes it easier to evaluate, adopt, standardize, and sell.

## Editions

| Edition | Best for | Includes |
|---|---|---|
| **Community** | individual developers, evaluation, lightweight governance | `status`, `validate-policy`, `audit`, `snapshot`, `action classify`, `drift status`, `license install/status/show/remove` |
| **Pro** | teams that need time-based drift visibility | everything in Community + `drift timeline` |
| **Pro+** | advanced workflow owners needing deeper analysis | everything in Pro + `drift compare` + `assoc correlate` |
| **Enterprise** | org-wide purchasing and standardization | current CLI entitlement same as Pro+, with enterprise procurement boundary and no extra runtime authority promised in this release |

See the full edition boundary in [`docs/EDITIONS.md`](docs/EDITIONS.md).

## Quick Start

```bash
npm install
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
node packages/guard/src/runGuard.mjs drift status --format json
```

## Demo

### Community demo

Run core governance commands without a license:

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
node packages/guard/src/runGuard.mjs drift status --format json
```

### Pro demo

See the first paid analytics boundary:

```bash
node packages/guard/src/runGuard.mjs drift timeline
```

Without a valid Pro license, Guard returns a structured `license_required` response.

### Pro+ demo

Unlock deeper analysis:

```bash
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
```

Without a sufficient license, Guard returns either `license_required` or `edition_mismatch`, depending on the current license state.

## What v6.13.0 means

There are two important release layers in this repository:

- **`v6.12.0`** = governance / supporting-artifact baseline
- **`v6.13.0`** = commercial edition boundary completion

Some Pro / Pro+ capabilities may have existed in implementation earlier.  
What changes in `v6.13.0` is that Community / Pro / Pro+ / Enterprise now become a **formal, documented, verified, and release-promised product surface**.

## Verification

```bash
npm run verify:core
npm run verify:v612
node scripts/verify_commercial_edition_boundary.mjs
```

Verification details: [`docs/VERIFY.md`](docs/VERIFY.md)

## Commercial gate contract

Formal gate behavior:

- `0` = success
- `21` = commercial gate blocked
- `30` = command/runtime validation error

Formal gate error kinds:

- `license_required`
- `edition_mismatch`

License and gate details: [`docs/LICENSE.md`](docs/LICENSE.md)

## Use cases

- **Individual developer** — add governance checks without buying into a platform
- **Team lead** — use Pro to review time-based drift visibility
- **Advanced workflow owner** — use Pro+ for comparison and correlation analysis
- **Enterprise buyer** — standardize on a commercially bounded CLI without hidden authority expansion

## Product principles

MindForge Guard remains:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable

It does **not** become:

- an execution authority
- a hidden policy enforcer
- a control plane
- a dashboard-first product

## Documentation

- [`docs/EDITIONS.md`](docs/EDITIONS.md) — commercial edition boundary
- [`docs/LICENSE.md`](docs/LICENSE.md) — license and gate contract
- [`docs/VERIFY.md`](docs/VERIFY.md) — verification surface
- [`RELEASE.md`](RELEASE.md) — release boundary and scope

## Current release line

- **Governance baseline:** `v6.12.0`
- **Current commercial boundary release:** `v6.13.0`

## License

See [`LICENSE`](LICENSE).
