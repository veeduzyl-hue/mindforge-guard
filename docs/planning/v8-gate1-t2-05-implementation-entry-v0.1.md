# T2-05 Implementation Entry Dossier v0.1

Date: 2026-09-21. Documentation-only; internal V8, not a released product capability.

## 1. Checkpoint, authority and decision boundary

```text
task = T2-05 / Tranche 2 / G07
starting_HEAD = 91b990212bdefdf5c84d75c42f9dec0d30f840df
starting_branch = feat/v8-gate1-tranche2-t2-04-reliance-time-applicability-v0.1
starting_worktree = CLEAN
entry_branch = planning/v8-gate1-tranche2-t2-05-v0.1
branch_creation_HEAD = 91b990212bdefdf5c84d75c42f9dec0d30f840df
rollback_point = 91b990212bdefdf5c84d75c42f9dec0d30f840df
```

The required status/branch/HEAD commands passed before branch creation; branch and HEAD were confirmed afterwards. Windows sandbox initialization failed before shell execution; reviewed elevated execution enabled the scoped reads and branch creation. No product command or implementation suite was run.

Authority is the [T2-05 card and section 3 common requirements](21_GATE1_IMPLEMENTATION_PLAN.md#t2-05---context-continuity-and-current-authority-rebinding-evidence), [ADR 0015/B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md#explicit-applicability-dimensions), [ADR 0011/B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md#binding-and-precedence-contract), [ADR 0013/B05](../adr/0013-independent-verification-and-integrity-evidence-contract.md#distinct-dimensions-and-required-evidence), and [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md). [ADR 0010/B01](../adr/0010-mesr-canonical-id-relation-and-admission-contract.md#canonical-identity-and-mapping) is used only for pinned identity, equivalence, mapping and supersession boundaries. Accepted T2-04 [entry](v8-gate1-t2-04-implementation-entry-v0.2.md) and [implementation evidence](../validation/v8-gate1-t2-04-evidence-v0.1.md) remain historical references, not reopened decisions.

Semantics, facet ownership and the minimum retained evidence model are sufficiently bounded. The canonical seven-path allowlist cannot deliver T2-05 facts to the existing sole state owner. The minimum additional candidate is `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`. This dossier records that blocker; it does not authorize expansion or implementation. No genuine specification contradiction was found.

## 2. Exact ownership

| Subject | Classification and boundary |
| --- | --- |
| `standing.current` on `mesr.core.temporal.basis@0.1.0`, exact requested path | Existing bounded request facet. T2-05 contributes context-continuity/reuse findings; T2-04 retains temporal applicability. Neither facet spelling nor canonical meaning changes. |
| `authority.current` on `mesr.core.temporal.basis@0.1.0`, exact requested path | Existing frozen request facet, evidenced by T14/T15/T27 in `tests/fixtures/experiment-3-repaired/cases.v0.2.json`. T2-05 evaluates retained current-authority continuity/rebinding evidence. It creates no authority. |
| T14 `old_authority_inference`, `authority.current` on `mesr.core.provenance.producer@0.1.0` | Separate excluded inference path under B07 T14; old-authority-only inference is UNSUPPORTED. It cannot acquire the positive temporal-anchor route. |
| Subject/revision, scope, environment, policy, dependency, authority continuity; revalidation; review reuse | Private derived dimension evaluations over supporting facts. These are not new canonical claims, IDs, aliases or Core supports. |
| T15/T16/N14 acceptance and decision paths on `mesr.core.review.review@0.1.0` | Cross-gap boundary controls: preserve occurrence versus applicable authority versus acceptance distinctions. T2-05 does not issue acceptance or widen into a general institutional-decision evaluator. |

The exact fixture paths are `current` for the standing controls, `authority` for current authority, `old_authority_inference` for T14's excluded path, and `decision`/`acceptance` for the cross-gap review paths. A label matching one of these paths is not evidence admission. Bind canonical entry/version/digest, registry and module lock independently. There is no facet ambiguity and no registration change.

## 3. Continuity and materiality contract

Required dimensions follow the admitted claim/context obligations; not every dimension is universally required. An omitted dimension is not silently optional. Core, contextual and caller requirements remain conjunctive under B02. Each dimension needs a named predicate, retained evidence, source attribution, subject/scope/time association and limitations.

| Dimension | Predicate and retained basis | Positive continuity | Proven loss for a historically supported reused basis | Missing basis |
| --- | --- | --- | --- | --- |
| Subject / revision | Exact revision/artifact binding, or admitted equivalence/rebinding proof connecting retained old/current identities and representations | Bound same artifact/revision or explicit applicable equivalence proof | Explicit criterion establishes incompatible current revision (T08) | Missing equality/change evidence or unadmitted equivalence (T09.subject) |
| Scope | Compare bounded action/resource/claim scope, retaining old/new scope and any compatible projection proof | Same bounded scope or proved compatible projection | Expansion beyond the historically supported resources/actions (T10) | Unspecified scope or absent comparison/projection (T09.scope) |
| Environment | Captured old/current environment identities/digests and relevant settings, with admitted materiality rule and comparison evidence | Complete comparison establishes no material change under that rule | Established material settings/context change (T11) | Missing current snapshot, criterion or comparison |
| Policy | Old/current applicable policy versions/digests, effective dates, compatibility criterion and retained decision evidence | Applicable compatible policy transition, including a different version when proved compatible | Material rule change explicitly displaces reliance (T12.policy) | Version difference without impact proof/criterion (T13.policy) |
| Dependency | Old/current dependency locks/artifact identities, named impact criterion and bound comparison | Complete equality or proved non-material change for the requested claim | Material dependency drift under the criterion (T12.dependency) | Missing lock, equality/impact basis or criterion (T13.dependency; T20) |
| Authority continuity / re-establishment | Applicable principal/authority provenance and action/target/purpose/scope/time bindings; predecessor/current association and limitations | Complete independently evaluated continuity or re-establishment proof for a new scoped basis (T15) | Proven loss of historically applicable scope; temporal revocation facts only from the accepted temporal basis | Old authority alone, new reference alone or missing rebinding (T14/T27) |
| Revalidation | New attributable event/result, target context, method/version/criterion, time, retained inputs/outputs and explicit applicability link; custody/independence where required | New successful check with its own complete admission and currentness obligations (T07) | A changed-context loss remains attached to A; a new failed check is a separate bounded non-support result, not automatic loss of A | Label/reference without retained event/result or required method/context evidence |
| Review / approval reuse | Original event/result plus required subject/scope/context continuity and currently applicable reviewer/acceptance authority | Only the bounded reuse proposition whose obligations are complete | Explicit loss of applicability of that original basis | Old approval alone or absent current authority (T16/N14) |

For **every row**, comparable contradiction means admissible incompatible assertions about the same dimension/predicate, old/new basis, subject, scope and applicable time under comparable methods, with neither an admitted resolution nor a mere difference of time or context. Retain both witnesses; do not select by order. Different method labels alone do not establish contradiction. Unknown comparability remains a named missing obligation. A complete admitted method with all required inputs that cannot decide yields an undecidable dimension; a missing input never does. These rules derive from B02 and B07 T21, not a new primary-state system.

The repository defines materiality through explicit criteria and retained comparison/compatibility evidence, not a universal semantic-diff algorithm. Subject uses exact binding or admitted equivalence/incompatibility proof; scope uses bounded inclusion/compatible projection; environment uses a settings materiality rule; policy uses applicable versions/effective dates and compatibility decision; dependencies use locks/artifact identities and a named impact criterion. A later private method must validate the criterion, input inventory, decision attribution, comparison and applicability. Unknown criteria or an unbound caller `material_loss` label cannot supply a determination. Private representation details can be frozen during a separately admitted entry; their absence is not a semantic contradiction.

The following are source-derived limits of those predicates (B01 identity/mapping, B05 integrity, B07 dimensions/T07-T16): same subject label != subject continuity; same revision string != equivalent subject; same bytes != same operating context; same scope label != compatible scope; same environment name != no material change; same policy ID != policy compatibility; different policy version != material incompatibility; dependency version difference != material impact; old verification != successful revalidation; old approval != current authority; new authority reference != valid rebinding. Absence of change evidence is not proof of no change. No version-equality or version-difference shortcut is admitted.

## 4. New revalidation and rebinding; immutable history

The permitted chain is historical basis A -> recorded context change -> new retained check/rebinding evidence -> separately evaluated linked basis B. Retain A's exact identity/version/digest, source context and result; B identifies its own subject/revision/scope, event/result or authority evidence, method/version, applicable policy, effective times and limitations, and explicitly records its relationship to A. If semantic supersession is asserted, additionally require B01 predecessor/successor identities/versions/digests, effective applicability, rationale and compatibility limits. A new check is not automatically semantic supersession.

Revalidation supports B only after B's own admission, scope, method, event/result, currentness and all claim-required evidence obligations pass. Recompute private handles from supplied retained facts when needed; that is not executing a new external verification. Required integrity evidence must match B's actual representations; required T2-03 identity/separation/custody evidence must bind B's actual event and context. A's evidence cannot be inherited merely because a principal, file or tool label is unchanged. This does not require independence for every attributed-result claim; B05 makes it claim-specific.

A rebinding witness retains predecessor and new basis references, principal and authority provenance, issuer/source, subject/revision, action/target/purpose/scope, policy/version where required by the criterion, effective interval and convention, observation/rebinding time, relationship proof, applicable revalidation evidence, limitations and omissions. A new authority reference is not valid authority standing. It must resolve to retained evidence and satisfy its named admissible criterion. Temporal status is consumed without recreating a revocation or authority service.

Successful B never edits or renews A: no changed predecessor timestamp, digest, result, bytes or authority record; no retroactive currentness and no automatic renewal. Rebinding evidence != authority itself; authority continuity != institutional acceptance; institutional acceptance != execution permission. Review occurrence, acceptance authority and acceptance decision occurrence remain separate. No permissions are issued.

## 5. Sole state owner, reuse and STALE

[ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md#exactly-six-primary-states) and ADR 0015 govern the mappings. `evaluateClaim.ts:11-20` implements the sole private selector; `claimState.ts` only declares the six states and basis types.

| Basis, in existing precedence order | Primary state / reuse consequence |
| --- | --- |
| Applicable inference prohibition, including old-authority-only or old-approval-to-current-acceptance path | UNSUPPORTED for that inference, not world falsity; independent bases remain separate |
| Comparable admissible contradictory continuity/rebinding assertions | CONFLICTED; retain every witness and missing diagnostic |
| Preserved historical support plus proved temporal or material context applicability loss | STALE for reuse of A in the requested context; original historical support is unchanged |
| Missing mandatory continuity, criterion, temporal, revalidation or rebinding evidence | UNRESOLVED, including a temporal positive with missing continuity |
| Complete bounded criterion proves non-support or explicit continuity-policy violation, without a higher-priority basis | UNSUPPORTED for that bounded claim; do not invent historical validity |
| All necessary inputs applicable and method complete but unable to decide materiality/continuity | INCONCLUSIVE (T21.complete); removing an input gives UNRESOLVED (T21.missing) |
| Complete positive basis and every required obligation satisfied | SUPPORTED, for the scoped new/reused basis only |
| No admitted determination | UNRESOLVED |

The selector's existing completed-determination order is negative, undecidable, positive. Do not change precedence, suppress collateral missing facts, or treat a supporting dimension as whole-claim support.

Consequently: unchanged context plus complete T2-04 evidence can support reuse only with positive retained continuity evidence and all other obligations. Compatible policy change and non-material dependency change discharge only their dimensions. Material subject/scope/environment/policy/dependency loss yields STALE **when historical support and loss are proved**. Never-valid-in-the-new-context is not sufficient for STALE: complete exclusion may be UNSUPPORTED, otherwise UNRESOLVED. Missing revalidation/rebinding stays UNRESOLVED; complete new revalidation/rebinding may support B while A remains stale. Explicit policy violation with proved loss of prior applicability follows STALE precedence, while an applicable inference prohibition still takes precedence over STALE.

The hard entry question is resolved affirmatively by ADR 0015's subject/scope/environment/policy/dependency rows and T08/T10/T11/T12: T2-05 may contribute material-context STALE evidence. This extends neither the meaning of STALE nor T2-04 ownership. T20 preserves temporal STALE with missing dependency evidence visible. I17 remains a temporal-loss cross-control. Temporally applicable != contextually continuous.

## 6. Time inheritance and minimum offline witness model

`evaluation_time` and `reliance_time` remain explicit distinct roles; equal instants require explicit supplied values. No Date.now(), network time, implicit current time, generated now, creation-time substitution or silent fallback. Retain raw timestamps and compare normalized instants only under the admitted precision, timezone and interval convention. Missing required timestamps/conventions remain unresolved.

Witness observation/check/revalidation times describe attributed collection or events, not effective applicability. Rebinding/compatibility rules carry their own effective intervals; test applicability at requested reliance time using those rules and the recorded evaluation knowledge basis. Do not equate observation, ingestion, effective, evaluation and reliance times. A known prospective rule is not a guarantee about later events. T2-04 alone evaluates freshness, expiry, revocation, supersession applicability, snapshot completeness and horizon.

Minimum retained groups, only where required by the requested claim:

1. Request facet/path, canonical identity/version/digest, registry/module locks, requirements and named method/version.
2. Immutable historical basis identity/version/digest and full original context; retained original event/result, integrity and independence/custody evidence as required.
3. Current subject/revision/artifact representation and old/current bounded scope; equivalence/projection proofs where used.
4. Old/current environment snapshots, policy versions/digests/effective dates, dependency locks/artifact identities; applicable criterion and attributable comparison/decision records for each required dimension.
5. New revalidation event/result, inputs/outputs, criterion and limitations; new context-bound integrity/independence/custody evidence where required.
6. Retained authority/rebinding evidence and predecessor/successor association as specified in section 4.
7. Explicit reference times, witness observation/effective times, source/provenance, limitations/omissions and the accepted T2-04 applicability evidence/context.

Reference != retained witness; new check reference != retained revalidation; authority label != authority continuity. These are private witness requirements, not a public schema. The existing `contracts.ts` evidence ledger permits nested retained records with subject/scope association; `requirements.ts` still collects minimum obligations. A task-specific ledger record and separate private handles can carry the candidate model without editing either protected file. Serialization/byte encoding, length, digest domain and transformation provenance must be explicit in later evidence, per change control.

## 7. Deterministic joins and private candidate handoff

Join exact requested facet/path and admitted canonical version/digest; subject/revision/scope; historical basis identity/version/digest; old/current context identities; policy/dependency/environment snapshot identities and criterion versions; event IDs/results/inputs/outputs; authority relationship; explicit evaluation_time and reliance_time. Retain original T2-02 byte domains and T2-03 check/custody context. Wrong subject, revision, scope, path, time, policy, dependency or criterion cannot discharge another target's obligation. Preserve all comparable contradictions; no first/last/favorable-record selection.

T2-04's reader authenticates only its original `standing.current` input/core/trust/contexts/collection/path. It cannot authenticate an `authority.current` handle or a different revision by renaming a request. A later continuity evaluator may read a separately supplied genuine T2-04 finding with its **original exact context**, then explicitly join that basis to the requested old/current relationship and times. That join must be proved by retained evidence; it does not recalculate temporal rules or make the old subject the new subject. A new B must have its own appropriate applicability basis. Missing/inapplicable T2-04 evidence remains missing; a serialized `SUPPORTED` label is not a substitute.

Candidate only:

```text
explicit retained continuity / rebinding witnesses
  -> continuity.ts (dimension facts, no canonical states)
  -> private immutable context-bound T2-05 finding
  -> evaluateClaim.ts (authenticated bounded intake)
  -> existing factual arrays and unchanged private selectClaimState
```

A module-private registration/reader can bind the full retained input, admission basis, trust, contextual requirements, collected obligations, target path and all prior finding contexts. Only product evaluation creates a valid process-local handle. Fabricated/copied/serialized/reconstructed handles are inert; mutation fails; recomputation uses original retained witnesses. A valid handle proves product computation, not completeness or real-world authority. Private finding authority != real-world authority; rebinding finding != permission; continuity finding != acceptance; current-authority evidence != execution authority.

If separately approved, an optional trailing T2-05 argument preserves existing T2-02/03/04 positions. The owner adds dimension facts and missing obligations only on the admitted facets/paths and evaluates the T14 excluded path separately. Preserve collected Core/caller/context requirements even when their names collide with branch placeholders. Only a branch-owned missing placeholder whose predicate is actually discharged may be replaced; do not delete strings from the collected union. A temporal positive cannot mask a missing/negative/undecidable continuity finding. No-finding and invalid-finding outputs must remain byte-equivalent to accepted prior behavior; the accepted T2-04 legacy-route isolation remains intact.

## 8. Canonical implementation scope and concrete blocker

The T2-05 card plus section 3 expands to exactly:

```text
packages/guard-core/src/mesr/repaired/continuity.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-05-controls.v0.1.json
tests/fixtures/gate1/t2-05-results.v0.1.json
docs/validation/v8-gate1-t2-05-evidence-v0.1.md
```

Canonical scope sufficient: **NO**. Source evidence at the verified starting HEAD:

- `evaluateClaim.ts:34` accepts only existing integrity, independence and temporal optional inputs. Imports at lines 7-9 expose no continuity intake.
- Lines 104-119 handle `standing.current` temporal facts and branch-local `currentness`; they do not evaluate context continuity.
- There is **no authority.current branch and no dedicated continuity/current-authority placeholder**. Unanchored, non-prohibited requests fall back to `admitted_mapping_and_evidence` at line 133. Do not claim a nonexistent branch already accepts rebinding.
- `selectClaimState` is private at lines 11-20, called for atomic/composite results at lines 159/200. Authentic owner results are registered for composite consumption.
- `requirements.ts` can add obligations, not positive findings or state authority. `contracts.ts` structural acceptance of `authority_rebinding` is not semantic evaluation.
- `temporalApplicability.ts:196` checks its own process-local registration and exact standing facet/context. Its nonclaims explicitly include context continuity/current authority. It must not become a generic finding transport.

A new continuity module alone cannot make the unchanged owner consume complete positive, loss, contradiction or undecidable facts. Writing state labels in tests, copying/exporting the selector, injecting generic StateBasis, overloading an existing private channel, or translating T2-05 into the legacy boolean temporal proof would bypass the admitted ownership boundary.

Minimum additional candidate, **not authorized**:

```text
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
```

No protected path beyond that candidate is currently necessary on source inspection. `claimState.ts`, `requirements.ts`, `contracts.ts`, `temporalApplicability.ts`, `integrity.ts`, `independence.ts`, `verificationEvent.ts`, admission/composition, Core, aliases, public contracts and all historical evidence remain protected. If a later concrete implementation needs another protected path, identify the first path and stop; do not widen progressively. Prior T2-04 scope approval grants no T2-05 approval.

## 9. Exact controls and frozen evidence handling

The canonical card inventory was checked against [B07 cases](../validation/v8-b07-temporal-standing-cases-v0.1.md), named B02/B05 rows and the selected frozen JSON records:

| Controls | Required bounded assertion |
| --- | --- |
| T07; T15; new complete continuity controls | New attributable revalidation / fully evidenced scoped rebinding may support a new basis; original evidence remains linked and unchanged |
| T21.complete | Complete method with undecidable continuity -> bounded INCONCLUSIVE |
| T08; T10; T11; T12.policy; T12.dependency | Historically supported reuse plus proved incompatible subject, scope expansion, material environment, policy or dependency loss -> STALE |
| T09.subject; T09.scope | Missing comparison -> UNRESOLVED |
| T13.policy; T13.dependency | Version difference without required impact criterion/current lock -> UNRESOLVED |
| T14 | Current authority missing rebinding -> UNRESOLVED; separate old-authority-only inference -> UNSUPPORTED |
| T16; N14 | Historical review/decision occurrence retained separately; missing applicable acceptance authority -> unresolved current acceptance/authority |
| T20 | Accepted temporal expiry loss keeps STALE precedence; missing dependency remains diagnostic |
| T21.missing | Missing required input -> UNRESOLVED despite an inconclusive label |
| T27 | Producer flags/task creation time cannot manufacture currentness or rebinding facts |
| I17 | Old independent pass with explicit temporal applicability loss -> STALE; historical result/bytes preserved |
| H33 | Exact frozen T15 mutation replaces `acceptance_authority` with `{}`; expected structural status REJECTED, not a seventh claim state |

Full T-family exit means all **37** frozen T-family cases, not merely the numbered T01-T27 families. Temporal controls retain T2-04 ownership. No fixtures or controls are created in this task.

Frozen `same`/`material_loss`/`inconclusive` values, compact authority references and historical state labels are not newly retained environment, compatibility, impact, revalidation or rebinding records. Do not enrich them in translators or derive facts from expected results. Preserve original case IDs, omissions, bytes, expected assertions and before/after observations. Missing retained evidence is recorded as a named conformance/evidence gap, never erased or promoted to PASS. New complete witnesses require separately identified task-specific supplemental controls and provenance; they are not historical repair and cannot silently replace a frozen assertion. Preserve T21.complete's authoritative conditional INCONCLUSIVE expectation without pretending its compact labels prove full product witness admission.

## 10. Prior-task and deferred boundaries

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
T2_04_RESULT_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
```

These are accepted baselines from the task and T2-04 evidence, not newly reproduced results.

- T2-01 stays historical occurrence/result; revalidation is a new event/result basis.
- T2-02 stays exact-byte integrity; same bytes do not establish continuity. No `integrity.ts` edit or generic receipt channel.
- T2-03 stays event-scoped independence/custody. New events need their own bound evidence when required; old findings are not mutated or relabeled.
- T2-04 stays reliance-time temporal applicability for `standing.current`. No recomputation/redefinition of freshness, expiry, revocation, supersession applicability, snapshot completeness/horizon; no `temporalApplicability.ts` edit or generic finding channel. Its accepted result is an input only where its exact context/relationship is established.
- G06 = `DEFERRED_TO_G06`: no profile-bound sufficiency, report association or outward immutable-report association. Continuity is not report sufficiency.
- G03 = `DEFERRED_TO_G03`: no Harness mapping, canonical EvidencePack creation, producer integration or ingestion. Supplied admitted offline evidence permits bounded evaluation; absent producer facts remain absent.

## 11. Later acceptance controls and completion path

These are requirements for later authorized implementation, not executed claims:

- Reject same-label, same-version and same-bytes continuity shortcuts; reject version-difference-only materiality inference and absent-change-as-no-change inference.
- Test missing subject/scope/environment/policy/dependency evidence independently; test material loss in each dimension and complete non-material/compatible changes.
- Test new successful revalidation and missing/failed/incomplete revalidation; complete bounded rebinding and missing/incomplete rebinding; old approval cannot prove current authority or acceptance.
- Test complete undecidable materiality versus each missing mandatory input, explicit bounded non-support versus historically supported loss, and prohibition > conflict > stale > missing with retained diagnostics.
- Test wrong-context joins across subject/revision/scope/path/facet/times/policy/dependencies/environment/history/event/registry; incomparable records; comparable opposing witnesses; permutation invariance; no favorable selection.
- Test forged/copied/serialized private findings, frozen mutation, no-finding/invalid-finding historical equality, preserved requirement unions and name collisions; temporal support alone cannot establish authority or continuity.
- Preserve historical bytes/events/authority records and explicit evaluation/reliance times. Recompute new private handles without creating a new real-world event.
- Retain every canonical control in section 9; at exit compare all 37 T cases and cross-gap temporal assertions. Retain explicit incomplete-evidence gaps, not false full-conformance claims.
- Preserve T1-01/02/03/04, all 603 Core probes, four accepted T2 hashes and their evidence/source boundaries. Run the card's R-EAK, R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME commands from plan section 2 before/after actual implementation.
- Verify unchanged public JSON/Markdown/HTML/index/verdict bytes, parser/validator rejection behavior, reason values/order, CLI/SDK/exports/default callers, licensing and deny 25. Assert `PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`, `NEW_REGRESSION = 0`.
- Require three deterministic product replays with identical result hashes and serialized outputs; corrupted-expectation/dropped-binding/false-positive comparator falsifiers must fail. Unexpected exceptions are ERROR.
- Capture actual pre-change HEAD/rollback, before/after observations, source/input/method/oracle versions and digests, exact cases/assertions, commands/exits, remaining gaps and allowlist diff under change control. No implementation pre-change HEAD is designated by this blocked entry.

The later sequence is a separate bounded scope decision first, refreshed implementation entry second, then initial implementation, hardening and final evidence acceptance. No merge, release or public V8 promotion is authorized here. Neither missing private layout nor compact historical fixtures justifies specification reopen; a demonstrated contradiction would require the separate formal process.

Compatibility review: audit output/verdict/exit unchanged; deny 25 unchanged; permit behavior unchanged; classify behavior unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. No public schema/JSON/report, reason code, license/offline authority, installation/demo or commercial-surface change. No control-plane, dashboard, orchestration or runtime takeover. This documentation decision preserves v7.0.1 and frozen external-review history.

## 12. Planning hygiene and disposition

Only `docs/planning/v8-gate1-t2-05-implementation-entry-v0.1.md` is changed. Run only planning hygiene (`git diff --check`, `git diff --name-only`, `git status --short`, including staged diff forms for this new file); no implementation suites. Commit only this dossier with `Record blocked T2-05 implementation entry`. Report the actual commit externally as `T2_05_BLOCKED_ENTRY_COMMIT`; no self-referential hash or implementation pre-change HEAD is created.

```text
T2-05 IMPLEMENTATION NOT STARTED
G07 OPEN
G06 NOT STARTED
G03 NOT STARTED
G05 CLOSED
T2-04 CLOSED / EVIDENCE CLOSED
```

IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
