# Verification Findings Taxonomy v0.1

## Core Positioning

Verification findings are Guard's structured interpretation of external evidence verification results. They are not approval, blocking, certification, compliance, or runtime authorization outcomes.

A finding describes what Guard could or could not verify. It does not decide whether the underlying action may proceed.

The boundary remains:

- Guard independently verifies external runtime evidence.
- External systems issue evidence. Guard verifies evidence.
- Guard findings are recommendation-only.
- Guard reports are additive.
- Guard does not issue, approve, block, execute, certify, or control runtime actions.
- ramen is a reference adapter, not a privileged dependency.

## 1. Purpose

The Verification Findings Taxonomy exists to give Guard one deterministic language for expressing verification interpretation across heterogeneous external evidence sources.

The taxonomy is needed to:

- normalize verification outcomes across external evidence sources
- support human review
- support consistent Guard reports
- avoid approval or control-plane language
- keep adapter outputs deterministic and comparable

External issuers may produce different receipt layouts, proof formats, or evidence packaging.
Guard still needs one stable findings surface so review outputs remain comparable even when source evidence varies.

## 2. Boundary

Verification findings are not:

- approval
- blocking
- enforcement
- deployment permission
- compliance certification
- runtime authorization
- a replacement for human judgment

This boundary matters because findings sit close to evidence interpretation.
Without explicit constraints, finding language can drift into authority language.
In `v0.1`, a finding may explain verification success, absence, failure, incompatibility, or review limitation.
It may not silently become a permit, denial, or policy takeover.

## 3. Finding Model

Each finding should contain at least:

- `finding_id`
- `finding_type`
- `category`
- `severity`
- `field`
- `message`
- `evidence_ref`
- `recommendation`
- `verification_stage`
- `source_adapter`

### `finding_id`

- Purpose: uniquely identify the finding within the record or report.
- Minimum semantics: stable enough to distinguish one finding from another.

### `finding_type`

- Purpose: name the specific verification interpretation being expressed.
- Minimum semantics: use taxonomy-defined, review-oriented finding names.

### `category`

- Purpose: group related findings into a stable verification domain.
- Minimum semantics: identify whether the finding concerns identity, integrity, signature, timestamp, policy, evidence completeness, adapter behavior, compatibility, or review readiness.

### `severity`

- Purpose: express review significance.
- Minimum semantics: tell a reviewer how much attention the finding deserves.

### `field`

- Purpose: point to the affected field, section, or evidence area.
- Minimum semantics: preserve locality so reviewers know what the finding refers to.

### `message`

- Purpose: explain the finding in bounded, human-readable language.
- Minimum semantics: describe what Guard observed, verified, could not verify, or could not interpret.

### `evidence_ref`

- Purpose: link the finding back to the relevant evidence object, payload, receipt, or reference.
- Minimum semantics: preserve traceability whenever possible.

### `recommendation`

- Purpose: provide additive guidance for follow-up review.
- Minimum semantics: recommend inspection, confirmation, comparison, or escalation for human review.

### `verification_stage`

- Purpose: show where in the verification lifecycle the finding was produced.
- Minimum semantics: indicate whether it arose during parsing, normalization, integrity checks, signature checks, timestamp checks, compatibility checks, or review preparation.

### `source_adapter`

- Purpose: identify which adapter emitted the finding.
- Minimum semantics: preserve adapter context without making the adapter the owner of taxonomy semantics.

## 4. Severity Semantics

The `severity` field should use:

- `info`
- `low`
- `medium`
- `high`
- `critical`

Severity describes review significance only.

- `info` means the finding is explanatory or traceability-oriented.
- `low` means the finding is useful to review but not strongly destabilizing.
- `medium` means the finding reduces confidence or completeness and should be examined.
- `high` means the finding materially weakens verification confidence or review readiness.
- `critical` means the finding indicates a severe verification limitation or contradiction that demands immediate human attention.

Important boundary:

- severity does not equal block
- severity does not equal compliance status
- severity does not equal runtime permission
- severity does not replace human judgment

## 5. Finding Categories

The `v0.1` taxonomy should use these categories:

- `identity`
- `integrity`
- `signature`
- `timestamp`
- `policy_reference`
- `evidence_completeness`
- `adapter`
- `compatibility`
- `review`

These categories provide a stable grouping layer for reports, snapshots, and reviewer interpretation.
They are broad enough to be vendor-neutral and specific enough to remain deterministic.

## 6. Identity Findings

### `issuer_visible`

- Meaning: issuer identity is present and visible enough for review interpretation.
- Typical severity: `info`
- Recommended reviewer action: confirm issuer identity is consistent with expected source context.

### `unknown_issuer`

