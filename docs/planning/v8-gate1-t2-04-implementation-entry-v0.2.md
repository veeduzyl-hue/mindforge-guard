# T2-04 Implementation Entry Refresh v0.2

Date: 2026-09-21. Documentation-only entry refresh; no product implementation or implementation suites.

## 1. Checkpoint and resolved delta

```text
branch = planning/v8-gate1-tranche2-g07-v0.1
starting_HEAD = 5e2960a0f563c7fb70b567e51f7683132dc4e1b4
starting_worktree = CLEAN
T2_04_BLOCKED_ENTRY_COMMIT = d24144afc4b595e5b8c764c34f2f1e6bc8fa3217
T2_04_SCOPE_EXPANSION_DECISION_COMMIT = 5e2960a0f563c7fb70b567e51f7683132dc4e1b4
v0.1 blocker = no authorized canonical state-owner intake for completed T2-04 applicability findings
blocker resolution = T2_04_BOUNDED_SCOPE_EXPANSION_APPROVED
newly admitted product path = packages/guard-core/src/mesr/repaired/evaluateClaim.ts
```

The [v0.1 blocked entry](v8-gate1-t2-04-implementation-entry-v0.1.md) remains immutable historical evidence. This delta applies the accepted [scope decision](v8-gate1-t2-04-scope-expansion-decision-v0.1.md); it does not reopen either document, the [canonical T2-04 card](21_GATE1_IMPLEMENTATION_PLAN.md#t2-04---explicit-reliance-time-applicability), V8-000, Tranche 1, T2-01/02/03, G05 or G07 decomposition. Frozen semantics remain [ADR 0015 / B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md) and [ADR 0011 / B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md).

Source inspection of [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts) confirms an existing branch-local `currentness` placeholder, private selector, factual arrays, optional private T2-02/03 inputs and owner-registered immutable results. Adding the bounded intake there resolves the sole entry blocker. The accepted ledger-based retained witness construction needs no protected contract change. `temporalApplicability.ts` does not exist at this checkpoint and is not created here. This is source-level implementation feasibility, not executed conformance.

## 2. Exact later implementation scope

Exactly eight paths are authorized for later implementation:

```text
packages/guard-core/src/mesr/repaired/temporalApplicability.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-04-controls.v0.1.json
tests/fixtures/gate1/t2-04-results.v0.1.json
docs/validation/v8-gate1-t2-04-evidence-v0.1.md
```

No ninth path is authorized. All other paths remain protected, especially repaired `claimState.ts`, `requirements.ts`, `contracts.ts`, `admission.ts`, `canonicalBytes.ts`, `composition.ts`, `verificationEvent.ts`, `integrity.ts`, `independence.ts`, `continuity.ts`; Core registry/supports/boundaries/aliases; reason codes/bindings; EvidencePackV1/parser/validator; GovernanceReportModel/reports/renderers; public CLI/SDK/package exports; licensing/offline authority; package/version files; T1 evidence; T2-01/02/03 implementation/evidence; frozen B09 and external-review history.

If another protected path becomes necessary, stop with `T2_04_IMPLEMENTATION_ENTRY_BLOCKED_BY_ADDITIONAL_SCOPE`; this refresh grants no further expansion. Only this v0.2 document changes in the present task.

## 3. Owned facet, reference times and predicates

T2-04 owns only **reliance-time temporal applicability for `standing.current` on `mesr.core.temporal.basis@0.1.0`**, bound to the exact admitted request path. It creates no canonical ID, alias or Core support. `authority.current`, `institutional.acceptance` and `acceptance.decision_occurred` remain outside T2-04.

`evaluation_time != reliance_time` as semantic roles:

- `evaluation_time` = explicit evaluation instant against the recorded knowledge snapshot.
- `reliance_time` = explicit requested applicability instant.

Both are explicitly supplied and independently bound. Equal values require explicit supply. No `Date.now()`, implicit current time, network time, generated now, creation-time substitution or fallback in either direction. Retain raw attributed timestamp spelling and compare normalized instants only through the admitted deterministic method, precision and interval convention. No inferred rounding, grace period or tolerance; missing/ambiguous required time or convention remains unresolved under existing precedence.

The accepted predicate set is only claim-specific freshness; validity interval/endpoint convention; effective scoped revocation; admitted successor displacement; snapshot completeness; snapshot horizon; applicable temporal rule/criterion version. Preserve v0.1's retained witness requirements and distinct freshness/expiry/revocation/displacement reasons. Age requires an applicable versioned max-age criterion; missing expiry is not permanence; successor/version labels are not displacement; an incomplete snapshot cannot prove absence; horizon extension requires an explicit retained prospective rule. Exact binding and temporal-rule version pinning do not establish continuity across changed context.

## 4. Private handoff, creation authority and context

```text
explicit retained admitted temporal witnesses
  -> temporalApplicability.ts
  -> private immutable context-bound T2-04 applicability finding
  -> evaluateClaim.ts
  -> existing factual basis arrays
  -> existing private selectClaimState
  -> existing canonical result owner
```

Use a separate module-private WeakMap with deeply immutable retained evidence and exact context-checking reader, following the accepted process-local mechanism. Only actual product-side T2-04 evaluation over retained admitted witnesses may register a valid finding. Validate JSON before traversal; derive dimension facts and named missing obligations, not canonical primary states. A valid partial finding authenticates origin, not completion.

Plain fabricated, copied, serialized/deserialized or forged objects cannot acquire identity. Mutation cannot alter frozen facts; changed input/context invalidates consumption. Fixture expected state, caller `stale=true`, `current=true`, `historical_support=true`, caller StateBasis arrays, reference-only labels and timestamp-only labels remain inert as T2-04 proof. The finding is not a public schema, EvidencePack field, canonical semantic object, public serialized contract, caller-authored StateBasis or new primary state. Private finding authority != real-world truth, authority, institutional acceptance or execution permission.

Bind full retained input/core/trust/contexts/collected requirements, including, as applicable:

- Requested facet/path; canonical identity/version/digest; registry/module basis and locks; subject, revision, scope; independently supplied evaluation_time and reliance_time; requirement context.
- Historical basis identity/support evidence, original event/result, times and provenance; required T2-02 member/comparison records, original context, representation/byte domain and limitations; required T2-03 independence/custody/check evidence, original context, criteria, intervals and limitations.
- Freshness rule; interval rule/convention; revocation witness; admitted successor/displacement witness; snapshot contents, source/publisher, coverage/completeness/horizon and prospective rule if used; criterion/policy ID/version, provenance, limitations and omissions.

Wrong-context reuse cannot discharge obligations. A digest/reference alone is not validated evidence. Serializable retained witnesses use the existing private ledger construction; required process-local T2-02/03 handles arrive separately and are checked using their unchanged readers and original contexts before exact historical association. Recompute handles from unchanged retained evidence when necessary, without a new real-world check, fabricated current event or rewritten timestamp. Do not genericize either historical channel. No public schema is authorized.

## 5. Sole state owner and exact state semantics

`evaluateClaim.ts` remains the sole canonical state owner. A trailing optional private T2-04 input preserves existing argument positions. Recheck admission/collection unchanged; at the exact facet/anchor branch, authenticate the finding and project only evaluated dimension facts into existing arrays. Resolve only the branch-local generic `currentness` basis actually proved; incomplete findings retain named obligations. Never delete pre-existing missing strings by name: a collected Core/caller/context `currentness` obligation is independent. Preserve Core requirements, caller/context requirements, continuity, authority, acceptance and all other missing bindings. Temporal completion does not satisfy T2-05 continuity.

For a path consuming a valid T2-04 finding, isolate the legacy `bound-applicability-loss/0.1` boolean route locally so it cannot independently manufacture T2-04 stale facts. Retain submitted records/diagnostics and all other applicable prohibitions/conflicts. With no valid finding, retain that legacy route exactly. Do not synthesize its booleans from fixture expectations.

No selector export/copy, second canonical evaluator, seventh state, precedence change, admission change, requirement-union change, generic caller-authored StateBasis injection or fixture-defined semantics. Preserve owner freezing/registration and composite consumption.

**Exact STALE rule: preserved historical support + proven applicability loss for the requested reliance context -> STALE.** Age, missing expiry, successor existence, version difference, timestamp presence and missing currentness evidence alone cannot yield STALE. Never-valid/not-yet-effective evidence is not automatically stale. Historical support itself requires retained bound evidence.

Preserve the implemented selector order and all diagnostics:

| Existing basis, in precedence order | Result |
| --- | --- |
| Applicable Core inference prohibition | `UNSUPPORTED` for that path |
| Comparable admissible contradictory current evidence | `CONFLICTED` |
| Preserved historical support plus proven applicability loss | `STALE` |
| Missing temporal/currentness or other necessary basis | `UNRESOLVED` |
| Complete bounded temporal non-support | `UNSUPPORTED` |
| Complete applicable method unable to decide | `INCONCLUSIVE` |
| Complete positive applicability with every required obligation satisfied | `SUPPORTED` |
| Otherwise | `UNRESOLVED` |

Prohibition/conflict precedes stale; stale precedes collateral missing diagnostics, which remain retained. An older approval and later effective revocation alone are not contradictory. Complete not-yet-effective exclusion can be UNSUPPORTED; missing rule remains UNRESOLVED, never invented historical validity. Support remains bounded and does not imply authority, acceptance or execution permission.

## 6. Default-off and historical/deferred boundaries

**NO valid T2-04 private finding = EXACT existing product behavior.** Module existence/import alone has zero semantic effect. Absent/invalid/wrong-context handles use the old route. No eager evaluation, new default caller, public export or serialized contract change.

Frozen incomplete T02/T05/T06/T22 inputs remain incomplete. Compact references and oracle states cannot acquire retained witnesses through translators. New complete controls are separately identified NEW task-specific evidence, not historical repairs. Retain frozen missing/mismatching obligations; do not drop assertions or infer whole-case PASS/G07 closure.

Accepted historical hashes, preserved but not remeasured here:

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
```

- T2-01 remains historical occurrence/result; no event/result/time rewrite.
- T2-02 remains exact-byte comparison: same bytes != current standing. Its private receipt channel stays unchanged and is not genericized.
- T2-03 remains historical/event-scoped independence/custody: historically independent != currently applicable independence basis. Its private finding channel stays unchanged and is not genericized.
- `T2-05 = BLOCKED_BY_SEQUENCE_UNTIL_T2-04_CLOSED`: no context continuity, subject equivalence/rebinding, scope compatibility across changed context, environment materiality, policy/dependency continuity, new revalidation, authority.current or current-authority rebinding. No continuity.ts or T2-05 fixtures/results/evidence.
- `G06 = DEFERRED_TO_G06`: no profile-bound sufficiency, report association or outward immutable-report association; not a T2-04 dependency.
- `G03 = DEFERRED_TO_G03`: no Harness mapping, canonical EvidencePack creation, producer integration or new ingestion layer. Explicit admitted offline evidence suffices for bounded evaluation.

Audit output/verdict/exit unchanged; deny exit 25 unchanged; permit/classify unchanged. Recommendation-only, additive-only, non-executing, default-off, no authority scope expansion. Public v7.0.1 contracts, licensing/offline authority, install/demo and protected surfaces remain unchanged. No control-plane, dashboard, orchestration or main-path takeover.

## 7. Later implementation acceptance controls — not run here

Carry forward the accepted v0.1/scope-decision proof plan and canonical R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME requirements. At minimum:

- Preserve T1-01/02/03/04, all 603 Core probes, the three historical result hashes, and exact historical no-finding outputs. Compare absent/invalid/copied/wrong-context findings and import-only behavior; retain default callers, other facets, no-mutation and public-contract isolation.
- Cover T02.before, T02.at, T17; T01/T03/T04; T05/T06; T18.evaluation_time/T18.reliance_time; T19/T20; T22.rule/T22.absent; T23; T24.timezone/T24.interval; T26.complete/T26.missing. Keep T25.equal/T25.earlier and legacy strict expiry unchanged; H11/H12/H13/H34 remain REJECTED.
- Falsify age-only stale, missing-expiry permanent validity, successor-without-displacement and version-only material loss. Missing reliance_time, temporal rule or snapshot coverage stays unresolved; out-of-scope revocation cannot stale; never-valid/not-yet-effective cannot manufacture stale history.
- Reject wrong-context witness replay; forged/copied/serialized/mutated findings; caller state/boolean shortcuts; timestamp/reference-only proof; implicit clocks and historical rewrites. Check each bound context component and required historical joins.
- Prove valid-finding legacy-route isolation, collected `currentness` name-collision preservation, prohibition/conflict over stale, stale over collateral missing, and complete negative/undecidable/positive versus missing mandatory inputs. Keep T2-05 obligations unresolved as applicable.
- Retain owned field/assertion coverage, frozen B09 anchors/expectations and named remaining gaps. Capture actual baseline/after commands/exits, source/artifact digests, byte domains and persistence evidence; shared scripts translate/compare, never decide product semantics.
- Require `PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`, `NEW_REGRESSION = 0` and three identical deterministic product replays. These are future acceptance obligations, not results of this refresh.

## 8. Entry decision and persistence

The exact eight paths suffice; the private handoff is bounded and unambiguous; no public/canonical contract change is needed; evaluateClaim.ts remains sole state owner; STALE/currentness semantics remain exact; T2-05 remains fully deferred. No additional-scope blocker or actual semantic contradiction was found. Readiness authorizes only the later bounded implementation entry, not a conformance or release PASS.

Planning hygiene: `git diff --check`, `git diff --name-only`, `git status --short`, including staged forms to inspect the new document. Commit only this document once READY. Record the actual resulting commit externally as both `T2_04_IMPLEMENTATION_ENTRY_COMMIT` and `T2_04_IMPLEMENTATION_PRE_CHANGE_HEAD`; the committed entry HEAD is the immutable baseline for later implementation. Do not insert a predicted self-referential hash. Require a clean post-commit status, then stop.

```text
T2-04 IMPLEMENTATION NOT STARTED
T2-05 NOT STARTED
G06 NOT STARTED
G03 NOT STARTED
G05 CLOSED
G07 OPEN
```

T2_04_IMPLEMENTATION_ENTRY_READY
