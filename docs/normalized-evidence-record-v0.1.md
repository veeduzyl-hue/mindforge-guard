# Normalized Evidence Record v0.1

## Core Positioning

A Normalized Evidence Record is Guard's internal review artifact for representing external runtime evidence in a consistent, verification-oriented shape.

A Normalized Evidence Record is not an approval token, execution permit, deployment gate, compliance certificate, or runtime authorization object.

The boundary remains:

- Guard independently verifies external runtime evidence.
- External systems issue evidence. Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not mutate upstream runtime state.
- ramen is a reference adapter, not a privileged dependency.

## 1. Purpose

The Normalized Evidence Record exists because external receipts and evidence packages do not share one stable shape.
Different issuers may expose different field layouts, naming styles, transport mechanisms, or evidence references.
Guard still needs one deterministic internal review artifact so verification findings, review surfaces, and reporting language remain stable.

The purpose of the record is therefore to:

- absorb heterogeneous external receipt shapes into one Guard-owned review representation
- preserve verification semantics across adapters
- provide a stable attachment surface for findings and review notes
- keep raw evidence traceability visible
- avoid turning normalization into runtime authority

The record is implementation-aware because it reflects what adapters must preserve.
It is not an implementation specification for runtime control behavior.

## 2. Boundary

The Normalized Evidence Record is not:

- an approval token
- a permit
- a block decision
- a deployment gate
- a compliance certificate
- a replacement for human review
- the source of truth for runtime authorization

The record exists after evidence has been issued elsewhere and before human review or additive reporting is completed inside Guard.
It does not authorize an action, deny an action, mutate an upstream system, or silently convert verification evidence into policy authority.

Boundary consequence:

- normalization is not authorization
- normalization is not enforcement
- normalization is not execution
- normalization is not certification

## 3. Relationship to External Receipt Contract

The External Receipt Contract and the Normalized Evidence Record solve related but different problems.

- External Receipt Contract defines minimum verifiable semantics for incoming evidence.
- Normalized Evidence Record defines Guard's internal representation of that evidence after parsing and bounded interpretation.
- Adapters map external receipts into this record.
- Not all external fields must survive as first-class normalized fields.
- Raw evidence references should remain traceable even when fields are collapsed or reorganized.

The contract answers whether a receipt is sufficiently structured for Guard verification.
The normalized record answers how Guard should represent the evidence internally for deterministic review and reporting.

This separation matters because Guard must stay vendor-neutral.
One issuer shape should not become the canonical internal object model unless Guard explicitly owns that model.

## 4. Required Record Sections

At minimum, a `v0.1` Normalized Evidence Record should contain the following top-level sections:

- `record`
- `source`
- `receipt`
- `subject`
- `verification`
- `integrity`
- `signature`
- `timestamp`
- `policy`
- `evidence`
- `findings`
- `review`

These sections create a stable review-oriented frame for incoming external evidence.
They are intended to be explicit, machine-readable, and predictable across adapters.

## 5. Record Identity

The `record` section should include:

- `record_id`
- `record_version`
- `generated_at`
- `adapter_name`
- `adapter_version`

### `record_id`

- Purpose: identify the normalized review artifact itself.
- Minimum semantics: stable enough to distinguish one normalized record from another.
- Boundary: identifies the Guard artifact, not the upstream runtime authorization state.

### `record_version`

- Purpose: identify the record schema or semantic generation version.
- Minimum semantics: tell a reviewer or consumer which normalized shape version they are reading.
- Boundary: versioning is about interpretation compatibility, not issuer trust.

### `generated_at`

- Purpose: record when Guard generated the normalized artifact.
- Minimum semantics: timestamp for artifact creation inside Guard.
- Boundary: this is not the same as `evidence_timestamp`, and it must not be used as evidence issuance time.

### `adapter_name`

- Purpose: identify which adapter produced the normalized record.
- Minimum semantics: explicit adapter identity.
- Boundary: the adapter is a mapping layer, not a policy authority.

