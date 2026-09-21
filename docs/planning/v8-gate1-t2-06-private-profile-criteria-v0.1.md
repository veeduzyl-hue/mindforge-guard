# T2-06 Concrete Private Profile Criteria Closure v0.1

Documentation-only criteria freeze, 2026-09-21. This is one task-local private
assurance profile, not a public profile schema, semantic module, or implementation.

## Checkpoint and authority

Verified branch: `planning/v8-gate1-tranche2-g06-v0.1`; starting worktree: CLEAN.
Starting HEAD and preserved `T2_06_BLOCKED_ENTRY_COMMIT`:
`b0a2700659da5df14d13d0711099d150687ad8c8`.
The accepted entry decision remains
`T2_06_IMPLEMENTATION_ENTRY_BLOCKED_BY_PROFILE_CRITERIA` in its immutable dossier.
This subsequent criteria decision does not rewrite that historical decision.

Authoritative constraints: [entry dossier](v8-gate1-t2-06-implementation-entry-v0.1.md),
[T2-06 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-06---profile-bound-standalone-sufficiency-artifact),
[B06](../adr/0014-profile-bound-evidence-sufficiency-and-report-boundary.md),
[side artifact](../architecture/evidence-sufficiency-side-artifact-v0.1.md),
[B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md),
[B05](../adr/0013-independent-verification-and-integrity-evidence-contract.md),
[B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md), and
[B08](../adr/0016-mesr-module-version-lock-and-noninterference-contract.md).
The private choices below are authorized by this task and B06's additive profile
contract; they are not claims that an ADR already mandated this particular profile.
Canonical control inputs and their referenced basis identify existing targets and
falsify shortcuts; their expected states do not define these criteria.

## Content identity and receipts

Profile ID: `private.t2-06.software-change-check-record`; version: `0.1.0`.
Claim-set ID: `private.t2-06.software-change-check-claims`; version: `0.1.0`.
Method ID: `private.t2-06.strict-requirement-materiality`; version: `0.1.0`.

The claim-set content is exactly the JSON object in the following block. Every
member's subject/revision/scope/evaluation_time is bound to the evaluation tuple
defined below; the strings naming that binding are not actual subject values.

<!-- CLAIM_SET_CONTENT_BEGIN -->
```json
{"domain":"private.t2-06.claim-set-content/0.1","id":"private.t2-06.software-change-check-claims","members":[{"canonical_id":"mesr.core.evidence.verification","canonical_version":"0.1.0","evaluation_binding":"exact-evaluation-tuple","member_id":"check-pass","requested_facet":"verification.passed","requirement_ids":["R00","R01","R02","R03"],"test_path":"pass"}],"version":"0.1.0"}
```
<!-- CLAIM_SET_CONTENT_END -->

Claim-set domain: `private.t2-06.claim-set-content/0.1`.
Profile domain: `private.t2-06.profile-content/0.1`.
Both use SHA-256 over B08 canonical JSON: recursively code-point-sort object keys,
preserve arrays, finite JSON only, UTF-8, no BOM, no insignificant whitespace or
trailing newline. Duplicate object keys/non-JSON values are rejected.

The profile representation is exactly this five-field object, constructed from
the retained text, not from display labels:

```text
{
  domain: "private.t2-06.profile-content/0.1",
  id: "private.t2-06.software-change-check-record",
  version: "0.1.0",
  claim_set_digest: {algorithm: "SHA-256", value: <recomputed claim-set digest>},
  rules_text: <all text between PROFILE_RULES_BEGIN and PROFILE_RULES_END>
}
```

For `rules_text`, exclude the two marker lines, normalize CRLF to LF, and remove
only the single line separator immediately after/before those markers. Preserve
every other character, including Markdown and internal newlines. Canonical JSON
encodes this text as a JSON string. This applies B08's existing JSON primitive
encoding; it does not claim the source Markdown bytes equal JSON content bytes.
Method content is the same full rules_text encoded as a canonical JSON string;
its separate domain is `private.t2-06.method-rules/0.1` (domain recorded alongside
the digest, not prepended to its bytes). Profile and claim-set domains are fields
inside their hashed content. Receipts below are outside every digest domain.

Profile source/provenance is this private criteria document at its separately
recorded criteria commit, the preserved entry commit, and the listed ADRs. The
commit receipt is deliberately external to hashed content. Recompute all content
digests and compare against separately retained admitted criteria before use.
An attacker rewriting content and its own digest does not establish admission.
This is content authentication against a pinned reference, not signer identity.

