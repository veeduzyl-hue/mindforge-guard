# External Evidence Assurance Minimal Service API Proposal v0.1

## 1. Status

- Status: `proposal-only`
- Scope: `docs-only`
- Transport: `transport-neutral`
- Implementation status: `not implemented`
- Authority status: `verification and retrieval only`

This document is an architecture proposal for a possible future service boundary. It is not:

- a production API specification
- an HTTP or OpenAPI specification
- a runtime service implementation
- a deployment plan
- a security certification
- a compliance declaration
- a commercial service commitment

Nothing in this proposal changes the current local deterministic fixtures, frozen TypeScript contracts, public exports, command behavior, or aggregate verification wiring.

## 2. Purpose

The purpose of this proposal is to define the smallest transport-neutral submission and retrieval surface that could later expose the existing External Evidence Assurance contract line without turning MindForge Guard into a control plane or execution authority.

The proposal builds on the existing bounded artifacts:

- `VerificationRequest`
- `EvidencePackage`
- `AdapterManifest`
- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `AssuranceReport`
- `VerificationUsageRecord`
- `VerificationIdempotencyBoundary`
- `VerificationReplayContext`

The core relationship remains:

```text
External systems issue evidence. Guard verifies evidence.
```

The bounded service unit is one logical `VerificationJob`.

## 3. Boundary and Non-Goals

The proposed surface remains:

- verification-only
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- human-review-oriented
- producer-neutral
- default-off

The proposed surface may only provide:

- bounded verification submission
- bounded artifact retrieval
- deterministic identity and lifecycle visibility

It does not provide operations to approve, reject as policy authority, permit, block, deploy, execute, enforce, certify, attest compliance, declare trust, declare safety, authorize production use, or process payment.

The following capabilities are outside the v0.1 operation surface:

- job listing or search
- job update, retry, cancellation, or deletion
- adapter listing, discovery, installation, activation, or download
- policy decisions or runtime gates
- pricing, invoice, billing, or payment behavior
- technical usage retrieval

The corresponding excluded operation names are:

- `ListJobs`
- `SearchJobs`
- `UpdateJob`
- `RetryJob`
- `CancelJob`
- `DeleteJob`
- `ApproveJob`
- `BlockJob`
- `DeployJob`
- `ExecuteJob`
- `ListAdapters`
- `InstallAdapter`
- `ActivateAdapter`
- `Pricing`
- `Invoice`
- `Payment`

This proposal does not define a URL path, transport method, transport status code, request header, authorization header, media type, pagination format, webhook, event stream, polling interval, SDK method, controller, router, or server framework.

## 4. Design Principles

### 4.1 Existing contracts remain canonical

This proposal composes existing contracts conceptually. It does not create, modify, export, or freeze a new source type.

### 4.2 Submission is not verification success

Establishing a logical job means only that a bounded request has crossed the pre-acceptance boundary. It does not mean:

- execution has started
- verification succeeded
- evidence is valid
- a result exists
- a report exists
- a reviewer has acted

### 4.3 Retrieval is read-only

Retrieval operations expose bounded artifact state. They do not mutate a job, create an attempt, retry work, cancel work, or create an authority decision.

### 4.4 Artifact roles remain separate

Request, job, attempt, result, report, and usage identities are role-specific. No generic identifier is accepted by the conceptual operations.

### 4.5 Transport remains deferred

Operation names, conceptual inputs, conceptual outputs, dispositions, availability states, problem categories, and identity bindings may be discussed here. Transport mapping remains a separate future decision.

## 5. Existing Contract Reuse

