# Sample Guard Report Language v0.1

## Core Positioning

Guard report language describes verification observations, evidence limitations, and human-review recommendations. It does not approve, block, certify, authorize, or control runtime actions.

A Guard report can say what was verified, not verified, partially verified, incomplete, mismatched, or review-relevant. It must not say that an action is approved, blocked, certified, safe, compliant, or allowed for deployment.

The boundary remains:

- Guard independently verifies external runtime evidence.
- External systems issue evidence. Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not issue, approve, block, execute, certify, or control runtime actions.

## 1. Purpose

Sample report language exists to keep Guard's reviewer-facing output aligned with the verification-only boundary even when evidence becomes concrete, detailed, or severe.

It is needed to:

- keep Guard reports aligned with verification-only boundary
- make findings readable for human reviewers
- avoid approval, blocking, or certification drift
- provide consistent language across adapters
- support external evidence review without becoming runtime authority

This document is about wording discipline.
It does not define runtime behavior and does not authorize any downstream action.

## 2. Boundary

Guard report language is not:

- approval language
- blocking language
- enforcement language
- deployment permission
- compliance certification
- safety certification
- runtime authorization
- a replacement for human judgment

These exclusions matter because report phrasing is often the first thing a reviewer sees.
If report language drifts into authority language, Guard can be misread as an approval system, enforcement layer, or deployment control plane.

## 3. Preferred Vocabulary

The following vocabulary is preferred because it stays inside Guard's verification and review posture.

### `verified`

- Meaning: Guard could confirm a bounded verification claim within the available evidence.
- Boundary: does not mean approved.

### `not verified`

- Meaning: Guard could not confirm the relevant verification claim.
- Boundary: does not mean blocked.

### `partially verified`

- Meaning: some verification claims were confirmed while others remained limited, unavailable, or unresolved.
- Boundary: does not imply deployability.

### `verification not performed`

- Meaning: the relevant verification step did not occur or could not occur.
- Boundary: does not mean denied.

### `evidence incomplete`

- Meaning: required or useful evidence was missing or partial.
- Boundary: does not create enforcement semantics.

### `integrity mismatch`

- Meaning: payload-related integrity evidence did not align.
- Boundary: reports the mismatch without turning it into runtime control.

### `signature invalid`

- Meaning: signature verification failed.
- Boundary: reports authenticity failure without claiming enforcement authority.

### `timestamp missing`

- Meaning: evidence timing visibility was absent.
- Boundary: does not automatically invalidate the action.

### `issuer unknown`

- Meaning: issuer identity was visible but not recognized in the available context.
- Boundary: does not assert external illegitimacy beyond Guard's visible evidence boundary.

### `issuer key unavailable`

- Meaning: signature verification key material was unavailable.
- Boundary: indicates a verification limitation, not an approval outcome.

### `policy reference missing`

- Meaning: policy linkage was not visible.
- Boundary: Guard remains non-authoritative on policy approval.

### `raw payload unavailable`

- Meaning: payload comparison could not be completed because the raw payload was unavailable.
- Boundary: does not imply runtime denial.

### `requires human review`

- Meaning: a human reviewer should interpret the evidence before relying on it.
- Boundary: keeps decision-making explicit and human-centered.

### `reviewer attention recommended`

- Meaning: the record remains interpretable, but a reviewer should focus on a specific limitation or discrepancy.
- Boundary: not a gate.

### `recommendation only`

- Meaning: the report is additive review guidance and does not control runtime behavior.
- Boundary: explicit anti-authority marker.

## 4. Avoided Vocabulary

The following terms should be prohibited or strongly avoided in Guard report language because they imply authority, certification, or deployment control:

- `approved`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `unsafe`
- `allowed for deployment`
- `denied for deployment`
- `production ready`
- `enforcement passed`
- `enforcement failed`
- `authorized`
- `rejected`
- `guaranteed`

These terms should be avoided because they can misread Guard as:

- an approval system
- a runtime enforcement layer
- a certification authority
- a deployment control plane

## 5. Report Statement Pattern

Guard report statements should prefer a bounded, composable structure.

- `Observation:`
- `Verification status:`
- `Evidence limitation:`
- `Review recommendation:`
- `Boundary note:`

Examples:

`Observation: The receipt signature was verified against the available issuer key.`

`Verification status: The evidence is integrity-verifiable for the supplied payload.`

`Evidence limitation: The policy reference is missing, reducing reviewability.`

`Review recommendation: Human review is recommended before relying on this evidence.`

