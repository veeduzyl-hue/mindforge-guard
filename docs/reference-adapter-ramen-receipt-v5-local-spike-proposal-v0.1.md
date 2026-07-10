# Ramen Receipt v5 Local-Only Adapter Spike Proposal v0.1

## 1. Purpose

This document proposes a future local-only adapter spike for `ramen-receipt-v5`.

This is a docs-only proposal.
It is not a runtime adapter implementation.
It is not a product integration announcement.
It is not an executable fixture.
It is not a conformance vector.
It is not a runtime registry.
It is not dynamic loading.
It is not a package export.
It is not an approval, blocking, certification, or deployment-control layer.
It is not a trust registry.
It is not a privileged ramen dependency.

ramen issues. Guard verifies.

External systems issue evidence. Guard verifies evidence.

The purpose of this document is to define the strict boundary, allowed inputs, proposed outputs, verification shape, non-goals, and exit criteria that should apply if a future local-only ramen adapter spike is separately approved.

## 2. Why a Local-Only Spike May Be Useful

A future local-only spike may be useful to:

- validate that the type-only adapter interface can represent one concrete receipt source
- test mapping from receipt input into a `NormalizedEvidenceRecord`
- test finding emission for review
- test limitations preservation
- test reviewer-facing report language compatibility
- validate verifier-only evidence handling without runtime authority

This would not be:

- production integration
- runtime enforcement
- an approval system
- a deployment gate
- a certification mechanism

## 3. Proposed Spike Scope

If separately approved, the future spike may include:

- one local-only adapter module
- default-off behavior
- no package root export
- no wiring into `audit`, `permit`, or `classify`
- no wiring into a runtime registry
- no dynamic loading
- documentation/sample inputs only
- normalized evidence record emission for review
- finding emission for review
- execution only through an explicit local script or standalone verifier if later approved

The future spike must not include:

- package export
- runtime registry behavior
- dynamic loading
- policy mutation
- approval or blocking behavior
- CI/CD gate behavior beyond an explicit verifier
- external network calls
- secrets
- production credentials
- real deployment actions

## 4. Proposed Inputs

If separately approved, the future spike may accept:

- a documentation-only sample receipt
- a local JSON sample
- a fake signature
- a fake public key reference
- a fake payload hash

The future spike must not rely on:

- real private keys
- production logs
- live external service calls

Input boundary notes:

- inputs are not conformance vectors unless separately reviewed
- inputs are not executable fixtures in this proposal
- real cryptographic verification remains out of scope unless separately approved

## 5. Proposed Outputs

If separately approved, the future spike may emit:

- a parse result
- a contract validation result
- a verification interpretation
- a normalized evidence record
- verification findings
- visible limitations
- a reviewer-facing report snippet

These outputs must not become:

- approval
- block
- certification
- deployment decision
- runtime authorization
- compliance guarantee

## 6. Adapter Interface Alignment

If separately approved, the future spike should align only to the frozen type-only lifecycle:

- `parse`
- `validate`
- `verify`
- `normalize`
- `emitFindings`

The future spike must preserve:

- `ContractValidationResult` flowing into `verify` and `normalize`
- visible diagnostics
- visible `AdapterLimitations`
- severity as review significance rather than a runtime gate

## 7. Registry Alignment

If separately approved, the future spike must not change registry semantics.

The future spike should preserve:

- `ramen-receipt-v5` remains `non_privileged_reference`
- registry entry semantics remain documentation and review metadata only
- no trust registry
- no allowlist
- no approval, certification, or deployment-readiness semantics

## 8. Verification Approach

If separately approved, a future spike should at minimum verify that:

- adapter output remains deterministic
- no runtime imports are added beyond local file parsing if separately approved
- no network calls occur
- no package export is introduced
- no `audit`, `permit`, or `classify` behavior changes
- normalized records preserve contract validation
- findings preserve diagnostics and limitations
- report language avoids authority-bearing terms

This proposal does not add any new verifier in the current PR because this PR is proposal-only.

## 9. Exit Criteria for a Future Spike

If separately approved, the future spike should exit successfully only when:

- a local script passes
- the generated normalized record matches expected documentation semantics
- findings taxonomy mapping is complete
- limitations remain visible
- no runtime authority is introduced
- no package export is introduced
- aggregate `verify` still passes
- a human reviewer can inspect the output
- the spike remains removable without changing runtime behavior

## 10. Non-Goals

This proposal does not include:

- runtime adapter implementation
- production integration
- package export
- dynamic loading
- runtime registry
- real external service calls
- real production keys
- executable conformance vectors
- approval, blocking, or certification behavior
- deployment control
- policy authority
- trust registry
- default enablement

## 11. Eligible Follow-Up PRs

The following may be proposed separately later, but are not started here:

- a docs-only spike checklist
- a docs-only expected output example
- a local-only spike implementation proposal
- an explicit fixture or conformance proposal
- a type-only mapping helper proposal
- a package export proposal only after separate review

## 12. Conclusion

A future ramen receipt v5 local-only adapter spike may be useful only as a bounded verification exercise.

The spike must preserve the boundary: ramen issues. Guard verifies.

This proposal does not introduce runtime adapter implementation, runtime registry, dynamic loading, package exports, fixtures, conformance vectors, approval, blocking, certification, deployment control, or privileged dependency semantics.
