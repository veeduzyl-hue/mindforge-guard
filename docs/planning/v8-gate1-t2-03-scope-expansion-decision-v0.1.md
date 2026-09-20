# T2-03 Bounded State-Integration Scope Expansion Decision v0.1

## Checkpoint and decision boundary

Task: T2-03 / Tranche 2 / G05, change-control review only.
Branch: `planning/v8-gate1-tranche2-t2-03-v0.1`.
Starting HEAD, preserved blocked-entry commit and reviewed rollback boundary:
`4b94062fbdb538f1a87f611246c6b3b5a62474cd`.
The required checkpoint commands confirmed that branch, HEAD and CLEAN worktree.
The blocked entry remains `IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED` in its
historical record. This decision does not rewrite it or mark entry READY.

Decision: adding only `packages/guard-core/src/mesr/repaired/evaluateClaim.ts`
to the canonical seven paths is sufficient for bounded state integration.
This is a source-grounded feasibility decision, not an implementation or test
PASS. No specification contradiction or additional required protected path was
identified. T2-03 implementation remains NOT STARTED; entry refresh v0.2 is a
separate next task. V8-000, Tranche 1, T2-01/02, the canonical task, planning and
accepted entry semantics are not reopened. Internal V8 remains unreleased.

## Authority and constructive feasibility proof

Only the following task-authorized sources were used:

- [Blocked implementation entry](v8-gate1-t2-03-implementation-entry-v0.1.md),
  sections 2-8: exact anchors, predicates, joins, frozen I10 and owner blocker.
