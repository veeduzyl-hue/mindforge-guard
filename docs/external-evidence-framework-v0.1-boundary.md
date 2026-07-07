# External Evidence Framework v0.1 Boundary

## 1. Purpose

This document freezes the architecture boundary for External Evidence Framework `v0.1`.

The immediate reason for this boundary is continuity.
Guard has already validated the single reference adapter pattern through bounded external receipt review work.
That experience is useful, but it is not the long-term architecture target.
Guard should not be defined by one receipt issuer, one vendor-specific format, or one runtime-specific evidence surface.

The generalized direction is:

- Guard should support multiple external runtime evidence sources.
- Guard should preserve one Guard-owned verification boundary across those sources.
- Guard should remain valuable because it independently verifies evidence, not because it controls runtime execution.
- Guard should convert issuer-specific evidence into Guard-readable review artifacts without inheriting runtime authority.

Guard independently verifies external runtime evidence.
Guard does not issue, approve, block, execute, certify, or control runtime actions.

This document is Phase 1 boundary writing only.
It does not implement adapters, runtime flows, verifier logic, fixtures, or package changes.

## 2. Scope

This framework boundary covers the classes of external evidence that Guard may later verify and normalize for review use, including:

- external runtime receipts
- evidence packs
- signed decision receipts
- external verifier outputs
- CI/CD execution evidence
- agent action evidence
- policy decision artifacts
- runtime provenance records

The scope is architectural.
It defines what kinds of evidence can enter a Guard verification surface and how that surface should remain bounded.

## 3. Non-Scope

This framework does not include:

- no approval
- no blocking
- no execution
- no deployment control
- no certification
- no runtime enforcement
- no policy authority
- no replacement for human review
- no mutation of upstream runtime state

This framework also does not define:

- runtime integration APIs
- adapter implementation code
- verifier implementation code
- issuer onboarding workflows
- production runtime coupling
- trust registry operations

## 4. Core Boundary

The architecture boundary is:

- External systems issue evidence.
- Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not mutate upstream runtime state.
- Guard does not become the source of truth for runtime authorization.

External systems issue evidence.
Guard verifies evidence.

The architectural rule is intentionally asymmetric.
Runtime systems remain responsible for producing, signing, storing, and emitting their own evidence.
Guard remains responsible for independent verification, normalization, review interpretation, and bounded reporting.

Guard does not inherit runtime authority from the presence of a receipt, signature, policy identifier, or execution trace.

## 5. Minimum External Receipt Contract

The minimum external receipt contract is the smallest field surface that allows Guard to perform independent verification without requiring every issuer to adopt one vendor-specific schema.

This contract is a minimum verifiable semantic contract.
It is not a requirement that every external source use the ramen shape, the ramen field layout, or the ramen naming model.

### Required

- `receipt_id`
- `issuer`
- `subject`
- `evidence_timestamp`
- `payload_hash`
- `hash_algorithm`
- `signature`
- `signature_algorithm`

These fields establish minimum identity, integrity, and signature-verification semantics.
Without them, Guard cannot perform bounded independent receipt verification.

### Recommended

- `public_key_ref`
- `policy_ref`
- `runtime_context`
- `decision_summary`
- `evidence_refs`
- `receipt_version`
- `source_system`

These fields improve traceability, issuer interpretation, and review readability, but they are not required for the minimum verification boundary.

### Optional

- `environment`
- `actor`
- `tool_invocation`
- `chain_context`
- `parent_receipt_id`
- `external_report_uri`
- `redaction_notice`

These fields may improve provenance, reviewer context, or cross-receipt chaining, but they must remain optional in `v0.1`.

## 6. Evidence Source Adapter Responsibilities

An evidence source adapter is a bounded verification and normalization layer.

Adapter responsibilities are limited to:

- parse
- validate minimum contract
- verify signature or verification proof
- verify payload hash when raw payload is available
- normalize into Guard evidence record
- emit verification findings
- preserve raw evidence references

Adapter non-responsibilities are:

- approving action
- blocking action
- changing policy
- modifying runtime
- hiding failed evidence
- certifying compliance
- replacing human review

