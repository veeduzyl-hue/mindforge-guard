# T2-04 Bounded State-Integration Scope Expansion Decision v0.1

Date: 2026-09-21. Task: T2-04 / G07. Change-control decision only; no implementation entry readiness or executed conformance is asserted.

## 1. Verified checkpoint and decision boundary

```text
repository = mindforge-guard
branch = planning/v8-gate1-tranche2-g07-v0.1
starting_HEAD = d24144afc4b595e5b8c764c34f2f1e6bc8fa3217
T2_04_BLOCKED_ENTRY_COMMIT = d24144afc4b595e5b8c764c34f2f1e6bc8fa3217
starting_worktree = CLEAN
accepted_entry_decision = IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
```

The checkpoint was checked before substantive source inspection. This task changes only this document. V8-000, Tranche 1, T2-01/02/03, G05, G07 decomposition and the accepted T2-04 entry semantics are not reopened. Previous scope approvals do not authorize this decision.

**Conclusion: adding only `evaluateClaim.ts` to the canonical seven paths is sufficient for the bounded architecture below.** This is a constructive source-level feasibility judgment, not an implementation/test PASS. No other protected semantic path is necessary. The blocked-entry record remains historical; entry is not READY. Next task: **T2-04 Implementation Entry Refresh v0.2**.

## 2. Authoritative proof

