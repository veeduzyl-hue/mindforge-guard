# Ramen Receipt v5 Local Adapter Spike Implementation Plan v0.1

## Purpose

This document is a docs-only implementation plan for a future local-only adapter spike. It is not the spike implementation, not a runtime adapter implementation, not a product integration announcement, not an executable fixture, and not a conformance vector.

It is also not a runtime registry, not dynamic loading, not a package export, not an approval / blocking / certification / deployment-control layer, not a trust registry, and not a privileged ramen dependency.

The governing boundary remains: `ramen issues. Guard verifies.` External systems issue evidence. Guard verifies evidence.

The future spike must remain local-only, default-off, removable, and bounded. It must be not exported from package index, not wired into audit / permit / classify, not wired into `audit` / `permit` / `classify`, not dynamically loaded, and introduced with no runtime registry. It must also preserve no executable conformance vectors, no blocking, and no privileged ramen dependency.

## Decision Context

The current decision context is that a local-only, default-off, non-exported ramen receipt v5 adapter spike has been approved as a planning target only.

This plan does not itself implement the spike. The next code PR, if separately approved, must follow this plan and must preserve existing behavior. Planning approval here does not authorize runtime integration, package export, fixture creation, executable conformance vector creation, approval semantics, blocking semantics, certification semantics, or deployment-control semantics.

## Intended Spike Objective

The intended future spike objective is to validate the frozen `EvidenceSourceAdapter` lifecycle against one concrete receipt-shaped source while staying outside the runtime path.

The future code PR should:

- parse a sample ramen receipt object
- validate minimum External Receipt Contract fields
- produce a verification interpretation without runtime authority
- normalize the result into a review-ready evidence record-like artifact
- emit findings and limitations
- remain removable without runtime behavior change

The spike must explicitly not become a production adapter, runtime registry plugin, deployment gate, approval engine, certification surface, trust registry, or policy authority.

## Proposed Minimal File Scope for Future Code PR

These paths are proposals only. The future implementation PR must confirm the actual repository structure before creating files.

- `packages/guard-core/src/externalEvidence/referenceAdapters/ramenReceiptV5/localSpike.ts`
- `packages/guard-core/src/externalEvidence/referenceAdapters/ramenReceiptV5/localSpikeTypes.ts`
- `scripts/verify_ramen_receipt_v5_local_spike.mjs`

The future code PR must keep the scope minimal:

- no package export
- no `packages/guard-core/src/index.ts` change
- no `audit` / `permit` / `classify` wiring
- no runtime registry
- no dynamic loading
- no new dependencies unless separately approved

## Explicitly Prohibited Files / Surfaces

The future code PR must not modify or introduce behavior through these surfaces unless separately approved:

- `packages/guard-core/src/index.ts`
- root package exports
- `package.json` unless explicitly approved for a standalone verifier script
- `package-lock.json` unless a separately approved dependency change exists
- `packages/*/package.json`
- existing `audit` / `permit` / `classify` runtime code
- any runtime registry
- any dynamic loader
- production config
- deployment scripts
- CI/CD gates beyond an explicit standalone verifier
- `.mindforge` runtime history files
- real secrets, credentials, or production data

## Proposed Minimal Implementation Shape

The future implementation should stay intentionally small and data-only.

It should:

- parse a sample receipt object
- validate minimum fields
- construct a contract validation result
- construct a verification interpretation
- construct a normalized evidence record-like review artifact
- construct findings
- preserve adapter limitations
- return data only

It must not:

- make network calls
- write to the filesystem except explicit verifier output if separately approved
- mutate runtime state
- mutate policy
- make approval or blocking decisions
- export from the package index
- add dynamic loading
- integrate into a runtime registry

## Cryptographic Verification Boundary

The first version should not perform real cryptographic verification unless that work is separately approved.

The future spike may recognize the presence of signature-related fields, algorithms, key references, or hashes, and may mark verification as not performed or partially verified while emitting explicit limitations and findings.

The future spike must not introduce real Ed25519 verification, a public key registry, a trust registry, production key validation, or any interpretation where signature presence or validity becomes permission.

If real Ed25519 verification is desired later, that should be proposed in a separate PR that remains verification-only and preserves the same non-authority boundary.

## Input Boundary

The future spike must be sample-only.

Inputs should be limited to local objects or static samples containing fake identifiers, fake signatures, fake key references, fake hashes, and fake policy references.

The future code PR must not use production evidence, real keys, secrets, live ramen services, network calls, or customer data. It must not introduce executable conformance vectors, and it must not introduce fixture execution unless that is separately approved. Samples must not imply trust, certification, or operational approval.

## Output Boundary

The future spike output must be review artifacts only.

Allowed outputs include parse results, contract validation results, verification interpretations, normalized record-like objects, findings, limitations, and optional reviewer-facing explanatory text.

The output must not be an approval decision, blocking decision, certification decision, deployment decision, runtime authorization, compliance guarantee, policy decision, or trust assertion.

## Verification Plan for Future Code PR

The future code PR must run these commands successfully:

- `npm.cmd run verify:external-evidence:type-contract`
- `npm.cmd run verify`

If a standalone verifier is added, it must be explicit, local-only, and not wired into aggregate `verify` unless separately approved.

That future verifier should confirm:

- no package export
- no runtime registry
- no dynamic loading
- no `audit` / `permit` / `classify` wiring
- deterministic output
- visible limitations
- no authority vocabulary drift

## Review Checklist for Future Code PR

Review the future implementation PR against this checklist:

- local-only
- default-off
- non-exported
- required boundary phrases preserved
- no trust registry
- no new dependency unless separately approved
- no real credentials
- no network calls
- no runtime state mutation
- no `.mindforge` mutation by the implementation
- aggregate verify passes
- dedicated verifier passes if added

## Exit Criteria

The future implementation should be considered complete only when:

- local verification passes
- output is deterministic
- the normalized artifact is inspectable
- findings preserve diagnostics
- limitations are visible
- report language avoids authority terms
- no runtime authority, package export, dynamic loading, or runtime registry is introduced
- `audit` / `permit` / `classify` remain unchanged
- the implementation is removable without runtime behavior change

## Eligible Follow-Up PRs

After this planning document, eligible follow-up PRs may include:

- a local-only implementation PR
- a standalone verifier PR
- a docs-only expected output example PR
- a docs-only implementation review report PR
- a separate cryptographic verification proposal PR
- a separate fixture or conformance proposal PR
- a separate package export proposal PR only after explicit approval

## Non-Goals

This plan does not authorize or imply:

- a runtime adapter
- production integration
- package export
- dynamic loading
- a runtime registry
- real external service calls
- real production keys
- executable fixtures
- conformance vectors
- approval
- blocking
- certification
- deployment control
- policy authority
- a trust registry
- default enablement
- a privileged ramen dependency

## Conclusion

This PR is planning only and not implementation.

Any future code PR must remain local-only, default-off, non-exported, and non-runtime, and must preserve the boundary phrase `ramen issues. Guard verifies.` It must also preserve the boundary that external systems issue evidence and Guard verifies evidence.

This plan does not introduce a runtime adapter implementation, runtime registry, dynamic loading, package exports, fixtures, conformance vectors, approval, blocking, certification, deployment control, trust-registry semantics, or privileged dependency semantics.
