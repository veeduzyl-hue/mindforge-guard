# Sample Evidence Records v0.1

## Core Positioning

Sample Evidence Records illustrate how external runtime evidence can be normalized into Guard's verification-oriented review artifacts. They are examples for review semantics, not executable fixtures, approval outcomes, or deployment gates.

A sample evidence record shows what Guard could verify, could not verify, or could only partially verify. It does not decide whether the underlying action may proceed.

The boundary remains:

- Guard independently verifies external runtime evidence.
- External systems issue evidence. Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not issue, approve, block, execute, certify, or control runtime actions.

## 1. Purpose

Sample evidence records exist to make the Phase 1 framework concrete without turning architecture examples into runtime authority.

They are needed to:

- make External Receipt Contract concrete
- show how Normalized Evidence Records may look
- demonstrate Verification Findings Taxonomy usage
- help reviewers understand verification states
- avoid turning examples into runtime authority

These examples are documentation artifacts.
They clarify how verification-oriented records may be represented and interpreted.
They do not claim executable completeness and do not replace bounded implementation or verifier behavior.

## 2. Boundary

Sample evidence records are not:

- executable fixtures
- approval results
- blocking decisions
- compliance certificates
- deployment gates
- runtime authorization objects
- vendor-specific requirements

This boundary is important because concrete examples can be mistaken for normative runtime outputs.
In `v0.1`, these samples exist to illustrate review semantics only.
They do not define enforcement behavior, change upstream runtime state, or imply deployability.

## 3. Sample Format Notes

These examples follow several documentation constraints:

- examples are vendor-neutral
- examples use abstract source names
- examples avoid ramen-specific fields
- examples use verification and review language
- examples preserve raw evidence references
- examples may omit full cryptographic material for readability
- examples are documentation examples, not conformance vectors

The samples intentionally prefer concise, review-oriented values over full cryptographic payloads.
Where cryptographic or receipt details are abbreviated, the purpose is readability rather than schema minimization.

## 4. Common Record Skeleton

The following JSON skeleton shows the common shape used across the sample records.

```json
{
  "record": {
    "record_id": "ner-example-001",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:00:00Z",
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
    "receipt_id": "receipt-example-001",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-example-001.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-example-001",
    "subject_ref": "artifact://actions/action-example-001",
    "action_summary": "External evidence describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:00:05Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": []
  },
  "integrity": {
    "payload_hash": "example-hash-value",
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
    "evidence_timestamp": "2026-07-07T11:45:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T11:59:58Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [],
    "raw_payload_ref": "artifact://payloads/payload-example-001",
    "external_report_uri": "artifact://reports/external-report-example-001",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [],
    "requires_human_review": true,
    "review_reasons": []
  }
}
```

## 5. Sample A: Fully Verified Signed Receipt

This sample illustrates a receipt that is parseable, integrity-verifiable, and review-ready under the available evidence.

Important boundary:

- status may be `verified`
- this does not mean approved
- this does not mean safe
- this does not mean deployment-ready

```json
{
  "record": {
    "record_id": "ner-sample-a",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:10:00Z",
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
    "receipt_id": "receipt-sample-a",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-a.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-a",
    "subject_ref": "artifact://actions/action-sample-a",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:10:04Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Verification succeeded within the available evidence boundary."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-a",
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
    "evidence_timestamp": "2026-07-07T11:55:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:09:57Z"
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
        "ref": "artifact://logs/sample-a-build-log"
      },
      {
        "kind": "payload",
        "ref": "artifact://payloads/sample-a"
      }
    ],
    "raw_payload_ref": "artifact://payloads/sample-a",
    "external_report_uri": "artifact://reports/sample-a",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-a-001",
      "finding_type": "issuer_visible",
      "category": "identity",
      "severity": "info",
      "field": "source.issuer",
      "message": "Issuer identity was visible for review interpretation.",
      "evidence_ref": "artifact://receipts/receipt-sample-a.json",
      "recommendation": "Preserve issuer provenance for human review.",
      "verification_stage": "identity_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-a-002",
      "finding_type": "valid_signature",
      "category": "signature",
      "severity": "info",
      "field": "signature.signature_status",
      "message": "Signature verified under the available key context.",
      "evidence_ref": "artifact://receipts/receipt-sample-a.json",
      "recommendation": "Use signature validity as verification evidence only.",
      "verification_stage": "signature_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-a-003",
      "finding_type": "payload_hash_match",
      "category": "integrity",
      "severity": "info",
      "field": "integrity.payload_hash_status",
      "message": "Payload hash matched the available raw payload evidence.",
      "evidence_ref": "artifact://payloads/sample-a",
      "recommendation": "Preserve integrity evidence in the review record.",
      "verification_stage": "integrity_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-a-004",
      "finding_type": "policy_ref_visible",
      "category": "policy_reference",
      "severity": "info",
      "field": "policy.policy_ref",
      "message": "Policy reference was visible as contextual evidence.",
      "evidence_ref": "artifact://receipts/receipt-sample-a.json",
      "recommendation": "Treat policy linkage as review context only.",
      "verification_stage": "policy_context_review",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Record is review-ready and remains recommendation only."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Verified evidence does not replace human judgment."
    ]
  }
}
```

