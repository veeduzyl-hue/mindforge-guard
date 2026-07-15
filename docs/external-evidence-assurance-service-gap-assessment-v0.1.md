# External Evidence Assurance Service Gap Assessment v0.1

## 1. Purpose

This document is a repository-grounded assessment of what is still missing for MindForge Guard to evolve from the current local External Evidence Assurance composition into a bounded, independently meterable assurance service.

This document is docs-only.
It does not implement a service, API, persistence layer, queue, tenant model, account system, pricing, invoicing, or payment flow.

## 2. Scope and Non-Goals

Scope:

- assess the current repository baseline for external evidence assurance
- identify the smallest service-enabling gaps between the current local-only composition and a future bounded service
- preserve the current Guard posture:
  - verification-only
  - recommendation-only
  - additive-only
  - non-executing
  - non-control-plane
  - human-review-oriented
  - producer-neutral

Non-goals:

- implementing a runtime service
- implementing HTTP endpoints
- implementing persistence or asynchronous job processing
- implementing authentication, tenant isolation, or account management
- implementing pricing, invoicing, subscription, or payment behavior
- expanding Guard into approval, blocking, certification, deployment authority, or runtime enforcement

This assessment also preserves:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged unless separately scoped
- `classify` behavior unchanged unless separately scoped
- current public and commercial baseline positioning unchanged

## 3. Current Local Capability Baseline

The current repository already contains a meaningful external-evidence assurance baseline. The baseline is not a blank slate, but it is still local-only and non-service.

Concrete repository evidence:

- architecture baseline:
  - `docs/external-evidence-assurance-platform-v0.1.md`
- external evidence framework and normalized record contracts:
  - `packages/guard-core/src/externalEvidence/types.ts`
- adapter registry review-layer contracts:
  - `packages/guard-core/src/externalEvidence/registryTypes.ts`
- producer-neutral verification platform contracts:
  - `packages/guard-core/src/externalEvidence/verificationTypes.ts`
- local declarative normalization fixture:
  - `packages/guard-core/src/externalEvidence/localDeclarativeNormalizationFixture.mjs`
- local assurance report fixture:
  - `packages/guard-core/src/externalEvidence/localAssuranceReportFixture.mjs`
- deterministic assurance report integrity helper:
  - `packages/guard-core/src/externalEvidence/localAssuranceReportIntegrity.mjs`
- local composition proof:
  - `scripts/fixtures/local_external_evidence_assurance_composition.mjs`
- dedicated verification coverage:
  - `scripts/verify_external_evidence_local_normalization_fixture.mjs`
  - `scripts/verify_external_evidence_local_assurance_report_fixture.mjs`
  - `scripts/verify_external_evidence_local_assurance_composition.mjs`
  - `scripts/verify_external_evidence_type_contract.mjs`

Current proven local-only flow:

```text
raw external evidence
-> declarative normalization
-> NormalizedEvidenceRecord
-> local Assurance Report assembly
-> deterministic report integrity verification
```

Current boundary of that flow:

- scripts-side
- local-only
- standalone
- default-off
- non-exported
- non-networked
- non-persistent
- non-production

The repository also preserves Ramen as a non-privileged reference application only. The local spike exists, but it is not the service center and must not become a privileged runtime path.

## 4. Target Service Boundary

The smallest acceptable future service boundary is not "add an HTTP endpoint."

The bounded service unit should be:

```text
one bounded VerificationJob
```

That bounded unit should mean:

- one bounded logical verification request
- one explicit evidence package or package reference
- one explicit adapter and manifest selection
- one explicit assurance profile set
- one deterministic verification path within that job boundary
- one explicit result state
- one AssuranceReport
- one TechnicalUsageRecord

It must not mean:

- approval
- blocking
- permit
- deploy
- enforcement
- certification
- trust declaration
- payment execution

The smallest future service surface, if later justified, would therefore be limited to:

- submit a bounded verification job
- read job status
- read verification result
- read assurance report

## 5. Capability Status Definitions

This assessment uses the following status labels:

- `existing`
  - the repository contains a concrete, usable implementation or a sufficiently complete contract for the assessed local scope
- `partial`
  - the repository contains relevant contract, documentation, fixture, or implementation evidence, but not enough for the target service boundary
- `missing`
  - the capability is required for the target service boundary and is not materially represented
- `deferred`
  - the capability may matter later, but it is intentionally outside the next minimal service-enabling step
