# External Evidence Assurance Idempotency Fingerprint Type-contract Need Assessment v0.1

## 1. Status

- Status: `assessment-only`
- Scope: `docs-only`
- Source type implementation: `none`
- Existing type modification: `none`
- Fixture modification: `none`
- Verifier modification: `none`
- Public export expansion: `none`
- Authentication/Tenant implementation: `none`
- Persistence implementation: `none`
- Transport implementation: `none`
- Runtime implementation: `none`
- Authority status: `no authority expansion`

This assessment is not:

- a source type specification
- a fingerprint implementation plan
- a canonicalization implementation
- a persistence DTO design
- a database schema
- an authentication or tenant contract
- a transport contract
- a production-readiness declaration

## 2. Executive Decision

Primary decision:
`EXISTING_CONTRACTS_SUFFICIENT_WITH_SEPARATE_ALIGNMENT_WORK`

Confidence:
`high`

Stable package-internal type gaps:
`none`

Stable service-boundary type gaps:
`none`

Comment-alignment needs:

- clarify in source-contract comments that `scope_reference` remains caller text and is not effective scope
- clarify in source-contract comments that `request_fingerprint_ref` remains caller text and is not the service-established effective request fingerprint
- keep `VerificationReplayContext` bounded to replay lineage rather than fingerprint, authorization, or effective-scope authority

Fixture-alignment needs:

- the current local idempotency/replay fixture compares a broader equality set than the approved fingerprint profile and should remain explicitly framed as a local bounded proof, not profile conformance

Verifier-alignment needs:

- future focused verifier work may need an explicit separation between current local fixture guarantees and future fingerprint-profile conformance guarantees

Public export authorized:
`no`

Runtime implementation authorized:
`no`

## 3. Assessment Question

Does the approved Idempotency Fingerprint Profile v0.1 now create any stable
package-internal or service-boundary type-contract gap that must be frozen
before the next architecture phase, or do existing contracts plus documented
semantic invariants remain sufficient?

## 4. Approved Semantic Baseline

The approved fingerprint-profile proposal freezes all of the following:

- fingerprint profile identity is the ordered pair `(profile name, profile version)`
- profile name is `external-evidence-verification-request`
- profile version is `0.1`
- comparison identity is `effective scope + idempotency key + fingerprint profile identity + effective request fingerprint`
- claim lookup partition is `effective scope + idempotency key`
- claim-bound comparison record is `fingerprint profile identity + effective request fingerprint + immutable canonical request binding or reference`
- full durable claim binding additionally includes accepted logical job identity
- `scope_reference` is not effective scope
- `request_fingerprint_ref` is not canonical fingerprint authority
- canonical fingerprint can only be service-established or independently validated by a future service
- the canonical projection uses RFC 8785 JCS over UTF-8
- the digest algorithm is SHA-256
- the encoded fingerprint is exactly 64 lowercase hexadecimal characters
- assurance-profile ordering uses exact unsigned UTF-8 bytewise ordering
- no Unicode normalization is performed
- content-only deduplication is prohibited
- cross-tenant claim resolution is prohibited
- profile upgrade must not create a parallel claim
- replay is attempt-specific and establishes a new logical job
- same-job resolution still requires representability, immutable binding consistency, and current authorization or visibility
- no type, fixture, verifier, persistence, transport, or runtime implementation was authorized

## 5. Current Source-contract Inventory

### 5.1 Existing domain and artifact contracts

Current source-contract definitions still come from:

- `packages/guard-core/src/externalEvidence/verificationTypes.ts`
- `packages/guard-core/src/externalEvidence/minimalServiceApiTypes.ts`

Existing reusable contract surfaces relevant to this assessment are:

- `VerificationIdempotencyBoundary`
- `VerificationReplayContext`
- `VerificationRequest`
- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `VerificationUsageRecord`
- `VerificationJobSubmissionEnvelope`
- `VerificationJobSubmissionDisposition`
- `VerificationServiceProblem`
- `VerificationJobSubmissionResponse`

### 5.2 Existing idempotency contract inventory

Current source contracts already express:

- caller-provided `idempotency_key`
- optional caller-provided `scope_reference`
- optional caller-provided `request_fingerprint_ref`
- caller-specified replay mode and replay lineage references
- minimal-service submission dispositions `created_new_job` and `resolved_existing_job`
- minimal-service pre-acceptance problem category `idempotency_conflict`

Current source contracts do not express:

- fingerprint profile identity
- service-established effective request fingerprint
- effective scope
- claim-bound comparison record
- full durable claim binding
- durable claim reference
- representability result union
- fingerprint-specific problem literals for reconstruction, representability, immutable-binding mismatch, or collision suspicion

### 5.3 Existing request, job, and replay inventory

Current request, job, and replay shapes already provide:

- `VerificationRequest.idempotency?: VerificationIdempotencyBoundary`
- `VerificationRequest.replay_context?: VerificationReplayContext`
- `VerificationJob.idempotency?: VerificationIdempotencyBoundary`
- `VerificationJob.replay_context?: VerificationReplayContext`
- `VerificationAttempt.replay_context?: VerificationReplayContext`

These fields currently express caller intent, local fixture projection, and
bounded replay lineage. They do not express service-established effective
scope, durable claim identity, or canonical fingerprint authority.

