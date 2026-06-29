# Harness Phase 2 External Evidence Record Schema

## Purpose

This document defines `Generic External Evidence Record v0.1` for Guard-native Agent Harness Phase 2.

The schema is a bounded review artifact for:

- agent workflow artifacts
- tool-call traces
- blocked actions
- command results
- policy findings
- external signed receipts

It is additive-only, recommendation-only, non-executing, and verification-only.
It does not change `packages/guard/**`.
It does not change `audit`, `permit`, or `classify`.
It does not approve, block, deploy, certify, or control execution.

Ramen is one example only.
This Phase 2 record contract is generic and must not collapse into a ramen-specific product surface.

## Canonical Record Shape

```json
{
  "record_version": "0.1",
  "record_id": "string",
  "evidence_type": "agent_workflow_artifact | tool_call_trace | blocked_action | command_result | policy_finding | external_signed_receipt",
  "source": "string",
  "source_schema": "string",
  "source_id": "string",
  "timestamp": "ISO-8601",
  "subject": {
    "agent_id": "string | optional",
    "run_id": "string | optional",
    "task_id": "string | optional",
    "tool_name": "string | optional"
  },
  "assurance": {
    "cryptographic_validity": "verified | failed | not_applicable | not_provided",
    "input_binding": "verified | failed | not_applicable | not_provided",
    "execution_evidence": "provided | missing | not_applicable | not_provided",
    "policy_completeness": "complete | partial | missing | not_verified",
    "legal_applicability": "verified | not_verified | not_applicable",
    "human_review_status": "pending | reviewed | not_required"
  },
  "claims": [
    {
      "claim_type": "string",
      "status": "string",
      "detail": "string"
    }
  ],
  "limits": [
    {
      "code": "string",
      "detail": "string"
    }
  ],
  "raw_reference": {
    "path": "string | optional",
    "digest_sha256": "string | optional",
    "locator": "string | optional"
  },
  "non_authority_statement": "This evidence record is for review only. It does not approve, block, deploy, certify, or control execution."
}
```

## Field Semantics

`record_version`

- Fixed schema version for the normalized record contract.

`record_id`

- Deterministic local identifier for the record instance.

`evidence_type`

- Declares the semantic class of the evidence without granting authority.

`source`

- Human-readable producer or origin label such as `guard-native-agent-harness-local`, `sandbox`, or `ramen`.

`source_schema`

- Producer-specific schema label or adapter contract label.

`source_id`

- Stable origin identifier emitted by the source system or local fixture.

`timestamp`

- Capture timestamp for the evidence record.

`subject`

- Scoped identity hints for the reviewed run, task, or tool event.

`assurance`

- Preserves assurance layers independently.
- `cryptographic_validity` is not policy completeness.
- `input_binding` is not execution proof.
- `execution_evidence` is not legal applicability.
- `human_review_status` is not automated authority.

`claims`

- Observed or normalized facts carried for deterministic review.

`limits`

- Explicit machine-readable constraints that stop overclaiming.

`raw_reference`

- Pointer to the local source fixture or imported envelope used during review.

`non_authority_statement`

- Mandatory boundary text on every record.

## Evidence Type Guidance

`agent_workflow_artifact`

- Captures run metadata, task identity, and workflow scope.

`tool_call_trace`

- Captures tool invocation intent, parameters summary, and result summary.

`blocked_action`

- Captures a blocked or denied attempt without implying execution happened.

`command_result`

- Captures bounded local execution evidence for a command that did run.

`policy_finding`

- Captures a policy observation or recommendation-only finding.

`external_signed_receipt`

- Captures a normalized signed receipt from an external system.
- Ramen is one example only.

## Assurance Layer Meanings

`cryptographic_validity`

- Verification of signatures or envelope integrity where applicable.

`input_binding`

- Verification that the evidence is tied to the expected input or payload.

`execution_evidence`

- Indicates whether execution evidence is present, absent, or not applicable.

`policy_completeness`

- Indicates how complete the policy view is for this record alone.

`legal_applicability`

- Preserves whether legal applicability was verified, not verified, or not applicable.

`human_review_status`

- Tracks whether human review is pending, reviewed, or not required.

## Boundary Rules

This schema must preserve:

- recommendation-only
- additive-only
- non-executing
- verification-only
- no runtime enforcement
- no control-plane behavior
- no production integration claim
- no live external API requirement
- no `packages/guard/**` changes
- no `audit`, `permit`, or `classify` semantic changes

This schema must not:

- turn evidence into approval
- turn receipt verification into certification
- turn normalized packs into deployment control
- imply that cryptographic validity proves downstream execution
- imply that technical evidence alone proves legal applicability

## Phase 2 Output Relationship

The Phase 2 flow is:

`agent workflow artifacts`
`+ tool-call traces`
`+ blocked actions`
`+ command results`
`+ policy findings`
`+ external signed receipts`
`-> normalized Evidence Pack`
`-> deterministic Guard review report`

The flow organizes evidence for deterministic review.
It does not create execution authority.