- `forbidden`
  - the capability would expand Guard into approval, enforcement, certification, deployment authority, trust authority, payment processing, or another prohibited role

## 6. Current Capability Inventory

Current capability position by layer:

| Capability Layer | Status | Repository Evidence | Assessment |
| --- | --- | --- | --- |
| architecture / docs | existing | `docs/external-evidence-assurance-platform-v0.1.md` | The repository already defines the producer-neutral platform line and explicitly excludes control-plane, billing, and authority semantics. |
| type contracts | existing | `types.ts`, `registryTypes.ts`, `verificationTypes.ts` | The repository already contains type-only contracts for normalized evidence, adapter registry entries, EvidencePackage, AdapterManifest, AssuranceProfile, VerificationRequest, VerificationJob, AssuranceReport, and VerificationUsageRecord. |
| local evidence ingestion | partial | `verificationTypes.ts`, `localDeclarativeNormalizationFixture.mjs` | There is a package-level evidence structure and a local fixture input path, but not a service-grade submission boundary. |
| local normalization | existing | `localDeclarativeNormalizationFixture.mjs` | Declarative, deterministic local normalization is implemented and verified. |
| local composition | existing | `local_external_evidence_assurance_composition.mjs` | The repository proves that normalization can feed a local job/report/usage bundle. |
| deterministic verification | partial | `verificationTypes.ts`, local composition fixture | Deterministic assembly exists, but generic deterministic verification execution is not yet implemented as a service-grade runtime. |
| findings generation | partial | `types.ts`, `docs/verification-findings-taxonomy-v0.1.md` | Findings taxonomy and contracts exist, but there is no generic service-side findings engine. |
| Assurance Report generation | partial | `localAssuranceReportFixture.mjs` | A deterministic local report fixture exists, but it remains local-only and non-exported. |
| report integrity | existing | `localAssuranceReportIntegrity.mjs` | Canonicalization plus SHA-256 integrity verification is implemented for the local report line. |
| VerificationJob envelope | partial | `verificationTypes.ts`, local report fixture, local composition fixture | A job shape exists, but attempt lifecycle, idempotency, and persistence are missing. |
| service / API | missing | no service runtime or API contract implementation | The repository has no service runtime, no submission/read API, and no auth boundary. |
| persistence | missing | `verificationTypes.ts` explicitly excludes persistence behavior | No persistence model or durable storage contract exists. |
| asynchronous job processing | missing | no queue or worker path | The repository has no async execution model. |
| usage metering | partial | `VerificationUsageRecord`, local usage fixture generation | Technical usage fields exist, but there is no durable metering pipeline. |
| billable-event boundary | partial | metering/billing separation language in docs and type verifier | The repository clearly excludes billing logic, but it does not yet define a separate BillableUsageEvent boundary. |
| tenant / account boundary | missing | no tenant or account contract | The repository has no tenant or account isolation model for this line. |
| authentication | missing | no auth contract | No service authentication boundary exists. |
| operational security | missing | no service-specific threat or control model | The repository does not yet define service runtime controls. |
| production adapter onboarding | partial | `AdapterManifest`, registry types/docs, reference adapter line | Review/documentation-level onboarding exists, but no service-grade onboarding and manifest-selection flow exists. |
| production readiness | missing | local-only fixtures only | The repository does not yet represent a production-ready assurance service runtime. |

## 7. Service Gap Matrix