<!-- DIGEST_RECEIPTS_BEGIN -->
| Content | Algorithm | Digest | Canonical UTF-8 bytes |
|---|---|---|---|
| Profile | SHA-256 | `ef051daa4b12093d195429746ac96ebadb5f85fa9497a3905ac77ba63f5390a0` | 26112 |
| Claim set | SHA-256 | `6c374f3517c77c340a7807dc2c3e07df209a69dca75cff01157f305be89c4e68` | 381 |
| Method rules | SHA-256 | `b46e86d207e9edb048992915f362be1cd8a7890a67fa224a0e301951a9223643` | 25866 |
<!-- DIGEST_RECEIPTS_END -->

<!-- PROFILE_RULES_BEGIN -->
## 1. One bounded profile and evaluation tuple

Criteria provenance is this document's user-authorized private freeze, based on
entry commit `b0a2700659da5df14d13d0711099d150687ad8c8` and the T2-06 card in
`docs/planning/21_GATE1_IMPLEMENTATION_PLAN.md`. Normative constraints are ADRs
0011/B02, 0013/B05, 0014/B06, 0015/B07, 0016/B08 and
`docs/architecture/evidence-sufficiency-side-artifact-v0.1.md` as retained at that
entry commit. The criteria commit is an external immutable provenance receipt,
not a self-referential field. Control expectations confer no semantic authority.

This profile evaluates the sufficiency of retained evidence for one attributable
software-change unit-test check on one exact revision and one explicitly bounded
scope. It requires a supported check result and byte equality for the exact
retained input/output members relied on by that result. It does not assess test
adequacy, software safety, coverage of untested properties, or current approval.
The checked property is exactly `unit-tests`; the actual admitted check method,
version, deterministic pass/fail/inconclusive criterion, inputs and outputs must
be retained and evaluated through T2-01. A command exit alone is insufficient.

Outer target is the accepted tuple
`mesr.core.claim.claim@0.1.0 / evidence.sufficient / sufficiency`.
Its entry-content SHA-256 is
`839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b`
in the entry dossier's canonical JSON domain. Required atomic member is exactly
`mesr.core.evidence.verification@0.1.0 / verification.passed / pass`.
No sufficiency result is its own atomic input. Private requirement/member IDs
are bookkeeping keys, never canonical semantic IDs.

Evaluation tuple E consists of subject_id, exact revision, associated artifact
refs, scope.included, scope.excluded, environment_ref, evaluation_time and explicit
reliance target. Require one included software-change scope member and explicitly
empty excluded scope; retain the software-change artifact and check input/output
association. Every field must have attributable retained evidence. Scope is not
inferred from a label. Normalize offset timestamps to instants for comparison,
retain originals, and require an explicit reliance_time equal to evaluation_time,
or an explicit declaration that evaluation_time is the reliance target.

The assertion is about the captured check record and supplied bytes in E. It is
not standing.current or approval reuse. No future reliance, revision rebinding,
freshness guarantee or implicit validity interval is supplied by this profile.
Event time remains the original event time; it must be no later than the supplied
evaluation instant. Equality of times alone does not establish current standing.
Inherited applicable temporal/continuity obligations still apply in full.

Retain the complete closed input envelope, exact source-pack bytes/schema/digest,
typed evidence refs, source pointers, original native records, original and
transformed byte members, and provenance. The bounded retained-input manifest
lists all supplied check candidate records and transformation edges; it is bound
to that source input's digest, not to a caller's claimed completeness boolean.
Enumerate the actual retained records and compare them with the manifest. This
proves accounting within supplied input only, never completeness in the world.

No optionality removes Core, entry, context or caller obligations. Resolve exact
registry/Core/contributing-module locks and separately attributable B08 admission
proofs first. Invalid composition contributes zero entries. Unknown identities,
predicates, versions, locks or methods cannot produce support. A presentation
institutional_profile cannot participate semantically or substitute this profile.

## 2. Frozen ordered requirement inventory

Ordered inventory is exactly `[R00, R01, R02, R03]`. R03 remains in that inventory
even when its permitted exclusion is established. Every row uses materiality
criterion `M1@0.1.0`, applicability `A0@0.1.0`, and E unless stated otherwise.
There is one mandatory atomic claim, check-pass; R00/R02/R03 are its profile
evidence/binding obligations and outer sufficiency obligations, not new claims.

