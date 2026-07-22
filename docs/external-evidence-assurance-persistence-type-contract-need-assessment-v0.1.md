# External Evidence Assurance Persistence Type-contract Need Assessment v0.1

## 1. Status

- Status: `assessment-only`
- Scope: `docs-only`
- Type implementation: `none`
- Persistence implementation: `none`
- Decision posture: `evidence-driven and non-presumptive`
- Authority status: `no authority expansion`

This assessment is not:

- a type specification
- a TypeScript proposal
- a source-code authorization
- a database schema
- a persistence implementation
- a storage-adapter design
- an API expansion
- an Authentication/Tenant design
- a runtime-readiness declaration
- a production-readiness declaration

## 2. Executive Decision

Primary decision:
`EXISTING_CONTRACTS_SUFFICIENT_FOR_NEXT_PHASE`

Confidence:
`high`

Current type implementation required:
`no`

Blocking dependencies:
`none for proceeding to the next docs-only architecture phase; unresolved dependencies still block future persistence type hardening`

Authorized next architecture phase:
`Authentication and Tenant Boundary Proposal v0.1`

Runtime implementation authorized:
`no`

The unresolved dependencies for Authentication/Tenant, effective scope,
effective canonical fingerprint, completion lineage, usage atomicity, and
retention/deletion semantics do not block progression into the next docs-only
architecture phase. They do still block any later persistence type hardening,
and their unresolved status does not imply that runtime persistence conditions
have been frozen or that runtime persistence implementation is authorized.

## 3. Question Being Assessed

Question:

```text
Do the persistence semantics approved in
External Evidence Assurance Persistence Boundary Proposal v0.1
require new type-only contracts now?
```

Assessment answer:

- no new persistence-specific type-only contract is required now
- the existing artifact contracts plus documented invariants are sufficient for the next architecture phase only
- the remaining gaps are dominated by deferred dependency decisions, implementation-representation concerns, or runtime-only operational state

This sufficiency judgment applies only to progression into the next docs-only
architecture phase. It is not a sufficiency judgment for runtime persistence
implementation, transport implementation, Authentication/Tenant
implementation, or production readiness. It also does not permanently reject
future persistence-specific types; those must be reassessed whenever the
documented reassessment triggers are satisfied.

## 4. Current Contract Inventory

### 4.1 Existing domain and artifact contracts

- `EvidencePackage` and `EvidencePackageReference`
- `AdapterManifestReference` and `AdapterManifest`
- `AssuranceProfileReference` and `AssuranceProfile`
- `VerificationIdempotencyBoundary`
- `VerificationReplayContext`
- `VerificationRequest` and `VerificationRequestReference`
- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `AssuranceReport`
- `RetentionClassReference`
- `VerificationUsageRecord`

### 4.2 Existing service-API composition contracts

- `VerificationJobSubmissionEnvelope`
- `VerificationJobSubmissionDisposition`
- `VerificationArtifactAvailability`
- `VerificationServiceProblem`
- `VerificationJobSubmissionResponse`

These are package-internal type-only service-boundary compositions. They are not persistence contracts.

### 4.3 Existing caller-provided references

- `request_id`
- `caller_reference`
- `scope_reference`
- `request_fingerprint_ref`
- `package_id`
- adapter ID and exact adapter version
- requested assurance-profile references

### 4.4 Existing role-specific service-generated identities

- `verification_id`
- `verification_attempt_id`
- `verification_job_result_id`
- `report_id`
- `usage_record_id`

### 4.5 Existing local-only fixtures and proofs

- local verification-job envelope fixture
- local idempotency and replay fixture
- local technical-usage fixture
- local adapter-manifest selection fixture
- assurance-report integrity and composition fixtures

These fixtures prove local deterministic semantics. They do not freeze persistence representation.

## 5. Existing Public-export Boundary

- `packages/guard-core/src/index.ts` does not export the external-evidence contracts
- `minimalServiceApiTypes.ts` is intentionally package-internal
- no persistence-specific contract is publicly exported
- no current producer integration is allowed to depend on storage representation

Conclusion:

- any future persistence binding, if ever needed, should default to package-internal visibility
- there is no evidence in the current repository that public export is required