### 5.4 Existing service-response inventory

Current service-boundary response vocabulary already provides:

- a bounded submission envelope
- a resolved-response branch carrying one `VerificationJob`
- a problem-response branch carrying one `VerificationServiceProblem`
- dispositions `created_new_job` and `resolved_existing_job`
- pre-acceptance problem category `idempotency_conflict`

The current service-boundary contract line does not yet freeze:

- fingerprint-specific problem literals
- transport mapping
- visibility mapping
- persistence mapping
- durable claim payloads

## 6. Current Composition-site Inventory

Current type-composition sites are:

- `VerificationRequest` composes evidence-package reference, adapter reference, assurance-profile references, optional idempotency boundary, and optional replay context
- `VerificationJob` reprojects request identity, adapter, profiles, optional idempotency boundary, and optional replay context into the logical job surface
- `VerificationAttempt` composes replay context into per-attempt lineage
- `VerificationJobSubmissionEnvelope` composes `VerificationRequest`, `EvidencePackage`, adapter-manifest candidates, and required mapping capabilities
- `VerificationJobSubmissionResolvedResponse` composes `VerificationRequestReference`, `VerificationJob`, `verification_id`, and `disposition`
- `VerificationJobSubmissionProblemResponse` composes an optional request reference with one bounded service problem
- `buildLocalVerificationJobEnvelopeFixture` composes request, job, attempt, result, report, and usage-record projections
- `buildLocalIdempotencyReplayFixture` composes source envelope, same-logical-job resolution output, replay envelope, and intentional-new-job envelope

These composition sites consume only existing request, job, response, and
lineage shapes. None currently consumes a distinct fingerprint-profile type.

## 7. Current Concrete-consumer Inventory

### 7.1 Concrete fixture consumers

Current concrete fixture consumers are:

- `packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs`
- `packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs`
- `packages/guard-core/src/externalEvidence/localTechnicalUsageRecordFixture.mjs`
- `packages/guard-core/src/externalEvidence/localAdapterManifestSelectionFixture.mjs`
- `packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs`

What they concretely consume today:

- caller-provided request idempotency boundary values
- replay lineage values
- existing adapter and assurance-profile references
- existing logical job, attempt, result, report, and usage-record identities

What they do not concretely consume today:

- service-established effective scope
- service-established effective request fingerprint
- fingerprint profile identity objects
- durable claim DTOs
- representability unions

### 7.2 Concrete verifier consumers

Current concrete verifier consumers are:

- `scripts/verify_external_evidence_type_contract.mjs`
- `scripts/verify_external_evidence_minimal_service_api_type_contract.mjs`
- `scripts/verify_external_evidence_local_idempotency_replay.mjs`
- `scripts/verify_external_evidence_local_verification_job_envelope.mjs`
- `scripts/verify_external_evidence_local_adapter_manifest_selection.mjs`
- `scripts/verify_external_evidence_local_technical_usage_record.mjs`

What they concretely assert today:

- existing exported internal contract shapes remain present
- current submission dispositions and problem categories remain exact
- local idempotency or replay fixture behavior remains stable on current bounded fields
- local fixture composition does not expand into runtime or public export behavior

What they do not concretely assert today:

- JCS conformance
- fingerprint preimage construction
- SHA-256 profile computation
- claim-bound representability outcomes
- durable claim reference shapes

## 8. Eligibility Criteria

This assessment uses the following rules before any candidate can be considered
a stable type gap:

1. the semantics must already be frozen by approved docs
2. the field shape and authority source must already be stable
3. the candidate must not depend on unfinished Authentication or Tenant representation
4. the candidate must not depend on unfinished persistence representation
5. the candidate must not depend on transport mapping
6. the candidate must not just be runtime operational state
7. there must be at least two independent current source consumers, or one already-frozen service-boundary composition that must carry the shape
8. the existing contracts must be unable to safely express the need
9. the type must not falsely imply that runtime implementation already exists
10. the type must not upgrade caller-provided text into canonical authority
11. the type must not expand public API or authority
12. the type must add more value than a documented semantic invariant

This assessment also keeps the following distinctions explicit:

- docs are not source consumers
- contract definitions are not their own consumers
- future expected consumers are not current consumer evidence
- a fixture and its verifier do not automatically count as two independent architecture consumers
- conceptual importance does not equal type-contract necessity
- a normative JSON projection does not automatically justify a TypeScript contract

## 9. Classification Taxonomy

Primary classifications used in this assessment:

- `existing_contract_reuse`
- `documented_semantic_invariant`
- `stable_package_internal_type_gap`
- `stable_service_boundary_type_gap`
- `comment_semantic_alignment_need`
- `fixture_alignment_need`
- `verifier_alignment_need`
- `authentication_tenant_dependency_gap`
- `persistence_representation_gap`
- `transport_mapping_gap`
- `runtime_operational_state`
- `implementation_representation_gap`
- `unresolved_architecture_gap`
- `public_export_not_justified`
- `not_a_type_concern`

Only one primary classification is assigned to each candidate row.

## 10. Candidate Assessment Matrix

