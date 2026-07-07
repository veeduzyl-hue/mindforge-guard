# Adapter Responsibility Matrix v0.1

## Core Positioning

The Adapter Responsibility Matrix defines what an Evidence Source Adapter may do, must do, should preserve, and must not do when mapping external runtime evidence into Guard's verification framework.

An Evidence Source Adapter maps and verifies evidence. It does not approve, block, execute, certify, authorize, or control runtime actions.

The boundary remains:

- External systems issue evidence. Guard verifies evidence.
- Findings are evidence interpretation, not approval or blocking outcomes.
- Reports are additive and recommendation-only.
- Reference adapters demonstrate mappings; they do not define the framework.
- ramen is a reference adapter, not a privileged dependency.

## 1. Purpose

The adapter responsibility matrix exists to bridge the current Phase 1 boundary documents into a minimal adapter interface design without turning adapters into runtime authorities.

It is needed to:

- bridge boundary docs into minimal adapter interface design
- clarify what adapters are responsible for
- prevent adapters from becoming runtime authorities
- keep evidence-source-specific logic subordinate to the generalized framework

## 2. Adapter Types

### Evidence Source Adapter

An Evidence Source Adapter is the generalized adapter role.
It parses, validates, verifies, normalizes, and emits findings for an external evidence source.

### Reference Adapter

A Reference Adapter is a documented example of an Evidence Source Adapter mapping.
It demonstrates how one external evidence source can map into the framework.

A reference adapter is a documented example of an Evidence Source Adapter, not a separate authority-bearing class.

Reference adapters do not define the External Receipt Contract, Normalized Evidence Record, Findings Taxonomy, or report language boundary.

## 3. Responsibility Matrix

| Responsibility Area | Evidence Source Adapter Must | Evidence Source Adapter May | Evidence Source Adapter Must Not | Output Artifact |
| --- | --- | --- | --- | --- |
| input parsing | parse incoming evidence into a bounded internal shape | preserve source-specific parsing notes | invent absent source fields | parse result |
| minimum contract validation | validate required contract semantics | record partial compatibility context | redefine the minimum contract | contract validation result |
| source identity extraction | extract visible source and issuer identity | preserve source metadata for review | imply endorsement or trust by itself | source identity fields |
| receipt identity extraction | preserve receipt identifiers and version context | preserve parent or chain references when present | replace upstream receipt identity | receipt identity fields |
| payload hash verification | compare payload hash when raw payload is available | emit partial verification notes when comparison is incomplete | claim a hash match without available comparison evidence | integrity result |
| signature verification | verify signature when compatible proof and key context exist | record unsupported or unavailable verification limits | treat missing or unverifiable signatures as approved evidence | signature result |
| timestamp interpretation | interpret visible evidence timestamps | record freshness limitations when available | convert timestamp state into runtime permission | timestamp result |
| policy reference visibility | preserve whether policy linkage is visible | report policy context limitations | become policy authority | policy visibility result |
| evidence reference preservation | preserve raw evidence references and traceability | summarize evidence availability | hide missing evidence references | preserved evidence references |
| raw payload availability handling | mark whether raw payload was available for comparison | preserve retrieval limits in notes | silently treat unavailable payload as verified | integrity limitation note |
| redaction/confidentiality labeling | preserve explicit redaction and confidentiality labels | summarize reviewer-facing evidence limits | suppress redaction or confidentiality limits | evidence limitation note |
| normalized evidence record mapping | map evidence into the Guard-owned normalized record | preserve adapter-specific mapping notes | redefine the normalized record schema | normalized evidence record |
| finding emission | emit findings using the Guard findings taxonomy | attach review-oriented recommendations | emit approval or blocking outcomes | findings |
| report language compatibility | keep outputs compatible with Guard report language boundary | provide reviewer-facing summaries | use approval, blocking, certification, or deployment-permission language | report-compatible wording |
| error handling | convert errors and limits into review-visible findings | preserve error context in notes | convert errors into hidden failures or silent drops | error findings |
| unsupported version handling | report unsupported versions explicitly | preserve partial parse context when available | force unsupported versions into false compatibility | compatibility finding |
| adapter metadata | preserve adapter name and version context | add bounded mapping notes | imply privileged authority from adapter identity | adapter metadata |
| raw evidence preservation | keep references to raw evidence or receipts when available | preserve retrieval notes | replace source truth with adapter-generated substitutes | raw evidence references |
| human review support | produce review-ready artifacts and limitations | recommend further inspection | replace human review | review notes |

## 4. Required Adapter Outputs

An adapter should minimally produce:

- parse result
- contract validation result
- verification result
- normalized evidence record
- findings
- preserved raw evidence references
- adapter metadata
- limitations or notes

These outputs are review artifacts.
They are not runtime authority objects, not approval tokens, and not deployment gates.

## 5. Adapter Non-Responsibilities

An adapter is not responsible for:

- approving actions
- blocking actions
- executing runtime changes
- modifying upstream state
- changing policy
- certifying compliance
- declaring production readiness
- hiding failed evidence
- suppressing partial evidence
- replacing human review
- defining issuer trust by itself

## 6. Error Handling Responsibilities

The adapter should surface verification and parsing limits as findings rather than convert them into approval or blocking outcomes.

- parse error: emit an adapter parse finding and preserve any usable raw references
- missing required field: emit a completeness or compatibility finding
- unsupported receipt version: emit `unsupported_receipt_version`
- unsupported signature algorithm: emit `unsupported_signature_algorithm`
- issuer key unavailable: emit `issuer_key_unavailable`
- raw payload unavailable: emit `raw_payload_unavailable`
- payload hash mismatch: emit `payload_hash_mismatch`
- malformed timestamp: emit `malformed_timestamp`
- redacted evidence: emit `redacted_evidence`
- confidential evidence: emit `confidential_evidence_labeled`

Each of these conditions should remain visible as evidence interpretation.
None of them should become approval, blocking, certification, or deployment-permission results.

## 7. Relationship to Existing Phase 1 Documents

The matrix connects the current Phase 1 document set as follows:

- External Receipt Contract defines the minimum inbound semantics the adapter must validate.
- Normalized Evidence Record defines the internal review artifact the adapter must map into.
- Verification Findings Taxonomy defines the interpretation vocabulary the adapter must emit.
- Reference Adapter Index defines documented example mappings without giving them framework ownership.
- Sample Evidence Records illustrate how adapter outputs may look in review-oriented form.
- Sample Guard Report Language illustrates how adapter outputs may be described to human reviewers.

## 8. ramen Reference Adapter Position

ramen `v5` may be used as the first reference adapter example for this matrix.

ramen issues. Guard verifies.

ramen is a reference adapter, not a privileged dependency.

That example is useful because it demonstrates one bounded mapping path.
It does not define the matrix, the framework, or the generalized adapter contract.

## 9. Minimal Implementation Readiness

This matrix is intended to support the next step of minimal adapter interface design.
It clarifies responsibility boundaries and expected outputs without becoming an implementation specification or runtime control design.

## 10. Non-Goals

The matrix does not include:

- no adapter runtime execution
- no adapter marketplace
- no trust registry
- no policy enforcement
- no approval semantics
- no blocking semantics
- no certification semantics
- no deployment permission semantics
- no production readiness claim

## 11. Open Questions

Open questions for later bounded phases include:

- adapter conformance checks
- adapter versioning
- raw payload canonicalization
- key discovery
- revocation handling
- trust registry integration
- multi-adapter correlation
- confidential evidence display