## 6. Persistence Proposal Semantic Inventory

The persistence proposal adds or sharpens semantic expectations around:

- durable job establishment
- service-established effective idempotency scope
- service-established effective canonical fingerprint
- immutable accepted-request recoverability
- immutable selected-manifest recoverability
- logical atomicity between idempotency claim and job establishment
- canonical completed resource-set consistency
- completion lineage consistency
- staged or orphan artifact invisibility
- retention and deletion consistency
- storage-representation neutrality
- recovery and reconciliation constraints

Most of these are semantic boundaries, not immediately type-shaped cross-boundary records.

## 7. Type-contract Eligibility Criteria

A candidate is eligible for a new type-only contract only if all of the following hold:

1. it is a stable domain or service-boundary semantic
2. it is not a database, storage, migration, or serialization detail
3. it must cross a stable boundary or be consumed consistently by at least two independent consumers
4. existing contracts cannot already express it without ambiguity
5. documentation alone cannot safely prevent semantic drift
6. identity, scope, lifecycle, and version semantics are already frozen
7. it does not depend on unresolved Authentication/Tenant behavior
8. it does not depend on unresolved fingerprint composition or canonicalization
9. it does not depend on unresolved retention, deletion, or tombstone behavior
10. adding it does not create a runtime-readiness or authority-expansion illusion
11. it can remain producer-neutral and storage-technology-neutral
12. it can remain outside public export unless cross-boundary evidence proves otherwise

If any of these fail, the preferred action is:

- reuse an existing type
- keep the rule as a documented invariant
- defer the decision
- or model it later inside an implementation-only boundary

## 8. Gap Classification Framework

This assessment uses the following categories:

- `no_gap`
- `comment_or_documentation_gap`
- `behavioral_invariant`
- `stable_type_shape_gap`
- `implementation_representation_gap`
- `unresolved_architecture_gap`
- `auth_or_tenant_dependent_gap`
- `runtime_operational_gap`

Interpretation rules:

- `behavioral_invariant` means the missing piece is primarily a semantic rule, not a data shape
- `implementation_representation_gap` means the remaining choice is about snapshot, lookup, storage, or internal record form
- `auth_or_tenant_dependent_gap` means a correct type cannot be frozen before Authentication/Tenant rules
- `runtime_operational_gap` means the concern belongs to reconciliation, recovery, queueing, retry, or hidden internal state rather than a stable domain contract

## 9. Candidate Assessment Matrix

