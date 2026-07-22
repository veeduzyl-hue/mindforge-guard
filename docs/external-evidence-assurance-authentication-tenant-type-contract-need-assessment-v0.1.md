# External Evidence Assurance Authentication and Tenant Type-contract Need Assessment v0.1

## 1. Status

- Status: `assessment-only`
- Scope: `docs-only`
- Type implementation: `none`
- Authentication implementation: `none`
- Authorization implementation: `none`
- Tenant implementation: `none`
- Transport implementation: `none`
- Runtime implementation: `none`
- Decision posture: `evidence-driven and non-presumptive`
- Authority status: `no authority expansion`

This assessment is not:

- a type specification
- a TypeScript proposal
- an identity schema
- a tenant schema
- an authorization-policy design
- a credential or token design
- a public API expansion
- an IAM implementation
- a transport mapping
- a runtime-readiness declaration
- a production-readiness declaration

## 2. Executive Decision

Primary decision:
`NO_NEW_AUTH_TENANT_TYPE_CONTRACT_REQUIRED_NOW`

Confidence:
`high`

Current auth/tenant type implementation required:
`no`

Stable package-internal type gaps:
`none`

Stable service-boundary type gaps:
`none`

Blocking dependencies:
`none for proceeding to the next docs-only architecture phase; unresolved dependencies still block any later Authentication/Tenant type hardening, especially fingerprint-profile freeze, operation-namespace freeze, delegation-provenance minimum, policy freeze, transport concealment freeze, operator-boundary freeze, and historical-identity representation freeze`

Authorized next architecture phase:
`Idempotency Fingerprint Profile Proposal v0.1`

Public export authorized:
`no`

Runtime implementation authorized:
`no`

The approved Authentication/Tenant semantics are sufficient to preserve the
current boundary as documented invariants. They do not yet prove any stable new
cross-boundary source shape that must be frozen as a type-only contract.
Current gaps are dominated by provider-dependent identity representation,
authorization-policy dependence, transport concealment dependence, fingerprint
and scope dependence, or implementation-only representation choices.

## 3. Question Being Assessed

Question:

```text
Do the semantic boundaries approved in
External Evidence Assurance Authentication and Tenant Boundary
Proposal v0.1 require any new stable type-only contract now?
```

Assessment answer:

- no new Authentication/Tenant-specific type-only contract is required now
- existing contracts plus approved documented invariants are sufficient for the
  next docs-only architecture phase only
- the remaining gaps are primarily documented security invariants, deferred
  service-boundary dependencies, implementation-representation concerns, or
  runtime-only operational state

This sufficiency judgment applies only to progression into the next docs-only
architecture phase. It is not a sufficiency judgment for runtime
Authentication, tenant isolation, transport implementation, persistence
implementation, or production readiness. It also does not permanently reject
future Authentication/Tenant types; those must be reassessed when documented
reassessment triggers are satisfied.

## 4. Current Source-contract Inventory

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

These remain package-internal type-only compositions. They are not frozen
Authentication/Tenant contracts.

### 4.3 Existing caller-provided references

- `request_id`
- `caller_reference`
- `scope_reference`
- `request_fingerprint_ref`
- `customer_reference`
- `package_id`
- adapter ID and exact adapter version
- requested assurance-profile references

### 4.4 Existing service-generated artifact identities

- `verification_id`
- `verification_attempt_id`
- `verification_job_result_id`
- `report_id`
- `usage_record_id`

### 4.5 Existing current result and availability vocabulary

- `VerificationJobStatus`
- `VerificationAttemptStatus`
- `VerificationAttemptFailureKind`
- `VerificationJobResultStatus`
- `VerificationArtifactAvailability`
- `VerificationServiceProblemCategory`

### 4.6 Existing public-export boundary

`packages/guard-core/src/index.ts` does not export any current
`externalEvidence` Authentication/Tenant helper surface. The existing public
root export boundary therefore provides no evidence that producer integrations
or external package consumers currently require dedicated Authentication/Tenant
type shapes.

