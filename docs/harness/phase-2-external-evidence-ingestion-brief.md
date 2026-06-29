# Harness Phase 2: External Evidence Ingestion Brief

## 1. Phase 2 Product Goal

Phase 2 defines a generic external evidence ingestion model for Guard-native Agent Harness.

The goal is to normalize heterogeneous review artifacts:

`agent workflow artifacts`
`+ tool-call traces`
`+ blocked actions`
`+ command results`
`+ policy findings`
`+ external signed receipts`
`-> normalized Evidence Pack`
`-> deterministic Guard review report`

This phase is about evidence packaging and bounded review consumption.
It is not about runtime enforcement, agent control, or productizing any single external provider.

## 2. Why Phase 2 Matters

Phase 2 matters because Harness needs a generic way to preserve what happened, what was blocked, what was verified, what remains missing, and what assurance limits still apply.

Without a generic ingestion model:

- external receipts stay vendor-specific
- tool and command evidence remain hard to compare
- missing evidence is easy to blur into false confidence
- review outputs become less deterministic
- adapter work risks drifting into one-off integrations

Phase 2 keeps Guard review grounded in normalized evidence rather than provider-specific claims.

## 3. Non-goals

Phase 2 does not:

- implement runtime execution control
- change `packages/guard/**`
- change `audit`, `permit`, or `classify`
- create a control plane
- create live external API dependencies
- certify external systems
- treat cryptographic validity as complete governance sufficiency
- claim policy completeness from partial artifacts
- claim legal applicability from technical evidence alone
- promote ramen-specific behavior into a generic contract

## 4. Evidence Source Taxonomy

The ingestion model should support at least these evidence source classes:

- agent workflow artifacts
- tool-call traces
- blocked actions
- command results
- file and manifest evidence
- policy findings produced inside the local workflow
- human review annotations
- external signed receipts
- external unsigned reference artifacts

Each source class should preserve:

- provenance
- capture method
- timestamp or collection window
- whether the evidence is complete, partial, or absent
- whether the evidence is local, imported, or externally attested

## 5. Generic Evidence Record Schema

Phase 2 should use a generic evidence record shape that can hold both internal and external facts without turning them into authority:

```json
{
  "record_id": "string",
  "record_type": "workflow_artifact | tool_trace | blocked_action | command_result | policy_finding | external_receipt | human_review_note",
  "source": {
    "system": "string",
    "kind": "internal | external",
    "adapter": "string | null",
    "provenance": "string"
  },
  "capture": {
    "timestamp": "ISO-8601 | null",
    "time_range": "object | null",
    "collection_status": "captured | partial | missing"
  },
  "subject": {
    "workflow_id": "string | null",
    "action_id": "string | null",
    "artifact_path": "string | null",
    "input_hash": "string | null"
  },
  "claims": {
    "cryptographic_validity": "verified | invalid | absent | not_applicable",
    "execution_evidence": "present | partial | absent | not_applicable",
    "policy_completeness": "complete | partial | absent | not_applicable",
    "legal_applicability": "verified | not_verified | out_of_scope",
    "human_review_status": "reviewed | pending | not_required"
  },
  "missing_evidence": [],
  "assurance_limits": [],
  "raw_ref": {
    "path": "string | null",
    "digest": "string | null"
  },
  "non_authority_statement": "string"
}
```

This schema is intentionally descriptive.
It does not approve, block, deploy, merge, or execute anything.

## 6. External Receipt Adapter Abstraction

An external receipt adapter should be defined as a bounded normalization layer:

- input: provider-specific external receipt or receipt bundle
- verification: provider-specific signature, envelope, and schema checks
- output: a normalized external evidence record

Adapter responsibilities:

- preserve source provenance
- report cryptographic validity precisely
- report signed-field coverage precisely
- separate verification success from governance sufficiency
- emit explicit assurance limits
- fail safely on malformed or conflicting input

Adapter non-responsibilities:

- final Guard verdict computation
- execution authorization
- policy completeness certification
- legal interpretation
- runtime control

## 7. How Ramen V5 Maps As One Example Only

Ramen V5 is one example adapter, not the Phase 2 center of gravity.

Its role is:

`external signed runtime decision receipt`
`-> independent verification`
`-> normalized external evidence record`

What it contributes as an example:

- signed decision receipt verification
- payload hash input binding
- signed timestamp binding
- signed policy identifier binding
- explicit assurance limits, including `policy_content_immutability_not_provided`, `execution_binding_not_provided`, and `legal_applicability_not_verified`

Phase 2 must remain generic enough that another signed receipt system, a tool audit bundle, or a blocked-action log can fit the same ingestion surface.

## 8. Evidence Pack Normalization Flow

Suggested normalization flow:

