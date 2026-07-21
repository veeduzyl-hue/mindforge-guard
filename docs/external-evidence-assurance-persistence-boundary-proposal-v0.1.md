# External Evidence Assurance Persistence Boundary Proposal v0.1

## 1. Status

- Status: `proposal-only`
- Scope: `docs-only`
- Storage model: `storage-technology-neutral`
- Transport: `transport-neutral`
- Implementation status: `not implemented`
- Authority status: `durability and retrieval consistency only`

This document proposes semantic durability boundaries for a possible future
External Evidence Assurance service. It does not change current contracts,
fixtures, public exports, package scripts, CLI behavior, or runtime behavior.

MindForge Guard remains verification-only, recommendation-only, additive-only,
non-executing, non-control-plane, human-review-oriented, producer-neutral, and
default-off.

```text
External systems issue evidence. Guard verifies evidence.
```

Persistence can preserve bounded artifact durability, artifact identity
continuity, idempotency resolution continuity, lifecycle and publication
consistency, and recovery-safe retrieval semantics. Persistence does not make
evidence valid, a producer trusted, a result compliant, an artifact certified,
storage secure, or a service production-ready.

## 2. Purpose

The purpose of this proposal is to define the minimum semantic boundary that a
future persistence implementation would have to preserve across process restart,
concurrent submission, partial write, response loss, and artifact retrieval.

The proposal freezes conceptual relationships among:

- logical job establishment;
- idempotency claims;
- attempts;
- canonical results and reports;
- technical usage;
- replay lineage;
- raw evidence and derived artifacts;
- retention and deletion decisions.

It does not select an implementation or authorize one.

## 3. Boundary and Non-Goals

This proposal is not:

- a database schema or SQL specification;
- an object-storage design;
- a migration plan or backfill plan;
- an ORM model;
- a storage-adapter implementation;
- a queue, worker, scheduler, stream, or event-bus architecture;
- an HTTP route, endpoint, or webhook design;
- a backup or disaster-recovery commitment;
- an authentication, authorization, tenant, or account design;
- an encryption or key-management implementation;
- a production-readiness declaration;
- a security certification or compliance declaration;
- a commercial service, billing, pricing, payment, or availability commitment.

No approval, blocking, execution, deployment, certification, trust,
compliance, billing, or payment authority is introduced. The term
`authoritative record` below means only the canonical persisted representation
used to answer a future service retrieval. It does not mean decision authority.

## 4. Definitions

### 4.1 Durable

A record is durable when it remains resolvable by its canonical role-specific
identity after process restart. Durability is a semantic requirement; this
proposal does not define the storage mechanism that satisfies it.

### 4.2 Authoritative record

An authoritative record is the canonical persisted representation on which a
future service response relies. It is authoritative only for artifact identity,
binding, lifecycle projection, and retrieval consistency. It is not an
authority decision about evidence, a producer, or an external action.

### 4.3 Published artifact

A published artifact has satisfied its role-specific identity, job binding,
content consistency, and durability requirements and may therefore be returned
through a future retrieval surface. Internal existence alone does not make an
artifact published.

### 4.4 Logical atomic boundary

A logical atomic boundary is a group of semantic changes that must either all
become durable and publicly resolvable or all remain publicly invisible.

Logical atomicity does not mean a SQL transaction. It does not prescribe a
database transaction, lock, index, table, document structure, vendor, or
single-node versus distributed implementation.

### 4.5 Staged or orphan artifact

A staged artifact is internal data written while a logical boundary is being
assembled but not yet bound as a canonical published artifact. An orphan
artifact is staged or incomplete data that remains after the intended boundary
did not complete.

Staged and orphan artifacts:

- must not be exposed through public retrieval;
- must not be interpreted as a canonical result or report;
- must not make a job appear completed;
- require future cleanup or reconciliation semantics, which remain deferred.

## 5. Existing Contract Reuse

This proposal reuses existing conceptual contracts without creating new source
types:

- `VerificationRequest` remains the caller request contract;
- `EvidencePackage` remains the bounded evidence package;
- `AdapterManifest` remains the selected adapter-manifest content;
- `VerificationJob` remains one accepted logical verification unit;
- `VerificationAttempt` remains one execution attempt for that job;
- `VerificationJobResultRecord` remains the canonical finalized job result;
- `AssuranceReport` remains the reviewer-facing report;
- `VerificationUsageRecord` remains the technical usage artifact;
- `VerificationIdempotencyBoundary` remains caller-provided deduplication intent;
- `VerificationReplayContext` remains explicit deterministic replay lineage.

Role-specific identities remain distinct. A generic record ID must not replace
`request_id`, `verification_id`, `verification_attempt_id`,
`verification_job_result_id`, `report_id`, or `usage_record_id`.

## 6. Canonical Artifact Inventory