| Candidate | Approved semantic source | Current source definition | Current composition site | Current concrete consumers | Stable field shape | Authority source | Cross-consumer evidence | Primary classification | Dependency | New type required now | Existing type change required now | Public export required now | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Fingerprint profile identity | profile proposal sec. 7.5, 8, 20 | none | docs-only | none | pair frozen, carrier not frozen | profile docs | docs only | documented_semantic_invariant | future implementation carriage | no | no | no | semantics are frozen, but no current source consumer carries a new profile object |
| 2. Fingerprint profile name | profile proposal sec. 7.5 | none | docs-only | none | fixed literal | profile docs | docs only | documented_semantic_invariant | none | no | no | no | fixed literal is sufficient until a later carrier is proven necessary |
| 3. Fingerprint profile version | profile proposal sec. 7.5, 20 | none | docs-only | none | fixed literal | profile docs | docs only | documented_semantic_invariant | none | no | no | no | version semantics are frozen without proving a standalone source shape |
| 4. Effective request fingerprint | profile proposal sec. 7.10, 16 | none | future claim and comparison only | none | digest format frozen, source carrier deferred | future service | no current consumer | implementation_representation_gap | service establishment, persistence | no | no | no | there is no current source field or consumer for a service-established fingerprint value |
| 5. Fingerprint algorithm identifier | profile proposal sec. 16 | none | docs-only | none | fixed literal | profile docs | docs only | documented_semantic_invariant | none | no | no | no | SHA-256 is frozen semantically without requiring a current contract field |
| 6. Fingerprint output encoding | profile proposal sec. 16 | none | docs-only | none | fixed literal | profile docs | docs only | documented_semantic_invariant | none | no | no | no | lowercase 64-hex semantics do not need a dedicated source type now |
| 7. Operation namespace | profile proposal sec. 9, 24 | none | future service scope formation | none | semantic role frozen, representation deferred | future service | no current consumer | implementation_representation_gap | auth, service composition | no | no | no | the namespace matters semantically but has no current source carrier |
| 8. Normative canonical projection | profile proposal sec. 10.1, 15 | none | future fingerprint derivation only | none | JSON semantics frozen, source shape not adopted | profile docs | docs only | implementation_representation_gap | canonicalization implementation | no | no | no | the projection is normative text, not a current package contract |
| 9. Canonical projection reference | profile proposal sec. 7.8, 7.9 | none | future claim binding only | none | not frozen as a concrete field set | future service or persistence | none | implementation_representation_gap | persistence, implementation | no | no | no | no current contract consumes a projection-reference shape |
| 10. Canonical projection digest or reference | profile proposal sec. 7.8, 7.9 | none | future claim binding only | none | not frozen as a source field | future service or persistence | none | implementation_representation_gap | persistence, implementation | no | no | no | still a future representation detail rather than a current contract need |
| 11. Canonical evidence-package binding | profile proposal sec. 10.2, 12 | `EvidencePackageReference`, `EvidenceIntegrityReference` | request, report, result, envelope fixtures | request and fixture line | partly | accepted request or service-established binding | existing reference types plus docs | documented_semantic_invariant | future canonical establishment | no | no | no | the semantics are narrower than current reference reuse, but no new type is yet required |
| 12. Canonical evidence digest algorithm | profile proposal sec. 12 | `EvidenceIntegrityReference.digest_algorithm?` | evidence references, fixtures | evidence and report fixtures | yes as a generic field shape | future service-established or independently validated accepted binding | generic field-shape reuse only | existing_contract_reuse | concrete authoritative carrier and consumer | no | no | no | existing generic fields can carry algorithm text, but they do not establish the approved canonical binding or its authority; no new type is justified before a concrete carrier and consumer exist |
| 13. Canonical evidence digest value | profile proposal sec. 12 | `EvidenceIntegrityReference.digest?` | evidence references, fixtures | evidence and report fixtures | yes as a generic field shape | future service-established or independently validated accepted binding | generic field-shape reuse only | existing_contract_reuse | concrete authoritative carrier and consumer | no | no | no | existing generic fields can carry digest text, but they do not establish a service-established canonical evidence digest or its authority; raw, producer-provided, or caller-carried values require future service establishment or independent validation before approved canonical binding |
| 14. Source schema version binding | profile proposal sec. 10.2 | `EvidencePackage.source_schema_version` | full `EvidencePackage` within `VerificationJobSubmissionEnvelope` and relevant local envelope or adapter-selection compositions | envelope, normalization, adapter-selection, or other fixtures and verifiers that consume the full `EvidencePackage`; not `VerificationRequest` through `EvidencePackageReference` | yes | resolved or accepted full `EvidencePackage` binding | existing full-package field reuse | existing_contract_reuse | none | no | no | no | the field exists on full `EvidencePackage`, not on `VerificationRequest.evidence_package: EvidencePackageReference`; no new type is required and the field must not be added to `VerificationRequest` |
| 15. Immutable evidence-package binding reference | profile proposal sec. 12 | `EvidencePackageReference` exists, but it is not an approved immutable canonical binding carrier | current request, job, and report reference surfaces only | consumers of existing `EvidencePackageReference` only; none consumes a distinct immutable canonical binding reference | semantic binding is frozen, but the complete authoritative carrier is not | future service-established or independently validated accepted binding | no current consumer for a distinct immutable canonical binding carrier | implementation_representation_gap | service establishment and implementation or persistence representation | no | no | no | `EvidencePackageReference` lacks `source_schema_version`, does not carry a digest algorithm, and does not encode service-established canonical authority, so it is not a complete immutable canonical binding; this does not prove a new type need now and does not authorize modifying the existing reference |
| 16. Exact selected adapter binding | profile proposal sec. 10.3, 13 | `AdapterManifestReference` | request, job, manifest selection | request, job, manifest-selection fixture | yes | accepted request plus exact manifest selection | existing field reuse | existing_contract_reuse | none | no | no | no | exact adapter pin already exists and is consumed today |
| 17. Immutable adapter manifest binding reference | profile proposal sec. 13 | none distinct from adapter ref | future accepted binding only | none | not frozen as separate carrier | future service or persistence | no current consumer | implementation_representation_gap | persistence, service establishment | no | no | no | no current consumer requires a second reference beyond adapter pin and manifest candidate data |
| 18. Requested assurance-profile binding | profile proposal sec. 10.4, 13 | `AssuranceProfileReference[]` | request, job, envelope, fixtures | request, job, manifest-selection fixture | yes | accepted request | existing field reuse | existing_contract_reuse | none | no | no | no | current request and job contracts already carry requested profile bindings |
| 19. Immutable assurance-profile definition binding reference | profile proposal sec. 13 | none distinct | future accepted binding only | none | no | future service or persistence | no current consumer | implementation_representation_gap | persistence, implementation | no | no | no | current source line does not consume a separate definition-binding reference |
| 20. Canonically ordered assurance-profile set | profile proposal sec. 10.4, 15 | raw request array only | request and manifest-selection fixture | request, fixture, verifier line | ordering rule frozen, carrier unchanged | future service canonicalization | one existing array plus docs | implementation_representation_gap | canonicalization implementation | no | no | no | a sorting rule does not by itself justify a new source contract |
| 21. Claim lookup partition | profile proposal sec. 7.7, 18 | none | future claim lookup only | none | partly | effective scope plus key | no current consumer | authentication_tenant_dependency_gap | auth, tenant, persistence | no | no | no | effective scope is unresolved and claim lookup is not a current source shape |
| 22. Effective scope reference | profile proposal sec. 7.3; auth boundary sec. 5.9, 13 | no effective-scope field; only `scope_reference?` | future claim and authorization path | none | no | future service or independent validation | no current consumer | authentication_tenant_dependency_gap | auth, tenant, scope derivation | no | no | no | the approved baseline explicitly forbids treating `scope_reference` as effective scope |
| 23. Claim-bound comparison record | profile proposal sec. 7.8 | none | future claim resolution only | none | partly | future claim binding | no current consumer | persistence_representation_gap | persistence, auth | no | no | no | it is a persistence-side semantic binding, not a current source contract |
| 24. Full durable claim binding | profile proposal sec. 7.9 | none | future claim resolution only | none | partly | future claim binding | no current consumer | persistence_representation_gap | persistence, auth | no | no | no | the proposal freezes semantics, not a DTO or package carrier |
| 25. Durable claim reference | profile proposal sec. 7.11 | none | future service or persistence only | none | no | future persistence | none | persistence_representation_gap | persistence | no | no | no | no current source consumer needs a durable-claim reference object |
| 26. Accepted logical job binding | profile proposal sec. 7.9, 7.11 | `verification_id` on `VerificationJob` and related refs | job, result, report, usage | multiple existing consumers | yes as identity, no as new bundle | accepted job establishment | existing identity reuse | existing_contract_reuse | none | no | no | no | current job identity surfaces already exist; no new binding wrapper is proven necessary |
| 27. Same-logical-job resolution context | profile proposal sec. 7.12, 18 | local fixture returns `resolution: same_logical_job` | local replay fixture only | local replay fixture and usage fixture | no stable source shape | future resolution engine | one local fixture line only | not_a_type_concern | behavioral decision | no | no | no | this is a resolution outcome concept, not a stable contract shape now |
| 28. Idempotency conflict context | profile proposal sec. 18, 19 | `idempotency_conflict` problem category only | minimal-service problem branch | minimal-service verifier only | current literal yes, richer context no | future service problem mapping | one current service-contract line | not_a_type_concern | transport and runtime mapping | no | no | no | no richer conflict-context shape is frozen yet |
| 29. Created-new-job establishment context | profile proposal sec. 7.13, 18 | `created_new_job` disposition only | minimal-service resolved branch | minimal-service verifier only | current literal yes, richer context no | future service establishment | one current service-contract line | not_a_type_concern | persistence and runtime behavior | no | no | no | disposition exists; deeper establishment context is still behavioral |
| 30. No-boundary submission context | profile proposal sec. 7.13, 18 | omission of `idempotency` | request, service semantics | request and local fixtures | yes as omission rule | accepted request semantics | existing omission semantics | not_a_type_concern | none | no | no | no | omission semantics are already expressed without a new shape |
| 31. Claim-bound profile representability result | profile proposal sec. 7.12, 20 | none | future claim resolution only | none | no | future comparison engine | no current consumer | runtime_operational_state | profile registry and comparison runtime | no | no | no | representability is currently a fail-closed decision, not a stable source contract |
| 32. Active profile identity | profile proposal sec. 20 | none | future profile registry only | none | partly | future service registry | no current consumer | implementation_representation_gap | runtime registry | no | no | no | there is no current source consumer for an active-profile registry record |
| 33. Existing claim profile identity | profile proposal sec. 7.8, 20 | none | future persistence lookup only | none | partly | future claim binding | no current consumer | persistence_representation_gap | persistence | no | no | no | bound profile identity belongs to future claim representation, not current source contracts |
| 34. Profile reconstruction availability | profile proposal sec. 20 | none | future comparison engine only | none | no | future runtime | no current consumer | runtime_operational_state | runtime and persistence recovery | no | no | no | availability to reconstruct old profile semantics is a behavioral check |
| 35. Profile-upgrade compatibility result | profile proposal sec. 20 | none | future comparison engine only | none | no | future runtime | no current consumer | runtime_operational_state | runtime, registry | no | no | no | upgrade compatibility is a decision outcome, not a stable source shape now |
| 36. Immutable-binding consistency result | profile proposal sec. 7.12, 18 | none | future claim resolution only | none | no | future service or persistence validation | no current consumer | runtime_operational_state | runtime, persistence | no | no | no | it is a comparison result rather than a reusable data contract today |
| 37. Collision-suspicion result | profile proposal sec. 21 | none | future failure handling only | none | no | future runtime | no current consumer | runtime_operational_state | runtime failure handling | no | no | no | collision handling remains fail-closed semantics, not a current type need |
| 38. Attempt-specific replay fingerprint binding | profile proposal sec. 10.5, 14 | no dedicated field | replay context plus future fingerprint derivation | none | no | future service | no current consumer | implementation_representation_gap | future implementation | no | no | no | current replay contracts carry lineage only, not fingerprint binding |
| 39. Replay source verification reference | profile proposal sec. 10.5, 14 | `source_verification_id?` | `VerificationReplayContext` | replay fixture and verifier | yes | caller-provided replay lineage | existing field reuse | existing_contract_reuse | none | no | no | no | current source contract already carries this reference |
| 40. Replay source attempt reference | profile proposal sec. 10.5, 14 | `source_verification_attempt_id?` | `VerificationReplayContext` | replay fixture and verifier | yes | caller-provided replay lineage | existing field reuse | existing_contract_reuse | none | no | no | no | current source contract already carries this reference |
| 41. Authorization-before-lookup invariant | profile proposal sec. 18; auth boundary sec. 14 | none | future service boundary only | none | no stable field set | future auth service | docs only | authentication_tenant_dependency_gap | auth, tenant, concealment | no | no | no | invariant is approved, but no current type shape is frozen for it |
| 42. Visibility-before-resolution invariant | profile proposal sec. 7.12, 18; auth boundary sec. 15 | none | future retrieval and resolution only | none | no stable field set | future auth service | docs only | authentication_tenant_dependency_gap | auth, tenant, visibility | no | no | no | this is a security-ordering invariant, not a current shape |
| 43. Cross-tenant resolution prohibition | profile proposal sec. 18, 23; auth boundary sec. 21 | none | future lookup and concealment only | none | no | future auth and tenant boundary | docs only | authentication_tenant_dependency_gap | auth, tenant | no | no | no | prohibition is frozen semantically without proving a new contract shape |
| 44. Caller fingerprint reference | profile proposal sec. 7.4, 17 | `request_fingerprint_ref?` | request, job, replay fixture | request, job, replay fixture, replay verifier | yes as caller text | caller-provided | existing field reuse | existing_contract_reuse | comment alignment | no | no | no | the current field exists; the need is semantic clarification, not a new type |
| 45. Caller scope reference | profile proposal sec. 7.2; auth boundary sec. 7, 13 | `scope_reference?` | request, job, replay fixture | request, job, replay fixture, replay verifier | yes as caller text | caller-provided | existing field reuse | existing_contract_reuse | comment alignment | no | no | no | the current field exists; the unresolved issue is non-authoritative semantics, not type absence |
| 46. `VerificationIdempotencyBoundary` sufficiency | profile proposal sec. 25; verificationTypes | existing interface | request and job surfaces | multiple existing consumers | yes for caller boundary | caller-provided | request, job, fixture, verifier | existing_contract_reuse | comment alignment | no | no | no | current shape remains sufficient as caller intent and should not be upgraded silently |
| 47. `VerificationRequest` sufficiency | profile proposal sec. 25; minimal-service proposal | existing interface | request, envelope, fixtures | multiple existing consumers | yes for caller submission | caller-provided plus accepted-request semantics | broad current reuse | existing_contract_reuse | none | no | no | no | request should not absorb service-established effective scope or fingerprint now |
| 48. `VerificationReplayContext` sufficiency | profile proposal sec. 14, 25 | existing interface | request, job, attempt, replay fixture | multiple current consumers | yes for lineage | caller-provided replay lineage | existing reuse | existing_contract_reuse | comment alignment | no | no | no | current replay context remains sufficient for lineage without adding fingerprint authority |
| 49. `VerificationJobSubmissionDisposition` sufficiency | profile proposal sec. 18, 25 | `created_new_job \| resolved_existing_job` | resolved response branch | minimal-service verifier | yes | future service response | one service-boundary line | existing_contract_reuse | none | no | no | no | the approved profile sharpens semantics without proving new disposition literals |
| 50. `VerificationServiceProblem` sufficiency | profile proposal sec. 18, 22; minimal service API | generic problem shape | problem response branch | minimal-service verifier | yes for current bounded categories | future service response | one service-boundary line | existing_contract_reuse | transport mapping deferred | no | no | no | no new fingerprint-specific problem literal is frozen yet |
| 51. `VerificationJobSubmissionResponse` sufficiency | profile proposal sec. 18, 22 | existing job-or-problem union | submission response branch | minimal-service verifier | yes | future service response | one service-boundary line | existing_contract_reuse | transport mapping deferred | no | no | no | the current union remains sufficient until a later boundary freezes richer problem detail |
| 52. Existing JSDoc or comment alignment need | profile proposal sec. 17, 25; auth boundary sec. 7, 13 | limited source comments on authority boundaries | verification type definitions | not applicable to comment alignment | yes for need, no new shape | approved docs | not applicable to comment alignment; no current source-shape consumer evidence is required or claimed | comment_semantic_alignment_need | one-file follow-up | no | no | no | existing source wording creates a misreading risk against the approved semantic boundary; future readers or maintainers do not satisfy type eligibility, and this comment issue does not prove a new type gap |
| 53. Local idempotency or replay fixture alignment need | profile proposal sec. 5, 25 | current fixture compares broader equality set | local replay fixture | replay fixture and replay verifier | yes for need, no new shape | approved docs vs local proof line | one local fixture line | fixture_alignment_need | separate assessment or fixture work | no | no | no | current fixture is bounded but not a conformance implementation for the approved profile |
| 54. Type-contract verifier alignment need | profile proposal sec. 25; verify scripts | current focused verifiers assert existing contracts only | focused verify scripts | maintainers and CI | yes for need, no new shape | approved docs vs verifier scope | one verifier line | verifier_alignment_need | separate verifier task | no | no | no | later conformance checks may be needed after a separate approved alignment phase |
| 55. Public export need | current `index.ts`; prior assessments | no external-evidence boundary exports | none | no external consumers in evidence | no | repo export boundary | no consumer evidence | public_export_not_justified | external consumer evidence absent | no | no | no | nothing in this assessment justifies exposing fingerprint-boundary helpers publicly |