- Meaning: issuer identity is present but not recognized or not mapped into a known trust context.
- Typical severity: `medium`
- Recommended reviewer action: inspect issuer context and determine whether external trust assumptions are missing or intentionally undefined.

### `missing_issuer`

- Meaning: issuer identity is absent or unusable.
- Typical severity: `high`
- Recommended reviewer action: treat issuer provenance as incomplete and request or inspect additional evidence.

### `subject_visible`

- Meaning: the subject of the evidence is visible enough for review interpretation.
- Typical severity: `info`
- Recommended reviewer action: confirm subject identity matches the expected evidence target.

### `missing_subject`

- Meaning: the evidence does not adequately identify what it is about.
- Typical severity: `high`
- Recommended reviewer action: treat the evidence target as incomplete and require further clarification before relying on the record for review.

### `contradictory_identity_fields`

- Meaning: identity-related fields disagree with one another or imply conflicting subject or issuer relationships.
- Typical severity: `critical`
- Recommended reviewer action: inspect raw evidence and treat identity interpretation as unstable until resolved.

## 7. Integrity Findings

### `payload_hash_match`

- Meaning: Guard could compare the payload hash and found a match.
- Typical severity: `info`
- Recommended reviewer action: preserve as positive integrity evidence while continuing broader review.

### `payload_hash_mismatch`

- Meaning: Guard could compare the payload hash and found a mismatch.
- Typical severity: `critical`
- Recommended reviewer action: inspect raw payload lineage immediately and treat integrity trust as materially weakened.

### `missing_payload_hash`

- Meaning: no payload hash was provided where one was expected for integrity interpretation.
- Typical severity: `high`
- Recommended reviewer action: request or inspect alternative integrity evidence before treating the payload as verifiable.

### `raw_payload_unavailable`

- Meaning: hash or integrity semantics were declared, but the raw payload needed for comparison was not available.
- Typical severity: `medium`
- Recommended reviewer action: record the limitation and determine whether external payload retrieval is possible.

### `unsupported_hash_algorithm`

- Meaning: a hash algorithm was declared but not supported by the verifier or taxonomy consumer.
- Typical severity: `high`
- Recommended reviewer action: inspect whether the algorithm should be supported or whether verification must remain partial.

### `payload_not_checked`

- Meaning: payload integrity was not checked even though the evidence advanced far enough to note the omission.
- Typical severity: `medium`
- Recommended reviewer action: determine whether this was intentional, unsupported, or a missing verification step.

## 8. Signature Findings

### `valid_signature`

- Meaning: signature material was present and successfully verified under the available key context.
- Typical severity: `info`
- Recommended reviewer action: preserve as positive signature evidence without treating it as approval.

### `invalid_signature`

- Meaning: signature verification was attempted and failed.
- Typical severity: `critical`
- Recommended reviewer action: inspect key context, raw receipt integrity, and possible issuer mismatch before relying on the evidence.

### `missing_signature`

- Meaning: signature material was absent where expected.
- Typical severity: `high`
- Recommended reviewer action: treat authenticity confidence as reduced and inspect whether unsigned evidence is acceptable for bounded review.

### `unsupported_signature_algorithm`

- Meaning: the signature algorithm was declared but not supported for verification.
- Typical severity: `high`
- Recommended reviewer action: determine whether support is intentionally absent or whether verification should be extended in a later bounded phase.

### `issuer_key_unavailable`

- Meaning: signature verification context depended on issuer key material that was unavailable.
- Typical severity: `high`
- Recommended reviewer action: inspect key discovery assumptions and preserve the result as an explicit limitation.

### `signature_not_checked`

- Meaning: signature verification was not performed.
- Typical severity: `medium`
- Recommended reviewer action: determine whether the omission was expected, unsupported, or caused by missing inputs.

## 9. Timestamp Findings

### `valid_timestamp`

- Meaning: timestamp data was present and interpretable.
- Typical severity: `info`
- Recommended reviewer action: preserve for chronology review.

### `missing_timestamp`

- Meaning: timestamp data was absent where expected.
- Typical severity: `medium`
- Recommended reviewer action: note reduced chronology visibility and request additional timing evidence if needed.

### `malformed_timestamp`

- Meaning: timestamp data was present but not parseable or semantically usable.
- Typical severity: `high`
- Recommended reviewer action: inspect raw fields and determine whether source formatting or adapter handling caused the failure.

### `stale_timestamp`

- Meaning: timestamp data fell outside a declared or configured freshness window.
- Typical severity: `medium`
- Recommended reviewer action: inspect freshness expectations and determine whether the staleness is material to human review.

### `timestamp_not_checked`

