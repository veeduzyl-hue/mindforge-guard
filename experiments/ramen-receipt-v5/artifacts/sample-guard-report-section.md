# External Receipt Evidence

Guard ingested three locally verified external Ramen V5 receipt examples:

- `allow` receipt `11111111-1111-4111-8111-111111111111`
- `block` receipt `22222222-2222-4222-8222-222222222222`
- `steered_allow` receipt `33333333-3333-4333-8333-333333333333`

For each sample, the local verifier confirmed:

- valid Ed25519 signature over the exact `canonical_payload`
- valid input binding via `payload_hash`
- consistent receipt envelope
- consistent top-level decision surface
- signed binding for verdict, reasoning, steering, statutory anchors, timestamp, and policy UUIDs

Assurance limits remain explicit:

- `policy_content_immutability_not_provided`
- `execution_binding_not_provided`
- `legal_applicability_not_verified`

This report section is evidence-oriented only.
It does not approve, block, deploy, certify, or control execution.
It does not prove downstream execution, policy content immutability, or legal applicability.
