# External Evidence Assurance Local Idempotency Fixture Semantic Alignment Assessment v0.1

## 1. Status

- Status: `assessment-only`
- Scope: `docs-only`
- Fixture implementation: `none`
- Fixture modification: `none`
- Sample modification: `none`
- Verifier modification: `none`
- Type modification: `none`
- Package modification: `none`
- Public export expansion: `none`
- Authentication/Tenant implementation: `none`
- Persistence implementation: `none`
- Transport implementation: `none`
- Runtime implementation: `none`
- Authority status: `no authority expansion`

This assessment is not:

- a fixture patch
- a verifier patch
- a fingerprint conformance implementation
- a JCS implementation
- a hashing implementation
- a durable-claim implementation
- a service runtime
- a production-readiness declaration

## 2. Executive Decision

Primary decision:
`COMMENT_OR_NAMING_ALIGNMENT_ONLY`

Confidence:
`high`

Fixture behavior changes required:
`no`

Fixture comment or naming changes required:
`comment alignment yes; naming changes no`

Sample changes required:
`no`

Verifier changes required:
`no`

Package-script changes required:
`no`

Public export changes required:
`no`

Runtime implementation authorized:
`no`

The current fixture behavior remains a valid deterministic local proof. The
stable gap is that the fixture source does not directly state that its broad
resubmission preconditions are not the Idempotency Fingerprint Profile v0.1
preimage and that its `same_logical_job` result is not production claim
resolution.

The narrow following change should add two package-internal source comments
without renaming or changing the module, builder, output key, resolution
literal, sample, verifier, package script, or public export boundary.

## 3. Assessment Question

Does the current local idempotency/replay fixture require a narrow semantic
alignment so that its bounded local proof cannot be mistaken for Idempotency
Fingerprint Profile v0.1 conformance, and if so, what exact change is justified
without implementing fingerprinting, effective scope, durable claims,
authentication, persistence, transport, or runtime behavior?

## 4. Approved Semantic Baseline

The approved profile freezes future service semantics:

- comparison identity is effective scope, idempotency key, fingerprint profile
  identity, and effective request fingerprint
- claim lookup is partitioned by effective scope and idempotency key
- profile identity includes name and version
- the canonical projection uses RFC 8785 JCS over UTF-8
- the effective request fingerprint uses SHA-256
- assurance-profile pairs use exact unsigned UTF-8 bytewise ordering
- duplicate assurance-profile pairs are invalid
- `request_id`, caller and customer references, `requested_at`,
  `human_review_context`, and `request_metadata` are excluded from the
  fingerprint preimage
- raw `scope_reference` is not effective scope
- raw `request_fingerprint_ref` is not a canonical fingerprint
- content-only deduplication is prohibited
- cross-tenant claim resolution is prohibited
- same-job resolution additionally requires claim-bound profile
  representability, immutable accepted-binding consistency, and current
  authorization and visibility
- replay is attempt-specific and creates a new logical job
- no-boundary submission does not open claim lookup or create a durable claim

The approved Type-contract Need Assessment concludes:

- Primary decision:
  `EXISTING_CONTRACTS_SUFFICIENT_WITH_SEPARATE_ALIGNMENT_WORK`
- Confidence: `high`
- Stable package-internal type gaps: `none`
- Stable service-boundary type gaps: `none`
- the current local equality line is not profile conformance
- fixture alignment must be assessed separately
- no type, fixture, verifier, persistence, transport, or runtime implementation
  was authorized

## 5. Current Fixture Purpose

`buildLocalIdempotencyReplayFixture(...)` is a package-internal, local-only
fixture builder. It composes the existing local verification-job envelope
fixture and proves deterministic relationships among:

- one source envelope
- one exact local resubmission request
- one deterministic replay envelope
- one intentional-new-job envelope

Its bounded proof shows:

- caller idempotency fields project consistently to request and job
- exact local resubmission preconditions reuse one set of source artifact
  identities
- deterministic replay creates a new identity lineage
- intentional new job stays outside the source caller boundary
- input and output construction remain deterministic and isolated

It does not prove:

- Fingerprint Profile v0.1 conformance
- canonical projection or JCS serialization
- effective request fingerprint computation
- tenant-bound effective scope
- durable claim creation or lookup
- authenticated or visible claim resolution
- representability under a claim-bound profile
- immutable accepted-binding validation
- collision handling
- transport behavior

## 6. Current Fixture Behavior Inventory

### 6.1 Source envelope

The source envelope:

- requires a full caller-provided idempotency boundary
- prohibits replay context
- projects request idempotency onto the job
- contains exactly one attempt
- maintains service identity consistency
- rejects deferred retry lifecycle fields

