# Unified Governance Report Model

## 1. Purpose

The Unified Governance Report Model is the canonical Guard Core type surface for future governance summaries, receipts, and report-oriented consumers.

It defines the stable shape of a Guard-owned governance report model without generating any report output in this PR.

## 2. How It Differs From Evidence Pack

Evidence Pack is the factual input boundary.

The Unified Governance Report Model is a future Guard Core output boundary.

The distinction is intentional:

- Evidence Pack carries submitted workflow facts
- the report model carries Guard-owned governance summary fields
- Evidence Pack is producer-facing input
- the report model is Guard-owned consumer-facing output

Evidence Pack remains the only factual input.
The report model must not be treated as a substitute factual source.

## 3. How It Differs From Renderer Output

The report model is not Markdown, HTML, console text, or any other presentation format.

Renderer output is a presentation concern.
The Unified Governance Report Model is the canonical structured source that future renderers may consume.

This keeps:

- Guard Core responsible for governance model ownership
- Renderer responsible for presentation only
- Studio, SDK, and CLI aligned to one canonical model rather than inventing parallel output structures

## 4. Why Guard Core Owns This Model

Guard Core is the only governance source of truth.

That means Guard Core owns:

- governance reason code vocabulary
- governance report model structure
- later verdict computation logic
- later receipt and report generation logic

Harness, Renderer, Studio, SDK, and CLI must not create independent governance models.

## 5. Field Overview

The canonical top-level report fields are:

| Field | Purpose |
| --- | --- |
| `report_id` | identify the governance report record |
| `report_schema_version` | freeze the report model contract version |
| `generated_at` | record the report model generation timestamp |
| `source_pack_id` | link back to the Evidence Pack identifier |
| `source_schema_version` | preserve the source Evidence Pack schema version |
| `workflow_summary` | summarize workflow context |
| `verdict` | hold a later Guard-owned verdict summary field |
| `authority_summary` | summarize authority context |
| `scope_summary` | summarize scope context |
| `evidence_coverage` | summarize evidence completeness and counts |
| `risk_summary` | summarize risk-oriented governance interpretation |
| `blocked_actions_summary` | summarize blocked action surfaces |
| `verification_summary` | summarize verification status counts |
| `missing_evidence` | enumerate missing-evidence items |
| `human_review_requirements` | enumerate human-review requirements |
| `next_actions` | enumerate recommended next governance actions |
| `evidence_refs` | preserve traceable references |
| `reason_codes` | preserve canonical Guard reason-code references |
| `provenance` | preserve model-generation lineage |

## 6. Verdict Field Semantics

The report model defines a `verdict` field because downstream consumers need a stable place for future Guard-owned verdict output.

The allowed verdict values are:

- `allow`
- `require_review`
- `block`
- `inconclusive`

Those values are defined in PR-07 as model vocabulary only.

## 7. Verdict Definition Is Not Verdict Computation

This PR is allowed to define verdict field values.
This PR is not allowed to compute them.

PR-07 does not:

- evaluate evidence
- inspect Evidence Packs
- assign verdict values
- assign reason codes
- choose missing evidence items
- choose review requirements
- choose next actions

It defines stable types only.

## 8. Relationship To Reason Codes

The Unified Governance Report Model references canonical `GuardReasonCode` values from Guard Core.

This matters for two reasons:

- the report model reuses the Guard-owned reason-code vocabulary instead of inventing a second vocabulary
- later receipts, reports, and renderers can align to one reason-code contract

Reason codes remain explanatory primitives.
They are not verdicts by themselves.

## 9. Relationship To Future Report Service

Future Report Service work may later:

- populate the report model from validated Evidence Pack input
- assign reason codes
- populate missing-evidence items
- populate review requirements
- populate next actions
- compute a Guard-owned verdict summary

PR-07 does none of that work.

## 10. Relationship To Markdown / HTML Renderer

Future Markdown or HTML renderers should consume the Unified Governance Report Model as input.

They should not:

- compute verdicts
- invent reason codes
- create alternate governance model contracts

Presentation remains downstream from the canonical Guard Core report model.

## 11. Why Parallel Models Are Not Allowed

Guard must not drift into separate governance vocabularies or parallel model definitions across adjacent modules.

That means:

- Harness remains an Evidence Producer only
- Renderer consumes Guard Core output
- Studio consumes Guard Core output
- SDK exposes Guard Core-owned capabilities
- CLI consumes Guard Core-owned logic and output contracts

None of those modules should define an independent governance report model.

## 12. Non-Goals

This PR does not:

- generate reports
- compute verdicts
- grant approval
- implement enforcement
- execute actions
- implement scanner behavior
- reposition current `v7.0.1` commercial materials

## 13. Boundary Notes

PR-07 is intentionally narrow.

- It adds stable TypeScript model definitions only.
- It does not change parser or validator behavior.
- It does not add a Report Service.
- It does not add Markdown or HTML rendering.
- It does not add Studio or SDK behavior.
- It does not add Harness alignment.
- It does not change runtime CLI behavior.

Guard remains non-executing, local-first, evidence-first, cross-runtime, and independent.
