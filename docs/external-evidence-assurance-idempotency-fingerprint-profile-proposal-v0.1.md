# External Evidence Assurance Idempotency Fingerprint Profile Proposal v0.1

## 1. Status

- Status: `proposal-only`
- Scope: `docs-only`
- Fingerprint implementation: `none`
- Type implementation: `none`
- Authentication implementation: `none`
- Tenant implementation: `none`
- Persistence implementation: `none`
- Transport implementation: `none`
- Runtime implementation: `none`
- Authority status: `no authority expansion`

This proposal is not:

- a source type specification
- a hash utility implementation
- a canonical-JSON implementation artifact
- a client fingerprint contract
- a global deduplication design
- a cache design
- a database index design
- an authentication or authorization design
- a transport mapping
- a production-readiness declaration

This proposal does not authorize fingerprint, type, authentication, tenant, persistence, transport, or runtime implementation.

## 2. Executive Profile Decision

Profile name:
`external-evidence-verification-request`

Profile version:
`0.1`

Comparison identity:
`effective scope + idempotency key + fingerprint profile identity + effective request fingerprint`

Caller-provided `request_fingerprint_ref` authority:
`none`

Canonical fingerprint authority:
`future service-established only`

Operation namespace:
`external-evidence.verification-job-submission`

Digest algorithm:
`SHA-256`

Digest encoding:
`lowercase hexadecimal`

Effective request fingerprint output:
`SHA-256 digest encoded as exactly 64 lowercase hexadecimal characters`

Canonical serialization:
`RFC 8785 JSON Canonicalization Scheme over UTF-8`

Global content deduplication:
`prohibited`

Public export authorized:
`no`

Runtime implementation authorized:
`no`

Recommended following assessment:
`Idempotency Fingerprint Type-contract Need Assessment v0.1`

These are proposal decisions only. They do not create new source literals, new runtime behavior, or a current canonical implementation.

## 3. Problem Statement

The current External Evidence Assurance line already freezes all of the following:

- caller-provided `scope_reference` is not canonical effective scope
- caller-provided `request_fingerprint_ref` is not a service-established fingerprint
- effective scope must remain tenant-bound and service-controlled
- replay creates a new logical job
- content equivalence alone must not trigger global deduplication
- current source contracts and fixtures remain bounded to existing local semantics

What is still missing is a fingerprint-profile decision that answers:

```text
What exact canonical request intent must a future External Evidence
Assurance service fingerprint so that the same effective scope,
idempotency key, fingerprint profile identity, and effective request
fingerprint resolve to the same logical verification job without
trusting caller-supplied hashes, enabling cross-tenant resolution,
performing content-only deduplication, or conflating replay with retry?
```

This proposal freezes that semantic profile and leaves type, transport, persistence, and runtime work deferred.

## 4. Existing Contract Inventory

Current relevant source contracts and package-internal compositions are:

- `VerificationIdempotencyBoundary`
- `VerificationReplayContext`
- `VerificationRequest`
- `VerificationRequestReference`
- `VerificationJob`
- `VerificationAttempt`
- `VerificationJobResultRecord`
- `AssuranceReport`
- `VerificationUsageRecord`
- `VerificationJobSubmissionEnvelope`
- `VerificationJobSubmissionDisposition`
- `VerificationArtifactAvailability`
- `VerificationServiceProblem`
- `VerificationJobSubmissionResponse`

Current caller-provided idempotency-facing inputs are:

- `idempotency_key`
- `scope_reference`
- `request_fingerprint_ref`

Current request fields that may look fingerprint-adjacent but are not authoritative fingerprint inputs today are:

- `request_id`
- `caller_reference`
- `customer_reference`
- `request_metadata`
- `human_review_context`
- `requested_at`

Current public-export boundary remains unchanged:

- `packages/guard-core/src/index.ts` does not export the external-evidence helper surfaces
- `minimalServiceApiTypes.ts` remains package-internal
- no fingerprint helper or profile contract is publicly exported

## 5. Existing Fixture Behavior

The current local idempotency and replay fixture proves bounded local semantics only.

Current same-job fixture equality checks include:

- `request_id`
- `caller_reference`
- `evidence_package`
- `adapter`
- `requested_assurance_profiles`
- `idempotency_key`
- `scope_reference`
- `request_fingerprint_ref`

Current fixture semantics also freeze:

- same resubmission returns `resolution: "same_logical_job"`
- deterministic replay uses `replay_mode: "deterministic_reexecution"`
- deterministic replay creates new service-generated request, job, attempt, result, report, and usage identities
- intentional new job stays outside the source idempotency boundary
- current fixture does not compute or validate a canonical service-established fingerprint

Therefore:

- the current fixture is not a canonical fingerprint implementation
- the current fixture is not evidence that `request_id` or `caller_reference` belong in the fingerprint preimage
- the current fixture remains unchanged by this proposal
- any future fixture alignment to this profile must be evaluated separately

## 6. Product-boundary Preservation

This proposal preserves the existing product posture:

- verification-only
- recommendation-only
- additive-only
- non-executing
- non-control-plane
- human-review-oriented
- producer-neutral
- default-off

Core relationship remains:

```text
External systems issue evidence. Guard verifies evidence.
```

This proposal does not reinterpret a fingerprint as:

- authentication proof
- authorization proof
- tenant proof
- evidence-integrity proof
- signature verification
- trust score
- approval
- blocking decision
- deployment permission
- certification
- compliance designation
- billing identity
- global deduplication key
- cache key
- producer identity
- resource ownership proof

## 7. Terminology

### 7.1 Idempotency key

Caller-provided retry-correlation key used as one separate component of idempotency comparison identity.

It is not:

- the fingerprint
- the scope
- the tenant
- authorization proof
- a global deduplication key

### 7.2 Caller scope reference

`scope_reference` is caller intent, correlation text, or future validation input only.

It is not:

- canonical tenant
- effective scope
- authorization proof

### 7.3 Effective scope

Effective scope is the tenant-bound, service-controlled comparison partition established or independently validated by a future service against canonical tenant context and approved operation-namespace rules.

It is not raw `scope_reference`.

### 7.4 Caller fingerprint reference

`request_fingerprint_ref` is a caller-provided reference only.

It is not:

- effective request fingerprint
- proof of request equality
- authority over service-established comparison

### 7.5 Fingerprint profile

Fingerprint profile identity means the ordered pair:

```text
(profile name, profile version)
```

For this proposal, fingerprint profile identity is:

- profile name: `external-evidence-verification-request`
- profile version: `0.1`

The normative projection continues to carry separate `profile.name` and
`profile.version` properties, and those two properties together constitute the
fingerprint profile identity.

Profile version must not be detached from profile name and treated as a
standalone namespace.

A fingerprint profile freezes:

- comparison projection
- canonicalization
- digest algorithm
- output encoding
- versioning rules

### 7.6 Canonical comparison projection

The canonical comparison projection contains only stable, verification-defining, authority-bearing request semantics selected by this profile.

It is not:

- the raw HTTP payload
- the raw JSON payload
- the accepted-request archive by itself