### 6.2 Exact local resubmission

The current local resubmission path compares:

- `request_id`
- optional `caller_reference`
- `evidence_package` by structural deep equality
- `adapter` by structural deep equality
- `requested_assurance_profiles` by order-sensitive structural deep equality
- `idempotency_key`
- `scope_reference`
- `request_fingerprint_ref`

It validates `requested_at` as a required string but does not compare it.
It does not include `customer_reference`, `request_metadata`, or
`human_review_context` in the normalized comparison object.

When all local checks pass, it returns:

- `resolution: "same_logical_job"`
- source request identity
- source job identity
- source attempt identity
- source result identity
- source report identity
- source usage identity

This is local fixture identity reuse, not service claim resolution.

### 6.3 Deterministic replay

The replay path requires:

- `replay_mode: "deterministic_reexecution"`
- source verification ID equality
- source verification-attempt ID equality
- evidence reference preservation
- adapter reference preservation
- assurance-profile input-array preservation
- new request, job, attempt, result, report, and usage identities
- no reuse of the source caller idempotency boundary

### 6.4 Intentional new job

The intentional-new-job path requires:

- no replay context
- evidence, adapter, and assurance-profile selection preservation
- new request, job, attempt, result, report, and usage identities
- a caller idempotency boundary different from the source boundary when one is
  present

The implementation permits an absent caller boundary for this path, but the
current canonical sample supplies a different boundary.

## 7. Current Sample Inventory

The sample module:

- constructs the source envelope from the completed-with-findings envelope
  sample
- assigns deterministic source IDs and timestamps
- supplies a full caller idempotency boundary
- clones the source request for exact local resubmission
- changes `requested_at` and `request_metadata` on resubmission
- creates deterministic replay lineage and fresh service identities
- creates an intentional new job with the same selections and a different
  caller boundary
- produces deterministic output through the local fixture builder

The sample does not:

- cover a no-boundary source submission
- test reordered equivalent assurance-profile sets
- test duplicate assurance-profile pairs
- construct a canonical fingerprint
- represent a service claim

It is test construction, not an architecture consumer.

## 8. Current Verifier Inventory

The focused verifier currently asserts:

- static reuse of the existing envelope fixture
- deterministic sample/direct output equality
- exact output keys
- exact `same_logical_job` output shape
- source request/job boundary projection equality
- replay lineage and fresh service identities
- intentional-new-job boundary separation
- input immutability and repeated-build determinism
- negative cases for every current local equality field
- negative replay lineage and selection drift cases
- absence of retry, network, nondeterminism, duplicated integrity logic, and
  runtime-oriented tokens
- private package isolation
- focused package-script stability
- absence from aggregate verify by focused script name

The verifier does not assert:

- JCS serialization
- SHA-256 derivation
- canonical assurance-profile ordering
- duplicate profile rejection
- effective scope
- durable claims
- profile representability
- authenticated or visible claim resolution

The focused verifier applies explicit static scans rather than a general ban
on architecture or security vocabulary:

- its fixture-source exact-string list includes network access,
  nondeterminism, dynamic/runtime wiring, duplicated integrity helpers,
  billing terms, Ramen, and the literal `authority`
- its serialized-output exact-string list includes retry lifecycle fields,
  worker and queue fields, billing terms, Ramen, and the literal `authority`
- its fixture-source regular-expression list separately targets specified
  network, nondeterminism, persistence, database, scheduler, billing,
  approval, authorization, certification, deployment-authority, Ramen, and
  duplicated-implementation patterns

Future comments must pass the exact strings and regular expressions actually
enumerated by the current verifier. The verifier does not establish a general
ban on every architecture or security term, and this assessment does not
change any scan list or expression.

## 9. Current Consumer Inventory

### Fixture implementation

`packages/guard-core/src/externalEvidence/localIdempotencyReplayFixture.mjs`

### Sample construction

`scripts/fixtures/local_external_evidence_idempotency_replay.mjs`

### Focused verifier

`scripts/verify_external_evidence_local_idempotency_replay.mjs`

### Upstream fixture dependency

`packages/guard-core/src/externalEvidence/localVerificationJobEnvelopeFixture.mjs`

### Downstream local fixture consumer

`packages/guard-core/src/externalEvidence/localTechnicalUsageRecordFixture.mjs`
consumes the exact `idempotent_resubmission_resolution` key,
`same_logical_job` literal, and source artifact references.

### Package script

`verify:external-evidence:local-idempotency-replay`

### Public export boundary

`packages/guard-core/src/index.ts` does not export the fixture.

Consumer interpretation:

- fixture and verifier are not two independent business consumers
- the sample is test construction, not an architecture consumer
- the technical-usage fixture is a concrete local downstream consumer of the
  existing output shape
