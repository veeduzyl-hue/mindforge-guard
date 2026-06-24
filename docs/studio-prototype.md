# Studio Prototype

## Purpose

Studio is the first local-first review workspace prototype for Outcome Foundation consumer surfaces.

Its job is to help a reviewer move through a bounded sequence:

1. Run a sample or import a pack
2. Parse and validate through Guard Core
3. Generate the canonical `GovernanceReportModel`
4. View downstream Markdown and HTML render outputs
5. Export a downstream Evidence Index

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

Studio does not independently compute governance logic.

## Local-First Workspace Boundary

The prototype is intentionally local-first.

It is a review workspace for:

- Evidence Pack status
- local pack import affordances
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

- Studio does not send packs over a network.
- Studio does not persist packs outside the local workspace.
- Studio does not execute pack actions during import.
- Studio does not inspect artifact files referenced by a pack.
- Studio only calls Guard Core and renderer functions to produce downstream outputs.

## Output Relationships

Studio works with bounded, existing artifacts:

- Evidence Pack: factual input only
- `GovernanceReportModel`: canonical Guard Core output contract
- Markdown renderer output: downstream presentation only
- HTML renderer output: downstream presentation only
- Evidence Index: downstream traceability only

That means Studio can display and export these outputs, but it must not replace their source logic.

## Prototype Shape

The first prototype is a static skeleton plus a thin Node-side workflow module:

- `prototypes/studio/index.html`
- `prototypes/studio/studioWorkflow.mjs`
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
- Import controls remain conceptual in the browser.
- Export controls remain local-only affordances and string helpers.
- HTML preview embedding is deferred.
- Sample orchestration remains local and fixture-based.

These limits are intentional for the first bounded Studio step.