### `adapter_version`

- Purpose: identify the adapter build or semantic version that generated the record.
- Minimum semantics: enable interpretation and compatibility review.
- Boundary: adapter version explains transformation context but does not imply receipt validity by itself.

## 6. Source Identity

The `source` section should include:

- `source_system`
- `source_type`
- `issuer`
- `issuer_key_ref`
- `trust_status`

### `source_system`

- Purpose: identify the external system or runtime surface that emitted the evidence.
- Minimum semantics: stable source visibility.

### `source_type`

- Purpose: classify the broad evidence source family such as runtime receipt, verifier output, provenance artifact, or execution trace.
- Minimum semantics: enough typing to support interpretation and comparison.

### `issuer`

- Purpose: identify the issuer identity carried by the evidence.
- Minimum semantics: visible issuer reference that can be reviewed or compared.

### `issuer_key_ref`

- Purpose: identify visible key material reference or issuer signing context.
- Minimum semantics: preserve verification context when available.

### `trust_status`

- Purpose: summarize whether issuer trust context is known, unknown, partial, or unavailable.
- Minimum semantics: a bounded visibility field for review.

Source identity expresses observability and verification context only.
It does not express endorsement, approval, or a standing trust grant.

## 7. Receipt Identity

The `receipt` section should include:

- `receipt_id`
- `receipt_version`
- `receipt_type`
- `raw_receipt_ref`
- `parent_receipt_id`

### `receipt_id`

- Purpose: preserve upstream receipt identity.
- Minimum semantics: stable link to the externally issued receipt record.

### `receipt_version`

- Purpose: preserve issuer receipt version context.
- Minimum semantics: enough to distinguish incompatible or evolving receipt forms.

### `receipt_type`

- Purpose: describe the kind of receipt being normalized.
- Minimum semantics: identify the receipt family in a review-oriented way.

### `raw_receipt_ref`

- Purpose: retain traceability back to the original receipt payload or stored evidence location.
- Minimum semantics: visible pointer to the underlying raw artifact when available.

### `parent_receipt_id`

- Purpose: preserve declared chaining or parent linkage when present.
- Minimum semantics: optional lineage visibility only.

Receipt identity exists for traceability.
It does not authorize a runtime action and does not become the source of truth for authorization.

## 8. Subject Semantics

The `subject` section should include:

- `subject_type`
- `subject_id`
- `subject_ref`
- `action_summary`
- `runtime_context`

### `subject_type`

- Purpose: identify what class of object or action the evidence refers to.

### `subject_id`

- Purpose: preserve a stable subject identifier when the issuer provides one.

### `subject_ref`

- Purpose: preserve an external pointer or scoped reference to the subject.

### `action_summary`

- Purpose: provide a bounded explanation of the activity or object represented by the evidence.

### `runtime_context`

- Purpose: preserve relevant environment or workflow context needed for review interpretation.

The subject is the thing the evidence points to.
It is not a Guard authorization object, and the presence of a subject does not create a permit relationship.

## 9. Verification Status

The `verification` section should include:

- `verification_status`
- `verification_performed`
- `verification_time`
- `verifier`
- `verification_notes`

Recommended `verification_status` values:

- `verified`
- `not_verified`
- `partially_verified`
- `verification_not_performed`
- `verification_error`

### Semantics

- `verification_status` summarizes bounded verification outcome, not approval.
- `verification_performed` indicates whether a verification attempt actually occurred.
- `verification_time` records when the verification activity happened.
- `verifier` identifies the Guard verifier or adapter component that performed the work.
- `verification_notes` preserve bounded reviewer-facing explanation of limitations or outcomes.

Important boundary:

- `verified` does not mean approved
- `not_verified` does not mean blocked
- `partially_verified` means some semantics remain incomplete or unavailable

## 10. Integrity Status

The `integrity` section should include:

- `payload_hash`
- `hash_algorithm`
- `raw_payload_available`
- `payload_hash_status`

Recommended `payload_hash_status` values:

- `match`
- `mismatch`
- `unavailable`
- `not_checked`
- `unsupported_algorithm`

### Semantics

- `payload_hash` preserves the attested hash value used for evidence integrity review.
- `hash_algorithm` preserves how the hash was computed.
- `raw_payload_available` indicates whether raw payload comparison was possible.
- `payload_hash_status` reports bounded integrity comparison state.

Integrity status describes whether Guard could assess payload binding.
It does not certify correctness, safety, or authorization.

## 11. Signature Status

The `signature` section should include:

- `signature_present`
- `signature_algorithm`
- `signature_status`
- `public_key_ref`
- `issuer_key_status`

Recommended `signature_status` values:

- `valid`
- `invalid`
- `missing`
- `unsupported_algorithm`
- `key_unavailable`
- `not_checked`

### Semantics

- `signature_present` indicates whether signature or equivalent proof material exists.
- `signature_algorithm` identifies the proof algorithm when declared.
- `signature_status` summarizes signature verification state.
- `public_key_ref` preserves the relevant key material reference when visible.
- `issuer_key_status` captures whether the issuer key context was usable, missing, unsupported, or unavailable.

Signature validity remains verification output only.
It is not a compliance certificate and not a deployment approval.

## 12. Timestamp Status

The `timestamp` section should include:

- `evidence_timestamp`
- `timestamp_status`
- `freshness_window`
- `observed_at`

Recommended `timestamp_status` values:

- `valid`
- `missing`
- `stale`
- `malformed`
- `not_checked`

### Semantics

- `evidence_timestamp` preserves when the evidence says it was issued or observed.
- `timestamp_status` summarizes timestamp interpretability.
- `freshness_window` preserves configured or declared freshness context when one exists.
- `observed_at` records when Guard or the adapter observed the evidence.

Timestamp validity supports reviewability.
It does not create an approval window and does not imply downstream runtime authorization.

## 13. Policy Reference

The `policy` section should include:

- `policy_ref`
- `policy_visibility`
- `policy_verification_status`

### Semantics

- `policy_ref` preserves visible policy linkage declared by the issuer or evidence source.
- `policy_visibility` indicates whether that linkage was present, partial, absent, or redacted.
- `policy_verification_status` indicates whether Guard could verify the policy reference as visible context.

Guard may report whether policy context is visible.
Guard does not become policy authority merely because a policy reference appears in a normalized record.

## 14. Evidence References

The `evidence` section should include:

- `evidence_refs`
- `raw_payload_ref`
- `external_report_uri`
- `redaction_notice`
- `confidentiality_level`

### Semantics

- `evidence_refs` preserve links to supporting evidence objects, artifacts, logs, or payloads.
- `raw_payload_ref` preserves the raw payload location or retrieval reference when available.
- `external_report_uri` preserves issuer-side report or artifact references when disclosed.
- `redaction_notice` explicitly discloses missing or redacted parts of the evidence.
- `confidentiality_level` preserves bounded visibility constraints.

Guard should preserve raw references whenever possible.
It should not hide failed, missing, partial, confidential, or redacted evidence conditions.

## 15. Findings Attachment

The `findings` section should attach evidence interpretation findings to the normalized record.

Each finding should include at least:

- `finding_id`
- `finding_type`
- `severity`
- `message`
- `field`
- `evidence_ref`
- `recommendation`

### Semantics

- `finding_id` identifies the finding within the review artifact.
- `finding_type` categorizes the interpretation outcome.
- `severity` preserves bounded review priority, not enforcement priority.
- `message` explains the finding in review-oriented language.
- `field` points to the affected normalized field or evidence area.
- `evidence_ref` links the finding back to supporting evidence or missing evidence context.
- `recommendation` preserves additive guidance for human review or downstream reporting.