## 5. Current Consumer Inventory

Current source consumers visible in repository evidence are:

- existing artifact contracts such as `VerificationRequest`,
  `VerificationJob`, `VerificationAttempt`, `VerificationJobResultRecord`,
  `AssuranceReport`, and `VerificationUsageRecord`
- package-internal service-API composition contracts such as
  `VerificationJobSubmissionEnvelope`, `VerificationArtifactAvailability`,
  `VerificationServiceProblem`, and `VerificationJobSubmissionResponse`
- local verification-job envelope, idempotency/replay, technical-usage-record,
  and adapter-manifest-selection fixtures and verifiers that compose existing
  request, job, attempt, result, report, usage, replay-lineage, and
  service-response shapes

Docs-only semantic constraints visible in repository evidence are:

- the approved Authentication/Tenant proposal
- this assessment itself

Important current consumer conclusions:

- no current source consumer requires a new Authentication/Tenant shape
- docs-only architecture proposals and assessments are semantic constraints for
  future behavior, not TypeScript source consumers
- docs-only concept use therefore does not count toward the "two independent
  source consumers" threshold for a new type-only contract
- current source consumers do not consume a source-level
  `AuthenticatedPrincipal`, `TenantContext`, `EffectiveIdempotencyScope`,
  `AuthorizationDecision`, `ResourceVisibility`, or `DelegationChain` type
- local fixtures and verifiers do not consume new Authentication/Tenant shapes;
  they consume existing request, job, attempt, result, report, usage,
  replay-lineage, and service-response contracts
- current source consumers mostly need existing artifact and
  service-composition shapes plus documented invariants

## 6. Approved Authentication/Tenant Semantic Inventory

The approved Authentication/Tenant boundary currently freezes the following
semantics:

- authenticated principal
- immediate requesting actor
- delegated actor
- effective represented principal
- validated delegation provenance
- canonical tenant security domain
- effective idempotency scope as tenant-bound and service-controlled
- immutable historical identity and tenant binding
- cross-tenant prohibitions
- privileged visibility as a deferred, bounded question
- same-tenant replay
- visibility-before-artifact-disclosure
- `not_found` concealment distinct from `not_produced`
- credential-safety as a negative invariant

The approved boundary also freezes important non-goals:

- no identity-provider specification
- no IAM implementation
- no credential, token, or secret design
- no authorization-policy model
- no operator implementation
- no transport concealment mapping
- no tenant database
- no public export expansion

## 7. Type-contract Eligibility Criteria

A candidate concept is eligible for recommendation as a new type-only contract
only if all of the following are true:

1. it expresses a stable domain or stable service-boundary semantic
2. it is not identity-provider payload
3. it is not credential, token, or session format
4. it is not RBAC, ABAC, ACL, or policy implementation
5. it is not a database row, storage DTO, or ORM entity
6. it is not HTTP or transport concealment mapping
7. it is not runtime-only operational state
8. at least two independent consumers need the same shape, or it truly crosses
   a stable service boundary
9. existing contracts cannot already express it without semantic distortion
10. documented invariants are insufficient to prevent semantic drift
11. Authentication and Tenant semantics are frozen enough for safe modeling
12. the candidate does not depend on unfrozen credential format
13. the candidate does not depend on unfrozen permission or policy model
14. the candidate does not depend on unfrozen transport concealment behavior
15. the candidate does not depend on unfrozen fingerprint or scope composition
16. it does not create false Authentication or runtime-readiness signals
17. it does not expand public API or product authority
18. it remains provider-neutral, storage-neutral, and producer-neutral

If one or more conditions fail, the preferred recommendation is one of:

- reuse an existing contract
- keep the concept as a documented invariant
- defer pending dependency freeze
- keep it as an internal implementation representation only

## 8. Gap Classification Framework

Each candidate in this assessment is classified using one of the following
assessment labels:

- `no_gap`
- `existing_contract_reuse`
- `documented_security_invariant`
- `stable_package_internal_type_gap`
- `stable_service_boundary_type_gap`
- `implementation_representation_gap`
- `identity_provider_dependent_gap`
- `authorization_policy_dependent_gap`
- `transport_mapping_gap`
- `fingerprint_or_scope_dependency_gap`
- `runtime_operational_gap`
- `unresolved_architecture_gap`

These labels are assessment vocabulary only. They are not source declarations,
runtime flags, enums, or code-generation input.

## 9. Candidate Assessment Matrix

| Candidate | Approved semantic responsibility | Current contract coverage | Current or expected consumers | Gap classification | Stable enough for type now? | Identity-provider dependency | Authorization-policy dependency | Transport dependency | Fingerprint/scope dependency | Public/service/internal relevance | Premature-freezing risk | Recommended action | Evidence and rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Authenticated principal reference | explain who is authenticated | docs-only semantic boundary; no source type | future auth boundary only; no current source consumer | `identity_provider_dependent_gap` | no | yes | possible | possible | no | service/internal | very high | keep as documented invariant | provider format, claims model, and principal representation remain unfrozen; no stable current consumer exists |
| Immediate requesting actor reference | preserve direct caller identity | docs-only semantic boundary | future authz evaluation only | `unresolved_architecture_gap` | no | possible | yes | possible | no | service/internal | high | keep as documented invariant | depends on delegation model and service context, not on a frozen source shape |
| Effective represented principal reference | preserve represented authority without hiding direct caller | docs-only semantic boundary | future authz evaluation only | `unresolved_architecture_gap` | no | possible | yes | possible | no | service/internal | high | keep as documented invariant | representation depends on validated delegation model and provider-neutral principal handling |
| Validated delegation provenance | explain who represented whom and under what validation | docs-only semantic boundary | historical explanation and future policy only | `unresolved_architecture_gap` | no | possible | yes | possible | no | service/internal | very high | defer pending delegation freeze | depth, granularity, runtime-audit split, and provenance minimum remain unfrozen |
| Delegation relationship reference | distinguish direct actor from represented principal | docs-only semantic boundary | future service authz only | `unresolved_architecture_gap` | no | possible | yes | possible | no | service/internal | high | keep as documented invariant | no current stable consumer proves a single safe relationship shape |
| Canonical tenant security-domain reference | identify the canonical tenant boundary | docs-only semantic boundary | future service boundary only | `unresolved_architecture_gap` | no | no | yes | possible | yes | service/internal | high | keep as documented invariant | tenant ID format, hierarchy, membership, and external representation remain unfrozen |
| Immutable job tenant binding | preserve one canonical tenant per accepted job | existing artifact contracts provide stable resource nouns, while the approved proposal supplies the tenant-binding invariant; current source shapes do not encode canonical tenant identity | no current auth-aware construction, persistence, or transport consumer requires a new source shape | `documented_security_invariant` | no | no | yes | possible | yes | service/internal | medium | keep invariant documented; do not modify existing artifact contracts or add a binding wrapper type | missing need is a behavioral and security binding rule, not a new stable type field |
| Immutable historical identity binding | preserve accepted identity context without rewrite | docs-only semantic boundary plus existing artifacts | future storage/history only | `implementation_representation_gap` | no | possible | yes | possible | yes | internal/service | very high | defer representation; keep invariant documented | snapshot versus reference versus digest representation is still open |
| Caller tenant-selection intent | preserve caller hint without authority | `scope_reference`, `caller_reference`, metadata-style references | existing request/idempotency callers | `existing_contract_reuse` | no new type | no | possible | possible | yes | service/internal | low | reuse existing caller references | caller intent already exists as non-authoritative references; new type would risk implying authority |
| Effective idempotency scope | canonical service-controlled comparison scope | `VerificationIdempotencyBoundary.scope_reference` as caller hint only | future submission resolution only | `fingerprint_or_scope_dependency_gap` | no | no | possible | no | yes | service/internal | very high | defer to fingerprint-profile phase | scope depends on canonical tenant, approved rules, and operation namespace; current field is caller hint only |
| Authentication context | aggregate verified principal/actor/represented/delegation/tenant | docs-only semantics only | future middleware/service boundary only | `unresolved_architecture_gap` | no | yes | yes | yes | yes | service/internal | very high | do not create aggregate context type now | would prematurely flatten authentication, authorization, tenant, and policy concerns into one bag |
| Authorization evaluation input | policy evaluation inputs | docs-only semantic inventory only | future authz engine only | `authorization_policy_dependent_gap` | no | possible | yes | possible | yes | service/internal | very high | defer; do not freeze | no policy model, operation taxonomy, or permission model exists |
| Authorization decision | future authz result | none beyond prose separation from Guard verdict | no current consumer | `authorization_policy_dependent_gap` | no | no | yes | possible | possible | service/internal | very high | do not create decision type | would wrongly imply policy/control-plane maturity and blur Guard verdict semantics |
| Resource visibility evaluation input | evaluate visibility before disclosure | docs-only semantic boundary | future policy/transport only | `authorization_policy_dependent_gap` | no | possible | yes | yes | possible | service/internal | high | keep as invariant; reassess later | visibility depends on policy and concealment, not yet a stable source shape |
| Resource visibility decision | visible or concealed outcome | current source vocabulary separates artifact-role availability from top-level resource-problem vocabulary, but does not define one unified visibility-decision source shape | retrieval semantics and future transport only | `transport_mapping_gap` | no | no | yes | yes | possible | service/internal | high | defer exact response composition and do not force a unified visibility type | policy determines visibility, while service and transport response layers determine the concealed representation |
| Concealed not-found result | conceal non-visible versus nonexistent | `VerificationServiceProblem` with `resource_not_found` covers top-level resource problems, while `VerificationArtifactAvailability.not_found` covers artifact-role availability | existing minimal-service proposal and retrieval semantics | `existing_contract_reuse` | no new type | no | possible | yes | no | service/internal | low | reuse the appropriate existing vocabulary by response layer: `resource_not_found` for top-level resource problems and `not_found` for artifact-role availability; defer exact retrieval response composition | current source vocabulary already supports layered concealment reuse without proving one new concealed-not-found type |
| Tenant-bound resource reference | keep artifacts tenant-bound without ownership inference | existing artifact identifiers may be reused, but current source references do not encode tenant-boundness | current job/result/report/usage artifacts and future retrieval semantics | `documented_security_invariant` | no new type | no | possible | possible | no | service/internal | low | reuse existing identifiers and preserve tenant-boundness as a documented invariant; do not add a tenant-bound wrapper type now | resource identifier possession does not prove tenant binding, visibility, or authorization, so tenant-boundness remains an invariant rather than a fielded reference shape |
| Retry authorization context | authorize retry under existing job tenant | docs-only semantic boundary | future operation-specific authz only | `authorization_policy_dependent_gap` | no | possible | yes | possible | no | service/internal | high | keep operation-specific invariant only | retry is conceptual-only today and has no stable standalone consumer |
| Replay authorization context | authorize replay in same source tenant | `VerificationReplayContext` covers replay mode and lineage references only; it does not express authorization | future replay submission only | `authorization_policy_dependent_gap` | no | possible | yes | possible | yes | service/internal | high | reuse `VerificationReplayContext` for lineage, retain same-tenant and current-authorization rules as documented invariants, and defer any authorization type pending policy freeze | replay authorization depends on authenticated context, delegation, policy, and source-tenant visibility, while replay submission identity still has separate effective-scope and fingerprint dependencies |
| Privileged operator visibility context | bounded privileged visibility without tenant rebinding | docs-only deferred operator boundary | no current source consumer | `authorization_policy_dependent_gap` | no | no | yes | yes | no | service/internal | very high | defer; do not add operator type | operator/break-glass/ACL boundary is explicitly deferred and unresolved |
| Identity-provider provenance reference | explain accepted identity source without provider lock-in | docs-only credential-safety boundary only | future historical explanation only | `identity_provider_dependent_gap` | no | yes | no | possible | no | internal/service | very high | keep as documented invariant | provider-specific payload and source naming remain explicitly excluded |
| Credential-safety marker | prevent reusable secret retention | docs-only negative invariant | threat model and implementation review only | `documented_security_invariant` | no | yes | no | no | no | internal/service | high | keep as negative invariant | secret safety is mainly a prohibition, not a stable business noun requiring fields |
| Tenant membership reference | future membership linkage | none | no current consumer | `authorization_policy_dependent_gap` | no | no | yes | possible | no | internal/service | very high | defer entirely | membership representation would prematurely freeze tenant-account-policy structure |
| Operation namespace | scope establishment namespace | docs-only semantic dependency | future effective-scope computation only | `fingerprint_or_scope_dependency_gap` | no | no | possible | possible | yes | service/internal | high | defer to fingerprint-profile decision | no namespace freeze exists, and current consumers do not need a source type |
| Cross-tenant conflict or concealment representation | represent conflict or concealment without leakage | `VerificationServiceProblem`, `VerificationArtifactAvailability`, docs-only cross-tenant invariants | future service responses only | `transport_mapping_gap` | no | no | yes | yes | yes | service/internal | high | reuse current problem/availability vocabulary; defer new type | response concealment remains transport-sensitive and not yet frozen |
| Historical identity snapshot or reference | preserve immutable accepted identity explanation | docs-only historical-binding boundary | future persistence/history only | `implementation_representation_gap` | no | possible | possible | possible | possible | internal/service | very high | defer representation decision | exact snapshot/reference/content-addressed choice remains explicitly deferred |