| Conceptual role | Existing contract | Proposal treatment | Minimal public surface |
| --- | --- | --- | --- |
| Submission request | `VerificationRequest` + `EvidencePackage` + caller-provided `AdapterManifest` candidates | Proposal composition only; no new envelope type is implemented | Input to `SubmitVerificationJob` |
| Logical service unit | `VerificationJob` | Reused as-is as the bounded logical job | Returned by submission and job retrieval when available |
| Execution attempt | `VerificationAttempt` | Reused as-is; attempt execution and retry hardening remain deferred | Not directly retrievable in v0.1 |
| Canonical result | `VerificationJobResultRecord` | Reused as-is as the finalized result artifact | Returned by result retrieval when available |
| Reviewer-facing artifact | `AssuranceReport` | Reused as-is as a scoped verification report | Returned by report retrieval when available |
| Technical usage | `VerificationUsageRecord` | Reused as-is; retrieval remains deferred | Not public in the minimal surface |
| Idempotency | `VerificationIdempotencyBoundary` | Reused as-is for caller deduplication intent; durable concurrency semantics require hardening | Used by submission when present |
| Replay | `VerificationReplayContext` | Reused as-is for explicit deterministic re-execution context | Used by replay submission when present |

These contracts are necessary inputs to a service design, but they do not by themselves constitute a deployable API.

## 6. Minimal Operation Surface

The complete v0.1 proposal surface is limited to four operations:

| Operation | Purpose | Mutation boundary |
| --- | --- | --- |
| `SubmitVerificationJob` | Validate one bounded submission and create or resolve one logical job | May establish one logical job or resolve an existing one |
| `GetVerificationJob` | Read one job identity and current job-state projection by `verification_id` | Read-only |
| `GetVerificationResult` | Read the canonical result for one job by `verification_id` | Read-only |
| `GetAssuranceReport` | Read the canonical report for one job by `verification_id` | Read-only |

No fifth operation is proposed in v0.1.

## 7. SubmitVerificationJob

### 7.1 Purpose

`SubmitVerificationJob` submits one bounded logical verification request, fixes the evidence scope, fixes adapter-manifest selection, fixes assurance-profile selection, and establishes or resolves one logical `VerificationJob`.

It does not indicate that execution has started, verification succeeded, evidence is valid, a report was generated, or any approval was granted.

### 7.2 Conceptual input

The proposal-level submission envelope conceptually combines:

```text
verification_request
evidence_package
adapter_manifest_candidates
required_mapping_capabilities
```

These labels describe a proposal-level composition only. No new type is created in this phase.

The caller explicitly provides adapter-manifest candidates. The future service does not discover, install, download, activate, load, or execute an adapter. The request continues to pin an exact adapter ID and opaque exact version. There is no latest, default, preferred, nearest, or fallback selection.

### 7.3 Conceptual processing order

Submission semantics are ordered as follows:

1. validate the proposal envelope shape
2. validate request and evidence-package binding
3. select exactly one caller-pinned adapter manifest
4. validate all requested assurance-profile compatibility
5. validate all required mapping-capability compatibility
6. resolve the idempotency boundary when present
7. establish a bounded `VerificationJob` or return the existing logical job

This order is a contract boundary, not a worker pipeline or runtime execution design.

### 7.4 Conceptual output

A successful submission response conceptually contains:

- one submission disposition
- the established or resolved `verification_id`
- the current `VerificationJob` projection

It does not fabricate a result, report, attempt, finding, or usage artifact that does not exist.

## 8. Submission Dispositions

The proposed disposition candidates are limited to:

- `created_new_job`
- `resolved_existing_job`

These are proposal-level future contract candidates. They are not implemented or frozen type values.

### 8.1 created_new_job

`created_new_job` means that one new logical `VerificationJob` was established. It does not mean execution started or a result or report exists.

### 8.2 resolved_existing_job

`resolved_existing_job` means that the same idempotency scope, key, and fingerprint resolved to an existing logical job.

It does not create a new attempt, result, report, or usage artifact. It also makes no statement about commercial charging.

The dispositions do not encode approved, permitted, blocked, trusted, certified, deployable, billable, or free states.

## 9. Pre-Acceptance Problems

A pre-acceptance problem occurs before a bounded `VerificationJob` has been established. Candidate examples are:

- malformed submission envelope
- request and evidence-package binding mismatch
- no exact adapter-manifest match
- duplicate exact adapter-manifest matches
- unsupported pinned compatibility
- idempotency conflict

A pre-acceptance problem:

- is not a `VerificationFinding`
- is not an `AssuranceReport`
- does not receive a fabricated `verification_id`
- does not establish a `VerificationJob`
- does not create a `VerificationAttempt`
- does not create a finding, result, report, or usage artifact