| Capability | Status | Current Repository Evidence | Service Requirement | Gap | Recommended Step | Boundary Note |
| --- | --- | --- | --- | --- | --- | --- |
| Evidence ingestion boundary | partial | `EvidencePackage` and `VerificationRequest` exist in `verificationTypes.ts`; local normalizer accepts `raw_evidence` plus `mapping_manifest` | A bounded service request must distinguish caller submission, validation, and accepted job scope | No service-grade submission envelope, validation boundary, or resource guard exists | Clarify request envelope semantics and accepted input states in type-only follow-up | Submission must not imply approval or runtime authority |
| EvidencePackage contract sufficiency | partial | `EvidencePackage` / `EvidencePackageReference` exist | Service needs package identity, integrity, source schema, and replay-safe reference semantics | The current contract is useful but does not yet define immutable accepted-package semantics or service-side storage assumptions | Harden the existing type-only contract instead of replacing it | Package receipt is not trust, certification, or acceptance |
| Adapter identification and manifest selection | partial | `AdapterManifest` exists; local normalization uses a caller-provided declarative manifest; registry docs exist | Service needs deterministic adapter identification, version pinning, and manifest selection | No service selection policy or manifest resolution boundary exists | Add a bounded manifest-selection contract and local fixture | Selection is capability routing only, not producer privilege |
| Declarative normalization | existing | `localDeclarativeNormalizationFixture.mjs` plus dedicated verifier | Service can build on deterministic normalization | Current implementation is local-only and fixture-scoped, but the normalization capability itself exists | Preserve fixture behavior and use it as the reference baseline | Normalization success is not verification success |
| AssuranceProfile selection | partial | `AssuranceProfile` and profile references exist | Service needs deterministic profile selection and validation | No selection rules, defaults, or compatibility boundary exist | Add a type-only profile-selection hardening step | Profile choice defines checks, not policy authority |
| Deterministic verification execution | partial | Current local composition is deterministic; report integrity is deterministic | Service needs a bounded verification execution model separated from request acceptance | No generic source-neutral check executor or explicit attempt model exists | Add a local VerificationAttempt / result fixture before any service runtime | Verification execution is evidence processing only |
| Findings generation and taxonomy | partial | `VerificationFinding` exists; taxonomy doc exists; local composition carries findings through | Service needs stable finding categories plus deterministic emission rules | Taxonomy exists, but generic service-side findings generation rules are incomplete | Add fixture-backed finding generation rules after envelope hardening | Findings must remain review artifacts, not gates |
| AssuranceReport generation | partial | `localAssuranceReportFixture.mjs` builds deterministic reports | Service needs report generation tied to bounded job/result lifecycle | Current builder is local-only and not yet a service artifact boundary | Preserve current fixture and introduce service-boundary semantics separately | Report is not a certificate, approval record, or compliance record |
| Report integrity | existing | `localAssuranceReportIntegrity.mjs` canonicalizes and verifies report digests | Service needs a stable report integrity reference for deterministic output | Current digest reference is local-only but materially usable as a baseline | Keep the current local digest semantics as the non-authority baseline | Digest match does not prove authenticity, producer identity, or non-repudiation |
| VerificationJob lifecycle | partial | `VerificationJobStatus` exists with `pending`, `ready`, `completed`, `completed_with_findings`, `unsupported`, `invalid_input`, `verification_error` | Service needs explicit request, attempt, result, and lifecycle semantics | Current status set does not separate job lifecycle from execution attempts or service-transient failures | Add type-only lifecycle hardening and an attempt/result split | Job lifecycle must not introduce approved / blocked / deployable states |
| Idempotency and replay semantics | missing | Deterministic reruns are proven by local verifiers, but no explicit idempotency field exists | Service needs caller idempotency and replay-safe behavior | No `idempotency_key`, no replay contract, no dedupe semantics exist | Add type-only idempotency and replay semantics, then local fixtures | Replay must preserve evidence scope and version pins, not mutate outcomes |
| Persistence model | missing | `verificationTypes.ts` explicitly excludes persistence behavior | Service needs durable request/job/result/report/usage persistence | No persistence boundary exists | Define a minimal persistence model before any API proposal | Persistence design must stay supporting-only and bounded |
| Async job execution | missing | No queue or worker model exists | Service may need async execution even for bounded jobs | No async lifecycle or queue semantics exist | Defer runtime implementation; first define the lifecycle boundary | Queueing must not become orchestrator drift |
| API / CLI surface | missing | No service surface exists | Service needs at most bounded submit/read semantics | There is no current service contract surface | Do not implement API yet; document the minimal future surface only | No approve / block / deploy / execute verbs |
| Authentication and tenant isolation | missing | No auth or tenant contract exists | Service must authenticate callers and isolate tenants | The entire boundary is absent | Add explicit service-boundary contracts before any API proposal | Tenant isolation is service hygiene, not execution authority |
| Input size / resource limits | missing | No service-side limit model exists | Service must bound input size, record count, runtime cost, and denial-of-service exposure | Current contracts do not express limits | Add resource-limit requirements to the service-boundary contract | Limits protect service operation, not policy outcomes |
| Secrets / key handling | partial | `types.ts` models issuer/public-key references and unavailability states | Service needs explicit handling for key lookup, secret boundaries, and unsupported cryptographic contexts | Key and secret handling are not yet service-defined | Add boundary docs and type-only placeholders before runtime work | Key handling must not imply producer authentication authority |
| Adapter onboarding / versioning | partial | `AdapterManifest` includes versioned support; registry docs and reference adapter review line exist | Service needs stable onboarding/versioning rules and manifest compatibility checks | Documentation exists, but no service-grade onboarding contract exists | Add manifest onboarding rules and local selection fixtures | Adapter presence is not trust, approval, or privilege |
| Usage metering | partial | `VerificationUsageRecord` exists; local composition produces a usage record | Service needs durable technical usage capture per job/attempt | Current usage record is local-only and non-durable | Add a local technical usage fixture and contract hardening | Technical usage is not pricing |
| Billable-event boundary | partial | Platform docs explicitly exclude billing; type verifier forbids billing fields | Service needs an explicit separation between technical usage and any future billable event | The separation is stated, but no distinct billable boundary contract exists | Add a type-only BillableUsageEvent boundary only if separately justified | Billable event is not pricing, invoice, or payment |
| Observability and auditability | partial | Job/report/usage artifacts already create bounded evidence | Service needs structured operational events, correlation IDs, and auditable lifecycle history | Artifact lineage exists, but service observability does not | Add observability requirements in the next type/docs hardening PR | Observability must remain evidence-oriented, not control-plane telemetry |
| Retention / deletion | partial | `retention_tier_ref` exists on `VerificationUsageRecord` and local usage fixtures | Service needs retention and deletion rules for requests, reports, and raw evidence | There is only a retention hint, not a retention model | Add type/docs requirements for retention classes and deletion expectations | Retention policy must not silently change report semantics |
| Failure and retry semantics | partial | Status values and composition diagnostics distinguish invalid input, unsupported, and verification issues | Service needs explicit retry classes, transient error handling, and replay behavior | Current repository lacks a retry contract and attempt lifecycle | Add lifecycle plus replay/retry fixtures before API work | Findings are not failures; unsupported is not verification failure |
| Human-review handoff | partial | `human_review_context` and `human_review_recommendations` exist; current report model already carries review guidance | Service needs a stable handoff artifact boundary for reviewers | Artifact fields exist, but service retrieval and handoff semantics are incomplete | Harden handoff artifact expectations in the docs/type layer | Human review remains outside Guard authority |
| Security / threat model | missing | No service-specific threat model exists for this line | Service needs explicit threat assumptions and operational controls | The capability is not materially represented | Add a boundary threat-model doc before runtime work | Security review must not become certification language |
| Production readiness and operational controls | missing | Local-only fixtures and docs do not define runtime controls | Service needs deploy-time controls, failure handling, runbooks, and operational ownership | Production readiness is absent | Keep runtime implementation deferred until contracts and controls exist | Production readiness must not be inferred from local fixtures |