| Candidate | Existing contract coverage | Missing semantics | Gap classification | Stable enough for type now? | Authentication/Tenant dependency | Fingerprint dependency | Retention/deletion dependency | Public/service/internal relevance | Recommended action | Evidence and rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Effective idempotency scope | `VerificationIdempotencyBoundary.scope_reference` as caller hint | canonical service-established scope | `auth_or_tenant_dependent_gap` | no | yes | no | no | service/internal | defer to Authentication/Tenant phase | proposal states caller text is not canonical scope and may depend on identity, credential, or tenant boundary |
| Effective canonical fingerprint | `request_fingerprint_ref` as caller reference | canonical service-established comparison value | `unresolved_architecture_gap` | no | no | yes | no | service/internal | defer to fingerprint-profile decision | composition, canonicalization, encoding, and hash rules remain unfrozen |
| Durable idempotency claim | caller intent plus job idempotency field | canonical persisted claim binding scope, key, fingerprint, and job | `unresolved_architecture_gap` | no | yes | yes | yes | service/internal | defer; do not add claim type now | depends on both effective scope and effective fingerprint plus expiry policy |
| Immutable accepted-request representation | `VerificationRequest` and `VerificationRequestReference` | immutable durable recoverability semantics | `implementation_representation_gap` | no | possible | possible | yes | internal/service | reuse `VerificationRequest`; keep invariant documented | missing choice is snapshot versus canonical form versus content-addressed reference, not a stable new domain shape |
| Selected `AdapterManifest` snapshot or content binding | `AdapterManifest` and `AdapterManifestReference` | exact historical manifest recoverability | `implementation_representation_gap` | no | no | possible | yes | internal/service | reuse existing manifest contracts; keep invariant documented | exact selected content is required, but storage form is still an internal representation decision |
| Durable job-establishment bundle | `VerificationRequest`, `EvidencePackage`, `AdapterManifest`, `VerificationJob` | logical atomic establishment boundary | `behavioral_invariant` | no | yes | yes | yes | service/internal | keep as documented invariant | bundle is a consistency rule across existing artifacts, not a proven cross-boundary record type |
| `VerificationJob` persistence projection | `VerificationJob` | storage-specific durable projection details | `implementation_representation_gap` | no | no | no | yes | internal | reuse `VerificationJob`; do not duplicate as storage DTO | current job contract already expresses the logical job; duplication would masquerade storage shape as domain contract |
| `VerificationAttempt` persistence projection | `VerificationAttempt` | storage-specific durable projection details | `implementation_representation_gap` | no | no | no | yes | internal | reuse `VerificationAttempt`; do not duplicate as storage DTO | same reasoning as job projection; remaining work is mutation and publication discipline |
| Attempt transition history | attempt identity and status exist | durable transition-history model | `runtime_operational_gap` | no | no | no | yes | internal | defer to runtime design | transition history is not yet a stable cross-boundary consumer need |
| Completion-publication bundle | `VerificationJobResultRecord` plus `AssuranceReport` plus job status | publication atomicity across completed set | `behavioral_invariant` | no | no | no | yes | service/internal | keep as documented invariant | missing rule is joint publication consistency, not a missing artifact shape |
| Canonical completed resource set | job, result, report, optional final attempt references | explicit completed-set binding semantics | `behavioral_invariant` | no | no | no | yes | service/internal | keep as documented invariant | current artifacts already exist; missing piece is consistency requirement |
| Completion lineage | optional `verification_attempt_id` on result plus replay lineage | minimum immutable lineage when no attempt ID is present | `unresolved_architecture_gap` | no | no | no | yes | service/internal | defer pending lineage freeze | proposal leaves no-attempt-ID completion lineage explicitly unresolved |
| Technical usage publication binding | `VerificationUsageRecord` with result reference and terminal outcome | whether usage is in the same atomic publication boundary | `unresolved_architecture_gap` | no | no | no | yes | service/internal | defer atomicity decision; reuse current usage type | type already exists; unresolved question is publication timing and atomicity |
| Published-artifact marker | availability model and publication prose | exact marker semantics for "published" | `behavioral_invariant` | no | possible | no | yes | service/internal | keep as documented invariant | proposal defines publication semantically; no separate stable consumer type is proven |
| Staged or orphan artifact state | proposal prose only | hidden internal incomplete-state modeling | `runtime_operational_gap` | no | no | no | yes | internal | defer to runtime/reconciliation design | staged and orphan artifacts must stay hidden and are not public-domain artifacts |
| Retention class | `RetentionClassReference` and `retention_tier_ref` | no frozen duration or behavior semantics | `no_gap` | no new type needed | no | no | yes | internal/service | reuse existing opaque retention reference | current repo already has an opaque retention reference; missing pieces are policy decisions, not type shape |
| Deletion or tombstone state | none beyond proposal prose | deletion visibility and tombstone semantics | `auth_or_tenant_dependent_gap` | no | yes | no | yes | service/internal | defer; no tombstone type now | deletion visibility interacts with future `not_found`, visibility, and completed-set consistency |
| Storage representation version | existing artifact schema versions | storage-internal representation versioning | `implementation_representation_gap` | no | no | no | no | internal | defer to runtime persistence design | storage version is a migration concern, not a stable domain contract |
| Consistency-conflict representation | proposal prose only | explicit shape for referential inconsistency | `unresolved_architecture_gap` | no | possible | no | yes | internal/service | defer until retrieval and deletion semantics freeze | current repo has not frozen whether this is internal-only or caller-visible |
| Recovery or reconciliation state | proposal prose only | crash-recovery and repair modeling | `runtime_operational_gap` | no | no | no | yes | internal | defer to runtime design | recovery does not yet cross a stable consumer boundary |
| Idempotency retention expiry | idempotency intent exists | expiry semantics for dedupe claim | `unresolved_architecture_gap` | no | yes | yes | yes | service/internal | defer | expiry changes job-resolution meaning and depends on retention policy |
| Raw-evidence availability for replay | evidence identity and digest plus replay context | durable replay availability guarantee after raw-payload loss | `unresolved_architecture_gap` | no | no | possible | yes | service/internal | keep as documented invariant; reassess after retention model | current contracts express evidence identity and replay lineage, but not replay availability guarantee |