`invalid_input` is a job status only when invalidity is determined after a logical job has already been established. Input rejected before establishment remains a pre-acceptance problem.

## 10. Job Lifecycle

Once a logical job is established, its status is limited to the existing frozen `VerificationJobStatus` values:

- `accepted_for_verification`
- `pending`
- `ready`
- `completed`
- `completed_with_findings`
- `unsupported`
- `invalid_input`
- `verification_error`
- `cancelled`

No additional status is proposed.

Status interpretation remains bounded:

- `accepted_for_verification` means one bounded logical job exists.
- `pending` means the accepted job is waiting for fixed execution prerequisites.
- `ready` means its required evidence, adapter-manifest, and profile selections are fixed.
- `completed` means verification completed without findings requiring separate findings representation.
- `completed_with_findings` means verification completed successfully and produced findings; it is not a service failure.
- `unsupported` means the pinned evidence, adapter manifest, profile, or capability is unsupported; it is not proof that evidence is invalid.
- `invalid_input` means invalidity was determined after job establishment; it is not a finding.
- `verification_error` means verification did not complete because of execution or operational failure; it is not proof that evidence is invalid.
- `cancelled` means processing stopped; it is not a policy decision.

Statuses for approval, blocking, permission, denial, deployment, certification, compliance, safety, or trust are forbidden.

## 11. Artifact Availability

The following matrix describes artifact availability, not transport responses:

| Job status | Job | Canonical result | Assurance report | Notes |
| --- | --- | --- | --- | --- |
| `accepted_for_verification` | `available` | `not_yet_available` | `not_yet_available` | Establishment does not imply execution |
| `pending` | `available` | `not_yet_available` | `not_yet_available` | Future production is still possible |
| `ready` | `available` | `not_yet_available` | `not_yet_available` | Fixed inputs do not imply execution |
| `completed` | `available` | `available` | `available` | One finalized result and scoped report are expected |
| `completed_with_findings` | `available` | `available` | `available` | Findings do not make completion a service failure |
| `unsupported` | `available` | `available` or `not_produced` | `available` or `not_produced` | Unsupported compatibility is not evidence invalidity |
| `invalid_input` | `available` only when determined after job establishment | `available` or `not_produced` | `available` or `not_produced` | Pre-acceptance invalidity creates no job |
| `verification_error` | `available` | `available` or `not_produced` | `available` or `not_produced` | Operational failure is not evidence invalidity |
| `cancelled` | `available` | `available` or `not_produced` | `available` or `not_produced` | Cancellation is not a policy decision |

The proposal does not promise a result or report for every terminal job.
Once a terminal job cannot produce an artifact, retrieval uses `not_produced`, not `not_yet_available`.

## 12. Retrieval Outcomes

Retrieval uses explicit conceptual outcomes rather than an empty object or null:

- `available`: the requested artifact exists and can be returned.
- `not_yet_available`: the job is nonterminal and may still produce the artifact.
- `not_produced`: the job is terminal and did not produce the artifact.
- `not_found`: the resource identity does not exist or is not visible under a future authorization boundary.

No transport status mapping is defined.
Authorization and tenant visibility are not implemented. Combining nonexistent and non-visible resources under a future `not_found` outcome is only a security-design candidate; this proposal does not claim current resource-enumeration protection or tenant-visibility hiding.

| Operation | available | not_yet_available | not_produced | not_found |
| --- | --- | --- | --- | --- |
| `GetVerificationJob` | yes | not applicable | not applicable | yes |
| `GetVerificationResult` | yes | yes | yes | yes |
| `GetAssuranceReport` | yes | yes | yes | yes |

## 13. Retrieval Operations

### 13.1 GetVerificationJob

Input: one role-specific `verification_id`.

Purpose: return the current caller-visible `VerificationJob` lifecycle projection when available.

The operation does not update, retry, cancel, approve, or block the job.

### 13.2 GetVerificationResult

Input: one role-specific `verification_id`.

Purpose: return the canonical `VerificationJobResultRecord`, including its own `verification_job_result_id`, only when the result artifact exists.

The operation preserves the distinction among not yet available, not produced, and not found.

### 13.3 GetAssuranceReport