### 7.7 Claim lookup partition

Claim lookup partition means:

```text
effective scope + idempotency key
```

It expresses only the semantic lookup partition for an existing durable claim within one effective scope.

Before a future service may perform claim lookup against that partition, it must
already have established all of the following:

- authenticated calling context
- current operation authorization
- canonical tenant security domain
- effective scope

If any of those prerequisites are unavailable, claim lookup must not run, claim
existence must not be tested, and no claim-derived timing or resolution signal
may be disclosed.

It is not:

- a database index design
- a lock design
- a cross-tenant lookup permission
- a parallel-claim namespace

Different effective scopes must not resolve the same claim solely because the same key appears in both scopes.

### 7.8 Claim-bound comparison record

A claim-bound comparison record means:

```text
fingerprint profile identity
+ effective request fingerprint
+ immutable canonical request binding or reference
```

The existing claim determines which bound fingerprint profile identity must be
used for comparison. A newer active profile must not override the claim-bound
profile.

The effective request fingerprint does not replace immutable accepted-request or canonical-binding checks.

### 7.9 Full durable claim binding

The full durable claim binding means:

```text
effective scope
+ idempotency key
+ fingerprint profile identity
+ effective request fingerprint
+ immutable canonical request binding or reference
+ accepted logical job identity
```

The immutable canonical request binding or reference must semantically cover at
least all of the following when applicable:

- canonical evidence-package binding
- exact selected adapter immutable binding
- exact assurance-profile immutable bindings
- replay lineage binding
- accepted request identity

Fingerprint match is never a substitute for that immutable binding coverage.

This proposal defines only semantic binding. It does not define storage keys,
lookup algorithms, field-level schemas, source snapshot representation, digest
transport shape, or persistence representation.

### 7.10 Effective request fingerprint

The effective request fingerprint is the service-established value produced by applying profile-defined canonicalization and digest rules to the canonical comparison projection.

### 7.11 Durable idempotency claim

A durable idempotency claim is the future persistence-side semantic binding among:

- effective scope
- idempotency key
- fingerprint profile identity
- effective request fingerprint
- immutable canonical request binding or reference
- accepted logical job

This proposal does not design a storage schema for that claim.

### 7.12 Same logical job

Within an established effective scope, an existing durable claim may resolve to
the same logical job only when all of the following hold:

- the idempotency key matches
- the claim-bound fingerprint profile identity matches
- the incoming request is fully representable under that claim-bound profile
- the effective request fingerprint matches
- the immutable canonical request binding remains consistent
- current authorization and visibility permit resolution

Fingerprint equality is not sole authority for same-job resolution.

Immutable-binding mismatch and collision suspicion must fail closed.

Authorization or visibility failure must not resolve or disclose the job.

That is not the same thing as equal content, equal evidence digest alone, equal
evidence package identity alone, equal package ID alone, or equal digest alone.

### 7.13 Idempotency boundary presence

`VerificationRequest.idempotency` remains optional.

When an idempotency boundary is present, a future service may create a durable
idempotency claim only if all of the following can be established:

- an idempotency boundary is present
- a valid idempotency key is present
- effective scope can be established
- the canonical comparison projection can be established
- the effective request fingerprint can be established
- the immutable canonical request binding can be established
- the request passes other pre-acceptance validation

When an idempotency boundary is present, all pre-acceptance checks succeed, and
no existing claim is present in the established scope/key partition:

- a new logical job must be established
- a new durable claim bound to that job must be established
- the corresponding job-establishment disposition must be `created_new_job`
- no orphan claim is permitted
- an accepted idempotent submission must not be treated as established without
  its corresponding durable claim

When an idempotency boundary is present but pre-acceptance fails:

- neither a logical job nor a durable claim may be established
- no job-establishment disposition may be produced

When an idempotency boundary is absent:

- no durable idempotency claim may be created
- no existing-claim resolution may be performed
- no `resolved_existing_job` outcome may be returned on idempotency grounds
- each successful pre-acceptance submission that reaches job establishment must
  establish a new logical job
- the corresponding job-establishment disposition must be `created_new_job`
- pre-acceptance failure does not establish a job and does not produce a
  job-establishment disposition
- equal evidence, adapter, assurance-profile, or fingerprint content must not
  trigger content-only deduplication
- one submission must not borrow another submission's claim
- any future internal fingerprinting for diagnostics, observability, or
  comparison remains deferred
- even if a future implementation computes internal fingerprints, that must not
  change the accepted-submission new-job semantics
- authentication, authorization, and tenant rules still apply

## 8. Comparison Identity

The idempotency comparison identity for this proposal is frozen as:

```text
effective scope
+ idempotency key
+ fingerprint profile identity
+ effective request fingerprint
```

The four components are separate and non-substitutable.

Therefore:

- the fingerprint does not replace effective scope
- the fingerprint does not replace the idempotency key
- profile identity includes both name and version
- profile version alone is not a sufficient profile identity
- `request_id` alone does not decide same logical job
- content equality alone does not decide same logical job
- immutable canonical request binding consistency remains required for same-job
  resolution
- claim-bound-profile representability remains required for same-job resolution
- current authorization and visibility remain required for same-job resolution
- the same fingerprint with a different key may still create an intentional new job
- the same key with a different scope must not resolve across scopes
- cross-tenant callers must not resolve another tenant's existing job

The full durable claim binding must therefore remain distinct from the claim lookup partition:

- claim lookup partition: `effective scope + idempotency key`
- claim-bound comparison record: `fingerprint profile identity + effective request fingerprint + immutable canonical request binding or reference`
- full durable claim binding: `effective scope + idempotency key + fingerprint profile identity + effective request fingerprint + immutable canonical request binding or reference + accepted logical job identity`

Profile version is claim-bound comparison semantics. It is not a mechanism for creating parallel claims around an existing scope/key pair.

## 9. Profile Domain Separation

This profile uses stable domain separation.

The canonical comparison projection must include:

- profile name
- profile version
- service-controlled operation namespace

For `v0.1`, the operation namespace is frozen as:

```text
external-evidence.verification-job-submission
```

This is a semantic namespace only. It is not:

- an endpoint URL
- a controller name
- a database table
- a tenant-supplied namespace
- a caller-supplied arbitrary operation string

## 10. Included Inputs

The `v0.1` canonical comparison projection includes only the following categories.

### 10.1 Normative Canonical Comparison Projection

The following object is the normative canonical comparison projection shape for `v0.1`.

It is:

- a fingerprint-profile semantic schema
- part of the `v0.1` profile definition

It is not:

- a TypeScript declaration
- a public API
- a transport request
- a storage DTO
- executable runtime code

For standard non-replay submission, the semantic projection is:

```json
{
  "profile": {
    "name": "external-evidence-verification-request",
    "version": "0.1"
  },
  "operation_namespace": "external-evidence.verification-job-submission",
  "evidence_package": {
    "package_id": "<authoritative exact string>",
    "package_version": "<service-resolved exact string>",
    "source_schema_version": "<service-resolved exact string>",
    "digest": {
      "algorithm": "sha-256",
      "value": "<64 lowercase hexadecimal characters>"
    }
  },
  "adapter": {
    "adapter_id": "<exact string>",
    "adapter_version": "<exact string>"
  },
  "assurance_profiles": [
    {
      "profile_id": "<exact string>",
      "profile_version": "<exact string>"
    }
  ],
  "replay": {
    "mode": "none"
  }
}
```

For deterministic replay submission, the same structure is used, but `replay` is fixed to:

```json
{
  "mode": "deterministic_reexecution",
  "source_verification_id": "<authoritative exact string>",
  "source_verification_attempt_id": "<authoritative exact string>"
}
```

Normative shape rules:

- property names are fixed
- object hierarchy is fixed
- unknown properties are forbidden from the projection
- excluded fields must not be inserted as `null`, empty placeholders, or synthetic default strings
- top-level handwritten property order is not authoritative; RFC 8785 canonicalization determines the serialized property order
- all included identifiers and versions must be authoritative exact non-empty strings after service establishment or independent validation
- the `assurance_profiles` array remains sorted by ascending unsigned
  lexicographic comparison of the exact UTF-8 byte sequences of `profile_id`,
  then `profile_version`
- the comparator first compares the exact UTF-8 byte sequence of `profile_id`
- only if those byte sequences are identical does it compare the exact UTF-8
  byte sequence of `profile_version`
- comparison is by unsigned byte value from low to high
- if one exact byte sequence is a complete prefix of the other, the shorter
  sequence sorts first
- locale collation, operating-system locale, case folding, trimming,
  Unicode normalization, and language-default string sort must not influence
  the comparator
- comparison occurs only after authority resolution and string-validity checks
- duplicate assurance-profile pairs are invalid input before projection construction
- if upstream contracts permit an empty assurance-profile array, the projection uses `[]`; this proposal does not add a new minimum-cardinality input rule

### 10.2 Canonical evidence-package binding

Included:

- `package_id`
- service-resolved `package_version`
- service-established digest algorithm
- service-established canonical evidence digest
- resolved `source_schema_version`

Rules:

- raw `digest` text is not authoritative unless independently resolved into the service-established binding
- `integrity_ref` may help resolve an authoritative binding but must not silently replace canonical digest authority
- if immutable evidence content binding cannot be established, no durable idempotency claim may be created
- raw evidence payload is not placed directly into the fingerprint projection
- the fingerprint is not a substitute for evidence-integrity verification
- the projection-level canonical evidence digest uses exact literal `sha-256` for `algorithm`
- the projection-level canonical evidence digest `value` is exactly 64 lowercase hexadecimal characters
- the evidence-binding digest remains semantically distinct from the effective
  request fingerprint even though both use 64 lowercase hexadecimal output
- source-receipt digest algorithm names and formats may differ from the projection-level canonical evidence binding
- a future service must establish or independently validate the canonical `sha-256` evidence binding before creating the durable claim
- if canonical `sha-256` evidence binding cannot be established, no durable claim may be created

### 10.3 Exact adapter binding

Included:

- exact `adapter_id`
- exact `adapter_version`

Rules:

- the exact selected adapter binding entering the projection must be
  service-resolved or independently validated
- same adapter version must not silently change semantics
- manifest-content mutation under the same version is a contract defect, not a reason to treat a mutable alias as fingerprint authority
- the profile does not fingerprint arbitrary whole-manifest serialization in `v0.1`
- `v0.1` applies only after the adapter has already been exactly selected
- dynamic or default adapter selection is outside `v0.1`

### 10.4 Requested assurance-profile set

Included for each requested assurance profile:

- `profile_id`
- `profile_version`

Rules:

- the exact selected assurance-profile binding entering the projection must be
  service-resolved or independently validated
- the set is canonicalized by ascending unsigned lexicographic comparison of
  the exact UTF-8 byte sequences, comparing `profile_id` first and then
  `profile_version` only when `profile_id` is bytewise identical
- unsigned byte value determines ascending order
- if one fully matched byte sequence is a prefix of another, the shorter exact
  string sorts first
- locale collation, operating-system locale, case folding, trimming,
  Unicode normalization, and language-default sort are forbidden comparator
  inputs
- duplicate `(profile_id, profile_version)` pairs are invalid input, not silently deduplicated input
- caller order does not affect the fingerprint
- same profile version must not silently change meaning
- `v0.1` applies only after the assurance-profile set has already been exactly resolved
- default assurance-profile selection is outside `v0.1`

### 10.5 Replay intent

Non-replay submission uses an explicit semantic non-replay marker in the projection.

Deterministic replay conditionally includes:

- replay mode
- authoritative source verification identity
- authoritative source attempt identity
- independent validation of the two normative source-lineage identifiers

Rules:

- `v0.1` `deterministic_reexecution` is attempt-specific replay
- both `source_verification_id` and `source_verification_attempt_id` are mandatory for `v0.1` replay projection
- for the `v0.1` fingerprint preimage, those two identifiers are the complete
  replay-lineage projection
- the required independent validation is a pre-projection admissibility rule,
  not a hidden third lineage property
- if either authoritative replay lineage field cannot be established, no replay durable claim may be created
- caller-provided free-text `replay_reference` is not sole authority
- `replay_reference` remains excluded from the projection
- replay fingerprinting is for replay submission identity, not source-job reuse
- replay must not reuse the source idempotency boundary
- job-level replay without source attempt identity requires a new profile version
- source attempt identity is not an implementation-time optional field within `v0.1`
- richer replay provenance may remain outside the fingerprint preimage, but it
  must not be treated as a hidden third lineage property in `v0.1`

### 10.6 Fixed semantic envelope fields

The profile also includes:

- profile name
- profile version
- operation namespace

### 10.7 Future verification-affecting options

`v0.1` includes no additional verification-affecting options beyond the inputs listed above.

If a future request option changes:

- adapter behavior
- assurance checks
- normalization semantics
- verification result semantics

then that option must be introduced through a new profile version rather than being silently added to the `v0.1` projection.

For a new scope/key pair with no existing claim, a future service may use the
approved active newer profile that defines the new verification-affecting
option.

For an existing claim already bound to an older profile identity, incoming
verification-affecting semantics must first be fully representable under that
claim-bound profile before comparison can proceed. If the old profile cannot
fully and losslessly represent the new semantics, comparison is unavailable and
must fail closed rather than deleting, ignoring, or reclassifying the new
semantics as excluded metadata.

## 11. Excluded Inputs

The following are explicitly excluded from the `v0.1` fingerprint preimage:

- `request_id`
- `caller_reference`
- `customer_reference`
- `requested_at`
- `human_review_context`
- `request_metadata`
- `idempotency_key`
- raw `scope_reference`
- raw `request_fingerprint_ref`
- service-generated verification IDs except conditional replay source lineage
- attempt IDs except mandatory replay source lineage
- result IDs
- report IDs
- usage-record IDs
- job status
- attempt status
- result status
- response timestamps
- logging metadata
- operator notes
- transport headers
- authentication credential material
- tenant display name
- billing or account references