| ID | Target and classification | Required predicate/evidence dimension | Currentness; exclusion; limitation |
|---|---|---|---|
| R00 | Outer sufficiency plus check-pass; mandatory | Exact profile/claim-set/method content and admission, B08 composition, E, source/provenance, full B02 Core/entry/context/caller union, and full inventory/accounting | Every inherited currentness predicate remains mandatory; no exclusion; references and hashes alone prove neither truth nor support |
| R01 | check-pass; mandatory | Fresh T2-01 native retained-record evaluation of the attributable unit-tests occurrence and result, exact property/method/criterion/input/output joins, with a genuine owner result | Event time <= evaluation time; no independent standing claim; no exclusion; passing check does not prove untested properties |
| R02 | check-pass input and output byte-integrity dimensions; mandatory | Fresh T2-02 equality to attributed expected references for every input/output member used by R01, including original members underlying transformations | Exact original subject/revision/scope/member/time joins; no current-authority claim; no exclusion; equality is not authenticity or custody |
| R03 | check-pass transformed-member byte-integrity dimension; conditional, permitted-exclusion only by X0 | A1 true: fresh T2-02 equality for each intermediate/final transformed member on every retained transformation path used by R01 | Original event/transform times retained; X0 only when A1 false and no inherited requirement is removed; equality does not establish transformation fidelity |

R00 is not an opaque all-bindings flag. Expand and retain each union obligation
as a subrecord keyed by `(target canonical ID/version/facet/path, binding name,
predicate ID/version, admitting source ref)`, sorted by code point in that tuple
order. Keep all admitting sources when obligations coincide; never override a
predicate or weaken a collision. The known entry minima include outer claim_id,
subject, predicate, scope, time, evidence_refs and atomic verifier, method,
subject, scope, verified_at, result, limitations. This list is a floor; complete
effective collection and its source inventory are mandatory.

An additional caller/context requirement remains required under R00 with its
own admitted predicate and evidence. Its omission, unknown predicate or missing
route makes R00 unresolved; it cannot be silently outside this profile. Additional
required claims beyond check-pass need a separately frozen claim-set extension;
they cannot be satisfied, dropped, or substituted by this fixed instance. Record
that unresolved extra obligation and withhold positive support. No generic
profile-extension API or new semantic admission is defined here.

## 3. Applicability and permitted exclusions

All criterion IDs in this document are private, version `0.1.0`. They are closed
decision procedures, not callbacks, arbitrary user prose or plug-ins.

| Criterion | Inputs | Positive and negative conditions | Missing/undecidable behavior; provenance; limits |
|---|---|---|---|
| A0 | Authenticated profile/claim set, E, retained check subject/revision/scope/environment/property/event time and requested facet/path | Positive iff exact target/version/facet/path, property unit-tests, exact bound subject/revision/artifacts/environment, one included scope member, empty excluded scope, explicit reliance target equals evaluation_time, event_time <= evaluation_time. Negative iff complete admitted facts demonstrate any of these comparisons false | Any required basis absent or comparison not defined: unresolved. No complete-undecidable case for these equality/time operations. B06 subject/scope applicability and B07 explicit times; negative applicability is bounded profile non-support, not stale history or permission denial |
| A1 | A0, actual retained source records, digest-bound input manifest, R01 input/output member refs and complete transformation edges/provenance | Positive iff enumerating the retained R01 dependency paths yields >=1 transformation edge. Negative iff complete enumeration yields zero edges, provenance.transformation_refs is explicitly empty, and all R01 members are retained originals | Missing manifest, unresolved edge/ref/member, unaccounted source record or incomplete enumeration: unresolved, not false. No complete-undecidable case; cyclic/ambiguous unsupported lineage remains unresolved. B05 original/transformed bytes and B06 provenance; only supplied-input coverage |

A0 negative requires complete applicability basis and is retained as a completed
profile-specific exclusion/non-support, not permission to remove required claims.
A0 missing prevents no_material_gap; evaluate independently established stronger
blockers without discarding collateral gaps. Conditional R03 uses A1 only after
A0 positive. R00/R01/R02 always remain mandatory; failed or missing evidence
does not change their applicability classification.

