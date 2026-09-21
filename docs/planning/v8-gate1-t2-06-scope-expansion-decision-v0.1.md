# T2-06 Bounded State-Integration Scope Expansion Decision v0.1

Change-control review only, 2026-09-21. Task: T2-06; Tranche 2; G06.
Approve one additional implementation path, subject to the frozen constraints
below. This is a source/contract feasibility decision, not implementation entry
READY, executed conformance, implementation completion or release authorization.

## Checkpoint and frozen identity

Verified branch: `planning/v8-gate1-tranche2-g06-v0.1`; starting worktree: CLEAN.

```text
starting_HEAD = 8bab7fbb50e5046c133706abe9da35ab921dc691
T2_06_BLOCKED_ENTRY_COMMIT = b0a2700659da5df14d13d0711099d150687ad8c8
T2_06_PROFILE_CRITERIA_COMMIT = 8bab7fbb50e5046c133706abe9da35ab921dc691
accepted_criteria_decision = T2_06_PROFILE_CRITERIA_READY
```

The blocked entry and subsequent criteria closure retain their original meaning.
Neither is rewritten. This review creates only this decision document. No product
code, fixture, implementation suite or other artifact is changed or executed.

Independently recomputed the accepted document's three SHA-256 receipts in memory
using Node crypto, without importing product code. Extracted the exact marked
claim-set JSON and rules text; applied only the specified CRLF-to-LF conversion
and marker-adjacent separator removal. Canonicalized object keys, preserved arrays
and all remaining rules text, and encoded UTF-8 without BOM/trailing newline.
Required the claim-set block to equal its canonical serialization (duplicates or
unexpected representation cannot be silently normalized). All keys in these
objects are ASCII, so their lexical order is also code-point order. Digests and
canonical byte lengths matched the separately recorded receipts exactly:

| Content / version | Domain | SHA-256 | Bytes |
|---|---|---|---|
| `private.t2-06.software-change-check-record@0.1.0` | `private.t2-06.profile-content/0.1` | `ef051daa4b12093d195429746ac96ebadb5f85fa9497a3905ac77ba63f5390a0` | 26112 |
| `private.t2-06.software-change-check-claims@0.1.0` | `private.t2-06.claim-set-content/0.1` | `6c374f3517c77c340a7807dc2c3e07df209a69dca75cff01157f305be89c4e68` | 381 |
| `private.t2-06.strict-requirement-materiality@0.1.0` | `private.t2-06.method-rules/0.1` | `b46e86d207e9edb048992915f362be1cd8a7890a67fa224a0e301951a9223643` | 25866 |

Method domain is recorded alongside the digest, not prepended to its bytes.
Profile and claim-set domains are inside their hashed objects. The criteria
commit remains external to content. A supplied replacement content/digest pair
does not establish admission; a different profile needs a separately frozen
version/content digest and entry decision.

## Source-grounded feasibility

Authority is limited to the [canonical T2-06 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-06---profile-bound-standalone-sufficiency-artifact),
[entry v0.1](v8-gate1-t2-06-implementation-entry-v0.1.md),
[accepted criteria](v8-gate1-t2-06-private-profile-criteria-v0.1.md),
[ADR 0014/B06](../adr/0014-profile-bound-evidence-sufficiency-and-report-boundary.md),
[ADR 0011/B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md)
and [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md).
Predecessor sources are references for their preserved authentication boundaries,
not permission to reopen them. Earlier scope expansions supply no authorization.

| Observed source or contract | Consequence for this decision |
|---|---|
| `evaluateClaim.ts`, private `selectClaimState`, lines 12-21; `claimState.ts`, `StateBasis` | All six states and their ordered factual channels already exist. Missing, negative, undecidable and positive sufficiency dimensions need no new state/type/selector. |
| `evaluateClaims`, lines 35-45 | Eight current parameters; requirements are freshly collected and admission rejection returned before state evaluation. An optional ninth private channel can preserve every existing caller. |
| `evaluateClaims`, lines 116-137 | Existing temporal intake conditionally avoids only its own placeholder; sufficiency currently unconditionally adds `profile_bound_sufficiency_basis`. This is the precise missing integration point. |
| `evaluateClaims`, lines 170-182 | Facts are sorted, passed to the private selector, then the canonical result is frozen and privately registered. This remains the sole result construction route. |
| `evaluateCompositeClaim`, lines 188-213 | Genuine child identity and required-path/context checks exist; arbitrary serialized child states cannot authenticate themselves. A composite is not a substitute for profile/materiality evaluation. |
| `requirements.ts`, `collectBindingRequirements` | Recognizes the existing claim anchor's sufficiency facet, adds evidence refs, collects conjunctive Core/entry/context/caller predicates with origins, and preserves missing/unknown predicates. No union edit is necessary. |
| `contracts.ts`, `inputShapeIssues` | Existing sufficiency fields check shape only. Rich retained profile content and findings can travel in a separate private argument, leaving these checks and public schemas intact. |
| B06 and frozen criteria sections 1-9 | A versioned standalone artifact and one concrete private profile are permitted; neither new Core support nor a generic semantic module is needed. |