Input: one role-specific `verification_id`.

Purpose: return the canonical `AssuranceReport`, including its own `report_id`, only when the report artifact exists.

The primary lookup identity is deliberately `verification_id`, not `report_id`, because this minimal service surface is centered on one bounded logical job. A later report-index surface may separately justify report-identity lookup; it is not part of v0.1.

An assurance report is a scoped verification artifact. It is not a certificate, approval, compliance record, safety guarantee, trust declaration, or deployment authorization. Reading it does not mean human review is complete.

## 14. Identity and Reference Rules

The following identities remain distinct:

- `request_id`: caller request identity
- `verification_id`: logical job identity
- `verification_attempt_id`: execution-attempt identity
- `verification_job_result_id`: canonical result identity
- `report_id`: assurance-report identity
- `usage_record_id`: technical-usage identity

Rules:

- `request_id` is not `verification_id`.
- `verification_id` is not `report_id`.
- `report_id` is not `usage_record_id`.
- Raw string uniqueness across all identity namespaces is not required.
- Every reference must identify the correct artifact role.
- No read operation accepts a generic `id` with ambiguous interpretation.
- A response returns the artifact's own identity in addition to the job binding.

## 15. Idempotency, Retry, Replay, and New Job

### 15.1 Idempotent resubmission

The same scope, idempotency key, and fingerprint resolve to the same logical job. No new attempt, result, report, or usage artifact is created.

### 15.2 Retry

Retry means a new `VerificationAttempt` under the same logical job after a retryable operational failure.

Retry is not a public v0.1 operation. Automatic retry policy, retry classes, attempt limits, and backoff remain deferred.

### 15.3 Replay

Replay is expressed only through `SubmitVerificationJob` with explicit `VerificationReplayContext`. It is deterministic re-execution with fixed evidence scope, adapter-manifest pin, and assurance-profile selection. It creates a new logical job referencing the source lineage.

Replay does not overwrite the source job, result, report, attempt, or usage artifact. It is not retry.

### 15.4 Intentional new job

An intentional submission outside the original idempotency boundary creates a new logical job. It is neither idempotent resubmission nor replay unless replay context is explicitly present and valid.

## 16. Adapter Manifest Selection

The caller explicitly pins an adapter ID and opaque exact version and explicitly supplies candidate manifests.

Selection rules remain:

- validate every candidate manifest before selection
- match only exact adapter ID and exact adapter version
- reject no exact match
- reject duplicate exact matches
- reject an incompatible exact match without falling back
- require exact source-type compatibility
- require explicit source-schema support
- require every requested assurance-profile ID/version pair
- require every caller-required mapping capability to be explicitly true

Lifecycle status and limitations are review metadata. They do not affect eligibility, ranking, priority, or tie-breaking.

Selection does not establish adapter behavior, quality, trust, certification, safety, compliance, or production readiness. The proposed service does not provide a runtime registry and does not load or execute adapter modules.

## 17. Technical Usage

`VerificationUsageRecord` remains the canonical technical usage artifact for this contract line.

- A newly processed logical job may produce its own usage artifact.
- Idempotent resubmission resolves the existing usage artifact and does not create another one.
- Replay creates a separate logical job and a separate usage artifact.
- An intentional new job creates a separate usage artifact.

`GetVerificationUsageRecord` is not part of the minimal public surface. Usage retrieval remains deferred and may later belong to a bounded operational or audit surface.

Technical usage is not a billable event, price, charge, cost, invoice, billing decision, or payment instruction.

## 18. Human Review

`human_review_context` records caller intent only. `human_review_recommendations` are reviewer-facing artifacts only.

The proposed API does not create an approval decision. The reviewer remains outside Guard authority. The surface does not support approve, reject, sign-off, certify, or permit-execution operations.

Reading a report does not mean a review occurred or completed.

## 19. Security and Operational Prerequisites

### 19.1 Deferred prerequisites

The following are required before any production service claim, but are not implemented or designed here:

- caller authentication
- tenant or account isolation
- authorization to read artifacts
- secrets and key-retrieval policy
- input-size limits
- evidence-record-count limits
- execution-cost limits
- denial-of-service controls
- retention and deletion rules
- operational audit logging
- a service threat model
- durable persistence
- concurrency control
- distributed idempotency