## 11. Fingerprint Profile Identity

Fingerprint profile identity is semantically frozen as `(profile name, profile
version)`, but there is no current package-internal or service-boundary source
consumer that needs a dedicated carrier for that pair.

Current evidence:

- no field in `verificationTypes.ts` carries a profile identity object
- no field in `minimalServiceApiTypes.ts` carries a profile identity object
- no current fixture or verifier consumes such an object
- introducing one now would suggest a profile registry or claim-binding representation that does not yet exist

Conclusion:

- classification remains `documented_semantic_invariant`
- no new type is required now

## 12. Effective Request Fingerprint

The approved semantics sharply distinguish:

- caller `request_fingerprint_ref`
- service-established effective request fingerprint

Current evidence:

- the only current source field is `request_fingerprint_ref?`
- current local fixture equality compares that caller reference directly
- no current source contract carries a service-established fingerprint value
- no current package consumer computes or validates the approved profile digest

Conclusion:

- no current type gap is proven
- the need is separation discipline, not a new field today
- follow-up comment and fixture alignment are more justified than new type introduction

## 13. Canonical Projection

The canonical comparison projection is normatively frozen by docs, but:

- no implementation exists
- no current package consumer constructs the JCS projection
- no current verifier asserts JCS profile conformance
- no current source contract reuses a shared projection object

