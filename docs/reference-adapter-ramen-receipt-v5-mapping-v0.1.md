# Ramen Receipt v5 Reference Adapter Mapping v0.1

## 1. Purpose

This document defines the documentation-layer mapping for `ramen-receipt-v5` as one non-privileged reference adapter.

This is a docs-only mapping.
It is not a runtime adapter implementation.
It is not a product integration announcement.
It is not a runtime registry entry.
It is not dynamic loading config.
It is not a package export.
It is not an approval, blocking, certification, or deployment-control layer.
It is not a trust registry.
It is not a privileged ramen dependency.

ramen issues. Guard verifies.

External systems issue evidence. Guard verifies evidence.

The purpose of this document is to record how ramen receipt v5 may be mapped into Guard's existing review-layer contract, normalized record, findings, report language, and registry surfaces without introducing runtime authority.

## 2. Mapping Scope

This mapping covers the documentation-layer alignment for:

- adapter identity
- receipt source type
- registry lifecycle status
- evidence contract level
- mapping support
- limitations
- documentation references
- review notes
- relation to External Receipt Contract
- relation to Normalized Evidence Record
- relation to Verification Findings Taxonomy
- relation to Guard report language

This mapping does not cover:

- runtime verification implementation
- signature verification code
- payload hashing implementation
- conformance vectors
- fixture execution
- package export
- CI gate beyond the existing static verifier
- runtime adapter loading

## 3. Registry Entry Alignment

The documentation-layer registry entry alignment for `ramen-receipt-v5` is:

```json
{
  "adapter_id": "ramen-receipt-v5",
  "identity": {
    "adapter_name": "ramen receipt v5 reference adapter",
    "adapter_version": "0.1",
    "source_type": "runtime_receipt"
  },
  "lifecycle_status": "review_stage",
  "evidence_contract_level": "review_ready",
  "reference_status": "non_privileged_reference"
}
```

This is documentation-layer metadata only.
It is not executable registry config.
It is not runtime adapter config.
It is not certification.
It is not an allowlist.
It is not a trust registry.
It is not deployment readiness.

## 4. External Receipt Contract Mapping

The following table records how ramen receipt v5 may map into the External Receipt Contract:

| External Receipt Contract Field | Ramen Receipt v5 Mapping | Notes |
| --- | --- | --- |
| `receipt_id` | mapped from ramen receipt identifier | review identity only |
| `issuer` | mapped from receipt issuer or producer metadata if present | does not imply trust |
| `signature` | mapped from receipt signature field | verification semantics only |
| `signature_algorithm` | mapped from declared signature algorithm | unsupported algorithms become findings |
| `payload_hash` | mapped from payload hash field | integrity evidence only |
| `hash_algorithm` | mapped from declared hash algorithm | unavailable support remains a review limitation |
| `evidence_timestamp` | mapped from receipt timestamp | timestamp evidence only |
| `policy_ref` | mapped if present | visibility only, not policy authority |
| `evidence_refs` | mapped if present | review context and traceability only |
| `raw_payload_ref` | mapped if available | absence becomes limitation or finding |

Mapping compatibility does not mean action approval.
Signature validity does not mean action approval.
Policy reference visibility does not imply policy authority.

## 5. Normalized Evidence Record Mapping

Ramen receipt v5 may map into the following `NormalizedEvidenceRecord` sections:

- `record`
  - preserves Guard artifact identity plus adapter name and version context
- `source`
  - preserves `source_type`, issuer visibility, and issuer key reference when available
- `receipt`
  - preserves ramen receipt identity, receipt version context, and raw receipt reference when available
- `subject`
  - preserves what the receipt is about and any bounded runtime context visible in the receipt
- `verification`
  - preserves whether verification was performed and whether the receipt is verified, not verified, or partially verified
- `contract_validation`
  - remains a first-class result for minimum contract compatibility
- `evidence`
  - preserves evidence references, raw payload references, redaction notices, and confidentiality notes when visible
- `findings`
  - preserves structured review findings with evidence references and recommendations

The normalized record also remains responsible for preserving integrity, signature, timestamp, policy, and review semantics inside the Guard-owned review artifact.

`contract_validation` remains first-class.
Adapter limitations must remain visible.
Validation and verification diagnostics must not be dropped.
The normalized record is a review artifact, not runtime permission.

## 6. Findings Mapping

Ramen receipt v5 may emit findings in the following categories:

- `identity`
- `integrity`
- `signature`
- `timestamp`
- `policy_reference`
- `evidence_completeness`
- `adapter`
- `compatibility`
- `review`

Examples of bounded mapping outcomes include:

- valid signature -> review-visible verification finding, not approval
- invalid signature -> high or critical review finding, not runtime block
- payload hash mismatch -> integrity finding, not deployment denial
- missing policy reference -> `policy_reference` finding, not policy rejection
- issuer key unavailable -> signature or key-availability limitation
- unsupported receipt version -> compatibility finding

These findings remain evidence interpretation only.
They do not become approval, blocking, certification, or deployment-control outcomes.

## 7. Report Language Boundary

Guard report language for this mapping should prefer:

- `verified`
- `not verified`
- `partially verified`
- `evidence incomplete`
- `requires human review`
- `reviewer attention recommended`

Guard report language for this mapping must avoid:

- `approved`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `production-ready`
- `deployment allowed`
- `authorized`
- `trusted`

This mapping must preserve Guard's existing report-language boundary.
The existence of a ramen reference mapping does not permit authority language.

## 8. Adapter Responsibility Matrix Alignment

This ramen reference adapter mapping may:

- parse external receipt evidence
- validate the minimum contract
- verify integrity, signature, and timestamp where possible
- normalize evidence into a review artifact
- emit findings
- preserve limitations
- preserve raw evidence references when available

This ramen reference adapter mapping must not:

- approve
- block
- execute
- certify
- deploy
- mutate upstream runtime
- mutate Guard policy
- change `audit`
- change `permit`
- change `classify`
- become a runtime control plane

The mapping remains subordinate to the Adapter Responsibility Matrix and does not redefine Guard's generalized framework.

## 9. Limitations

Current limitations of this mapping include:

- docs-only mapping
- no runtime adapter implementation
- no package export
- no conformance fixtures in this PR
- no dynamic loading
- no runtime registry
- issuer trust is not established by this mapping
- policy reference visibility is not policy authority
- ramen is not a privileged dependency
- future changes require separate review

These limitations must remain visible so the mapping is not misread as a product integration or authority-bearing surface.

## 10. Verification

The current verification path remains:

```bash
npm run verify:external-evidence:type-contract
npm run verify
```

This PR does not add runtime tests because it does not add runtime implementation.

## 11. Eligible Future Work

The following work may be considered separately after this mapping:

- type-only mapping helper contract
- docs-only sample mapped record
- local proof-of-concept adapter spike
- conformance vectors
- explicit package export proposal
- runtime adapter implementation after separate review

None of this future work is started by this document.

## 12. Conclusion

Ramen Receipt v5 is documented as a non-privileged reference adapter mapping.

This mapping preserves the boundary: ramen issues. Guard verifies.

It does not introduce runtime execution, approval, blocking, certification, deployment control, package exports, dynamic loading, or privileged dependency semantics.