- current consumers depend only on existing local output
- no future profile-conformance consumer exists today

## 10. Four-layer Distinction

### 10.1 Current local fixture proof

The current fixture proves caller-boundary projection, exact local equality,
source identity reuse under those local preconditions, fresh replay lineage,
intentional-new-job separation, determinism, immutability, and package
isolation.

### 10.2 Approved fingerprint-profile semantics

The approved profile freezes canonical projection, profile identity, SHA-256
fingerprinting, effective scope, durable claim semantics, representability,
immutable accepted binding, and authorization/visibility ordering for a future
service.

### 10.3 Future conformance fixture

A separately approved conformance fixture may test JCS serialization, exact
UTF-8 profile ordering, canonical digest production, profile-version
compatibility, excluded-field behavior, duplicate-profile rejection, and the
approved resolution matrix.

The current fixture is not that conformance fixture.

### 10.4 Future runtime behavior

Future runtime behavior includes authenticated claim lookup, persistent claim
creation, production same-job resolution, collision handling, and transport
problem mapping.

The current fixture does not implement those behaviors.

## 11. Alignment Eligibility Criteria

A current fixture behavior change is eligible only when:

1. current behavior directly conflicts with approved semantics rather than
   merely proving a narrower or broader local condition
2. current naming, return value, or assertion reasonably creates a semantic
   misread
3. documentation alone cannot close that risk
4. the change does not imply profile implementation
5. the change does not depend on effective scope, authentication, tenant,
   persistence, transport, or runtime behavior
6. the fixture remains deterministic, local-only, and non-exported
7. replay and intentional-new-job boundaries remain intact
8. a concrete current fixture or verifier consumer supports the change
9. one separate small PR can contain the change
10. Guard authority does not expand

Interpretation rules:

- a field excluded by the approved profile is not automatically forbidden as
  a local fixture precondition
- a fixture precondition is not a fingerprint preimage member
- local equality is not service claim resolution
- conceptual divergence is not automatically a behavioral defect
- naming or comment risk must be classified separately from behavior error

No current behavior candidate satisfies all ten behavior-change criteria.

## 12. Classification Taxonomy

Each candidate receives exactly one primary classification:

- `existing_bounded_fixture_behavior`
- `no_alignment_required`
- `docs_alignment_need`
- `comment_alignment_need`
- `naming_alignment_need`
- `sample_alignment_need`
- `fixture_assertion_alignment_need`
- `verifier_assertion_alignment_need`
- `fixture_and_verifier_coupled_alignment_need`
- `future_conformance_fixture_need`
- `fingerprint_profile_implementation_dependency`
- `authentication_tenant_dependency`
- `persistence_dependency`
- `runtime_dependency`
- `not_a_fixture_concern`

## 13. Candidate Matrix