`Boundary note: This report is recommendation-only and does not approve or block the underlying action.`

## 6. Sample Language by Finding Category

### identity

- `Issuer identity was visible in the supplied evidence.`
- `Issuer identity was not recognized in the available verification context.`
- `Subject identity was incomplete and requires reviewer attention.`

### integrity

- `The supplied payload matched the attested hash within the available evidence boundary.`
- `An integrity mismatch was detected between the attested hash and the available raw payload.`
- `Payload integrity could not be fully assessed because the raw payload was unavailable.`

### signature

- `The receipt signature was verified against the available issuer key.`
- `The receipt signature was invalid under the available verification context.`
- `Signature verification was not completed because issuer key material was unavailable.`

### timestamp

- `The evidence timestamp was visible and parseable.`
- `The evidence timestamp was missing, reducing chronology visibility.`
- `Timestamp interpretation remained incomplete and requires reviewer attention.`

### policy_reference

- `A policy reference was visible as contextual evidence only.`
- `The policy reference was missing, reducing reviewability.`
- `Policy linkage could not be verified and remains review context only.`

### evidence_completeness

- `The available evidence was sufficient for bounded review interpretation.`
- `The evidence set was partial and should be treated as incomplete for some verification claims.`
- `Redacted or confidential evidence was explicitly labeled for reviewer awareness.`

### adapter

- `The adapter parsed the supplied receipt into a review-oriented record.`
- `Receipt parsing did not complete successfully under the current adapter boundary.`
- `Verification was not performed because the receipt version was outside the supported mapping range.`

### compatibility

- `The receipt was parseable within the minimum contract boundary.`
- `The record was not review-ready under the current compatibility conditions.`
- `Integrity verification remained partial because required evidence was unavailable.`

### review

- `Human review is required before relying on this evidence.`
- `Reviewer attention is recommended for the identified verification limitation.`
- `This report remains recommendation-only and does not authorize the underlying action.`

## 7. Sample A: Fully Verified Signed Receipt

`Observation: The receipt signature was verified against the available issuer key, the payload hash matched the available raw payload, the timestamp was valid, and the policy reference was visible as contextual evidence.`

`Verification status: The evidence is verified within the available boundary and is review-ready for human interpretation.`

`Boundary note: This does not mean the action is approved, safe, or deployment-ready. This report is recommendation-only.`

## 8. Sample B: Invalid Signature

`Observation: The receipt signature was present but invalid under the available verification context.`

`Verification status: The evidence is not verified for signature authenticity.`

`Review recommendation: Human review is required before relying on this evidence.`

`Boundary note: Guard reports the invalid signature and does not block the underlying runtime action.`

## 9. Sample C: Payload Hash Mismatch

`Observation: An integrity mismatch was detected because the available raw payload did not match the attested hash.`

`Verification status: The evidence should not be treated as integrity-verified.`

`Review recommendation: Human review is required, and the payload lineage should be inspected.`

`Boundary note: Guard reports the mismatch without enforcing runtime blocking.`

## 10. Sample D: Missing Policy Reference

`Observation: The policy reference was missing, reducing reviewability.`

`Verification status: The receipt may still be parseable or integrity-verifiable within the available evidence boundary.`

`Review recommendation: Reviewer attention is recommended if policy context matters to the review objective.`

`Boundary note: Guard is not policy authority and does not convert missing policy context into an approval or denial result.`

## 11. Sample E: Raw Payload Unavailable

`Observation: A payload hash was present, but the raw payload was unavailable.`

`Verification status: Hash comparison was not performed, so integrity verification remains incomplete.`

`Review recommendation: The evidence requires reviewer caution and should be treated as partially verified.`

`Boundary note: This report records a verification limitation and does not imply deployment denial.`

## 12. Sample F: Partial or Redacted Evidence

`Observation: The evidence set was partial, and some evidence was redacted or confidentiality-labeled.`

`Verification status: The record remains partially verified within the visible evidence boundary.`

`Evidence limitation: Review should account for unavailable material and explicit redaction notices.`

`Boundary note: Guard does not silently accept hidden evidence and does not convert redaction into approval.`

## 13. Sample G: Unsupported Receipt Version

`Observation: The receipt version was outside the adapter's supported mapping range.`

`Verification status: Verification was not performed or remained only partially performed because of an adapter compatibility limitation.`

`Review recommendation: The record is not review-ready unless additional compatible evidence is supplied.`

`Boundary note: This is a compatibility issue, not a deployment judgment.`

## 14. Sample H: Unknown Issuer Key