Therefore the canonical seven paths plus `evaluateClaim.ts` are sufficient for
the frozen criteria. No additional protected semantic path is required by this
construction. This is not permission to relax a criterion if implementation
later encounters difficulty: identify the first additional protected path and
stop for a separate scope decision rather than adding a ninth path.

Exact ownership stays:

```text
anchor = mesr.core.claim.claim@0.1.0
facet = evidence.sufficient
path = sufficiency
```

Retain the entry's anchor content digest
`839d8b89b8eb79abea1001ef523b7c8e614206be47b158f5dc55b65eec13a28b`
as its inherited receipt, not a newly measured registry receipt. No new canonical
ID, alias, Core support or semantic module type. Private IDs are bookkeeping only.

## Exact private handoff and context binding

The bounded construction is:

```text
retained pinned profile / claim-set / method content + original witnesses
  -> fresh predecessor execution and original-context readers
  -> sufficiency.ts: closed private validation and factual/profile dimensions
  -> deeply immutable, process-local, identity-protected sufficiency finding
  -> evaluateClaim.ts: exact-context reader and owned-facet projection
  -> existing factual arrays -> existing private selectClaimState
  -> existing frozen/registered canonical result
```

`sufficiency.ts` owns its private input/record types, closed validation, fixed
criteria and module-private WeakMap registration. Only its product computation
can register a handle. The handle and retained evidence are deeply frozen; the
private map retains owned snapshots, never mutable caller aliases. It derives
factual requirement/applicability/materiality dimensions and diagnostics, never
canonical primary states. A versioned standalone serialization may retain the
actual owner's output; no serializer or test computes a replacement state.

The ninth channel carries the authentic handle plus the current retained private
evaluation envelope. Its reader compares the handle's saved exact canonical
context to the invocation's envelope AND the owner's freshly collected input,
Core, trust and contexts. It never authenticates a handle by comparing only the
handle's own attached metadata. Equality to saved data is a context check, not
admission of arbitrary data. Any changed content requires recomputation.

| Bound context | Where it is retained and checked without another path edit |
|---|---|
| Requested anchor/version/facet/path | Reader requires the single exact owned request and resolved anchor; other requests take existing behavior. |
| Profile, claim set and method IDs/versions/domains/digests and full content | Private envelope in `sufficiency.ts`; recompute against the pinned receipts above before deriving facts. |
| Subject/revision/artifacts, included/excluded scope, environment | Retained evaluation tuple plus explicit joins to original source and predecessor contexts; a legacy scope string is not a replacement for this tuple. |
| evaluation_time, explicit reliance_time/target, original event/transform times | Retain originals; compare offset instants under A0 and each predecessor's existing method. Never replace event time with evaluator time. |
| Registry/Core/module locks and attributable admission | Bind full Core/trust/registry inputs and existing collection/admission results; invalid composition contributes zero entries. No new admission route. |
| Collected requirements and R00-R03 | Bind full collection, origins and predicates, frozen ordered inventory and each expanded inherited obligation. Unknown predicates/routes remain unresolved. |
| Applicability, materiality, permitted exclusions | Deeply frozen product-derived records with evidence and criterion provenance; bind to the same inventory/evaluation tuple. Caller records cannot override them. |
| Fresh predecessor evidence/results/readers | Retain original input, request, contexts, Core/trust, collections, witnesses and actual returned objects. Authenticate before registration; retain handle identities separately from serialized snapshots. |
| Evidence refs, limitations/nonclaims, provenance | Retain the full closed envelope and attributable joins in the immutable finding; no omission-based widening. |

Fresh reconstruction must happen within the bounded product operation, not by
trusting a caller's claim that a result is fresh. T2-01 owner results are consumed
directly from that call; private predecessor handles are read before becoming
finding evidence. If separately supplied channels accompany the same operation,
they must agree with those authenticated original joins. Changed/wrong-context
handles cannot substitute for the retained witnesses. A replay with changed
profile/claim-set/method digest, subject, revision, scope, environment, times,
locks, requirements or evidence fails the reader and requires recomputation.