A finding is evidence interpretation.
It is not an approval result, not a block result, and not runtime authority.

## 16. Review Semantics

The `review` section should include:

- `review_status`
- `review_notes`
- `requires_human_review`
- `review_reasons`

### Semantics

- `review_status` summarizes review readiness or review attention state.
- `review_notes` preserve reviewer-facing summary information.
- `requires_human_review` explicitly marks whether human review remains necessary.
- `review_reasons` explain why human review is still needed.

The normalized record is human-review-oriented.
It exists to support reviewer interpretation, not to replace reviewer judgment.

## 17. Minimal Abstract Shape

The following vendor-neutral JSON illustrates the minimum abstract shape of a `v0.1` normalized record.
It intentionally avoids ramen-specific assumptions and avoids approval, blocking, or certification language.

```json
{
  "record": {
    "record_id": "ner-2026-07-07-001",
    "record_version": "0.1",
    "generated_at": "2026-07-07T11:30:00Z",
    "adapter_name": "external-receipt-normalizer",
    "adapter_version": "0.1"
  },
  "source": {
    "source_system": "external-runtime-example",
    "source_type": "runtime_receipt",
    "issuer": {
      "id": "issuer-example"
    },
    "issuer_key_ref": "keyref:issuer-example:2026-07",
    "trust_status": "visible_but_not_endorsed"
  },
  "receipt": {
    "receipt_id": "receipt-2026-07-07-001",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-2026-07-07-001.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-4fbe9c",
    "subject_ref": "artifact://actions/action-4fbe9c",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T11:30:02Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Signature context was visible.",
      "Policy linkage remained review-only context."
    ]
  },
  "integrity": {
    "payload_hash": "2c26b46b68ffc68ff99b453c1d30413413422b6b3f0f6b6f2b6d4f7f8c7d6e5a",
    "hash_algorithm": "sha256",
    "raw_payload_available": true,
    "payload_hash_status": "match"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "valid",
    "public_key_ref": "keyref:issuer-example:2026-07",
    "issuer_key_status": "available"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T10:15:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T11:29:58Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "log",
        "ref": "artifact://logs/build-log-17"
      },
      {
        "kind": "payload",
        "ref": "artifact://payloads/payload-17"
      }
    ],
    "raw_payload_ref": "artifact://payloads/payload-17",
    "external_report_uri": "artifact://reports/external-report-17",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-001",
      "finding_type": "verification_context",
      "severity": "info",
      "message": "Evidence was normalized into a review-oriented record.",
      "field": "verification.verification_status",
      "evidence_ref": "artifact://receipts/receipt-2026-07-07-001.json",
      "recommendation": "Continue human review using the preserved evidence references."
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Verification artifacts are available for reviewer inspection."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Normalized records remain review artifacts and do not replace reviewer judgment."
    ]
  }
}
```

## 18. Compatibility with Reference Adapters

Compatibility with reference adapters should remain broad and non-proprietary.

- ramen `v5` receipts can be normalized into this shape
- other external receipts can also be normalized into this shape
- no reference adapter owns the normalized record
- the normalized record should not embed ramen-specific assumptions

This allows Guard to preserve one internal review surface while still supporting heterogeneous issuers and receipt families.

## 19. Non-Goals

The `v0.1` Normalized Evidence Record does not include:

- no runtime authorization
- no enforcement semantics
- no deployment approval
- no compliance certification
- no automatic remediation
- no hidden evidence suppression
- no issuer trust registry in `v0.1`

The record is intentionally bounded.
It exists to preserve evidence interpretation and review stability, not to become a control plane surface.

## 20. Open Questions

Open questions for later bounded phases include:

- stable `record_id` derivation
- canonical payload hashing
- multi-receipt aggregation
- chained evidence
- confidential evidence handling
- redacted payload review
- trust registry integration
- key revocation
- adapter version compatibility

These questions are real, but they should remain future hardening questions rather than expand `v0.1` into runtime authority or platform behavior.