## 6. Sample B: Invalid Signature

This sample illustrates evidence where the signature is present but invalid.
The record remains review-oriented and requires human review.

```json
{
  "record": {
    "record_id": "ner-sample-b",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:20:00Z",
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
    "receipt_id": "receipt-sample-b",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-b.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-b",
    "subject_ref": "artifact://actions/action-sample-b",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "not_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:20:04Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Signature verification failed."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-b",
    "hash_algorithm": "sha256",
    "raw_payload_available": false,
    "payload_hash_status": "not_checked"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "invalid",
    "public_key_ref": "keyref:issuer-example:2026-07",
    "issuer_key_status": "available"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T11:58:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:19:58Z"
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
        "ref": "artifact://logs/sample-b-build-log"
      }
    ],
    "raw_payload_ref": null,
    "external_report_uri": "artifact://reports/sample-b",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-b-001",
      "finding_type": "invalid_signature",
      "category": "signature",
      "severity": "critical",
      "field": "signature.signature_status",
      "message": "Signature verification failed under the available key context.",
      "evidence_ref": "artifact://receipts/receipt-sample-b.json",
      "recommendation": "Inspect receipt integrity and issuer context before relying on the evidence.",
      "verification_stage": "signature_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-b-002",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "field": "review.requires_human_review",
      "message": "Human review remains required because verification did not confirm signature authenticity.",
      "evidence_ref": "artifact://receipts/receipt-sample-b.json",
      "recommendation": "Review the record as recommendation-only evidence.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Invalid signature materially weakens verification confidence."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Signature authenticity could not be established."
    ]
  }
}
```

## 7. Sample C: Payload Hash Mismatch

This sample illustrates a record where the signature may be valid but the payload hash does not match the available raw payload.

Important boundary:

- hash mismatch is integrity evidence
- Guard reports it
- Guard does not enforce runtime blocking

```json
{
  "record": {
    "record_id": "ner-sample-c",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:30:00Z",
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
    "receipt_id": "receipt-sample-c",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-c.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-c",
    "subject_ref": "artifact://actions/action-sample-c",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:30:04Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Signature verified, but integrity comparison found a mismatch."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-c",
    "hash_algorithm": "sha256",
    "raw_payload_available": true,
    "payload_hash_status": "mismatch"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "valid",
    "public_key_ref": "keyref:issuer-example:2026-07",
    "issuer_key_status": "available"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T12:00:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:29:59Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "payload",
        "ref": "artifact://payloads/sample-c"
      }
    ],
    "raw_payload_ref": "artifact://payloads/sample-c",
    "external_report_uri": "artifact://reports/sample-c",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-c-001",
      "finding_type": "payload_hash_mismatch",
      "category": "integrity",
      "severity": "critical",
      "field": "integrity.payload_hash_status",
      "message": "Payload hash did not match the available raw payload evidence.",
      "evidence_ref": "artifact://payloads/sample-c",
      "recommendation": "Inspect payload lineage and preserve the mismatch as integrity evidence.",
      "verification_stage": "integrity_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-c-002",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "field": "review.requires_human_review",
      "message": "Integrity mismatch requires human review.",
      "evidence_ref": "artifact://payloads/sample-c",
      "recommendation": "Review the evidence as recommendation only; do not infer runtime enforcement.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Integrity mismatch reduces evidence confidence."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Payload binding could not be confirmed."
    ]
  }
}
```

## 8. Sample D: Missing Policy Reference

This sample illustrates a record that is otherwise parseable and integrity-verifiable but lacks a visible policy reference.
Reviewability is reduced, but the record is not automatically invalid.

Important boundary:

- missing policy_ref does not automatically invalidate the receipt
- Guard is not policy authority