`verificationEvent.ts` already calls `evaluateClaims` from function bodies. A
new reader import and predecessor calls must likewise have no top-level evaluation,
registration or predecessor execution. Function-only calls can accommodate the
module dependency cycle without initializing a semantic evaluator on import;
the fixed atomic `verification.passed/pass` request never recurses into sufficiency.
No dependency extraction into a ninth file is required.

Plain objects, copied handles, JSON round trips and mutated substitutes carry
no registration. Deep freezing prevents alteration of the original. Caller
`sufficient=true`, `no_material_gap=true`, `material_gap_result`, StateBasis
arrays, predecessor state labels/result hashes and fixture expected states are
never authenticated findings. Serialized evidence remains inspectable but inert.
Finding authority proves only that this bounded product computation evaluated
the frozen criteria over authenticated supplied evidence; it proves no world
truth, compliance, acceptance or authority.

## Frozen criteria and state integration

The accepted rules are preserved verbatim by reference, with no altered A0, A1,
X0, M1, NM0 or no_material_gap criterion. Implementation uses the retained rules
and independent fixed procedures, not a generic profile engine or callbacks.

| Frozen item | Required preservation |
|---|---|
| R00 | Exact content/admission, composition, evaluation tuple, provenance, full B02 union and inventory; expand all inherited obligations with their admitting sources. |
| R01 | Genuine fresh attributable unit-tests check-pass result on the pinned atomic verification member, with complete method/criterion/input/output joins. |
| R02 | Fresh original-context byte equality for every relied-on input/output/original member, each against its own attributed expected reference. |
| R03 | Full transformed-member path coverage when applicable; remains in inventory even with X0. |
| A0 | Exact target/property/subject/revision/artifact/scope/environment and explicit times; complete false comparison is bounded profile non-support, missing comparison basis is unresolved. |
| A1 | Complete digest-bound enumeration of actual retained dependency records and transformation edges; zero edges requires explicit originals/provenance, not an empty list alone. |
| X0 | Only R03; A0 positive, A1 negative, full manifest/original-member evidence, justification and no independent inherited transformed-member obligation. No other exclusion. |
| M1 | Missing mandatory basis -> unresolved; complete X0 -> permitted_exclusion; complete admitted essential predicate false -> material_gap; complete applicable admitted method unable to decide -> inconclusive; all predicates established -> satisfied. Preserve the frozen ordered procedure and collateral blockers. |
| NM0 | Permits no non_material_gap. A claimed non-material result cannot discharge a requirement. No scoring, weighting, risk scale or business-value logic. |

Within multi-member rows, missing required basis precedes completed negative,
then complete undecidable, then all-positive; retain every member determination.
An absent check/byte/reference is not an invented failed check or mismatch.

Establish `no_material_gap` only with A0 positive, all R00-R03 and expanded
inherited obligations accounted for, all applicability/materiality procedures
complete, R00/R01/R02 satisfied, R03 satisfied or complete X0, all exclusions
justified, and no material_gap/unresolved/inconclusive remainder. Empty gap list
does not establish it. Positive sufficiency additionally requires every mandatory
claim genuinely SUPPORTED, complete bindings and authenticated predecessor basis,
and no stronger blocker. All claims SUPPORTED alone is insufficient.

Only `evaluateClaim.ts` translates authenticated dimensions into its existing
arrays: applicable scoped prohibitions -> prohibitions; comparable opposing
facts -> conflicts; proven historical-support/applicability-loss -> stale;
missing criteria/evidence/bindings/coverage -> missing; completed material gap,
complete required atomic non-support or completed A0 negative -> negative;
complete applicable undecidable basis -> undecidable; full positive conjunction
-> positive. Retain original evidence and scope, including collateral diagnostics.
Incomplete negative basis must not remove missing facts. No caller-authored array
is merged. Atomic states are used only with their fresh genuine results/bases.

The unchanged selector decides prohibition -> conflict -> stale -> missing ->
completed negative -> complete undecidable -> complete positive, with unresolved
fallback. There is no selector export/copy, second evaluator or seventh state.