| Artifact role | Identity role | Durability requirement | Mutability | Canonical binding | Public retrieval | Retention frozen? |
| --- | --- | --- | --- | --- | --- | --- |
| `VerificationRequest` | `request_id` supplied in the bounded request | Immutable accepted-request snapshot, canonical representation, or content-addressed reference recoverable for the job | Fixed after job establishment | One request reference resolving to identical accepted semantics | Only through approved future job/request projections | No |
| `EvidencePackage` | `package_id` plus package version and integrity binding | Identity and canonical digest or equivalent binding durable for the job | Job binding immutable; raw payload separately retained | Request and job evidence binding | No new public raw-evidence operation proposed | No |
| selected `AdapterManifest` | exact adapter ID/version plus snapshot or content identity | Exact selected content recoverable for the job | Immutable for the established job | Request, job, profiles, capabilities, evidence compatibility | No runtime registry retrieval proposed | No |
| `VerificationJob` | `verification_id` | Durable before `created_new_job` | Fixed bindings immutable; constrained status projection mutable | Request, evidence, selected manifest, profiles, idempotency, replay | Future `GetVerificationJob` only after publication | No |
| `VerificationAttempt` | `verification_attempt_id` | Durable when an attempt is admitted into the job lineage | Identity and fixed bindings immutable; lifecycle projection conditionally mutable until terminal; retry appends a new identity | One `verification_id` and fixed job inputs | No public attempt operation proposed | No |
| `VerificationJobResultRecord` | `verification_job_result_id` | Durable before completed status becomes public | Immutable after publication | One job, optional final attempt, findings, report reference | Future result retrieval after publication | No |
| `AssuranceReport` | `report_id` | Durable before completed status becomes public | Immutable after publication | One job, evidence, producer, adapter, profiles, findings | Future report retrieval after publication | No |
| `VerificationUsageRecord` | `usage_record_id` | Durable when published as the technical usage artifact | Immutable after publication | One job, optional attempt, terminal outcome, result | Not in the current four-operation public surface | No |
| `VerificationIdempotencyBoundary` | effective idempotency scope plus key and effective canonical fingerprint | Durable with job establishment when present | Immutable for that logical job | Exactly one resolvable logical job | Resolved indirectly by submission | No |
| `VerificationReplayContext` | replay reference and source lineage | Durable with the replay job | Immutable for that replay job | New job to source job and optional source attempt | Visible only through approved future projections | No |

Operational logs are not canonical verification artifacts and do not replace
any role in this inventory.

## 7. Durable Job Establishment

A future service must define a `durable job-establishment boundary`. Before it
returns `created_new_job`, it must durably bind at least:

- `verification_id` and the `VerificationJob` identity;
- the `VerificationRequestReference` role-specific link;
- an immutable accepted `VerificationRequest` snapshot, immutable canonical
  accepted-request representation, or immutable content-addressed reference
  capable of recovering identical job-establishment semantics;
- `EvidencePackage` identity and integrity binding;
- exact selected adapter ID and version;
- an immutable selected `AdapterManifest` snapshot or immutable
  content-addressed reference that can recover identical content;
- requested assurance profiles;
- required mapping capabilities;
- the idempotency boundary, effective idempotency scope, and effective
  canonical fingerprint, when present;
- replay lineage, when present.

These are semantic bindings, not proposed source fields. This proposal does not
freeze serialization, database fields, table or document structure, or storage
representation.

`VerificationRequestReference` is a role-specific link, not the complete
accepted request content. The link must resolve to an immutable accepted-request
representation. A mutable record in the caller's system must not be the only
historical request source, and the same `request_id` must not resolve to changed
bounded semantics after job establishment.

The retained representation must recover every accepted request semantic that
affects evidence binding, the exact adapter pin, requested assurance profiles,
the idempotency boundary, replay context, job establishment, or the effective
canonical fingerprint. This requirement introduces no new source field and
selects no request-store, snapshot, serialization, or storage format.

If any required part is not durable, the service must not return
`created_new_job`. Internal allocation of an identity or partial write of a job
record is insufficient.

After `created_new_job` is returned, the job identity must be resolvable from
authoritative persistence after restart. The response does not mean execution
started, verification succeeded, or any result or report is available.

## 8. Evidence and Manifest Binding

The durable evidence binding must retain at least:

- evidence package identity;
- source reference;
- integrity digest or equivalent canonical evidence binding;
- source schema and requested profile bindings;
- relationship to the verification request and job.

Raw evidence payload retention is a separate decision from retention of the
canonical identity and digest. Deleting raw payload must not rewrite a
historical digest, result, report, or job binding. If raw payload is no longer
available, the service must not claim that verification can be re-executed or
replayed from that payload.

Persisting only adapter ID and version and later looking up mutable registry
content is insufficient. The exact selected manifest snapshot, or an immutable
content-addressed reference capable of recovering identical content, must be
retained. Future registry or lifecycle-status changes must not alter historical
job bindings.

This retention proves historical selection continuity only. It does not prove
adapter quality, trust, certification, safety, compliance, or production
readiness.

The full candidate-manifest set need not be permanently retained in v0.1. If
that set affects a future idempotency fingerprint, its canonical representation
or digest must be retained. Exact treatment remains an open question.

## 9. Durable Idempotency

An `effective canonical fingerprint` is the canonical comparison value that a
future service derives from bounded submission semantics or accepts only after
independent validation against frozen derivation rules. It is the fingerprint
that a durable idempotency claim actually binds and compares. Caller-controlled
text alone does not determine it.

An `effective idempotency scope` is the canonical scope that a future service
establishes or independently validates for durable idempotency comparison. It
combines with the idempotency key and effective canonical fingerprint to define
the durable comparison boundary. Caller-controlled text alone does not create
scope authority.