## 10. Authenticated Principal

Current coverage:

- approved boundary defines authenticated principal semantically
- current source types do not declare an `AuthenticatedPrincipal` contract
- current public exports do not expose any external Authentication/Tenant type

Assessment:

- current repository evidence does not freeze principal ID format, issuer,
  subject, provider, or actor taxonomy
- any concrete source-level principal type would risk masquerading provider
  assumptions as domain contract
- current consumers do not prove a stable opaque principal reference shared
  across two independent consumers

Decision:

- classify as `identity_provider_dependent_gap`
- do not create an authenticated-principal type now
- preserve this as a documented invariant until a later service spike reveals a
  truly unavoidable provider-neutral cross-boundary shape

## 11. Requesting and Represented Principals

Current coverage:

- approved boundary separates immediate requesting actor from effective
  represented principal
- current source types contain no actor-chain, delegation, or represented-party
  contract

Assessment:

- these concepts are semantically important, but current source evidence does
  not prove they are stable type shapes today
- current consumers do not require a shared structural representation
- freezing them now would likely imply authorship, ownership, or middleware
  request-context assumptions that the approved proposal explicitly rejects

Decision:

- requesting actor: `unresolved_architecture_gap`
- effective represented principal: `unresolved_architecture_gap`
- do not create source types now
- keep both concepts documented and distinct

