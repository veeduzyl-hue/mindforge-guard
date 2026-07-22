# External Evidence Assurance Authentication and Tenant Boundary Proposal v0.1

## 1. Status

- Status: `proposal-only`
- Scope: `docs-only`
- Authentication implementation: `none`
- Authorization implementation: `none`
- Tenant implementation: `none`
- Transport implementation: `none`
- Runtime implementation: `none`
- Authority status: `no authority expansion`

Canonical tenant boundary:
service-established or independently validated

Caller-provided tenant authority:
none

Authentication implementation authorized:
no

Authorization implementation authorized:
no

Tenant implementation authorized:
no

Cross-tenant job or artifact resolution:
prohibited

Effective idempotency scope:
tenant-bound and service-controlled, established by the service or
established through independent validation against the canonical tenant
context and approved scope rules

Public existence disclosure for non-visible resources:
prohibited

Recommended following assessment:
Authentication and Tenant Type-contract Need Assessment v0.1

Runtime implementation authorized:
no

This proposal is not:

- an identity-provider specification
- an IAM implementation
- a login or credential specification
- an RBAC, ABAC, or ACL design
- a tenant database schema
- an account or billing model
- an HTTP status or middleware design
- a persistence implementation
- a security certification
- a production-readiness declaration

This proposal does not authorize authentication, authorization, tenant,
account, transport, persistence, or runtime implementation.

## 2. Executive Boundary

The purpose of this proposal is to define how a future External Evidence
Assurance service must establish, bind, isolate, and apply authenticated
identity, canonical tenant security domain, delegated authority,
effective idempotency scope, and resource visibility without turning
MindForge Guard into:

- an identity provider
- an authentication service
- an authorization server
- a policy enforcement point
- a tenant-management platform
- an account system
- an IAM control plane
- an API gateway
- a runtime execution gate
- an approval authority
- a blocking authority
- a deployment authority
- a certification authority
- a trust registry
- a compliance authority
- a billing system

Guard remains:

- verification-only
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- human-review-oriented
- producer-neutral
- default-off

```text
External systems issue evidence. Guard verifies evidence.
```

The future service may authenticate who is asking, determine whether that
authenticated context can submit or view a bounded verification resource, and
hide resource existence when visibility is not granted. It may not convert
that hygiene into evidence validity, approval, blocking, certification, trust,
or deployment authority.

## 3. Problem Statement

The current External Evidence Assurance line already defines:

- caller-provided request references
- service-generated job and artifact identities
- idempotency intent fields
- replay lineage fields
- explicit `available`, `not_yet_available`, `not_produced`, and `not_found`
  semantics
- persistence deferrals for authentication, tenant isolation, visibility,
  deletion, and tombstones

What is still missing is the semantic boundary that answers:

- how a future service learns or validates who the caller is
- how it derives or validates the canonical tenant security domain
- how it prevents cross-tenant lookup, conflict probing, replay, retry, and
  artifact retrieval
- how visibility interacts with `not_found`
- how historical identity and tenant bindings remain immutable even when
  credentials, membership, or delegated access change later

This proposal freezes those semantics without implementing them.

## 4. Product-boundary Preservation

This proposal preserves all current repository posture and invariants:

- `audit` output unchanged
- `audit` verdict unchanged
- `audit` exit semantics unchanged
- deny exit code `25` unchanged
- `permit` behavior unchanged unless separately scoped
- `classify` behavior unchanged unless separately scoped
- recommendation-only
- additive-only
- non-executing
- default-off
- no authority expansion
- no control-plane drift
- no dashboard-first drift
- no multi-agent orchestration drift

Authenticated identity and tenant isolation here are supporting service hygiene
only. They do not make Guard the authority on whether evidence is true, whether
a producer is trusted, whether a report is compliant, or whether an external
action may execute.

## 5. Terminology

### 5.1 Authentication

Authentication answers who the current principal is, or which verified context
is making the current request.

Authentication does not answer:

- whether the principal may view a given resource
- whether the evidence is valid
- whether the verification is successful
- whether a result is approved

### 5.2 Authorization

Authorization answers whether the authenticated context may perform a specific
operation or observe a specific resource.

Authorization does not prove:

- evidence authenticity
- evidence validity
- report correctness
- trustworthiness
- approval authority

### 5.3 Authenticated principal

