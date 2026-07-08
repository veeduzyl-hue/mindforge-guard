# Ramen Receipt v5 Sample Mapped Record v0.1

## 1. Purpose

This document provides a documentation-only sample that shows how the `ramen-receipt-v5` reference adapter mapping may be expressed as Guard review artifacts.

This is a docs-only illustrative sample.
It is not a runtime adapter implementation.
It is not an executable fixture.
It is not a conformance vector.
It is not a product integration announcement.
It is not a runtime registry entry.
It is not dynamic loading config.
It is not a package export.
It is not an approval, blocking, certification, or deployment-control layer.
It is not a trust registry.

ramen issues. Guard verifies.

External systems issue evidence. Guard verifies evidence.

The purpose of this document is to illustrate how one documentation-only ramen receipt example may be represented as contract validation, verification interpretation, normalized evidence record, verification findings, and reviewer-facing report language without introducing runtime authority.

## 2. Sample Scope

This sample covers:

- illustrative external receipt input shape
- contract validation interpretation
- verification interpretation
- normalized evidence record shape
- verification findings
- reviewer-facing Guard report language
- explicit limitations

This sample does not cover:

- runtime signature verification code
- Ed25519 implementation
- payload hash computation implementation
- fixture execution
- conformance vector execution
- CI gate beyond the existing static verifier
- package export
- runtime adapter loading

## 3. Illustrative Ramen Receipt Input

The following JSON-like example is documentation-only.
It uses fake identifiers, fake hashes, fake signatures, and fake references for illustration only.
It is not a real ramen receipt, not a real key, and not a fixture.

```json
{
  "documentation_only": true,
  "receipt_id": "ramen-v5-demo-001",
  "receipt_version": "v5",
  "issuer": "example-ramen-producer",
  "subject": "example-agent-action",
  "evidence_timestamp": "2026-07-08T00:00:00Z",
  "payload_hash": "sha256:examplepayloadhash",
  "hash_algorithm": "sha256",
  "signature": "example-signature-not-real",
  "signature_algorithm": "ed25519",
  "public_key_ref": "example-key-ref",
  "policy_ref": "example-policy-ref",
  "evidence_refs": [
    "example://evidence/action-log",
    "example://evidence/tool-call-log"
  ]
}
```

## 4. Contract Validation Interpretation

The following table shows how the sample may be interpreted against the External Receipt Contract:

| Contract Area | Sample Value | Interpretation |
| --- | --- | --- |
| receipt id | `ramen-v5-demo-001` | present |
| issuer | `example-ramen-producer` | visible, not trusted by default |
| signature | `example-signature-not-real` | present but illustrative only |
| signing algorithm | `ed25519` | declared |
| payload hash | `sha256:examplepayloadhash` | present |
| evidence timestamp | `2026-07-08T00:00:00Z` | present |
| policy reference | `example-policy-ref` | visible for review only |
| evidence refs | two example references | present |
| raw payload | not included in the sample | remains incomplete |

Contract parseability does not imply approval.
Issuer visibility does not imply trust.
Policy reference visibility does not imply policy authority.

## 5. Verification Interpretation

The sample verification interpretation remains documentation-only:

- integrity verification
  - status remains `verification_not_performed` because the sample does not include executable payload comparison
- signature verification
  - not performed because the signature is illustrative and not a real verification input
- timestamp verification
  - timestamp is visible but not checked against a runtime clock
- policy reference
  - visible for review only
- evidence completeness
  - partial because raw payload is not provided

This sample must not be read as a real cryptographic verification result.

## 6. Normalized Evidence Record Example

The following JSON-like example illustrates how the sample may be represented as a `NormalizedEvidenceRecord` aligned with the type-only contracts:

```json
{
  "record": {
    "record_id": "ner-ramen-v5-demo-001",
    "record_version": "0.1",
    "generated_at": "2026-07-08T00:05:00Z"
  },
  "adapter": {
    "adapter_name": "ramen receipt v5 reference adapter",
    "adapter_version": "0.1",
    "source_type": "runtime_receipt",
    "limitations": {
      "raw_payload_available": false,
      "issuer_key_available": false,
      "limitations": [
        "documentation-only illustrative sample",
        "no runtime cryptographic verification performed",
        "illustrative signature is not real verification input"
      ]
    }
  },
  "source": {
    "source_system": "example-ramen-producer",
    "source_type": "runtime_receipt",
    "issuer": "example-ramen-producer",
    "issuer_key_ref": "example-key-ref",
    "trust_status": "not_checked"
  },
  "receipt": {
    "receipt_id": "ramen-v5-demo-001",
    "receipt_version": "v5",
    "raw_receipt_ref": "documentation://ramen-v5-demo-001"
  },
  "subject": {
    "subject": "example-agent-action",
    "subject_type": "agent_action_evidence",
    "action_summary": "Documentation-only sample showing how a ramen receipt v5 mapping may appear in Guard review artifacts."
  },
  "verification": {
    "status": "verification_not_performed",
    "integrity": {
      "payload_hash": "sha256:examplepayloadhash",
      "hash_algorithm": "sha256",
      "raw_payload_available": false,
      "payload_hash_status": "not_checked"
    },
    "signature": {
      "signature_present": true,
      "signature_algorithm": "ed25519",
      "signature_status": "not_checked",
      "public_key_ref": "example-key-ref",
      "issuer_key_available": false
    },
    "timestamp": {
      "evidence_timestamp": "2026-07-08T00:00:00Z",
      "timestamp_status": "not_checked",
      "observed_at": "2026-07-08T00:05:00Z"
    },
    "diagnostics": [
      {
        "diagnostic_id": "diag-verify-001",
        "stage": "verify",
        "code": "documentation_only_sample",
        "field": "verification.status",
        "message": "Runtime cryptographic verification was not performed because this document is illustrative only.",
        "severity": "info"
      }
    ],
    "limitations": {
      "raw_payload_available": false,
      "issuer_key_available": false,
      "limitations": [
        "verification interpretation is illustrative only",
        "no executable signature verification was performed"
      ]
    }
  },
  "contract_validation": {
    "status": "contract_parseable",
    "required_fields_present": true,
    "missing_required_fields": [],
    "diagnostics": [
      {
        "diagnostic_id": "diag-validate-001",
        "stage": "validate",
        "code": "documentation_contract_parseable",
        "field": "contract_validation.status",
        "message": "The documentation-only sample includes the minimum fields needed to illustrate contract parseability.",
        "severity": "info"
      }
    ],
    "limitations": {
      "raw_payload_available": false,
      "issuer_key_available": false,
      "limitations": [
        "contract interpretation is illustrative only",
        "sample does not prove runtime trust or approval"
      ]
    }
  },
  "evidence": {
    "evidence_refs": [
      "example://evidence/action-log",
      "example://evidence/tool-call-log"
    ],
    "raw_payload_ref": "documentation://not-included",
    "external_report_uri": "documentation://ramen-v5-demo-report",
    "completeness_status": "partial"
  },
  "diagnostics": [
    {
      "diagnostic_id": "diag-parse-001",
      "stage": "parse",
      "code": "documentation_only_input",
      "field": "receipt.receipt_id",
      "message": "The sample input is documentation-only and uses fake identifiers.",
      "severity": "info"
    }
  ],
  "findings": [
    {
      "finding_id": "finding-review-001",
      "finding_type": "requires_human_review",
      "category": "review",
      "severity": "info",
      "message": "This sample mapped record is illustrative and should be treated as documentation-only review material.",
      "recommendation": "Use this example to understand mapping structure, not as runtime evidence.",
      "verification_stage": "emit_findings",
      "source_adapter": "ramen receipt v5 reference adapter"
    }
  ]
}
```

`record_version` remains `"0.1"`.
`contract_validation` remains first-class.
`verification.status` is not approval language.
`findings` remain review artifacts, not decisions.

## 7. Verification Findings Example

The following JSON-like findings illustrate one possible review-oriented finding set for the sample:

```json
[
  {
    "finding_id": "finding-identity-001",
    "finding_type": "issuer_visible",
    "category": "identity",
    "severity": "info",
    "message": "Issuer identity is visible in the documentation-only sample.",
    "recommendation": "Treat issuer visibility as review context only.",
    "verification_stage": "validate",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-integrity-001",
    "finding_type": "payload_not_checked",
    "category": "integrity",
    "severity": "medium",
    "message": "Payload integrity was not checked because the documentation-only sample does not include a raw payload.",
    "recommendation": "Do not interpret payload hash visibility as completed integrity verification.",
    "verification_stage": "verify",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-signature-001",
    "finding_type": "signature_not_checked",
    "category": "signature",
    "severity": "medium",
    "message": "Signature verification was not performed because the sample signature is illustrative only.",
    "recommendation": "Preserve the limitation explicitly for reviewer attention.",
    "verification_stage": "verify",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-timestamp-001",
    "finding_type": "timestamp_not_checked",
    "category": "timestamp",
    "severity": "low",
    "message": "The timestamp is visible in the sample but was not checked against any runtime freshness context.",
    "recommendation": "Treat timestamp visibility as review context only.",
    "verification_stage": "verify",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-policy-001",
    "finding_type": "policy_ref_visible",
    "category": "policy_reference",
    "severity": "info",
    "message": "A policy reference is visible in the sample as documentation-only context.",
    "recommendation": "Do not interpret policy visibility as policy authority.",
    "verification_stage": "validate",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-completeness-001",
    "finding_type": "partial_evidence",
    "category": "evidence_completeness",
    "severity": "medium",
    "message": "The sample evidence set is partial because no raw payload is included.",
    "recommendation": "Keep completeness limits visible in the mapped record.",
    "verification_stage": "normalize",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-adapter-001",
    "finding_type": "verification_not_performed",
    "category": "adapter",
    "severity": "info",
    "message": "The adapter example is documentation-only and does not perform runtime verification.",
    "recommendation": "Use the sample to understand shape alignment only.",
    "verification_stage": "verify",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-compatibility-001",
    "finding_type": "contract_parseable",
    "category": "compatibility",
    "severity": "info",
    "message": "The sample is sufficient to illustrate minimum contract parseability.",
    "recommendation": "Do not overread contract parseability as execution approval.",
    "verification_stage": "validate",
    "source_adapter": "ramen receipt v5 reference adapter"
  },
  {
    "finding_id": "finding-review-002",
    "finding_type": "reviewer_attention_recommended",
    "category": "review",
    "severity": "medium",
    "message": "Reviewer attention is recommended because the sample uses illustrative cryptographic fields and incomplete payload evidence.",
    "recommendation": "Treat the sample as a mapping example only.",
    "verification_stage": "emit_findings",
    "source_adapter": "ramen receipt v5 reference adapter"
  }
]
```

Severity remains review significance only.
High or critical severity would still not equal block.
These findings do not use approval, blocked, certified, or safe authority language.

## 8. Guard Report Language Example

## External Evidence Review Summary

Guard reviewed a documentation-only ramen receipt v5 sample mapping.

Verification status: verification not performed for cryptographic checks; contract parseability is illustrated only.

Reviewer attention recommended:

- signature field is illustrative and was not cryptographically verified
- raw payload is not included in the documentation-only sample
- policy reference is visible but does not imply policy authority

Recommendation:
Human reviewer should treat this as a mapping example only.

Boundary note:
This summary is recommendation-only and does not approve, block, certify, authorize, or control the underlying action.

## 9. Mapping to Registry Entry

This sample maps back to the registry entry:

`ramen-receipt-v5`

The sample preserves the same reviewer-facing registry posture:

- `reference_status`: `non_privileged_reference`
- `lifecycle_status`: `review_stage`
- `evidence_contract_level`: `review_ready`
- documentation-layer only
- not a runtime registry
- not a trust registry
- not an allowlist

## 10. Limitations

Current limitations include:

- sample is documentation-only
- sample does not perform cryptographic verification
- sample does not include a real signature
- sample does not include a real public key
- sample does not include an executable fixture
- sample does not include a conformance vector
- sample does not alter Guard runtime behavior
- sample does not export registry types
- sample does not implement a ramen adapter
- sample does not imply approval, blocking, certification, or deployment control

## 11. Verification

The current verification path remains:

```bash
npm run verify:external-evidence:type-contract
npm run verify
```

This PR does not add runtime tests because it does not add runtime implementation.

## 12. Conclusion

This sample mapped record illustrates how a ramen receipt v5 reference adapter mapping can be represented as Guard review artifacts.

It preserves the boundary: ramen issues. Guard verifies.

It does not introduce runtime execution, approval, blocking, certification, deployment control, package exports, dynamic loading, fixtures, conformance vectors, or privileged dependency semantics.