Exclusion rules:

- these fields may still have audit, correlation, or operational value
- exclusion does not authorize resubmission to overwrite the accepted request
- the accepted request remains immutable
- future annotation or metadata-update behavior remains deferred
- a matching fingerprint must not be used to silently merge excluded metadata

## 12. Canonical Evidence Binding

The profile depends on immutable canonical evidence binding, not on mutable aliases.

For `v0.1`, the evidence-binding portion of the projection is semantic, not implementation-shaped. It requires a future service to establish or independently validate:

- canonical package identity
- canonical package version
- canonical digest algorithm
- canonical evidence digest
- canonical source schema version

If any of those are unresolved, mutable, or only caller-asserted, the service must not create a durable idempotency claim.

For `v0.1`, the projection-level canonical evidence binding digest is frozen as:

- `algorithm`: exact literal `sha-256`
- `value`: exactly 64 lowercase hexadecimal characters

This is distinct from:

- the fingerprint digest algorithm, which remains `SHA-256`
- source-receipt or upstream digest spellings and formats, which may differ before service establishment

The future service must not copy a raw upstream digest directly into authority without independent establishment or validation of the canonical `sha-256` binding.

This proposal does not:

- choose a storage location
- choose a resolver
- choose an integrity service
- treat digest binding as a verification finding

## 13. Adapter and Profile Binding

The fingerprint profile binds exact verification-defining selection rather than mutable indirection.

Adapter rules:

- fingerprint exact `adapter_id`
- fingerprint exact `adapter_version`
- do not treat mutable adapter content under the same version as acceptable silent drift
- durable claim and accepted job semantics must still bind the exact selected manifest snapshot or an immutable content-addressed manifest reference
- fingerprint match must not override manifest immutable-binding mismatch
- same-version manifest content drift must fail closed
- same-version manifest content drift must not resolve same job
- same-version manifest content drift must not be reinterpreted as an ordinary request conflict that safely creates a second job

Assurance-profile rules:

- fingerprint ordered `(profile_id, profile_version)` pairs
- array ordering is ascending unsigned lexicographic comparison of the exact
  UTF-8 byte sequences of `profile_id`, then `profile_version`
- shorter exact UTF-8 prefixes sort before longer exact strings that extend the
  same prefix
- locale collation, language-default sort, case folding, trimming, and Unicode
  normalization must not affect the comparator
- reject duplicates before fingerprinting
- do not let caller order change the canonical set
- requested assurance-profile definitions must be historically recoverable or independently verifiable
- fingerprint match must not override assurance-profile immutable-binding mismatch
- same-version assurance-profile definition drift must fail closed

The profile does not currently fingerprint broader registry metadata, lifecycle status, or non-selected manifest candidates unless a future version explicitly proves they affect selected verification semantics.

The `v0.1` applicability boundary is therefore:

- exact adapter selection already occurred
- exact assurance-profile-set resolution already occurred
- mutable candidate-set selection is out of scope
- if future submission semantics allow default adapter selection, candidate-set selection, required mapping capability selection, or default assurance-profile resolution to influence the final chosen semantics, those selection inputs require a new profile version before entering the projection

## 14. Replay Binding

Replay is a separate semantic path from retry and same-submission recovery.

Replay rules:

- replay creates a new logical job
- replay uses a new request identity
- replay uses a new verification identity
- replay uses new attempt, result, report, and usage identities
- replay preserves approved source lineage
- replay stays bound to the same canonical tenant boundary as the source job
- replay must not reuse the source idempotency boundary
- replay may carry its own new idempotency claim for the replay submission itself
- for `v0.1`, `deterministic_reexecution` is attempt-specific replay
- for `v0.1`, both `source_verification_id` and `source_verification_attempt_id` are mandatory replay lineage inputs
- if either mandatory replay lineage input cannot be established, the replay durable claim must fail closed
- `replay_reference` remains non-authoritative and excluded from the projection

For fingerprinting:

- non-replay submission includes a semantic non-replay marker
- replay submission includes replay mode and authoritative source lineage
- source lineage is included because replay intent changes request meaning
- replay does not mean retry
- job-level replay without source attempt identity is not a `v0.1` case and requires a new profile version

## 15. Canonicalization

The `v0.1` canonical serialization is:

```text
RFC 8785 JSON Canonicalization Scheme over UTF-8
```

Canonicalization rules:

- the service constructs a semantic comparison object first
- the comparison object is serialized with RFC 8785 JCS
- the UTF-8 byte sequence of that canonical JSON is the digest preimage
- the normative property names and object hierarchy from Section 10 are part of the `v0.1` semantic schema

Optional and absence rules:

- excluded fields are absent from the projection, not replaced with synthetic placeholders
- conditionally unavailable included inputs are not converted into arbitrary empty strings
- for `v0.1`, absence and inclusion are determined by profile semantics before serialization
- if an included semantic binding cannot be established, the service must fail closed rather than inventing placeholder authority

String normalization rules:

- no Unicode normalization is performed
- no NFC, NFD, NFKC, or NFKD normalization is performed
- no locale-specific normalization is performed
- no case folding except where this profile explicitly freezes lowercase hexadecimal digest encoding
- no trimming-based equivalence
- the authoritative Unicode scalar/code-point sequence is preserved exactly
  after authority resolution and before RFC 8785 serialization
- visually equal strings with different code-point sequences produce different
  fingerprints
- RFC 8785 canonicalization does not authorize additional Unicode
  normalization
- invalid included strings that cannot participate in RFC 8785/JCS-compliant
  canonical JSON must fail closed
- replacement-character or other silent string repair must not be used to
  salvage invalid input
- identifier equality is exact after semantic construction
- any future Unicode-normalization change requires a new profile version

Collection-ordering rules:

- assurance-profile collections are sorted by ascending unsigned lexicographic
  comparison of the exact UTF-8 byte sequences of `profile_id`, then
  `profile_version`
- `profile_id` byte sequences are compared first, and `profile_version` byte
  sequences are compared only when `profile_id` is bytewise identical
- unsigned byte value determines ascending order
- shorter exact prefixes sort before longer exact strings that extend the same
  prefix
- locale collation, operating-system locale, case folding, trimming,
  Unicode normalization, and language-default string sort are forbidden
- duplicate ordered members are invalid input
- future comparator changes require a new profile version
- future included collections must define their own stable ordering through a
  new profile version if needed

## 16. Digest Algorithm and Encoding

The `v0.1` profile freezes:

- digest algorithm: `SHA-256`
- digest encoding: lowercase hexadecimal

Rules:

- the effective request fingerprint is the `SHA-256` digest of the canonical
  comparison projection encoded as exactly 64 lowercase hexadecimal characters
- the effective request fingerprint must satisfy the semantic regular
  expression `^[0-9a-f]{64}$`
- the effective request fingerprint is semantically distinct from
  `evidence_package.digest.value`
- the request fingerprint hashes the normative request projection
- the evidence digest binds canonical evidence content
- the two values are not interchangeable even though both use 64 lowercase
  hexadecimal output
