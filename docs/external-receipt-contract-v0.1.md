# External Receipt Contract v0.1

## Core Positioning

The External Receipt Contract defines the minimum verifiable semantics required for Guard to assess external runtime evidence. It is not a universal receipt format and does not grant runtime authority.

Receipt compatibility means Guard can verify and interpret the evidence. It does not mean Guard approves the underlying action.

## 1. Purpose

This contract exists to:

- define minimum verifiable semantics
- support multiple external evidence sources
- avoid ramen-specific assumptions
- allow adapters to normalize different receipt shapes
- preserve Guard's verification-only boundary

The contract is intentionally minimal.
It defines what Guard needs in order to assess externally issued runtime evidence without making one issuer, one transport shape, or one JSON layout into the canonical source of truth.

The contract is also intentionally Guard-owned.
External issuers may emit different receipt forms, but Guard defines the minimum semantics required for independent verification and review interpretation.

## 2. Contract Boundary

This contract is not:

- an approval schema
- an execution token
- a deployment gate
- a compliance certificate

This contract also does not require all issuers to use the same JSON shape.
Instead, it defines what Guard needs to verify evidence across multiple receipt sources.

The contract boundary is therefore:

- issuer-specific formats may vary
- adapter parsing may vary
- proof transport may vary
- Guard verification semantics must remain stable

## 3. Required Fields

The following fields are required for minimum contract compatibility.

### `receipt_id`

- Purpose: uniquely identify the receipt record being evaluated.
- Expected semantics: the identifier should be stable enough to distinguish this receipt from other receipts from the same issuer.
- Minimum validation: non-empty identifier value.
- Failure finding when missing or invalid: `evidence_incomplete`

### `issuer`

- Purpose: identify the external system or authority that issued the receipt.
- Expected semantics: issuer identity should be explicit enough for Guard to distinguish known, unknown, or unsupported issuers.
- Minimum validation: non-empty issuer identity value.
- Failure finding when missing or invalid: `unknown_issuer`

### `subject`

- Purpose: identify what the receipt is about.
- Expected semantics: the subject should point to the runtime action, artifact, decision, execution unit, or evidence target being attested.
- Minimum validation: non-empty subject object or subject identifier.
- Failure finding when missing or invalid: `evidence_incomplete`

### `evidence_timestamp`

- Purpose: indicate when the evidence was issued or observed.
- Expected semantics: the timestamp should describe evidence timing, not downstream approval timing.
- Minimum validation: parseable timestamp value.
- Failure finding when missing or invalid: `missing_timestamp`

### `payload_hash`

- Purpose: bind the receipt to the payload or evidence body being attested.
- Expected semantics: the hash should identify the relevant payload bytes or canonicalized payload representation.
- Minimum validation: non-empty hash value.
- Failure finding when missing or invalid: `missing_payload_hash`

### `hash_algorithm`

- Purpose: specify how `payload_hash` was computed.
- Expected semantics: the algorithm must be explicit so Guard can determine whether verification is possible.
- Minimum validation: declared algorithm name.
- Failure finding when missing or invalid: `verification_not_performed`

### `signature`

- Purpose: carry the signature or equivalent proof material used to protect receipt integrity.
- Expected semantics: the signature should be attributable to the issuer or issuer-controlled signing context.
- Minimum validation: non-empty signature value or proof payload.
- Failure finding when missing or invalid: `missing_signature`

### `signature_algorithm`

- Purpose: specify how the signature was produced.
- Expected semantics: the algorithm must be explicit so Guard can determine whether verification is possible and supported.
- Minimum validation: declared algorithm name.
- Failure finding when missing or invalid: `unsupported_signature_algorithm`

## 4. Recommended Fields

The following fields are recommended because they improve reviewability, traceability, and verification clarity.

### `public_key_ref`

