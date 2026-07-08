# External Evidence Adapter Registry Readiness v0.1

## 1. Purpose

This document records the completed documentation and type-only readiness status for External Evidence Adapter Registry v0.1.

This is a docs-only readiness summary.
It is not a runtime registry.
It is not dynamic loading.
It is not a package export.
It is not an adapter implementation.
It is not an approval, blocking, certification, or deployment-control layer.
It is not a trust registry.

External systems issue evidence. Guard verifies evidence.

The purpose of this document is to freeze the current registry exposure, registry entry type contract, registry index, and verification wiring as a reviewable baseline without introducing runtime authority.

## 2. Current Main Baseline

The current `main` baseline for this readiness summary is:

- latest main commit:
  - `26f8740 Add External Evidence Adapter Registry Index v0.1 (#297)`
- merged PRs:
  - `#295 Define External Evidence Adapter Registry Exposure v0.1`
  - `#296 Add External Evidence Adapter Registry Entry types v0.1`
  - `#297 Add External Evidence Adapter Registry Index v0.1`

The broader External Evidence Framework v0.1 Phase 2 type-only line remains frozen by:

- `docs/external-evidence-framework-v0.1-phase2-type-only-freeze.md`

This readiness summary records the registry-specific baseline that now sits on top of that frozen Phase 2 type-only line.

## 3. Registry Artifacts Completed

The following registry artifacts are now completed on `main`:

- `docs/external-evidence-adapter-registry-exposure-v0.1.md`
  - defines documentation-layer exposure semantics for reviewer-facing registry visibility
- `packages/guard-core/src/externalEvidence/registryTypes.ts`
  - defines the type-only registry entry and registry index contracts
- `docs/external-evidence-adapter-registry-index-v0.1.md`
  - defines the reviewer-facing registry index baseline
- `scripts/verify_external_evidence_type_contract.mjs`
  - provides static verifier coverage for external evidence and registry type-only boundaries
- root `package.json`
  - wires `verify:external-evidence:type-contract`
  - includes the external evidence type contract verifier in aggregate `verify`

Together these artifacts establish a bounded review-layer registry surface without exporting registry types from the package root, implementing adapters, or introducing runtime registry behavior.

## 4. Readiness Decisions

The following decisions are complete and now serve as a reviewable baseline:

- adapter registry exposure is documentation-layer only
- registry entry types are type-only
- registry index is reviewer-facing docs only
- registry entries are not runtime configs
- registry entries are not allowlists
- registry entries are not trust registry records
- registry entries do not imply approval, certification, deployment readiness, or policy authority
- `ramen-receipt-v5` is listed only as documentation-layer metadata
- `ramen issues. Guard verifies.` remains the boundary
- ramen remains a non-privileged reference adapter
- registry types are intentionally not exported from `packages/guard-core/src/index.ts`
- runtime registry implementation remains out of scope

These decisions preserve the existing Guard posture while making registry visibility reviewable and explicit.

## 5. Verification Coverage

The current verification path for this registry readiness line is:

```bash
npm run verify:external-evidence:type-contract
npm run verify
```

The static verifier currently covers:

- External Evidence type-only contracts
- Adapter Registry Entry type-only contracts
- no package export of registry types
- prohibited authority vocabulary in type literal values
- no runtime import or implementation indicators

The aggregate `verify` command includes this dedicated external evidence type contract verifier on `main`.

## 6. Boundary Confirmation

This readiness line remains:

- docs-only registry exposure
- type-only registry entry contract
- reviewer-facing registry index
- vendor-neutral
- non-executing
- non-control-plane
- no runtime registry
- no dynamic loading
- no package export
- no adapter implementation
- no `audit` / `permit` / `classify` behavior change
- no approval API
- no blocking API
- no certification API
- no deployment-control API
- no policy authority
- no trust registry
- no privileged ramen dependency

Guard independently verifies external runtime evidence.
The existence of documented registry artifacts does not create runtime authority.

## 7. Explicit Non-Goals

This readiness summary does not include:

- runtime adapter registry
- dynamic adapter loading
- package export of registry types
- external evidence adapter implementation
- external receipt runtime verification
- ramen adapter implementation
- conformance vectors
- fixtures
- approval, blocking, enforcement, or certification behavior
- deployment-control behavior
- trust registry
- policy authority

These areas remain out of scope and must be separately reviewed if proposed later.

## 8. Eligible Next Phases

The following next phases may be considered separately after this readiness baseline:

- explicit package export proposal for type contracts
- reference adapter mapping proposal
- ramen mapping as one non-privileged reference adapter
- local adapter spike after separate review
- runtime registry proposal only after explicit separate review
- registry entry review workflow docs

None of these phases are started by this document.

## 9. Readiness Conclusion

External Evidence Adapter Registry v0.1 is ready as a documentation/type-only review baseline.

It records adapter visibility, lifecycle, compatibility, limitations, documentation references, and review notes without introducing runtime authority.

Any future package exports, reference adapter mappings, runtime registry work, or adapter implementations must be scoped as separate changes.