- any algorithm change requires a new profile version
- any encoding change requires a new profile version
- the fingerprint value alone is not sufficient authority for collision safety
- the durable claim must still remain bound to immutable accepted-request and canonical-binding semantics

## 17. Caller Fingerprint Reference

`request_fingerprint_ref` remains non-authoritative.

It may serve as:

- caller correlation
- caller audit reference
- troubleshooting context

It must not serve as:

- the canonical fingerprint
- proof of equality
- proof of authenticity
- override authority over service-computed results

This profile therefore excludes raw `request_fingerprint_ref` from the canonical preimage.

## 18. Resolution Matrix

| Case | Existing claim state | Scope/key relationship | Bound comparison semantics | Result |
| --- | --- | --- | --- | --- |
| No idempotency boundary + pre-acceptance success | no durable claim lookup is attempted | no scope/key claim lookup partition is opened | no idempotency comparison runs | a new logical job is established with `created_new_job`; no durable claim and no existing-job resolution |
| No idempotency boundary + pre-acceptance failure | no durable claim lookup is attempted | no scope/key claim lookup partition is opened | job establishment never begins | fail before job creation; no job and no job-establishment disposition |
| Authentication, authorization, tenant domain, or effective scope unavailable | no safe claim lookup partition can be formed | boundary may be present, but lookup prerequisites are unavailable | claim lookup must not run before those prerequisites exist | fail closed; do not test claim existence, create durable claim, or resolve existing job |
| Boundary present but projection unavailable | scope/key may be known, but comparison inputs are incomplete | same scope/key partition cannot be safely compared | canonical projection, effective fingerprint, or immutable canonical binding cannot be established | fail closed; do not create durable claim, resolve existing job, or create a second job through the same boundary |
| No existing claim + successful pre-acceptance | no claim found | same scope/key partition has no prior claim | authenticated context, authorization, canonical tenant, effective scope, valid boundary/key, canonical projection, effective fingerprint, immutable canonical binding, and other pre-acceptance checks all succeeded | establish a new logical job and a new durable claim bound to that job, with `created_new_job` disposition |
| No existing claim + pre-acceptance failure | no claim found | same scope/key partition has no prior claim | some required pre-acceptance condition failed before idempotent acceptance | fail closed; establish neither job nor claim |
| Existing claim + request representable under bound profile + same fingerprint | existing claim found | same scope/key partition | compare under the existing claim-bound fingerprint profile identity because incoming semantics remain fully representable there, immutable canonical binding remains consistent, and current authorization/visibility still permit resolution | resolve same logical job |
| Existing claim + request representable under bound profile + different fingerprint | existing claim found | same scope/key partition | compare under the existing claim-bound fingerprint profile identity because incoming semantics remain fully representable there, immutable canonical binding remains consistent, and current authorization/visibility still permit resolution | `idempotency_conflict` |
| Existing claim + incoming verification-affecting semantics not representable under old profile | existing claim found | same scope/key partition | old claim-bound profile cannot fully and losslessly represent the incoming semantics | fail closed; no same-job resolution, no conflict-as-new-job, and no parallel claim |
| Existing claim + newer active profile but old profile remains usable | existing claim found | same scope/key partition | use the existing claim-bound profile because the incoming request remains fully representable there | compare under old claim-bound profile |
| Existing claim + original profile cannot be reconstructed | existing claim found | same scope/key partition | comparison under original bound profile cannot be safely reconstructed | fail closed; do not create parallel claim |
| Same scope + different key + same fingerprint | maybe no claim for new key | same scope, different key | different claim lookup partition | may create intentional new job |
| Different scope + same key + same fingerprint | claim may exist elsewhere | different scope | cross-scope resolution forbidden | must not resolve same logical job |
| Different tenant + same key + same fingerprint | claim may exist elsewhere | different tenant-bound scope | cross-tenant resolution forbidden | must not resolve same logical job |
| Deterministic replay with both source IDs | no replay claim yet or replay claim exists | replay submission has its own scope/key partition | replay projection uses `deterministic_reexecution` plus both mandatory source IDs | creates or resolves replay job; never reuses source job |
| Deterministic replay missing either source ID | replay lineage incomplete | any | `v0.1` replay requires both source lineage identifiers | fail closed |
| Excluded metadata changed | existing claim found | same scope/key partition | excluded fields do not affect projection | does not change fingerprint outcome and must not overwrite accepted request |
| Immutable binding mismatch | existing claim or comparison candidate found | same scope/key partition | fingerprint match does not override immutable canonical request binding mismatch | fail closed |
| Canonical evidence digest unavailable | comparison input incomplete | any | no authoritative `sha-256` evidence binding can enter the immutable canonical request binding | fail closed |
| Caller fingerprint ref match | caller correlation matches | any | raw caller reference is excluded from projection | no equality authority by itself |
| Caller fingerprint ref mismatch | caller correlation differs | any | raw caller reference is excluded from projection | no conflict authority by itself |
| Suspected collision | existing claim or comparison candidate found | same scope/key partition | fingerprint alone is not sole authority | fail closed |
| Unicode-invalid included string | comparison input is malformed | any | included string cannot participate in RFC 8785/JCS-compliant canonical JSON | fail closed |
| Assurance-profile ordering input | included assurance-profile set is available | any | canonical ordering must use the exact unsigned UTF-8 bytewise comparator | fail closed if ordering cannot be established deterministically under the profile rules |

The matrix is semantic only. It does not freeze problem literals beyond existing vocabulary or define a storage algorithm.

## 19. Retry, Replay, and New Job

Transport or client retry:

- aims to recover the same submission
- uses the same effective scope
- uses the same idempotency key
- uses the same fingerprint profile identity and fingerprint
- resolves the same logical job only when claim-bound representability,
  immutable canonical binding consistency, and current authorization/visibility
  requirements also hold

No idempotency boundary:

- does not create a durable idempotency claim
- does not run existing-claim resolution
- does not return `resolved_existing_job` on idempotency grounds
- each successful pre-acceptance submission that reaches job establishment
  creates a new logical job
- the corresponding job-establishment disposition is `created_new_job`
- pre-acceptance failure does not create a job and does not produce a
  job-establishment disposition
- must not be collapsed by content-only deduplication

Verification execution retry:

- is existing-job attempt semantics
- does not create a new logical job by fingerprinting a fresh submission
- remains runtime-policy-deferred

Deterministic replay:

- creates a new logical job
- preserves source lineage
- uses new request, job, attempt, result, report, and usage identities
- must not reuse the source idempotency boundary
- in `v0.1`, it is attempt-specific
- in `v0.1`, it requires both source verification and source attempt identity
- must include replay intent and source lineage in the replay submission fingerprint projection

Intentional new job:

- may omit replay context
- uses a new key or no key
- may keep verification-defining inputs otherwise equal
- still must not be collapsed by content-only deduplication

## 20. Profile Versioning

The profile version is immutable.

Versioning rules:

- every durable claim binds profile name and version
- profile upgrade must not rewrite existing fingerprints
- fingerprint profile identity always means the ordered pair of profile name and profile version
- existing claims continue to be interpreted under their original bound profile name and version
- a resubmission that encounters an existing claim must first satisfy a
  claim-bound-profile representability check before it may compare under that
  claim's bound profile name and version
- incoming verification-affecting semantics must be fully and losslessly
  representable under the existing claim-bound profile before comparison may
  proceed
- if the existing claim-bound profile does not define, cannot represent, or
  would ignore an incoming verification-affecting option, comparison is
  unavailable and must fail closed
- the service must not delete or ignore that new verification-affecting
  semantics merely to compute an old-profile fingerprint
- only fields that the claim-bound profile truly defines as excluded or
  non-defining may be ignored under old-profile comparison rules
- when representability succeeds, comparison proceeds under the existing
  claim-bound profile rather than silently switching to a newer active profile
- profile upgrade must not create a parallel claim around an existing effective scope and idempotency key
- profile version is claim-bound comparison semantics, not a new namespace around an existing scope/key pair
- inability to reconstruct comparison under the original profile must not be treated as authorization to create a new claim
- profile migration, backfill, retirement, and tooling remain deferred
- adding or removing an included input requires a new profile version
- changing canonicalization, assurance-profile comparator semantics,
  Unicode-normalization policy, digest algorithm, encoding, replay-lineage
  inputs, or operation-namespace semantics requires a new profile version

## 21. Collision Safety

Collision handling remains fail-closed.

Rules:

- a `SHA-256` fingerprint is not sole authoritative evidence
- the durable claim must remain bound to immutable accepted-request or canonical-projection reference semantics
- fingerprint match must not override canonical-binding mismatch
- suspected collision or projection inconsistency must not resolve as same job
- the service must not create a second job under the same scope/key tuple merely by pretending a collision is a safe new-job path
- exact runtime error literal and internal handling remain deferred
- raw credentials and raw evidence payload must not be captured as collision-diagnostic authority

## 22. Mutable-reference Safety

This profile assumes mutable aliases are unsafe as direct fingerprint authority.

Risks that must be treated as fail-closed include:

- same package ID resolving to different content
- same adapter version content being rewritten
- same assurance-profile version definition drifting
- external integrity reference changing target
- caller references being reused
- digest algorithm ambiguity

Rules:

- the fingerprint depends on immutable canonical bindings
- mutable aliases must not become direct fingerprint authority
- if immutable binding cannot be resolved, no durable claim may be created
- version identity must remain immutable
- registry, package storage, and persistence implementation remain deferred

## 23. Security and Privacy

This proposal preserves the existing security and privacy boundary:

- authenticated calling context, current operation authorization, canonical
  tenant security domain, and effective scope must all be established before
  any claim lookup, claim-existence test, fingerprint comparison, same-job
  resolution, conflict response, or claim-derived timing disclosure
- if those prerequisites are unavailable, claim lookup must not run
- unauthorized callers must not probe resource existence through fingerprint
  conflict behavior, conflict-versus-absence differences, or claim-derived
  timing behavior
- the fingerprint must not compare across tenants
- the fingerprint is not tenant proof
- the fingerprint and idempotency key are not authorization proof
- caller `scope_reference` must not determine the lookup partition
- the fingerprint must not include credentials, tokens, private keys, or session secrets
- the fingerprint projection must not include raw evidence payload
- canonical evidence digest remains a binding input, not a verification finding
- fingerprint values may create long-lived correlation surfaces, but logging and access policy remain deferred
- the fingerprint must not be used for user profiling, billing, or cross-customer analytics

## 24. Fingerprint Input Matrix

| Input | Status | Authority source | Canonicalization | Reason | Mutation risk | Versioning consequence | Current source coverage | Deferred implementation question |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| profile name | included | profile definition | fixed literal | domain separation | low | changing it requires new profile | docs-only | where it is stored |
| profile version | included | profile definition | fixed literal; existing-claim comparison remains subject to claim-bound-profile representability | profile identity and claim binding | low | changing it creates new profile | docs-only | claim storage |
| operation namespace | included | service-controlled semantic namespace | fixed literal | separates submission meaning | medium | changing it requires new profile | docs-only | how future service establishes it |
| evidence package ID | included | canonical package binding | exact string | identity binding | mutable alias risk | change requires different fingerprint | request reference exists | package resolution mechanics |
| resolved package version | included | service-established binding | exact string | version-stable evidence binding | mutable alias risk | change requires different fingerprint | optional package version exists today | resolution source |
| evidence digest algorithm | included | service-established binding | exact literal `sha-256` | digest meaning | ambiguity risk | change requires new profile or different fingerprint | digest field exists indirectly | canonical binding establishment |
| canonical evidence digest | included | service-established binding | exactly 64 lowercase hexadecimal characters | immutable evidence binding | collision or alias risk | change requires different fingerprint | digest field exists indirectly | canonical digest source |
| source schema version | included | canonical package binding | exact string | affects evidence semantics | medium | change requires different fingerprint | present on the resolved EvidencePackage or canonical evidence-package binding; not carried directly by the current VerificationRequest EvidencePackageReference | resolution rule |
| adapter ID | included | service-resolved or independently validated exact selected binding | exact string | verification-defining selection | low | change requires different fingerprint | existing request field | none now |
| adapter version | included | service-resolved or independently validated exact selected binding | exact string | verification-defining selection | mutable-version drift risk | change requires different fingerprint | existing request field | manifest recovery |
| assurance profile IDs/versions | included | service-resolved or independently validated exact selected binding | ascending unsigned lexicographic order of exact UTF-8 byte sequences, `profile_id` first, then `profile_version` | verification-defining selection | duplicate or order drift risk | comparator or set-definition change requires new profile version or different fingerprint | existing request field | duplicate rejection surface |
| replay mode | conditional | replay context | exact `none` or exact `deterministic_reexecution` by semantic case | replay changes request meaning | low | replay semantics change requires new profile | existing replay context | none in `v0.1` |
| replay source verification ID | conditional | independently validated normative source-lineage identifier | exact string | replay lineage binding | source-alias risk | lineage rule change requires new profile | existing replay context | lineage validation |
| replay source attempt ID | conditional | independently validated normative source-lineage identifier | exact string; mandatory for `v0.1` replay | replay lineage precision | missing-lineage risk | rule change requires new profile | existing replay context | none in `v0.1` |
| request ID | excluded | caller | absent | correlation only | reuse risk | none | existing request field | future precondition alignment only |
| caller reference | excluded | caller | absent | correlation only | reuse risk | none | existing request field | future local-fixture alignment only |
| customer reference | excluded | caller | absent | non-defining metadata | medium | none | existing request field | retention/redaction policy |
| requested timestamp | excluded | caller | absent | timing should not redefine identity | clock drift risk | none | existing request field | none now |
| human-review context | excluded | caller | absent | does not define verification semantics | annotation drift | none | existing request field | future annotation policy |
| request metadata | excluded | caller | absent | arbitrary metadata must not redefine identity | overwrite risk | none | existing request field | future metadata policy |
| idempotency key | excluded from fingerprint; separate tuple member | caller | absent from preimage | must remain separate identity component | misuse risk | changing key may create intentional new job | existing boundary field | none now |
| scope reference | excluded from fingerprint; future validation input only | caller | absent from preimage | must not masquerade as effective scope | spoofing risk | none directly | existing boundary field | scope derivation |
| request fingerprint ref | excluded | caller | absent | non-authoritative reference | spoofing risk | none | existing boundary field | whether retained for audit |
| service-generated IDs | excluded | service | absent | outputs, not request intent | low | none | existing jobs/results/reports/usage | none now |
| status fields | excluded | service | absent | lifecycle projection, not request intent | low | none | existing artifacts | none now |