An authenticated principal is the verified caller identity established or
independently validated by a future authentication boundary.

The concept may cover:

- a human user
- a service identity
- a workload identity
- an agent identity

This proposal does not freeze provider format, token claims, directory model,
or principal schema.

### 5.4 Requesting actor

The requesting actor is the actor that initiates the current service operation.
It is not automatically the resource owner, tenant administrator, producer, or
review authority.

### 5.5 Delegated actor

A delegated actor is an actor that acts for another principal only when a
future service can independently validate that delegation.

Caller-provided text is not delegation proof.

### 5.6 Effective represented principal

The effective represented principal is the principal whose validated
authority is being exercised for the current operation. When no delegation
applies, it may be the authenticated principal. When delegation applies, it
is the independently validated represented principal.

It must not erase, hide, or replace the immediate requesting actor.

It must not be established only from:

- caller-provided text
- metadata
- resource possession

It is not:

- resource ownership proof
- canonical tenant proof
- an authorization decision by itself

Exact identity format and source type remain deferred.

### 5.7 Tenant security domain

The tenant security domain is the canonical security boundary used for resource
isolation, visibility, and effective idempotency comparison.

Tenant security domain is not:

- a billing account
- a subscription
- a producer
- an adapter
- a freely caller-declared text string

### 5.8 Resource visibility

Resource visibility answers whether the current authenticated context may
observe that a resource exists or receive its payload.

Visibility is not:

- resource validity
- evidence authenticity
- approval
- trust
- ownership proof
- certification

### 5.9 Effective idempotency scope

Effective idempotency scope is the tenant-bound and service-controlled
comparison scope used together with the idempotency key and effective
canonical fingerprint. It is established by the service or established
through independent validation against the canonical tenant context and
approved scope rules.

It is not equal to raw `scope_reference`.

## 6. Authentication versus Authorization

The future service must preserve the following separation:

- authentication answers who is asking
- authorization answers what that authenticated context may submit or read
- successful authentication does not imply resource authorization
- successful authorization does not prove evidence validity
- verification findings do not grant or remove resource authorization
- `permit` and `classify` do not become authentication or authorization
  decisions
- an `AssuranceReport` does not grant access rights to other resources

Pre-authentication failure must not create:

- an accepted request
- a `verification_id`
- a `VerificationJob`
- a durable idempotency claim
- a `VerificationAttempt`
- a `VerificationJobResultRecord`
- an `AssuranceReport`
- a `VerificationUsageRecord`

Authenticated but unauthorized submission must likewise stop before job or
claim creation and must not reveal whether a target tenant, request, or
resource already exists.

## 7. Caller References Are Non-authoritative

The following fields or concepts remain caller intent, correlation, or bounded
metadata only:

- `request_id`
- `caller_reference`
- `scope_reference`
- `request_fingerprint_ref`
- `customer_reference`
- `request_metadata`
- `human_review_context`
- caller-supplied tenant text
- caller-supplied actor text
- caller-supplied owner text

These references must not be treated as:

- authenticated principal proof
- canonical tenant proof
- authorization proof
- delegation proof
- cross-tenant visibility authority
- canonical fingerprint authority
- effective idempotency scope authority

In particular:

- `scope_reference` is not canonical tenant
- `scope_reference` is not authorization proof
- `caller_reference` is not authenticated principal
- `request_fingerprint_ref` is not canonical fingerprint
- caller metadata cannot override service-established bindings

## 8. Canonical Tenant Security Domain

Each accepted logical verification job must bind to exactly one canonical
tenant security domain.

That canonical tenant security domain must be:

- established by a future service
- or independently validated by a future service
- fixed for the lifetime of that logical job

The canonical tenant security domain must not be inferred only from:

- raw `scope_reference`
- producer identity
- adapter identity
- report identity
- billing relationship
- shared registry entries

This proposal does not define:

- tenant ID format
- tenant database schema
- tenant creation API
- tenant membership table
- tenant hierarchy
- billing linkage

## 9. Tenant-bound and Shared Resources

### 9.1 Tenant-bound artifacts

At minimum, the following artifacts are tenant-bound:

- accepted `VerificationRequest`
- submitted `EvidencePackage` in its accepted access context
- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `AssuranceReport`
- `VerificationUsageRecord`
- replay and completion lineage

### 9.2 Potentially shared reference data

Potentially shared reference data may include:

- producer-neutral `AdapterManifest` definitions
- approved adapter-registry documentation entries
- assurance-profile definitions
- mapping-capability definitions

Shared reference data does not make tenant-bound jobs or artifacts shared.

In particular:

- a shared manifest may be selected by multiple tenants
- the same manifest selection does not let one tenant read another tenant's job
- manifest selection history remains part of the corresponding job's
  tenant-bound history
- tenant-private manifest policy remains deferred
- registry ACL design remains deferred

## 10. Identity Establishment

The future service must establish or independently validate:

- the authenticated principal
- the immediate requesting actor
- the effective represented principal
- the canonical tenant security domain
- any validated delegation relationship
- sufficient delegation provenance
- the operation namespace relevant to effective idempotency scope

The immediate requesting actor and effective represented principal may differ.
Authorization evaluation must not collapse them into one opaque caller.

Caller text, metadata, or resource possession cannot establish delegation
between them.

The service must not accept mutable external directory state as the only
historical basis for previously accepted job identity.

Future identity establishment may depend on:

- credential validation
- workload attestation
- service-to-service trust
- explicit tenant selection rules
- delegation constraints

Those mechanisms remain deferred. This proposal freezes only the semantic
requirement that the service, not caller text, controls final canonical identity
and tenant establishment. Exact snapshot, chain, and reference representation
remain deferred.

## 11. Delegation and Agent Identity

Delegation must be explicitly validated. It must not be inferred only from:

- `caller_reference`
- metadata text
- resource ID knowledge
- report possession
- being an agent

The minimum boundary is:

- a principal may act as itself
- a delegated actor may act for another principal only when that delegation is
  independently validated
- service-to-service delegation must not hide the direct calling service
  identity
- an agent identity is still just one authenticated principal category
- an agent does not automatically gain broader tenant access than the principal
  or workload context it represents
- agent or sub-agent delegation must not collapse the call chain into only the
  final represented principal
- future historical binding must be able to explain who called directly, who
  was represented, under which validated delegation, and within which
  canonical tenant boundary
- immediate requesting actor, effective represented principal, and delegation
  provenance must remain conceptually distinct
- a sub-agent does not automatically inherit extra permissions beyond the
  parent's validated delegated context
- caller-provided agent name, user name, or owner text is not delegation proof

This proposal does not design delegation-chain schema or impersonation
workflow. It freezes only that caller text is not proof, that delegated
authority must stay bounded and auditable, and that exact delegation-chain
type, token, and storage representation remain deferred.

## 12. Historical Identity Binding

Once a logical job is accepted, its historical identity and tenant binding must
be immutable for that job.

That immutable historical context must be able to explain, semantically at
minimum:

- the authenticated principal
- the immediate requesting actor
- the effective represented principal
- the validated delegation provenance
- the canonical tenant security domain
- accepted request identity

Credential rotation, user rename, membership revocation, or later delegation
changes must not rewrite:

- the historical principal context under which the job was accepted
- the canonical tenant binding
- accepted request identity
- replay lineage
- completion lineage
- publication history

Current authorization changes must not rewrite historical acceptance facts.

The future service may preserve historical identity binding as a snapshot,
canonical reference, or another immutable representation, but it must not rely
only on a mutable external directory record that can drift.

Historical identity explanation is not credential retention. A future
representation must not preserve reusable authentication secrets or require
the complete identity-provider payload merely to explain the accepted
principal, actor, represented principal, delegation, and tenant context.

Historical identity binding must not preserve or rely on reusable
authentication material such as:

- access tokens
- refresh tokens
- session secrets
- private keys
- bearer credentials
- equivalent reusable secrets

Historical provenance may preserve only non-secret, non-replayable stable
references, digests, or other immutable explanation material sufficient to
explain the accepted principal, actor, represented principal, delegation,
tenant, and acceptance context.

Identity history is not a credential archive, and historical provenance must
not become a credential replay path.

This proposal does not define snapshot schema, reference schema,
content-addressed representation, token storage, or secret retention design.

## 13. Effective Idempotency Scope

Effective idempotency scope must be tenant-bound and service-controlled,
established by the service or established through independent validation
against the canonical tenant context and approved scope rules.

The service must preserve all of the following:

- effective scope is not raw `scope_reference`
- caller scope intent may be one input, but must be independently validated
  against the canonical tenant context and approved scope rules
