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

Studio does not independently compute governance logic.

## Local-First Workspace Boundary

The prototype is intentionally local-first.

It is a review workspace for:

- Evidence Pack status
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

- The UI is a static prototype skeleton.
- Import and export controls are placeholders.
- HTML preview embedding is deferred.
- Sample orchestration is local and fixture-based.

These limits are intentional for the first bounded Studio step.
