# T2-02 implementation entry dossier v0.1

Planning-only assessment of T2-02 - Exact-byte integrity comparison; Gap G05.
Entry is blocked by the existing private state-integration boundary, not by
an ambiguous implementation file list. No implementation is authorized here.

## Checkpoint and sources

- Repository: D:/AI project/mindforge-guard.
- Branch: planning/v8-gate1-tranche2-t2-02-v0.1.
- Starting HEAD / planning pre-change HEAD: 6ec7d06ee48f700ab16333420ffe3fc2b18aee19.
- Starting worktree: CLEAN.
- Accepted T2-01 implementation: 112d19ca84f13cc74447a41dfde5df49d9f9e49b.
- Accepted T2-01 result hash: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102.
- T2-01 EVIDENCE CLOSED is inherited; no accepted suite was rerun.

Authority is the [task card and sections 2/3](21_GATE1_IMPLEMENTATION_PLAN.md),
[B03 R5/R6](../architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md),
[ADR 0013](../adr/0013-independent-verification-and-integrity-evidence-contract.md),
[B05 cases](../validation/v8-b05-independence-integrity-falsifiers-v0.1.md),
[ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), and
[change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md).
The [T2-01 serialization contract](../architecture/t2-01-internal-event-result-serialization-v0.1.md)
and its [provenance contract](../architecture/t2-01-attributable-verification-occurrence-result-contract-v0.1.md)
supply the nearest private event pattern.

Source inspection was limited to those dependencies, relevant private T1
contracts/evaluation/requirements and verificationEvent.ts, plus named frozen
B09 cases and H30 resolved through the evidence index. integrity.ts is absent.
Historical specification-only statuses retain their historical context.

## A. Exact subject of evaluation

Evaluate the narrow equality-to-reference claim for one explicitly supplied,
bounded byte sequence and an attributable expected SHA-256 for the same
artifact/member, representation, subject/revision and scope. Actual hashing
and comparison must occur in the later T2-02 invocation.

Artifact reference != supplied bytes.
Supplied bytes != retained bytes.
Retained bytes != verified custody.

Resolve only explicitly supplied input members/records. No filesystem lookup,
network fetch, artifact-ID resolution, URL dereference, repository checkout
lookup or canonical EvidencePack creation. B03's admitted-root rule is a
boundary on future producer ingestion, not permission to perform I/O here.
A reference with no supplied bytes is missing evidence. An evaluator's input
copy does not establish durable external retention or custody.

## B. Expected and recomputed digest provenance

Declared/expected digest != recomputed digest.

| Value | Existing repository source / obligation |
| --- | --- |
| Expected SHA-256 | B03 R5 source manifest declaration; B09/private T1 input names it integrity.expected_digest. |
| Expected attribution | integrity.expected_source identifies its source; ADR 0013 additionally requires a retained attributable source record, not a URI alone, bound to the same member/representation and subject/scope. Preserve source namespace/reference and field pointers using the T2-01 record pattern. |
| Actual bytes | B03 explicitly supplied bundle member; existing private claims input uses integrity.bytes_base64 as transport for that member's exact octets. |
| Recomputed SHA-256 | Fresh computation over those supplied octets by the future product module, not a caller label, supplied observed digest, reference runner output or test expectation. |

The expected source must independently specify the reference baseline; do not
compute an expected value from the current supplied bytes and call the resulting
tautology verification. Its attribution is not authenticated provenance.
Expected-source witness, member association and transformation provenance are
required facts, not helper defaults.

The inspected frozen I09/I10 inputs contain expected_source and comparison_event
reference strings but no corresponding entries in evidence_ledger. They are
historical oracle inputs, not proof that retained witnesses already exist.
Later task-specific positive controls must explicitly author the missing
attributable basis and distinguish supplemental evidence from frozen inputs.
Do not rewrite B09, dereference labels or silently manufacture records.

Neither digest presence nor equality implies authenticity, truth, custody,
independence, authority, acceptance or compliance.

## C. Same byte domain and comparison basis