Conclusion:

- classification remains `implementation_representation_gap`
- the normative projection should remain a documented invariant rather than a copied source declaration

## 14. Canonical Evidence Binding

The profile proposal freezes evidence-binding semantics, but current source
contracts only provide bounded, non-authoritative pieces:

- `EvidencePackageReference` carries package identity plus optional digest or
  integrity reference text, but lacks `source_schema_version`, a digest
  algorithm, and any canonical-authority discriminator
- `EvidenceIntegrityReference.digest?` and `digest_algorithm?` are generic
  optional field shapes, not approved canonical evidence authority
- `EvidencePackage.source_schema_version` exists only on the full
  `EvidencePackage` carried by `VerificationJobSubmissionEnvelope` and
  relevant full-package fixture compositions; it is not carried by
  `VerificationRequest.evidence_package`

Raw, producer-provided, or caller-carried digest values cannot enter an
approved canonical binding until a future service establishes them or an
independent process validates them. No current reference encodes an immutable,
service-established accepted binding, and field-shape reuse does not imply
runtime or binding implementation.

Conclusion:

- existing contract reuse plus documented invariants remain sufficient
- the complete authoritative carrier remains an implementation or persistence representation gap
- `EvidencePackageReference` must not be modified by this assessment
- no new canonical evidence-binding type is required now

