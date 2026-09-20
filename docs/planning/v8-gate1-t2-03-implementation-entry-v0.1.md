# T2-03 Implementation Entry Dossier v0.1

T2-03 — Principal separation and custody-bound independent checking. Gap: G05.
Planning/entry evidence only. Implementation is blocked by the canonical
state-integration scope, not by G03 or G07. No scope expansion is authorized here.

## 1. Checkpoint and source authority

- Branch: `planning/v8-gate1-tranche2-t2-03-v0.1`.
- Starting HEAD: `e513919e607b04bfc992137f1f02dd6c054ff71a`.
- Required checkpoint commands confirmed that branch/HEAD and a CLEAN worktree.
- Accepted planning result: `T2_03_IMPLEMENTATION_PLANNING_READY_WITH_BLOCKERS`.
- Accepted T2-01 result hash: `4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`.
- Accepted T2-02 result hash: `a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`.

Those result hashes are inherited acceptance evidence, not newly executed results.
V8-000, Tranche 1, T2-01 and T2-02 are not reopened.

Minimum authority used:

- [Canonical task card and section 3 common requirements](21_GATE1_IMPLEMENTATION_PLAN.md#t2-03---principal-separation-and-custody-bound-independent-checking).
- [ADR 0013 / B05 contract](../adr/0013-independent-verification-and-integrity-evidence-contract.md), especially the dimension table, independence rule and state section; [B05 I01-I18](../validation/v8-b05-independence-integrity-falsifiers-v0.1.md).
- [ADR 0011 / B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), especially state ownership, binding union, per-path nonclaims and precedence.
- Accepted [T2-01 serialization](../architecture/t2-01-internal-event-result-serialization-v0.1.md), [witness dossier](../validation/v8-gate1-t2-01-entry-witness-dossier-v0.1.md) and [implementation evidence, including acceptance closure](../validation/v8-gate1-t2-01-evidence-v0.1.md).
- Accepted [T2-02 entry](v8-gate1-t2-02-implementation-entry-v0.2.md), [scope decision](v8-gate1-t2-02-scope-expansion-decision-v0.1.md) and [implementation evidence](../validation/v8-gate1-t2-02-evidence-v0.1.md).
- Protected source: [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), [claimState.ts](../../packages/guard-core/src/mesr/repaired/claimState.ts), [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts), [contracts.ts](../../packages/guard-core/src/mesr/repaired/contracts.ts); relevant existing anchors in [Core registry](../../packages/guard-core/src/mesr/coreRegistry.ts).
- Frozen [B09 cases](../../tests/fixtures/experiment-3-repaired/cases.v0.2.json), [oracle](../../tests/fixtures/experiment-3-repaired/oracle.v0.2.json), [basis](../../tests/fixtures/experiment-3-repaired/basis.v0.2.json) and [H14/H15](../../tests/fixtures/experiment-3-repaired/admission-hardening.v0.1.json): only the task-named I-family, N02/N15/N18 and relevant anchors were inspected. I17 is temporal preservation evidence only.

Historical specification/oracle expectations are not proof that retained fixture
records satisfy the stricter product witness obligations. Missing private record
layout details are implementation design work; they do not by themselves reopen
the semantic specification.

## 2. Exact evaluation subjects

All canonical anchors below already exist at semantic version `0.1.0`. Facet
strings are bounded request labels, never new canonical IDs, aliases or additions
to Core `supports`.

| Subject | Representation | Source and boundary |
| --- | --- | --- |
| A. Attributable verification occurrence/result | Inherited private T2-01 annotations and exact result; existing `verification.occurred` / `verification.passed` facets on `mesr.core.evidence.verification` when canonical context is supplied | T2-01 owns occurrence/result. Attribution does not authenticate the checker. |
| B. Principal separation | Private derived evaluation with retained policy, principal/control witnesses, satisfaction/non-support/missing/conflict diagnostics | ADR 0013 independence rule and B05 I03 require retaining the separation result independently of custody and check success. No source defines a standalone canonical principal-separation claim ID or serialized primary-state route. Use private findings, not an invented canonical claim or a second state selector. |
| C. Verifier independence for a successful check | Recognized `verification.independent` facet on `mesr.core.evidence.verification` | Already recognized by requirements/evaluator; ADR 0013 explicitly includes successful checking, separation and custody. It is stronger than actor separation alone. |
| D. Custody independence | Frozen `custody.independent` facet on `mesr.core.evidence.item` | B05 I09 and B09 I09 define this separate bounded question. The current product evaluator has no specialized custody branch; recognition in frozen requests does not mean implemented support. |
| E. Common-control / conflict-of-interest facts | Supporting attributable facts only | Inputs to the named separation criterion. Neither a new canonical identity nor a generic conflict flag selecting `CONFLICTED`. |

Principal separation can therefore be represented without semantic invention.
Its exact private output field spelling is not fixed here. A request for a new
standalone canonical separation identity/state would exceed this dossier; no
such identity is required for the bounded private finding. Canonical states for
result, successful independence and custody remain owned by `evaluateClaim.ts`.

## 3. Minimum named predicates

The predicate names in this section are descriptive private evaluation subjects,
not public schema fields or registered semantic IDs. Every required reference
must resolve to retained attributable evidence. Syntactic presence alone never
establishes predicate satisfaction. Unrecognized or undefined methods/policies
leave the affected basis unresolved; arbitrary prose is not executable policy.

### Identity basis

ADR 0013 requires principal `identity_ref`, identity method/result/provenance,
operational role and attribution to the actual check. Retain the source assertion
and the method's stated scope/limitations. Bind the checker to the verifier
principal, and bind producer/executor roles to their actual principal records.
A positive identity result must satisfy the named method in this context; an
opaque principal string, generated verifier ID or role label is insufficient.

These facts are sufficient to evaluate an explicitly supplied bounded identity
basis, not to issue identity or prove authenticated world truth. ADR 0013 does
not mandate a credential technology, online identity provider or generic trust
framework. Do not invent one. If an identity method/result cannot be interpreted
or its provenance cannot be retained, record the exact missing basis.

`checker attribution != authenticated identity`; `principal label != identity
proof`; `authenticated identity != independence`. The existing principal anchor
supports identity reference, not verified identity. Do not promote it into an
authentication proof or override its nonclaims.

### Principal separation

Require explicitly associated producer, executor and verifier principals; a
named separation policy ID/version and its bounded criterion; retained identity,
operational control and conflict-of-interest facts for the relevant roles and
event interval. Determine which relationships that policy requires to be
separate. Do not impose an unsupported universal rule that every pair of roles
must have different IDs.

Minimum source-defined falsifiers are established producer=verifier (B05 I01)
and established common operational control violating the named policy (I11).
Positive separation requires affirmative retained facts satisfying that policy,
including the applicable control/conflict relationships. A missing control
record or silence about conflicts is not a negative conflict finding. Preserve
the method's coverage and omissions; do not claim universal absence of conflicts.

`different IDs != proven separation`; `different process/runtime != different
controlling principal`; `different machine != organizational independence`.
Different organizations alone also do not settle common control. Policy/criterion
version, applicability and the actual facts must be inspectable. A completed
policy violation is non-support; mutually incompatible admissible assertions
about that same relationship are a separate evidential conflict.

### Custody independence

ADR 0013 requires artifact identity/digest plus provenance for collection,
transfers, transformations, storage and access/control through verification;
named custodians, time intervals and omissions. Retain the custody criterion and
the relied-on input/result members. An explicitly absent transformation is a
sourced fact, not a helper default; an omitted segment is missing evidence.

Positive basis must show, under the named criterion, that the producer cannot
solely substitute the relied-on bytes/results over the relevant custody path.
Retain attributable access/control and transfer evidence, not just a
`sole_producer_control=false` assertion. Complete evidence that sole producer
control permits substitution establishes bounded non-support (B05 I09). Missing
custodian/control/interval/transfer evidence leaves custody unresolved, including
when a false sole-control flag is supplied. Comparable unresolved contradictions
in admissible custody records follow B02 conflict precedence.

`copied evidence != independent custody`; `different storage label != independent
custody`; `different custodian label != independent control`; `exact-byte
integrity != independent custody`. No custody service or live enforcement is
introduced.

## 4. Successful-independent-verification rule and state mappings

ADR 0013 requires a complete attributable successful check, a satisfied principal
separation predicate and the custody basis for its inputs/results. Preserve
each dimension and its evidence; do not compress these into one `independent`
boolean. T2-02 comparisons establish only their own member/representation equality;
they never replace identity, separation or custody evidence.

All primary-state rows below assume admitted identities/context and apply the
existing owner precedence: Core prohibition -> comparable conflict -> proven
staleness -> missing obligation -> completed determination (negative,
undecidable, positive), with the existing unresolved fallback. No row removes
Core/caller/context obligations. A negative fact does not satisfy another missing
mandatory binding.

| Bound case | Result / separation finding | Canonical independence / custody consequence | Source |
| --- | --- | --- | --- |
| Missing identity basis | Preserve any independently complete attributed result; separation not established | Independence `UNRESOLVED`; custody evaluated on its own required basis | ADR 0013, I02 |
| Missing separation policy/version or its criterion | Separation not evaluable | Independence `UNRESOLVED` | ADR 0013, B02 missing predicate rule |
| Missing retained control/conflict witness | Labels are not a separation determination | Independence `UNRESOLVED` | ADR 0013 reference rule / B02 |
| Missing custody witness | Positive separation may still be retained privately | Custody and successful independence `UNRESOLVED` | I03 |
| Complete positive separation basis only | Retain satisfied separation predicate and its witnesses | Independence still `UNRESOLVED` if check/result/custody obligations are missing | I03, ADR 0013 |
| Complete producer=verifier or policy-violating common-control basis | Separation criterion establishes non-support; successful check remains passed | Independence `UNSUPPORTED` once its remaining obligations are complete; not automatically `CONFLICTED` | I01/I11 |
| Opposing admissible assertions about the same control/custody predicate, context and applicable time | Retain both, no winner | Affected claim `CONFLICTED` unless a higher Core prohibition applies | ADR 0011 |
| Complete positive custody basis | Custody criterion satisfied independently of check success | Custody `SUPPORTED`; no automatic verification result/independence upgrade | ADR 0013 dimension table |
| Complete sole-producer-control basis | Custody criterion establishes non-support | Custody `UNSUPPORTED`; independence `UNSUPPORTED` when all its obligations are complete; missing other obligations still follows B02 | I09 |
| Successful check + complete positive identity/separation/custody basis | Pass preserved; separation satisfied | Independence `SUPPORTED`; custody separately `SUPPORTED` | I10 |
| Failed check + complete separation basis | Exact failed result; separation may be satisfied; complete occurrence can be supported | Pass `UNSUPPORTED` with full result basis. Successful independence `UNSUPPORTED` only with all its required basis complete; missing custody etc. yields `UNRESOLVED` | I05, ADR 0013 |
| Independent actor + skipped/incomplete check | Actor separation may be retained; skipped alone supplies no occurrence | Successful independence `UNRESOLVED` for missing event/result; never inferred successful or failed. A separately completed explicit negative criterion follows B02 | I05.skipped, ADR 0011 |
| Successful check + missing independence basis | Pass can be `SUPPORTED` on its own path | Independence `UNRESOLVED`; producer-only independence inference separately `UNSUPPORTED` | N02/N15 |
| Successful check + common-control policy violation | Pass preserved | Independence `UNSUPPORTED` on complete basis; incompatible opposing witnesses instead use `CONFLICTED` | I11 / B02 |
| Complete bound inconclusive method | Exact inconclusive result retained | Result `INCONCLUSIVE`; complete successful-independence evaluation remains `INCONCLUSIVE`; remove required inputs -> `UNRESOLVED` | I14, ADR 0013 |
| Observation or producer assertion used as independence proof | Preserve the scoped nonclaim | That inference `UNSUPPORTED`; separate complete event path remains independently evaluable | I18/N18, N15 |
| Wrong subject/revision/scope/event association | Witness cannot discharge this context's obligation | Affected claim `UNRESOLVED`; not automatically `STALE` | I12 / B02 |

The separation column is a private predicate finding, not a hand-written primary
state. No required semantic mapping above is left to test expectations. In
particular, a common-control relationship is a criterion counterexample, not by
itself two contradictory assertions. Historical-to-current loss is a G07 matter;
preserve the shared stale precedence without implementing that method here.

## 5. Retained witness model and deterministic joins

Use explicitly supplied offline records with source namespace/reference,
field-level provenance, raw values, method/policy basis, context and limitations.
Every identity/control/custody reference must resolve within the supplied retained
basis. No URI fetching, clock sampling, ID invention, source-defaulting or
implicit cross-namespace alias is permitted. Bounded private record layout can
live in `independence.ts`; no public schema or canonical pack field is needed.

`reference != retained witness`; `retained witness != authenticated truth`;
`retained evidence != independent custody`. Authored hypothetical positive
controls test the supplied-fact method, not real-world authentication.

| Association | Required retained join |
| --- | --- |
| Subject / revision / scope | Exact T2-01 target and record context, T2-02 member context, and T2-03 identity/control/custody applicability. Equal event labels cannot cross revisions. |
| Verification event / result | T2-01 occurrence_ref, result event_ref/event_id, namespace, checked property, method/version, criterion, exact result, input/output refs and retained records. Preserve every comparable candidate. |
| Checker / verifier principal | Explicit role/identity witness connects T2-01 checker attribution to the actual verifier principal; string equality alone is not identity proof. |
| Producer / executor principal | Explicit producer/executor attribution and control records connect those roles to the same captured event context. Do not manufacture executor identity from producer name. |
| Artifact / member / representation | Retained association between each relied-on event input/output and T2-02 member namespace/reference, representation/byte domain and subject revision. Raw and transformed members stay distinct. |
| Source / comparison | Retain T2-02 expected-source witness, input/output refs, SHA-256 algorithm, actual byte count, expected/recomputed digests, match/mismatch, comparison event, checker/version and method descriptor. No equality from a digest label or copied receipt. |
| Event time / custody interval | Retain supplied zoned event and comparison times separately from evaluation_time; custody/control intervals must cover the stages and through-verification use claimed by the criterion. Do not require unrelated timestamps to be identical or substitute evaluation_time. |
| Semantic evaluation context | Bind exact request path/facet, canonical IDs/versions, registry/module admission, requirement contexts, evidence basis and evaluation_time. Preserve collected Core/context/caller obligations. |

**T2-01 join:** consume the accepted occurrence/result contract without changing
it. Retain event-to-result and role-to-principal associations explicitly; no
renaming of `verification.passed` or stronger interpretation of an occurrence-only
annotation. Failed and inconclusive results remain exact. A T2-01 annotation or
caller-supplied serialized result alone cannot stand in for its retained facts
and actual product evaluation.

**T2-02 join:** use the existing exact-byte comparison path unchanged for the
same explicitly associated member/representation and expected-source basis.
Fresh valid private receipt consumption remains subject to its current input,
path and requirement-context checks; a deserialized object is inert. Link the
comparison's checker to principal evidence explicitly. The comparison event and
verification event may be distinct, but their retained association is mandatory.
Never equate a member match with independent custody, or overwrite mismatch with
an independence result. The claim determines which comparisons are required;
there is no inferred package-wide integrity or truth claim.

Missing or ambiguous joins remain named missing obligations. Comparable mutually
incompatible witnesses remain conflicts. A deterministic private method must
preserve all candidates, not choose a favorable source by order or majority.
These joins derive from ADR 0013 and the accepted T2 contracts; proposed private
storage choices do not authorize a new ingestion layer.

## 6. Frozen I10 and new supplemental evidence

Inspected frozen I10 retains only `fixture:change` and `fixture:test-output` in
its evidence ledger. Principal labels and separation/custody objects name
`fixture:control-register`, `fixture:custody-record`, `fixture:collection` and
`fixture:sealed-copy`; those strings do not supply retained identity-method,
control or custody records. Do not upgrade them into facts or retrospectively
declare I10 product-conforming.

Keep B09 input/oracle/history byte-identical, including its hypothetical positive
expectation. Record any product/oracle gap explicitly. The same witness standard
applies to I18/N18 positive paths; retain their observation exclusions. Preserve
N02/N15 producer-inference separation and I10.unresolved_ref missing evidence.

A NEW task-specific I10-style supplemental control may later supply literal,
attributable identity, role/control/conflict, policy and custody witnesses plus
complete T2-01/T2-02 joins. Give it separate source provenance and case identity;
it is new hypothetical evidence, not a historical repair. No shared helper may
manufacture missing records, no frozen expected value may become product input,
and no fixture is created in this task.

## 7. Canonical state-owner integration and scope decision

Source inspection at the starting HEAD establishes:

- `evaluateClaims` first performs the existing admission/requirement collection.
- The `verification.independent` branch on the verification anchor unconditionally
  adds `independent_verification_basis`. Supplying principal/separation/custody
  objects cannot remove that marker or contribute completed independence facts.
- `custody.independent` has no specialized branch and is not a Core `supports`
  entry; it falls back to missing admitted mapping/evidence. Frozen facet usage
  does not bypass that product behavior.
- The optional fifth argument is exclusively a T2-02 integrity receipt consumed
  for `artifact.byte_equality`. It is not a T2-03 or generic state-basis intake.
- `state_proofs` permits narrowly scoped evidence-presence/applicability proofs,
  not independence. Requirement contexts can add obligations, not remove them or
  supply canonical positive states.
- `selectClaimState` and canonical result registration are local to this file.
  `evaluateCompositeClaim` accepts actual owner-produced children through its
  private WeakSet. Relabeling or fabricating a child cannot provide a legal route.
- `claimState.ts` contains the six-state constants/types and factual basis arrays;
  it does not expose a separate selector to use. Existing basis categories are
  sufficient for the required missing/positive/negative/conflict findings.

The canonical seven candidate paths remain:

```text
packages/guard-core/src/mesr/repaired/independence.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-03-controls.v0.1.json
tests/fixtures/gate1/t2-03-results.v0.1.json
docs/validation/v8-gate1-t2-03-evidence-v0.1.md
```

**Canonical seven-path scope sufficient: NO.** Minimum additional candidate path:

```text
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
```

A separate bounded scope-expansion review must authorize any change there.
The candidate design is a task-specific private factual intake from
`independence.ts`, bound to actual retained evaluation context, feeding the
owner's existing arrays for the exact independence/custody facets. The private
module evaluates named predicates; the existing owner selects all primary states.
It must retain a separate separation finding without registering a new identity.

The review must require unforgeable/context-bound product evidence, preservation
of incomplete and conflicting findings, and no acceptance of caller-authored
states. Missing evidence is not a reason to discard traceable conflicts. Absent
or invalid handoff must preserve historical output; valid handoff may replace
only specialized branch-local placeholders it actually resolves, never a
collected Core/caller/context obligation with the same name. Existing selector,
composite admission and T2-01/T2-02 routes must remain unchanged. This feasibility
finding is independently derived from current T2-03 branches; T2-02's approval
does not authorize reuse or expansion automatically.

No need is identified for changing `claimState.ts`, `requirements.ts`,
`contracts.ts`, `admission.ts`, Core registry/boundaries, reason bindings/codes,
EvidencePackV1, parser/validator or public exports. Private record validation and
the receipt type/reader can remain in the candidate product module and owner
file. If implementation design later requires any other protected path, stop for
a new scope determination; do not progressively widen this candidate boundary.

Rejected designs: a second selector; copied `selectClaimState`; hand-written
canonical states; test-side semantics; fixture-defined state; renaming
`verification.passed` to `verification.independent`; treating T2-01 occurrence as
independence; treating T2-02 integrity as custody; generic `StateBasis` injection
from caller objects. The existing evaluator remains the sole canonical owner.

## 8. Deferred boundaries and later acceptance controls

`G07 = DEFERRED_TO_LATER_ACCEPTANCE`. Historical/event-scoped independence is not
current continuing independence. Interval association for this captured check
does not implement temporal current standing, continuity or current reliance.
G07 remains OPEN; it does not block this bounded evaluation.

`G03 = DEFERRED`. Explicitly supplied admitted offline facts suffice for this
bounded method. Truthful Harness -> canonical EvidencePack integration remains
OPEN: no Harness mapping, pack creation, producer integration or new ingestion
layer. Neither dependency is implemented here. G05 remains OPEN.

Freeze these minimum later controls as obligations, not executed tests:

1. Distinct principal labels, processes/runtimes, machines or organization names
   alone cannot satisfy separation. Successful check alone cannot satisfy
   independence; byte equality alone cannot satisfy custody.
2. Complete same-principal/common-control policy violations produce bounded
   non-support, preserve pass results and never invent contradictory witnesses.
   Explicit opposing admissible relationship records exercise conflict precedence.
3. Remove each identity/policy/control/conflict/custody witness or retain only its
   reference: affected claims stay unresolved. Include missing/null/empty/wrong
   types, undefined criteria and incomplete custody intervals/omissions.
4. Complete sole-producer-control evidence cannot become independent custody.
   A copied record, different custodian/storage label or false control flag cannot
   substitute for retained custody/control facts.
5. Failed independent check remains failed; preserve separation and occurrence
   separately. Skipped/incomplete check cannot become successful independent
   verification. Complete inconclusive and missing method inputs stay distinct.
6. A new complete I10-style control supplies all explicit witnesses/joins and
   supports only bounded claims. Acceptance remains unresolved without its own
   decision/authority evidence. Preserve scoped observation/producer exclusions.
7. Replay identity/control/custody witnesses across wrong subject, revision,
   scope, event, actor, member, representation, source, time/interval or policy
   version: no positive discharge. Preserve competing candidates and provenance.
8. Reject forged/copied/serialized/tampered private handoffs and caller state
   hints; preserve exact no-handoff outputs. Exercise Core/caller/context missing
   obligations, prohibition/conflict precedence and actual composite ownership.
9. Preserve named B09 I01-I18 non-temporal slices, N02/N15/N18 and
   I10.unresolved_ref without enrichment; report remaining historical gaps.
   H14 malformed base64 `%%%` and H15 numeric base64 `123` remain structural
   `REJECTED` controls. I17 stays a preserved temporal case, not T2-03 closure.
10. Replay unchanged accepted T2-01 and T2-02 inventories with the exact hashes
    in section 1; preserve T1-01/02/03/04 outputs, 603 Core probes, requirement
    unions, admission and composition. Do not rewrite historical branch guards
    or freeze receipts to accept the new owner-file delta.
11. Record BEFORE/AFTER R-EAK, R-MESR, R-ISOLATION and R-PUBLIC evidence; compare
    protected sources and public serialized contracts. Require
    `PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`, no new regression,
    and deterministic replay across three fresh evaluations with supplied times.
12. Pin source/input/output hashes, exact asserted fields, pending gaps,
    approved allowlist, reversibility/rollback evidence and product/test isolation.
    Shared helpers only translate/invoke/compare; they never decide semantics.

Audit output/verdict/exit and deny exit code 25 unchanged; permit/classify
unchanged. Recommendation-only, additive-only, non-executing and default-off;
no authority scope expansion, hidden enforcement, control-plane, dashboard-first
or orchestration drift. Released v7.0.1 behavior, licensing and offline authority,
CLI/SDK, reports and reason contracts remain protected. This planning-only change
does not claim implementation/regression PASS or release readiness.

## 9. Planning hygiene, commit protocol and formal entry decision

Only this dossier is created. No canonical task card, product code, verifier,
fixture, historical evidence or public contract is modified. Validation for this
task is limited to `git diff --check`, `git diff --name-only` and
`git status --short`; no implementation suite is run. The hygiene check found no
whitespace errors, exactly this dossier in the changed-path list, and only this
new dossier in status. Git intent-to-add made the new file visible to the diff
checks; it supplied no implementation authorization.

Preserve this dossier in one blocker-evidence commit with subject
`Record blocked T2-03 implementation entry`. Report its resulting SHA as
`T2_03_BLOCKED_ENTRY_COMMIT` outside its own committed bytes. Do not create
`T2_03_IMPLEMENTATION_PRE_CHANGE_HEAD`. The next required action is a separate
bounded scope-expansion review, not implementation authorization from this dossier.

T2-03 IMPLEMENTATION NOT STARTED. G03 NOT STARTED. G07 NOT STARTED. G05 OPEN.

IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
