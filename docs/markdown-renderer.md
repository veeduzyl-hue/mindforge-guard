# Markdown Governance Report Renderer

## 1. Purpose

The Markdown renderer is the first downstream presentation layer for `GovernanceReportModel`.

It turns an already-created Guard Core governance report into readable Markdown for technical and non-technical reviewers.

## 2. Input Boundary

The renderer consumes `GovernanceReportModel` only.

That boundary is intentional:

- Guard Core remains the only governance source of truth
- the report model remains the canonical Guard Core output contract
- the renderer remains a presentation-only consumer

## 3. What The Renderer Does

`renderMarkdownReport(report)` accepts a `GovernanceReportModel` and returns a Markdown string.

The renderer presents:

- report identity
- workflow context
- verdict summary
- authority and scope summaries
- evidence coverage and risk summaries
- blocked actions
- verification counts
- missing evidence
- human review requirements
- next actions
- evidence references
- provenance

## 4. What The Renderer Does Not Do

The Markdown renderer does not:

- compute verdicts
- compute risk
- compute reason codes
- compute evidence coverage
- parse Evidence Packs
- validate Evidence Packs
- inspect artifact file contents
- call tools or external systems
- call network or model APIs
- perform scanning
- approve actions
- deploy or rollback anything

## 5. Relationship To Guard Core

The renderer is downstream of the Guard Core Report Service.

Guard Core owns:

- Evidence Pack parsing
- Evidence Pack validation
- evidence coverage inspection
- canonical reason code selection
- deterministic verdict logic
- Governance Report model generation

The renderer owns Markdown formatting only.

## 6. Reason Code Handling

The renderer may display reason codes that are already present in the `GovernanceReportModel`.

It must not invent new reason codes or create a parallel reason-code vocabulary.

## 7. Non-Goals

This PR does not add:

- an HTML renderer
- Studio
- SDK
- Harness alignment
- runtime CLI changes
- parser or validator changes
- report-service behavior changes
- commercial repositioning

It does not change the current `v7.0.1` commercial boundary.

## 8. Boundary Notes

The Markdown renderer remains:

- presentation-only
- downstream of Guard Core
- non-executing
- local-first
- evidence-first
- cross-runtime
- independent from Harness, Studio, SDK, and runtime CLI behavior