`scope_reference` is only an optional caller-provided opaque scope hint,
correlation reference, or input to future scope derivation or validation. It is
not the effective idempotency scope and does not prove caller identity, tenant
identity, account ownership, authorization, cross-tenant isolation, or
canonical scope equality. Equality of `scope_reference` strings alone must not
establish effective-scope equality.

Before creating a durable idempotency claim, the future service must establish
both an effective idempotency scope and an effective canonical fingerprint. The
claim logically binds the effective idempotency scope, idempotency key,
effective canonical fingerprint, and `verification_id`. This is a semantic
requirement, not a proposed source-type change.

The minimum idempotency semantics are:

### 9.1 Same effective scope, same key, same effective fingerprint

The submission resolves to the same `verification_id` and the same logical job.
It must not create a new job, attempt, result, report, or usage artifact.

### 9.2 Same effective scope, same key, different effective fingerprint

The submission produces `idempotency_conflict`. It must not overwrite or
rebind the existing job, request, evidence, selected manifest, or lineage.

### 9.3 Different effective scope

Submissions must not resolve to the same job solely because their idempotency
keys and effective canonical fingerprints match. Different effective scopes
remain different durable idempotency boundaries.

### 9.4 Effective scope or fingerprint cannot be established

When a submission declares an idempotency boundary but the service cannot
establish or independently validate its effective scope or fingerprint, the
service must not create a durable idempotency claim, return
`resolved_existing_job`, treat `scope_reference` as canonical scope, substitute
a global scope, assume that content-identical submissions are equal, or proceed
only from `request_fingerprint_ref`. The exact pre-acceptance problem category
remains deferred; this proposal introduces no problem literal or source type.

### 9.5 Concurrent submissions within one declared boundary

Concurrent submissions sharing the same effective idempotency scope,
idempotency key, and effective canonical fingerprint must establish at most one
logical job. Each successful caller resolution must identify that same job.
This at-most-one rule applies only within that declared durable idempotency
boundary. Different keys or different effective scopes may establish different
logical jobs.

Submissions without an idempotency boundary are not subject to this deduplication
rule. Persistence must not perform implicit global content deduplication, and an
identical evidence digest alone does not identify the same logical job. An
intentional new job remains outside the prior idempotency boundary.

This requirement does not select a lock service, uniqueness mechanism,
isolation level, or consensus algorithm.

### 9.6 Logical atomicity

The durable idempotency claim and durable job-establishment boundary form one
logical atomic boundary. Either both become durable and publicly resolvable, or
neither becomes publicly resolvable.

The service must not expose:

- a durable idempotency claim with no resolvable job;
- a public job with no corresponding durable idempotency binding when the
  submission declared one;
- different jobs for concurrent submissions with the same effective
  idempotency scope, key, and effective canonical fingerprint.

## 10. Fingerprint Boundary

The exact fingerprint algorithm, encoding, canonicalization, hash algorithm,
and durable lookup order remain deferred. This proposal does not define
canonical JSON or a cryptographic profile.

A later decision must evaluate whether the fingerprint covers:

- request identity and bounded request semantics;
- evidence package identity and integrity binding;
- exact adapter pin;
- selected manifest identity or content digest;
- requested assurance profiles;
- required mapping capabilities;
- candidate-manifest set when it can change selection;
- replay context;
- relevant submission schema version.

`request_fingerprint_ref` is an optional caller-provided opaque correlation or
audit reference. It is not the effective canonical fingerprint and is not
authenticity, trust, correctness, or fingerprint-equality proof. Equality of
caller references alone must not establish submission equality, and absence of
the reference must not make two submissions equal. A future service must derive
or independently validate the effective canonical fingerprint rather than
trusting a caller claim without bounded validation.

Which optional request fields, including `caller_reference`,
`customer_reference`, `request_metadata`, and `human_review_context`, affect the
effective canonical fingerprint remains deferred. Non-semantic metadata may be
subject to separately designed retention or redaction only if that does not
change fixed job bindings, accepted-request semantics, or fingerprint meaning.
This proposal defines no PII, redaction, or tenant policy.

## 11. Immutable Job Bindings

Once a logical job is established, the following must not be changed in place:

- `verification_id`;
- request reference and immutable accepted-request semantic binding;
- evidence package identity and integrity binding;
- selected adapter ID and version;
- selected manifest snapshot or immutable reference;
- requested assurance profiles;
- required mapping capabilities;
- idempotency boundary;
- effective idempotency scope, when an idempotency boundary is present;
- effective canonical fingerprint, when an idempotency boundary is present;
- replay source lineage.

A different binding requires an intentional new job or an explicit replay job.
Updating the old job to express new evidence, a different manifest, or a new
profile selection is forbidden.

Deleting or redacting future non-semantic request metadata must not change the
established request binding or the effective canonical fingerprint. The
classification and lifecycle of such metadata remain deferred.

After a durable idempotency claim and logical job are established, neither the
effective idempotency scope nor the effective canonical fingerprint may change
in place. Later changes to `scope_reference` or `request_fingerprint_ref` must
not rewrite those historical effective values. A new scope, key, fingerprint,
or submission semantic requires an intentional new job or another boundary
that satisfies the existing new-job and idempotency rules. No source field is
introduced by this requirement.

## 12. Job State and Terminal Finality

Job identity and fixed bindings are immutable. Job status is a constrained
mutable projection of the same logical job.

This proposal adds no `VerificationJobStatus` value. It preserves the existing
status vocabulary and requires:

- status changes to validate an expected prior state or equivalent conditional
  semantics;