- Meaning: timestamp interpretation was not performed.
- Typical severity: `low`
- Recommended reviewer action: confirm whether freshness or chronology checking was intentionally out of scope.

## 10. Policy Reference Findings

### `policy_ref_visible`

- Meaning: policy reference information was present and visible as review context.
- Typical severity: `info`
- Recommended reviewer action: use the policy reference as context only, not as authority.

### `missing_policy_ref`

- Meaning: expected policy reference visibility was absent.
- Typical severity: `low`
- Recommended reviewer action: note the missing context and continue review without automatically treating the evidence as invalid.

### `policy_ref_unverifiable`

- Meaning: a policy reference was present but Guard could not verify or interpret it sufficiently.
- Typical severity: `medium`
- Recommended reviewer action: treat the policy linkage as limited context and inspect the source declaration directly if needed.

### `policy_context_incomplete`

- Meaning: policy-related context was partial, ambiguous, or insufficient for confident interpretation.
- Typical severity: `medium`
- Recommended reviewer action: preserve the ambiguity and require reviewer interpretation rather than silent inference.

Missing `policy_ref` does not automatically make evidence invalid.
It weakens contextual visibility but does not by itself convert the record into a failure or denial outcome.

## 11. Evidence Completeness Findings

### `evidence_complete`

- Meaning: the evidence set appears complete enough for its declared verification scope.
- Typical severity: `info`
- Recommended reviewer action: proceed with normal review while preserving the evidence references.

### `evidence_incomplete`

- Meaning: expected evidence elements were absent or incomplete.
- Typical severity: `high`
- Recommended reviewer action: identify the missing elements and record the gap explicitly before relying on the review surface.

### `partial_evidence`

- Meaning: some relevant evidence is present, but the set is not complete.
- Typical severity: `medium`
- Recommended reviewer action: continue bounded review while highlighting the missing portions.

### `redacted_evidence`

- Meaning: evidence was intentionally redacted and the redaction was visible.
- Typical severity: `medium`
- Recommended reviewer action: inspect whether the redaction materially limits review interpretation.

### `confidential_evidence_labeled`

- Meaning: confidentiality constraints were disclosed explicitly.
- Typical severity: `info`
- Recommended reviewer action: preserve confidentiality context and avoid assuming hidden evidence is complete or absent.

### `external_report_unavailable`

- Meaning: an external report or referenced artifact could not be retrieved or was not available.
- Typical severity: `medium`
- Recommended reviewer action: record the absence and determine whether alternative evidence is sufficient for bounded review.

## 12. Adapter Findings

### `adapter_parse_success`

- Meaning: the adapter successfully parsed the incoming evidence into a usable intermediate shape.
- Typical severity: `info`
- Recommended reviewer action: none beyond preserving traceability.

### `adapter_parse_error`

- Meaning: the adapter could not parse the evidence correctly.
- Typical severity: `high`
- Recommended reviewer action: inspect raw inputs and adapter assumptions before treating downstream findings as complete.

### `unsupported_receipt_version`

- Meaning: the receipt or evidence version was recognized but not supported by the adapter.
- Typical severity: `high`
- Recommended reviewer action: determine whether compatibility expansion belongs in a later bounded phase.

### `unsupported_source_type`

- Meaning: the source evidence type falls outside the adapter's supported scope.
- Typical severity: `high`
- Recommended reviewer action: record the boundary mismatch and avoid forcing interpretation into an unsupported shape.

### `normalization_error`

- Meaning: parsing may have succeeded, but normalized record generation failed or remained incomplete.
- Typical severity: `high`
- Recommended reviewer action: inspect the transformation boundary and preserve any raw evidence references that remain available.

### `verification_not_performed`

- Meaning: the verification stage was skipped, unavailable, or intentionally not executed.
- Typical severity: `medium`
- Recommended reviewer action: record why verification did not occur and prevent reviewers from over-reading the evidence.

## 13. Compatibility Findings

### `contract_parseable`

- Meaning: the evidence could be interpreted into the minimum contract shape.
- Typical severity: `info`
- Recommended reviewer action: continue bounded verification.

### `contract_not_parseable`

- Meaning: the evidence could not satisfy minimum contract interpretation.
- Typical severity: `critical`
- Recommended reviewer action: treat the evidence as outside the minimum verification boundary until clarified.

### `integrity_verifiable`

- Meaning: enough material exists to assess integrity semantics.
- Typical severity: `info`
- Recommended reviewer action: continue integrity interpretation using the available context.

### `integrity_not_verifiable`

- Meaning: integrity semantics could not be meaningfully assessed.
- Typical severity: `high`
- Recommended reviewer action: record the limitation and avoid overstating evidence confidence.