`Observation: The issuer identity was visible, but issuer key material was unavailable.`

`Verification status: Signature verification was not completed, so the evidence is not signature-verified.`

`Review recommendation: Human review is required with explicit attention to key availability limits.`

`Boundary note: Guard reports the limitation and does not claim runtime enforcement authority.`

## 15. Finding-to-Language Mapping Table

| Finding Type | Preferred Language | Avoided Language | Boundary Rationale |
| --- | --- | --- | --- |
| `valid_signature` | `The receipt signature was verified against the available issuer key.` | `The action was approved.` | Signature verification is evidence interpretation, not approval. |
| `invalid_signature` | `The receipt signature was invalid under the available verification context.` | `The action was blocked.` | Invalid signature is a verification result, not a runtime gate. |
| `payload_hash_match` | `The available raw payload matched the attested hash.` | `The action is safe.` | Integrity match does not certify safety or readiness. |
| `payload_hash_mismatch` | `An integrity mismatch was detected between the attested hash and available payload evidence.` | `The action is rejected.` | Mismatch reporting must not become enforcement. |
| `missing_policy_ref` | `The policy reference was missing, reducing reviewability.` | `The evidence is non-compliant.` | Guard is not policy or compliance authority. |
| `raw_payload_unavailable` | `The raw payload was unavailable, so integrity comparison was not completed.` | `Deployment is denied.` | Missing payload limits verification but does not authorize control. |
| `redacted_evidence` | `Evidence redaction was explicitly disclosed and limits review completeness.` | `The record is unacceptable.` | Redaction should be surfaced, not upgraded into a gate result. |
| `unsupported_receipt_version` | `The receipt version was outside the supported mapping boundary.` | `The action failed approval.` | Version mismatch is a compatibility statement, not approval language. |
| `issuer_key_unavailable` | `Issuer key material was unavailable for signature verification.` | `The issuer is unauthorized.` | Guard only reports visible verification limits. |
| `requires_human_review` | `Human review is required before relying on this evidence.` | `Escalation gate triggered.` | Human-review guidance should not imply control-plane workflow authority. |

## 16. Report Header Template

The following is a vendor-neutral report header template:

- `Report type:` External evidence verification report
- `Evidence source:` External runtime evidence source
- `Adapter:` External receipt normalizer
- `Verification status:` Partially verified
- `Review status:` Requires human review
- `Boundary note:` Recommendation only; this report does not approve, block, certify, authorize, or control the underlying runtime action.

## 17. Report Summary Template

Example summary:

`Summary: Guard verified the visible signature and timestamp within the available evidence boundary, did not verify all integrity claims because some raw evidence was unavailable, identified key evidence limitations for reviewer attention, and recommends human review. This report is recommendation-only and does not approve or block the underlying action.`

This template should preserve:

- what was verified
- what was not verified
- key evidence limitations
- human review recommendation
- recommendation-only boundary

## 18. Report Footer Boundary Note

Recommended footer language:

`This report is an additive verification artifact for human review. It does not approve, block, certify, authorize, or control the underlying runtime action.`

Alternative acceptable wording:

`This Guard report summarizes verification observations and evidence limitations. It is recommendation-only and must not be interpreted as runtime approval, blocking, certification, or deployment permission.`

## 19. Relationship to Sample Evidence Records

Sample evidence records provide the structured evidence states that sample report language explains for human reviewers.

- sample records provide structured evidence states
- sample report language explains those states for human reviewers
- report language must preserve finding semantics
- report language must not upgrade findings into authority decisions

The record holds the structured state.
The report language explains that state without changing its bounded meaning.

## 20. Relationship to Reference Adapters

This report language is framework-level and vendor-neutral.

- ramen `v5` reports can use this language
- other adapters can use this language
- no adapter owns the report language
- report language remains vendor-neutral and framework-level

The report language exists above any one adapter narrative.
It should not become a product integration announcement or a privileged-source wording model.

## 21. Non-Goals

This document does not provide:

- no compliance certification
- no production readiness claim
- no runtime approval
- no blocking semantics
- no enforcement result
- no legal attestation
- no trust registry status
- no automatic remediation language

These exclusions keep report language from drifting into authority, legal, or operational control semantics.

## 22. Open Questions

Open questions for later bounded phases include:

- report severity phrasing
- reviewer workflow language
- legal review language
- confidential evidence wording
- multi-receipt summaries
- adapter-specific report appendices
- localization or translation consistency
- snapshot stability for future renderer tests

These questions should remain future hardening work rather than change the `v0.1` report-language boundary.