- a terminal status never to regress to a nonterminal status;
- a terminal job never to be rewritten as a different terminal conclusion;
- every existing terminal status (`completed`, `completed_with_findings`,
  `unsupported`, `invalid_input`, `verification_error`, and `cancelled`) to
  close the same-job attempt lineage: no later attempt may be appended and the
  job may not be reopened;
- retry state to remain attempt-scoped rather than changing fixed job inputs.

An attempt status is not a job status; they express different levels of
conclusion. A `failed` attempt does not by itself require the job to become
`verification_error`. A job may remain nonterminal and continuable after a
durable failed attempt so that a future, separately approved bounded retry
policy may append another attempt. The job may be published as
`verification_error` only when that future policy, an attempt limit, or an
explicit job-finalization decision determines that no further attempt will be
made. Once published, `verification_error` is final: no attempt may be added,
the job may not return to `pending`, `ready`, or another nonterminal state, and
it may not be rewritten as completed or as another terminal conclusion.

Reprocessing after any terminal conclusion requires an intentional new job or
an explicit replay job. This proposal defines no reopen operation or contract.

Before any terminal job status is published, no attempt admitted under that job
may remain in authoritative persistence with nonterminal status `accepted` or
`running`. Hiding an attempt from projection does not satisfy this consistency
rule. The attempt must first reach an explicit terminal status, or a future
separately approved finalization contract must establish another frozen,
consistent outcome that is not retained as authoritative `accepted` or
`running`. Until such a contract is frozen, any authoritative nonterminal
attempt prohibits terminal job publication.

A terminal job and an authoritative nonterminal attempt must not coexist. This
includes a cancelled job with a running attempt and a `verification_error` job
with an accepted or running attempt. The complete mapping between job terminal
statuses and attempt terminal statuses remains deferred, and no worker recovery
mechanism is defined here.

The exact concurrency mechanism and complete scheduler or worker transition
graph remain deferred. No authority status such as approved, blocked,
permitted, deployed, certified, compliant, trusted, or safe is introduced.

## 13. Attempt Persistence

Attempt identity and fixed bindings are immutable after establishment:

- `verification_attempt_id`;
- `verification_id`;
- `attempt_number`;
- `created_at`;
- the fixed job-input relationship;
- replay context, when present.

The attempt lifecycle projection is conditionally mutable before attempt
terminalization. Its status, `started_at`, `completed_at`, `failure_kind`, and
result reference when applicable may advance only in a manner consistent with
the expected prior state or equivalent conditional semantics. Mutable does not
mean arbitrary overwrite, and this proposal selects no transaction, lock, or
concurrency mechanism.

`created_at` is immutable after attempt establishment. Retry creates a new
attempt with its own identity and `created_at`; it must not renumber or retime a
prior attempt. This proposal defines no clock service or additional timestamp
format rule.

The existing attempt statuses remain separated as follows:

- nonterminal: `accepted`, `running`;
- terminal: `completed`, `failed`, `cancelled`.

A terminal attempt must not return to `accepted` or `running` and must not be
rewritten as another terminal status. A failed attempt remains failed, a
cancelled attempt remains cancelled, and a completed attempt remains completed.
This proposal adds no attempt status, and the complete attempt transition graph
remains deferred.

Append-only describes the job's attempt lineage, not an immutable lifecycle
projection for an admitted attempt:

- retry appends a new attempt identity to the job lineage;
- a prior attempt is not overwritten, deleted, or renumbered by retry;
- an admitted attempt may conditionally advance from `accepted` to `running`
  and then to a terminal projection;
- idempotent resubmission does not create an attempt;
- replay creates a new logical job with an independent attempt lineage.

A same-job retry is temporally permitted only before terminal finalization and
only while the job remains nonterminal and continuable. It retains the same
`verification_id` and all fixed request, evidence, selected-manifest, profile,
and capability bindings. The failed attempt remains durable and append-only;
the retry, if a future policy authorizes one, appends a separately identified
attempt rather than replacing or revising the failed attempt.

Idempotent resubmission is resolution of the established job, not retry. Replay
is a new logical job, not retry. Crash recovery or storage reconciliation is
also not automatically retry: whether recovery resumes the same unfinished
attempt or appends a new attempt remains deferred. Recovery cannot reopen or
alter a published terminal job. This proposal defines public consistency only;
it defines no worker recovery mechanism.

Automatic retry, retry classes, attempt limits, delay policy, and execution
architecture remain deferred. Attempt-number allocation, retryable error
classification, retry exhaustion, backoff, scheduler, retry worker, and queue
behavior are likewise deferred. Attempt persistence does not define a queue or
worker design.

## 14. Completion Publication

For `completed` and `completed_with_findings`, a future service must not publish
the terminal job status until all of the following are durable and mutually
consistent:

- final `VerificationJob` status;
- exactly one canonical `VerificationJobResultRecord`;
- exactly one canonical `AssuranceReport`;
- matching `verification_id` bindings;
- matching result and report references;
- the result-referenced final attempt, when `verification_attempt_id` is
  present, bound to the same `verification_id` with terminal status
  `completed`, or another immutable and explainable completion lineage bound to
  that `verification_id`.

This group forms the `logical completion-publication boundary`.

The boundary is semantic and does not prescribe a database transaction. It
forbids publishing a completed job first and filling in the result or report
later. It also forbids publishing a result or report bound to another job.