1. Collect local workflow artifacts, tool traces, blocked actions, command outputs, and policy findings.
2. Load any external evidence objects through bounded adapters.
3. Convert all sources into normalized evidence records.
4. Preserve provenance, timestamps, hashes, and missing-evidence markers.
5. Assemble a deterministic Evidence Pack.
6. Derive a deterministic Guard review report from the normalized pack.

The key distinction is that normalization organizes evidence.
Normalization does not itself produce governance authority.

## 9. Missing Evidence Model

Missing evidence must be first-class rather than implied.

The model should distinguish:

- expected but absent
- optional and absent
- partially captured
- redacted or unavailable
- not applicable

Examples:

- no command output retained
- blocked action present but missing actor context
- receipt present but no trusted key source
- policy finding present but no underlying artifact hash

Missing evidence should reduce confidence explicitly instead of being silently ignored.

## 10. Assurance Limits Model

Assurance limits should be carried as explicit machine-readable statements on each evidence record and at the pack summary level.

The model must keep these concepts separate:

- cryptographic validity
- execution evidence
- policy completeness
- legal applicability
- human review status
- missing evidence
- assurance limits

Example limit statements:

- `policy_content_immutability_not_provided`
- `execution_binding_not_provided`
- `legal_applicability_not_verified`
- `human_review_pending`
- `missing_command_output`

No single positive verification result should erase these limits.

## 11. Review Report Sections

A deterministic Guard review report for Phase 2 should be able to render:

- scope and evidence-pack identity
- evidence source inventory
- workflow action summary
- blocked action summary
- command result summary
- policy finding summary
- external receipt summary
- missing evidence summary
- assurance limits summary
- human review status
- non-authority statement

These sections inform review.
They do not convert review artifacts into autonomous decisions.

## 12. Adapter Boundary Rules

Every adapter admitted into the Phase 2 ingestion surface should preserve these rules:

- additive-only
- recommendation-only
- non-executing
- no runtime enforcement
- no control-plane behavior
- fail safely on malformed inputs
- no implicit trust expansion
- no changes to Guard main-path runtime semantics
- no live external dependency requirement for core verification

Adapters should be independently verifiable and removable without changing Guard core behavior.

## 13. Suggested File Structure

Suggested Phase 2 document and spike structure:

```text
docs/harness/
  phase-2-external-evidence-ingestion-brief.md
  external-evidence-record-schema-draft.md
  external-receipt-adapter-boundary.md

experiments/harness-external-evidence/
  fixtures/
  artifacts/
  adapters/
  normalize-evidence-pack.mjs
  README.md

scripts/
  verify_harness_external_evidence_schema.mjs
  verify_harness_external_evidence_adapters.mjs
  verify_harness_external_evidence_report.mjs
```

This is a planning shape only.
It is not an implementation commitment.

## 14. Minimal Implementation Plan

The smallest safe Phase 2 path is:

1. Freeze the ramen example adapter as a reference artifact.
2. Draft a generic external evidence record schema.
3. Draft pack-level normalization rules for mixed evidence types.
4. Create local fixtures covering internal and external evidence combinations.
5. Add independent verification scripts for schema, normalization, and report rendering.
6. Review anti-drift boundaries before any runtime-facing proposal.

No runtime path changes should occur during this plan.

## 15. Verification Scripts And Acceptance Criteria

Suggested verification surfaces:

- schema contract verifier
- mixed-evidence normalization verifier
- missing-evidence behavior verifier
- assurance-limits rendering verifier
- adapter boundary verifier
- report determinism verifier

Acceptance criteria:

- all verification remains independent and local
- mixed evidence normalizes deterministically
- missing evidence is surfaced explicitly
- assurance limits remain machine-readable
- cryptographic validity is not conflated with policy completeness
- external adapters remain non-authoritative
- `audit`, `permit`, and `classify` remain unchanged
- no changes occur under `packages/guard/**`

## 16. Anti-drift Boundaries

Phase 2 must not drift into:

- ramen-specific productization
- runtime policy enforcement
- execution control
- dashboard/control-plane behavior
- external vendor dependency in Guard core
- public claims that Guard certifies external systems
- public claims that signed receipts prove downstream execution
- public claims that external evidence alone establishes legal applicability

Guard should remain the deterministic governance consumer.
External evidence should remain evidence, not authority.

## 17. Open Questions

Open questions for the next bounded planning step:

1. What is the smallest generic evidence record contract that still covers both internal workflow traces and external receipts?
2. Which missing-evidence conditions must be hard failures versus review warnings?
3. Should pack-level assurance limits be a derived aggregate or an explicit authored section?
4. What minimum human review metadata is needed without creating workflow-management drift?
5. When, if ever, should a generic external evidence ingestion package become a promoted Guard-owned preview surface?
6. Which verification fixtures best prove that the model stays generic and does not collapse back into ramen-specific assumptions?