## 12. Delegation Provenance

Current coverage:

- approved boundary requires independently validated delegation and preserved
  provenance explanation
- current source types already carry `VerificationReplayContext`, but not
  general delegation provenance

Assessment:

- delegation minimum, chain depth, provenance granularity, and the split
  between historical explanation and runtime audit log remain unfrozen
- no current consumer proves a minimal stable reusable provenance shape
- any early type would likely ossify provider assumptions, capability-token
  assumptions, or operator workflow assumptions

Decision:

- classify as `unresolved_architecture_gap`
- do not create a provenance or delegation-chain type now
- reassess only after delegation provenance minimum and threat-model expectations
  are frozen

## 13. Canonical Tenant Security Domain

Current coverage:

- approved boundary requires exactly one canonical tenant per accepted job
- current source types do not encode tenant fields on domain artifacts

Assessment:

- tenant identity format, tenant hierarchy, membership, account relationship,
  and external representation are still intentionally undefined
- current artifacts already identify role-specific resources, but they do not
  need a tenant field yet to remain semantically bounded in docs
- adding an opaque tenant reference type now would still imply a more stable
  service shape than current evidence supports

Decision:

- classify as `unresolved_architecture_gap`
- do not create a tenant-context or tenant-reference type now
- keep canonical tenant as a documented boundary invariant