X0@0.1.0 permits exactly one exclusion: R03 when A0 positive and A1 negative,
provided the full B02 union contains no independent transformed-member obligation.
Retain requirement_id=R03, E's explicit scope, criterion X0/version, manifest and
original-member evidence refs, completed A1 comparison, all inherited-obligation
checks, justification `no-transformed-member-in-bound-input`, and limitation
`only-the-enumerated-input; no-custody-or-world-completeness-claim`.
An empty transformation list without that evidence is not an exclusion.
No R00/R01/R02 exclusion is permitted. No exclusion removes Core, entry, context,
caller, a required claim or any claim-set member. Incomplete X0 leaves R03 required
and unresolved; it stays visible in completeness and materiality accounting.

## 4. Deterministic requirement materiality M1

M1@0.1.0 is strict requirement satisfaction, without weights, probabilities,
severity classes, risk scores or business-value judgments. Every applicable
frozen requirement is essential to this intentionally narrow profile. Additional
inherited obligations are also essential. No mandatory shortfall is discounted.

For each row retain requirement_id, criterion_id/version, E, applicability record,
input evidence refs, original predecessor context/reader associations, exactly
one decision, fixed rationale code plus attributed detail, and limitations. R00
also retains every expanded obligation's predicate evaluation and provenance;
R02/R03 retain every required member comparison, not a successful sample.

Apply this ordered decision procedure to each requirement:

1. If its authenticated applicability or mandatory method input/criterion/binding
   is missing or unsatisfied without a completed admitted negative determination,
   decide `unresolved` (`missing-basis`), preserving any separately established
   conflict/stale/prohibition. R00's missing union predicates use this branch.
2. If R03 has complete X0, decide `permitted_exclusion` (`no-transformed-member`).
3. If applicable, complete authenticated method evidence proves an essential
   predicate false, decide `material_gap` (`completed-non-support`). For R01 this
   requires a completed attributable failed check under its actual criterion;
   for R02/R03 a completed admissible same-domain expected/observed byte mismatch.
   Preserve each failing predicate/member and both comparison digests.
4. If all its applicable mandatory inputs are present, method/criterion execution
   is complete, and an admitted method explicitly cannot decide the required
   predicate, decide `inconclusive` (`complete-method-undecidable`). R01 can reach
   this through T2-01's fully bound inconclusive check. Missing inputs cannot.
5. If all applicable predicates are positively established, decide `satisfied`
   (`all-required-predicates-established`).
6. Otherwise decide `unresolved` (`no-admitted-determination`).

These are private dimension decisions, not canonical primary states. Conflict
and stale facts are retained separately and take their existing owner precedence;
an unresolved row annotation never demotes an established conflict or stale state.
Do not treat their absence as a positive proof. For a multi-member row evaluate
every member: missing required basis wins over completed negative, negative over
complete undecidable, then all-positive; keep every collateral result.

Material gap therefore requires an applicable requirement, a completed admitted
criterion, demonstrated unsatisfied predicate and enough retained evidence for
that bounded determination. A complete source inventory can demonstrate a bounded
absence only if the existing admitted predecessor criterion actually recognizes
that negative: M1 itself adds no closed-world absent-event rule. Missing a check,
bytes, expected reference, binding or materiality witness is unresolved, not an
invented failed check or mismatch. Material gap is bounded non-support, never
world falsity, unsafe software, regulatory violation or automatic blocking.

NM0@0.1.0 admits **no non_material_gap determinations** for this profile. Its
permitted requirement set is empty. This is a concrete strict policy, not an
unspecified threshold. A claimed non_material_gap must retain its asserted
criterion/evidence for diagnostics, but cannot discharge any row: unresolved
materiality basis, subject to a separately proved stronger blocker. A future
non-material rule requires a different admitted profile version and explicit
evidence. Missing evidence != non-material; few missing items != non-material;
profile label != materiality decision. X0 is exclusion, never non-materiality.

The independent materiality work is the exhaustive inventory, per-member byte
checks, applicability and union-predicate coverage above. Even a genuine supported
R01 result cannot replace R00/R02/R03 or establish no_material_gap by itself.

## 5. Profile-wide decisions and state treatment