## 25. Compatibility Matrix

| Surface | Current behavior | Proposal semantic impact | Source change required now | Future type question | Future fixture question | Runtime authorized |
| --- | --- | --- | --- | --- | --- | --- |
| `VerificationIdempotencyBoundary` | carries caller `idempotency_key`, `scope_reference`, `request_fingerprint_ref` | preserved as caller-intent surface; no field is upgraded to canonical fingerprint authority, and omission still means no durable claim path and no existing-job reuse path | no | whether future package-internal profile references are needed | whether fixture equality should later align to profile | no |
| `VerificationRequest` | carries request identity, evidence, adapter, profiles, metadata, and optional idempotency/replay context | preserved; proposal freezes which semantics count toward canonical fingerprint, freezes that omitted idempotency boundary means no existing-job resolution, and requires successful no-boundary job establishment to produce `created_new_job` | no | whether accepted-request profile references are needed | whether local fixtures distinguish precondition vs preimage | no |
| `VerificationReplayContext` | carries replay mode and source lineage only | preserved; `v0.1` replay is attempt-specific and requires both source lineage identifiers for projection construction | no | whether lineage helper types are needed | whether replay fixture later asserts profile-specific preimage rules | no |
| local idempotency/replay fixture | compares broader current equality set and returns `same_logical_job` | explicitly not treated as current profile implementation | no | none now | possible later alignment assessment | no |
| minimal service submission response | uses `created_new_job` and `resolved_existing_job` | comparison semantics are sharpened conceptually only; without an idempotency boundary, successful job-establishing submissions remain on the `created_new_job` path rather than existing-job resolution | no | maybe later durable-claim reference assessment | none now | no |
| persistence durable-claim proposal | requires effective scope + key + effective canonical fingerprint | this proposal freezes the future claim as effective scope + idempotency key + fingerprint profile identity + effective request fingerprint + immutable canonical request binding/reference + accepted logical job identity, and requires successful first idempotent acceptance to establish the job and its bound claim together | no | possible later package-internal claim binding assessment | none now | no |
| Authentication/Tenant boundary | effective scope remains tenant-bound and service-controlled | preserved; profile cannot override tenant boundary, and claim lookup remains downstream of authenticated context, authorization, canonical tenant-domain establishment, and effective-scope establishment | no | none now | none now | no |

Every row above preserves:

- source change required now: `no`
- runtime authorized: `no`

## 26. Threat and Failure Analysis

| Risk | Semantic mitigation |
| --- | --- |
| caller-supplied fingerprint spoofing | raw `request_fingerprint_ref` is excluded and non-authoritative |
| caller-supplied scope spoofing | raw `scope_reference` is excluded and effective scope remains service-controlled |
| cross-tenant key probing | effective scope remains tenant-bound; unauthorized resolution must remain concealed |
| content-only deduplication | content equality alone never decides same logical job |
| no-boundary content deduplication | absent idempotency boundary means no durable claim lookup, no existing-job reuse, and no content-only dedupe path |
| non-normative projection shape | Section 10 freezes one exact projection shape so independent implementations do not drift |
| profile identity double counting | fingerprint profile identity is one ordered pair and must not be counted again as a separate version dimension |
| profile-name omission | profile identity always includes both name and version |
| full durable binding omitting immutable canonical binding | full durable claim binding explicitly includes immutable canonical request binding or reference |
| canonicalization ambiguity | JCS over UTF-8 is frozen for `v0.1` |
| Unicode normalization drift | no Unicode normalization is performed; the exact authoritative code-point sequence enters the normative projection |
| cross-language assurance-profile comparator drift | exact unsigned UTF-8 bytewise ordering is normative |
| locale-dependent sorting | locale collation and operating-system locale are forbidden comparator inputs |
| language-default sort drift | language-default string sort is forbidden comparator authority |
| assurance-profile ordering drift | canonical sorted set is required |
| absent/null/empty ambiguity | absence rules are frozen and placeholder authority is forbidden |
| mutable package reference | immutable canonical evidence binding is required before claim creation |
| mutable adapter version | exact adapter version is fingerprinted and same-version mutation is treated as defect, not alias authority |
| mutable assurance-profile version | exact profile version is fingerprinted and silent semantic drift is rejected |
| caller-authoritative adapter/profile binding | only service-resolved or independently validated exact selected bindings may enter the projection |
| profile downgrade | durable claim remains bound to its original profile version |
| profile upgrade parallel claim | newer active profile must not silently create a second or parallel claim under the same historical scope/key tuple |
| existing claim compared under wrong active profile | comparison must use the existing claim-bound profile name and version |
| old-profile comparison silently drops new request semantics | incoming verification-affecting semantics must be fully representable under the claim-bound profile or comparison fails closed |
| hidden replay-lineage input | `v0.1` replay lineage projection contains only the two normative source identifiers and no hidden third lineage property |
| optional source-attempt lineage ambiguity | `v0.1` replay is attempt-specific and requires both source IDs |
| canonical evidence digest algorithm spelling ambiguity | projection-level algorithm literal is fixed to `sha-256` |
| request fingerprint and evidence digest conflation | request fingerprint hashes the normative request projection, while evidence digest binds canonical evidence content |
| manifest/profile same-version drift | immutable binding mismatch overrides fingerprint match and fails closed |
| mutable package/manifest/profile binding | immutable canonical request binding or reference remains mandatory beyond fingerprint equality |
| dynamic adapter selection hidden outside fingerprint | `v0.1` assumes exact preselected adapter binding only |
| default assurance profile hidden outside fingerprint | `v0.1` assumes exact resolved assurance-profile set only |
| digest collision | collision handling is fail-closed and fingerprint is not sole authority |
| same key with changed request intent | same scope + same key + different fingerprint yields conflict, not new job |
| excluded metadata overwrite | excluded fields do not change fingerprint and must not overwrite accepted request semantics |
| replay/source-job confusion | replay intent and source lineage are conditionally included and replay always creates a new logical job |
| replay reusing source boundary | replay must not reuse source idempotency boundary |
| pre-authorization claim lookup | authentication, authorization, tenant-domain establishment, and effective-scope establishment must precede claim lookup |
| conflict-versus-absence enumeration | unauthorized callers must not distinguish conflict from absence through resolution behavior |
| cross-tenant timing probe | claim-derived timing disclosure across unauthorized or cross-tenant contexts must remain concealed |
| request ID conflated with fingerprint | `request_id` remains excluded from preimage |
| raw evidence or credentials entering preimage | raw payload and credentials are explicitly excluded |
| logging fingerprint as authorization evidence | fingerprint is not authorization proof |
| lost-response duplicate job | the same comparison identity resolves the same logical job only when claim-bound representability, immutable canonical binding consistency, and current authorization/visibility requirements also hold |
| retention or deletion causing claim ambiguity | deletion and tombstone semantics remain deferred and must not be disguised as `not_produced` or safe new-claim space |

