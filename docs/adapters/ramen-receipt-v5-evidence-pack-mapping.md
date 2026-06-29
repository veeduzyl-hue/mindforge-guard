# Ramen Receipt V5 Evidence Pack Mapping

## 1. Purpose

This document defines a bounded local mapping from a verified Ramen V5 receipt result into a Guard-style external evidence record.

The mapping exists to support review-stage evidence ingestion experiments only.
It does not productize the adapter, does not integrate with Guard main-path runtime behavior, and does not change `audit`, `permit`, or `classify`.
It is a review-stage spike.
It is not production integration.
It is not Guard runtime.
It is not Guard CLI.
It is not control plane.
It does not modify `packages/guard/**`.
`ramen-receipt-v5 remains one example only`.
External signed receipts are ingested only as deterministic review evidence.

Ramen V5 is a signed decision-and-steering receipt.
Guard ingestion in this spike produces an evidence record only.

## 2. Non-goals

This mapping does not:

- approve anything
- certify anything
- prove downstream execution
- prove policy content immutability
- prove legal applicability
- grant deployment authority
- grant runtime control
- claim production integration
- change Guard CLI behavior

The evidence record is not approval.
The evidence record is not certification.
The evidence record is not execution proof.
The evidence record does not approve, block, deploy, certify, or control execution.

## 3. Mapping Table

| Verified Ramen V5 field | Guard-style evidence field | Notes |
| --- | --- | --- |
| `verificationResult.baseline_sha` | `baseline_sha` | Preserves frozen conformance lineage |
| `verificationResult.receipt_id` | `receipt_id` | External receipt identifier |
| `verificationResult.timestamp` | `timestamp` | Signed evaluation timestamp |
| `verificationResult.decision` | `decision` | `allow`, `block`, or `steered_allow` |
| `verificationResult.policy_ids` | `policy_ids` | Signed policy UUID list |
| `verificationResult.payload_hash` | `payload_hash` | Signed SHA-256 input binding |
| `findings.signature_valid` | `signature_valid` | Cryptographic signature verdict |
| `findings.input_binding_valid` | `input_binding_valid` | Input binding verdict |
| `findings.envelope_consistent` | `envelope_consistent` | Receipt envelope / payload consistency |
| `findings.response_*_consistent` | `response_consistent` | Aggregated top-level response consistency |
| `findings.key_trust_status` | `key_trust_status` | `ephemeral_test_key` or `static_key_provisional` in this spike |
| `findings.verdict_binding_valid` | `signed_fields.verdict_bound` | Signed verdict presence / consistency |
| `findings.reasoning_binding_valid` | `signed_fields.reasoning_bound` | Signed reasoning binding |
| `findings.steering_binding_valid` | `signed_fields.steering_bound` | Signed steering binding |
| `findings.statutory_anchor_binding_valid` | `signed_fields.statutory_anchors_bound` | Signed statutory-anchor binding |
| `findings.response_executed_at_consistent` | `signed_fields.timestamp_bound` | Signed timestamp reflected at top-level |
| `findings.policy_uuid_binding_valid` | `signed_fields.policy_uuid_bound` | Signed policy UUID binding |

## 4. Evidence Record Schema

Minimum local spike record:

```json
{
  "evidence_type": "external_runtime_decision_receipt",
  "source": "ramen",
  "source_schema": "ramen-receipt-v5",
  "baseline_sha": "db8d7f46275f477286f1bae0c5869cb7f08fe49a",
  "receipt_id": "string",
  "timestamp": "ISO-8601",
  "decision": "allow | block | steered_allow",
  "policy_ids": [],
  "payload_hash": "sha256",
  "signature_valid": true,
  "input_binding_valid": true,
  "envelope_consistent": true,
  "response_consistent": true,
  "key_trust_status": "ephemeral_test_key | static_key_provisional",
  "signed_fields": {
    "verdict_bound": true,
    "reasoning_bound": true,
    "steering_bound": true,
    "statutory_anchors_bound": true,
    "timestamp_bound": true,
    "policy_uuid_bound": true
  },
  "assurance_limits": [
    "policy_content_immutability_not_provided",
    "execution_binding_not_provided",
    "legal_applicability_not_verified"
  ],
  "non_authority_statement": "This record is external receipt evidence only. It does not approve, block, deploy, certify, or control execution."
}
```

## 5. Decision Mapping

Decision mapping remains direct and non-authoritative:

- `verdict === 0` maps to `block`
- `verdict === 1` with empty `steering` maps to `allow`
- `verdict === 1` with non-empty `steering` maps to `steered_allow`

This is evidence normalization only.
The resulting evidence record does not itself block or allow execution.

## 6. Assurance Limits

The evidence record preserves the same limits as the verified receipt result:

- `policy_content_immutability_not_provided`
- `execution_binding_not_provided`
- `legal_applicability_not_verified`

Accordingly:

- the record does not prove policy content immutability
- the record does not prove downstream execution
- the record does not prove legal applicability

## 7. Sample Report Language

Suggested report language:

> External receipt evidence from Ramen V5 was verified locally against the published conformance baseline. The receipt cryptographically binds decision, input hash, timestamp, policy UUIDs, reasoning, steering, and statutory anchors for the evaluated request. This evidence is informative only: it does not approve, certify, deploy, or control execution, and it does not prove policy content immutability, downstream execution, or legal applicability.

## 8. Acceptance Criteria

This mapping spike is acceptable when:

- adapter spec exists
- formal review doc exists
- evidence mapping doc exists
- sample evidence records exist for allowed / blocked / steered
- sample report section exists
- local verification commands still pass
- no Guard authority expansion is introduced
- no production integration claim is introduced
- no `audit`, `permit`, or `classify` semantics are changed

## 9. Future Compatibility Notes

Any future evolution should remain additive and separately reviewed.

Possible future lines, if ever justified, would still need explicit boundary review:

- mapping richer signed fields if Ramen adds them
- packaging evidence records into a larger external Evidence Pack draft
- adding a downstream renderer for human review surfaces

None of those are part of this spike.