## 14. Immutable Job Tenant Binding

Current coverage:

- `VerificationJob`, `VerificationAttempt`, `VerificationJobResultRecord`,
  `AssuranceReport`, and `VerificationUsageRecord` already exist as stable
  artifact contracts
- current source shapes do not encode canonical tenant identity on those
  artifacts
- the approved Authentication/Tenant proposal now freezes one canonical tenant
  per accepted job and inheritance across tenant-bound resources

Assessment:

- existing artifact contracts provide the stable resource nouns, while the
  approved proposal supplies the tenant-binding invariant
- the current source shapes do not themselves encode canonical tenant identity
- the missing requirement is a behavioral and security binding rule, not an
  already justified type field
- no current auth-aware construction, persistence, or transport consumer
  requires a new source shape
- current consumers already operate on these artifacts without needing an extra
  job-tenant-binding wrapper type

Decision:

- classify as `documented_security_invariant`
- reuse existing artifact contracts
- keep the immutable job-tenant rule documented rather than freezing a new type
- do not modify `VerificationJob` and do not add a job-tenant-binding wrapper
  type

## 15. Historical Identity Binding

Current coverage:

- approved boundary freezes immutable historical identity and tenant context
- current contracts already expose stable artifact identifiers and replay/result
  lineage references

Assessment:

- the real missing decision is representation strategy: snapshot, canonical
  reference, digest, or another immutable explanation form
- credential-safety and provider-neutrality requirements also constrain future
  representation
- current evidence does not prove a stable source type shared by multiple
  consumers

Decision:

- historical identity binding: `implementation_representation_gap`
- historical identity snapshot/reference: `implementation_representation_gap`
- do not create new types now

## 16. Effective Idempotency Scope

Current coverage:

- `VerificationIdempotencyBoundary.scope_reference` expresses caller intent only
- approved boundary now freezes canonical effective scope as tenant-bound and
  service-controlled

Assessment:

- canonical effective scope depends on canonical tenant, approved scope rules,
  and potentially operation namespace
- current repository has not frozen fingerprint profile, scope derivation, or
  operation namespace
- a source type now would create false certainty around semantics that remain
  deliberately deferred

Decision:

- classify as `fingerprint_or_scope_dependency_gap`
- do not create `EffectiveIdempotencyScope` now
- route next phase to fingerprint-profile clarification instead

## 17. Authentication Context

Current coverage:

- approved boundary semantically distinguishes principal, direct actor,
  represented principal, delegation provenance, and canonical tenant
- current source types intentionally do not aggregate them

Assessment:

- a generic `AuthenticationContext`-style contract now would likely flatten
  authentication, authorization, tenant, and delegation into one bag
- it would also risk becoming a future middleware DTO rather than a stable
  domain contract
- current evidence does not show two independent consumers needing one shared
  aggregate shape

Decision:

- classify as `unresolved_architecture_gap`
- do not create an aggregate authentication-context type

## 18. Authorization Decision

Current coverage:

- approved boundary explicitly separates authorization from Guard verification
  results, permit semantics, and classify semantics
- current source types already expose verification results and service problems,
  but not authorization outcomes

Assessment:

- current repository has no authorization engine, no role model, no permission
  taxonomy, and no stable policy contract
- creating `AuthorizationDecision` now would create control-plane drift and
  imply policy maturity the repository intentionally rejects

Decision:

- classify as `authorization_policy_dependent_gap`
- do not create `AuthorizationDecision`

## 19. Resource Visibility

Current coverage:

- `VerificationArtifactAvailability` already encodes `available`,
  `not_yet_available`, `not_produced`, and `not_found`
- `VerificationServiceProblem` already carries top-level resource-problem
  vocabulary, including `resource_not_found`