`no_material_gap` is established iff A0 positive, the frozen ordered inventory
and full inherited-obligation expansion are authenticated and accounted for,
every applicability/materiality procedure is complete, R00/R01/R02 are satisfied,
R03 is satisfied or has completed X0, every exclusion is justified, and no
material_gap/unresolved/inconclusive row remains. Compare identities and coverage,
not just counts. Empty gaps, supported visible claims, or present references are
insufficient. Any missing determination means no_material_gap is not established.

Dimension aggregate order: any unresolved mandatory coverage/input -> unresolved;
otherwise any material_gap -> material_gap; otherwise any inconclusive ->
inconclusive; otherwise the proved complete rule above -> no_material_gap.
Applicable prohibition/conflict/stale remains an independent stronger primary
basis; it is not discarded by this aggregate.

Complete positive sufficiency requires all of the following: authenticated exact
profile/claim-set/method content and attributable admission; valid B08 semantic
composition; A0 positive; full inventory and B02 union satisfaction; every required
atomic claim SUPPORTED by genuine fresh product evaluation; all required
predecessor evidence authenticated in its original envelope through the routes
below; complete applicability/materiality; every X0 justified; no_material_gap;
and no applicable prohibition, conflict, stale basis or other stronger blocker.
`sufficient=true`, a serialized state, result hash or claimed material_gap_result
is never input proof. Derived outputs do not authenticate themselves.

Complete bounded non-support requires full mandatory evaluation basis and either
completed A0 negative or at least one completed material_gap/required atomic
UNSUPPORTED determination. The negative predicate and all diagnostics remain
traceable. Missing mandatory basis elsewhere keeps UNRESOLVED ahead of a completed
ordinary negative. An applicable prohibited inference retains its stronger
UNSUPPORTED route independently; neither route means world falsity.

Complete undecidable sufficiency requires A0 positive, every mandatory method
input/identity/binding present and applicable, complete coverage and method
execution, at least one explicitly undecidable admitted determination, and no
stronger prohibition/conflict/stale/missing/negative basis. Such an evaluation
does not establish no_material_gap. R01's complete inconclusive event is a
legitimate route. An asserted inconclusive label with absent witnesses is not.

| Required atomic result | Treatment |
|---|---|
| SUPPORTED | Necessary; independently discharge every profile obligation |
| UNSUPPORTED | Preserve the completed non-support or applicable prohibition and original scope |
| CONFLICTED | Preserve comparable admissible opposing evidence and conflict precedence |
| STALE | Preserve historical support and proven applicability loss; never infer from age |
| INCONCLUSIVE | Retain complete applicable undecidable method evidence |
| UNRESOLVED | Retain missing or unsatisfied necessary basis; no automatic negative |

Existing owner order is prohibition -> conflict -> stale -> missing basis ->
completed non-support -> complete undecidable -> complete positive, with unresolved
fallback. No copied selector, seventh state, predecessor remapping or caller
StateBasis is defined. This document freezes facts for later integration only.

## 6. Claim completeness and validation

Claim key is `(canonical_id, canonical_version, requested_facet, test_path,
subject_id, revision, scope, evaluation_time)` with exact E bindings. Labels are
not keys. Inventory order is frozen; binding diagnostic sets use the tuple order
in section 2. Keep evidence/event arrays in their original order.

| Situation | Deterministic treatment |
|---|---|
| Hidden required claim | Enumerate from the pinned claim set regardless of presentation; retain its result or missing diagnostic |
| Missing required claim | Required/missing and UNRESOLVED subject to stronger precedence; never shrink the inventory |
| Duplicate request/required claim | Preserve existing duplicate path rejection (`DUPLICATE_CLAIM_PATH`); private duplicate full keys reject even if byte-identical; no first/last/majority wins |
| Unknown semantic identity/version | Retain unresolved identity and prevent support; malformed/disallowed paths retain validation rejection |
| Extra non-required claim | Retain explicit unrequested-child/extra-obligation diagnostic; prevents complete positive evaluation; cannot replace check-pass; no silently ignoring extras to pass |

Malformed envelopes/unknown keys/invalid types retain validation errors rather
than inventing states. Preserve existing structural rejection of false sufficiency
evidence_refs, empty atomic_results and invalid states such as APPROVED. A
well-formed diagnostic envelope with a missing required member remains unresolved.
An empty submitted requirement list cannot replace the frozen four rows. Invalid
binding value `evidence_refs=false` fails its B02 predicate; presence is not
satisfaction. Do not collapse validation and evidential incompleteness.

## 7. Exact predecessor obligation map

