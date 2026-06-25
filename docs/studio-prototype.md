# Studio Prototype

## Purpose

Studio is the first local-first review workspace prototype for Outcome Foundation consumer surfaces.
Studio remains downstream-only.

Its job is to help a reviewer move through a bounded sequence:

1. Run a sample or import a pack
2. Parse and validate through Guard Core
3. Generate the canonical `GovernanceReportModel`
4. View downstream Markdown and HTML render outputs
5. Export a downstream Evidence Index
6. Review already-produced Evidence Index entries in a local explorer panel

Studio is not a second governance engine.

## Relationship To Guard

Studio is downstream of Guard Core.

Guard Core remains the only governance source of truth for:

- Evidence Pack parsing
- Evidence Pack validation
- governance report generation
- verdict production
- reason code production
- missing evidence production
- human review requirement production

Studio consumes existing Guard-owned functions only:

- `parseEvidencePack`
- `validateEvidencePack`
- `generateGovernanceReport`
- `generateEvidenceIndex`
- `renderMarkdownReport`
- `renderHtmlReport`

The current prototype workflow also exposes thin local-only affordances around those functions:

- `runImportedPack`
- `exportMarkdownReportOutput`
- `exportHtmlReportOutput`
- `exportEvidenceIndexJson`
- `createGeneratedOutputPayload.mjs` for local browser injection payload creation from real workflow outputs

Studio does not independently compute governance logic.

The browser explorer surface is display-only. It reads an already-produced `evidenceIndexJson`
string through `setStudioGeneratedOutputs({ markdown, html, evidenceIndexJson, slug })` and
renders local filters over that in-memory JSON only.
The payload helper is also local-only: it runs the existing Studio workflow for a sample and
prints a `window.setStudioGeneratedOutputs({ markdown, html, evidenceIndexJson, slug })` payload
to stdout without changing browser-side governance boundaries.

## Local-First Workspace Boundary

The prototype is intentionally local-first.

It is a review workspace for:

- Evidence Pack status
- local pack import affordances
- browser file selection
- paste JSON input
- validation results
- governance report output
- Markdown preview
- HTML preview
- Evidence Index preview

It does not:

- inspect artifact file contents
- execute commands from Evidence Packs
- call tools
- call network APIs
- call model APIs
- scan vulnerabilities
- approve actions
- deploy
- rollback

Import and export remain local-first:

- Browser file input stays inside the current browser session.
- Paste JSON stays inside the current browser session.
- Studio does not send pack input off-device.
- Studio does not keep pack input in hosted persistence.
- Studio does not run pack actions during import.
- Studio does not inspect artifact files referenced by a pack.
- Studio only calls Guard Core and renderer functions to produce downstream outputs.
- Browser sample mode does not fabricate Markdown reports, HTML reports, or Evidence Index JSON.
- Browser HTML preview is a sandboxed iframe that consumes workflow-produced renderer output only.
- The iframe does not allow scripts, forms, same-origin access, or popups.
- Browser downloads stay disabled until workflow-produced outputs are present.
- Browser downloads create local files only from Markdown, HTML, and Evidence Index strings already produced by the local Studio workflow / Guard Core / renderers.
- Evidence Index Explorer displays already-produced Evidence Index entries only.
- Evidence Index Explorer does not inspect Evidence Packs or artifact files.
- Evidence Index Explorer does not resolve paths from disk.
- Evidence Index Explorer does not compute reason codes, verdicts, risk, coverage, or reports.
- Evidence Index Explorer filters are local display filters only.
- Generated-output payload creation is local-only and non-executing.
- Generated payloads are not source-of-truth artifacts; Guard Core reports, renderer outputs, and Evidence Index outputs remain the source outputs.
- Generated payload files should not be committed unless a separate fixture-oriented PR intentionally scopes them.

## Output Relationships

Studio works with bounded, existing artifacts:

- Evidence Pack: factual input only
- `GovernanceReportModel`: canonical Guard Core output contract
- Markdown renderer output: downstream presentation only
- HTML renderer output: downstream presentation only
- Evidence Index: downstream traceability only

That means Studio can display and export these outputs, but it must not replace their source logic.
That includes the explorer panel, which remains a downstream consumer of the already-produced
Evidence Index JSON contract rather than a generator or validator of new governance meaning.

## Prototype Shape

The first prototype is a static skeleton plus a thin Node-side workflow module:

- `prototypes/studio/index.html`
- `prototypes/studio/studioWorkflow.mjs`
- `prototypes/studio/createGeneratedOutputPayload.mjs`
- `prototypes/studio/studio-prototype.md`

This shape was chosen because it preserves a bounded consumer surface without introducing a second app workspace, new dependency wiring, or lockfile churn.

## Non-Goals

This prototype does not introduce:

- SaaS behavior
- a hosted dashboard
- approval workflow behavior
- scanner behavior
- agent orchestration
- Harness alignment
- SDK surface
- commercial repositioning

## Current Limits

- The UI is a static prototype surface.
- Browser file selection is local-only wiring.
- Paste JSON is local-only wiring.
- Browser sample mode only displays bounded local metadata and does not preload downloadable artifacts.
- Browser HTML preview is a local sandbox for already-produced renderer output only.
- Browser downloads are local file creation for workflow-produced strings only.
- Imported pack handoff still stops at the local UX boundary inside the browser page.
- Sample orchestration remains local and fixture-based.
- Evidence Index Explorer remains local-first and downstream-only.
- Generated-output payload creation remains stdout-first and does not commit generated artifacts by default.

These limits are intentional for the first bounded Studio step.

## Smoke Verification

Run the local smoke verifier:

```powershell
node prototypes/studio/verifyStudioPrototype.mjs
```

It checks:

- the existing Studio sample workflow still produces real local outputs
- the generated-output payload helper still emits a non-empty `window.setStudioGeneratedOutputs(...)` payload
- the static browser prototype source still avoids forbidden governance, network, and unsafe iframe permission patterns
- the Studio prototype directory does not contain committed generated report, Evidence Index, or payload artifacts
- the Studio docs still state the local-first, downstream-only boundary

It does not check:

- full browser interaction behavior
- Guard Core outcome correctness beyond the existing workflow/output surface
- replacement for the repository outcome verification scripts

The smoke verifier does not replace Guard Core outcome verifiers, and it does not write generated artifacts.
