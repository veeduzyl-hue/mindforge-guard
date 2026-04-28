# Demo A: Community Baseline

## Purpose

Show that the Community edition already provides a real local governance workflow for safe inspection and verification.

## What This Demo Covers

- current CLI status
- local policy initialization and validation
- deterministic action classification
- current drift visibility
- base audit and snapshot flow

## Problem It Helps Solve

Teams often want a safe way to inspect AI-assisted change and repo governance state before moving into deeper paid analytics.

## Commands

Installed CLI path:

```bash
guard --version
guard status
guard init
guard validate-policy
guard action classify --text "AI updates README copy before release review"
guard drift status --format json --pretty
guard audit . --staged
guard snapshot .
```

Repo-local verification path:

```bash
node packages/guard/src/runGuard.mjs --version
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs init
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs action classify --text "AI updates README copy before release review"
node packages/guard/src/runGuard.mjs drift status --format json --pretty
node packages/guard/src/runGuard.mjs audit . --staged
node packages/guard/src/runGuard.mjs snapshot .
```

## Expected Outcome

- Guard is local-first and non-executing by default
- Community users can inspect current repo state without a paid license
- action classification and drift visibility remain inspectable before release pressure builds
- the workflow stays recommendation-oriented and does not take over execution

## Edition Boundary

- all commands shown in this demo are part of the Community baseline
- no paid license is required for the commands in this walkthrough

## Not Covered In This Demo

- `guard drift timeline`, which requires `pro`
- `guard drift compare`, which requires `pro_plus`
- `guard assoc correlate`, which requires `pro_plus`
- future `v6.14+` roadmap capabilities, which are not described as current features