The rule is exact original octets for the same identified member/artifact and
representation, with SHA-256 on both sides and explicitly associated expected
source, subject/revision, scope and comparison context. Matching domain labels
alone do not establish those associations.

- Raw bytes remain raw. Decode the existing base64 transport to bytes; do not
  hash the base64 characters or implicitly interpret the bytes as text.
- Encoding is transport/representation metadata. No implicit UTF-8 transcoding,
  newline conversion, Unicode normalization, JSON reserialization or redaction.
  A text fixture must explicitly supply its encoded bytes; retain those bytes.
- Byte length is the length of the actual decoded byte sequence, never character,
  UTF-16-unit or code-point count. Any declared count must agree with measurement.
- Raw and derivative members have separate identity, representation, digest and
  transformation provenance. A derivative comparison cannot satisfy raw equality.
- Core canonicalJson/contentDigest is the semantic-content digest domain; it must
  not replace B03's raw member or original source-pack digest.
- A source-pack comparison, if explicitly requested with supplied original bytes,
  uses those original bytes, not transformed output or a circular output self-hash.

Recomputed digest != byte equality unless exact domain/algorithm/basis match.
The permitted conclusion remains bounded equality to the specified reference
digest; it is not a claim of custody, authenticity or unlimited real-world truth.
Absent or unestablished domain/basis prevents a raw-equality determination.

## D. Algorithm boundary

SHA-256 only, private/internal, explicit invocation/default-off. No generic
digest framework, algorithm registry, plugin subsystem or public digest API.
B03 R5/R6 and the task card establish this choice. A different or missing
required algorithm basis cannot be silently treated as SHA-256 evidence.

## E. Actual comparison occurrence and result

Verification occurrence/result != exact-byte integrity. T2-01 may attribute
an event/result but never supplies missing bytes or replaces recomputation.

Minimum comparison evidence follows ADR 0013's artifact-byte integrity and
digest-comparison rows: exact supplied byte reference, source namespace/member
identity, original representation/domain, measured byte length, subject/revision,
scope, attributed expected digest source, SHA-256 algorithm, recomputed digest,
checker identity/version attribution, identified method/version, provided time,
actual recomputation/comparison occurrence and match/mismatch outcome. Retain
both digests on mismatch, input/output references, provenance and limitations.

Reuse the private T2-01 pattern of lossless raw input, source-record references
and pointers, missing-fact diagnostics and a separately returned claim evaluation.
Do not invent a public output contract or let an annotation select a canonical
state. The exact private T2-02 serialization and state handoff cannot be frozen
as implementation-ready while the integration blocker below remains unresolved.

## F. Deterministic time

Use a caller-provided, attributed comparison timestamp: a string ending in Z
or an explicit +/-HH:MM offset, accepted only if Date.parse is finite, as in
verificationEvent.ts and evaluateClaim.ts. Preserve the original string and
exact event/result associations. Date.parse validates supplied time; it does
not sample a clock.

No Date.now(), new Date() without an explicit value, implicit current time,
generated event time or evaluation_time fallback. The separately supplied T1
bindings.evaluation_time remains distinct. Missing/invalid comparison time is
missing admissible event basis. Replay the same bytes and attributed context;
do not assert that a supplied timestamp independently proves when execution ran.
No new public timestamp contract.

## G. Checker boundary

Checker attribution != authenticated checker identity.
Checker attribution != verifier independence.
Checker attribution != custody independence.

Record the explicitly supplied checker identity/version and its association
to the actual comparison and method. Do not fill it from the producer, machine,
process name or a generated ID. Authentication, principal separation, common
control and custody independence remain T2-03 obligations.

## H. Narrow state mapping and integration blocker

ADR 0013 uniquely determines the intended equality mapping, subject to ADR 0011
admission, required-binding union and precedence:

| Evidence condition | Narrow claim behavior |
| --- | --- |
| Required bytes, attributable expected reference, time or actual comparison absent | UNRESOLVED for equality-to-reference; preserve declarations and missing facts. |
| Byte domain/algorithm/member/basis association mismatched or unestablished | UNRESOLVED for the requested equality; keep any derivative result separate. |
| Complete admissible comparison, recomputed digest differs | UNSUPPORTED for equality; retain both digests. Not automatically CONFLICTED. |
| Complete admissible comparison, digests match | SUPPORTED only for narrow equality with all required admission, bindings, method/context and applicable evidence satisfied, and no higher-priority blocker. |