```json
{
  "record": {
    "record_id": "ner-sample-d",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:40:00Z",
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
    "receipt_id": "receipt-sample-d",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-d.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-d",
    "subject_ref": "artifact://actions/action-sample-d",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:40:03Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "No visible policy reference was available."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-d",
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
    "evidence_timestamp": "2026-07-07T12:05:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:39:58Z"
  },
  "policy": {
    "policy_ref": null,
    "policy_visibility": "absent",
    "policy_verification_status": "not_visible"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "payload",
        "ref": "artifact://payloads/sample-d"
      }
    ],
    "raw_payload_ref": "artifact://payloads/sample-d",
    "external_report_uri": "artifact://reports/sample-d",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-d-001",
      "finding_type": "missing_policy_ref",
      "category": "policy_reference",
      "severity": "low",
      "field": "policy.policy_ref",
      "message": "Policy reference was not visible in the supplied evidence.",
      "evidence_ref": "artifact://receipts/receipt-sample-d.json",
      "recommendation": "Record the missing policy context and continue bounded review without inferring invalidity.",
      "verification_stage": "policy_context_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-d-002",
      "finding_type": "reviewer_attention_recommended",
      "category": "review",
      "severity": "medium",
      "field": "review.review_notes",
      "message": "Reduced policy visibility should be noted during review.",
      "evidence_ref": "artifact://receipts/receipt-sample-d.json",
      "recommendation": "Inspect whether policy context is needed for the review objective.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Policy linkage is incomplete but the record remains interpretable."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Policy context may matter to the reviewer even though Guard is not policy authority."
    ]
  }
}
```

## 9. Sample E: Raw Payload Unavailable

This sample illustrates a record where a payload hash exists, but the raw payload is unavailable, so Guard cannot confirm the hash match.

```json
{
  "record": {
    "record_id": "ner-sample-e",
    "record_version": "0.1",
    "generated_at": "2026-07-07T12:50:00Z",
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
    "receipt_id": "receipt-sample-e",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-e.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-e",
    "subject_ref": "artifact://actions/action-sample-e",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T12:50:03Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Raw payload was unavailable, so payload comparison could not be completed."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-e",
    "hash_algorithm": "sha256",
    "raw_payload_available": false,
    "payload_hash_status": "not_checked"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "valid",
    "public_key_ref": "keyref:issuer-example:2026-07",
    "issuer_key_status": "available"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T12:10:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:49:57Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "report",
        "ref": "artifact://reports/sample-e"
      }
    ],
    "raw_payload_ref": null,
    "external_report_uri": "artifact://reports/sample-e",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-e-001",
      "finding_type": "raw_payload_unavailable",
      "category": "integrity",
      "severity": "medium",
      "field": "evidence.raw_payload_ref",
      "message": "Raw payload was unavailable for payload hash comparison.",
      "evidence_ref": "artifact://reports/sample-e",
      "recommendation": "Preserve the limitation and retrieve payload evidence if available.",
      "verification_stage": "integrity_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-e-002",
      "finding_type": "payload_not_checked",
      "category": "integrity",
      "severity": "medium",
      "field": "integrity.payload_hash_status",
      "message": "Payload comparison was not completed because required evidence was unavailable.",
      "evidence_ref": "artifact://reports/sample-e",
      "recommendation": "Avoid overstating integrity confidence.",
      "verification_stage": "integrity_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-e-003",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "field": "review.requires_human_review",
      "message": "Human review remains required because integrity verification is incomplete.",
      "evidence_ref": "artifact://reports/sample-e",
      "recommendation": "Review the record as partially verified evidence.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Integrity verification remained incomplete due to missing raw payload evidence."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Payload binding could not be fully assessed."
    ]
  }
}
```

## 10. Sample F: Partial or Redacted Evidence

This sample illustrates evidence that is parseable but partially redacted or confidential.
Guard labels those limitations explicitly rather than hiding them.

