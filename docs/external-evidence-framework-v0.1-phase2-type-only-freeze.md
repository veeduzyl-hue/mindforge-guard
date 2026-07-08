# External Evidence Framework v0.1 Phase 2 Type-Only Freeze

## 1. Purpose

This document records the frozen status of the External Evidence Framework v0.1 Phase 2 type-only line.

This is an architecture and type-only freeze.
It is not a runtime implementation.
It is not a product integration announcement.
It is not an approval, blocking, certification, or deployment control layer.

The purpose of this freeze is to mark the current Phase 2 line as a reviewable baseline after the adapter interface design, type-only contracts, standalone verifier, dedicated npm verifier script, and aggregate verification wiring have all landed on `main`.

## 2. Current Main Baseline

The current `main` baseline for this freeze is:

- latest main commit:
  - `817b2af Add external evidence type contract verifier to aggregate verify (#291)`
- merged PRs:
  - `#289 External Evidence Adapter Interface v0.1 type-only contracts`
  - `#290 Wire external evidence type contract verifier`
  - `#291 Add external evidence type contract verifier to aggregate verify`

These merged steps complete the bounded Phase 2 type-only line without introducing runtime adapter execution or authority expansion.

## 3. Phase 2 Artifacts

The frozen Phase 2 artifacts are:

- `docs/external-evidence-adapter-interface-v0.1.md`
  - design-only adapter interface boundary
- `packages/guard-core/src/externalEvidence/types.ts`
  - type-only contracts
- `scripts/verify_external_evidence_type_contract.mjs`
  - standalone static boundary verifier
- root `package.json`
  - `verify:external-evidence:type-contract`
  - aggregate `verify` includes external evidence verifier

Together these artifacts establish a bounded review, contract, and verification surface for external evidence type-only work without exporting the types, implementing adapters, or introducing runtime authority.

## 4. Frozen Type-Only Decisions

The following Phase 2 decisions are frozen in this line:

- `EvidenceSourceAdapter` lifecycle includes:
  - `parse`
  - `validate`
  - `verify`
  - `normalize`
  - `emitFindings`
- `ContractValidationResult` is carried into:
  - `verify`
  - `normalize`
- diagnostics may flow into:
  - `emitFindings`
- `AdapterLimitations` has a stable normalized record location
- controlled status vocabularies avoid:
  - approval
  - blocking
  - certification
  - deployment readiness semantics
- type contracts remain vendor-neutral
- ramen remains a possible reference adapter, not a privileged dependency
- external evidence types are not exported from `packages/guard-core/src/index.ts`
- no runtime adapter is implemented in Phase 2

These decisions freeze the minimum type-only shape and review semantics without expanding Guard into execution, enforcement, or privileged-source behavior.

## 5. Verification Coverage

The current verification path for this line is:

```bash
npm run verify:external-evidence:type-contract
npm run verify
```

The aggregate `verify` command now includes the external evidence type-only boundary verifier.

This means the standalone contract boundary check is both directly runnable and part of the repository's broader verification path on `main`.

## 6. Boundary Confirmation

This freeze confirms that the Phase 2 type-only line remains:

- verification-only
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- human-review-oriented
- vendor-neutral
- non-ramen-specific
- no approval API
- no blocking API
- no certification API
- no deployment control API
- no package export change
- no `audit` / `permit` / `classify` behavior change
- no runtime adapter implementation

Guard independently verifies external runtime evidence.
Guard does not issue, approve, block, execute, certify, or control runtime actions.

## 7. Explicit Non-Goals

This Phase 2 freeze does not include:

- runtime adapter implementation
- external receipt runtime verification
- adapter registry runtime exposure
- package export of external evidence types
- ramen adapter implementation
- fixtures or conformance vectors
- approval, blocking, enforcement, certification, or deployment-control behavior

These areas remain out of scope for the Phase 2 type-only line and must be handled, if at all, as separately scoped future work.

## 8. Eligible Next Phases

The following future phases may be considered separately after this freeze:

- adapter registry exposure docs/type-only phase
- reference adapter mapping proposal
- explicit export proposal for type contracts
- later runtime adapter spike, only after separate review
- ramen reference adapter mapping as one adapter, not privileged core dependency

These are directional next steps only.
They are not part of this freeze PR and must not be treated as implicitly approved by the existence of the current type-only baseline.

## 9. Freeze Conclusion

External Evidence Framework v0.1 Phase 2 type-only line is frozen as a reviewable baseline.

The next phase must remain separately scoped and must not implicitly introduce runtime execution, approval, blocking, certification, or deployment-control authority.