Because these prerequisites are absent, this proposal is not a production-readiness statement.

The future `not_found` outcome may intentionally cover both nonexistent and non-visible resources, but the security policy is not frozen. This proposal does not define an authentication token, tenant identifier, account schema, or access-control-list schema.

### 19.2 Persistence and asynchronous execution boundary

The proposed semantics require future persistence, but this document does not design a database. They may support future asynchronous execution, but this document does not design a queue, worker, scheduler, or concurrency protocol.

The current fixtures are local deterministic proofs only. They do not guarantee:

- process-restart durability
- concurrent-submission behavior
- distributed idempotency
- worker retry behavior
- eventual-consistency timing

No storage table, queue topic, or worker architecture is proposed.

## 20. Proposed Problem Categories

The following are candidate names only and are not implemented or frozen:

- `malformed_submission`
- `evidence_binding_mismatch`
- `adapter_selection_failed`
- `unsupported_compatibility`
- `idempotency_conflict`
- `resource_not_found`
- `artifact_not_yet_available`
- `artifact_not_produced`
- `internal_verification_service_error`

A problem category is not a findings taxonomy. An internal service error is not evidence invalidity. Unsupported compatibility does not mean a producer is untrusted. No category expresses approval, blocking, certification, or deployment authority.

## 21. Candidate Future Types

The following names may be evaluated in a separate type-only phase:

- `VerificationJobSubmissionEnvelope` - candidate name only; not implemented or frozen
- `VerificationJobSubmissionDisposition` - candidate name only; not implemented or frozen
- `VerificationJobSubmissionResponse` - candidate name only; not implemented or frozen
- `VerificationArtifactAvailability` - candidate name only; not implemented or frozen
- `VerificationServiceProblem` - candidate name only; not implemented or frozen

No approval response, policy-decision response, permit response, deployment response, billable event, or payment response is proposed.

## 22. Implementation Sequence

Runtime consideration requires the following separate decisions in order:

1. human architecture approval of this proposal
2. independently reviewed type-only API contract hardening
3. a persistence-boundary proposal
4. an authentication and tenant-boundary proposal
5. an input and resource-limit contract
6. a service threat model
7. a local transport-adapter spike
8. separately approved runtime implementation consideration

This proposal does not authorize runtime implementation.

The only recommended following phase is:

```text
Type-only Minimal Service API Contracts v0.1
```

It is not a recommendation to build an HTTP server, production API, database implementation, queue worker, or hosted deployment.

## 23. Open Questions

The following questions remain intentionally unresolved:

1. What exact additive fields should a future submission envelope freeze without duplicating existing contracts?
2. What durable idempotency scope and concurrency guarantees are required before submission can be implemented?
3. Which terminal job conditions require a canonical result, and which explicitly permit no result?
4. Which terminal job conditions require a report, and which explicitly permit no report?
5. What authorization policy will distinguish nonexistent from non-visible resources?
6. What persistence, retention, and deletion guarantees apply to raw evidence and generated artifacts?
7. What input, record-count, cryptographic-operation, and execution-cost limits are required?
8. What retry classes and attempt limits can be defined without exposing retry as a public v0.1 operation?
9. What threat assumptions must be closed before a local transport-adapter spike?

These questions are decision gates, not permission to implement runtime behavior.

## 24. Acceptance Criteria

This proposal is acceptable for architecture review only when all of the following remain true:

- exactly four transport-neutral operations are proposed
- submission creates or resolves only one bounded logical job
- pre-acceptance problems remain separate from jobs, findings, and reports
- existing job statuses are reused without authority statuses
- result and report availability remain explicit
- not yet available, not produced, and not found remain distinct
- artifact identities remain role-specific
- idempotency, retry, replay, and intentional new jobs remain separate
- adapter selection remains caller-pinned and exact-only
- technical usage remains separate from commercial interpretation
- human-review artifacts remain outside Guard decision authority
- security, persistence, asynchronous execution, and runtime remain deferred
- no existing type, fixture, verifier, package surface, or command behavior changes

The next action after review may only be a separately approved type-only contract phase.
