# Studio Local Browser Wiring

This directory holds the local-first Studio prototype with bounded browser-side file, download, and HTML preview sandbox wiring for MindForge Guard.

## What It Includes

- `index.html`: a static review surface with local file selection, paste JSON input, local status, local download controls, and a sandboxed HTML preview area.
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

- Browser file input stays inside the current browser session.
- Paste JSON stays inside the current browser session.
- Studio does not send pack input off-device.
- Studio does not keep pack input in hosted persistence.
- Studio does not inspect artifact files referenced by a pack.
- Studio does not run commands declared inside a pack.
- Browser sample mode does not fabricate Markdown reports, HTML reports, or Evidence Index JSON.
- Browser HTML preview uses a sandboxed iframe and only consumes workflow-produced renderer output.
- The iframe does not allow scripts, forms, same-origin access, or popups.
- Studio browser downloads remain disabled until workflow-produced outputs are loaded.
- Studio browser downloads are created only from Markdown, HTML, and Evidence Index strings already produced by the local Studio workflow / Guard Core / renderers.
- Studio only returns downstream Markdown, HTML, and Evidence Index outputs that originate from Guard-owned functions.

That means the browser page can:

- read a chosen local JSON file with browser file APIs
- keep pasted JSON in local in-memory state
- update UI status
- save workflow-produced output strings as local files after they are loaded

The browser page does not:

- compute verdicts
- compute reason codes
- compute risk
- compute coverage
- parse or validate packs on its own
- inspect artifact paths
- generate governance reports or Evidence Index JSON in browser-side JavaScript
- render or author governance HTML in browser-side JavaScript
- create a second report model

## Current Prototype Limits

- Browser-side file selection is local-only UX wiring.
- Paste JSON is local-only UX wiring.
- Imported pack handoff remains a faithful local prototype step until a local runtime bridges the page to `runImportedPack(...)`.
- Browser sample mode only shows local metadata and does not preload downloadable artifacts.
- Browser downloads are limited to workflow-produced strings that are already loaded into the page.
- HTML preview remains a local sandbox for already-produced renderer output only.