- approved boundary clarifies visibility-before-disclosure and `not_found`
  concealment semantics

Assessment:

- visibility policy and visibility decision remain distinct from response-layer
  representation
- artifact-role availability and top-level resource lookup are not the same
  response layer
- current source vocabulary already contains both artifact-role availability and
  top-level resource-problem terms
- visibility input and visibility decision are still policy- and
  transport-dependent
- a new `ResourceVisibility` type now would risk conflating visibility with
  validity, ownership, or authorization

Decision:

- visibility evaluation input: `authorization_policy_dependent_gap`
- visibility decision: `transport_mapping_gap`
- concealed `not_found` result: `existing_contract_reuse`
- reuse the appropriate existing vocabulary by response layer:
  `resource_not_found` for top-level resource problems and `not_found` for
  artifact-role availability
- continue deferring exact retrieval response and transport concealment
  composition

## 20. Retry and Replay Authorization

Current coverage:

- `VerificationReplayContext` already expresses replay mode and source lineage
  references
- approved boundary now freezes retry under the same job tenant and replay under
  the same source tenant

Assessment:

- current retry/replay operation names remain conceptual analysis names only
- `VerificationReplayContext` does not express authorization
- replay authorization depends on authenticated context, delegation, policy, and
  source-tenant visibility
- replay submission identity still has separate effective-scope and fingerprint
  dependencies
- authorization dependency and submission-identity dependency must remain
  separate
- current consumers do not prove a standalone retry-auth or replay-auth type

Decision:

- retry authorization context: `authorization_policy_dependent_gap`
- replay authorization context: `authorization_policy_dependent_gap`
- reuse `VerificationReplayContext` for lineage, retain same-tenant and
  current-authorization rules as documented invariants, and defer any
  authorization type pending policy freeze

## 21. Privileged Operator Visibility

Current coverage:

- approved boundary explicitly defers operator/support/break-glass design
- current source contracts contain no operator, privilege, break-glass, or ACL
  types

Assessment:

- the approved proposal treats privileged visibility as a bounded deferred
  question, not a frozen contract line
- current evidence does not prove any stable operator-visibility shape
- any early type would likely become hidden authorization-policy or support
  workflow design

Decision:

- classify as `authorization_policy_dependent_gap`
- do not create privileged-visibility or operator-context types now

## 22. Credential Safety

Current coverage:

- approved boundary explicitly says historical identity explanation is not
  credential retention
- it forbids reusable secrets and complete provider-payload dependence

Assessment:

- credential safety is primarily a negative invariant
- it does not require a stable positive data shape today
- a fielded "credential safety marker" type would risk suggesting token storage,
  redaction schemas, or secret inventories that the proposal forbids

Decision:

- classify as `documented_security_invariant`
- do not add credential-safety fields or marker types

## 23. Public and Package Visibility

Visibility rule by default:

- reuse existing contracts whenever possible
- if a future type is ever necessary, prefer the narrowest package-internal
  visibility by default
- do not expand public exports merely because concepts are important

Assessment conclusion:

- no current candidate proves the need for public export
- no current candidate proves even a package-internal auth/tenant contract is
  required now
- producer integrations should not depend on Guard-internal auth/tenant
  representation
- adapter manifests should not import tenant or principal types

## 24. Premature-freezing Risks

Creating Authentication/Tenant types now would risk:

- freezing provider assumptions before the authentication boundary exists in code
- freezing delegation provenance before minimum provenance is approved
- freezing canonical tenant representation before membership and external
  reference posture are settled
- freezing effective scope before fingerprint-profile and operation-namespace
  decisions are approved
- freezing visibility before concealment mapping is frozen
- freezing operator semantics before operator/support boundary review exists
- implying auth or policy runtime maturity that the repository intentionally
  rejects

## 25. Consequences of Adding Types Now

If Authentication/Tenant types were added now:

- they would mostly encode unresolved service-boundary questions as if they were
  stable nouns