## 27. Technology and Storage Neutrality

This profile is semantic only.

It does not choose:

- database schema
- index key layout
- transaction algorithm
- locking strategy
- concurrency-control implementation
- queue behavior
- HTTP status mapping
- problem literal expansion
- auth middleware
- tenant identifier format
- storage location
- claim-retention duration
- deletion or tombstone model
- backfill tooling
- migration tooling
- observability implementation
- API exposure shape
- public export shape
- client-side fingerprint computation
- key-format restrictions
- rate limiting

## 28. Deferred Decisions

The following remain explicitly deferred:

- exact accepted-request archival representation
- durable-claim storage representation
- collision error literal
- conflict concealment transport mapping
- package-version resolution implementation
- canonical evidence digest resolution implementation
- replay-lineage validation implementation
- deletion and tombstone behavior
- retention duration
- profile migration tooling
- backfill and retirement tooling
- observability and logging policy
- API exposure and public export
- client fingerprinting

## 29. Type-contract Deferral

This proposal does not:

- create a fingerprint type
- modify `VerificationIdempotencyBoundary`
- modify `VerificationRequest`
- modify `VerificationJob`
- modify `VerificationReplayContext`
- upgrade `request_fingerprint_ref` into canonical fingerprint authority

After this proposal, the required next question is still separate:

`Idempotency Fingerprint Type-contract Need Assessment v0.1`

That later assessment must determine whether any package-internal profile reference, service-established fingerprint binding, durable-claim reference, comment correction, fixture alignment, or public export is actually needed.

This proposal does not pre-decide that answer.

## 30. Following-phase Routing

The only recommended following phase is:

`Idempotency Fingerprint Type-contract Need Assessment v0.1`

This proposal does not authorize direct progression into:

- TypeScript implementation
- local hash spike
- persistence implementation
- service API implementation
- transport implementation
- runtime implementation
- authentication or tenant implementation

## 31. Acceptance Criteria

This proposal is acceptable only if all of the following remain true:

- proposal-only is explicit
- docs-only is explicit
- exactly one new document is added
- no source type is added
- no existing type is modified
- profile name is fixed
- profile version is fixed
- comparison tuple is fixed
- fingerprint profile identity is the ordered pair of profile name and profile version
- profile identity includes both name and version in the comparison tuple
- `SHA-256` is fixed
- lowercase hexadecimal is fixed
- the effective request fingerprint is exactly 64 lowercase hexadecimal characters
- RFC 8785 canonicalization is fixed
- no Unicode normalization is performed
- visually equal strings with different code-point sequences are not treated as equal
- invalid included strings that cannot participate in JCS canonical JSON fail closed
- assurance-profile comparator is explicitly frozen
- assurance-profile comparator uses ascending unsigned lexicographic comparison
  of exact UTF-8 byte sequences
- assurance-profile comparator compares `profile_id` first and
  `profile_version` only when `profile_id` is bytewise identical
- shorter exact UTF-8 prefixes sort before longer exact strings with the same
  prefix
- assurance-profile comparator does not use locale collation or language-default
  sort
- operation namespace is fixed
- exact canonical projection property names are fixed
- exact canonical projection object hierarchy is fixed
- standard non-replay marker is fixed as `replay.mode = "none"`
- deterministic replay marker is fixed as `replay.mode = "deterministic_reexecution"`
- `v0.1` replay is attempt-specific
- deterministic replay requires both source verification and source attempt identity
- replay source verification and source attempt identity together form the complete `v0.1` replay-lineage projection
- replay preimage contains no hidden lineage property
- canonical evidence algorithm literal is fixed as `sha-256`
- canonical evidence digest is fixed to 64 lowercase hexadecimal characters
- evidence digest and request fingerprint remain semantically distinct
- unknown projection fields are forbidden
- null placeholders for absent excluded fields are forbidden
- caller fingerprint authority is `none`
- service fingerprint authority remains future service-established only
- canonical evidence binding is explicit
- mutable aliases are not authoritative
- adapter and assurance-profile bindings entering the projection are service-resolved or independently validated
- exact adapter version is included
- assurance-profile set is canonicalized
- duplicate assurance-profile pairs are invalid input
- replay intent is conditionally included
- `request_id` is excluded
- caller and customer references are excluded
- `requested_at` is excluded
- human-review context is excluded
- request metadata is excluded
- idempotency key remains a separate tuple member and is not hashed into the fingerprint
- raw `scope_reference` is not hashed into the fingerprint
- raw `request_fingerprint_ref` is not hashed into the fingerprint
- no credentials or raw evidence enter the projection
- absent idempotency boundary creates no durable claim
- absent idempotency boundary returns no `resolved_existing_job` outcome
- absent idempotency boundary is not content-deduplicated
- successful no-boundary job establishment creates a new logical job
- successful no-boundary job-establishment disposition is `created_new_job`
- pre-acceptance failure does not create a job
- the same comparison identity resolves the same logical job only when
  claim-bound representability, immutable canonical binding consistency, and
  current authorization/visibility requirements also hold
- same key with different fingerprint conflicts
- different key with same fingerprint may create a new job
- successful boundary-present first submission establishes `created_new_job`
- successful first boundary-present submission binds one durable claim to that
  job
- failed pre-acceptance establishes neither job nor claim
- no orphan claim is permitted
- no accepted idempotent job is permitted without its corresponding claim
- content-only dedupe is prohibited
- cross-tenant resolution is prohibited
- excluded metadata does not overwrite accepted request
- replay creates a new logical job
- replay does not reuse the source boundary
- manifest or assurance-profile immutable-binding mismatch overrides fingerprint match
- dynamic adapter selection is outside `v0.1`
- default assurance-profile selection is outside `v0.1`
- profile version is claim-bound
- existing claims are not recomputed under a newer profile
- claim-bound-profile representability is explicit
- old profiles do not silently ignore new verification-affecting semantics
- representability failure fails closed
- claim lookup partition is explicit
- claim lookup occurs only after authentication, authorization, canonical
  tenant-domain establishment, and effective-scope establishment
- unauthorized callers cannot distinguish claim absence from conflict by lookup
  behavior
- fingerprint and idempotency key are not authorization proof
- claim-bound comparison record is explicit
- full durable claim binding is explicit
- profile upgrade does not create a parallel claim
- collision handling remains fail-closed
- current fixture is not claimed as profile implementation
- no public export is authorized
- no runtime is authorized
- no authority expansion is introduced
- the only recommended following phase is `Idempotency Fingerprint Type-contract Need Assessment v0.1`
