# Harness Phase 2 Evidence Type Contract Hardening

## Purpose

This document defines the local preview contract-hardening layer for Harness Phase 2 evidence types.

This layer is:

- local preview implementation
- deterministic
- default-off
- verification-only
- human-review-oriented
- additive-only
- recommendation-only
- non-executing

This layer is not:

- not production integration
- not Guard runtime
- not Guard CLI
- not control plane
- not approval authority
- not blocking authority
- not deployment authority
- not certification authority

Guard provides deterministic review evidence only.
It does not approve, block, deploy, certify, or control execution.

It does not modify `packages/guard/**`.
It does not change `audit`, `permit`, or `classify`.
It does not modify the main README product narrative.

External signed receipts are review evidence only.
`ramen-receipt-v5 remains one example only`.

The evidence type contract validates review evidence shape only.
It does not validate governance truth.
It does not validate runtime permission.

## Scope

The contract hardening layer validates the shape of mixed evidence records and normalized evidence records without changing the existing Phase 2 fixture lineage.

It preserves the canonical evidence type set for:

- `agent_workflow_artifact`
- `blocked_action`
- `command_result`
- `external_signed_receipt`
- `policy_finding`
- `tool_call_trace`

It also preserves independent assurance dimensions for:

- `cryptographic_validity`
- `execution_evidence`
- `policy_completeness`
- `legal_applicability`
- `human_review_status`

These dimensions must not collapse into a single verdict.

## Contract Targets

The normalized target record shape is:

```json
{
  "id": "string",
  "type": "canonical evidence type",
  "summary": "string",
  "assurance": {
    "cryptographic_validity": "enum",
    "execution_evidence": "enum",
    "policy_completeness": "enum",
    "legal_applicability": "enum",
    "human_review_status": "enum"
  },
  "missing_evidence": [],
  "assurance_limits": [],
  "reviewer_questions": []
}
```

Current Phase 2 fixtures may use different field paths.
The validator therefore supports compatibility reads from the existing raw fixture shape and the existing normalized flat-record shape.

## Boundary Rules

The contract hardening layer must not:

- introduce runtime enforcement
- introduce control-plane behavior
- introduce production integration claims
- interpret evidence records as approval
- interpret evidence records as blocking authority
- interpret evidence records as deployment power
- interpret evidence records as certification power
- promote external signed receipts into a main-path Guard capability

External signed receipts remain one evidence type only.
`ramen-receipt-v5 remains one example only`.

## Verification Surface

The standalone verification command is:

```bash
npm run verify:harness-phase2:contract
```

It validates:

1. positive mixed evidence contract coverage
2. positive normalized pack contract coverage
3. negative fixtures for missing record type
4. negative fixtures for invalid assurance status
5. negative fixtures for forbidden authority claims
6. negative fixtures for malformed external signed receipt shape
7. negative fixtures for insufficient evidence type coverage

This verification is deterministic and local-only.