### `review_ready`

- Meaning: the evidence and normalized record are sufficiently prepared for human review.
- Typical severity: `info`
- Recommended reviewer action: continue to reviewer interpretation.

### `not_review_ready`

- Meaning: the evidence remains too incomplete, contradictory, or unstable for reliable human review.
- Typical severity: `high`
- Recommended reviewer action: resolve the limiting issues or treat the review as provisional only.

## 14. Review Findings

### `requires_human_review`

- Meaning: the record still needs human interpretation before any downstream decision context.
- Typical severity: `info`
- Recommended reviewer action: keep the review loop explicit.

### `reviewer_attention_recommended`

- Meaning: a reviewer should pay attention to a specific area even if the evidence is not wholly unusable.
- Typical severity: `medium`
- Recommended reviewer action: inspect the cited field, evidence reference, or transformation step closely.

### `evidence_sufficient_for_review`

- Meaning: enough evidence exists to support bounded human review.
- Typical severity: `info`
- Recommended reviewer action: proceed with review while preserving all attached findings.

### `evidence_insufficient_for_review`

- Meaning: evidence remains too incomplete or unstable for confident review interpretation.
- Typical severity: `high`
- Recommended reviewer action: request additional evidence or treat the review posture as incomplete.

## 15. Finding-to-Report Language Mapping

The following mapping keeps report language inside Guard's verification boundary.

| Finding Type | Preferred Report Language | Avoided Language |
| --- | --- | --- |
| `valid_signature` | `signature verified` | `approved`, `certified` |
| `invalid_signature` | `signature invalid` | `blocked`, `rejected for deployment` |
| `payload_hash_match` | `integrity check matched available payload evidence` | `safe`, `trusted for execution` |
| `payload_hash_mismatch` | `integrity mismatch detected` | `forbidden`, `hard deny` |
| `missing_timestamp` | `timestamp missing` | `expired and disallowed` |
| `unknown_issuer` | `issuer identity not recognized` | `unauthorized actor` |
| `missing_policy_ref` | `policy reference not visible` | `non-compliant` |
| `evidence_incomplete` | `evidence incomplete` | `failed approval` |
| `verification_not_performed` | `verification not performed` | `cannot proceed` |
| `review_ready` | `ready for human review` | `production ready`, `allowed for deployment` |
| `requires_human_review` | `requires human review` | `needs escalation gate` |

Avoided language should continue to exclude:

- `approved`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `production ready`
- `allowed for deployment`
- `enforcement passed`

## 16. Minimal Finding Example

The following vendor-neutral JSON illustrates a minimal finding object using verification and review language only.

```json
{
  "finding_id": "finding-identity-001",
  "finding_type": "unknown_issuer",
  "category": "identity",
  "severity": "medium",
  "field": "source.issuer",
  "message": "Issuer identity was visible but not recognized in the available trust context.",
  "evidence_ref": "artifact://receipts/receipt-2026-07-07-001.json",
  "recommendation": "Inspect issuer provenance and preserve the result as a review limitation until clarified.",
  "verification_stage": "identity_verification",
  "source_adapter": "external-receipt-normalizer"
}
```

This example does not express approval, blocking, compliance, or certification semantics.
It only describes what Guard could observe and how a reviewer should interpret the limitation.

## 17. Relationship to Normalized Evidence Record

Verification findings attach to normalized records.
They do not replace normalized records and they do not float free from evidence traceability.

- findings attach to normalized records
- findings interpret verification status
- findings should preserve evidence references
- findings should not hide failed evidence
- findings should not mutate upstream runtime state

The normalized record provides the stable review structure.
The findings taxonomy provides the stable interpretation language attached to that structure.

## 18. Relationship to Reference Adapters

Reference adapters may emit findings using this taxonomy, but they do not own it.

- ramen adapter can emit findings mapped to this taxonomy
- other adapters can emit the same taxonomy
- no adapter owns the taxonomy
- taxonomy must remain vendor-neutral

This keeps the findings layer portable across issuers, source types, and future bounded adapters.

## 19. Non-Goals

The `v0.1` findings taxonomy does not include:

- no enforcement engine
- no compliance score
- no deployment approval
- no runtime decision replacement
- no automated remediation in `v0.1`
- no trust registry semantics in `v0.1`

The taxonomy exists to stabilize interpretation language, not to create a hidden control plane.

## 20. Open Questions

Open questions for later bounded phases include:

- severity calibration
- trust registry integration
- finding deduplication
- multi-receipt aggregation
- chained findings
- confidential evidence display
- reviewer workflow integration
- report snapshot stability

These questions should remain future hardening topics rather than expand `v0.1` into runtime authority or approval semantics.
