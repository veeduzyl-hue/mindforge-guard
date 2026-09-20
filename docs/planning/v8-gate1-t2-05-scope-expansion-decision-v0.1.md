# T2-05 Bounded State-Integration Scope Expansion Decision v0.1

Date: 2026-09-21. Documentation-only scope review; internal V8, not released capability. T2-05 implementation has not started. This decision does not mark implementation entry READY.

## 1. Checkpoint and historical hash integrity

```text
starting_branch = planning/v8-gate1-tranche2-t2-05-v0.1
starting_HEAD = d8e9af54716b899c6e981e13f2c0026e482237b7
starting_worktree = CLEAN
T2_05_BLOCKED_ENTRY_COMMIT = d8e9af54716b899c6e981e13f2c0026e482237b7
preserved_entry_decision = IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED
```

The required status, branch and HEAD checks matched before the scope decision. The blocked entry remains immutable. No prior task, G07 decomposition, canonical T2-05 task or implementation-entry semantics is reopened. Previous scope expansions confer no authorization here.

Authoritative accepted values were read directly from [T2-04 acceptance evidence](../validation/v8-gate1-t2-04-evidence-v0.1.md), lines 123-125 and 134, and cross-checked against the root `result_hash` fields in `tests/fixtures/gate1/t2-01-results.v0.1.json`, `t2-02-results.v0.1.json`, `t2-03-results.v0.1.json`, and `t2-04-results.v0.1.json`. Each extracted value independently matched exactly 64 lowercase ASCII hex characters, using absolute string anchors; values matched case-sensitively. No trimming, Unicode cleanup or normalization of evidence values occurred. The values below were inserted programmatically from that repository evidence, not copied from rendered output.

```text
T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102
T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5
T2_03_RESULT_HASH = fd1bcd87dcd6e061c8bd8584705a178484bf2c09e9b347dd1293db559df35b34
T2_04_RESULT_HASH = 98bb34c335cba424061dbcfccb502e25e216363a6dc3579c14cdfdc32f643ecf
```

The first result-field inspection contained an unnecessary JSON-fragment parse that reported errors; its independent raw-field checks passed. A corrected read-only extraction with terminating errors then passed for all four artifacts. This was tooling-only and changed no evidence. The Windows sandbox failed before shell execution; approved fallback execution enabled the scoped work. No product or implementation suite was run.

## 2. Authority and constructive sufficiency proof