- independently validated does not mean caller-authoritative
- the service must incorporate the canonical tenant security domain
- the service may incorporate a service-defined operation namespace
- the exact composition remains deferred
- if effective scope cannot be established, no durable idempotency claim may be
  created
- no implicit global scope may be substituted

The service must prevent:

- same key plus same fingerprint resolving across different tenant scopes
- cross-tenant callers observing `resolved_existing_job`
- cross-tenant callers probing for another tenant's job through
  `idempotency_conflict`
- scope drift rewriting an existing durable claim

Tenant or effective-scope change requires an intentional new job.

## 14. Submission Authorization

### 14.1 Pre-authentication failure

When authentication fails before a request is accepted:

- no accepted request is formed
- no job is created
- no attempt is created
- no durable claim is created
- no result, report, or usage artifact is created
- no existing resource visibility is disclosed

### 14.2 Authenticated but unauthorized submission

When the caller is authenticated but not authorized to submit in the relevant
tenant or scope:

- no accepted request is formed
- no job or claim is created
- no idempotency outcome may reveal another tenant's state
- response detail must not disclose membership, visibility, or resource
  existence
- exact transport mapping remains deferred

### 14.3 Authorized submission

Authorized submission means only that the request may enter bounded acceptance
evaluation. It does not imply:

- evidence validity
- adapter compatibility
- verification success
- approval
- deployment permission

## 15. Retrieval Visibility

Retrieval requires both:

- an authenticated context
- a visibility decision for the requested resource

This applies conceptually to:

- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `AssuranceReport`
- `VerificationUsageRecord`
- accepted request projections
- evidence-package projections
- replay lineage projections

The future service must preserve:

- visible job does not automatically expose raw evidence or usage details
- artifact visibility cannot exceed parent job tenant boundary
- cross-tenant references must not return payload
- unauthorized callers must not receive status, digest, producer, finding,
  timestamp, or existence confirmation
- list and lookup operations must obey the same visibility rules

Exact operation-specific visibility policy remains deferred.

## 16. not_found and Non-enumeration

This proposal preserves alignment with the current availability semantics:

- `not_found` may mean the resource identity does not exist
- `not_found` may also mean the resource is non-visible under a future
  authorization boundary
- that ambiguity is allowed to prevent unauthorized resource enumeration
- `not_found` does not prove the resource never existed
- `not_found` does not equal `not_produced`
- `not_found` does not equal deletion
- `not_found` does not equal tombstone

For an authorized caller that may see the job, artifact availability still
uses `available`, `not_yet_available`, and `not_produced` semantics.

For a caller that may not see the job, visibility is decided before artifact
availability disclosure, so the service must not first reveal whether the
artifact would have been `available` or `not_produced`.

Exact transport code and problem mapping remain deferred.

## 17. Canonical Publication under Visibility Changes

Loss of visibility after a canonical artifact was published must not rewrite
publication history.

Therefore:

- a previously published artifact that later becomes non-visible must not be
  reinterpreted as `not_produced`
- access revocation must not rewrite whether publication happened
- visibility change does not equal deletion
- concealment does not erase historical publication
- non-visible previously published resources may be hidden behind future
  `not_found` semantics without pretending publication never occurred

This preserves consistency with the existing rule that `not_produced` means no
canonical artifact for that role was ever published.

## 18. Artifact Visibility Inheritance

Tenant-bound artifact visibility inherits from the parent job boundary unless a
future narrower rule is separately approved.

The minimum inheritance rules are:

- `VerificationAttempt` cannot become cross-tenant visible if its parent job is
  not visible
- `VerificationJobResultRecord` cannot outrun parent job visibility
- `AssuranceReport` cannot outrun parent job visibility
- `VerificationUsageRecord` cannot outrun parent job visibility
- accepted request and evidence projections may be stricter than report
  visibility, but not broader
- shared manifest or profile definitions do not make tenant-bound selection
  history shared

## 19. Retry and Replay Authorization

Retry and replay must stay tenant-bound.

### 19.1 Retry

Retry of an existing logical job must require:

- current authenticated context
- current authorization for the job's canonical tenant security domain
- preservation of the existing canonical tenant binding

Retry must not:

- cross tenant boundaries
- reopen authorization through caller text
- rebind the historical tenant

### 19.2 Replay

Replay must require:

- current authenticated context
- current authorization for the source job's canonical tenant security domain
- preserved lineage to the source job

The replayed logical job must bind to the same canonical tenant security
domain as the source job, revalidated under the current authenticated and
delegated context.

Replay must not:

- overwrite source lineage
- switch tenant binding in place
- allow one tenant to replay another tenant's job
- select a different tenant from the source job
- migrate source lineage into another tenant

If a future workflow needs to use the same or related evidence in another
tenant, that must be a separately authorized new submission boundary rather
than replay.

Historical authorization at the time of the source job is not by itself enough
to authorize replay later. Current authorization remains required.

## 20. Operator and Human-review Access

### 20.1 Human review

A human reviewer may be authorized to read an `AssuranceReport` or related
bounded artifacts.

Reviewer access does not equal:

- approval authority
- blocking authority
- decision override
- deployment permission

Reviewer annotations, overrides, or decision records are outside this proposal.

### 20.2 Operator access

Platform operator, support, incident-response, backup-operator, and
administrator behavior remain deferred.

This proposal freezes only the following minimum rule:

- operator identity does not automatically imply cross-tenant visibility

If a future privileged operator or support boundary is separately approved, it
must preserve the resource's original canonical tenant binding. It must not
treat the operator tenant as the resource tenant, create cross-tenant
idempotency resolution, authorize cross-tenant retry or replay, rewrite
historical identity or lineage, reclassify tenant-bound resources as shared,
or grant approval, blocking, or deployment authority.

Break-glass, impersonation, and support-access behavior require separate
security design and are not authorized here.

## 21. Cross-tenant Prohibitions

The following tenant-bound invariants must remain prohibited:

- cross-tenant job lookup
- cross-tenant artifact retrieval
- cross-tenant idempotency resolution
- cross-tenant durable claim reuse
- cross-tenant replay
- cross-tenant retry
- cross-tenant job tenant rebinding
- cross-tenant usage retrieval
- conflict-based probing of another tenant's key
- timing or error-detail probing of resource existence
- caller-controlled reference override of tenant binding
- turning a tenant-bound resource into a shared resource through visibility
  privilege
- changing historical tenant binding through visibility privilege
- inference of another tenant's job from shared manifest use
- default operator bypass of tenant isolation
- describing tenant isolation as producer trust or evidence validity

Future operator or support boundaries may separately evaluate privileged
visibility only as a distinct deferred question. Any such future visibility
must preserve the resource's original canonical tenant binding and must not be
treated as cross-tenant resource resolution, tenant rebinding, idempotency
resolution, retry, replay, ownership transfer, or new authority over approval,
blocking, or deployment.

## 22. Operation Matrix

Each conceptual operation below must distinguish the authenticated principal,
immediate requesting actor, effective represented principal, validated
delegation, and canonical tenant security domain. The
`Authentication required?` and `Tenant binding source` columns must not be
read as collapsing those relationships into one opaque caller.