```json
{
  "record": {
    "record_id": "ner-sample-f",
    "record_version": "0.1",
    "generated_at": "2026-07-07T13:00:00Z",
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
    "receipt_id": "receipt-sample-f",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-f.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-f",
    "subject_ref": "artifact://actions/action-sample-f",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "restricted-review"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T13:00:03Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Some evidence references were redacted or confidentiality-labeled."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-f",
    "hash_algorithm": "sha256",
    "raw_payload_available": false,
    "payload_hash_status": "not_checked"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "valid",
    "public_key_ref": "keyref:issuer-example:2026-07",
    "issuer_key_status": "available"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T12:20:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T12:59:59Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "payload",
        "ref": "artifact://payloads/sample-f-redacted"
      },
      {
        "kind": "log",
        "ref": "artifact://logs/sample-f-confidential"
      }
    ],
    "raw_payload_ref": null,
    "external_report_uri": "artifact://reports/sample-f",
    "redaction_notice": "Payload and log excerpts were intentionally redacted for confidentiality.",
    "confidentiality_level": "restricted"
  },
  "findings": [
    {
      "finding_id": "finding-f-001",
      "finding_type": "partial_evidence",
      "category": "evidence_completeness",
      "severity": "medium",
      "field": "evidence.evidence_refs",
      "message": "Evidence was present but not complete for full verification coverage.",
      "evidence_ref": "artifact://reports/sample-f",
      "recommendation": "Preserve the partial scope explicitly in the review record.",
      "verification_stage": "evidence_collection_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-f-002",
      "finding_type": "redacted_evidence",
      "category": "evidence_completeness",
      "severity": "medium",
      "field": "evidence.redaction_notice",
      "message": "Evidence redaction was explicitly disclosed.",
      "evidence_ref": "artifact://reports/sample-f",
      "recommendation": "Inspect whether redaction materially limits interpretation.",
      "verification_stage": "evidence_collection_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-f-003",
      "finding_type": "confidential_evidence_labeled",
      "category": "evidence_completeness",
      "severity": "info",
      "field": "evidence.confidentiality_level",
      "message": "Confidential evidence handling was explicitly labeled.",
      "evidence_ref": "artifact://reports/sample-f",
      "recommendation": "Preserve confidentiality context during review.",
      "verification_stage": "evidence_collection_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-f-004",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "field": "review.requires_human_review",
      "message": "Human review remains required because evidence completeness is limited.",
      "evidence_ref": "artifact://reports/sample-f",
      "recommendation": "Treat the record as partially verified and preserve its limits.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Evidence remains interpretable but not complete."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Redaction and confidentiality reduced verification completeness."
    ]
  }
}
```

## 11. Sample G: Unsupported Receipt Version

This sample illustrates a record where the adapter can parse basic identity but the receipt version is unsupported, so verification is not fully performed and review readiness is limited.

```json
{
  "record": {
    "record_id": "ner-sample-g",
    "record_version": "0.1",
    "generated_at": "2026-07-07T13:10:00Z",
    "adapter_name": "external-receipt-normalizer",
    "adapter_version": "0.1"
  },
  "source": {
    "source_system": "external-runtime-example",
    "source_type": "runtime_receipt",
    "issuer": {
      "id": "issuer-example"
    },
    "issuer_key_ref": null,
    "trust_status": "visible_but_not_endorsed"
  },
  "receipt": {
    "receipt_id": "receipt-sample-g",
    "receipt_version": "9.7",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-g.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-g",
    "subject_ref": "artifact://actions/action-sample-g",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "verification_not_performed",
    "verification_performed": false,
    "verification_time": "2026-07-07T13:10:02Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Receipt version was outside the supported mapping range."
    ]
  },
  "integrity": {
    "payload_hash": null,
    "hash_algorithm": null,
    "raw_payload_available": false,
    "payload_hash_status": "not_checked"
  },
  "signature": {
    "signature_present": false,
    "signature_algorithm": null,
    "signature_status": "not_checked",
    "public_key_ref": null,
    "issuer_key_status": "unavailable"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T12:30:00Z",
    "timestamp_status": "valid",
    "freshness_window": null,
    "observed_at": "2026-07-07T13:09:59Z"
  },
  "policy": {
    "policy_ref": null,
    "policy_visibility": "unknown",
    "policy_verification_status": "not_checked"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "receipt",
        "ref": "artifact://receipts/receipt-sample-g.json"
      }
    ],
    "raw_payload_ref": null,
    "external_report_uri": null,
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-g-001",
      "finding_type": "unsupported_receipt_version",
      "category": "adapter",
      "severity": "high",
      "field": "receipt.receipt_version",
      "message": "Receipt version was recognized as outside the supported mapping boundary.",
      "evidence_ref": "artifact://receipts/receipt-sample-g.json",
      "recommendation": "Preserve the version mismatch and avoid forcing verification claims.",
      "verification_stage": "adapter_parse_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-g-002",
      "finding_type": "verification_not_performed",
      "category": "adapter",
      "severity": "medium",
      "field": "verification.verification_performed",
      "message": "Verification was not performed because the receipt version was unsupported.",
      "evidence_ref": "artifact://receipts/receipt-sample-g.json",
      "recommendation": "Treat the record as outside full verification scope.",
      "verification_stage": "adapter_parse_review",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-g-003",
      "finding_type": "not_review_ready",
      "category": "compatibility",
      "severity": "high",
      "field": "review.review_status",
      "message": "The record is not review-ready for full interpretation under the current mapping boundary.",
      "evidence_ref": "artifact://receipts/receipt-sample-g.json",
      "recommendation": "Resolve version support or treat the review as provisional only.",
      "verification_stage": "compatibility_review",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "not_review_ready",
    "review_notes": [
      "Unsupported version limited verification scope."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "The record could not be fully interpreted under the current mapping boundary."
    ]
  }
}
```