While a job remains publicly visible as `completed` or
`completed_with_findings`, its canonical result and AssuranceReport, their
canonical result and report identities, and their correct `verification_id`
bindings must remain durable and resolvable. Completion publication is
therefore a continuing public consistency invariant, not only a write-time
condition.

The completion lineage is also a continuing invariant. While the completed
resource set remains public, a result-referenced `VerificationAttempt`, or the
alternative immutable completion lineage when no attempt ID is present, must
remain durable, authoritatively resolvable, and referentially consistent. A
result must not reference a missing attempt or an attempt belonging to another
job. A completed result must not reference an attempt that is `accepted`,
`running`, `failed`, or `cancelled`.

`completed_with_findings` remains successful completion with findings. Findings
are not service failure, approval, blocking, or evidence invalidity by
themselves.

## 15. Canonical Result and Report

Each completed logical job has exactly one canonical result and exactly one
canonical AssuranceReport. After publication:

- both artifacts are immutable;
- repeating a write with the same role-specific identity and identical content
  may be treated as idempotent internal repetition;
- the same identity with different content is a consistency conflict;
- conflicting content must not silently overwrite the published artifact;
- historical result or report content must not be revised in place.

Correction or re-verification requires a new logical job or explicit replay
lineage. This proposal introduces no new conflict type or runtime handler.

When a canonical result includes `verification_attempt_id`, that attempt must
bind to the same `verification_id`, have terminal status `completed`, and remain
resolvable for the public lifetime of the completed resource set. It must not
expire independently or leave a dangling reference. When the optional attempt
ID is absent, an immutable, durable, explainable completion lineage bound to
that `verification_id` must remain resolvable instead. No new source type is
introduced.

## 16. Non-Completed Terminal Jobs

For `unsupported`, `invalid_input`, `verification_error`, and `cancelled`, this
proposal does not assume that a result or report always exists.

Retrieval must preserve:

- `available` when a correctly bound canonical artifact exists;
- `not_produced` when the job is terminal and no canonical artifact was ever
  published for that job;
- never `not_yet_available` for a terminal job;
- no fabricated empty artifact when none was canonically published.

Which non-completed terminal states must produce which artifacts remains open.
Any artifact that does exist must have the correct job binding and must satisfy
its publication boundary.

Staged bytes, temporary computation, an incomplete artifact, or an orphan
artifact do not constitute canonical publication. Their internal existence
does not make retrieval `available` and must not be exposed. A terminal job may
therefore return `not_produced` when such internal data existed but no canonical
artifact was ever published.

The minimum job-attempt consistency constraints remain technology-neutral:

- `verification_error` must not retain an authoritative attempt still
  `accepted` or `running`;
- a cancelled job must not retain an authoritative attempt still `accepted` or
  `running`;
- `unsupported` or `invalid_input` may terminalize without an attempt;
- the exact permitted terminal attempt status for each non-completed terminal
  job remains deferred.

## 17. Technical Usage

`VerificationUsageRecord` remains a technical artifact. It is not a billable
event, price, charge, cost, invoice, billing decision, or payment instruction.

- idempotent resubmission creates no new usage artifact;
- when canonical usage is already published, idempotent resubmission continues
  to associate with that original usage artifact;
- when usage is not yet published, idempotent resubmission must not fabricate a
  usage artifact;
- replay creates a new job and independent usage lineage;
- an intentional new job creates independent usage lineage;
- a published usage record is immutable;
- usage retrieval remains outside the current four-operation public surface.

Whether usage is included in the completion-publication logical atomic boundary,
whether every non-completed terminal job produces usage, and usage retention
duration remain open decisions.

## 18. Replay and Intentional New Jobs

Replay:

- creates a new `verification_id`;
- preserves source `verification_id` lineage and, when applicable, source
  attempt lineage;
- preserves fixed evidence, selected manifest, and profile semantics;
- never overwrites source job, attempt, result, report, or usage artifacts;
- must not claim replay is possible when required raw evidence is unavailable.

An intentional new job is outside the original idempotency boundary. It creates
a new job identity and independent artifact lineage. It must not reuse or mutate
the old job to express a new binding.

Replay is not retry. Retry remains a new attempt under the same logical job.

## 19. Retrieval Consistency

Future retrieval semantics must be based only on durable published state:

- `GetVerificationJob` returns only a durable published job projection;
- `GetVerificationResult` returns `available` only for a durable, canonical,
  correctly bound result;
- `GetAssuranceReport` returns `available` only for a durable, canonical,
  correctly bound report.

Availability remains distinct:

- `not_yet_available`: a nonterminal job may still canonically publish the
  artifact;
- `not_produced`: the job is terminal and never canonically published the
  artifact;
- `not_found`: the identity does not exist or may be non-visible under a future
  authorization or visibility boundary.

Null or an empty object must not hide these outcomes. A completed job must not
expose only one member of the canonical result/report pair. A publicly visible
`completed` or `completed_with_findings` job must not resolve its canonical
result or report as `not_found` or `not_produced`.

Replica, cache, and eventual-consistency policy remain deferred. This proposal
does not claim current read-your-write behavior, linearizability, or tenant
hiding.

## 20. Crash and Partial-Write Semantics

The conceptual recovery rules are:

### 20.1 Crash before durable establishment

No job may be returned or recovered as a public job.

