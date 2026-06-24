# Studio Prototype Skeleton

This directory holds the first local-first Studio prototype skeleton for MindForge Guard.

## What It Includes

- `index.html`: a static review surface that shows the intended Studio panels.
- `studioWorkflow.mjs`: a thin Node-side orchestration layer that loads a local sample pack and calls Guard-owned functions only.

## How To Use It

Open the static prototype:

```powershell
Start-Process "D:\AI project\mindforge-guard\prototypes\studio\index.html"
```

Run the sample workflow in Node:

```powershell
node prototypes/studio/studioWorkflow.mjs ai-pr-low-risk-complete
```

Other supported sample names:

- `ai-pr-missing-tests`
- `release-prep-missing-rollback`

## Boundary

Studio remains a local-first review workspace.

It consumes:

- Evidence Pack input
- Guard Core parse / validate / report generation
- Markdown renderer output
- HTML renderer output
- Evidence Index output

It does not:

- compute verdicts
- compute reason codes
- compute risk
- compute coverage
- parse packs outside Guard Core
- validate packs outside Guard Core
- inspect artifact file contents
- run Evidence Pack actions
- call network or model APIs
- add approval or deployment behavior

## Current Prototype Limits

- The browser UI is intentionally static.
- Export controls are placeholders only.
- HTML preview embedding is deferred to a later bounded PR.
- The workflow module uses local sample fixtures only.
