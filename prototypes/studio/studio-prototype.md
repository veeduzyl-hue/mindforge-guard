# Studio Local Browser Wiring

This directory holds the local-first Studio prototype with bounded browser-side file, download, HTML preview sandbox wiring, an Evidence Index Explorer display surface, and a local generated-output payload helper for MindForge Guard.

## What It Includes

- `index.html`: a static review surface with local file selection, paste JSON input, local status, local download controls, a sandboxed HTML preview area, and an Evidence Index Explorer panel for already-produced entries.
- `studioWorkflow.mjs`: a thin Node-side orchestration layer that loads a local sample pack or accepts imported JSON input and calls Guard-owned functions only.
- `createGeneratedOutputPayload.mjs`: a local-only helper that runs a real Studio sample through `studioWorkflow.mjs` and prints a browser injection payload for `window.setStudioGeneratedOutputs({ markdown, html, evidenceIndexJson, slug })`.

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

Create a browser injection payload from real workflow outputs:

```powershell
node prototypes/studio/createGeneratedOutputPayload.mjs ai-pr-low-risk-complete
```

The helper also supports:

- `ai-pr-missing-tests`

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

Optional payload helper import:

```js
import { createStudioGeneratedOutputPayloadForSample } from "./prototypes/studio/createGeneratedOutputPayload.mjs";
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
- `createGeneratedOutputPayload.mjs` produces a local browser injection payload only from real workflow-produced Markdown, HTML, and Evidence Index outputs.
- The payload helper prints to stdout by default and does not write generated artifacts into the repository by default.
- Generated payloads are local helper outputs, not source-of-truth governance artifacts.
- Generated payload files should not be committed unless a separate fixture-oriented PR intentionally scopes that change.
- Evidence Index Explorer reads only the injected `evidenceIndexJson` string from `setStudioGeneratedOutputs({ markdown, html, evidenceIndexJson, slug })`.
- Evidence Index Explorer applies source, reason code text, used_by text, and ref_id/path/description search filters only against the already-loaded JSON object in memory.
- Evidence Index Explorer does not inspect Evidence Packs, artifact files, or local disk paths.
- Evidence Index Explorer does not compute reason codes, verdicts, risk, coverage, or reports.

That means the browser page can:

- read a chosen local JSON file with browser file APIs
- keep pasted JSON in local in-memory state
- update UI status
- save workflow-produced output strings as local files after they are loaded
- print a local browser injection payload from real workflow outputs in Node

The browser page does not:

- compute verdicts
- compute reason codes
- compute risk
- compute coverage
- parse or validate packs on its own
- inspect artifact paths
- inspect artifact file contents or resolve file paths from disk for the explorer
- generate governance reports or Evidence Index JSON in browser-side JavaScript
- render or author governance HTML in browser-side JavaScript
- create a second report model
- fabricate report artifacts for the browser helper

## Current Prototype Limits

- Browser-side file selection is local-only UX wiring.
- Paste JSON is local-only UX wiring.
- Imported pack handoff remains a faithful local prototype step until a local runtime bridges the page to `runImportedPack(...)`.
- Browser sample mode only shows local metadata and does not preload downloadable artifacts.
- Browser downloads are limited to workflow-produced strings that are already loaded into the page.
- HTML preview remains a local sandbox for already-produced renderer output only.
- Evidence Index Explorer is a downstream display surface for already-produced entries only; local filters do not change or recompute the index.
- Generated-output payload creation is a local-only bridge for browser injection and does not change product/runtime behavior.
