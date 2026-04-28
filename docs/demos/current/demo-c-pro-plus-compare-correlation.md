# Demo C: Pro+ Compare And Correlation

## Purpose

Show how Pro+ adds deeper comparison and correlation on top of the Pro timeline surface.

## What This Demo Covers

- Pro drift timeline as the starting point
- Pro+ compare across states
- Pro+ correlation for deeper signals

## Problem It Helps Solve

Teams that already use drift trend review may need stronger analysis across states and signal relationships without changing Guard's local-first, non-executing posture.

## Commands

Pro baseline:

```bash
guard drift timeline
```

Pro+ commands:

```bash
guard drift compare
guard assoc correlate
```

Repo-local equivalents:

```bash
node packages/guard/src/runGuard.mjs drift timeline
node packages/guard/src/runGuard.mjs drift compare
node packages/guard/src/runGuard.mjs assoc correlate
```

## Expected Outcome

- `guard drift timeline` remains the Pro baseline
- `guard drift compare` and `guard assoc correlate` extend that baseline for deeper analytics
- the workflow remains local-first and recommendation-oriented

## Edition Boundary

- `guard drift compare` requires `pro_plus`
- `guard assoc correlate` requires `pro_plus`
- in lower tiers, the current expected gate response is `license_required` or `edition_mismatch`, depending on local license state

## Not Covered In This Demo

- Enterprise procurement and support flows beyond the current CLI entitlement boundary
- Authority / Intent Boundary
- Admissibility
- Commit Gate Dry-run
- Multi-Agent Handoff
- Graph-aware Governance
- Enterprise Runtime Governance