## 10. Effective Idempotency Scope

Current coverage:

- `scope_reference` is an optional caller-provided reference
- it can express caller intent or correlation
- it cannot safely express canonical effective scope

Assessment:

- caller intent and canonical scope are not the same semantic
- canonical effective scope may depend on caller identity, tenant isolation, explicit scope intent, or credential-bound rules
- freezing a new type now would falsely imply those decisions already exist

Decision:

- classify as `auth_or_tenant_dependent_gap`
- do not create a new effective-scope contract now
- keep the current caller-intent field and revisit only after Authentication/Tenant semantics are approved

## 11. Effective Canonical Fingerprint

Current coverage:

- `request_fingerprint_ref` is only a caller-provided reference
- current types do not claim it is authoritative

Assessment:

- the repository has no frozen fingerprint profile
- canonicalization, composition, encoding, and hash rules remain explicitly deferred
- a string-shaped placeholder would create false confidence without solving semantic ambiguity

Decision:

- classify as `unresolved_architecture_gap`
- do not create a fingerprint contract now
- reassess after a dedicated fingerprint-profile decision freezes the actual comparison semantics

## 12. Accepted-request Representation

Current coverage:

- `VerificationRequest` already expresses the accepted request shape
- `VerificationRequestReference` already expresses role-specific linkage

Assessment:

- the missing requirement is immutable durable recoverability
- the unresolved choice is full snapshot versus canonical representation versus content-addressed reference
- metadata retention and redaction rules are also still unfrozen

Decision:

- classify as `implementation_representation_gap`
- reuse `VerificationRequest`
- keep immutable accepted-request semantics as a documented invariant rather than freezing a new persistence-specific request type

## 13. Selected-manifest Binding

Current coverage:

- `AdapterManifestReference` expresses the pinned adapter ID and version
- `AdapterManifest` expresses the exact selected manifest content

Assessment:

- the remaining requirement is exact historical recoverability for the selected manifest
- the unresolved choice is snapshot versus immutable content-addressed recovery
- candidate-set digest and related fingerprint interactions remain unfrozen

Decision:

- classify as `implementation_representation_gap`
- reuse `AdapterManifest` and `AdapterManifestReference`
- do not add a selected-manifest-binding type now

## 14. Durable Job Establishment

Current coverage:

- the component artifacts already exist
- local fixtures already prove deterministic envelope composition

Assessment:

- the real missing piece is logical atomicity across existing artifacts
- there is no evidence of two independent consumers needing a separate cross-boundary "job establishment record"
- a new record type would likely be a disguised storage bundle

Decision:

- classify as `behavioral_invariant`
- keep the durable-establishment rule documented
- do not introduce a persistence bundle type

## 15. Canonical Idempotency Claim

Current coverage:

- caller intent is represented by `VerificationIdempotencyBoundary`
- job-level carry-through exists on `VerificationJob.idempotency`

Assessment:

- canonical claim semantics depend on effective scope and canonical fingerprint
- expiry and conflict semantics also depend on retention and lifecycle decisions
- caller intent type and persisted canonical claim should not be assumed to be the same type before dependencies freeze

Decision:

- classify as `unresolved_architecture_gap`
- no new claim type now
- reassess only after Authentication/Tenant, fingerprint profile, and idempotency-retention decisions are frozen

## 16. Job and Attempt Persistence

Current coverage:

- `VerificationJob` already separates job lifecycle from result, usage, and report references
- `VerificationAttempt` already separates per-attempt identity and lifecycle

Assessment:

- persistence proposal mainly adds conditional-update, finality, and publication invariants
- it does not expose a proven new stable public shape for either job or attempt persistence projections
- duplicating these as storage DTOs would be a clear anti-pattern

Decision:

- classify both persistence projections as `implementation_representation_gap`
- reuse existing job and attempt contracts
- keep transition and publication discipline as documented invariants