- Why recommended: helps Guard identify which public key or trust anchor should be used for verification.
- How Guard may use it: to resolve or compare key material when available.
- What happens if absent: Guard may still parse the receipt, but signature verification may fall back to `issuer_key_unavailable`.

### `policy_ref`

- Why recommended: makes it easier to understand what policy or rule context the issuer says the receipt relates to.
- How Guard may use it: to report whether policy context is visible, missing, or unverifiable.
- What happens if absent: the receipt may remain compatible, but Guard should report `missing_policy_ref`.

### `runtime_context`

- Why recommended: improves interpretation of where the evidence was produced.
- How Guard may use it: to summarize environment, execution surface, or workflow context in review artifacts.
- What happens if absent: Guard can still verify core integrity semantics, but review context is weaker.

### `decision_summary`

- Why recommended: gives human reviewers a bounded issuer-side explanation of what the receipt represents.
- How Guard may use it: to preserve issuer narrative as declared context, not as verified authority.
- What happens if absent: compatibility may remain intact, but human review readability is reduced.

### `evidence_refs`

- Why recommended: points to raw evidence, artifacts, payloads, or supporting logs.
- How Guard may use it: to preserve traceability and surface evidence availability or absence.
- What happens if absent: the receipt may still parse, but review completeness may be reduced.

### `receipt_version`

- Why recommended: helps Guard distinguish semantic variants within the same issuer family.
- How Guard may use it: to decide whether the receipt version is known, supported, or unsupported.
- What happens if absent: compatibility may remain partial, but version-sensitive validation is weaker.

### `source_system`

- Why recommended: makes it easier to identify which runtime, control system, or execution environment emitted the receipt.
- How Guard may use it: to distinguish issuer identity from runtime source identity.
- What happens if absent: the receipt may remain usable, but provenance visibility is lower.

## 5. Optional Fields

The following fields are optional in `v0.1`, but each may still improve human review value.

### `environment`

Helps a reviewer distinguish development, staging, production, or other execution contexts when the issuer chooses to disclose them.

### `actor`

Helps a reviewer understand which principal, automation, or delegated system initiated or owned the underlying activity.

### `tool_invocation`

Helps a reviewer inspect tool-level context when the receipt represents automation or agent action evidence.

### `chain_context`

Helps a reviewer understand whether the receipt is part of a broader multi-step or chained evidence sequence.

### `parent_receipt_id`

Helps a reviewer relate the current receipt to a prior receipt without requiring Guard to own the receipt chain itself.

### `external_report_uri`

Helps a reviewer locate external reports or issuer-side renderings when such references are allowed and available.

### `redaction_notice`

Helps a reviewer understand that parts of the payload, evidence, or context were intentionally removed rather than silently omitted.

### `confidentiality_level`

Helps a reviewer interpret whether evidence was intentionally constrained by confidentiality handling.

### `raw_payload_ref`

Helps a reviewer understand where the attested payload may be retrieved, compared, or independently inspected when direct payload embedding is not used.

## 6. Field Semantics Table