Read only the [accepted entry dossier](v8-gate1-t2-04-implementation-entry-v0.1.md), [T2-04 card and its common requirements](21_GATE1_IMPLEMENTATION_PLAN.md#t2-04---explicit-reliance-time-applicability), [ADR 0015 / B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md), [ADR 0011 / B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md), and the source references below. T2-02/03 source is non-authorizing precedent only. Line references describe the verified starting HEAD.

| Source observation | Architectural consequence |
| --- | --- |
| [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts), lines 10-19, 140-150: local selector, existing factual arrays, frozen owner results registered in a private WeakSet | Dimension facts can enter the existing arrays and use the same selector/result registration. No selector export, duplicate, second canonical evaluator or state-type edit is required. Composite consumption retains the same owner-produced children. |
| Same file, lines 33-45: internal optional T2-02/03 arguments; collection rechecked before evaluation; missing facts copied from collected bindings | A trailing optional private T2-04 handle can preserve current argument positions and old calls. It does not bypass collection or require public exports/callers. |
| Same file, line 102: exact temporal-anchor `standing.current` branch adds `currentness` | Replace only this branch-local placeholder operation with authenticated dimension intake; keep the original branch when intake is absent/invalid. The seven paths alone cannot reach this owner. |
| [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts), `collectBindingRequirements`: admission, shape and registry checks; Core/context/caller conjunctive union; reference resolution | Reuse it unchanged at production and consumption. A finding cannot alter requirements, erase collected missing bindings or grant admission. |
| [contracts.ts](../../packages/guard-core/src/mesr/repaired/contracts.ts), `claimOptional.evidence_ledger`, `fields`, claims branch of `inputShapeIssues` | Ledger records require subject/scope but allow nested retained records. A private dossier can carry revision, history, rules, snapshots and joins there. Existing optional temporal shapes remain enforced. No public field or protected schema edit is needed. Private witness validation belongs entirely in the new module. |
| [claimState.ts](../../packages/guard-core/src/mesr/repaired/claimState.ts): six states and factual `StateBasis` arrays | Existing categories already represent prohibition, conflict, loss, missing basis, completed non-support, undecidable method and positive basis. No new primary state or type change is necessary. |
| [independence.ts](../../packages/guard-core/src/mesr/repaired/independence.ts), lines 9-28, 181-197: private WeakMap, immutable evidence, exact input/core/trust/contexts/collection comparison and path check | A separate T2-04 map and reader can authenticate process-local origin plus full context. This reuses a mechanism, not the T2-03 channel or its authority. |
| [integrity.ts](../../packages/guard-core/src/mesr/repaired/integrity.ts), `readIntegrityReceipt`; independence source lines 145-155 | Required historical receipts can be checked against original input/path/contexts and then joined by exact event/member/representation. No generic receipt interface or historical timestamp substitution is required. |

This construction accounts for both product paths: the new temporal module owns private validation and dimension evaluation; the existing owner gains a narrow reader and fact projection. The three authorized scripts invoke/translate/compare; the two new fixtures and evidence document record new task evidence. They do not supply product semantics. It requires no ninth path.

## 3. Exact private handoff and binding

```text
explicit retained admitted temporal witnesses
  -> temporalApplicability.ts
  -> private immutable context-bound temporal applicability finding
  -> evaluateClaim.ts
  -> existing factual basis arrays
  -> existing private selectClaimState
  -> existing canonical result owner
```

Only actual product-side evaluation can register a finding in a module-private WeakMap. Validate JSON before traversal, retain an immutable snapshot of witnesses and derive typed dimension findings under named rules. The new module produces no canonical primary state and accepts no caller-authored StateBasis. A valid partial finding is origin-authenticated evidence, not proof that every dimension is complete.

The reader must check identity and exact retained input/core/trust/contexts/collected-requirements context, including exact requested facet/path and version. Full-content binding must include all of the following; a digest label alone is not witness validation:

- `standing.current`, requested path, `mesr.core.temporal.basis@0.1.0`, canonical identity/version/digest, admitted registry/module basis and locks;
- subject, revision, scope, both explicit reference times and the requirement context;
- historical basis identity and support evidence, original event/result, original event/check times and provenance;
- required T2-02 member/comparison input, context, namespace, representation, byte domain, expected source/digest, actual comparison and limitations;
- required T2-03 event-scoped identity/separation/custody/check evidence, original input/core/trust/contexts/collection, criterion, intervals and limitations;
- freshness/interval rule, revocation evidence, admitted predecessor/successor and displacement witness;
- snapshot contents, publisher/source, coverage categories/periods, completeness evidence, horizon, omissions and any explicit prospective rule;
- applicable rule/policy ID/version, provenance, method, limitations and missing obligations.

The ledger provides the retained serializable dossier; process-local prerequisite handles arrive separately. Read each required T2-02/03 handle using its unchanged original reader and context, then validate the exact historical-to-temporal association. Their authenticated immutable facts are retained in the temporal finding. Do not compare an old handle against a newly fabricated current event, silently replace its context, or accept serialized output as its authority. Recompute private handles from unchanged retained evidence where needed using existing methods; that is offline computation, not new real-world verification. Missing required historical joins remain missing. These joins can live entirely in `temporalApplicability.ts`.

Plain, copied, serialized/deserialized, forged or mutated objects cannot register or recover handle identity. Freeze findings and retained evidence; mutation attempts cannot alter accepted facts, and changed input/context must invalidate the lookup. Wrong subject/revision/scope/path/time/rule/snapshot/requirements cannot discharge an obligation. Fixture expected states, `stale=true`, `current=true`, `historical_support=true`, caller StateBasis, references and timestamp labels are inert as T2-04 proof without admitted retained witnesses and actual product evaluation.

The private finding establishes only that the bounded product evaluator produced those dimension findings. It establishes no real-world truth, institutional authority, acceptance or execution permission. No new public schema or package export is authorized.

## 4. Narrow owner integration and preserved state semantics

T2-04 owns only the temporal portion of `standing.current` on the existing temporal anchor. There is no new canonical ID/alias or Core supports change. `current` is a request-path label, not semantic identity. Do not introduce `authority.current`, `institutional.acceptance` or `acceptance.decision_occurred` into this intake.

At the existing exact branch, authenticate the private finding. With no valid finding, execute the exact old branch. With a valid finding, append its named missing obligations and checked dimension facts to the existing arrays, retaining every collected requirement and exclusion. Omit only the branch-local generic placeholder to the extent replaced by concrete evaluated dimensions; incomplete temporal basis must retain named unresolved obligations. A handle alone is not completion.

Do not remove strings by name from the pre-existing `missing` array. In particular, an independently collected Core/caller/context `currentness` requirement stays missing until satisfied under its original predicate; a temporal finding cannot discharge it by matching its name. Continuity, authority, acceptance and unrelated missing facts remain. Add positive facts only for complete bounded applicability; do not convert partial positives into whole-path support.

The existing `bound-applicability-loss/0.1` loop (owner lines 129-132) is a legacy primitive, not the T2-04 witness method. Never manufacture its boolean records from fixture expectations or temporal labels. For an exact path consuming a valid T2-04 finding, legacy boolean-loss records must not independently populate its T2-04 stale basis: isolate that legacy temporal route locally in `evaluateClaim.ts`, retain submitted records/diagnostics, and require the new retained-witness loss proof. Other applicable prohibitions/conflicts and unrelated missing diagnostics remain. With no valid T2-04 finding, preserve the legacy loop and all historical outputs exactly. This narrow routing guard is inside the same candidate path; it changes neither selector nor admission and does not reopen the accepted entry semantics.

Preserve the six states and the implemented selector order exactly:

```text
applicable prohibition -> UNSUPPORTED
comparable conflict -> CONFLICTED
proven loss of historically supported applicability -> STALE
missing necessary basis -> UNRESOLVED
completed bounded non-support -> UNSUPPORTED
complete unable-to-decide method -> INCONCLUSIVE
complete positive basis -> SUPPORTED
otherwise -> UNRESOLVED
```

STALE requires **preserved historically supported basis + proven applicability loss for the requested context**. Age, missing expiry, successor existence, version difference, timestamp presence and missing currentness evidence cannot establish it. Never-valid/not-yet-effective evidence is not automatically stale; complete exclusion can be UNSUPPORTED, missing criterion UNRESOLVED. Contradiction requires comparable admissible current evidence; an old approval and later effective revocation alone are not contradictory. Preserve prohibition/conflict over stale and stale over collateral missing diagnostics, with all diagnostics retained.

## 5. Deterministic temporal scope

`evaluation_time` is the explicit evaluation instant against the recorded knowledge snapshot. `reliance_time` is the explicit requested applicability instant. Bind both independently; equality must be explicit. Retain raw offset timestamps and normalized instants under the admitted precision/endpoint rule. No `Date.now()`, implicit current time, network time, generated now or fallback in either direction. Missing or ambiguous required time/rule/precision remains unresolved under existing precedence.

Allowed dimensions: claim-specific freshness; validity interval/endpoint convention; effective scoped revocation; admitted successor displacement; snapshot completeness; snapshot horizon; applicable temporal rule/policy version. Missing expiry does not imply permanence; incomplete snapshots cannot prove absence; successor/version labels cannot prove displacement; horizon extension needs an explicit retained prospective rule. Keep freshness, expiry, revocation and displacement reasons distinct.

T2-05 retains subject equivalence/rebinding, context/scope continuity, environment materiality, policy compatibility across change, dependency continuity, new revalidation and current-authority rebinding. T2-04 performs exact binding and temporal-rule version pinning only. Required deferred obligations remain diagnostic; no `continuity.ts` or temporal completion of those obligations.

## 6. Default-off, historical and public preservation

**NO valid T2-04 private finding = EXACT existing product behavior.** Module existence/import alone changes nothing; no eager computation, new default caller, output field or public export. Invalid or wrong-context handles follow the existing no-finding route. Historical B09 input translation must not acquire witnesses from compact labels or expected states. Frozen T02/T05/T06/T22 incomplete evidence remains incomplete; separately attributed supplemental controls are NEW evidence, not historical repairs or whole-case closure.

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
```

These accepted hashes are preserved, not freshly measured here. T2-01 remains historical attributable verification occurrence/result, with event time unchanged. T2-02 remains exact-byte integrity comparison: same bytes != current standing; no `integrity.ts` edit or receipt genericization. T2-03 remains historical/event-scoped independence and custody: historically independent != currently applicable independence basis; no `independence.ts` edit or channel genericization. Historical immutable evidence, Experiment 2B and frozen B09 remain unchanged.

Audit output/verdict/exit unchanged; deny exit 25 unchanged; permit and classify unchanged. Recommendation-only, additive-only, non-executing, default-off, no authority scope expansion. Preserve v7.0.1 commercial behavior, EvidencePackV1/parser/validator, all reason values/order/emitters/bindings, report JSON/dispositions/renderers, public CLI/SDK, licensing/offline authority, install/demo and existing MESR/EAK surfaces. No control-plane, dashboard, orchestration or main-path takeover. This documentation review executes no implementation suites and asserts no new regression PASS.

## 7. Exact future implementation allowlist

Canonical seven plus only `evaluateClaim.ts` equals exactly eight paths:

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

Still protected: `claimState.ts`, `requirements.ts`, `contracts.ts`, `admission.ts`, `canonicalBytes.ts`, `composition.ts`, `verificationEvent.ts`, `integrity.ts`, `independence.ts`, `continuity.ts`; Core registry/supports/boundaries/aliases; reason codes/bindings; EvidencePackV1/parser/validator; GovernanceReportModel/reports/renderers; public CLI/SDK/package exports; licensing/offline authority; package/version files; historical T1/T2 evidence and frozen B09 history. All paths outside the exact eight remain unapproved for implementation.

Freeze: no selector export/duplication; no state-set/precedence/admission/requirement-union change; no generic StateBasis injection; no Core supports/alias change; no public contract change; no historical-input upgrade; no T2-01/02/03 rewrite; no T2-05/G06/G03 implementation. If a ninth protected path proves necessary, stop with `T2_04_BOUNDED_SCOPE_EXPANSION_INSUFFICIENT`, identify the first path and implementation scope blocker. Only a genuine semantic contradiction warrants `SPECIFICATION_REOPEN_REQUIRED`; convenience does not justify widening.

## 8. Frozen later acceptance proof plan (not run here)

- Preserve T1-01/02/03/04, all 603 Core probes, the three accepted T2 result hashes above, and exact historical no-finding outputs. Include absent/invalid/copied/wrong-context handle and import-only comparisons; preserve other facets and default callers.
- Exercise T02.before/T02.at; T17; T01/T03/T04; T05/T06; T18 variants; T19/T20; T22 variants; T23; T24 variants; T26 variants. Distinguish frozen incomplete inputs from new complete supplemental witnesses. T25.equal/T25.earlier unchanged; H11/H12/H13/H34 remain REJECTED.
- Falsify age-only stale, missing-expiry permanence, successor-without-displacement, version-only material loss, timestamp/reference-only support, wrong-context temporal replay, forged/copied/serialized/mutated private findings, caller booleans/StateBasis, implicit clocks and historical rewrites. Check both explicit times independently, historical joins and every context component in section 3.
- Prove scoped legacy boolean-loss inputs cannot override valid T2-04 witness findings while no-finding legacy results stay exact. Check collected `currentness` name collision, unrelated requirements and continuity diagnostics. Prove prohibition/conflict precedence over stale and stale over collateral missing; complete negative/undecidable/positive versus missing mandatory inputs.
- Run the card's exact R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME commands before/after implementation. Include no input mutation, product/test isolation, parser rejection, legacy JSON/MD/HTML/index/verdict bytes, reason ordering, default caller/export review and independent authority/public-surface review.
- Preserve B09 source-recorded anchors: commit `a646f2b4576336321eda696c7dc2ee02749cadb2`, oracle hash `6dbc01d9650d45a03c0f8319eaecc994b34eae6d0f4885cdac971e6a32ab5c88`, historical result hash `49bd7526ba3092f02c0255970aa01723b771d492e57428f9a4aac0268fe69560`. Do not regenerate frozen expectations or omit pending assertions to claim PASS.
- Record actual pre-change HEAD/rollback, source/artifact digests, before/after results, exact commands/exits, owned case/assertion fields, remaining gaps, byte representations/domains, worktree/raw Git persistence and three identical deterministic replay hashes. Require `PUBLIC_CONTRACT_DRIFT = NO`, `AUTHORITY_EXPANSION = NO`, `NEW_REGRESSION = 0`. These are later acceptance obligations, not observations from this review.

## 9. Disposition and persistence

```text
T2-05 = BLOCKED_BY_SEQUENCE_UNTIL_T2-04_CLOSED
G06 = DEFERRED_TO_G06
G03 = DEFERRED_TO_G03
T2-04 IMPLEMENTATION NOT STARTED
T2-05 NOT STARTED
G06 NOT STARTED
G03 NOT STARTED
G05 CLOSED
G07 OPEN
```

G06 profile sufficiency/report association and G03 Harness mapping/pack creation/producer integration/ingestion are neither started nor prerequisites for bounded offline T2-04 evaluation.

Only this decision artifact is committed, under `Approve bounded T2-04 state integration scope`. Report the resulting actual commit as `T2_04_SCOPE_EXPANSION_DECISION_COMMIT` after creation; do not insert a self-referential predicted commit hash. Hygiene is limited to `git diff --check`, `git diff --name-only`, `git status --short` (including staged forms as needed); status accounts for the initially untracked artifact. No product code, fixtures or implementation suites. Stop after this decision commit; do not refresh entry in this task.

T2_04_BOUNDED_SCOPE_EXPANSION_APPROVED
