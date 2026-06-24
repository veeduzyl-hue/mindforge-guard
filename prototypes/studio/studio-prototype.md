# Studio Import / Export Prototype

This directory holds the first local-first Studio prototype with bounded import / export affordances for MindForge Guard.

## What It Includes

- `index.html`: a static review surface that shows the intended import, validate, generate, and export panels.
- `studioWorkflow.mjs`: a thin Node-side orchestration layer that loads a local sample pack or accepts imported JSON input and calls Guard-owned functions only.

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

Use the imported-pack entrypoint from Node:

```js
import { runImportedPack } from "./prototypes/studio/studioWorkflow.mjs";

const result = await runImportedPack(localJsonStringOrParsedPackObject);
```

Optional local export helpers:

```js
import {
  exportEvidenceIndexJson,
  exportHtmlReportOutput,
  exportMarkdownReportOutput,
} from "./prototypes/studio/studioWorkflow.mjs";
```

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

Import and export remain local-first:

- Studio does not send packs over a network.
- Studio does not persist packs outside the local workspace.
- Studio does not inspect artifact files referenced by a pack.
- Studio does not run commands declared inside a pack.
- Studio only returns downstream Markdown, HTML, and Evidence Index outputs that originate from Guard-owned functions.

## Current Prototype Limits

- The browser UI is intentionally static.
- Import controls are conceptual only.
- Export controls are local string-returning affordances only.
- HTML preview embedding is deferred to a later bounded PR.
- Browser-side file selection and browser downloads are deferred to a later bounded PR.