## 8. VerificationJob As the Bounded Unit

Conclusion:

```text
one bounded VerificationJob
```

This should remain the core unit for the future service line.

Why this is the correct bounded unit:

- the repository already models `VerificationRequest`, `VerificationJob`, `AssuranceReport`, and `VerificationUsageRecord`
- the local composition already proves that one bounded normalized input can produce one bounded job/report/usage bundle
- the current platform doc already treats the verification job as the future business, audit, and metering unit

Required semantic separation:

- `VerificationJob`
  - the bounded service-level unit that tracks one accepted logical verification request
- `VerificationAttempt`
  - a future sub-unit for one execution attempt of that job
- `VerificationResult`
  - the bounded execution outcome state for one attempt or finalized job result
- `AssuranceReport`
  - the reviewer-facing output artifact
- `TechnicalUsageRecord`
  - the technical metering artifact for execution/accounting visibility
- `BillableUsageEvent`
  - a future, separate commercial interpretation artifact, if ever needed
- `Price`
  - commercial catalog logic, outside this repository step
- `Invoice`
  - commercial settlement artifact, outside this repository step
- `Payment`
  - payment processing behavior, outside this repository step

These concepts should not be collapsed into one record.

Additional lifecycle boundary rules:

- a `VerificationJob` may have more than one `VerificationAttempt` when retrying retryable operational failures
- retrying the same accepted job must not create a new logical `VerificationJob`
- resubmitting the same logical request within the same idempotency boundary should resolve to the same logical job rather than create a new one
- replay should mean deterministic re-execution of fixed inputs, adapter version, manifest selection, and assurance profile selection for analysis or verification purposes
- a new logical verification request outside the original idempotency boundary should create a new `VerificationJob`
- each `VerificationJob` should have one terminal outcome even if more than one attempt occurs
- a successfully completed job may produce one canonical `VerificationResult` and one canonical `AssuranceReport`
- invalid, unsupported, cancelled, or operationally failed jobs may terminate without an `AssuranceReport`