| Requirement | Route, target and reason | Context joins, missing behavior and prohibited inference |
|---|---|---|
| R00 | No fresh predecessor merely for profile identity/accounting. Every inherited predicate uses its existing admitted route; unknown route remains unresolved | Exact E, Core/trust/registry/module/method locks and collected requirements. A digest or caller declaration cannot discharge admission or predicates |
| R01 | Fresh `evaluateVerificationEvent` on native retained records with its separate canonical claim context; consume the actual returned owner result for verification.passed/pass on the verification anchor | Native namespace/event ID, subject/revision/scope/property, method/version/criterion, event time, producer/verifier, all input/output refs and limitations; complete candidate-set ref for competing records. Missing -> unresolved. No T2-01 private reader exists; pass is neither independence nor sufficiency |
| R02 | For every R01 input/output/original member: fresh `compareExactBytes`, then existing `readIntegrityReceipt` with original input/path/contexts; required dimension is equality to the specified expected reference | Actual bytes/length, exact namespace/member, same representation/domain/algorithm, attributable expected source, subject/revision/scope/time, checker/method/event/output joins. Missing bytes/reference or wrong private receipt -> unresolved; complete mismatch is bounded non-support. Match is not authentic source/custody/truth |
| R03 | Same T2-02 fresh comparison/private reader per transformed member when A1 positive; no predecessor when completed X0 | Each transformation edge connects retained original/intermediate/final members; compare each member only to its own expected reference/domain, never original bytes to normalized replacements. Missing -> unresolved. Byte equality is not semantic transformation fidelity |

For R00 inherited independence/custody predicates, the required existing route is
fresh `evaluateIndependence` plus `readIndependenceFinding` with original T2-02
receipts, original input/Core/trust/contexts/requirements and requested path/facet;
retain successful T2-01 check, principals, identity/separation/control/conflict
facts and all custody stages. Different actor labels do not prove independence.

For R00 inherited currentness predicates, use fresh `evaluateTemporalApplicability`
plus `readTemporalApplicabilityFinding` in its original standing.current request
and original input/Core/trust/contexts/requirements, including all historical
T2-01/T2-02/T2-03 prerequisites, both times, policy/rule, intervals, freshness,
snapshot horizon and scoped status records. Do not switch those prerequisites
off. Missing original witness/context -> unresolved; currentness != continuity.

For R00 inherited continuity/rebinding predicates, use fresh `evaluateContinuity`
plus `readContinuityFinding` on the original owned request and its separate
historical/current/revalidation T2-04 channels as applicable. Bind old/current
subject/revision/artifacts/scope/environment/policy/dependency/authority evidence,
material-change rule and both times. Missing -> unresolved; a rebind creates no
authority. Direct temporal channels must agree with the authenticated current
join. These three routes are obligations only when required by the retained B02
union; none is globally inferred from this profile's name or its check-pass claim.

R00 retains the exact target identity/facet/path and predicate source from each
collected inherited obligation. If that target cannot be resolved, record missing
semantic basis; never manufacture an identity or select a new path. This closed
dispatch permits only existing admitted predecessor methods, not new plug-ins.

Fresh reconstruction plus private readers is mandatory wherever those readers
exist. Never rename predecessor paths to sufficiency, rewrite original times or
revisions, or use the outer envelope in place of the reader's original context.
Copies, JSON round trips, caller state labels and serialized result hashes are
not authenticated handles. This pinning does not reopen predecessor architecture.

## 8. Standalone boundary and nonclaims

BASE requires no report association; source.report_reference may be null. No
report-required variant is defined in this profile. Any later such requirement
belongs to T2-07 and a separately admitted profile version; it cannot be silently
added or ignored here. A supplied unresolved report link cannot be claimed as
associated, while an independently complete BASE assessment remains separate.
No reportAssociation.ts, link implementation, report mutation, renderer or index
change is authorized. T2-07 remains BLOCKED_BY_SEQUENCE_UNTIL_T2-06_CLOSED.

Retain Core nonclaims, notably claim_truth_without_evidence,
claim_support_without_evidence, and verification's approval/execution_authority/
untested_properties exclusions. Evidence present != evidence sufficient;
verification passed != independent verification; byte equality != authenticity,
independent custody or truth; all visible supported claims != profile sufficient.
Profile sufficient != universal sufficiency, institutional acceptance, audit
opinion, certification, compliance, authority or execution permission. Runtime
ALLOW and Guard allow remain separate. No report disposition becomes a claim state.

