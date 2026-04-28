# Demo B: Pro Drift Visibility

## Purpose

Show how the Pro edition adds time-based drift visibility on top of the Community baseline.

## What This Demo Covers

- Community-safe status and drift inspection
- Pro drift timeline
- explicit edition-gated behavior for timeline access

## Problem It Helps Solve

Teams that already understand current drift status may need to see how drift is changing over time before deciding whether the workflow is stabilizing or becoming riskier.

## Commands

Community-safe baseline:

```bash
guard status
guard drift status --format json --pretty
```

Pro command:

```bash
guard drift timeline
```

Repo-local equivalents:

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs drift status --format json --pretty
node packages/guard/src/runGuard.mjs drift timeline
```

## Expected Outcome

- Community commands continue to work without a paid license
- `guard drift timeline` adds time-based drift visibility when a usable Pro license is installed
- the command boundary stays explicit and license-aware

## Edition Boundary

- `guard drift timeline` is edition-gated and requires `pro`
- without a usable paid license, the current expected gate response is `license_required`
- with a valid but lower edition than required, the current expected gate response is `edition_mismatch`

## Not Covered In This Demo

- `guard drift compare`, which requires `pro_plus`
- `guard assoc correlate`, which requires `pro_plus`
- future `v6.14+` roadmap capabilities, which are not described as current availability