Core prohibition -> comparable conflict -> proven stale basis -> missing
obligation -> completed determination remains unchanged. No seventh state.
Malformed input rejection remains rejection, not an invented primary state.
A match cannot establish artifact authenticity/truth, custody integrity,
verifier independence, outcome correctness, institutional acceptance,
authority, execution permission or compliance.

The current product cannot express the completed equality result through its
single state owner within the existing seven-path allowlist:

1. evaluateClaim.ts line 94 unconditionally adds integrity_comparison_basis
   for artifact.byte_equality, even with supplied bytes.
2. Its selectClaimState function at line 8 is private, not exported.
   claimState.ts exports types/state constants, not a callable selector.
3. RequirementContext in requirements.ts adds conjunctive obligations only;
   it cannot discharge the hard-coded missing basis or introduce positives.
4. The existing state-proof criteria admit evidence_presence and applicability
   loss, not artifact.byte_equality. Core evidence.item supports evidence_presence
   and bounded_content; this dossier registers no new claim alias.
5. T2-01 bridges only recorded verification.passed/verification.occurred. Renaming
   either result to artifact.byte_equality would silently redefine its meaning.
   Fabricating a composite child is also excluded by the existing admitted-result
   identity check.

A side annotation alone cannot satisfy the task's completed equality state
requirements. A copied selector, hand-written canonical state, test-side decision
or relabeled verification pass is not an authorized workaround. Change control
requires one canonical state owner and prohibits a second hidden evaluator.

A separate scope decision is therefore required for a bounded private
comparison-basis handoff to the existing T1 owner, including any necessary edit
to evaluateClaim.ts. No extra path is admitted by this dossier. The selector's
precedence and accepted T1 behavior must remain preserved. This is an integration
scope blocker, not a discovered contradiction in the SHA-256/state specification.

## I. Control inventory, not implemented or executed

All positive expectations are conditional on complete explicitly supplied
basis. No reference labels are upgraded into retained facts by test helpers.
Every row prohibits inference of authenticity/truth, authority, acceptance,
compliance or execution permission; additional boundaries are listed below.

| Case | Semantic condition | Expected narrow integrity behavior / additional prohibited inference |
| --- | --- | --- |
| I09 | Actual local match, producer-only custody | Equality SUPPORTED with complete basis; never infer independent custody/verification. T2-03 owns any custody state. |
| Complete I10 byte basis | Complete same-domain attributable comparison | Integrity evaluated separately and SUPPORTED only on match; independence/acceptance are not inherited from integrity. |
| Non-ASCII byte count | Explicitly encoded non-ASCII octets | Measure actual byte count; a complete match may support equality. Character count is not byte evidence. |
| I06 | Digest declaration, bytes absent | UNRESOLVED; hash presence is not comparison. |
| I07 | Bytes/expected digest but comparison occurrence basis absent | UNRESOLVED for the supplied evidence path; never invent an event. A separately attributed future invocation is new evidence, not retroactive repair. |
| I08 | Complete admissible actual digest mismatch | Equality UNSUPPORTED; preserve digests, no automatic CONFLICTED or successful-verification inference. |
| I15 | Raw expected digest, derivative comparison | Raw equality UNRESOLVED; derivative result remains separate, never normalize into a raw match. |
| N17.failed | Failed checks and digest declaration, no supplied bytes | Integrity UNRESOLVED; check status does not supply byte comparison or independence. |
| N17.skipped | Skipped checks and digest declaration, no supplied bytes | Integrity UNRESOLVED; skipped is not a comparison occurrence or successful verification. |
| H30 | I10 custody.sole_producer_control mutated from boolean to string | Preserve existing malformed-input REJECTED; no coercion, no canonical supported result. This tests admission, not a new T2-02 custody rule. |
| Missing comparison | No attributable executed comparison basis | UNRESOLVED; no success from a reference/label. |
| Domain mismatch | Different or unestablished representation/basis | UNRESOLVED for requested equality; identical digest strings cannot bridge domains. |
| Wrong byte count | Declared count differs from actual octet count | Incomplete/inconsistent byte basis cannot support equality; preserve measured count and diagnose missing admissible basis. A separately completed admissible digest mismatch follows I08. |