| Candidate | Current fixture behavior | Current verifier assertion | Approved semantic reference | Conflict or bounded-scope difference | Misread risk | Current consumers | Proposed alignment category | Behavior change required | Comment or naming change required | Sample change required | Verifier change required | Dependency | Primary classification | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Fixture module name | includes `local` and idempotency/replay | exact path and isolation asserted | current fixture remains local-only | bounded and accurate | low | sample, focused verifier, technical-usage sample | retain | no | no | no | no | none | no_alignment_required | existing name already carries the local boundary |
| 2. Builder function name | `buildLocalIdempotencyReplayFixture` | import and private-export isolation asserted | current fixture is not profile implementation | bounded and accurate | low | sample and focused verifier | retain | no | no | no | no | none | no_alignment_required | renaming would add churn without closing the real comment gap |
| 3. Package script name | focused local-idempotency-replay verifier | exact command asserted | focused verifier remains separate | bounded and accurate | low | package verification workflow | retain | no | no | no | no | none | no_alignment_required | script name does not claim profile conformance |
| 4. Sample module name | local external-evidence idempotency replay | sample import asserted | test construction only | bounded and accurate | low | focused and technical-usage verifiers | retain | no | no | no | no | none | no_alignment_required | local naming is already explicit |
| 5. Output key `idempotent_resubmission_resolution` | carries bounded source identity reuse | exact key asserted | service claim resolution needs more semantics | bounded-scope difference | medium | focused verifier and technical-usage fixture | clarify surrounding source comment | no | comment yes, rename no | no | no | existing downstream shape | comment_alignment_need | key is consumed and should not be renamed; a comment can bound its meaning |
| 6. Resolution literal `same_logical_job` | returned after exact local checks | exact literal and shape asserted | production same-job resolution needs claim-bound checks | bounded-scope difference | medium | focused verifier and technical-usage fixture | clarify local result meaning | no | comment yes, literal unchanged | no | no | existing downstream shape | comment_alignment_need | literal is useful local vocabulary but must not imply runtime resolution |
| 7. Idempotent resubmission terminology | labels exact local resubmission path | positive and negative cases use term | approved service semantics are broader | bounded-scope difference | medium | fixture, sample, verifier | retain with bounded comment | no | comment yes | no | no | none | comment_alignment_need | terminology is acceptable when explicitly scoped to the local proof |
| 8. Local bounded proof terminology | present in sample limitations and docs, absent at builder entry | no required source comment | approved proposal calls fixture bounded local semantics | no behavior conflict | medium | source readers | add source comment | no | comment yes | no | no | none | comment_alignment_need | builder entry should state the already-approved boundary |
| 9. Explicit non-conformance statement | absent in fixture source | verifier does not require one | current fixture is not profile conformance | no behavior conflict | high | source readers | add source comment | no | comment yes | no | no | verifier token constraints | comment_alignment_need | this is the clearest residual misread risk |
| 10. Public-export isolation | fixture not exported | index and package scan asserted | no public export authorized | aligned | low | package boundary | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current isolation is correct |
| 11. `request_id` equality | required for exact local resubmission | mismatch negative case asserted | excluded from fingerprint preimage | bounded-scope difference | medium | fixture and verifier | retain and clarify as retry correlation | no | comment yes | no | no | future excluded-field conformance | comment_alignment_need | exclusion from preimage does not invalidate a local correlation precondition |
| 12. `caller_reference` equality | optional exact match | mismatch negative case asserted | excluded from fingerprint preimage | bounded-scope difference | medium | fixture and verifier | retain and clarify as local narrowing | no | comment yes | no | no | future excluded-field conformance | comment_alignment_need | caller reference is not canonical identity |
| 13. `requested_at` handling | required and normalized but not compared | sample changes it and positive case passes | excluded from fingerprint preimage | aligned local behavior | low | fixture and sample | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current sample already demonstrates timestamp variance |
| 14. `customer_reference` handling | not included in resubmission comparison | no focused assertion | excluded from fingerprint preimage | aligned omission | low | request envelope only | retain | no | no | no | no | none | no_alignment_required | no current equality claim is made |
| 15. `request_metadata` handling | not included in resubmission comparison | sample changes metadata and positive case passes | excluded from fingerprint preimage | aligned omission | low | sample and envelope | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current sample demonstrates metadata variance |
| 16. `human_review_context` handling | not included in resubmission comparison | no focused assertion | excluded from fingerprint preimage | aligned omission | low | request envelope only | retain | no | no | no | no | none | no_alignment_required | no profile or local identity claim is made |
| 17. `evidence_package` deep equality | compares current `EvidencePackageReference` structurally | mismatch negative case asserted | canonical accepted binding is future service-established | bounded-scope difference | medium | fixture and verifier | retain with bounded comment | no | comment yes | no | no | future canonical binding | comment_alignment_need | deep equality is local reference equality, not immutable accepted-binding validation |
| 18. Evidence-reference authority interpretation | raw digest and integrity text may be equal | no canonical digest assertion | generic fields do not establish canonical authority | no direct behavior conflict | high | source readers | clarify non-canonical carriage | no | comment yes | no | no | future service validation | comment_alignment_need | current reference text must not be elevated into canonical evidence binding |
| 19. `adapter` deep equality | compares exact current adapter reference | mismatch negative case asserted | approved profile uses resolved immutable adapter binding | bounded-scope difference | medium | fixture and verifier | retain with bounded comment | no | comment yes | no | no | future manifest binding | comment_alignment_need | reference equality does not prove immutable manifest snapshot equality |
| 20. `requested_assurance_profiles` deep equality | compares input arrays structurally | mismatch negative case asserted | approved profile compares canonical profile set | bounded-scope difference | medium | fixture and verifier | retain as input-array equality | no | comment yes | no | no | future conformance fixture | comment_alignment_need | current check is deliberately not canonical set comparison |
| 21. Assurance-profile input ordering sensitivity | reordered array is unequal | no dedicated reordered-profile case | approved profile uses unsigned UTF-8 bytewise ordering | bounded-scope difference | medium | fixture local path | defer to conformance fixture | no | comment yes | no | no | profile canonicalization | future_conformance_fixture_need | implementing sorting here would turn the fixture toward profile implementation |
| 22. Duplicate assurance-profile behavior | identical duplicate arrays can pass local equality | no duplicate case | approved profile treats duplicate pairs as invalid | bounded-scope difference because pre-acceptance validation is absent | medium | fixture local path | defer validation to conformance or service boundary | no | comment yes | no | no | pre-acceptance/profile validation | future_conformance_fixture_need | local equality does not claim to validate an accepted profile set |
| 23. `idempotency_key` equality | exact caller text equality | mismatch negative case asserted | key is separate comparison tuple member | compatible local narrowing | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current equality is consistent but does not perform claim lookup |
| 24. `scope_reference` equality | exact caller text equality | mismatch negative case asserted | raw reference is not effective scope | bounded-scope difference | high | fixture and verifier | retain and clarify caller-text status | no | comment yes | no | no | authentication and tenant boundary | comment_alignment_need | equality proves only caller text consistency |
| 25. `request_fingerprint_ref` equality | exact caller text equality | mismatch negative case asserted | raw reference is not effective fingerprint | bounded-scope difference | high | fixture and verifier | retain and clarify caller-text status | no | comment yes | no | no | future fingerprint establishment | comment_alignment_need | equality proves only caller text consistency |
| 26. Required full source idempotency boundary | source requires key, scope ref, and fingerprint ref | positive source assertion and missing-field behavior protected | approved service allows optional boundary and derives effective values | bounded local scenario | medium | fixture and sample | retain and document scenario limit | no | comment yes | no | no | future broader scenario coverage | comment_alignment_need | source fixture intentionally proves one full-boundary case |
| 27. Request/job idempotency projection equality | job must match request boundary | positive projection asserted | caller-boundary projection remains valid | aligned | low | envelope and fixture | retain | no | no | no | no | none | existing_bounded_fixture_behavior | projection is not effective-scope establishment |
| 28. Same-job reuse of service-generated identities | result references source identity set | exact result shape asserted | runtime reuse needs claim-bound conditions | bounded-scope difference | medium | focused verifier and technical-usage fixture | clarify local outcome | no | comment yes | no | no | future runtime | comment_alignment_need | local identity reuse is not production resolution |
| 29. Source-envelope immutability | source snapshot remains equal | immutability asserted | deterministic local proof requirement | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | no semantic drift |
| 30. Deterministic fixture output | same input yields deep-equal output | repeated-build and reordered assembly asserted | deterministic fixture posture | aligned | low | sample and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | deterministic output remains valuable independently of fingerprinting |
| 31. Replay mode | exact `deterministic_reexecution` | exact literal asserted | approved replay mode matches | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current replay vocabulary is approved |
| 32. Replay source verification ID | must match source job | mismatch negative case asserted | mandatory replay lineage member | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | preserves attempt-specific lineage |
| 33. Replay source attempt ID | must match source attempt | mismatch negative case asserted | mandatory replay lineage member | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | preserves attempt-specific lineage |
| 34. Replay selection preservation | evidence, adapter, and profile input arrays preserved | drift negative cases asserted | replay uses accepted selections and future replay projection | bounded local proof | low | fixture and verifier | retain | no | no | no | no | future canonical binding | existing_bounded_fixture_behavior | current proof is reference preservation, not canonical reconstruction |
| 35. Replay new identities | all service identity namespaces change | positive and reuse negative cases asserted | replay creates new logical job | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | approved replay boundary is preserved |
| 36. Replay source-boundary non-reuse | identical source caller boundary rejected | behavior protected | replay must not reuse source claim boundary | aligned local expression | low | fixture and verifier | retain | no | no | no | no | future claim semantics | existing_bounded_fixture_behavior | no weakening is justified |
| 37. Intentional-new-job replay-context prohibition | replay context rejected | negative case asserted | intentional new job is not replay | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | current distinction is correct |
| 38. Intentional-new-job selection preservation | same evidence, adapter, and profile input arrays | positive assertions | same content may use a different key and create new job | aligned bounded proof | low | fixture and verifier | retain | no | comment yes | no | no | none | comment_alignment_need | comment should state that preserved content does not trigger deduplication |
| 39. Intentional-new-job new identities | all service IDs differ | positive assertions | new job requires new logical identity | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | approved boundary is preserved |
| 40. Intentional-new-job source-boundary separation | boundary must differ or be absent | same-boundary negative case asserted | different key or no boundary may create new job | aligned local proof | low | fixture and verifier | retain | no | comment yes | no | no | future acceptance behavior | comment_alignment_need | fixture does not simulate job acceptance or claim creation |
| 41. No-boundary scenario coverage | source sample always has full boundary; intentional-new-job code permits absence | no explicit no-boundary source case | approved profile freezes no-boundary service outcome | coverage difference | medium | no current dedicated consumer | defer to separate conformance scenario | no | no | no | no | future service/conformance fixture | future_conformance_fixture_need | absence of a scenario is not current behavior conflict |
| 42. Content-only-deduplication interpretation | intentional new job preserves evidence, adapter, and profile selections while using fresh service identities and source-boundary separation | selection and identity assertions present | content-only deduplication prohibited | aligned bounded scenario, not a deduplication decision | medium | fixture and verifier | clarify intent in source comment | no | comment yes | no | no | none | comment_alignment_need | current behavior demonstrates one bounded local scenario; it does not implement a content-deduplication decision |
| 43. Verifier positive-case wording | describes sample and local identity relationships | output message says local idempotency replay verified | current fixture is bounded local proof | aligned | low | maintainers and CI | retain | no | no | no | no | none | no_alignment_required | no profile-conformance claim appears |
| 44. Verifier negative-case wording | names current field mismatches and replay drift | exact errors asserted | protects current local fixture only | aligned | low | maintainers and CI | retain | no | no | no | no | none | no_alignment_required | messages do not claim canonical comparison |
| 45. Verifier forbidden-token boundary | applies enumerated exact-string and regular-expression scans to fixture source, plus an exact-string scan to output | actual static scans asserted | fixture must remain isolated | aligned | medium | fixture maintainers | retain exact current scans | no | future comments must pass actual enumerated scans | no | no | existing verifier gate | existing_bounded_fixture_behavior | the gate is specific, not a general ban on all architecture or security vocabulary |
| 46. Verifier ban on token `authority` | exact literal is forbidden in fixture source and serialized output | exact token checks asserted | approved docs use authority language | wording coupling only | medium | fixture maintainers | avoid the literal in fixture comments | no | comment wording constraint | no | no | existing verifier gate | existing_bounded_fixture_behavior | the literal is actually enumerated; other wording must be evaluated against the verifier's exact strings and regexes |
| 47. Fixture and sample determinism assertions | deterministic cloning and repeated output | deep equality asserted | local fixture requirement | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | independent of future profile conformance |
| 48. Fixture and sample immutability assertions | input and source output remain unchanged | mutation isolation asserted | local fixture requirement | aligned | low | fixture and verifier | retain | no | no | no | no | none | existing_bounded_fixture_behavior | no alignment gap |
| 49. Profile-conformance assertions currently absent | no JCS, digest, ordering, or resolution-matrix checks | absence confirmed by source and verifier review | profile conformance remains future work | intentional separation | low if source comment added | no current conformance consumer | keep absent | no | comment yes | no | no | future conformance fixture | future_conformance_fixture_need | adding such assertions now would exceed scope |
| 50. Future conformance fixture separation | no dedicated fixture exists | no focused conformance verifier exists | profile proposal freezes future semantics | future need, not current defect | medium | none | preserve separate future line | no | docs distinction only | no | no | separately approved phase | future_conformance_fixture_need | current fixture must not absorb canonical behavior |