| Field | Level | Type | Purpose | Missing Finding | Invalid Finding |
| --- | --- | --- | --- | --- | --- |
| `receipt_id` | Required | string | uniquely identify the receipt record | `evidence_incomplete` | `evidence_incomplete` |
| `issuer` | Required | string or object | identify the issuing external system | `unknown_issuer` | `unknown_issuer` |
| `subject` | Required | string or object | identify what the receipt is about | `evidence_incomplete` | `evidence_incomplete` |
| `evidence_timestamp` | Required | timestamp | express when evidence was issued or observed | `missing_timestamp` | `missing_timestamp` |
| `payload_hash` | Required | string | bind the receipt to the attested payload | `missing_payload_hash` | `payload_hash_mismatch` |
| `hash_algorithm` | Required | string | state how the payload hash was computed | `verification_not_performed` | `verification_not_performed` |
| `signature` | Required | string or object | carry signature or proof material | `missing_signature` | `invalid_signature` |
| `signature_algorithm` | Required | string | state how the signature was produced | `unsupported_signature_algorithm` | `unsupported_signature_algorithm` |
| `public_key_ref` | Recommended | string or object | identify key material used for verification | `issuer_key_unavailable` | `issuer_key_unavailable` |
| `policy_ref` | Recommended | string or object | preserve visible policy context | `missing_policy_ref` | `verification_not_performed` |
| `runtime_context` | Recommended | object | preserve runtime environment context | `evidence_incomplete` | `adapter_parse_error` |
| `decision_summary` | Recommended | string or object | preserve issuer-side summary | `evidence_incomplete` | `adapter_parse_error` |
| `evidence_refs` | Recommended | array | preserve raw evidence references | `evidence_incomplete` | `adapter_parse_error` |
| `receipt_version` | Recommended | string | preserve issuer version context | `unsupported_receipt_version` | `unsupported_receipt_version` |
| `source_system` | Recommended | string or object | identify runtime source distinct from issuer | `evidence_incomplete` | `adapter_parse_error` |
| `environment` | Optional | string or object | provide environment context | none | `adapter_parse_error` |
| `actor` | Optional | string or object | provide actor visibility | none | `adapter_parse_error` |
| `tool_invocation` | Optional | object | provide tool-level context | none | `adapter_parse_error` |
| `chain_context` | Optional | object | provide chain semantics | none | `adapter_parse_error` |
| `parent_receipt_id` | Optional | string | relate to a parent receipt | none | `adapter_parse_error` |
| `external_report_uri` | Optional | string | reference issuer-side report surfaces | none | `adapter_parse_error` |
| `redaction_notice` | Optional | string or object | disclose redaction explicitly | none | `adapter_parse_error` |
| `confidentiality_level` | Optional | string | disclose confidentiality handling | none | `adapter_parse_error` |
| `raw_payload_ref` | Optional | string or object | reference raw payload location | `raw_payload_unavailable` | `adapter_parse_error` |

## 7. Integrity Semantics

The integrity boundary is:

- `payload_hash` must identify the payload being attested
- `hash_algorithm` must be explicit
- Guard may verify the hash only when raw payload is available
- when raw payload is unavailable, Guard should emit `raw_payload_unavailable`
- payload hash match is not approval
- payload hash mismatch is integrity evidence, not runtime enforcement

Integrity success means Guard could compare payload-related evidence successfully.
It does not mean the underlying action was correct, authorized, safe, or deployment-ready.

## 8. Signature Semantics

Signature semantics are bounded:

- a signature proves receipt integrity only under a known issuer/key context
- unsupported algorithms should emit `unsupported_signature_algorithm`
- missing key material should emit `issuer_key_unavailable`
- unknown issuer should not be treated as verified
- signature verification is not certification

Guard may confirm that signature material is valid relative to a known issuer/key context.
That confirmation is still verification output only.
It is not compliance certification, execution authorization, or action approval.

## 9. Timestamp Semantics

Timestamp semantics are limited to evidence timing visibility.

- `evidence_timestamp` describes when evidence was issued or observed
- freshness policy is out of scope for `v0.1` unless explicitly configured
- missing timestamp emits `missing_timestamp`
- stale timestamp emits `stale_timestamp` only when a freshness window is supplied

Timestamp presence improves reviewability.
Timestamp absence or staleness reduces confidence or completeness, but it does not automatically convert the receipt into an approval or denial result.

## 10. Policy Reference Semantics

Policy reference semantics are review-oriented.

- `policy_ref` improves reviewability
- missing `policy_ref` should not automatically invalidate the receipt
- Guard does not become policy authority
- Guard can report whether policy reference is visible, missing, or unverifiable

The contract therefore allows receipts to remain partially useful even when policy linkage is incomplete, while still surfacing that incompleteness explicitly.

## 11. Evidence Reference Semantics

