# External Evidence Adapter Registry Index v0.1

## 1. Purpose

This document defines a documentation-layer registry index for reviewer-facing visibility into External Evidence adapters.

This is a docs-only registry index.
It is not a runtime registry.
It is not dynamic loading config.
It is not a package export surface.
It is not an adapter allowlist.
It is not a trust registry.
It is not a certification registry.
It is not an approval, blocking, or deployment-control layer.

External systems issue evidence. Guard verifies evidence.

The registry index records adapter review metadata. It does not authorize, execute, approve, block, certify, deploy, or load adapters.

The purpose of this document is to establish a reviewer-facing index baseline that can describe known adapter entries without introducing runtime authority or changing the frozen External Evidence Framework v0.1 Phase 2 type-only line.

## 2. Relationship to Registry Exposure and Type Contract

This document is aligned with, but does not modify, the following artifacts:

- `docs/external-evidence-adapter-registry-exposure-v0.1.md`
  - defines the reviewer-facing registry exposure boundary and semantics
- `packages/guard-core/src/externalEvidence/registryTypes.ts`
  - defines the type-only `AdapterRegistryIndex` and `AdapterRegistryEntry` contract shapes
- `docs/reference-adapter-index-v0.1.md`
  - defines the earlier reference-adapter positioning and lifecycle language
- `docs/adapter-responsibility-matrix-v0.1.md`
  - defines adapter responsibilities and non-responsibilities
- `docs/external-evidence-framework-v0.1-phase2-type-only-freeze.md`
  - records the frozen type-only baseline that must remain unchanged

Registry exposure defines reviewer-facing registry semantics.
`registryTypes.ts` defines the type-only entry contract.
This document provides the documentation-layer index baseline.

This document does not change the frozen Phase 2 baseline.
It does not export registry types.
It does not create a runtime registry.

## 3. Registry Index Shape

The documentation-layer registry index shape aligns with `AdapterRegistryIndex`:

```json
{
  "registry_version": "0.1",
  "generated_for_review_at": "documentation-only",
  "entries": []
}
```

This shape is documentation-level only.
It is not runtime JSON config.
It is not a loadable registry.
It is not a trust source.
It is not a CI/CD gate.

## 4. Registry Entry Fields

The registry index uses the following reviewer-facing fields:

- `adapter_id`
  - stable documentation identifier for the entry
- `identity.adapter_name`
  - reviewer-facing adapter name
- `identity.adapter_version`
  - version context for the documented entry
- `identity.source_type`
  - evidence source family associated with the entry
- `lifecycle_status`
  - review/documentation status only
- `evidence_contract_level`
  - evidence compatibility for review only
- `mapping_support`
  - visible mapping coverage against review-layer framework surfaces
- `limitations`
  - reviewer-visible limitations that must remain explicit
- `reference_status`
  - reference posture only, not privilege, approval, or certification
- `documentation_refs`
  - linked design and boundary artifacts for reviewer context
- `review_notes`
  - reviewer context only, not runtime instruction

Boundary rules for these fields:

- `lifecycle_status` is review/documentation status
- `evidence_contract_level` is evidence compatibility for review
- `reference_status` does not imply privilege, approval, or certification
- `limitations` must remain visible and must not be hidden by adapter narratives
- `review_notes` are reviewer context, not runtime instructions

## 5. Current Registry Entries

The current registry index baseline includes one documentation-layer entry:

### `ramen-receipt-v5`

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
  "mapping_support": {
    "external_receipt_contract": true,
    "normalized_evidence_record": true,
    "verification_findings": true,
    "report_language": true
  },
  "limitations": [
    {
      "limitation_id": "non-runtime-integration",
      "message": "This entry records a review-stage reference adapter mapping only. It is not a runtime integration."
    },
    {
      "limitation_id": "non-privileged-reference",
      "message": "ramen is a non-privileged reference adapter and does not define the External Evidence Framework."
    }
  ],
  "reference_status": "non_privileged_reference",
  "documentation_refs": [
    {
      "label": "Reference Adapter Index",
      "path": "docs/reference-adapter-index-v0.1.md"
    },
    {
      "label": "Adapter Responsibility Matrix",
      "path": "docs/adapter-responsibility-matrix-v0.1.md"
    },
    {
      "label": "Adapter Registry Exposure",
      "path": "docs/external-evidence-adapter-registry-exposure-v0.1.md"
    }
  ],
  "review_notes": [
    "ramen issues. Guard verifies.",
    "This entry is documentation-layer metadata only.",
    "This entry does not create runtime adapter loading, package exports, approval authority, certification, or deployment control."
  ]
}
```

This is not an executable registry entry.
It is not a product integration announcement.
It is not a runtime dependency.
It is not a certification signal.
It is not an allowlist.
It is not a trust registry.

## 6. Addition Criteria for Future Entries

Future registry entries should be added only when the following documentation-layer conditions are met:

- adapter identity is clear
- evidence source type is clear
- lifecycle status is assigned
- evidence contract level is assigned
- mapping support is visible
- limitations are documented
- documentation references are listed
- review notes avoid authority language
- reference status does not imply privilege

These criteria exist to keep the registry index review-facing, bounded, and comparable across future adapters without converting the index into an authority surface.

## 7. Prohibited Registry Semantics

The registry index must not express any of the following:

- approved adapter
- trusted adapter
- certified adapter
- production-ready adapter
- deployment allowed
- enforcement passed
- runtime authorized
- default loaded
- privileged dependency
- policy authority
- compliance guarantee

These semantics are prohibited because they would convert a review index into an execution, trust, compliance, or authorization surface.

## 8. Boundary Confirmation

This registry index remains:

- docs-only
- review-facing
- vendor-neutral
- non-executing
- non-control-plane
- non-runtime-registry
- no dynamic loading
- no package export
- no runtime adapter implementation
- no `audit` / `permit` / `classify` behavior change
- no approval / blocking / certification / deployment-control API
- no privileged ramen dependency

Guard independently verifies external runtime evidence.
The registry index does not inherit runtime authority from the existence of a documented adapter entry.

## 9. Eligible Next Steps

The following next steps may be scoped separately after this docs-only registry index baseline:

- docs-only registry entry review process
- type-only export proposal
- reference adapter mapping proposal
- later local adapter spike
- ramen mapping as one non-privileged reference adapter
- runtime registry only after separate explicit review

None of these next steps are started by this document.

## 10. Conclusion

External Evidence Adapter Registry Index v0.1 is a documentation-layer index for review metadata. It records adapter visibility without introducing runtime authority.

External Evidence Framework v0.1 Phase 2 remains frozen. Runtime registry implementation, package exports, and adapter implementations remain out of scope.
