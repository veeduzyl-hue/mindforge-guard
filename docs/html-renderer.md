# HTML Governance Report Renderer

## 1. Purpose

The HTML renderer is a downstream presentation layer for `GovernanceReportModel`.

It renders an already-created Guard Core governance report as static, local-first HTML for technical and non-technical reviewers.

## 2. Input Boundary

The renderer consumes `GovernanceReportModel` only.

That boundary preserves the Guard product line:

- Guard Core remains the only governance source of truth
- the report model remains the canonical Guard Core output contract
- the renderer remains presentation-only

## 3. What The Renderer Produces

`renderHtmlReport(report)` accepts a `GovernanceReportModel` and returns a static HTML string.

The HTML output includes:

- report identity
- workflow summary
- verdict summary
- authority and scope details
- evidence coverage and risk summaries
- blocked actions
- verification counts
- missing evidence
- human review requirements
- next actions
- evidence references
- provenance

## 4. What The Renderer Does Not Do

The HTML renderer does not:

- compute verdicts
- compute risk
- compute evidence coverage
- compute reason codes
- parse Evidence Packs
- validate Evidence Packs
- inspect artifact file contents
- call tools or external systems
- call network or model APIs
- scan, approve, deploy, or rollback anything

## 5. Local-First Static Output

The renderer produces local-first static HTML.

It uses semantic HTML with embedded local styling only.
It does not depend on remote CSS, JavaScript, fonts, or external hosted resources.

## 6. Relationship To Guard Core

The renderer is downstream of Guard Core Report Service output.

Guard Core owns:

- Evidence Pack parsing
- Evidence Pack validation
- evidence coverage inspection
- deterministic verdict logic
- canonical reason codes
- governance report generation

The HTML renderer owns presentation only.

## 7. Non-Goals

This PR does not add:

- Studio
- SDK
- a hosted dashboard
- parser or validator changes
- report-service behavior changes
- commercial repositioning

It does not change the current `v7.0.1` commercial boundary.
