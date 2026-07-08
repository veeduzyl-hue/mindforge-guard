# External Evidence Adapter Registry Exposure v0.1

## 1. Purpose

This document defines the docs-only boundary for External Evidence Adapter Registry Exposure v0.1.

This is registry exposure design.
It is not a runtime registry implementation.
It is not dynamic adapter loading.
It is not a package export.
It is not a product integration announcement.
It is not an approval, blocking, certification, or deployment-control layer.

External systems issue evidence. Guard verifies evidence.

An adapter registry records how evidence sources are represented for review. It does not authorize, execute, approve, block, certify, or deploy anything.

The purpose of this document is to define how adapters may be recorded, displayed, reviewed, and cited as reviewer-facing documentation artifacts without changing Guard runtime behavior or the frozen External Evidence Framework v0.1 Phase 2 type-only baseline.

## 2. Relationship to Existing Phase 1 / Phase 2 Artifacts

This document builds on existing External Evidence Framework artifacts without modifying them.

- `external-evidence-framework-v0.1-boundary.md`
  - defines the architecture boundary and non-scope for external evidence verification
- `external-evidence-framework-v0.1-phase1-readiness.md`
  - records that Phase 1 is sufficient for bounded adapter design work
- `external-evidence-adapter-interface-v0.1.md`
  - defines the minimal adapter interface boundary for parse / validate / verify / normalize / emit findings
- `external-evidence-framework-v0.1-phase2-type-only-freeze.md`
  - freezes the Phase 2 type-only line as a reviewable baseline
- `adapter-responsibility-matrix-v0.1.md`
  - defines what adapters may do, must do, and must not do
- `reference-adapter-index-v0.1.md`
  - records current reference adapter positioning and lifecycle semantics
- `packages/guard-core/src/externalEvidence/types.ts`
  - defines the frozen type-only adapter contract baseline

Phase 1 defines the architecture boundary.
Phase 2 defines the type-only adapter interface and contract baseline.
This document defines only the semantics of adapter registry exposure.

This document does not change the frozen Phase 2 type-only baseline.
It does not introduce a runtime registry, a trust registry, a loading mechanism, or a package export surface.

## 3. Registry Exposure Boundary

Adapter registry exposure may:

- record adapter identity
- record adapter source type
- record lifecycle status
- record supported evidence category
- record known limitations
- record review notes
- record mapping visibility to External Receipt Contract, Normalized Evidence Record, and Findings Taxonomy
- point reviewers to supporting documentation
- preserve non-privileged reference adapter semantics

Adapter registry exposure must not:

- approve an adapter
- certify an adapter
- authorize runtime use
- dynamically load an adapter
- execute an adapter
- mutate policy
- change Guard runtime behavior
- change `audit`
- change `permit`
- change `classify`
- create deployment readiness signals
- declare compliance
- privilege ramen or any other source

Registry exposure is a review-stage documentation surface.
It records what an adapter is, what evidence it is intended to interpret, what mapping surfaces it touches, and what limitations remain visible to reviewers.

It does not become an allowlist, trust registry, authority layer, or runtime integration mechanism.

## 4. Proposed Registry Entry Shape

The following shape is documentation-level only.
It is not a runtime schema, runtime config, executable registry, trust registry, or allowlist.

```json
{
  "adapter_id": "example-runtime-receipt-adapter",
  "adapter_name": "Example Runtime Receipt Adapter",
  "adapter_version": "0.1",
  "source_type": "runtime_receipt",
  "lifecycle_status": "draft",
  "evidence_contract_level": "contract_parseable",
  "normalized_record_supported": true,
  "findings_supported": true,
  "limitations": [
    "issuer key lookup is review-context only",
    "policy reference visibility does not imply policy authority"
  ],
  "reference_status": "non_privileged_reference",
  "documentation_refs": [
    "docs/external-evidence-adapter-interface-v0.1.md"
  ],
  "review_notes": [
    "adapter maps and verifies evidence only"
  ]
}
```

Field interpretation:

- `adapter_id`
  - stable documentation identifier for review references
- `adapter_name`
  - reviewer-facing adapter label
- `adapter_version`
  - documentation-level version context for the adapter entry
- `source_type`
  - evidence source family being described
- `lifecycle_status`
  - documentation and review lifecycle only
- `evidence_contract_level`
  - bounded compatibility vocabulary for review interpretation
- `normalized_record_supported`
  - indicates whether mapping to the normalized record is documented as supported
