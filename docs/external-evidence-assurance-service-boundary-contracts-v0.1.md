# External Evidence Assurance Service Boundary Contracts v0.1

## 1. Purpose

This document freezes the minimum type-only service-boundary contract additions for External Evidence Assurance Service `v0.1`.

This phase is contract-only and additive-only.
It does not implement a service runtime, an HTTP API, persistence, a queue, authentication, tenant isolation, pricing, invoicing, or payment behavior.

## 2. Contract Boundary

This phase keeps the repository on the existing producer-neutral, recommendation-only, non-executing line.

- `VerificationIdempotencyBoundary`
- `VerificationReplayContext`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- additive retention references on `VerificationUsageRecord`
- additive request/job lifecycle boundary fields

This phase preserves `audit` / `permit` / `classify` behavior, public exports, default-off posture, and no authority expansion.

## 3. VerificationJob and VerificationAttempt

`VerificationRequest` remains one bounded logical verification request.

VerificationJob remains the logical unit.

VerificationAttempt is one execution attempt for that job.

The bounded rules are:

- one logical request maps to one `VerificationJob`
- one job may have more than one `VerificationAttempt`
- retryable operational failure may create another attempt for the same job
- retry must not create a new logical job
- a new logical job must not be created unless the caller intentionally submits outside the original idempotency boundary
- attempt state is operational only and does not carry approval, blocking, or billing authority

This phase therefore keeps logical request identity separate from physical execution retries.

`VerificationJobStatus` remains job-scoped only:

- `received` means the request has entered the boundary but request validation is not yet complete
- `validated` means the request envelope is structurally valid but a bounded logical job is not yet established
- `accepted_for_verification` means one bounded logical `VerificationJob` has been established
- `pending` means the accepted job is waiting for its fixed execution prerequisites
- `ready` means required evidence, adapter or manifest, and assurance-profile selections are fixed for execution
- `completed` means verification completed without findings requiring separate findings representation
- `completed_with_findings` means verification completed successfully and produced findings; it is not a service failure
- `unsupported` means the requested evidence, adapter, manifest, profile, or capability is unsupported; it is not evidence invalidity
- `invalid_input` means the submitted request cannot form a valid verification job; it is not a verification finding
- `verification_error` means verification could not complete because of execution or operational failure; it is not proof that evidence is invalid
- `cancelled` means execution stopped without an approval, blocking, or policy decision

## 4. Idempotency, Retry, and Replay

`VerificationIdempotencyBoundary` is caller-provided deduplication intent only.

`request_fingerprint_ref` is a request-shape correlation reference only.
It is not an authenticity, trust, or correctness proof.

`VerificationReplayContext` is deterministic re-execution context only.

This contract keeps the following semantics separate:

- retry
  = a new `VerificationAttempt` under the same accepted job
- idempotent resubmission
  = the same scope, key, and fingerprint resolving to the same logical job
- replay
  = explicit re-execution of fixed evidence scope, adapter or manifest version, and profile selection
- new job
  = intentional submission outside the original idempotency boundary

This phase does not imply automatic reprocessing, hidden retry logic, report reuse, job overwrite, or treating idempotency conflict as a finding.

## 5. Result and Failure Separation

VerificationResult in `packages/guard-core/src/externalEvidence/types.ts` remains the adapter-level evidence verification result.

`VerificationJobResultRecord` is a distinct job-level finalized result artifact.

It is not:

- adapter-level `VerificationResult`
- `VerificationAttempt`
- `AssuranceReport`
- service failure

Successful completed jobs may produce one `VerificationJobResultRecord` and one `AssuranceReport`.

Jobs that are `invalid_input`, `unsupported`, `cancelled`, or operationally failed may terminate without a `VerificationJobResultRecord` and without an `AssuranceReport`.

Findings remain separate from operational failure.
`completed_with_findings` remains a completed verification state, not a service failure.

## 6. Technical Usage vs Commercial Billing Boundary

VerificationUsageRecord remains the current canonical technical usage record contract.

This phase makes the boundary explicit:

```text
VerificationUsageRecord != future billable usage interpretation != pricing != invoice != payment
```

The technical usage boundary may describe:

- verification identifiers
- optional attempt identifier
- evidence and check counters
- optional retention-class reference
- terminal outcome reference
- deterministic result reference

This phase does not introduce a separate `TechnicalUsageRecord` schema or a `BillableUsageEvent` type.
Commercial interpretation remains future-scoped and separately justified if it ever appears.

## 7. Retention Boundary

`RetentionClassReference` remains an opaque reference only.

It is additive to the existing `retention_tier_ref` compatibility field on `VerificationUsageRecord`.
If both appear on one artifact, `retention_tier_ref` remains the compatibility string reference and `retention_class` remains the structured reference.
They are not independent authoritative retention decisions and this phase does not create a precedence rule between conflicting retention selections.

It does not implement storage, deletion, scheduling, legal hold, or tenant behavior.
It does not alter verification findings or `AssuranceReport` semantics.

## 8. Explicit Non-Goals

This phase does not introduce:

- an HTTP API
- persistence
- an asynchronous queue
- authentication
- tenant or account contracts beyond future-scoped references
- pricing
- invoicing
- payment
- Ramen-specific privilege
- approval, blocking, enforcement, certification, or deployment authority

## 9. Compatibility

This phase remains:

- type-only
- additive-only
- producer-neutral
- service-boundary-only
- non-executing

It does not change public exports, aggregate verify configuration, local fixtures, or main-path CLI semantics.