| Operation | Authentication required? | Tenant binding source | Authorization or visibility question | Cross-tenant behavior | Existence disclosure allowed? | Historical binding affected? | Current implementation status | Deferred decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SubmitVerificationJob` | yes | service-established or independently validated canonical tenant | may this context submit into this tenant and scope? | prohibited | no | establishes immutable binding if accepted | not implemented | concrete auth mechanism |
| `ResolveIdempotentSubmission` | yes | existing job tenant plus tenant-bound and service-controlled effective scope | may this context resolve this boundary without leak? | prohibited | no | no rewrite of prior binding | not implemented | exact conflict concealment mapping |
| `GetVerificationJob` | yes | inherited from stored job binding | may this context observe the job projection? | prohibited | only if visible | no | not implemented | operation-specific visibility detail |
| `GetVerificationResult` | yes | inherited from parent job binding | may this context observe the result? | prohibited | only if visible | no | not implemented | result-specific narrowing rules |
| `GetAssuranceReport` | yes | inherited from parent job binding | may this context observe the report? | prohibited | only if visible | no | not implemented | reviewer-specific policy detail |
| `GetVerificationAttempt` | yes | inherited from parent job binding | may this context observe the attempt? | prohibited | only if visible | no | not implemented | whether attempt retrieval is public at all |
| `GetUsageRecord` | yes | inherited from parent job binding | may this context observe usage? | prohibited | only if visible | no | not implemented | whether extra permission is required |
| `ReplayVerification` | yes | same canonical tenant as the source job, revalidated under the current authenticated and delegated context; lineage inherited from source | may this context create a new replay job from that source within the same tenant boundary? | prohibited | no | source lineage preserved; new job binding fixed to the source tenant | not implemented | current-versus-historical authorization rules |
| `RetryVerification` | yes | inherited from existing job binding | may this context append a new attempt for this job? | prohibited | no | no change to job tenant binding | not implemented | retryable failure policy |
| `ListJobs` | yes | each listed item must remain tenant-bound | may this context observe any job identities at all? | prohibited | no for non-visible items | no | not implemented | non-enumerating list shape |
| `ListArtifacts` | yes | each artifact inherits job tenant binding | may this context observe any artifact identities at all? | prohibited | no for non-visible items | no | not implemented | artifact aggregation visibility |
| Administrative or operator retrieval | yes | original resource canonical tenant binding; no rebinding to operator tenant | does this operator context have separately approved privileged visibility without changing tenant binding or lineage? | tenant-bound resolution remains prohibited; separately approved privileged visibility remains deferred | only within a separately approved operator boundary if one exists | must not rewrite historical binding, tenant binding, or lineage | not implemented | break-glass and operator model |

The operation names above are conceptual analysis names only. They do not add
current service operations or source types.

Privileged visibility, if separately approved in the future, would not be
cross-tenant resource resolution, tenant rebinding, idempotency resolution,
retry, replay, or ownership transfer.

## 23. Resource-binding Matrix

| Resource | Tenant-bound or potentially shared? | Canonical tenant inheritance source | Authenticated actor relationship | Visibility inheritance | Historical immutability | Cross-tenant rule | Unresolved decisions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `VerificationRequest` | tenant-bound | established at job acceptance | accepted under the validated authenticated, requesting, represented, and delegated context as applicable; no authorship or ownership inference | follows parent job or stricter request rule | accepted binding immutable | cross-tenant lookup prohibited | request projection policy |
| `EvidencePackage` | tenant-bound in accepted access context | inherited from accepted job binding | accepted as submitted or referenced under the validated requesting and represented context; no producer, authorship, or ownership inference | may be stricter than report visibility | accepted binding immutable | cross-tenant retrieval prohibited | raw evidence visibility granularity |
| `VerificationJob` | tenant-bound | canonical job binding | bound to the accepted authenticated, requesting, and represented context; no ownership inference | base visibility anchor | immutable tenant binding | cross-tenant lookup prohibited | list semantics |
| `VerificationAttempt` | tenant-bound | inherited from parent job | retry actor must be currently authorized | cannot exceed parent job visibility | attempt lineage immutable | cross-tenant retrieval prohibited | public attempt surface |
| `VerificationJobResultRecord` | tenant-bound | inherited from parent job | readable only within visible authenticated context | cannot exceed parent job visibility | publication history immutable | cross-tenant retrieval prohibited | narrower result visibility |
| `AssuranceReport` | tenant-bound | inherited from parent job | reviewer may read only if authorized | cannot exceed parent job visibility | publication history immutable | cross-tenant retrieval prohibited | reviewer role details |
| `VerificationUsageRecord` | tenant-bound | inherited from parent job | readable only in authorized context | cannot exceed parent job visibility | usage identity immutable | cross-tenant retrieval prohibited | extra permission boundary |
| `AdapterManifest` | potentially shared reference data | not a tenant binding source by itself | selected by tenant-bound job context | shared definition visible separately if approved | shared definition version history separate | shared manifest must not imply shared job | tenant-private manifest policy |
| `AssuranceProfile` | potentially shared reference data | not a tenant binding source by itself | requested by tenant-bound job context | shared definition visible separately if approved | shared definition version history separate | shared profile must not imply shared job | profile visibility rules |
| Replay lineage | tenant-bound lineage | inherited from source and replay job bindings | replay actor must be currently authorized | may be stricter than report visibility | lineage immutable | cross-tenant replay prohibited | source concealment detail |

## 24. Threat and Failure Analysis

| Risk | Semantic mitigation |
| --- | --- |
| caller-controlled tenant spoofing | caller text is non-authoritative; canonical tenant must be service-established or independently validated |
| caller-controlled scope spoofing | effective scope is tenant-bound and service-controlled; raw `scope_reference` is not canonical scope; no claim may exist unless scope is established by the service or independently validated against the canonical tenant context and approved scope rules |
| cross-tenant idempotency collision | effective scope is tenant-bound and service-controlled; same key and fingerprint across different tenant scopes must not resolve to one job |
| resource-ID enumeration | non-visible and nonexistent resources may both map to `not_found`; visibility is decided before payload disclosure |
| authorization-before-visibility ordering error | the service must determine visibility before revealing status, digest, or availability |
| delegated-agent privilege laundering | immediate requesting actor, effective represented principal, and delegation provenance remain distinct; validated delegation must not hide the direct caller; sub-agent delegation cannot expand a parent's validated boundary |
| confused deputy | tenant selection cannot rely only on caller hints; authorization must consider requesting actor, represented principal, validated delegation, and canonical tenant; the service must not represent one principal into another tenant without explicit validated delegation |
| stale tenant membership | current authorization is required for retrieval, retry, and replay; historical binding remains immutable |
| mutable identity directory drift | mutable external identity records cannot be the sole historical record |
| operator cross-tenant overreach | privileged visibility must preserve the resource's canonical tenant binding; it must not create cross-tenant idempotency resolution, retry, replay, ownership transfer, or tenant rebinding |
| logs or error details leaking existence | submission denial and retrieval concealment must avoid tenant-membership or existence disclosure |
| shared manifest mistaken for shared job | shared reference data remains distinct from tenant-bound job history |
| retry or replay crossing tenant | retry must inherit the existing job tenant; replay must bind to the same canonical tenant as the source job; privileged visibility cannot authorize cross-tenant retry or replay |
| historical identity retention becomes credential retention | historical explanation may preserve only non-secret, non-replayable identity and delegation context; reusable authentication material and complete identity-provider payload remain out of scope; exact representation stays deferred |
| access revocation rewriting publication history | visibility changes do not change whether publication happened |
| `not_found`, `not_produced`, and deletion confusion | `not_found` is visibility or inexistence concealment, `not_produced` means never published, deletion semantics remain deferred |

These are semantic mitigations only. No runtime controls are selected here.

## 25. Privacy, Security, and Compliance Deferrals

The following remain explicitly deferred:

- identity-provider choice
- credential format
- token format
- session model
- OAuth, OIDC, SAML, or JWT profile
- role names
- permission enum
- RBAC, ABAC, or ACL model
- tenant ID format
- account hierarchy
- group membership model
- policy language
- database schema
- encryption and KMS
- data residency
- legal hold
- audit-log implementation
- break-glass implementation
- impersonation workflow
- billing and subscription behavior

This proposal does not make privacy, security-certification, or compliance
claims. It only freezes the architectural boundary that later work must
preserve.

## 26. Type-contract Deferral

This proposal does not add source types.

It freezes semantic boundary only. It does not authorize immediate creation of:

- `AuthenticatedPrincipal`
- `TenantContext`
- `AuthorizationDecision`
- `EffectiveIdempotencyScope`
- `DelegationChain`
- `ResourceVisibility`

Those names may be used as conceptual labels only.

Current conclusion:

- no new Authentication or Tenant TypeScript contract is required in this
  proposal itself
- any type-only hardening must be separately assessed after this proposal is
  reviewed
- package-internal visibility remains the default if a later type boundary is
  proven necessary

## 27. Technology Neutrality

This proposal intentionally avoids selecting:

- identity provider vendor
- token claims layout
- middleware
- database
- queue
- worker
- API gateway
- SDK
- directory product
- cloud IAM product
- operator console

Conceptual terms such as authenticated principal, canonical tenant security
domain, delegated actor, effective represented principal, visibility, and
effective idempotency scope must not be treated as implied implementation
maps.

## 28. Open Questions

1. How is canonical tenant security domain derived from verified identity?
2. How is explicit caller scope intent independently validated?
3. Does effective idempotency scope include a service-defined operation
   namespace?
4. May one authenticated principal belong to more than one tenant?
5. How does tenant selection avoid confused-deputy behavior?
6. What minimum immediate-actor, effective-represented-principal, and
   delegation provenance must be retained historically?
7. How much service-to-service and multi-agent call-chain detail must be
   preserved?
8. Which details belong to historical explanation versus runtime audit log?
9. Which resources, if any, may be tenant-shared rather than only
   tenant-bound?
10. Should raw evidence visibility be stricter than report visibility?
11. Does `VerificationUsageRecord` require a separately approved permission
   boundary?
12. Should an authorized caller ever distinguish nonexistent from non-visible?
13. How do list operations preserve non-enumeration?
14. How is historical resource visibility handled after tenant membership
    revocation?
15. What separate boundary is required for support and operator access?
16. How do cross-region or residency constraints affect tenant isolation?
17. Under what evidence would auth or tenant type-only contracts become
    necessary?
18. When must a dedicated threat-model review be run?
19. How should future transport map authentication failure, authorization
    denial, and concealed `not_found`?
20. Are tenant-private adapter manifests allowed?
21. What current authorization must retry and replay require, beyond
    historical authorization?
22. How do future visibility-policy changes preserve canonical publication
    history?

These are decision gates, not implementation authorization.

## 29. Following-phase Routing

Recommended following assessment:

```text
Authentication and Tenant Type-contract Need Assessment v0.1
```

Reason:

- this proposal freezes semantic boundary without proving that a stable new
  cross-boundary type is already necessary
- effective idempotency scope, delegated context, and visibility remain
  conceptually important but type-shape stability is not yet proven
- a focused need assessment is the narrowest next step that can decide whether
  type-only hardening is warranted

If that future assessment proves a stable type gap, a separately authorized
follow-up may consider:

```text
Type-only Authentication and Tenant Boundary Contracts v0.1
```

If no such type gap is proven, later routing may instead consider:

- `Idempotency Fingerprint Profile Proposal v0.1`
- `Authentication-aware Minimal Service Transport Mapping Proposal v0.1`

This proposal does not authorize either route now.

## 30. Acceptance Criteria

This proposal is acceptable for human architecture review only when all of the
following remain true:

- it is proposal-only
- it is docs-only
- exactly one new document is added
- no existing file is modified
- no source type is added
- no implementation is introduced
- authentication and authorization are explicitly separated
- tenant is explicitly distinguished from billing account and subscription
- caller references are non-authoritative
- immediate requesting actor and effective represented principal are explicitly
  separated
- when no delegation applies, immediate requesting actor and effective
  represented principal may be the same
- when delegation applies, represented principal is independently validated
- delegation must not hide the direct caller
- service-to-service and agent delegation must not collapse historical identity
  chain provenance
- canonical tenant is service-established or independently validated
- each accepted job has one immutable tenant binding
- historical job binding can explain direct actor, represented principal,
  delegation provenance, and tenant context
- historical identity explanation does not retain reusable credential secrets
- complete identity-provider payload is not required for historical explanation
- identity history is not a credential archive
- tenant binding is not ownership
- visibility is not ownership
- artifacts inherit the job tenant boundary
- shared reference data does not create shared jobs
- effective scope is not raw `scope_reference`
- canonical effective scope is tenant-bound and service-controlled
- independently validated scope is not caller-authoritative
- no implicit global idempotency scope exists
- cross-tenant idempotency resolution is prohibited
- cross-tenant retrieval is prohibited
- cross-tenant retry and replay are prohibited
- core tenant-bound invariants are not changed by privileged visibility
- privileged visibility is not tenant rebinding
- privileged visibility is not cross-tenant idempotency resolution
- privileged visibility does not authorize cross-tenant retry or replay
- replayed jobs bind to the same tenant as the source job
- authentication failure does not create job or claim
- authorization denial does not leak existing job visibility
- visibility is decided before artifact disclosure
- `not_found` is distinguished from `not_produced`
- access revocation does not rewrite publication history
- previously published artifacts do not become `not_produced`
- caller text is not delegation proof
- sub-agents do not automatically gain parent permissions
- operator identity does not automatically imply cross-tenant visibility
- `VerificationRequest` context does not imply authorship or ownership
- `EvidencePackage` context does not imply producer, authorship, or ownership
- no JWT, OAuth, RBAC, ABAC, ACL, or provider implementation is designed
- no credential or token storage design is introduced
- no tenant database is designed
- no HTTP mapping is designed
- no auth or tenant type implementation is introduced
- no persistence or runtime implementation is introduced
- no billing behavior is introduced
- no authority expansion is introduced
- one following assessment is explicitly selected

This proposal does not authorize authentication, authorization, tenant,
account, transport, persistence, or runtime implementation.