Evidence reference semantics should preserve traceability rather than hide limitations.

- `evidence_refs` point to raw evidence, logs, artifacts, reports, or payloads
- Guard should preserve references
- Guard should not hide failed or partial evidence
- confidential or redacted evidence should be labeled, not silently accepted

An absent or inaccessible evidence reference should remain visible as a review limitation.
Guard should not silently upgrade incomplete traceability into positive verification.

## 12. Compatibility Levels

The contract defines three compatibility levels.

### `contract_parseable`

Meaning:

- Guard can parse the receipt into a minimally intelligible contract shape
- required identity and structure are present enough to inspect

Does not mean:

- integrity verified
- signature verified
- review complete
- action approved

### `integrity_verifiable`

Meaning:

- Guard has enough material to assess payload binding and signature-related integrity semantics
- issuer, key, and payload evidence are sufficient for bounded integrity evaluation

Does not mean:

- runtime action authorized
- downstream action safe
- compliance certified
- human review unnecessary

### `review_ready`

Meaning:

- Guard can parse the receipt
- integrity evidence is sufficiently inspectable
- surrounding context is strong enough to support human review interpretation

Does not mean:

- approved
- blocked
- certified
- production ready
- enforcement passed

## 13. Non-Compatible Cases

Examples of non-compatible cases include:

- missing `receipt_id`
- missing `issuer`
- missing `subject`
- missing timestamp
- missing both `payload_hash` and raw payload reference
- unsupported or missing signature semantics
- unparseable evidence
- contradictory identity fields

These cases are non-compatible because Guard cannot establish minimum verifiable semantics from the supplied evidence.
Non-compatible does not mean Guard blocks runtime behavior.
It means the evidence fails the minimum verification boundary.

## 14. Example Abstract Receipt

The following is a vendor-neutral example that illustrates verification semantics only:

```json
{
  "receipt_id": "receipt-2026-07-07-001",
  "issuer": {
    "id": "external-runtime-example",
    "name": "External Runtime Example"
  },
  "subject": {
    "kind": "runtime_action",
    "id": "action-4fbe9c"
  },
  "evidence_timestamp": "2026-07-07T10:15:00Z",
  "payload_hash": "2c26b46b68ffc68ff99b453c1d30413413422b6b3f0f6b6f2b6d4f7f8c7d6e5a",
  "hash_algorithm": "sha256",
  "signature": "base64:MEUCIQCy-example-signature",
  "signature_algorithm": "ecdsa-p256-sha256",
  "public_key_ref": "issuer-key:external-runtime-example:2026-07",
  "policy_ref": "policy:runtime-evidence:baseline-v1",
  "runtime_context": {
    "surface": "ci_pipeline",
    "environment": "staging"
  },
  "decision_summary": "Evidence was issued for a completed runtime action.",
  "evidence_refs": [
    {
      "kind": "log",
      "ref": "artifact://build-log-17"
    },
    {
      "kind": "payload",
      "ref": "artifact://payload-17"
    }
  ],
  "receipt_version": "0.1",
  "source_system": "external-runtime-example"
}
```

This example does not express approval, blocking, or certification semantics.
It only expresses verification-relevant evidence semantics.

## 15. Relationship to Reference Adapters

The contract is Guard-owned and issuer-neutral.

- ramen V5 can be mapped to this contract
- other receipt issuers can also be mapped
- no external source owns the contract
- reference adapters validate the contract but do not define it

Reference adapters exist to connect issuer-specific evidence into the Guard verification boundary.
They do not become the canonical contract owner, and they do not redefine compatibility semantics for everyone else.

## 16. Open Questions

Open questions for later hardening include:

- trust registry
- public key discovery
- revocation
- chained receipts
- redacted payload verification
- confidential evidence
- multi-issuer receipts
- freshness windows
- payload canonicalization

These questions should remain open until a later bounded phase explicitly narrows them.