## 14. Request-ID Equality

`request_id` equality is a local retry-correlation precondition. It is not
described in code as a fingerprint input, but the lack of a source comment
leaves room for that inference.

Decision:

- preserve behavior
- preserve current error message
- add bounded-proof comment at the fixture entry or resolution helper
- use a future conformance fixture to prove that `request_id` is excluded from
  the fingerprint preimage

## 15. Caller-reference Equality

Caller-reference equality narrows the current local resubmission scenario. It
does not make caller reference canonical request identity.

Decision:

- preserve behavior and sample
- preserve error message
- clarify that broad local preconditions are not preimage members
- defer excluded-field conformance testing

## 16. Requested-at and Metadata

`requested_at` is normalized but not compared. The sample changes it while
still resolving the local source identity set. `request_metadata` also changes
and is not included in the normalized comparison. `customer_reference` and
`human_review_context` are not comparison fields.

Decision:

- no behavior, sample, or verifier change
- current behavior is consistent with their exclusion from the approved
  fingerprint preimage

## 17. Evidence-package Equality

The fixture compares the existing `EvidencePackageReference` by structural
deep equality.

This does not:

- validate an immutable accepted evidence-package binding
- establish a canonical evidence digest
- validate a digest algorithm
- upgrade raw digest or integrity-reference text