## 9. Verification Lifecycle Semantics

Current repository evidence supports only a partial lifecycle. A future service boundary should distinguish at least:

- `received`
- `validated`
- `accepted_for_verification`
- `running`
- `completed`
- `failed`
- `unsupported`
- `invalid_input`
- `cancelled`

Current repository evidence already supports important distinctions that must be preserved:

- invalid input is not the same as a verification finding
- unsupported evidence is not the same as verification failure
- verification completed with findings is not the same as service failure
- execution failure is not the same as invalid evidence
- internal service failure is not the same as report integrity failure
- service failure is not the same as evidence invalidity
- normalization success is not the same as verification success
- a digest match is not authenticity, trust, producer identity, or deployment authorization

Forbidden lifecycle semantics:

- `approved`
- `rejected`
- `authorized`
- `blocked`
- `certified`
- `compliant`
- `safe`
- `trusted`
- `deployable`

## 10. Technical Usage vs Commercial Billing Boundary

The repository already establishes a useful technical usage line via `VerificationUsageRecord`, but it does not yet define a commercial billing line.

Required separation:

```text
technical usage record != billable usage event
billable usage event != pricing
pricing != invoicing
invoicing != payment
```

Additional billing-boundary rule:

- multiple `VerificationAttempt` records for one retried job must not automatically imply multiple billable usage events

What a technical usage record may contain:

- verification job identifier
- future verification attempt identifier
- evidence package count
- evidence record count
- assurance profile count
- verification check count
- cryptographic operation count
- evidence chain depth
- report count
- retention tier reference
- human-review requested flag
- timestamps
- deterministic result or report reference

What it must not contain at this stage:

- price
- amount
- plan
- subscription
- invoice
- payment
- customer balance
- revenue recognition

## 11. Identity and Idempotency Requirements

Current repository evidence already distinguishes several caller-supplied references from service-generated artifacts, but the split is incomplete.

Caller-provided candidates:

- `request_id`
- `caller_reference`
- `evidence_package.package_id`
- producer external reference
- adapter identifier and version
- assurance profile identifiers and versions
- source schema version
- future `idempotency_key`
- future tenant-scoped external reference

Service-generated candidates:

- `verification_id`
- future `verification_attempt_id`
- `report_id`
- `usage_record_id`
- `received_at`
- `started_at`
- `completed_at`

Current gap:

- the repository does not yet define `idempotency_key`
- the repository does not yet define attempt identifiers separate from job identifiers
- the repository does not yet define collision scope or replay rules

Minimal requirement:

- do not collapse `request_id` and `verification_id`
- do not reuse report identity as request identity
- keep caller-visible replay keys separate from service-generated result identifiers
- distinguish retry of the same job from idempotent resubmission of the same logical request
- distinguish replay of fixed accepted inputs from intentional creation of a new logical verification request

## 12. Persistence and Retention Requirements

The repository currently has no persistence model for this line.

Minimum future persisted artifacts for a service boundary would likely include:

- accepted request envelope
- bounded job state
- future attempt records
- finalized verification result
- assurance report
- technical usage record
- retention class metadata

Current repository gap:

- no durable storage boundary
- no deletion semantics
- no raw evidence retention rules
- no result replay persistence rules

This is a prerequisite to a real service, but it is not the next minimal PR.

## 13. Adapter and Manifest Selection Boundary

The repository currently proves local declarative normalization by accepting an explicit `mapping_manifest` in the local fixture flow.

That is useful local evidence, but it is not yet a service-grade manifest-selection boundary.

Service-enabling requirements:

- explicit adapter identifier
- explicit adapter version
- deterministic manifest version pinning
- declared supported source schema versions
- declared supported assurance profiles
- explicit unsupported outcomes

Current gap:

- no service rule for how a manifest is selected
- no service contract for caller-selected vs service-selected manifest responsibility
- no service-safe onboarding/versioning flow

Required boundary posture:

- no dynamic runtime adapter loader
- no privileged producer branch
- no Ramen-specific platform authority

## 14. Failure, Retry, and Replay Semantics

Current repository evidence already separates some states:

- local composition returns `assurance_bundle: null` when normalized evidence is not parseable
- partial normalization produces `completed_with_findings`
- invalid input is not represented as approval or deployment status

Still missing for a service:

- explicit retry classes
- transient service error classification
- future attempt lifecycle
- caller-visible replay semantics
- deduplication/idempotency handling

Minimum semantic rules for a future service:

- findings do not imply service failure
- retry means another attempt for the same accepted job after a retryable operational failure
- idempotent resubmission means the caller repeats the same logical request within the same idempotency boundary
- replay means deterministic re-execution of the same bounded inputs, adapter version, manifest selection, and assurance profile selection
- intentional submission outside the original idempotency boundary means a new logical verification job
- unsupported evidence does not imply infrastructure failure
- retryable service faults must not mutate accepted job identity
- replay must preserve the same bounded evidence scope, adapter version, and profile selection unless a new job is submitted

## 15. Authentication and Tenant-Isolation Requirements

The repository does not yet contain:

- caller authentication contract
- tenant identity contract
- tenant-scoped identifiers
- isolation rules for requests, jobs, reports, or usage records

These are service prerequisites, but they should be introduced only after the service-boundary contract is clarified.

They must not be allowed to drift into:

- policy authority
- runtime execution authority
- trust designation authority

## 16. Resource Limits and Operational Security

The repository does not yet contain a service resource-boundary model.

Minimum future service-boundary requirements:

- request size limits
- evidence record count limits
- bounded verification cost counters
- timeout limits
- safe raw evidence handling rules
- secret and key lookup boundary rules
- replay / abuse control assumptions

Current repository evidence is still local-fixture-only and therefore does not satisfy service operational security needs.

## 17. Observability and Auditability

The repository already has useful building blocks for bounded auditability:

- deterministic `VerificationJob` shape
- deterministic `AssuranceReport` shape
- deterministic `VerificationUsageRecord` shape
- report integrity verification

Still missing for a service:

- operational event correlation
- service-side audit trail for state transitions
- attempt-level telemetry
- replay visibility
- retention/deletion visibility

The next step should therefore be to harden observability requirements at the docs/type layer, not to add runtime telemetry first.

## 18. Human-Review Handoff

Current repository evidence already supports human-review-oriented artifacts:

- findings
- missing evidence lists
- scope limitations
- human review recommendations
- reviewer-facing documentation language

But a future service still needs:

- a stable handoff boundary for retrieving the report and related bounded artifacts
- clear distinction between technical completeness, findings severity, and reviewer action
- no conversion of reviewer guidance into blocking or authorization semantics

Human review remains outside Guard authority.

## 19. Service Readiness Conclusion

Conclusion:

```text
ready only for a service-boundary proposal
```

Reason:

- the repository already contains meaningful platform docs, type-only contracts, local normalization, local composition, deterministic report generation, and deterministic report integrity
- the repository does not yet contain idempotency, persistence, attempt lifecycle, authentication, tenant isolation, resource limits, or service operational controls
- those missing capabilities are prerequisites to a minimal submit/read API contract

This repository is therefore past "blank architecture discussion," but not yet ready for an HTTP API contract.

It is also not appropriate to jump straight to service runtime implementation.

## 20. Recommended Incremental PR Sequence

Recommended next sequence, based on current repository evidence:

1. `PR 1: docs-only service gap assessment`
   - goal: freeze the real gap between the current local composition and a bounded service
   - allowed files: docs only
   - non-goals: runtime changes, exports, API, persistence
   - why next: the repository now has enough evidence to assess concrete gaps instead of guessing
   - why it does not authorize the next step automatically: service boundary decisions still need explicit review
2. `PR 2: type-only service boundary contract hardening`
   - goal: extend the already-existing type line with missing service-boundary deltas such as idempotency, attempt/result separation, retention classes, and billable-boundary separation
   - allowed files: external evidence type/docs boundary files only
   - non-goals: runtime service, persistence, auth implementation
   - why next: the repository already has type-only contracts; the gap is now refinement, not first introduction
   - why it does not authorize the next step automatically: type stability must be reviewed before fixtures or service proposals
3. `PR 3: local deterministic VerificationJob envelope fixture`
   - goal: prove request -> job -> result/report/usage envelope semantics without service runtime
   - allowed files: local-only fixtures, docs, targeted verifiers
   - non-goals: network calls, persistence, exports
   - why next: it hardens the service boundary with deterministic local evidence
   - why it does not authorize the next step automatically: lifecycle and idempotency still need explicit review
