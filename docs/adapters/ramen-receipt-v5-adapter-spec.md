# Ramen Receipt V5 Adapter Spec

## 1. Status

Conformance baseline: db8d7f46275f477286f1bae0c5869cb7f08fe49a
Provider pack issued: 2026-06-22T10:10:42.789Z

Status: local interoperability spike / adapter draft

This is a bounded local verification spike for externally issued Ramen V5 receipts.
It is not production integration, not runtime enforcement, and not a Guard main-path change.
It is a review-stage spike.
It is not Guard runtime.
It is not Guard CLI.
It is not control plane.
It does not modify `packages/guard/**`.
`ramen-receipt-v5 remains one example only`.
External signed receipts are ingested only as deterministic review evidence.

## 2. Purpose

Guard acts here as an independent assurance layer.
Ramen acts as a runtime semantic firewall / decision receipt issuer.
The adapter verifies receipt structure, signature, input binding, and response consistency so Guard can independently assess signed receipt evidence.

## 3. Non-goals

This adapter does not:

- participate in runtime enforcement
- approve, block, deploy, or control downstream execution
- certify downstream execution
- change `audit`, `permit`, or `classify`
- claim policy content immutability
- claim downstream execution occurred
- claim legal applicability
- reconstruct `canonical_payload` from response fields
- become a control plane or orchestration surface

Ramen V5 is a decision-and-steering receipt, not an execution receipt.
It does not approve, block, deploy, certify, or control execution.

## 4. Input Contract

The adapter accepts:

- `originalInput`: exact UTF-8 request string, untrimmed and unnormalized
- `response`: a Ramen-style success envelope containing `response.data`
- `trustedKeys`: a static key map from `kid` to base64 SPKI DER Ed25519 public keys plus local trust metadata

Expected receipt fields:

- `receipt.id`
- `receipt.schema_version`
- `receipt.kid`
- `receipt.signature`
- `receipt.canonical_payload`

Expected signed payload fields:

- `schema_version`
- `kid`
- `id`
- `timestamp`
- `policy_ids`
- `payload_hash`
- `verdict`
- `reasoning`
- `steering`
- `statutory_anchors`

Current key-discovery boundary:

- production remains a static SPKI key map
- no JWKS endpoint is currently deployed
- no historical key retention metadata is currently deployed
- no key expiry metadata is currently deployed

## 5. Verification Flow

The adapter performs the following flow in order:

1. Confirm `response.data` exists.
2. If `receipt_alert` is present or `receipt` is absent, return `cryptographic_assurance: "absent"` without throwing.
3. Resolve the public key by `receipt.kid`.
4. Fail if the `kid` is unknown.
5. Verify `signature over UTF8(receipt.canonical_payload)` with `crypto.verify(null, ...)`.
6. Parse `JSON.parse(receipt.canonical_payload)`.
7. Validate `payload.schema_version === "5.0"` and the fixed 10-field payload shape.
8. Confirm envelope consistency:
   - `receipt.id === payload.id`
   - `receipt.kid === payload.kid`
   - `receipt.schema_version === payload.schema_version`
9. Confirm input binding:
   - `payload.payload_hash === SHA256(UTF8(originalInput))`
10. Confirm top-level response consistency:
   - `response.data.allowed === (payload.verdict === 1)`
   - `response.data.policy_ids === payload.policy_ids`
   - `response.data.executed_at === payload.timestamp`
11. Derive decision:
   - `verdict === 0` -> `block`
   - `verdict === 1 && steering === ""` -> `allow`
   - `verdict === 1 && steering !== ""` -> `steered_allow`

## 6. Findings Schema

Minimum structured output:

```json
{
  "profile": "ramen-receipt-v5",
  "baseline_sha": "db8d7f46275f477286f1bae0c5869cb7f08fe49a",
  "valid": true,
  "cryptographic_assurance": "verified",
  "decision": "allow",
  "receipt_id": "11111111-1111-4111-8111-111111111111",
  "timestamp": "2026-06-20T09:00:00.000Z",
  "policy_ids": ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
  "findings": {
    "schema_valid": true,
    "signature_valid": true,
    "input_binding_valid": true,
    "envelope_consistent": true,
    "response_verdict_consistent": true,
    "response_policy_ids_consistent": true,
    "response_executed_at_consistent": true,
    "policy_uuid_binding_valid": true,
    "verdict_binding_valid": true,
    "reasoning_binding_valid": true,
    "steering_binding_valid": true,
    "statutory_anchor_binding_valid": true,
    "key_trust_status": "ephemeral_test_key",
    "policy_content_immutability": "not_provided",
    "execution_binding": "not_provided",
    "legal_applicability": "not_verified"
  },
  "failures": [],
  "warnings": []
}
```

The adapter must report separately:

- signature validity
- input binding
- decision binding
- steering binding
- key trust status
- policy content immutability as `not_provided`
- execution binding as `not_provided`

`signature_valid: true` is not a complete governance conclusion.

## 7. Negative Tests

Provider vectors covered in the spike:

- Vector 1 Allowed -> valid
- Vector 2 Blocked -> valid
- Vector 3 Steered -> valid
- Negative N1 Modified Signature -> invalid
- Negative N2 Modified Input -> invalid
- Negative N3 M-1 Signing Failure -> no receipt / assurance absent

Guard-side derived negatives covered locally:

- unknown `kid`
- envelope / payload `id` mismatch
- envelope / payload `kid` mismatch
- envelope / payload `schema_version` mismatch
- top-level `allowed` mismatch against signed `verdict`
- top-level `policy_ids` mismatch against signed `policy_ids`
- top-level `executed_at` mismatch against signed `timestamp`
- malformed `canonical_payload`
- unsupported signed `schema_version`
- invalid signed `verdict`
- missing required signed payload field
- conflicting `receipt_alert` and `receipt` presence

These remain additive verification tests only.

## 8. Evidence Pack Mapping

Representative mapping into a Guard-oriented evidence record:

- `receipt.id` -> receipt evidence identifier
- `receipt.kid` -> key provenance reference
- `receipt.signature` -> detached cryptographic proof bytes
- `receipt.canonical_payload` -> canonical signed fact string
- `payload.payload_hash` -> input-binding artifact
- `payload.verdict` -> decision-binding artifact
- `payload.reasoning` -> reasoning-binding artifact
- `payload.steering` -> steering-binding artifact
- `payload.statutory_anchors` -> statutory-anchor-binding artifact
- `payload.timestamp` -> temporal-binding artifact

The adapter maps evidence only.
It does not turn receipt evidence into execution authority.

## 9. Acceptance Criteria

This spike is acceptable when:

- `npm run verify:ramen-v5` passes
- provider vectors verify with expected outcomes
- Guard-side negatives fail safely
- M-1 no-receipt handling does not throw
- output clearly separates cryptographic validity from governance completeness
- no `audit`, `permit`, or `classify` semantics change
- no runtime enforcement behavior is introduced

## 10. Assurance Limits

A valid Ramen V5 receipt proves:

- input binding
- verdict binding
- policy UUID binding
- reasoning binding
- steering binding
- statutory-anchor binding
- temporal binding

A valid Ramen V5 receipt does not prove:

- policy content immutability
- the exact rule content at signing time
- that referenced policies remain active later
- downstream execution actually occurred
- legal applicability
- runtime execution outcome

## 11. Future Compatibility Notes

If this adapter line evolves later, compatibility work should remain additive and explicitly reviewed.
Potential future additions may include:

- policy content hash binding if Ramen introduces it
- immutable policy snapshots if Ramen introduces them
- JWKS-based key discovery with historical keys if Ramen introduces it

Until then, Guard should keep this adapter local, explicit, and non-authoritative.

This adapter does not change `audit`, `permit`, or `classify`.