## 15. Adapter and Assurance-profile Binding

Current request and job contracts already carry:

- exact adapter ID and version
- requested assurance-profile IDs and versions

Current manifest-selection fixture already proves:

- exact adapter ID and version matching
- explicit support for each requested assurance profile
- exact capability declaration checks

What remains deferred:

- immutable accepted manifest-binding reference
- immutable assurance-profile definition binding reference
- canonical profile-set ordering as implementation behavior

Conclusion:

- existing request and fixture contracts are sufficient now
- no new binding type is required now

## 16. Claim Lookup Partition

Claim lookup partition is semantically frozen as:

`effective scope + idempotency key`

But the current repository still lacks:

- service-established effective scope representation
- persistence claim representation
- any current source consumer for claim lookup keys

Conclusion:

- classification is `authentication_tenant_dependency_gap`
- no type should be created before the Authentication or Tenant and persistence dependencies are frozen in source form

## 17. Claim-bound Comparison Record

The approved comparison record concept is:

`fingerprint profile identity + effective request fingerprint + immutable canonical request binding or reference`

Current repository state:

- no source field carries this record
- no fixture consumes this record
- no verifier asserts this record
- the record concept depends on future durable claim resolution and immutable accepted-request binding

Conclusion:

- classification is `persistence_representation_gap`
- no package-internal or service-boundary type is required now