- they would likely duplicate docs-only invariants rather than solve a
  demonstrable multi-consumer gap
- they would create avoidable compatibility burden
- they would encourage false confidence that authentication, authorization, or
  tenant implementation is already architecture-ready

## 26. Consequences of Deferring Types

If Authentication/Tenant types are deferred now:

- the next docs-only architecture phase can still proceed
- existing artifact contracts remain the stable source vocabulary
- approved security invariants remain documented without pretending unresolved
  dependencies are frozen
- later type-only hardening remains available if runtime evidence reveals a real
  unavoidable cross-boundary shape

This is a controlled deferral of premature type freezing, not a loss of
architectural clarity.

## 27. Primary Decision

Primary decision:
`NO_NEW_AUTH_TENANT_TYPE_CONTRACT_REQUIRED_NOW`

Reason:

- no candidate currently satisfies the full eligibility bar for a new
  Authentication/Tenant type-only contract
- existing source contracts already cover the stable artifact nouns in the line
- the remaining gaps are documented invariants, deferred dependencies, policy or
  transport concerns, or implementation-only representation choices
- the next bounded phase should therefore clarify fingerprint-profile semantics,
  not add premature Authentication/Tenant contracts

## 28. Reassessment Triggers

Re-run this need assessment when one or more of the following become true:

1. the first approved local authentication-boundary spike exists
2. the first approved tenant-aware job-establishment spike exists
3. two independent consumers require the same principal or tenant binding shape
4. `Idempotency Fingerprint Profile Proposal v0.1` is approved
5. operation namespace semantics are frozen
6. delegation provenance minimum is frozen
7. a dedicated threat-model review is completed
8. an authorization-policy model is frozen
9. transport concealment mapping is frozen
10. operator/support visibility boundary is approved
11. historical identity representation is frozen
12. resource visibility policy gains two independent consumers
13. runtime implementation reveals an unavoidable cross-boundary shape that
    existing contracts cannot express safely

## 29. Following-phase Routing

Authorized next phase:

```text
Idempotency Fingerprint Profile Proposal v0.1
```

Routing rationale:

- effective scope and effective fingerprint must be clarified together to avoid
  caller-intent drift
- the current Authentication/Tenant boundary already froze the negative and
  separation rules needed to proceed without adding types
- fingerprint-profile clarification reduces one of the most important remaining
  dependencies before any later reconsideration of auth/tenant type hardening

This routing is an architecture-sequencing decision only. It does not authorize
Authentication/Tenant implementation, type implementation, persistence,
transport, or runtime work.

This assessment does not recommend:

- public export expansion
- Authentication or tenant implementation
- operator implementation
- policy-engine design
- transport concealment implementation
- persistence or runtime implementation

## 30. Acceptance Criteria

This assessment is acceptable only if all of the following remain true:

- it is assessment-only
- it is docs-only
- exactly one new document is added
- no source type is added
- no existing type is modified
- the current source-contract inventory is complete
- the current consumer inventory is complete
- every required candidate is classified
- every candidate has a stability decision
- every candidate has a dependency decision
- concept importance is separated from type necessity
- caller intent is separated from canonical context
- authentication is separated from authorization
- authorization decision is separated from Guard verdict
- visibility is separated from evidence validity
- provider payload is separated from domain contract
- tenant database representation is separated from domain contract
- historical identity is separated from credential retention
- effective-scope fingerprint dependency is explicit
- delegation maturity is explicit
- operator-visibility maturity is explicit
- public visibility is separated from internal visibility
- stable package-internal gaps are explicitly listed or explicitly `none`
- stable service-boundary gaps are explicitly listed or explicitly `none`
- exactly one primary outcome is selected
- exactly one following phase is selected
- no public export is authorized
- no authentication implementation is authorized
- no tenant implementation is authorized
- no transport implementation is authorized
- no persistence or runtime implementation is authorized
- no authority expansion is introduced

This assessment does not authorize type, authentication, authorization, tenant,
transport, persistence, or runtime implementation.