### 20.2 Idempotency claim succeeds but job establishment fails

No publicly resolvable orphan claim may remain. Claim and job establishment
must remain jointly invisible until their logical atomic boundary completes.

### 20.3 Job becomes durable but the submission response is lost

A resubmission with the same effective idempotency scope, idempotency key, and
effective canonical fingerprint must resolve to the existing job and its
existing artifact identities. It must not create a replacement job.

Content identity alone is insufficient. A submission without an idempotency
boundary does not automatically recover the old job, and a different effective
scope or key is not governed by this recovery rule. Persistence must not use
lost-response recovery as implicit global content deduplication.

### 20.4 Result or report is staged but completion publication fails

The staged data must not appear as a canonical completed artifact set, and the
job must not be publicly projected as completed.

### 20.5 Crash after completion publication

The job, result, and report must remain mutually consistent and recoverable.

### 20.6 Orphan internal artifact

The artifact must remain hidden from public retrieval. Cleanup,
reconciliation, and repair implementation remain deferred.

### 20.7 Failed attempt persists while the job remains nonterminal

The failed attempt remains append-only. A future bounded retry policy may append
a new attempt while the job remains continuable, but persistence alone does not
authorize or schedule that retry.

### 20.8 Failed attempt persists with terminal `verification_error`

No later attempt may be appended. Recovery must not reopen the job or replace
the terminal conclusion.

### 20.9 Recovery of unfinished execution

Crash recovery and storage reconciliation do not automatically constitute a
retry. Whether a future recovery design resumes the same unfinished attempt or
creates a new attempt remains deferred. Repairing staged or orphan data must
not modify a canonical published artifact or alter any published terminal
conclusion.

### 20.10 Post-completion artifact retention inconsistency

Loss or expiry of a canonical result or report after completion publication
must not be exposed as a normal partial retrieval or as `not_produced`. It is a
resource-set consistency or future deletion-semantics issue. Any orphan or
partially repaired state remains hidden until the completed resource set is
referentially consistent.

### 20.11 Staged artifact existed but was never published

Terminal retrieval may be `not_produced` because internal staged, temporary,
incomplete, or orphan data is not canonical publication. That internal data
must remain hidden and must not be returned as `available`.

### 20.12 Published artifact later becomes unavailable

The outcome must not become `not_produced`. It belongs to future deletion,
visibility, or consistency semantics, none of which is selected here.

### 20.13 Referenced completion attempt disappears

A completed resource set with a dangling `verification_attempt_id` must not
continue to be exposed as a normal consistent completed set. The referenced
attempt or alternative completion lineage remains part of the consistency
boundary. Lineage loss must not be reinterpreted as normal `not_produced`.

### 20.14 Completion-lineage repair

Repair must not revise the canonical result, replace its referenced attempt, or
change the historical terminal conclusion. Reconciliation behavior remains
deferred, and partially repaired state remains publicly hidden.

## 21. Retention

Conceptual retention classes must distinguish at least:

- raw evidence payload;
- evidence identity and digest;
- job fixed bindings;
- idempotency binding;
- attempt records;
- canonical result;
- AssuranceReport;
- technical usage;
- replay lineage;
- operational logs.

No retention duration is frozen. Raw evidence may have a different retention
period from derived artifacts. Deletion must not break the identity integrity
of artifacts that remain.

Canonical results and AssuranceReports required by a publicly visible
`completed` or `completed_with_findings` job form a retained completed resource
set with that job. Neither artifact may independently expire while the public
job remains visible. A future deletion design may make the entire set
consistently non-visible, use referentially consistent tombstone semantics, or
define another consistent model, but this proposal does not select among those
options. It forbids a partially visible completed set.

Raw evidence payloads and operational logs may have independent retention
policies because neither substitutes for the canonical completed resource set.
This separation does not permit removal of a required result or report while
retaining a publicly visible completed job.

A `VerificationAttempt` referenced by the canonical result, or the alternative
immutable completion lineage used when no attempt ID is present, belongs to the
completed resource set's referential-consistency boundary. It must remain
durable and resolvable while that completed set remains public. It must not
expire independently or leave a dangling reference.

Historical attempts not referenced by canonical completion remain append-only,
but this proposal does not require them to be retained forever. Their retention
duration and any future deletion or archival model remain deferred and must not
rewrite job, result, report, or completion-lineage semantics.

Premature expiration of an idempotency binding can change resubmission semantics.
Premature deletion of replay lineage can break provenance. Operational logs are
not canonical verification artifacts and cannot substitute for retained job or
artifact bindings.

## 22. Deletion and Tombstones

`DeleteJob` is not part of the minimal service API, and this proposal adds no
public deletion operation.

Administrative deletion, retention expiry, redaction, legal hold, hard deletion,
and tombstone behavior require separate design. Neither hard deletion nor a
tombstone model is selected here.

Before that design is approved, this proposal authorizes neither independent
deletion of a completed job's canonical result or report nor retention of a
publicly visible completed job after either required artifact becomes
unresolvable. No `DeleteJob` or `DeleteArtifact` operation is proposed.

Deletion must not:

- silently present a formerly published artifact as `not_produced`;
- claim future replay remains possible after required raw evidence is removed;
- rewrite a historical job status to a different semantic conclusion;
- leave unresolved references whose meaning was not frozen in advance.