An adapter may explain what was verified and what was not verified.
It may not convert that explanation into authorization, enforcement, or compliance authority.

## 7. Normalized Evidence Record

The Normalized Evidence Record is the Guard-owned internal target representation for externally issued evidence.

It should preserve:

- source identity
- receipt identity
- issuer visibility
- subject visibility
- integrity status
- signature status
- timestamp status
- payload hash verification
- policy reference visibility
- evidence completeness
- raw evidence traceability
- human review traceability

The record exists so Guard can compare heterogeneous evidence sources through one review-oriented semantic surface.

The Normalized Evidence Record is a Guard internal review artifact, not a runtime authorization token.

That means:

- it supports interpretation
- it supports traceability
- it supports additive report generation
- it does not grant authority
- it does not mutate runtime state
- it does not replace upstream execution truth

## 8. Verification Findings Taxonomy

The minimum `v0.1` findings taxonomy should include:

- `valid_signature`
- `invalid_signature`
- `missing_signature`
- `unsupported_signature_algorithm`
- `payload_hash_match`
- `payload_hash_mismatch`
- `missing_payload_hash`
- `valid_timestamp`
- `missing_timestamp`
- `stale_timestamp`
- `unknown_issuer`
- `missing_policy_ref`
- `evidence_incomplete`
- `adapter_parse_error`
- `verification_not_performed`
- `raw_payload_unavailable`
- `issuer_key_unavailable`
- `unsupported_receipt_version`

These findings are evidence interpretation outputs.

Important boundary constraints:

- a finding is not an approval result
- a finding is not a block result
- a finding is not an execution result
- a finding is review-oriented evidence interpretation for human reviewers and downstream Guard reports

## 9. Report Language Boundary

Guard report language for this framework should use or prefer:

- `verified`
- `not verified`
- `evidence incomplete`
- `integrity mismatch`
- `signature invalid`
- `timestamp missing`
- `issuer unknown`
- `requires human review`
- `recommendation only`
- `verification not performed`

Guard report language should prohibit or avoid:

- `approved`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `allowed for deployment`
- `production ready`
- `enforcement passed`

This language boundary exists to prevent semantic drift from verification into runtime authority, compliance authority, or deployment authority.

## 10. Reference Adapter Model

The initial reference-adapter model is intentionally narrow.
ramen receipt `v5` is the first reference adapter, but it is not the product center of Guard.

ramen issues.
Guard verifies.

ramen is a reference adapter, not a privileged dependency.

This means:

- ramen can issue receipts
- Guard can verify ramen receipts
- the same framework should support other receipt issuers
- Guard should not embed ramen-specific assumptions into the generalized contract
- reference adapter evidence can inform the framework but must not define the whole framework

The generalized framework must stay issuer-agnostic at the contract level even when one issuer is used as an early reference example.

## 11. Phase 1 Deliverables

Phase 1 should deliver:

- boundary document
- external receipt contract draft
- normalized evidence record draft
- findings taxonomy draft
- sample evidence records
- sample Guard report language
- reference adapter index
- adapter responsibility matrix

These are architecture and contract deliverables only.
They are not runtime implementation deliverables.

## 12. Open Questions

The following questions remain intentionally open in `v0.1` Phase 1:

- trust registry
- public key discovery
- key revocation
- timestamp freshness window
- multiple issuers
- chained receipts
- partial evidence
- confidential evidence
- redacted payloads
- CI/CD provenance
- agent runtime provenance
- cross-adapter correlation
- external verifier trust level

These questions affect future hardening, but they are not prerequisites for freezing the Phase 1 architecture boundary.

## 13. Phase 1 Exit Criteria

Phase 1 can close when:

- boundary language is stable
- non-scope is explicit
- minimum receipt contract is reviewed
- normalized record semantics are reviewed
- findings taxonomy is reviewed
- ramen is documented as reference adapter only
- no runtime behavior has changed

This exit condition preserves:

- recommendation-only
- additive-only
- non-executing
- non-control-plane
- verification-only
- human-review-oriented

It also preserves unchanged `audit`, `permit`, and `classify` behavior because the Phase 1 outcome is a boundary document only.
