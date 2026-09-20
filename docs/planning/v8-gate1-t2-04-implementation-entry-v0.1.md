# T2-04 Explicit Reliance-Time Applicability — Implementation Entry Dossier v0.1

Date: 2026-09-21. Task: T2-04 / Tranche 2 / G07. Documentation-only entry review; implementation is not admitted by this dossier.

## 1. Checkpoint and authority

Verified before source inspection:

```text
repository = mindforge-guard
branch = planning/v8-gate1-tranche2-g07-v0.1
starting_HEAD = 3dbb66d5c0adef020657185b5bd2b710b04d8b9c
git_status_short = empty (CLEAN)
planning_result = G07_IMPLEMENTATION_PLANNING_READY_WITH_BLOCKERS
```

The starting HEAD is the known-good planning rollback reference, not a newly admitted implementation pre-change HEAD. V8-000, Tranche 1, T2-01/02/03, G05 and the accepted G07 decomposition are not reopened. G05 remains CLOSED; G07 remains OPEN. Historical specification status paragraphs retain their original phase context.

Authoritative sources, read only for this task:

- [Canonical T2-04 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-04---explicit-reliance-time-applicability), section 3 common requirements and section 2 compatibility/verification requirements; adjacent T2-05 card only for ownership separation.
- [ADR 0015 / B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md), time/basis, dimensions and state selection; [B07 controls](../validation/v8-b07-temporal-standing-cases-v0.1.md).
- [ADR 0011 / B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), binding union, six states and path-scoped precedence.
- [ADR 0010 / B01](../adr/0010-mesr-canonical-id-relation-and-admission-contract.md), pinned identity and explicit supersession; [ADR 0013 / B05](../adr/0013-independent-verification-and-integrity-evidence-contract.md), only historical event/integrity/independence/custody joins.
- [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md).
- [Core registry](../../packages/guard-core/src/mesr/coreRegistry.ts), [canonical state owner](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), protected [claimState.ts](../../packages/guard-core/src/mesr/repaired/claimState.ts), [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts) and [contracts.ts](../../packages/guard-core/src/mesr/repaired/contracts.ts).
- [Legacy timestamp validator](../../packages/guard-core/src/mesr/temporalBasis.ts); [existing independence handoff](../../packages/guard-core/src/mesr/repaired/independence.ts) and [accepted T2-03 entry joins](v8-gate1-t2-03-implementation-entry-v0.1.md#5-retained-witness-model-and-deterministic-joins), solely as private integration precedent.
- Frozen [cases](../../tests/fixtures/experiment-3-repaired/cases.v0.2.json), [oracle](../../tests/fixtures/experiment-3-repaired/oracle.v0.2.json) and [hardening controls](../../tests/fixtures/experiment-3-repaired/admission-hardening.v0.1.json): only relevant T rows, T14/T15 ownership contrast, and H11/H12/H13/H34.

## 2. Evaluation subject and facet ownership

Canonical anchor: `mesr.core.temporal.basis@0.1.0`. Existing supported claim: `controlled_basis_status`. Preserve required bindings `produced_observed_or_verified_time`, `basis_valid_at`, `expiry_revocation_or_supersession_refs`, and nonclaims `timeless_validity`, `authority_by_itself`.

T2-04 owns the **temporal applicability portion of the existing bounded request facet `standing.current`**, used at path `current` by its frozen T controls and explicitly recognized on this anchor by `evaluateClaims`. It determines applicability of a preserved basis for an exact subject/revision/scope and explicit reliance instant using recorded knowledge. It does not establish unrestricted current standing across changed contexts.

`standing.current` is a bounded request facet, not a new canonical semantic ID, alias, or replacement for `controlled_basis_status`. `current` is a fixture/request path label, not semantic identity. Path admission remains governed by the existing trust/request envelope.

`authority.current` is a frozen request facet used by T14/T15, not a newly admitted canonical ID or a T2-04 claim. Current-authority rebinding belongs to T2-05; acceptance occurrence/authority remains separate. The T2-05 card and ADR 0015 uniquely establish this ownership. No facet ambiguity remains.

Private derived evaluations are needed for historical-support association, explicit reference times, freshness, interval membership/expiry, effective revocation, admitted successor displacement, snapshot coverage/horizon, comparable status contradictions and missing obligations. These are dimension findings, not additional primary states or standalone canonical claims. Context continuity and rebinding findings are not produced here. A complete temporal finding cannot erase an outstanding continuity obligation or convert fixture `same` labels into product proof.

## 3. Deterministic time and predicate contract

| Time | Retained meaning |
| --- | --- |
| `evaluation_time` | Explicit instant of this bounded evaluation using its recorded knowledge snapshot; retain the exact snapshot identity and coverage. It does not mean the present machine time or snapshot publication time. |
| `reliance_time` | Explicit instant for which applicability is requested. Equality with evaluation_time must be explicitly supplied; no defaulting between them. |
| `event_time` | Occurrence asserted by the original event record. |
| `observed_at` / `verified_at` | Attributed collection/check times, distinct from effective dates and ingestion. The claim-specific rule identifies which one is relevant. |
| `created_at` / `generated_at` | Original artifact creation, never substitutes for evaluation, reliance or verification. |
| `valid_from` / `valid_until` | Original declared validity values; preserve their source and meaning. No automatic rename into effective boundaries. |
| `effective_from` / `effective_until` | Rule-defined applicability boundaries, including subject/scope and endpoint convention. |
| Snapshot coverage/as-of and custody/comparison intervals | Their own knowledge, effective coverage or historical event/comparison domains; not interchangeable with the above instants. |

ADR 0015 requires valid offset timestamps normalized to instants for comparison with raw values retained. The existing temporal validator uses `YYYY-MM-DDTHH:mm:ss`, optional fractional seconds, and `Z` or signed `HH:mm` offset, plus a non-NaN `Date.parse` result. The private owner currently checks an explicit offset suffix and finite `Date.parse`; neither check alone proves applicability. Preserve those existing implementations. A private temporal method must validate usable explicit instants, retain timezone/raw spelling and compare at the precision justified by its admitted method. Ambiguous or unavailable precision/tolerance cannot be silently rounded into a result. No new grace period or tolerance is inferred. This dossier does not replace the historical validator with a stricter public parser.

Missing/ambiguous time, timezone, required interval convention or tolerance is an unresolved obligation (subject to stronger established precedence). No `Date.now()`, implicit current time, network time, generated now or wall-clock fallback is permitted.

| T2-04 predicate | Required evidence and rule |
| --- | --- |
| Freshness | Versioned claim-specific max-age criterion with provenance, relevant observed/verified instant, scope and reliance_time. Exceeding the explicit allowable age proves loss only with preserved historical support. Age without that rule is unresolved. Boundary equality follows the admitted rule; no arbitrary expiry policy is introduced. |
| Validity/expiry | Attributed interval bound to subject/scope and a named endpoint convention. `[effective_from,effective_until)` applies only when the admitted rule explicitly adopts it; other explicit conventions retain their meaning. End-exclusive equality is outside; one millisecond before the frozen T02 endpoint is inside. Missing endpoint evidence does not imply infinite validity. |
| Revocation | Retained attributable status/revocation witness, issuer competence/scope evidence, subject, effective instant, source snapshot and coverage. Only revocation effective for the requested reliance context proves loss. Later revocation does not stale earlier reliance (T17); out-of-scope revocation cannot apply. |
| Supersession | B01 admitted predecessor/successor IDs, versions and digests, explicit effective displacement rule, rationale and compatibility limits. Successor existence or a version difference alone cannot displace the predecessor. Missing necessary rule/witness is unresolved; historical resolution is preserved. |
| Snapshot completeness | Publisher/source, covered subjects and status categories, as-of time, effective periods, completeness claims and omissions under a named method. No record in an incomplete snapshot is not a non-revocation fact. A boolean label alone does not establish coverage. |
| Snapshot horizon | Reliance must be covered by the available snapshot or a separately evidenced prospective validity rule. Later-than-horizon reliance without that rule is unresolved; a prospective result cannot guarantee absence of later revocation. Endpoint meaning remains source-defined. |
| Applicable criterion | Method/policy ID, version, provenance, scope, time applicability and required inputs must be retained and satisfied; no reference-only criterion or undeclared fallback. |

Preserve distinct expiry, revocation and supersession reasons in dimension evidence even if the selected state shares `APPLICABILITY_LOST`. Do not collapse them to timeout.

The following remain explicit non-equivalences: age alone != stale; missing expiry != permanent validity; successor existence != displacement; version difference != material applicability loss; timestamp presence != current applicability; deterministic replay != temporal continuity. Policy version pinning for a temporal rule is T2-04; determining compatibility/materiality between changed policies is T2-05.

## 4. Exact STALE and state mappings

STALE requires **preserved historically supported basis plus proven applicability loss for the requested reliance context**. Historical support must be grounded in retained bound evidence, not a caller `historical_support: true` or serialized `SUPPORTED` label. It does not assert that history was false.

The sole canonical selector remains in `evaluateClaim.ts`. Its implemented order is prohibition, conflict, stale, missing, completed negative, complete undecidable, complete positive, otherwise unresolved. Preserve that order and every diagnostic; do not rewrite the selector to match an informal ordering of the terminal categories.

| Established basis | Canonical result and qualification |
| --- | --- |
| Applicable Core inference prohibition | `UNSUPPORTED` for that evidence path; retain other diagnostics and separately bound paths. Temporal evidence never proves `authority_by_itself` or timeless validity. |
| Comparable admissible contradictory current evidence | `CONFLICTED`: same predicate, subject/revision, scope and applicable time; retain both records and criterion. An older approval and later revocation alone are not contradictory. |
| Historical support plus proven expiry, effective revocation, freshness loss or admitted successor displacement | `STALE`, unless a stronger prohibition/conflict applies. Retain collateral missing obligations, including T20 dependency continuity. |
| Missing currentness, evaluation/reliance time, applicable rule, required historical/supersession witness or coverage | `UNRESOLVED` unless a stronger established blocker applies. Missing evidence is not completed non-support. |
| Complete admitted positive applicability evidence with all required bindings/parts satisfied | `SUPPORTED` only for its bounded path/basis. Temporal success cannot satisfy deferred continuity, authority or acceptance parts. |
| Complete bounded method establishes non-support | `UNSUPPORTED` under the named criterion, without a world-falsity assertion. |
| Complete applicable inputs, admitted method completes unable to decide | `INCONCLUSIVE`; missing mandatory inputs instead give `UNRESOLVED`. A caller undecidable label does not prove method completion. |

Never-valid and not-yet-effective evidence does not acquire historical support: completed exclusion under the admitted criterion can be UNSUPPORTED (T26.complete); missing interval rule or necessary basis remains UNRESOLVED (T26.missing). Neither is STALE by default. T26.complete's frozen end-exclusive interval begins and ends after reliance; its empty interval supplies no invented formerly valid period. A sole bound negative fact is not automatically a contradiction. No seventh state or selector copy is permitted.

## 5. Minimum retained witnesses and deterministic joins

Use explicitly supplied offline evidence only. This is a private evidence model, not a public schema. ADR 0015's `temporal-standing-evaluation/0.1` identifies the auxiliary contract; it does not authorize new pack fields or canonical IDs.

Retain:

- Historical basis record and canonical ID/version/digest, historical subject revision/scope, result and original provenance; registry version/digest, module lock and method/version. A reference must resolve to the supplied record/representation.
- Raw temporal values and their attributed source, normalized comparison instants, interval convention, rule/method/policy versions and digests, applicable claim/scope, max-age/validity criterion and limitations.
- Revocation witness with issuer scope/competence, effective time and snapshot association; supersession witness with admitted predecessor/successor identity/version/digest and effective displacement rule, rationale and limits.
- Snapshot publisher/source, retained contents, as-of/effective periods, covered subjects/status categories, completeness basis, horizon, prospective rule if used, limitations and omissions.
- Required historical verification event/result, exact-byte comparison and independence/custody records, with their separate original times, criteria, results, intervals and limitations. Require these only when the particular claim's historical basis requires them.
- All dimension facts, applied nonclaims, ignored/mismatched evidence and named missing obligations; no favorable-record selection or erasure of contradictory candidates.

`reference != retained witness`; `URI != retained evidence`; `timestamp != applicability`; declared expiry != automatically verified expiry; missing supersession evidence != proof of no supersession. Retained attribution does not authenticate real-world truth.

| Join | Required binding |
| --- | --- |
| Canonical subject / revision / scope | Exact historical and requested identity and scope; retain canonical entry/version/digest, registry and module basis. A wrong subject/revision/scope witness cannot discharge an obligation. No equivalence/rebinding inference. |
| Facet / path | Exact admitted request path, `standing.current`, temporal anchor/version, requirement context and evidence basis. No transfer to authority or acceptance. |
| Reference times | Bind finding to both explicit evaluation_time and reliance_time and the exact knowledge snapshot. Compare normalized instants only under the retained rules; do not require unrelated event and evaluation timestamps to be equal. |
| Historical verification | Retain occurrence/result references, namespace, event_id, checked property, method/version/criterion, exact result and input/output records. Verification at T0 does not establish applicability at reliance_time. |
| Historical exact bytes, when required | Bind event input/output to the retained member namespace/reference and representation/byte domain. Preserve byte count, algorithm, attributed expected source/digest, actual comparison/recomputed digest, checker/method/time and result. A copied receipt or digest label is insufficient. |
| Historical independence/custody, when required | Bind actual producer/executor/verifier, separation/custody criterion and retained records to that event and member/representation; preserve captured custody intervals and limitations. Current use is evaluated separately from historical independence. |
| Rule / snapshot / validity | Match exact policy/method version, source scope, historical basis and effective/reliance context; retain coverage category/completeness/horizon. Wrong time/rule/version evidence remains inapplicable, not a fallback source. |

Fresh private receipt/finding consumption must retain each accepted module's original input/path/context checks; do not replay historical evidence through a fabricated new event time. Serialized historical findings may be retained as records but cannot substitute for retained facts and valid product evaluation. Deterministic recomputation from unchanged supplied history does not rewrite history or perform new real-world verification.

### Frozen evidence limitation

Inspected T02.before's ledger contains only `fixture:change` and `fixture:test-output`. `fixture:historical` is a reference/digest/state/time record; the named offline snapshot has no retained status inventory, covered categories or fully attributed historical support/rule witness. T22.rule adds `max_age_ms: 1000` without a retained versioned rule source. T05/T06 likewise name a successor/displacement without the complete B01 admission witness.

These frozen hypothetical cases and expectations remain unchanged. Do not manufacture their missing witnesses in the shared translator or read an expected state into product input. Later product comparison must record unresolved/mismatching obligations explicitly; no whole-case PASS or G07 closure can be inferred from a temporal slice. New separately identified T02/T17/T22-style supplemental controls may supply literal, attributed records and complete joins under the existing ADR requirements. They establish new hypothetical supplied-fact evidence, not retroactive repair of B09. No such control is created here. This is a known frozen-input coverage limitation; the ADRs define the minimum witness model sufficiently, so it is not an undefined evidence-model blocker or specification contradiction.

## 6. Historical and deferred boundaries

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
```

These are accepted historical hashes, preserved here, not fresh replay claims.

- T2-01 retains attributable historical verification occurrence/result; no rewriting what occurred, pass/fail/inconclusive or event time.
- T2-02 retains exact-byte integrity comparison. Same bytes != current standing. Byte identity is required for the particular artifact-bound historical reliance or B05 custody/check criterion, not an invented universal byte-comparison gate. Subject equivalence/rebinding is deferred.
- T2-03 retains captured event-scoped independence/custody. Historically independent != currently applicable independence basis. Relevant temporal applicability may be evaluated without changing the old findings or separation/custody methods.
- `T2-05 = BLOCKED_BY_SEQUENCE_UNTIL_T2-04_CLOSED`. Defer context continuity, subject equivalence/rebinding, scope compatibility beyond exact T2-04 temporal binding, environment materiality, policy/dependency continuity, new revalidation and authority rebinding. No `continuity.ts`, T2-05 fixtures or evidence. T20 retains a missing-continuity diagnostic without implementing continuity.
- G06 remains OPEN / `DEFERRED_TO_G06`: no profile-bound sufficiency, outward immutable-report association or report association. T2-04 does not depend on G06.
- G03 remains OPEN / `DEFERRED_TO_G03`: no Harness mapping, canonical EvidencePack creation, producer integration or ingestion layer. Explicit admitted offline evidence is sufficient for this bounded method.

## 7. Canonical state owner and scope decision

Static inspection of `evaluateClaim.ts` at the starting HEAD establishes:

1. `evaluateClaims` rechecks admission and binding collection; `requirements.ts` unions Core/context/caller obligations. Contexts can add requirements but cannot remove currentness or supply results.
2. The `standing.current` branch on `mesr.core.temporal.basis` unconditionally adds `currentness`. Existing optional arguments admit only T2-02 integrity and T2-03 independence findings for their own facets. No T2-04 private finding reader exists.
3. The generic `bound-applicability-loss/0.1` primitive can add stale evidence from bound historical/current boolean records at the evaluation instant; it still retains currentness, and does not implement separate reliance time, rules, revocation, supersession or snapshot coverage. It cannot supply the complete T2-04 positive/non-support/undecidable route.
4. `selectClaimState` is local. Owner-produced immutable children are registered in a private WeakSet for composite evaluation. `claimState.ts` contains constants/types, not an alternate selector API.
5. `contracts.ts` supplies structural shape checks, not witness satisfaction. Its private claims envelope and a separate private module argument can carry retained data without editing protected contracts. The existing temporal shape, including H controls, stays unchanged. Private dimension validation can live wholly in the new module.

The seven candidate implementation paths are exactly:

```text
packages/guard-core/src/mesr/repaired/temporalApplicability.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-04-controls.v0.1.json
tests/fixtures/gate1/t2-04-results.v0.1.json
docs/validation/v8-gate1-t2-04-evidence-v0.1.md
```

**Seven-path scope sufficient: NO.** The minimum additional candidate is exactly:

```text
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
```

Only a separately reviewed scope decision may admit a narrow private T2-04 intake there. No authorization is granted here. No additional protected path is currently necessary: `claimState.ts`, `requirements.ts`, `contracts.ts`, Core registry, accepted T2 modules and public callers stay protected. If implementation later requires any other protected path, identify the first and stop; do not progressively widen the allowlist.

### Candidate handoff, not implementation

```text
retained temporal witnesses
  -> temporalApplicability.ts
  -> private immutable context-bound applicability finding
  -> existing canonical state owner
```

The private module derives dimension facts and missing obligations, never a caller-authored primary state. Follow the accepted process-local finding precedent: opaque identity retained in a module-private WeakMap, deeply immutable retained evidence, and a reader that validates exact input/evidence, core/trust admission, collected requirements, contexts and request path. Bind both reference times, revision/scope, historical identity/digest, rule/policy versions and snapshot contents. JSON copies, forged lookalikes, mutation, cross-path or cross-context substitutions cannot acquire finding authority. Deterministic replays derive new valid private handles from the same supplied facts; serialized handles are inert.

If separately admitted, the owner consumes only authenticated dimension findings for the exact temporal facet, retains all pre-existing obligations and stronger blockers, and replaces only its own generic currentness placeholder with the actual temporal findings/missing obligations. A merely present handle must not clear currentness; temporal completion must not clear continuity or other binding failures. Existing selector and result registration stay unique.

Reject a second selector, copied `selectClaimState`, hand-written canonical states, fixture-defined current state, test-side semantic decisions, caller-authored generic `StateBasis` injection, rewriting historical results into current results, historical timestamp mutation, or automatic renewal. Private finding authority != real-world temporal truth; private finding authority != authority; current standing != institutional acceptance; current standing != execution permission.

## 8. Later acceptance controls, frozen here but not implemented

| Controls | Required later assertion |
| --- | --- |
| T02.before / T02.at | Complete bound positive versus end-exclusive proven expiry; retain all other obligations and exact raw endpoint. |
| T17 | Later effective revocation does not stale earlier reliance; support requires the complete earlier basis. |
| T01 / T03 / T04 | Missing currentness unresolved; effective competent scoped revocation stale with history; incomplete snapshot unresolved. |
| T05 / T06 | Successor alone unresolved; admitted effective displacement stale with history and distinct reason. |
| T18.evaluation_time / T18.reliance_time | Missing named instant unresolved; creation-time substitution forbidden. |
| T19 / T20 | Comparable current contradiction conflicted; proven expiry stale while retaining `continuity.dependency` missing diagnostic. |
| T22.rule / T22.absent | Explicit max-age loss stale with history; same age without rule unresolved. |
| T23 | Beyond snapshot horizon without prospective basis unresolved. |
| T24.timezone / T24.interval | Ambiguous timezone/missing convention unresolved; preserve raw values. |
| T26.complete / T26.missing | Complete not-yet-effective exclusion unsupported; missing rule unresolved; neither manufactures stale history. |
| T25.equal / T25.earlier | Legacy TIME_WINDOW_EXPIRED still tests end_at strictly earlier than pack.created_at, with existing endpoint-presence requirements; equality unchanged. |
| H11 / H12 / H13 / H34 | Respectively string snapshot.complete, array continuity.subject, removed effective_until and string historical_support remain structural REJECTED controls. H12 does not authorize continuity implementation. |

Add separately attributed supplemental falsifiers for age-only stale; missing-expiry permanent-validity; successor-without-displacement; version-only material loss; missing reliance_time/rule/coverage; wrong subject/revision/scope/evaluation or reliance time; wrong policy/rule version; out-of-scope revocation; never-valid/not-yet-effective evidence; same-context contradictory witnesses; complete undecidable temporal method versus missing input; forged/cloned/mutated/cross-context private handles; historical rewrite; implicit clock. Include stronger prohibition/conflict precedence over stale, and stale over missing collateral data. Retain expiry/revocation/supersession separately.

Future comparisons must enumerate owned fields: requested path/facet, state where its whole required basis is established, raw/normalized times, applied rule/snapshot provenance, dimension reasons, missing bindings, nonclaims, contradictions, historical references and unchanged source values. Shared translators only translate/serialize/compare; they cannot manufacture witness facts or decide semantics. Missing frozen evidence and T2-05-owned assertions remain named gaps, not dropped assertions or claimed PASS. Supplemental controls have distinct IDs/provenance and cannot overwrite frozen expectations. T21's continuity evaluation remains T2-05; the generic B02 complete-undecidable distinction is tested only within the T2-04 temporal method.

Later implementation requires the card's R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME baseline/after suites, default-off/import and no-mutation controls, exact legacy byte/verdict controls, accepted T2-01/02/03 result-hash preservation, and deterministic product replay evidence under change control. No implementation suites are run in this dossier task.

Retain B09 anchors from change control: `B09_COMMIT = a646f2b4576336321eda696c7dc2ee02749cadb2`; oracle 0.2.0 hash `6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88`; historical result hash `49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560`. These are source-recorded anchors, not newly measured hashes. A later admitted task must capture actual pre-change HEAD, source/artifact digests, before-result, exact commands/exits, byte domains and worktree/Git persistence; never use this static review as executed conformance.

## 9. Compatibility, hygiene and disposition

Only this dossier may change. Audit output/verdict/exit unchanged; deny exit 25 unchanged; permit and classify unchanged. Recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. EvidencePackV1/parser/validator, 56 reason values/order/emitters, GovernanceReportModel/renderers/JSON and dispositions, public CLI/SDK/exports, Node/install/demo, licensing/offline authority, existing MESR/EAK relations and v7.0.1 commercial behavior remain unchanged. No control-plane, dashboard, orchestration or main-path takeover. No frozen B00-B09 or external-review artifacts are edited.

Planning hygiene is limited to `git diff --check`, `git diff --name-only`, and `git status --short`. Ordinary diff omits an untracked file; status must show exactly this dossier before staging. No product source, verifier or fixtures are changed. Commit only this dossier as blocker evidence using `Record blocked T2-04 implementation entry`; report its actual resulting hash as `T2_04_BLOCKED_ENTRY_COMMIT`. Do not create `T2_04_IMPLEMENTATION_PRE_CHANGE_HEAD`. No merge, tag, release or implementation follows.

Facet ownership and the minimum evidence semantics are sufficiently determined. The remaining entry blocker is the unadmitted canonical-owner intake path. A separate bounded scope decision is required before implementation. T2-04 implementation NOT STARTED; T2-05 NOT STARTED; G06 NOT STARTED; G03 NOT STARTED; G05 CLOSED; G07 OPEN.

IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