For an authenticated owned finding, avoid adding only the branch-local
`profile_bound_sufficiency_basis` placeholder that the finding replaces. Never
filter/splice that name out of the preexisting collected missing array: an
identically named Core/context/caller obligation remains independently required.
Keep existing structural sufficiency checks and generic proof validation; the
private envelope must supply the required bounded basis without bypassing them.
Structural fields and caller material-gap labels do not select an outcome.
No admission, requirement-union, `requirements.ts`, `contracts.ts` or
`claimState.ts` change is needed.

Claim completeness enumerates the frozen check-pass member independent of display.
Hidden remains required; missing remains unresolved; duplicate full keys reject
without first/last wins, preserving `DUPLICATE_CLAIM_PATH`. Unknown identities
remain unresolved and malformed/disallowed paths retain validation errors. Extra
claims cannot replace a member or be ignored to pass. Additional required claims
need a separately frozen claim set; the current instance retains an unresolved
extra obligation. False evidence_refs, empty atomic_results in the existing
no_material_gap shape, and non-enum states retain existing structural rejection.

## Preserved predecessor routes

| Predecessor | Required unmodified route and source evidence |
|---|---|
| T2-01 | Fresh `evaluateVerificationEvent` with native records and separate original canonical context. Lines 129-183 call the owner after native witness joins; consume those actual results, not a supplied state. No private T2-01 receipt reader is invented. |
| T2-02 | Fresh `compareExactBytes` + `readIntegrityReceipt`. `integrity.ts` registers complete comparisons in a WeakMap; reader lines 96-104 compares original input/context snapshots and path. |
| T2-03 | Fresh `evaluateIndependence` with original integrity receipts + `readIndependenceFinding`. Reader lines 188-197 requires identity, full input/Core/trust/contexts/collection and owned facet/version. |
| T2-04 | Fresh `evaluateTemporalApplicability` + `readTemporalApplicabilityFinding`. Reader lines 196-205 binds the original standing.current path/anchor and full context; retain historical T2-01/02/03 prerequisites and both times. |
| T2-05 | Fresh `evaluateContinuity` + `readContinuityFinding`. Reader lines 209-225 binds original full context/owned path; separate historical/current/revalidation temporal handles retain original envelopes and direct temporal agreement. |

Each route keeps its input, path/facet, Core/trust, requirements, subject/revision/
scope, times and witnesses. Never rename its path to sufficiency or substitute
the outer envelope. R01 needs T2-01, R02/R03 need T2-02 as applicable; T2-03/04/05
are invoked for inherited obligations only, preserving all their prerequisites.
Serialized predecessor states, result hash alone, caller labels and copied handles
are not authenticated predecessor evidence. Missing producer facts remain missing.

## Default-off, standalone and public boundaries

NO valid T2-06 private finding = EXACT existing product behavior. Missing, forged,
copied, serialized or wrong-context handles take the old branch with the same
placeholder, structural checks, diagnostics and output. Do not add a new output
key or diagnostic merely because the optional channel/import exists. Unrelated
paths and existing eight-argument calls remain unchanged. Import alone performs
no evaluation. Historical sufficiency inputs do not gain automatic admission to
the new profile; complete controls are new supplemental evidence, never repairs
to accepted history or frozen B09 observations.

BASE requires no report link and is independently evaluable. No
`reportAssociation.ts`, report-byte verification, report mutation, renderer or
index change. An unverified supplied report reference establishes no association.
T2-07 stays `BLOCKED_BY_SEQUENCE_UNTIL_T2-06_CLOSED`. G03 stays `DEFERRED_TO_G03`:
no Harness mapping, canonical EvidencePack creation, producer integration or
ingestion. Explicit supplied admitted offline evidence is allowed.

Preserved: audit output/verdict/exit, deny 25, permit and classify behavior;
recommendation-only, additive-only, non-executing, default-off; no authority scope
expansion or main-path takeover. No dashboard/control-plane/orchestration drift.
Evidence sufficiency is not acceptance, compliance, audit opinion, certification
or execution permission. Existing public contracts, licensing/offline authority,
install/demo behavior and v7.0.1 commercial baseline remain unchanged. This
document changes no behavior; later implementation must prove these invariants.

## Exact later implementation allowlist and prohibitions

Canonical seven plus only `evaluateClaim.ts` = exactly eight paths:

```text
packages/guard-core/src/mesr/repaired/sufficiency.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-06-controls.v0.1.json
tests/fixtures/gate1/t2-06-results.v0.1.json
docs/validation/v8-gate1-t2-06-evidence-v0.1.md
```

This is a later implementation allowlist; only this decision document changes now.
All paths outside that later list remain protected, specifically:

```text
claimState.ts; requirements.ts; contracts.ts; admission.ts; canonicalBytes.ts
composition.ts; verificationEvent.ts
integrity.ts; independence.ts; temporalApplicability.ts; continuity.ts
Core registry / supports / aliases / boundaries
reason codes / reason bindings
EvidencePackV1 / parser / validator
GovernanceReportModel / reports / renderers / indexes
public CLI / SDK / package exports / default callers
licensing / offline authority / package and version files
historical T1/T2 evidence / frozen B09 history / external-review evidence
accepted T2-06 entry and criteria documents / canonical task and ADRs
```

No selector export/duplication, seventh state, precedence/admission/requirement-union
change, public profile schema, generic profile engine, generic StateBasis intake,
predecessor semantic rewrite, T2-07/G03 implementation or public contract change.
No additional protected path is authorized by a later test failure or convenience.

## Frozen later acceptance proof (NOT EXECUTED)

- Preserve T1-01/T1-02/T1-03/T1-04 and all 603 Core probes; execute the canonical
  R-EAK/R-MESR/R-ISOLATION/R-PUBLIC/R-OUTCOME before/after obligations at entry.
- Preserve the inherited accepted receipts below exactly. They were not rerun
  or remeasured in this review; no result-hash-only input authentication follows.

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
T2_04_RESULT_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
T2_05_RESULT_HASH = d2a43d1073c9cb6be36ff7edd91b8fe6bf50a19809dd364dce2c34a9906f296f
B09_COMMIT = a646f2b4576336321eda696c7dc2ee02749cadb2
ORACLE_HASH = 6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88
HISTORICAL_B09_RESULT_HASH = 49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560
```

- Recompute profile/claim-set/method digests; cover R00-R03, every expanded union
  obligation, A0/A1/X0/M1/NM0 and the complete positive no_material_gap conjunction.
- S04, S10, S11.absent; S01-S13 standalone portions; S04.label_only,
  S04.bad_profile_digest; S02.*, S03.*, S07.*, S08.*, S09; H08/H16/H17/H18/H19.
  Preserve canonical assertions; report-association portions belong to T2-07.
- Hidden/missing required member, empty gap list, unknown/duplicate/extra claims;
  every atomic state and collateral blockers; all claims supported but materiality
  incomplete; missing basis versus completed negative versus complete undecidable.
- Forged/copied/serialized/mutated private findings, caller booleans/StateBasis,
  predecessor state-label/result-hash-only substitution and wrong reader envelope;
  changed predecessor witnesses and conflicting separately supplied channels.
- Wrong profile/claim-set/method digest or retained content; wrong subject/revision/
  artifact/scope/environment/evaluation/reliance time; changed locks and collected
  obligations; same-name placeholder collision must remain required.
- Default-off exact before/after outputs for absent/invalid findings, historical
  inputs and unrelated paths; import isolation; no caller-input mutation; unchanged
  parser/validator, reason values/order, CLI/SDK, legacy JSON/MD/HTML/index and all
  four verdicts. Review source/exports/default callers independently of test PASS.
- Independent product differential harness, no B09 reference-engine dependency or
  test-side state decisions. Preserve corrupted-expectation, dropped-binding,
  duplicate/omitted-case, false-positive and unexpected-exception falsifiers.
- Record commands/exits, before/after observations, input/source/method/oracle
  versions/digests, byte domains and worktree/Git-blob continuity for new evidence.
  Require `PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`,
  `NEW_REGRESSION = 0` and three identical deterministic replays. These are future
  acceptance conditions, not results of this review.

## Hygiene and stop

Use only `git diff --check`, `git diff --name-only` and `git status --short` for
hygiene; account for the new untracked document before staging. Commit only
`docs/planning/v8-gate1-t2-06-scope-expansion-decision-v0.1.md` with subject
`Approve bounded T2-06 state integration scope`. Record the actual
`T2_06_SCOPE_EXPANSION_DECISION_COMMIT` externally in the final receipt, avoiding
self-reference. No implementation suite is run.

Next task: `T2-06 Implementation Entry Refresh v0.2`. Do not mark entry READY
or designate an implementation pre-change HEAD here. T2-06 IMPLEMENTATION NOT
STARTED; T2-07 NOT STARTED / BLOCKED_BY_SEQUENCE; G06 OPEN; G03 NOT STARTED;
G05 CLOSED; G07 CLOSED.

T2_06_BOUNDED_SCOPE_EXPANSION_APPROVED