Decision:

- preserve behavior and error message
- clarify at the broad local comparison boundary
- do not create a canonical digest or binding

## 18. Adapter Equality

Adapter deep equality proves equality of the current exact adapter reference.
It does not prove equality of an immutable accepted manifest snapshot.

Decision:

- preserve behavior
- cover the distinction in the broad local-proof comment
- defer immutable manifest binding to future service/conformance work

## 19. Assurance-profile Equality and Ordering

The current fixture uses order-sensitive array deep equality.

Consequences:

- same pairs in a different order do not satisfy current local equality
- identical duplicate pairs can satisfy local array equality
- no canonical unsigned UTF-8 ordering occurs
- no duplicate-pair validation occurs

These are bounded-scope differences, not direct defects, because the current
fixture does not claim to perform pre-acceptance profile validation or
Fingerprint Profile v0.1 canonicalization.

Decision:

- preserve current behavior
- do not add sorting or duplicate validation
- clarify input-array equality
- reserve canonical ordering and duplicate rejection for a future conformance
  fixture

## 20. Idempotency-key Equality

Exact caller key equality is compatible with the approved tuple, but the
fixture does not use it to open or resolve a durable claim partition.

Decision:

- preserve behavior and error message
- no standalone alignment required

## 21. Scope-reference Equality