Future regression groups remain R-EAK + R-MESR + R-ISOLATION + R-PUBLIC.
Section 3 requires before/after hashes, commands/exits, case IDs/asserted fields,
falsifiers, deterministic replay, remaining gaps, exact diff/allowlist,
compatibility/authority review and rollback record. None was run here.

## J. Rollback

Preserve exactly the task-card triggers: normalization substitutes for raw
bytes; mismatch passes; expected hash lacks required provenance. Section 3 also
requires rollback/review for any material boundary violation or unexpected
regression. Reviewed removal/revert is limited to admitted side modules/call
sites; preserve old behavior, B09 bytes and all historical evidence. No new
rollback trigger, migration or automatic destructive action is introduced.

## K. Exact implementation allowlist and protected paths

Derived without guessed filenames from section 3 and section 2's three shared
test files. This is the existing future implementation scope, not permission to
edit it in this planning task:

1. packages/guard-core/src/mesr/repaired/integrity.ts
2. scripts/verify_v8_gate1_product_conformance.mjs
3. scripts/gate1/b09-product-inputs.mjs
4. scripts/gate1/b09-product-compare.mjs
5. tests/fixtures/gate1/t2-02-controls.v0.1.json
6. tests/fixtures/gate1/t2-02-results.v0.1.json
7. docs/validation/v8-gate1-t2-02-evidence-v0.1.md

Shared tests may add translation/comparison only, never product semantic
decisions or changed frozen expectations. All other paths are forbidden absent
a separate scope-expansion decision, especially:

- packages/guard-core/src/mesr/repaired/evaluateClaim.ts, claimState.ts,
  requirements.ts, contracts.ts, admission.ts, canonicalBytes.ts, composition.ts
  and verificationEvent.ts (each relative filename here is in the same directory).
- packages/schema/evidence-schema-v1.json (EvidencePackV1);
  packages/guard-core/src/parseEvidencePack.ts and validateEvidencePack.ts.
- packages/guard-core/src/mesr/coreRegistry.ts, claimBoundaries.ts and
  reasonCodeBindings.ts; packages/guard-core/src/reasonCodes.ts.
- packages/guard-core/src/reportModel.ts, report generation/rendering/index
  behavior, public CLI under packages/guard/src/cli/, SDK/package exports
  including packages/guard-core/src/index.ts, and all package/version files.
- packages/licensing/ and packages/guard/src/product/license*.mjs:
  license gating, entitlement and offline authority.
- All T1/T2-01 fixtures/evidence, frozen tests/fixtures/experiment-3-repaired/,
  B00-B09 contracts/history, canonical task card and .gitattributes.

The directory/pattern references above are protection boundaries, not editing
wildcards. Audit output/verdict/exit, deny 25, permit/classify, reason values and
ordering, public v7.0.1 behavior, install/demo/buyer semantics stay unchanged.
Recommendation-only, additive-only, non-executing/default-off governance and no
authority expansion remain mandatory. Explicit pure byte evaluation does not
authorize external actions or runtime enforcement.

This task changes only docs/planning/v8-gate1-t2-02-implementation-entry-v0.1.md.

## L. Deferred obligations and disposition

T2-03 remains responsible for verifier/principal separation, independence,
control/conflict facts and custody independence. G03 remains responsible for
truthful Harness -> canonical EvidencePack integration, including its separately
admitted factual/test/mapping/allowlist entry. T2-02 closes neither. G05 remains
OPEN; T2-01 evidence closure remains accepted.

Planning hygiene only: check this document for whitespace and run git diff
--check, git diff --name-only and git status --short; account for this untracked
new file separately. No product suites, fixture creation or acceptance replay.
Because entry is blocked, no planning-entry commit or implementation pre-change
HEAD is created. Stop after recording this dossier.

IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