4. `PR 4: local idempotency and replay fixture`
   - goal: prove replay-safe semantics and caller/service identifier separation
   - allowed files: local fixtures, docs, targeted verifiers
   - non-goals: real storage or queueing
   - why next: idempotency is a prerequisite to a minimal service proposal
   - why it does not authorize the next step automatically: persistence, auth, and tenant isolation remain unresolved
5. `PR 5: local technical usage record hardening`
   - goal: harden technical usage semantics and keep them separate from billing
   - allowed files: type/docs/local fixture files only
   - non-goals: pricing, invoice, subscription, payment
   - why next: the current repository already has a usage record shape that can be hardened safely
   - why it does not authorize the next step automatically: commercial settlement logic remains outside scope
6. `PR 6: adapter-manifest selection fixture`
   - goal: prove deterministic manifest selection and unsupported outcomes
   - allowed files: local fixtures, docs, type-only boundaries
   - non-goals: dynamic runtime loader, privileged adapters
   - why next: current repository already has manifest and registry building blocks
   - why it does not authorize the next step automatically: service auth, persistence, and operational controls remain absent
7. `PR 7: minimal service API proposal`
   - goal: document only the bounded submit/read surface
   - allowed files: docs and type proposal artifacts only
   - non-goals: implementation
   - why next: only after lifecycle, idempotency, usage, and selection are clarified
   - why it does not authorize the next step automatically: runtime implementation still requires separate approval
8. `PR 8+: separately approved runtime implementation`
   - goal: implement the smallest approved runtime slice
   - allowed files: separately scoped at that time
   - non-goals: control-plane expansion
   - why next: only after service-boundary contracts are stable
   - why it does not authorize later steps automatically: production controls must remain explicitly reviewed

## 21. Recommended Next Minimal PR

Conclusion:

```text
docs-only assessment is the next minimal PR
```

Reason:

- the repository already has meaningful architecture and type evidence
- the biggest immediate gap is not "missing code" but "missing service-boundary clarity across already-existing local and type-only artifacts"
- implementing API, persistence, queueing, or billing now would outrun the repository baseline and violate the current boundary posture

## 22. Deferred Capabilities

The following capabilities are deferred rather than next-step requirements for this PR:

- network service runtime
- database-backed persistence implementation
- distributed queue implementation
- multi-region execution
- production tenant system implementation
- external authentication provider integration
- production secret-management implementation
- production adapter marketplace
- commercial pricing
- invoicing
- payments
- subscription management
- SLA handling
- production incident response packaging

Deferred does not mean shipped.
Deferred means intentionally outside the next minimal service-enabling step.

## 23. Forbidden Authority Expansion

The following remain forbidden:

- approval authority
- blocking authority
- deployment authority
- runtime enforcement
- policy enforcement
- certification
- compliance determination
- trust declaration
- safety guarantee
- automatic verified claims
- producer privilege
- Ramen-specific platform authority
- payment processing inside Guard Core

Also forbidden:

- treating an AssuranceReport as a certificate
- treating a digest match as authenticity or producer identity proof
- converting findings into allow / block behavior

## 24. Readiness Checklist

- repository-grounded external evidence baseline exists: yes
- docs-only service assessment appropriate now: yes
- type-only service contracts already exist in some form: yes
- deterministic local normalization exists: yes
- deterministic local report integrity exists: yes
- deterministic local composition exists: yes
- explicit idempotency contract exists: no
- explicit replay contract exists: no
- persistence model exists: no
- async execution model exists: no
- auth boundary exists: no
- tenant isolation boundary exists: no
- resource limit model exists: no
- service operational control model exists: no
- Guard authority expansion required for next step: no

## 25. Compatibility and Boundary Conclusion

Compatibility conclusion:

- compatible
- no semantic regression found
- docs-only boundary preserved

Boundary status:

- `audit` output / verdict / exit unchanged
- `permit` behavior unchanged
- `classify` behavior unchanged
- recommendation-only preserved
- additive-only preserved
- non-executing preserved
- default-off preserved
- no authority scope expansion introduced
- no current commercial baseline positioning changed

Can proceed:

- yes, as a docs-only repository-grounded assessment
- no, for service runtime, API, persistence, queue, tenant, auth, pricing, invoice, or payment implementation in this PR