## 12. Sample H: Unknown Issuer Key

This sample illustrates a record where the issuer is visible and the signature is present, but the public key is unavailable, so signature verification cannot be completed.

```json
{
  "record": {
    "record_id": "ner-sample-h",
    "record_version": "0.1",
    "generated_at": "2026-07-07T13:20:00Z",
    "adapter_name": "external-receipt-normalizer",
    "adapter_version": "0.1"
  },
  "source": {
    "source_system": "external-runtime-example",
    "source_type": "runtime_receipt",
    "issuer": {
      "id": "issuer-example"
    },
    "issuer_key_ref": "keyref:issuer-example:unknown",
    "trust_status": "visible_but_not_endorsed"
  },
  "receipt": {
    "receipt_id": "receipt-sample-h",
    "receipt_version": "0.1",
    "receipt_type": "external_runtime_receipt",
    "raw_receipt_ref": "artifact://receipts/receipt-sample-h.json",
    "parent_receipt_id": null
  },
  "subject": {
    "subject_type": "runtime_action",
    "subject_id": "action-sample-h",
    "subject_ref": "artifact://actions/action-sample-h",
    "action_summary": "Receipt describes a completed runtime action.",
    "runtime_context": {
      "surface": "ci_pipeline",
      "environment": "staging"
    }
  },
  "verification": {
    "verification_status": "partially_verified",
    "verification_performed": true,
    "verification_time": "2026-07-07T13:20:03Z",
    "verifier": "guard-external-receipt-normalizer",
    "verification_notes": [
      "Signature material was present, but public key material was unavailable."
    ]
  },
  "integrity": {
    "payload_hash": "hash-sample-h",
    "hash_algorithm": "sha256",
    "raw_payload_available": true,
    "payload_hash_status": "match"
  },
  "signature": {
    "signature_present": true,
    "signature_algorithm": "ecdsa-p256-sha256",
    "signature_status": "not_checked",
    "public_key_ref": "keyref:issuer-example:unknown",
    "issuer_key_status": "unavailable"
  },
  "timestamp": {
    "evidence_timestamp": "2026-07-07T12:35:00Z",
    "timestamp_status": "valid",
    "freshness_window": "PT24H",
    "observed_at": "2026-07-07T13:19:58Z"
  },
  "policy": {
    "policy_ref": "policy:runtime-evidence:baseline-v1",
    "policy_visibility": "visible",
    "policy_verification_status": "not_authoritative"
  },
  "evidence": {
    "evidence_refs": [
      {
        "kind": "payload",
        "ref": "artifact://payloads/sample-h"
      }
    ],
    "raw_payload_ref": "artifact://payloads/sample-h",
    "external_report_uri": "artifact://reports/sample-h",
    "redaction_notice": null,
    "confidentiality_level": "internal-review"
  },
  "findings": [
    {
      "finding_id": "finding-h-001",
      "finding_type": "issuer_key_unavailable",
      "category": "signature",
      "severity": "high",
      "field": "signature.public_key_ref",
      "message": "Issuer key material was unavailable for signature verification.",
      "evidence_ref": "artifact://receipts/receipt-sample-h.json",
      "recommendation": "Preserve the key discovery limitation and avoid overstating authenticity claims.",
      "verification_stage": "signature_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-h-002",
      "finding_type": "signature_not_checked",
      "category": "signature",
      "severity": "medium",
      "field": "signature.signature_status",
      "message": "Signature verification was not completed because public key material was unavailable.",
      "evidence_ref": "artifact://receipts/receipt-sample-h.json",
      "recommendation": "Treat the record as partially verified and preserve the verification limit.",
      "verification_stage": "signature_verification",
      "source_adapter": "external-receipt-normalizer"
    },
    {
      "finding_id": "finding-h-003",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "field": "review.requires_human_review",
      "message": "Human review remains required because signature authenticity could not be confirmed.",
      "evidence_ref": "artifact://receipts/receipt-sample-h.json",
      "recommendation": "Review the record with explicit attention to key availability limits.",
      "verification_stage": "review_preparation",
      "source_adapter": "external-receipt-normalizer"
    }
  ],
  "review": {
    "review_status": "requires_human_review",
    "review_notes": [
      "Issuer key availability limited signature interpretation."
    ],
    "requires_human_review": true,
    "review_reasons": [
      "Signature authenticity could not be fully evaluated."
    ]
  }
}
```

