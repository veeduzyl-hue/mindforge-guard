# Ramen Receipt v5 Local-Only Adapter Spike Checklist v0.1

## 1. Purpose

This document is a docs-only checklist for any future local-only adapter spike for `ramen-receipt-v5`.

This is a docs-only checklist.
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

Required exact boundary phrases:

not exported from package index
not wired into audit / permit / classify
not wired into `audit` / `permit` / `classify`
not dynamically loaded
no runtime registry
no executable conformance vectors
no blocking
no privileged ramen dependency

## 2. Preconditions Before Any Future Spike

Before any future local-only spike starts, confirm:

- `main` is clean
- `npm run verify` passes
- `npm run verify:external-evidence:type-contract` passes
- `ramen-receipt-v5` mapping docs are present
- the sample mapped record remains documentation-only
- registry readiness remains docs/type-only
- no package exports have been added
- no runtime registry exists
- no dynamic loading exists
- human review explicitly approves starting a local-only spike

## 3. Allowed File Scope for a Future Spike

If separately approved later, a future spike may consider:

- local-only adapter spike source under a clearly isolated path
- a local-only standalone script
- a documentation-only sample input
- a verifier-only output snapshot

This checklist does not grant any file scope by itself.
Each future file must be approved in a separate PR.
This checklist does not authorize implementation.

## 4. Prohibited File / Surface Scope

A future spike must not directly modify:

- `packages/guard-core/src/index.ts`
- package exports
- `package.json` unless separately approved
- `package-lock.json` unless a dependency change is separately approved
- `audit`
- `permit`
- `classify`
- a runtime registry
- a dynamic loader
- production config
- deployment scripts
- a CI/CD gate beyond an explicit verifier
- secrets
- real credentials
- production data

## 5. Input Checklist

Future local-only spike inputs must be:

- documentation-only or sample-only
- fake receipt ids
- fake signatures
- fake public key refs
- fake hashes
- no private keys
- no production logs
- no external network calls
- no live ramen service calls
- no real deployment data
- no real customer data

Also confirm:

- inputs are not executable conformance vectors
- inputs are not production evidence
- inputs do not imply trust
- inputs do not imply certification

## 6. Output Checklist

Future local-only spike outputs may only be review artifacts:

- parse result
- contract validation result
- verification interpretation
- normalized evidence record
- verification findings
- adapter limitations
- reviewer-facing report snippet

Outputs must not become:

- approval
- block
- certification
- deployment decision
- runtime authorization
- compliance guarantee
- policy decision
- trust assertion

## 7. Adapter Lifecycle Checklist

If a future spike is separately approved, it must only cover the frozen type-only lifecycle:

- `parse`
- `validate`
- `verify`
- `normalize`
- `emitFindings`

Also confirm:

- `ContractValidationResult` flows into `verify`
- `ContractValidationResult` flows into `normalize`
- diagnostics remain visible
- `AdapterLimitations` remain visible
- severity remains review significance
- findings do not become runtime gates

## 8. Registry Boundary Checklist

Confirm the future spike does not change:

- `ramen-receipt-v5` remains `non_privileged_reference`
- registry entry remains documentation/review metadata
- no trust registry
- no allowlist
- no package export
- no runtime registry
- no dynamic loading
- no default enablement
- no privileged ramen dependency

## 9. Verification Checklist for a Future Spike

A future spike should at minimum verify:

- deterministic output
- no network calls
- no package export
- no runtime registry
- no dynamic loading
- no `audit` / `permit` / `classify` behavior change
- normalized record includes contract validation
- findings preserve diagnostics
- limitations are visible
- report language avoids authority terms
- `npm run verify` still passes
- `npm run verify:external-evidence:type-contract` still passes

## 10. Required Boundary Phrases for Future PRs

Future related PRs should preserve or explicitly check:

```markdown
ramen issues. Guard verifies.
External systems issue evidence. Guard verifies evidence.
docs-only
local-only
default-off
not exported from package index
not wired into audit / permit / classify
not wired into `audit` / `permit` / `classify`
not dynamically loaded
no runtime registry
no executable conformance vectors
no blocking
no privileged ramen dependency
not a product integration announcement
not a runtime adapter implementation
not a conformance fixture
```

## 11. Exit Criteria for a Future Spike

A future spike should not be considered complete unless:

- all intended local checks pass
- generated review artifacts are inspectable
- normalized evidence records match documented semantics
- findings taxonomy mapping is complete
- limitations are visible
- no runtime authority is introduced
- no package export is introduced
- no dynamic loading is introduced
- no runtime registry is introduced
- `audit` / `permit` / `classify` remain unchanged
- aggregate `verify` passes
- the spike can be removed without changing runtime behavior

## 12. Non-Goals

This checklist does not include:

- runtime adapter
- production integration
- package export
- dynamic loading
- runtime registry
- real external service calls
- real production keys
- executable fixtures
- conformance vectors
- approval
- blocking
- certification
- deployment control
- policy authority
- trust registry
- default enablement

## 13. Conclusion

This checklist prepares a future local-only ramen receipt v5 adapter spike without authorizing implementation.

Any future implementation must be separately reviewed, remain local-only, default-off, non-exported, non-runtime, and preserve the boundary: ramen issues. Guard verifies.

This checklist does not introduce runtime adapter implementation, runtime registry, dynamic loading, package exports, fixtures, conformance vectors, approval, blocking, certification, deployment control, or privileged dependency semantics.