## 18. Full Durable Claim Binding

The approved full durable claim binding adds:

- effective scope
- idempotency key
- fingerprint profile identity
- effective request fingerprint
- immutable canonical request binding or reference
- accepted logical job identity

Current repository state:

- `verification_id` already exists
- the rest remains semantic, not source-carried
- no database row, storage key, or transaction object is authorized here

Conclusion:

- classification is `persistence_representation_gap`
- no current type gap is proven

## 19. Representability

Representability currently behaves like a fail-closed decision rule, not a
stable data contract.

Current evidence:

- no current source union exists for representability outcomes
- no fixture produces a representability result object
- no verifier consumes a representability result object
- representability depends on bound-profile reconstruction and comparison under future runtime or persistence logic

Conclusion:

- classification is `runtime_operational_state`
- no representability type is required now

## 20. Resolution Vocabulary

Current bounded vocabulary already includes:

- `created_new_job`
- `resolved_existing_job`
- `idempotency_conflict`

What the approved profile adds is sharper semantics for when those outcomes are
valid, not a currently frozen new problem literal set.

Current evidence:

- exact mapping for representability failure is still deferred
- exact mapping for collision suspicion is still deferred
- exact mapping for immutable-binding mismatch is still deferred
- exact mapping for profile reconstruction failure is still deferred

Conclusion:

- existing minimal-service response types remain sufficient now
- no new service-boundary type gap is proven

## 21. Replay Binding

Current replay contracts already carry:

- replay mode
- source verification ID
- source verification attempt ID

The approved profile adds attempt-specific fingerprint semantics, but current
source evidence still shows:

- replay context is lineage-only
- current fixture explicitly rejects boundary reuse
- no current source consumer carries replay fingerprint binding

Conclusion:

- `VerificationReplayContext` remains sufficient now
- no new replay-binding type is required now

## 22. Existing Contract Sufficiency

### 22.1 `VerificationIdempotencyBoundary`

Current shape:

- `idempotency_key`
- optional `scope_reference`
- optional `request_fingerprint_ref`

Assessment:

- sufficient for caller submission intent
- insufficient only if misread as canonical authority
- needs comment alignment, not a new field

### 22.2 `VerificationRequest`

Assessment:

- sufficient for caller submission
- should not absorb service-established effective scope or fingerprint
- should not become a durable-claim DTO

### 22.3 `VerificationReplayContext`

Assessment:

- sufficient for replay mode and lineage
- should not be widened into fingerprint, authorization, or effective-scope context without later evidence

### 22.4 Minimal service API contracts

Assessment:

- current dispositions remain sufficient
- current bounded problem categories remain sufficient
- exact transport or persistence mapping is still deferred

## 23. Comment Alignment

Comment-alignment need exists, but it does not justify a new type.

Specific risks:

- `request_fingerprint_ref` could be misread as canonical fingerprint
- `scope_reference` could be misread as effective scope
- replay context could be misread as broader authorization or fingerprint context
- idempotency boundary could be misread as a complete durable claim

Assessment outcome:

- primary classification: `comment_semantic_alignment_need`
- the need is supported by misreading risk between current source wording and the approved semantic boundary
- no current source-shape consumer evidence is required or claimed for comment alignment
- future readers or maintainers are not current consumer evidence and do not satisfy type eligibility
- docs are semantic authority inputs here, not source consumers
- comment alignment requires separate authorization
- the comment issue does not prove a new type gap
- no source type change authorized now
- recommended treatment: one narrow follow-up focused on comment semantics only

## 24. Fixture and Verifier Alignment

Fixture-alignment need exists because the current local replay proof still
compares:

- `request_id`
- `caller_reference`
- `evidence_package`
- `adapter`
- `requested_assurance_profiles`
- full caller idempotency boundary text

That broader local equality line is still valid as a bounded local proof, but
it is not the same thing as the approved fingerprint profile.

Verifier-alignment need exists because the current focused verifiers still
prove:

- existing type presence
- current literal stability
- bounded local fixture behavior

They do not yet prove:

- fingerprint profile conformance
- JCS serialization conformance
- SHA-256 profile derivation conformance