- `findings_supported`
  - indicates whether findings emission semantics are documented as supported
- `limitations`
  - reviewer-visible limits that must remain honest and explicit
- `reference_status`
  - records whether the adapter is a non-privileged reference example
- `documentation_refs`
  - points reviewers to governing docs and design artifacts
- `review_notes`
  - bounded reviewer-facing interpretation notes

This shape is intended for documentation-layer registry exposure only.
It must not be described as executable configuration, a runtime registry entry, or a source of authority.

## 5. Lifecycle Status Vocabulary

The minimal lifecycle status vocabulary for registry exposure v0.1 is:

- `draft`
- `spike`
- `review_stage`
- `reference`
- `deprecated`

These statuses describe documentation and review posture only.

- `draft`
  - described but not yet sufficiently reviewed
- `spike`
  - exploratory mapping or provisional design context exists
- `review_stage`
  - under bounded semantic review
- `reference`
  - suitable as a documented example mapping
- `deprecated`
  - no longer preferred as a forward-looking reference entry

Lifecycle status is not:

- an approval status
- a certification status
- a deployment readiness status
- a production authorization status

## 6. Evidence Contract Level Vocabulary

The minimal evidence contract level vocabulary for registry exposure v0.1 is:

- `contract_parseable`
- `integrity_verifiable`
- `review_ready`
- `not_compatible`
- `unknown`

Vocabulary interpretation:

- `contract_parseable`
  - the evidence can be interpreted against the minimum contract shape
- `integrity_verifiable`
  - integrity-oriented checks can be performed with the available evidence context
- `review_ready`
  - the evidence can be represented in review-oriented Guard artifacts
- `not_compatible`
  - the current evidence shape does not fit the documented review boundary
- `unknown`
  - compatibility is not yet established

Compatibility here means Guard can interpret evidence for review.
Compatibility does not mean the underlying action is approved.

Severity and compatibility must not become runtime gates.
They remain documentation and review concepts.

## 7. Reference Adapter Semantics

ramen issues. Guard verifies.

ramen may serve as the first reference adapter example.
ramen does not define the External Evidence Framework.
ramen is not a privileged dependency.
A reference adapter is not the same thing as a production integration.
A reference adapter is not a certification signal.

Registry exposure must preserve the same neutral semantics for ramen and for any future adapter:

- reference adapter entries are review-facing examples
- reference adapter entries do not create runtime authority
- reference adapter entries do not create package export obligations
- reference adapter entries do not privilege one issuer over the framework
- future adapters must follow the same vendor-neutral documentation posture

Reference adapter visibility is useful because it helps reviewers understand how one evidence source maps into the framework.
It must not become a hidden preference mechanism or product-center narrative.

## 8. Reviewer-Facing Use

Registry exposure is for reviewers who need to:

- understand what adapter is being discussed
- see what evidence categories it maps
- see what limitations exist
- see what verification semantics are supported
- see what remains out of scope

Registry exposure helps reviewers compare documented adapter entries without turning those entries into execution surfaces or trust decisions.

Reviewer-facing registry exposure should avoid language such as:

- approved adapter
- trusted adapter
- certified adapter
- production-ready adapter
- deployment allowed
- enforcement passed

Reviewer-facing registry exposure should instead stay inside bounded visibility language such as:

- documented adapter entry
- review-stage mapping
- known limitations
- compatibility context
- verification support
- out of scope

## 9. Non-Goals

This document does not introduce:

- no runtime adapter registry
- no dynamic adapter loading
- no package export
- no package script change
- no runtime verifier implementation
- no external receipt verification runtime
- no ramen adapter implementation
- no approval, blocking, or enforcement layer
- no certification
- no deployment control
- no policy authority
- no trust registry

These areas remain separately scoped future work, if they are pursued at all.

## 10. Eligible Next Steps

The following next steps may be scoped separately after this docs-only design:

- type-only registry entry contract
- docs-only registry index update
- explicit package export proposal
- reference adapter mapping proposal
- ramen mapping as one non-privileged reference adapter
- later local adapter spike after separate review

None of these steps are started by this document.
Each must remain separately reviewed and separately scoped.

## 11. Conclusion

Adapter Registry Exposure v0.1 is a documentation-layer review surface. It records adapter identity, lifecycle, compatibility, and limitations without introducing runtime authority.

External Evidence Framework v0.1 Phase 2 remains frozen. Any future registry types, package exports, or adapter implementations must be scoped as separate changes.