Exact `scope_reference` equality proves only that caller text remained equal in
the local scenario.

It does not establish:

- canonical tenant
- effective scope
- cross-tenant isolation
- authorization or visibility

Decision:

- preserve behavior and type
- include it within the broad local-precondition comment
- do not implement effective scope

## 22. Fingerprint-reference Equality

Exact `request_fingerprint_ref` equality proves only that caller text remained
equal.

It does not establish:

- a service-established effective request fingerprint
- canonical projection
- digest validity
- claim-bound comparison

Decision:

- preserve behavior and type
- include it within the broad local-precondition comment
- do not compute or validate a fingerprint

## 23. Same-logical-job Resolution Literal

The exact literal is consumed by:

- the focused verifier
- the technical-usage fixture
- the technical-usage verifier

Renaming it would require unnecessary multi-file churn and would not itself
solve the distinction between local proof and runtime claim resolution.

Decision:

- preserve output key and literal
- add a source comment immediately before the local resolution helper or
  returned result
- state that source identity reuse follows exact local checks and is not a
  service response or profile-conformance result

## 24. Replay Semantics

Current replay behavior correctly preserves:

- attempt-specific lineage
- source verification and attempt references
- source selections
- new request, job, attempt, result, report, and usage identities
- source caller-boundary non-reuse

Decision:

- no behavior, sample, wording, or verifier change
- do not weaken the new-logical-job boundary

## 25. Intentional-new-job Semantics

Current behavior correctly proves:

- no replay context
- same selections for boundary isolation
- new service identities
- a caller boundary different from the source when present

The intended interpretation should be clearer:

- preserved selections can coexist with fresh identities and a distinct caller
  boundary in this bounded local scenario
- a different caller boundary or no boundary remains outside the source
  boundary
- the fixture does not simulate runtime acceptance or durable claim creation
- the fixture does not implement a content-deduplication decision

Decision:

- preserve behavior and sample
- include content-only-deduplication separation in the narrow comment

## 26. No-boundary Coverage

The source fixture requires a full boundary. The intentional-new-job path can
accept an absent boundary, but the canonical sample supplies a different
boundary. There is no dedicated no-boundary source-submission sample.

The approved profile freezes the future service outcome for no-boundary
submissions, but the current fixture does not claim full resolution-matrix
coverage.

Decision:

- no sample addition now
- classify as a future conformance-fixture need
- do not simulate claim absence or runtime job establishment

## 27. Content-only-deduplication Boundary

The intentional-new-job scenario demonstrates a bounded local case in which
preserved evidence, adapter, and assurance-profile selections coexist with
fresh service identities and source-boundary separation.

That scenario is compatible with the prohibition on content-only
deduplication, but the fixture is not a deduplication engine and does not
perform a production content-deduplication decision. The source comment should
make this limited interpretation explicit.

## 28. Verifier Coupling

The focused verifier does not describe the fixture as profile conformance.
Positive cases protect current local projections and identities. Negative
cases protect current local inputs and replay boundaries.

The verifier constrains future fixture comments through its current enumerated
exact strings and regular-expression patterns. The literal `authority` is
present in both exact-string scans. Other terms must be evaluated against the
actual arrays and expressions rather than inferred from a generalized
architecture-vocabulary rule.

Sufficient bounded comments can pass the actual current scans. Therefore:

- fixture and verifier do not require coupled modification
- verifier assertions remain unchanged
- verifier scan lists and expressions remain unchanged
- package script remains unchanged
- aggregate verify remains unchanged

## 29. Public-export and Package Boundary

The fixture remains absent from `packages/guard-core/src/index.ts`.

The focused verifier remains available only through:

`verify:external-evidence:local-idempotency-replay`

Decision:

- no public export
- no package-script change
- no aggregate-verify change

## 30. Stable Alignment Summary

Stable behavior-change needs:
`none`

Stable comment-alignment needs:

- add one bounded-purpose comment at the exported fixture builder
- add one local-result comment at the resubmission resolution helper or return

Stable naming changes:
`none`

Stable sample changes:
`none`