`not_produced` means only that no canonical artifact was ever published for the
terminal job. Internal computation or staged data does not change that outcome.
It must not describe an artifact that was canonically published and later
removed by retention, administration, redaction, or legal process.

`not_found` may continue to cover a nonexistent identity or a resource made
non-visible by a future boundary, but hard-delete responses, tombstones,
visibility rules, deletion response semantics, and administrative APIs remain
deferred. A future design must not use deletion to pretend that a published
artifact never existed, and it must preserve the referential consistency of the
completed resource set.

Referential-integrity behavior must be approved before implementation. This
proposal makes no legal, privacy-regulation, or compliance-satisfaction claim.

## 23. Schema and Versioning

Artifact schema version, submission composition version, and future storage
representation version are separate concerns.

- storage representation version must not change artifact semantics;
- migration must not silently change identity, digest, findings, result, or
  report content;
- migration implementation, DDL, migration scripts, and backfill jobs are out
  of scope;
- no serialization library is selected.

## 24. Integrity Boundary

Durable storage is not cryptographic verification. A database constraint is not
evidence authenticity. A checksum is not signature verification. Persistence
does not replace Guard verification.

Historical artifact bindings must preserve existing identity and digest
semantics. Storage-corruption detection, integrity at rest, backup validation,
and recovery testing remain deferred. This proposal makes no tamper-proof or
secure-storage claim.

## 25. Security, Authentication, and Tenant Deferrals

The following remain outside this proposal:

- authentication and authorization;
- tenant and account isolation;
- resource visibility policy;
- encryption-at-rest implementation and key management;
- secret retrieval and access-control lists;
- cross-tenant uniqueness;
- data residency and legal hold;
- backup access and operator privilege.

Effective idempotency scope may eventually depend on future authentication,
caller identity, credential, tenant, or explicit scope-intent rules, but those
rules are not frozen here. Until they are separately approved,
`scope_reference` must not be represented as tenant isolation or authorization.
The future Authentication and Tenant Boundary Proposal must decide how scope
derivation relates to identity and resource visibility.

No `tenant_id`, `account_id`, auth token, ACL schema, or encryption-key field is
introduced. Because these prerequisites are absent, this proposal is not a
production-readiness declaration. The future meaning of `not_found` under an
authorization boundary remains deferred.

## 26. Technology Neutrality

This proposal intentionally uses only semantic terms such as durable record,
authoritative persistence, logical atomic boundary, conditional write semantics,
immutable snapshot, content-addressed reference, published artifact, and staged
artifact.

It selects no database product, object store, cache, message broker, ORM,
table, column, collection, bucket, index definition, foreign key, transaction
syntax, isolation level, connection string, or cloud vendor service.

These conceptual terms must not be treated as an implicit implementation map.

## 27. Deferred Runtime Architecture

Future asynchronous execution may depend on durable persistence, but execution
architecture remains deferred. This proposal does not design a queue topic,
worker, scheduler, retry worker, dead-letter queue, event bus, webhook, stream,
or background processor.

Attempt persistence is not queue design. Persistence grants no permission to
implement a worker, transport, hosted service, or external-action execution.

## 28. Open Questions

The following are decision gates, not runtime implementation authorization:

1. What is the exact idempotency fingerprint composition?
2. What canonicalization and hash algorithm should a fingerprint use?
3. Must the full candidate-manifest set be retained, or only a canonical digest?
4. How long is raw evidence payload retained?
5. Which non-completed terminal jobs must produce a result or report?
6. Is `VerificationUsageRecord` part of the completion atomic boundary?
7. Is a durable status-transition history required?
8. Should deletion use hard deletion or tombstones?
9. How does idempotency retention expiry affect new-job semantics?
10. What raw evidence availability guarantees are required for replay?
11. What minimum replica or cache consistency is required?
12. How is orphan artifact reconciliation defined?
13. What storage-corruption detection and backup validation are required?
14. How are artifact and storage representation migrations reviewed?
15. How will authentication and tenant isolation affect `not_found`?
16. Which attempt failure kinds are retryable, if any?
17. Which bounded decision changes a nonterminal job with failed attempts to
    terminal `verification_error`?
18. What attempt limit or retry-exhaustion rule applies, if any?
19. Does recovery resume an unfinished attempt or append a new attempt?
20. Must completed job, canonical result, and AssuranceReport share the same
    retention and visibility lifetime?
21. How will a future deletion model preserve completed-set consistency?
22. What tombstone or visibility semantics apply to previously published
    artifacts that become non-visible?
23. Is the effective canonical fingerprint service-computed, an independently
    validated caller claim, or a combination of both?
24. What correlation and mismatch semantics apply between
    `request_fingerprint_ref` and the effective canonical fingerprint,
    including any pre-acceptance outcome?
25. Which `VerificationRequest` fields enter the effective canonical
    fingerprint?
26. Is the accepted request retained as a full snapshot, canonical
    representation, or content-addressed reference?
27. How can non-semantic request metadata retention or redaction preserve
    historical request bindings and fingerprint meaning?
28. What visibility lifetime must a completion-referenced attempt share with
    its job, result, and report?
29. When `verification_attempt_id` is absent, what is the minimum explainable
    completion lineage?
30. What retention applies to attempts not referenced by canonical completion?
31. How is effective idempotency scope established from caller, credential,
    tenant, or explicit scope intent?
32. When `scope_reference` is absent, is idempotency allowed and what non-global
    default, if any, applies?