Assessment outcome:

- fixture alignment is a separate bounded task
- verifier alignment is a separate bounded task
- neither need proves a type gap by itself

## 25. Public-export Review

Current export boundary evidence:

- `packages/guard-core/src/index.ts` exports no external-evidence boundary helper or contract surface
- current focused verifiers explicitly protect against boundary-export drift
- no external consumer evidence was found for a public fingerprint contract

Conclusion:

- public export remains unjustified
- any future internal need must not be auto-promoted into public API

## 26. Dependency Analysis

### 26.1 Authentication or Tenant dependencies

The following remain blocked on Authentication or Tenant boundary work:

- effective scope establishment
- authorization-before-lookup ordering
- visibility-before-resolution ordering
- cross-tenant concealment
- current-authorization requirement for same-job resolution

### 26.2 Persistence dependencies

The following remain blocked on persistence representation:

- durable claim reference
- claim-bound comparison record representation
- full durable claim binding representation
- accepted immutable canonical request binding storage shape
- old-profile reconstruction source

### 26.3 Transport dependencies

The following remain blocked on transport mapping:

- fingerprint-specific problem encoding
- exact error surface for reconstruction or representability failure
- concealment behavior details

### 26.4 Runtime dependencies

The following remain blocked on runtime implementation:

- JCS construction
- SHA-256 derivation
- canonical profile ordering enforcement
- active-profile registry handling
- representability and collision evaluation

## 27. Stable-gap Summary

Stable package-internal type gaps:
`none`

Stable service-boundary type gaps:
`none`

Why none are proven:

- current contracts already cover caller intent, replay lineage, job identity, and current service response vocabulary
- current generic digest fields provide bounded field-shape reuse without establishing canonical evidence authority
- `EvidencePackageReference` is not a complete immutable canonical binding carrier
- no current consumer consumes a service-established fingerprint value
- no current consumer consumes a distinct immutable canonical evidence-package binding carrier
- no current consumer consumes a durable claim shape
- most missing concepts still depend on Authentication or Tenant, persistence, transport, or runtime decisions
- the remaining concrete needs are semantic alignment tasks, not stable shape gaps

## 28. Primary Decision Rationale

`EXISTING_CONTRACTS_SUFFICIENT_WITH_SEPARATE_ALIGNMENT_WORK` is the narrowest
accurate conclusion because:

- no candidate satisfied the stable type-gap criteria
- the current source line already safely carries caller idempotency intent and replay lineage
- the current service-boundary line already safely carries the bounded submission outcomes
- current evidence reference fields can be reused only as generic bounded field shapes, not as proof of canonical authority or a complete immutable accepted binding
- the main remaining risks come from semantic interpretation drift, especially around caller references and local fixture expectations
- solving those risks does not require introducing new types now
- introducing fingerprint-profile, effective-fingerprint, claim, or representability types now would create false stability and would blur the line between approved semantics and unapproved implementation

## 29. Following-phase Routing

Recommended next phase:

`Local Idempotency Fixture Semantic Alignment Assessment v0.1`

Reason:

- the most concrete current divergence risk is between the approved profile semantics and the broader equality line in the local replay fixture
- this follow-up can stay bounded, additive, and reviewable
- it can separate fixture-proof scope from future profile-conformance scope without authorizing runtime implementation
- it is narrower and better supported by current evidence than jumping directly to fingerprint implementation, service runtime, transport, or new type creation

Not recommended directly from this assessment:

- fingerprint implementation
- hash spike
- persistence implementation
- service runtime
- HTTP API work
- auth or tenant implementation

## 30. Acceptance Criteria

- assessment-only: yes
- docs-only: yes
- exactly one new document: yes
- no source type: yes
- no existing type modification: yes
- no fixture modification: yes
- no verifier modification: yes
- no package change: yes
- no public export expansion: yes
- approved fingerprint proposal preserved: yes
- profile identity candidate assessed: yes
- effective fingerprint candidate assessed: yes
- canonical projection candidate assessed: yes
- canonical evidence binding candidate assessed: yes
- adapter and profile binding candidates assessed: yes
- claim lookup partition candidate assessed: yes
- claim-bound record candidate assessed: yes
- full durable claim candidate assessed: yes
- representability candidate assessed: yes
- resolution vocabulary candidate assessed: yes
- replay binding candidate assessed: yes
- comment alignment assessed: yes
- fixture or verifier alignment assessed: yes
- public export assessed: yes
- candidate count at least 55: yes
- each candidate has one primary classification: yes
- current and future consumers distinguished: yes
- docs not treated as source consumers: yes
- definitions not treated as consumers: yes
- no conceptual-importance shortcut: yes
- primary decision unique: yes
- confidence stated: yes
- stable package-internal gaps stated: yes
- stable service-boundary gaps stated: yes
- comment-alignment needs stated: yes
- fixture-alignment needs stated: yes
- public export decision stated: yes
- runtime implementation authorized: no
- following phase unique: yes
- no auth or tenant implementation: yes
- no persistence implementation: yes
- no transport implementation: yes
- no runtime implementation: yes
- no authority expansion: yes

This assessment does not authorize type, fixture, verifier, authentication,
tenant, persistence, transport, or runtime implementation.