Stable verifier changes:
`none`

Stable package or public-export changes:
`none`

Recommended future comment semantics:

1. Comment A belongs immediately above
   `buildLocalIdempotencyReplayFixture`, at the module-exported,
   package-internal builder entry. It should state that the fixture is
   package-internal and local-only, that its exact resubmission checks
   deliberately form a bounded fixture proof, that those checks are not the
   Fingerprint Profile v0.1 preimage, and that the fixture does not implement
   service claim resolution, effective scope, or an effective fingerprint.
2. Comment B belongs immediately above `resolveIdempotentResubmission` or
   directly beside the returned `same_logical_job` result. It should state
   that `same_logical_job` is a fixture-local outcome reusing source artifact
   identities after exact local checks, is not a transport response or
   profile-conformance result, and does not turn preserved selections into a
   content-deduplication decision.

The builder is exported from its fixture module for local fixture use, but it
is not publicly exported from `packages/guard-core/src/index.ts`.

The next phase must test its proposed comment text against the verifier's
actual exact-string and regular-expression scans. This assessment freezes
comment locations and required semantics, not final verbatim comment text, and
does not require a verifier change.

## 31. Primary Decision Rationale

`COMMENT_OR_NAMING_ALIGNMENT_ONLY` is the narrowest accurate decision because:

- no current assertion directly claims Fingerprint Profile v0.1 conformance
- broad local equality is not inherently wrong merely because the profile
  excludes some fields from its preimage
- request ID and caller reference remain useful local correlation constraints
- evidence, adapter, and profile deep equality remain useful local input
  constraints
- canonical ordering, duplicate rejection, effective scope, durable claims,
  representability, immutable binding, and authorization are intentionally
  absent
- the intentional-new-job path demonstrates a bounded scenario with preserved
  selections and fresh identities but does not implement a
  content-deduplication decision
- renaming output keys or literals would affect concrete local consumers
- two narrow source comments can close the reasonable misread risk
- proposed comments can be written to satisfy the verifier's actual current
  scans without changing it
- no fixture behavior, sample, type, package, export, or runtime change is
  justified

Compatibility conclusion:
`compatible`

Semantic risk after recommended comment alignment:
`low`

## 32. Following-phase Routing

Recommended next phase:

`Local Idempotency Fixture Source Comment Alignment v0.1`

That phase must remain narrowly bounded to:

- adding the two source comments described above
- changing no module, builder, output key, resolution literal, sample,
  package-script, or public-export name
- confirming all names and behavior remain unchanged
- confirming the focused verifier still passes without modification
- confirming the technical-usage consumer remains unchanged
- testing proposed comment wording against the actual verifier scans

It must not include:

- fingerprint implementation
- JCS or hash spike
- assurance-profile sorting
- duplicate-profile validation
- effective scope
- durable claims
- authentication or tenant implementation
- persistence
- transport
- runtime service behavior

## 33. Acceptance Criteria

- assessment-only: yes
- docs-only: yes
- exactly one new document: yes
- no fixture modification: yes
- no sample modification: yes
- no verifier modification: yes
- no source type modification: yes
- no package change: yes
- no public export expansion: yes
- approved fingerprint proposal preserved: yes
- approved type-contract assessment preserved: yes
- current fixture purpose explicit: yes
- current fixture is not profile conformance: yes
- fixture precondition and fingerprint preimage distinguished: yes
- local equality and runtime claim resolution distinguished: yes
- request ID assessed: yes
- caller reference assessed: yes
- evidence-package equality assessed: yes
- adapter equality assessed: yes
- assurance-profile equality and ordering assessed: yes
- idempotency key assessed: yes
- scope reference assessed: yes
- fingerprint reference assessed: yes
- resolution literal assessed: yes
- replay assessed: yes
- intentional new job assessed: yes
- no-boundary coverage assessed: yes
- verifier coupling assessed: yes
- candidate count at least 45: yes
- each candidate has one primary classification: yes
- behavior conflict and bounded-scope difference distinguished: yes
- comment need and behavior change distinguished: yes
- future conformance fixture distinguished: yes
- primary decision unique: yes
- confidence explicit: yes
- fixture behavior decision explicit: yes
- sample decision explicit: yes
- verifier decision explicit: yes
- package-script decision explicit: yes
- public export decision: no
- runtime implementation authorized: no
- following phase unique: yes
- following phase is Source Comment Alignment only: yes
- no authentication or tenant implementation: yes
- no persistence implementation: yes
- no transport implementation: yes
- no runtime implementation: yes
- no authority expansion: yes

This assessment does not authorize fixture, sample, verifier, type,
authentication, tenant, persistence, transport, or runtime implementation.