- [Canonical task and common requirements](21_GATE1_IMPLEMENTATION_PLAN.md#t2-03---principal-separation-and-custody-bound-independent-checking)
  and [change-control contract](22_GATE1_CHANGE_CONTROL_CONTRACT.md), sections
  1-6: bounded internal invocation, frozen history, compatibility and scope control.
- [ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md),
  ownership, six states and binding/precedence sections.
- [ADR 0013](../adr/0013-independent-verification-and-integrity-evidence-contract.md)
  and [B05 I01-I18](../validation/v8-b05-independence-integrity-falsifiers-v0.1.md):
  separate result, identity, separation, custody and equality evidence.
- [evaluateClaim.ts](../../packages/guard-core/src/mesr/repaired/evaluateClaim.ts),
  with protected references [claimState.ts](../../packages/guard-core/src/mesr/repaired/claimState.ts),
  [requirements.ts](../../packages/guard-core/src/mesr/repaired/requirements.ts),
  [contracts.ts](../../packages/guard-core/src/mesr/repaired/contracts.ts), and
  [integrity.ts](../../packages/guard-core/src/mesr/repaired/integrity.ts).

| Source fact at the checkpoint | Bounded construction and consequence |
| --- | --- |
| `evaluateClaims` calls `collectBindingRequirements` before processing claims and returns on rejection. | Keep that order and rejection unchanged; a private finding cannot admit an input or bypass canonical identity/version checks. |
| `requirements.ts` resolves entries, unions registry/boundary/caller/context obligations, preserves nonclaims, and already recognizes `verification.independent` on the verification anchor. | Consume the existing collection unchanged. No requirement predicate, union, Core support or alias edit is needed. |
| `contracts.ts` admits a nonempty claim string on an admitted request path and canonical identity; it does not require every facet to appear in Core `supports`. | The existing frozen `custody.independent` facet can have a specialized owner branch on `mesr.core.evidence.item` without adding an ID or modifying admission. Admission alone does not establish custody support. |
| The current independence branch adds `independent_verification_basis` and local witness placeholders unconditionally; custody has no specialized branch and falls through. | Add guarded private-finding consumption at these exact branch points. Keep the old route literally available whenever no valid finding exists. |
| The owner already has factual positive/negative/undecidable/conflict/missing arrays; `claimState.ts` allows evidence records in those categories. | The owner can translate typed predicate findings into these arrays without altering their contract or adding states. |
| `selectClaimState` is file-private; freezing and `admittedResults.add` happen after selection; composites require actual registered child objects. | Leave selector, canonical result construction/registration and composite evaluation unchanged. No selector export, duplication, second state evaluator or fabricated child is needed. |
| T2-02's fifth argument is read only for `artifact.byte_equality`; receipt authority is module-private identity plus exact input/path/context checks. | Preserve that argument and implementation. Add a separate T2-03-specific optional intake, never a union of arbitrary evidence/state injection. |

These facts establish a construction using the new predicate module and the
existing owner only. T2-02 is protected context, not precedent granting scope.
All test-side work stays translation, invocation and comparison; expected states
never supply product facts or decide semantics.

## Private handoff boundary

Required data flow:

```text
explicit retained T2-03 witnesses
 -> independence.ts bounded factual evaluation
 -> private immutable context-bound T2-03 finding
 -> evaluateClaim.ts exact-facet factual projection
 -> existing factual basis arrays
 -> unchanged private selectClaimState
 -> existing canonical result owner
```

A sufficient private layout is a module-local WeakMap keyed by an opaque frozen
handle. Its values retain immutable validated snapshots, predicate facts and
provenance. Only the product's bounded T2-03 evaluation can populate this map;
there is no registration API accepting completed caller facts, states or
`StateBasis`. The reader performs identity and exact context checks and returns
facts or no finding. Exporting an internal producer/reader between these two
modules does not authorize SDK/package exports or public schema changes.

Proposed internal signature layout, not implemented:
`evaluateClaims(input, coreInput, trust, contexts = [], integrityReceipt?, t2_03Finding?)`.
The sixth argument carries only a task-specific opaque handle. The fifth remains
exclusively T2-02. Private witness validation/storage and producer/reader types
live in `independence.ts`; intake and factual projection live in `evaluateClaim.ts`.
No new serialized field is required. Retained witnesses may be supplied to the
private producer separately; do not insert an unchecked public evidence channel.

Minting must perform actual product evaluation over explicit offline witnesses,
including accepted T2-01 occurrence/result evaluation and unchanged T2-02
comparison where required. A successfully evaluated partial finding can retain
missing obligations and comparable conflicts; minting must not require a positive
or complete outcome. An invalid context is distinct from an admitted context
with incomplete evidence. Neither caller labels nor fixture expectations may
create evaluated facts. Plain, copied, serialized/deserialized and tampered
handles cannot recover WeakMap identity. An original handle authorizes only its
recorded factual context, never real-world identity, trust or execution.

Bind the handle to snapshots of the full claim input, exact request path/facet,
canonical identity/version, Core/admission inputs and trust basis, collected
registry/module basis, requirement contexts and retained witness dossier. The
producer can use the existing collector read-only; the owner independently
collects as today and the reader compares the bound context. Bind explicit joins
for subject, revision, scope, event/result and method/criterion, producer/executor/
verifier principals, identity-method provenance, separation policy/version,
control/conflict evidence, artifact/member namespace, representation/byte domain,
T2-02 comparison association, custody criterion, custodians, controls, transfers,
transformations, storage, intervals, event/comparison times and evaluation_time.
Supplied event times remain distinct from evaluation_time. No clock sampling,
network lookup, invented IDs or implicit aliases are permitted.

Where a T2-02 comparison uses its own equality request, retain its exact input,
path and requirement contexts and call the existing comparison/receipt reader
unchanged for that tuple. Product-side T2-03 evaluation checks the explicit join
to the requested independence/custody context. Never retag a T2-02 receipt for an
independence path, accept its serialized copy, or require modifying `integrity.ts`.
Preserve mismatch and incomplete comparison facts; equality establishes only its
own member/representation comparison, never identity or custody. Required joins
and comparisons follow the requested claim, not inferred package-wide integrity.

Wrong-context replay or mutated bound inputs cannot discharge obligations. A
valid finding with an unbound witness records the missing association; a handle
bound to another context is inert and uses the exact old owner behavior.

Keep these private factual dimensions separate, with evidence and limitations:

- Principal separation: satisfied / violated / missing / conflict / undecidable.
- Custody criterion: satisfied / violated / missing / conflict / undecidable.
- Exact check occurrence/result and successful-check association.
- Identity-method basis completeness, role associations and retained provenance.
- Supporting control/conflict witnesses and all comparable competing candidates.

These are descriptive private predicate outcomes, not new canonical enums or
principal-separation IDs. Do not compress them into `independent: boolean`.
Verification result != principal separation != verifier independence != custody
independence. Different principal IDs, processes, runtimes, machines or organization
labels alone prove none of the required separation predicates. Neither
`independent=true`, `custody.independent=true`, `verification.passed`, nor missing
conflict records establish the complete factual basis.

## Exact owner integration and state effects

Keep the initial `missing = [...c.missing_bindings]`, evaluation-time check and
all collected prohibitions intact. Branch-local placeholders must be added only
on the old fallback route, or replaced by exact evaluated local obligations on
the valid-finding route. Never remove missing entries by name across the collected
union: a caller/context obligation with the same spelling remains unsatisfied.
Do not edit `collection`, broaden generic `state_proofs`, or suppress unknown IDs,
undefined predicates, Core exclusions or traceable conflicts.

For `verification.independent` on `mesr.core.evidence.verification@0.1.0`, the
owner may project only this path's bound finding:

| Evaluated facts | Contribution before unchanged selection |
| --- | --- |
| Successful check, complete identity basis, satisfied separation and custody | Narrow positive basis; SUPPORTED only if every other collected obligation is satisfied and no higher blocker applies. |
| Failed check with otherwise complete required basis | Negative successful-independence basis; failed result stays failed. Separation may remain satisfied privately. Missing custody/other obligations still yield UNRESOLVED. |
| Established same-principal/common-control policy violation or custody violation | Completed negative basis, not fabricated conflict; missing collateral obligations retain their precedence. |
| Missing identity, policy, control, custody, event/result or join | Named missing obligations; no success or failure synthesized. Skipped/incomplete checks remain distinct from failed. |
| Complete inconclusive method, absent other deciding blockers | Undecidable basis; INCONCLUSIVE. Missing method inputs remain UNRESOLVED. |
| Comparable mutually incompatible admissible evidence | Traceable conflict records, retained even with missing collateral evidence; CONFLICTED subject to Core prohibition precedence. |

For `custody.independent` on `mesr.core.evidence.item@0.1.0`, a valid guarded
finding adds a specialized owner branch before the generic fallback. Complete
positive custody contributes positive basis; complete sole-producer-control
violation contributes negative basis; missing witnesses contribute missing
obligations; comparable contradictory custody evidence contributes conflicts;
a complete undecidable criterion contributes undecidable basis. Thus positive
custody is eligible for SUPPORTED, sole-control violation for UNSUPPORTED,
missing custody for UNRESOLVED, and conflict for CONFLICTED, all subject to the
unchanged global obligations/precedence. Custody does not require successful
checking merely to report its own criterion; it cannot support
`verification.passed`, `verification.independent` or institutional acceptance.

No valid T2-03 finding = EXACT existing product behavior, including fallback
branches, diagnostics and serialized output. Mere import/presence changes nothing.
Do not alter the existing occurrence/pass, equality, generic proof, acceptance,
currentness or composite routes. Valid findings affect only their exact requested
facet/path. Producer and observation exclusions stay scoped and intact.

The six states remain SUPPORTED, UNSUPPORTED, UNRESOLVED, CONFLICTED, STALE,
INCONCLUSIVE. The existing selector remains private and unchanged:
prohibition -> conflict -> stale -> missing -> negative -> undecidable -> positive
-> unresolved fallback. The predicate module supplies facts, never primary states.
There is no seventh state, new state owner, selector copy or generic StateBasis
injection. Existing result freezing and private composite ownership remain intact.

## Frozen expanded implementation allowlist

Exactly eight paths are admitted for the later bounded implementation:

```text
packages/guard-core/src/mesr/repaired/independence.ts
packages/guard-core/src/mesr/repaired/evaluateClaim.ts
scripts/verify_v8_gate1_product_conformance.mjs
scripts/gate1/b09-product-inputs.mjs
scripts/gate1/b09-product-compare.mjs
tests/fixtures/gate1/t2-03-controls.v0.1.json
tests/fixtures/gate1/t2-03-results.v0.1.json
docs/validation/v8-gate1-t2-03-evidence-v0.1.md
```

This scope-review task changes only this decision document, not those eight paths.
The canonical task card is not rewritten. Still protected: `claimState.ts`,
`requirements.ts`, `contracts.ts`, `admission.ts`, `canonicalBytes.ts`,
`composition.ts`, `verificationEvent.ts`, `integrity.ts`; Core registry/supports/
boundaries/aliases; reason bindings/codes; EvidencePackV1 and parser/validator;
GovernanceReportModel and generation/rendering; public CLI and SDK/package exports;
licensing/offline authority; package/version files; T1 evidence; T2-01 evidence;
T2-02 implementation/evidence; frozen B09 and external-review history.

No selector export/duplication, state-set/precedence change, generic StateBasis
injection, public contract change, Core support/alias change, automatic historical
upgrade, T2-01/02 reinterpretation, G07 implementation or G03 implementation is
permitted. If implementation requires any additional protected path, stop and
record `T2_03_BOUNDED_SCOPE_EXPANSION_INSUFFICIENT`, identifying the first required
path and implementation-scope blocker. Do not add a ninth path automatically.
Only an actual semantic contradiction warrants `SPECIFICATION_REOPEN_REQUIRED`.

## Preservation and deferred work

T2-01 remains attributable verification occurrence/result, not authentication or
independence. T2-02 remains exact-byte comparison, not principal authentication,
verifier independence or custody independence. Its private receipt authority and
fifth-argument intake are unchanged and cannot become generic injection.

Frozen I10 remains unchanged, including its incomplete retained witness basis
and historical expected outcome. Labels/references cannot upgrade it. A later
complete I10-style supplemental control is new hypothetical evidence with separate
identity/provenance, not a repair to historical bytes. Preserve frozen I-family,
N02/N15/N18 and H14/H15, including remaining product/oracle gaps.

`G07 = DEFERRED_TO_LATER_ACCEPTANCE`: captured event/custody intervals do not
establish continuing current standing, temporal continuity or current reliance.
`G03 = DEFERRED`: no Harness integration, canonical EvidencePack creation,
producer mapping or ingestion layer. Neither is a prerequisite for this bounded
offline evaluation. G05 remains OPEN.

Audit output/verdict/exit, deny exit 25, permit and classify remain unchanged.
Recommendation-only, additive-only, non-executing, default-off; no authority scope
expansion, hidden enforcement, dashboard/control-plane/orchestration drift.
Released v7.0.1 behavior, install/demo and commercial surface remain unchanged.

## Later noninterference proof obligations (not executed here)

Before acceptance, retain actual before/after observations and exact source/input/
output hashes, asserted fields, commands/exits, provenance and remaining gaps.
Require all of the following:

1. T1-01, T1-02, T1-03 and T1-04 preserved; all 603 Core probes preserved;
   admission, union, scoped nonclaims and composite ownership unchanged.
2. `T2_01_RESULT_HASH = 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102`
   and `T2_02_RESULT_HASH = a1a11f600d227220aac30d91dda8f7e57a1d6f1f3825c4fb392583ad0b36f4c5`
   unchanged. These are inherited accepted hashes, not new results from this review.
3. Historical no-handoff outputs byte-identical; invalid/absent handles and import
   alone unchanged; frozen I-family/N02/N15/N18 unchanged; H14/H15 remain REJECTED.
4. Label/reference, different-ID/process/runtime/machine shortcuts fail; undefined
   policy/method and missing/null/empty/wrong-type witnesses stay unresolved.
   Common-control violation and sole-producer custody tested separately from
   contradictory admissible evidence. Preserve positive separation with missing
   custody and pass with missing independence as distinct dimensions.
5. Failed/skipped/inconclusive checks remain distinct. Complete supplemental
   positive controls support only the exact facet. Custody never upgrades result,
   independence or acceptance; integrity mismatch cannot be overwritten.
6. Wrong-context replay fails across every bound association above. Forged/copied/
   serialized/tampered handoffs fail. Product evaluation, not fixture state,
   creates findings; missing inputs do not suppress admissible conflicts.
7. Core prohibition and comparable-conflict precedence preserved, including
   conflict plus missing evidence. Caller/context obligations with colliding
   placeholder names cannot be erased. No favorable-source/order/majority choice.
8. R-EAK, R-MESR, R-ISOLATION and R-PUBLIC before/after evidence; public serialized
   contracts and legacy JSON/MD/HTML/index/reason streams unchanged. Preserve
   historical source pins and freeze receipts; do not rewrite guards for this delta.
9. `PUBLIC_CONTRACT_DRIFT = NO`; `AUTHORITY_EXPANSION = NO`;
   `NEW_REGRESSION = 0`; three fresh deterministic replays identical.
10. Product/test isolation, exact eight-path diff, explicit supplied times,
    unchanged protected sources, reviewable rollback evidence and preserved
    historical bytes. Rollback is a scoped reviewed revert, not destructive Git.

## Review hygiene and commit protocol

Only `docs/planning/v8-gate1-t2-03-scope-expansion-decision-v0.1.md` is created.
Run only the requested diff/status hygiene; intent-to-add may expose this new file
for `git diff --check` and `git diff --name-only`. No product edits, fixtures or
implementation suites. Commit only this document with subject
`Approve bounded T2-03 state integration scope`. Record the resulting
`T2_03_SCOPE_EXPANSION_DECISION_COMMIT` in the final report, outside its own bytes.
Then stop. No entry READY or implementation/regression PASS is claimed.
Next task: separate T2-03 Implementation Entry Refresh v0.2.

T2-03 IMPLEMENTATION NOT STARTED. G03 NOT STARTED. G07 NOT STARTED. G05 OPEN.

T2_03_BOUNDED_SCOPE_EXPANSION_APPROVED