## 9. Private admission and implementation limit

This task admits only the written private criteria freeze for later review. It
does not install a profile, execute M1, validate a real subject or authorize
implementation. Future execution must separately validate these deterministic
criteria and evidence routes under the canonical task's controls. Unknown methods
or absent attribution cannot be admitted by self-signing a profile digest.

Preserved: audit output/verdict/exit, deny 25, permit and classify behavior;
recommendation-only, additive-only, non-executing, default-off; no authority scope
expansion, main-path takeover, dashboard/control-plane or orchestration drift.
Public/commercial baseline remains v7.0.1. No code, fixture, verifier, canonical
reason, public schema, CLI/SDK, license, install/demo or frozen history change.
<!-- PROFILE_RULES_END -->

## Control consistency review (not execution)

| Controls | Independent criteria check |
|---|---|
| S04, S10, S11.absent | Complete genuine check, every byte requirement, union, identity, applicability and materiality may support BASE without a report; legacy require_review remains independent |
| S01; S02.* | Legacy allow adds no basis; removed profile/claim set/scope/time/evidence/criterion leaves unresolved coverage |
| S03.*; S04.bad_profile_digest | Recompute admitted content and locks; unknown semantic/method/module basis or wrong profile digest cannot support |
| S04.label_only | Reconstruct native event; serialized atomic SUPPORTED without occurrence/result witnesses cannot support |
| S05 | Complete R02/R03 mismatch can establish material_gap even with a supported R01; absent bytes instead remain unresolved |
| S06; empty gaps | Exhaustive R00-R03 and nested binding/member accounting required; an empty list cannot prove completeness |
| S07.* | No subtraction; omitted/false/empty required predicates remain unresolved; explicit prohibited weakening retains stronger nonclaim treatment |
| S08.* | Established comparable conflict or historical-support-plus-loss retains owner precedence and collateral gaps; caller flags/age are insufficient. Applicable inherited B07 obligations cannot be bypassed by BASE's narrow scope |
| S09 | Complete bound inconclusive method evidence permits inconclusive; a materiality label alone does not. Full private materiality includes each required method's completed decision, not only its input presence |
| S11.mismatch | Outward association cannot be claimed from mismatched bytes; T2-07 owns that implementation; no standalone sufficiency/report conflation |
| S12; hidden required claim | Frozen inventory overrides presentation visibility; semantic institutional_profile participation prohibited |
| S13 | Missing canonical facts stay missing; no Harness synthesis or G03 work |
| H08 | Invalid evidence_refs binding fails its value predicate |
| H16/H17/H19 | Preserve structural rejection for false sufficiency evidence array, empty atomic result array and non-enum state |
| H18 | Empty supplied requirements cannot delete pinned inventory; retain required-claim/requirement diagnostic |

Result: no contradiction with authoritative control intent found. This is a
documentation consistency review, not a test pass or an assertion that historical
B09 inputs authenticate this new profile. B09's historical IDs/digests/labels and
expected results remain immutable. S05/S09's serialized gap labels in those inputs
are not product evidence: later controls must retain genuinely complete negative/
undecidable witnesses, without deriving inputs from expected states or weakening
canonical assertions. Extra private integrity requirements must be supplied in
later source-backed controls; their absence cannot be waived to make S04 pass.

## Remaining blocker, hygiene and stop

KNOWN CONDITIONAL NEXT BLOCKER:
`canonical seven-path scope lacks evaluateClaim.ts intake`.
Next separate task: `T2-06 Bounded State-Integration Scope Expansion Review`.
That review has not been performed. Implementation entry is not marked READY.
No implementation pre-change HEAD is designated.

Only this document may change. Hygiene: `git diff --check`, `git diff --name-only`,
`git status --short`; inspect the untracked file explicitly because ordinary diff
does not enumerate it. Commit this criteria document alone; record the resulting
`T2_06_PROFILE_CRITERIA_COMMIT` outside the content, in the final receipt.
No implementation suites run.

T2-06 IMPLEMENTATION NOT STARTED. T2-07 NOT STARTED / BLOCKED_BY_SEQUENCE.
G06 OPEN. G03 NOT STARTED. G05 CLOSED. G07 CLOSED.

T2_06_PROFILE_CRITERIA_READY