Authority: the [canonical T2-05 card and common requirements](21_GATE1_IMPLEMENTATION_PLAN.md#t2-05---context-continuity-and-current-authority-rebinding-evidence), [blocked entry](v8-gate1-t2-05-implementation-entry-v0.1.md), [ADR 0015/B07](../adr/0015-historical-current-standing-and-reliance-time-contract.md), [ADR 0011/B02](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), and [Gate 1 change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md). The following references describe the verified starting source, not an implemented T2-05 API.

| Required capability | Existing source and bounded construction | Why no other protected edit is needed |
| --- | --- | --- |
| Retain all old/current witnesses | `contracts.ts` defines `evidence_ledger` records with required subject/scope; its `fields` helper permits nested extra fields. The existing entry already admits a task-specific ledger dossier. Put versioned T2-05 retained records there; validate their semantic content in `continuity.ts`. | No new public schema, top-level transport, canonical ID or shared type is required. Structural acceptance alone grants no support. |
| Preserve admission and minimum requirements | `requirements.ts::collectBindingRequirements` performs canonical admission, unions Core/boundary/context/caller requirements, and resolves evidence references. Both the new evaluator and owner can call it unchanged. | Full collected requirements/missing predicates remain immutable. T2-05 adds dimension obligations without replacing the collector. |
| Authenticate historical integrity/custody | Existing `readIntegrityReceipt` and `readIndependenceFinding` accept original input/path/context and reject foreign identities or context changes. | `continuity.ts` can consume their existing internal interfaces with separately supplied original handles; no historical channel edits or serialization authority. |
| Consume accepted reliance-time applicability | `temporalApplicability.ts:196-205` authenticates a process-local handle against original input/core/trust/contexts/collection/path and only its `standing.current` facet. | Supply that original temporal envelope and handle separately, authenticate unchanged, then prove the explicit join to the T2-05 target. Never rename it to `authority.current` or another revision. |
| Compute bounded continuity dimensions | B07 defines retained comparison/criterion evidence, with separate revalidation and authority-rebinding obligations. `continuity.ts` may independently evaluate those deterministic predicates. | No universal materiality engine, fixture evaluator, producer integration, new admission rule or primary-state selector is necessary. |
| Integrate facts into the canonical result | `evaluateClaim.ts:34` has optional T2-02/03/04 arguments; lines 44-47 initialize collected missing/prohibition and factual arrays; lines 104-119 own the temporal standing branch; line 133 is the unanchored fallback. | Append one optional private T2-05 handle and add authenticated facet-scoped intake in this file. A new valid-only authority branch can precede fallback. No Core support mutation is needed for the already admitted request facet. |
| Select and register results | `evaluateClaim.ts:11-20` owns the private selector; lines 158-168 sort facts, select, freeze and register canonical results. The composite uses that same selector at line 200 and authenticates children with the existing WeakSet. `claimState.ts` already has all necessary arrays. | Feed existing arrays; leave selector, result authority and composite machinery unchanged. No seventh state, second canonical evaluator or selector export/copy. |

This supplies a concrete dependency path for every owned operation. The candidate is sufficient because the missing consumer, branch dispatch, fact projection and legacy-route isolation all reside in `evaluateClaim.ts`; data carriage, admission, requirement collection and prior private readers already exist. Approval is a source-grounded implementation-scope decision, not a claim of completed implementation or passing acceptance.

## 3. Private handoff and full context binding

```text
explicit retained historical/current witnesses + genuine prior private handles
  -> continuity.ts (bounded dimension facts only)
  -> private immutable process-local context-bound T2-05 finding
  -> evaluateClaim.ts (authenticate and project task-owned facts)
  -> existing factual basis arrays
  -> unchanged private selectClaimState
  -> existing canonical result owner and immutable result registration
```

A module-local WeakMap can register only handles created by actual T2-05 product evaluation. Snapshot retained JSON before deriving facts; recursively freeze derived evidence and the handle. No public registration function and no caller-authored StateBasis intake. The reader returns only registered evidence after exact context verification. Plain, copied, forged, reconstructed or serialized/deserialized objects are inert. Mutation cannot change frozen facts; changing external source data invalidates the context match. Serialized dimension output is inspectable evidence, never a reusable private capability.

Bind the complete target input, core input, trust, requirement contexts, collected obligations and exact requested path/facet. The target dossier must retain every applicable dependency envelope, so full-context equality covers canonical basis identity/version/digest, registry/module locks, subject/revision/scope, evaluation and reliance times, T2-04 original applicability input/context, historical event/result and exact-byte basis, historical independence/custody, old/current environment and policy, dependency identities/locks, criterion versions, revalidation event/result, authority source/principal/action/target/purpose/scope/time, review-reuse basis, limitations and omissions. Prior handles stay out of serialized JSON and are authenticated in their original contexts before their derived facts enter the registered T2-05 snapshot. A valid handle proves product computation over those inputs, not real-world truth or authority.

For each prior envelope, recompute the original collection through the unchanged collector and invoke its existing reader with the original core/trust/context/path. Then validate the dossier's explicit relationship between that basis and the requested target. Equality of names or digest references alone is not that relationship. A temporal envelope may concern retained A or separately evaluated B; identify which, retain its original subject/revision/scope and times, and require the relevant join. A temporal positive for A does not prove B's currentness or authority. Unauthenticated, missing or inapplicable temporal evidence creates a named missing dimension; do not recalculate temporal rules in T2-05.

Wrong-context replay cannot discharge any obligation. Enumerate all applicable records deterministically and retain opposing comparable witnesses; order, first/last record and majority cannot select a favorable result. Contradictions require the same predicate, old/current basis, subject/scope and applicable time under comparable admitted methods. Unknown comparability is missing evidence, not manufactured conflict. No automatic dynamic criterion plug-in or caller-provided executable predicate is admitted.

## 4. Distinct retained dimensions

Required dimensions derive from the exact admitted request and its Core/context/caller obligations. Omission does not make a dimension optional. Each dimension retains named method/criterion/version, source attribution, input inventory, limitations/omissions, comparison records and subject/scope/time association. A global `continuity=true|false` is insufficient.

| Dimension | Required representation and bounded evaluation |
| --- | --- |
| Subject/revision | Retain predecessor and current exact subject/revision/artifact bindings, or an attributable retained equivalence/rebinding proof under a named admitted criterion. Same name is not same subject; same bytes is not subject continuity; a new revision is not automatically material loss. Never rewrite predecessor identity. |
| Scope | Retain the exact old/current bounded action/resource/claim scopes; establish equality or an explicitly admitted compatible projection/bounded rebinding proof. Overlapping strings and broader/narrower labels prove nothing. Preserve historical scope exactly. |
| Environment | Retain old/current snapshots, identities/digests and relevant settings, named materiality criterion/version and attributable comparison. A changed environment is not necessarily material loss; an unchanged label is not continuity. Missing criterion or comparison remains unresolved. |
| Policy | Retain historical/current policy identities, versions, digests, effective dates, named compatibility criterion and attributable decision evidence. Version difference is not incompatibility; equal version labels are not semantic compatibility; a new policy does not invalidate its predecessor automatically. No invented policy interpretation. |
| Dependency | Retain dependency identities, locks/artifacts, named impact criterion and attributable comparison. Changed dependency is not applicability loss; equal labels are not identity; equal package/version strings are not complete continuity proof. Only criterion-bound material impact can establish loss. |
| Authority continuity/rebinding | Retain source/issuer, principal, authorized action, target, purpose, scope, effective interval, observation/rebinding time, relationship to predecessor authority, named rebinding criterion/version, policy and revalidation basis where required. Resolve references to attributable retained records and prove their target/time association. An authority label or boolean cannot discharge the dimension. |
| Revalidation | Retain a new attributable validation/verification event and result, inputs/outputs, target context, method/version/criterion, event time and applicability link; bind its own integrity/independence/custody where required. Evaluate a new linked basis B separately. A successful event alone does not establish current continuity; all admitted obligations remain required. |
| Review reuse | Retain original review/result and the required subject/scope/context continuity plus currently applicable reviewer/acceptance-authority evidence. This only evaluates bounded reuse obligations. Review occurrence, acceptance authority and acceptance-decision occurrence remain distinct; no general acceptance evaluator or report sufficiency. |

Unknown criteria or absent required inputs produce missing facts. Complete applicable methods unable to decide yield undecidable facts; complete bounded non-support yields negative facts. Proven material loss yields a loss fact only with retained historical support for the exact reused basis and a proved applicability relationship. Preserve dimension-level provenance and all missing diagnostics even when another blocker wins.

## 5. Owner integration, state precedence and default-off behavior

The optional trailing T2-05 argument preserves all existing argument positions and internal callers. Authenticate it against the current collection/path before using any derived fact. All changes to dispatch/fact handling are gated on that valid private finding; merely importing `continuity.ts`, supplying a dossier/label or passing an invalid handle must not alter output, diagnostics or ignored records.

For `standing.current`, use only the accepted temporal anchor/version and exact standing request path (canonical controls use `current`). With a valid T2-05 finding, integrate its owned dimensions and authenticated joined T2-04 facts into the existing arrays. If T2-04 is supplied directly for the same input, require agreement with the bound temporal envelope; do not choose a favorable duplicate. A legitimate original-context temporal join can satisfy the branch-local currentness check, without erasing any collected requirement also named `currentness`. If that join is missing, retain missing currentness/applicability. A temporal positive alone never completes continuity. A valid incomplete/negative/undecidable continuity finding must prevent inappropriate whole-claim support through its factual blockers.

For `authority.current`, add a branch only for a valid target-bound T2-05 finding on the accepted temporal anchor/version and authority request path (canonical controls use `authority`), before the existing unanchored fallback. Integrate only the task-owned rebinding/authority-continuity and required applicability facts. Complete authority support requires its own complete evidence and every collected obligation; `standing.current` support is not authority evidence. The separate producer-anchor `old_authority_inference` path stays excluded; positive rebinding uses a separate basis, never repairs that prohibited inference. Review `decision`/`acceptance` paths retain their current boundaries.

Project registered dimension missing facts to `missing`, comparable contradictions to `conflicts`, proven historical material losses to `stale`, completed bounded non-support to `negative`, complete undecidable methods to `undecidable`, and complete positive owned basis to `positive`. Applicable prohibitions remain intact. Do not erase or filter the Core/boundary/context/caller union by string name. Replace only branch-local placeholders when their exact predicates have been discharged; avoid adding those placeholders on the authenticated route rather than deleting collected missing strings.

Legacy `bound-applicability-loss/0.1` handling is local to `evaluateClaim.ts:146-151`. Preserve existing T2-04 isolation exactly; on the valid T2-05 route also isolate caller boolean-loss proofs so they cannot bypass materiality/historical-support checks when the temporal handle was authenticated through its original envelope. Without valid T2-05, the existing loop and all ignored-evidence behavior remain exact. This additional valid-only isolation needs no temporal-module edit and does not reinterpret accepted legacy outputs.

The selector remains verbatim, with exactly six primary states and its existing order:

```text
applicable prohibited inference -> UNSUPPORTED
comparable admissible contradiction -> CONFLICTED
preserved historical support + proven material applicability loss -> STALE
missing required continuity/rebinding or other basis -> UNRESOLVED
complete bounded non-support -> UNSUPPORTED
complete applicable method unable to decide -> INCONCLUSIVE
complete positive basis -> SUPPORTED
no admitted determination -> UNRESOLVED
```

`STALE` is about reuse of A, not historical falsity. B's successful revalidation/rebinding neither refreshes A nor automatically inherits its loss; separately evaluate B with its own obligations. Never transfer A's stale facts to B merely because B references A. A never-valid basis cannot become STALE from a version or policy label. The current owner continues to sort/freeze/register its results; canonical/composite selection is neither exported nor duplicated.

```text
NO valid T2-05 private finding = EXACT existing product behavior
```

This includes absent, forged, copied, serialized and wrong-context handles. No new default caller or public export. Frozen historical inputs cannot gain support from labels/references; complete new controls are supplemental evidence, not repairs to historical inputs.

## 6. Time, history and non-authority

Preserve explicit `evaluation_time != reliance_time`, even when supplied instants happen to match. Retain event/observation/check/revalidation/effective times independently. No Date.now(), implicit current time, network time, generated now, creation-time substitution or fallback between reference times. Preserve raw timestamps and admitted precision/timezone/interval rules; missing or ambiguous time remains missing. T2-05 may check its own criterion/witness applicability but must consume T2-04 freshness/expiry/revocation/supersession/snapshot/horizon findings unchanged.

Retain A's identity/version/digest, exact bytes, event/result, original timestamp, subject/scope, custody/independence and authority records. B is a new separately evaluated linked basis. No predecessor editing, in-place historical renewal, retroactive missing-evidence repair or overwriting custody. Recomputing a private handle from retained evidence does not execute a new external verification.

Evidence of authority is not Guard-created authority. `authority.current SUPPORTED` is not a permission grant, execution authorization or institutional acceptance. Guard does not issue, extend, delegate, approve or execute authority. Private finding authenticity is solely the internal computation boundary. Recommendation-only and non-executing remain absolute.

## 7. Exact implementation allowlist and protected surfaces

Approve only canonical seven paths plus the one candidate product path, exactly:

```text
packages/guard-core/src/mesr/repaired/continuity.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-05-controls.v0.1.json
tests/fixtures/gate1/t2-05-results.v0.1.json
docs/validation/v8-gate1-t2-05-evidence-v0.1.md
```

Test translators/comparators may supply and compare retained evidence but cannot decide product semantics or import/copy the frozen reference engine into product code. This review itself changes only this decision document; the eight paths are for a later separately refreshed entry.

Still protected: `claimState.ts`, `requirements.ts`, `contracts.ts`, `admission.ts`, `canonicalBytes.ts`, `composition.ts`, `verificationEvent.ts`, `integrity.ts`, `independence.ts`, `temporalApplicability.ts`; Core registry/supports/aliases/boundaries; reason codes/bindings; EvidencePackV1, parser/validator; GovernanceReportModel, reports/renderers; public CLI, SDK/package exports; licensing/offline authority; package/version files; historical T1/T2 evidence and frozen B09 history. No selector export/duplication, state-set or precedence change, admission/requirement-union change, generic StateBasis injection, new canonical ID, public contract change or historical-input upgrade is authorized.

If implementation requires any ninth path, stop at the first concrete protected path and report `T2_05_BOUNDED_SCOPE_EXPANSION_INSUFFICIENT` / `IMPLEMENTATION_SCOPE_BLOCKER`; do not widen progressively. Only a demonstrated frozen semantic contradiction justifies `SPECIFICATION_REOPEN_REQUIRED`. None was found in this review.

T2-01 remains historical occurrence/result, unchanged accepted hash and event semantics. T2-02 remains exact-byte integrity and its private receipt boundary: same bytes != continuity. T2-03 remains historical/event-scoped independence/custody and its private finding boundary: historical independence != current continuity. T2-04 remains explicit reliance-time applicability and its unchanged private channel: temporal applicability != context continuity. All four accepted hashes above are frozen.

G06 = `DEFERRED_TO_G06`: no profile-bound sufficiency, report association or outward immutable-report association. Continuity/rebinding does not imply report sufficiency. G03 = `DEFERRED_TO_G03`: no Harness mapping, canonical EvidencePack creation, producer integration or ingestion layer. Explicit admitted offline evidence suffices for this bounded evaluation; missing facts stay missing.

Compatibility conclusion: the bounded design preserves audit output/verdict/exit and deny 25; permit and classify behavior; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. No control-plane, dashboard, orchestration, runtime takeover or released v7.0.1 surface change. Implementation verification remains mandatory later.

## 8. Frozen later acceptance obligations

No suites are run in this review. After the separate implementation-entry refresh, retain actual before/after observations and source/input/method/oracle versions/digests, byte representation/encoding/length, commands/exits, scoped diff and rollback basis under change control. Later acceptance must prove:

- T1-01, T1-02, T1-03, T1-04 and all 603 Core probes preserved; all four exact accepted T2 result hashes unchanged.
- Historical no-finding and invalid-finding outputs unchanged, including serialized bytes, diagnostics, ignored evidence, requirement-name collisions and existing optional-argument positions. Import alone is inert.
- T07, T15, T21.complete; T08, T09.subject, T09.scope, T10, T11, T12.policy, T12.dependency, T13.policy, T13.dependency, T14, T16, T20, T21.missing, T27; N14, I17, H33; full 37 T-family exit preservation. Retain partial/unimplemented gaps honestly.
- Subject/revision-label, same-bytes, scope-label, environment-change, policy-version, dependency-version and authority-label/boolean shortcuts fail. Missing evidence and complete undecidability remain distinct; changed context alone cannot establish STALE.
- Revalidation does not rewrite the predecessor; rebinding creates no authority; successful B does not renew A; history bytes/results/timestamps/custody/authority remain immutable. Standing cannot support authority automatically, and neither supports acceptance/execution.
- Wrong-context witness/handle replay fails across every context field in section 3. Forged/copied/serialized/mutated handles and caller StateBasis/expected-state labels have no finding authority. All applicable records are considered; permutation and duplicate/conflict handling cannot favor support.
- Explicit time semantics and unchanged T2-04 channel preserved, including original-context temporal joins and wrong-basis rejection. Valid T2-05 legacy-proof isolation and exact absent/invalid behavior both hold.
- Existing six states/selector/precedence preserved; prohibition > conflict > stale > missing, then negative > undecidable > positive; retain collateral diagnostics. Test historically supported material loss versus never-valid non-support and complete positive/negative/undecidable dimensions independently.
- Run canonical R-EAK, R-MESR, R-ISOLATION, R-PUBLIC and R-OUTCOME before/after implementation. Preserve public JSON/Markdown/HTML/index/verdict bytes, parser/validator rejection behavior, reason values/order, CLI/SDK/export/default callers, licensing/offline authority, audit/permit/classify and deny 25.
- `PUBLIC_CONTRACT_DRIFT = NO`; `AUTHORITY_EXPANSION = NO`; `NEW_REGRESSION = 0`; three deterministic product replays have identical result hashes and serialized output. Comparator corrupt-expectation, dropped-binding and false-positive falsifiers fail; unexpected exceptions are ERROR.

## 9. Disposition and stop

Only `docs/planning/v8-gate1-t2-05-scope-expansion-decision-v0.1.md` may change in this task. Perform planning hygiene only: `git diff --check`, `git diff --name-only`, `git status --short`, with staged forms for this new file. Commit only this artifact; report the actual `T2_05_SCOPE_EXPANSION_DECISION_COMMIT` externally to avoid a self-referential hash.

Next task: **T2-05 Implementation Entry Refresh v0.2**. This scope decision does not make entry READY, start implementation, close G07, authorize a ninth path, merge, release or publish anything.

```text
T2-05 IMPLEMENTATION NOT STARTED
G07 OPEN
G06 NOT STARTED
G03 NOT STARTED
G05 CLOSED
```

T2_05_BOUNDED_SCOPE_EXPANSION_APPROVED