33. How are scope normalization, case sensitivity, and versioning frozen?
34. Which final attempt statuses are permitted for each terminal job status?
35. Do job terminalization and final-attempt terminalization share one logical
    publication boundary?
36. After a crash, how is a running attempt recovered, failed, or cancelled?
37. Must attempt status-transition history be retained durably?

## 29. Implementation Sequence

Any future progression must remain separately approved and follow this order:

1. human approval of this Persistence Boundary Proposal;
2. decide whether a separate type-only persistence contract is required;
3. Authentication and Tenant Boundary Proposal v0.1;
4. Input and Resource Limit Contract;
5. Service Threat Model;
6. Local Transport Adapter Spike;
7. only then consider a separately approved runtime persistence implementation.

The recommended following phase is `Authentication and Tenant Boundary Proposal
v0.1` only if this proposal is approved and no separate type-only persistence
hardening is required first.

This sequence does not recommend creating a database, storage adapter,
migration, queue, worker, or hosted service now.

## 30. Acceptance Criteria

This proposal is ready for human architecture review only when all of the
following remain true:

- it is proposal-only and docs-only;
- it is storage-technology-neutral and transport-neutral;
- no database, storage adapter, migration, queue, or worker is implemented;
- `created_new_job` is returned only after durable establishment;
- durable job establishment binds the effective idempotency scope and effective
  canonical fingerprint whenever an idempotency boundary is present;
- idempotency claim and job establishment form a logical atomic boundary;
- durable idempotency uses and binds an effective idempotency scope;
- `scope_reference` is neither canonical scope nor tenant, caller, account, or
  authorization proof;
- no durable idempotency claim is created when effective scope cannot be
  established or independently validated;
- durable idempotency uses and binds an effective canonical fingerprint;
- `request_fingerprint_ref` is not the authoritative fingerprint, and caller
  reference equality alone cannot establish submission equality;
- no durable idempotency claim is created when the effective canonical
  fingerprint cannot be established;
- same effective scope/key/effective fingerprint resolves to the same job;
- the same effective scope/key with a different effective fingerprint produces
  conflict without overwrite;
- concurrent at-most-one deduplication applies only to the same effective
  scope, key, and fingerprint within a declared idempotency boundary;
- submissions without an idempotency boundary are not implicitly deduplicated
  by global content or evidence digest;
- different effective scopes do not resolve to the same job solely because key
  and fingerprint match;
- lost-response resolution requires the same effective idempotency scope, key,
  and effective canonical fingerprint;
- content identity alone does not trigger idempotency or lost-response
  resolution;
- a `VerificationRequestReference` does not substitute for an immutable
  accepted-request representation;
- accepted request semantics cannot drift after job establishment;
- optional request metadata policy remains deferred and cannot change fixed
  bindings or fingerprint meaning;
- fixed job bindings are immutable;
- established effective idempotency scope and effective canonical fingerprint
  cannot change in place;
- terminal status cannot regress or change conclusion;
- attempt failure does not automatically terminalize the job;
- same-job retry is possible only before terminal finalization and only under a
  future separately approved bounded policy;
- no terminal job can accept another attempt or be reopened;
- published `verification_error` cannot be reopened;
- attempt identity, number, job binding, fixed-input relationship, and replay
  context are immutable after establishment;
- attempt `created_at` is immutable after establishment;
- attempt status, timing, failure, and result fields form a conditionally
  mutable lifecycle projection until attempt terminalization;
- append-only describes attempt lineage and does not prohibit conditional
  lifecycle advancement within an admitted attempt;
- terminal attempts cannot regress or be rewritten as another terminal status;
- no terminal job is published while an admitted attempt remains `accepted` or
  `running` in authoritative persistence;
- hiding a nonterminal attempt from projection does not permit terminal job
  publication;
- completed status is not published before canonical result and report are
  durable and consistent;
- every completed job has exactly one canonical result and report;
- a publicly visible completed job keeps its canonical result and report
  continuously resolvable with correct identities and bindings;
- a completed job, result, and report cannot be exposed as a partially visible
  completed resource set;
- canonical published artifacts are immutable;
- partial writes and orphan artifacts remain publicly invisible;
- non-completed terminal artifact outcomes remain explicit;
- `not_produced` means that no canonical artifact was ever published for the
  terminal job;
- staged or orphan internal existence does not make an artifact `available`;
- a terminal job with only staged or orphan data may be `not_produced` because
  no canonical publication occurred;
- a formerly published artifact removed under a future deletion boundary is
  never reported as `not_produced`;
- hard deletion and tombstones remain unselected, and deletion visibility and
  administrative deletion operations remain deferred;
- raw evidence retention remains separate from identity and digest retention;
- a result-referenced attempt remains resolvable with the public completed set;
- a completed result that references an attempt requires that attempt to have
  terminal status `completed`;
- a dangling final-attempt reference cannot be publicly exposed;
- a result without an attempt ID retains an immutable, explainable completion
  lineage;
- retention of historical attempts not referenced by completion remains
  deferred;
- replay never overwrites source lineage;
- idempotent resubmission neither creates nor fabricates a usage artifact;
- technical usage is not billing;
- no authentication or tenant implementation is introduced;
- no authority expansion occurs;
- persistence and runtime implementation remain explicitly unauthorized.

This proposal does not authorize persistence or runtime implementation.