## 13. Compatibility Summary

The following table summarizes how each sample sits within the compatibility vocabulary defined in `v0.1`.

| Sample | contract_parseable | integrity_verifiable | review_ready | Key Findings |
| --- | --- | --- | --- | --- |
| Sample A | yes | yes | yes | `valid_signature`, `payload_hash_match`, `policy_ref_visible` |
| Sample B | yes | partial | yes | `invalid_signature`, `requires_human_review` |
| Sample C | yes | yes | yes | `payload_hash_mismatch`, `requires_human_review` |
| Sample D | yes | yes | yes | `missing_policy_ref`, `reviewer_attention_recommended` |
| Sample E | yes | partial | yes | `raw_payload_unavailable`, `payload_not_checked`, `requires_human_review` |
| Sample F | yes | partial | yes | `partial_evidence`, `redacted_evidence`, `confidential_evidence_labeled`, `requires_human_review` |
| Sample G | yes | no | no | `unsupported_receipt_version`, `verification_not_performed`, `not_review_ready` |
| Sample H | yes | partial | yes | `issuer_key_unavailable`, `signature_not_checked`, `requires_human_review` |

The table uses `yes`, `no`, and `partial`.
It does not use deployment or enforcement judgments.

## 14. Report Language Examples

Each sample may be summarized in Guard-style report language like the following:

- Sample A: `Receipt evidence was verified within the available boundary and remains recommendation only for human review.`
- Sample B: `Signature invalid; evidence not verified and requires human review.`
- Sample C: `Integrity mismatch detected; evidence partially verified and requires human review.`
- Sample D: `Policy reference not visible; evidence partially verified and reviewer attention is recommended.`
- Sample E: `Raw payload unavailable; integrity not verified and requires human review.`
- Sample F: `Evidence incomplete due to redaction and confidentiality limits; record remains partially verified and requires human review.`
- Sample G: `Unsupported receipt version; verification not performed and record is not review-ready.`
- Sample H: `Issuer key unavailable; signature not verified and requires human review.`

Preferred language across these examples includes:

- `verified`
- `not verified`
- `partially verified`
- `evidence incomplete`
- `integrity mismatch`
- `signature invalid`
- `timestamp missing`
- `issuer key unavailable`
- `requires human review`
- `recommendation only`

Avoided language includes:

- `approved`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `allowed for deployment`
- `production ready`
- `enforcement passed`

## 15. Relationship to Reference Adapters

These samples are subordinate to the framework and may be instantiated by multiple adapter families.

- ramen `v5` can produce records resembling some of these samples
- other external evidence sources can also map into the same examples
- samples do not define adapter-specific requirements
- samples are subordinate to the External Receipt Contract, Normalized Evidence Record, and Findings Taxonomy

The presence of a sample does not imply a required issuer, privileged vendor relationship, or default adapter implementation.

## 16. Non-Goals

The sample document does not include:

- no executable fixture suite
- no conformance certification
- no runtime gate behavior
- no production readiness claim
- no privileged issuer assumption
- no trust registry semantics
- no adapter implementation requirement

This keeps the document architecture-first and prevents example records from being misread as runtime policy or product commitments.

## 17. Open Questions

Open questions for later bounded phases include:

- when documentation samples should become fixtures
- how much cryptographic material examples should include
- canonical JSON examples vs compact examples
- redaction display format
- multi-receipt examples
- chained evidence examples
- CI/CD-specific samples
- agent-runtime-specific samples

These questions should remain future hardening topics rather than expand `v0.1` into runtime authority, enforcement semantics, or vendor-specific assumptions.