## 17. Completion Publication and Lineage

Current coverage:

- `VerificationJobResultRecord` and `AssuranceReport` already exist
- result may reference an attempt
- usage may reference the deterministic result

Assessment:

- the missing semantics are publication atomicity, completed-set consistency, and minimum lineage when no attempt ID is present
- atomic publication is an invariant, not a new artifact shape
- no-attempt-ID lineage is still explicitly unresolved

Decision:

- treat completion publication as `behavioral_invariant`
- treat completion lineage as `unresolved_architecture_gap`
- do not introduce a completion bundle type now

## 18. Availability Semantics

Current coverage:

- `VerificationArtifactAvailability` already distinguishes `available`, `not_yet_available`, `not_produced`, and `not_found`

Assessment:

- the persistence proposal sharpens `not_produced` from "terminal job did not produce artifact" to "no canonical artifact was ever published"
- this is primarily a semantic-alignment issue for comments and docs
- no new shape is needed to express it

Decision:

- classify as `comment_or_documentation_gap`
- a separate comment-only semantic-alignment correction is required
- no new availability type is required

The current source comment says "terminal job did not produce artifact". The
approved persistence proposal refines that meaning to "no canonical artifact
was ever published". The literal set and type shape remain sufficient, so no
availability type is needed and no literal change is needed. That correction
must not enter this assessment PR. It is a non-blocking maintenance obligation
that must be completed before transport, runtime, or future type-hardening
work formally consumes availability semantics.

## 19. Technical Usage

Current coverage:

- `VerificationUsageRecord` already carries job ID, optional attempt ID, terminal outcome, deterministic result reference, and opaque retention references

Assessment:

- the unresolved question is whether usage publication shares the completion atomic boundary
- the current contract already carries the needed artifact identity and linkage
- missing semantics are publication timing and atomicity, not a proven new external shape

Decision:

- classify as `unresolved_architecture_gap`
- reuse `VerificationUsageRecord`
- do not add a separate persistence-specific usage binding type now

## 20. Retention, Deletion, and Tombstones

Current coverage:

- opaque retention references already exist
- no deletion or tombstone contract exists

Assessment:

- retention duration is unfrozen
- hard delete versus tombstone is unfrozen
- visibility after deletion may depend on Authentication/Tenant rules
- completed resource sets cannot safely become partially visible or partially missing

Decision:

- retention-class typing is already sufficient as an opaque reference
- deletion and tombstone remain `auth_or_tenant_dependent_gap`
- no deletion or tombstone type should be created now

## 21. Storage Representation Versioning

Current coverage:

- artifact contracts already carry domain-specific schema versions where appropriate

Assessment:

- storage representation version is separate from artifact schema version
- it belongs to migration and implementation strategy
- no cross-boundary consumer is shown in the current repository

Decision:

- classify as `implementation_representation_gap`
- fully defer storage-representation versioning to runtime persistence design

## 22. Public and Package Visibility

Visibility rule by default:

- prefer reuse of existing domain contracts
- if a future binding is ever necessary, prefer package-internal visibility
- do not expand public exports just because persistence may later need an internal model

Assessment conclusion:

- no current candidate proves the need for public export
- producer integrations should not observe storage representation
- Ramen and other adapters should not depend on persistence binding contracts

## 23. Anti-pattern Review

This assessment explicitly rejects:

- database row types masquerading as domain contracts
- ORM entity types
- storage DTO duplication of `VerificationJob` or `VerificationAttempt`
- public types for internal transaction state
- generic persistence record types
- opaque metadata bags used as pseudo-contracts
- caller-controlled scope treated as canonical effective scope
- caller-controlled fingerprint reference treated as canonical fingerprint
- tombstone types before deletion semantics are frozen
- transition-history types before the transition model is frozen
- queue or worker state in domain contracts
- auth or tenant fields before the Authentication/Tenant boundary exists
- types created only because future implementation might want them
- one-consumer implementation structs presented as cross-boundary contracts

## 24. Premature-freezing Risks

Adding persistence-specific types now would risk:

- freezing tenant-sensitive scope semantics before the tenant boundary exists
- freezing fingerprint semantics before the fingerprint profile exists
- freezing accepted-request retention or redaction semantics before metadata policy exists
- freezing deletion visibility before future `not_found` behavior is defined
- freezing internal recovery state as if it were a stable public artifact
- implying runtime maturity or storage readiness that the repository intentionally does not claim

## 25. Consequences of Adding Types Now

If new persistence-specific types were added now:

- they would mostly duplicate existing artifact shapes
- they would likely encode storage choices as if they were domain contracts
- they would force premature decisions about scope, fingerprint, lineage, retention, and deletion
- they would create avoidable compatibility burden without current multi-consumer evidence

## 26. Consequences of Deferring Types

If new persistence-specific types are deferred now:

- the next architecture phase can still proceed cleanly
- current artifact contracts remain the stable vocabulary
- semantics stay documented without pretending unresolved dependencies are frozen
- later type-only hardening remains possible if runtime evidence reveals an unavoidable cross-boundary shape

This is a controlled deferral of implementation-shaped contracts, not a loss of architectural clarity.

Existing contracts are sufficient for the next architecture phase only. That
does not establish sufficiency for persistence runtime, transport,
Authentication/Tenant implementation, or production readiness, and it does not
waive the need for reassessment once a documented trigger is reached.

## 27. Primary Decision

Primary decision:
`EXISTING_CONTRACTS_SUFFICIENT_FOR_NEXT_PHASE`

Reason:

- no candidate currently satisfies the full eligibility bar for a new persistence-specific type
- existing artifact contracts already cover the stable nouns of the line
- the remaining gaps are invariants, deferred dependency decisions, or implementation-only representation choices
- the next bounded phase should therefore advance dependency clarity, not add premature persistence contracts

## 28. Reassessment Triggers

Re-run this need assessment when one or more of the following become true:

1. `Authentication and Tenant Boundary Proposal v0.1` is approved
2. effective idempotency scope derivation is frozen
3. fingerprint composition and profile are frozen
4. accepted-request canonicalization and retention rules are frozen
5. minimum no-attempt-ID completion lineage is frozen
6. usage publication atomicity is frozen
7. retention and deletion semantics are approved
8. the first local persistence spike is approved
9. two independent consumers require the same persistence binding
10. runtime implementation reveals an unavoidable cross-boundary shape that existing contracts cannot express safely

## 29. Following-phase Routing

Authorized next phase:

```text
Authentication and Tenant Boundary Proposal v0.1
```

Routing rationale:

- effective idempotency scope is the most clearly dependency-bound candidate
- `not_found`, deletion visibility, and retrieval visibility also remain tenant-sensitive
- resolving this boundary improves later persistence and fingerprint decisions without authorizing runtime work

This routing is a recommended architecture-sequencing decision only. It does
not authorize Authentication/Tenant implementation, and that future phase still
requires separate approval. The required comment-only availability
semantic-alignment follow-up is maintenance work, not a separate architecture
phase, and it does not change the next architecture routing.

This assessment does not recommend:

- runtime persistence implementation
- storage-adapter implementation
- database design
- queue or worker implementation
- transport implementation

## 30. Acceptance Criteria

This assessment is acceptable only if all of the following remain true:

- it is assessment-only
- it is docs-only
- no source type is added
- no existing type is modified
- the current contract inventory is complete
- the persistence semantic inventory is complete
- every candidate has a gap classification
- every candidate has a stability decision
- every candidate has a dependency decision
- behavioral invariants are separated from type-shape gaps
- implementation representation is separated from domain contract
- public visibility is separated from internal visibility
- effective-scope Authentication/Tenant dependency is explicit
- fingerprint immaturity is explicit
- accepted-request reuse is explicitly assessed
- selected-manifest reuse is explicitly assessed
- job and attempt reuse is explicitly assessed
- completion publication is assessed without inventing a bundle type
- availability alignment is assessed without inventing a new availability type
- retention and deletion premature-freezing risk is explicit
- exactly one primary outcome is selected
- exactly one following phase is selected
- no persistence implementation is authorized
- no database design is introduced
- no auth or tenant implementation is introduced
- no authority expansion is introduced

This assessment does not authorize type, persistence, transport, authentication, tenant, or runtime implementation.
