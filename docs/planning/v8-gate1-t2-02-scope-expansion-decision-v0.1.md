# T2-02 bounded state-integration scope decision v0.1

Decision review only. Approve adding exactly evaluateClaim.ts to the seven-path
T2-02 scope under the private handoff constraints below. This is source-level
architectural feasibility, not an implemented or tested compatibility result.
T2-02 implementation entry remains BLOCKED pending human review and a separately
refreshed entry checkpoint; this document does not mark ENTRY_READY.

## Preserved checkpoint

- Original starting HEAD: 6ec7d06ee48f700ab16333420ffe3fc2b18aee19.
- Branch: planning/v8-gate1-tranche2-t2-02-v0.1.
- T2_02_BLOCKED_ENTRY_COMMIT: 29499392254d1a224de86c957161b524a3050e56.
- [Blocked entry dossier](v8-gate1-t2-02-implementation-entry-v0.1.md) is preserved
  unchanged, including IMPLEMENTATION_SCOPE_EXPANSION_REQUIRED.
- Blocked dossier SHA-256: 1718dd098341dc703e42c89e796f8557cbd8927f6adb8a13d7884d18cc56bba2.
- T2-01 accepted implementation: 112d19ca84f13cc74447a41dfde5df49d9f9e49b.
- T2-01 accepted result hash: 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102.

SPECIFICATION_REOPEN_REQUIRED = NO. The SHA-256/domain/state specification
and accepted T1/T2-01 work are not reopened.

## Source-grounded sufficiency of one additional path

The [task card and common requirements](21_GATE1_IMPLEMENTATION_PLAN.md)
authorize the new integrity module and three shared test paths, task controls,
results and evidence. [Change control](22_GATE1_CHANGE_CONTROL_CONTRACT.md)
requires one shared state owner and excludes test-side semantic decisions.
[ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md) governs
bindings, primary states and precedence. The blocked dossier records the
unchanged ADR 0013 byte-equality rules.

At the preserved checkpoint:

| Existing source fact | Consequence for the bounded design |
| --- | --- |
| evaluateClaim.ts:8-17 owns private selectClaimState; the facts assembly and selection are in the same file | Add a specialized comparison-basis intake there, without moving/exporting/copying the selector. |
| evaluateClaim.ts:31-43 collects T1 admission/bindings and rejects malformed input before evaluating claims | Keep this ordering. A comparison cannot bypass rejection or supply an admitted registry/lock. |
| evaluateClaim.ts:94 recognizes artifact.byte_equality but always adds integrity_comparison_basis | This exact branch can consume a complete private result; no other claim branch needs alteration. |
| evaluateClaim.ts:42-48 starts with collected missing bindings and exclusions; lines 119-135 select and serialize from the resulting facts | Supply only factual positive/negative comparison evidence; retain all existing blockers, diagnostics and output ownership. |
| requirements.ts:107-178 resolves identities, unions Core/context/caller obligations, applies nonclaims and retains missing bindings | Reuse unchanged. Private comparison completeness is an additional condition, not a replacement for collected obligations. |
| contracts.ts:67-70 defines a closed legacy integrity object | Pass the new receipt outside that JSON object; no schema field or accepted input shape needs widening. |
| claimState.ts defines the existing state constants and StateBasis arrays | Existing positive/negative/missing arrays already represent a bounded comparison. No new state/type category is needed. |
| evaluateClaim.ts:139 onward admits composite children by its own WeakSet identity | Let only the existing evaluator produce/register canonical results; leave composite admission unchanged. |

The integration is a named specialized facet on the existing admitted
mesr.core.evidence.item anchor, consistent with the already recognized
artifact.byte_equality request and ADR 0013. It does not add that string to
Core supports, register an alias, or infer support from bounded_content.
The other supplied canonical identities, nonclaims and caller/context
requirements remain effective. Unknown identities are never dropped.

These facts permit the entire addition in integrity.ts plus evaluateClaim.ts.
No change to requirements.ts, contracts.ts or any other protected semantic
path is needed for the handoff described below. The earlier seven-path blocker
remains valid historical evidence.

## Frozen minimum private handoff

Data flow: explicitly supplied bytes -> integrity.ts exact-byte evaluation ->
private comparison receipt -> evaluateClaim.ts -> existing private selector.

1. integrity.ts performs only pure bounded SHA-256 computation/comparison and
   attribution/basis checks. No canonical state, generic StateBasis injection,
   public export, callback evaluator or comparison result supplied by a caller.
   It preserves original octets and computes observed digest and length itself.
2. A completed comparison returns an immutable process-local receipt whose
   identity is registered in a module-private WeakMap. Only actual complete
   product evaluation can register it. A plain object, copied/serialized receipt,
   boolean, matching digest label or supplied state is not an admitted receipt.
   Serialized evidence remains inspectable but must be recomputed to regain
   execution provenance on replay.
3. Receipt contents retain the target claim/path and canonical identity/version;
   subject/revision/scope; member namespace/reference and exact representation;
   byte domain, measured length, SHA-256, attributed expected source/digest and
   computed digest; checker/version, method/version/descriptor, provided event
   time, input/output references, limitations and match/mismatch observation.
   Preserve the retained provenance witnesses, not just their labels.
4. Bind the receipt to immutable snapshots of the exact intended canonical
   input/request, explicit evaluation time and relevant method/context. Validate
   the same association at consumption, including any supplied legacy integrity
   fields. A receipt for different bytes/member/path/subject/scope/time, a mutated
   input or a different method cannot discharge this claim's basis.
5. The existing private evaluateClaims function may accept one optional fifth
   argument for this receipt, defaulting to absent. Existing four-argument calls
   remain unchanged. All new types and the receipt reader live in the two admitted
   product files; no additional contracts file or package export is needed.
   evaluateClaim.ts can import the narrow reader from integrity.ts; integrity.ts
   must not import/call the evaluator. This avoids a dependency cycle.
6. The reader exposes only the internally stored factual comparison record,
   never an arbitrary callback or caller-authored positive/negative arrays.
   It performs no hashing or I/O when the argument is absent. No import-time
   comparison, registration of public surfaces or automatic invocation occurs.
7. Only an admitted, context-matched, complete receipt for artifact.byte_equality
   on the required admitted anchor enables the new branch. It contributes the
   bounded comparison proof to positive on match or negative on mismatch.
   The existing selector alone decides the resulting canonical state and the
   existing evaluator alone freezes/registers that result.
8. Without a valid complete receipt, execute the original integrity branch
   verbatim, including its existing missing diagnostics. Do not automatically
   hash source.integrity, infer receipt validity from labels, replace missing
   facts, mutate source input or change default result metadata.

WeakMap identity is an internal anti-fabrication mechanism, not authenticated
checker identity, custody, a persistence service or a security authority.
Fresh recomputation is explicit on each replay. Receipt identity/address is
not serialized into deterministic evidence.

## Canonical invariants and precise permitted effect

selectClaimState stays private and unchanged. Preserve the six existing states
and exact ordering: Core prohibition -> comparable conflict -> proven stale
basis -> missing obligation -> completed determination. Within the last stage,
retain current negative -> undecidable -> positive ordering and fallback.
Malformed T1 input remains REJECTED before any new basis is consumed.

The new branch may avoid only its own legacy integrity missing markers when
the receipt actually supplies their basis. It must not remove an identically
named caller/Core/context requirement from the collected missing set, discard
a nonclaim/conflict/stale record, sanitize a rejected input, or skip existing
state-proof checks. Other required missing facts still prevent support.

| Comparison basis | Permitted equality result, subject to unchanged precedence |
| --- | --- |
| Missing required proof or unestablished domain/member/algorithm/basis | Original UNRESOLVED behavior; stronger pre-existing blockers still take precedence. |
| Complete admissible comparison, digest mismatch | UNSUPPORTED for equality; both digests retained, no automatic CONFLICTED. |
| Complete admissible comparison, exact match | SUPPORTED only for narrow equality-to-reference if every other admission/binding/precedence obligation passes. |

No effect is admitted on verification.passed, verification.occurred,
evidence_presence, bounded_content or unrelated claim paths, even when the same
input contains an integrity receipt. Do not rename verification results or
fabricate composite children. Competing/ambiguous basis cannot be resolved by
last-write or by silently selecting a passing witness.

Match implies none of authenticity, truth, custody, verifier independence,
outcome correctness, institutional acceptance, authority, execution permission
or compliance. No T2-03 inference and no G03 closure.

Use only explicitly supplied bytes and attributed expected SHA-256, exact
octets/domain and actual byte count. No filesystem/network/artifact lookup,
transcoding, normalization or EvidencePack creation. Provided zoned event time
and separate explicit evaluation_time remain deterministic; no clock sampling.
No algorithm framework or additional algorithm is admitted.

## Exactly eight implementation paths

Newly admitted product path:
packages/guard-core/src/mesr/repaired/evaluateClaim.ts

The future implementation allowlist is exactly:

1. packages/guard-core/src/mesr/repaired/integrity.ts
2. packages/guard-core/src/mesr/repaired/evaluateClaim.ts
3. scripts/verify_v8_gate1_product_conformance.mjs
4. scripts/gate1/b09-product-inputs.mjs
5. scripts/gate1/b09-product-compare.mjs
6. tests/fixtures/gate1/t2-02-controls.v0.1.json
7. tests/fixtures/gate1/t2-02-results.v0.1.json
8. docs/validation/v8-gate1-t2-02-evidence-v0.1.md

This is the sole exception to the former new-product-file-only scope, limited
to private T2-02 intake in evaluateClaim.ts. It is not general permission to
refactor T1. Shared test edits remain translation/invocation/comparison only.
No ninth path is authorized.

All other paths remain protected, explicitly including the repaired
claimState.ts, requirements.ts, contracts.ts, admission.ts, canonicalBytes.ts,
composition.ts and verificationEvent.ts; Core registry and boundaries; reason
bindings/codes and their ordered values; EvidencePackV1, parser/validator;
report model/generation/renderers; public CLI, SDK/package exports; licensing
and offline authority; package/version files; T1/T2-01 evidence and frozen B09.

Prohibitions frozen: no selector export; no selector duplication; no state-set
change; no precedence change; no public contract change; no second evaluator;
no automatic historical-input upgrade; no T2-03 inference; no G03 closure.
If implementation needs another protected path, stop as bounded scope
insufficient; this decision does not preauthorize another expansion.

## Required later noninterference proof

No implementation suites are run for this change-control decision. The refreshed
entry task must pin its own clean pre-change HEAD and exact input/source/result
baselines before any implementation. Later proof must include:

| Obligation | Required before/after proof |
| --- | --- |
| T1-01/02/03/04 preservation | Replay the accepted input inventories through actual product APIs; compare full serialized outputs/fingerprints, admission failures, requirement unions, all six states, composition and 603 Core probes. |
| Default artifact.byte_equality unchanged | Exact output comparison for every historical non-T2-02 case with no receipt, including label-only B09, I06/I07/I08/I09/I10/I15 and N17.failed/skipped. No auto-upgrade from source.integrity. |
| Invalid handoff cannot change T1 | Missing, forged, copied, deserialized, tampered and context-mismatched receipts yield the same T1 result as no receipt; private diagnostics may be retained separately. Malformed canonical input stays rejected. |
| Narrow opt-in effect | Valid match/mismatch receipts exercise only the exact equality claim; missing admission, caller/context obligations, prohibitions and unrelated claims remain unchanged. Test cross-path/member/domain/time/method replay and mutated inputs. |
| Single owner and precedence | Source review confirms selector unchanged/private and no selector/state production elsewhere. Falsifiers prove no generic basis/callback injection or counterfeit composite child; preserve existing conflict/stale/missing precedence. |
| T2-01 preservation | Execute unchanged 370 annotation and 64 bridge/boundary semantic assertions; result hash must remain 4df327296d4c2baea45cd22ce13d4b789fedbb783a7c8a1ff7a526745edad102, including three identical replays. verification.occurred and selector behavior remain preserved. |
| Public contracts and authority | Run the task-card R-EAK/R-MESR/R-ISOLATION/R-PUBLIC groups before/after; check exact legacy report/renderer/index bytes, parser/validator behavior and reason order, public exports/callers and unchanged licensing. PUBLIC_CONTRACT_DRIFT=NO; AUTHORITY_EXPANSION=NO. |
| Determinism and scope | Three explicit product replays with the same bytes/attributed times and fresh receipts have identical serialized hashes; no pointer/clock data. Verify exact eight-path diff and protected-source hashes, input immutability and product/test isolation. |

Preserve historical guard/freeze receipts. Their accepted scope hashes are not
rewritten to make a changed evaluator look byte-identical. Attribute the single
newly permitted evaluateClaim.ts source delta explicitly and prove behavioral
preservation in the T2-02 task lane. A historical branch-bound verifier refusing
a later lineage is not permission to weaken it or a substitute for executing
its unchanged semantic cases. The allowed shared verifier may add a separately
attributed T2-02 lane without changing historical expectations or declaring
unexecuted assertions passed.

Audit output/verdict/exit and deny 25, permit/classify, recommendation-only,
additive-only, non-executing governance, default-off invocation and authority
scope remain unchanged. No control-plane, dashboard or orchestration expansion.
Compatibility is architecturally supportable under these constraints;
implementation acceptance remains unproven and deferred.

## Disposition

Only this decision document is created by the scope review. Commit it separately
from the unchanged blocked-entry evidence. No product code, fixture, public
contract, canonical task card or historical evidence is edited. Document hygiene
and exact path review are the only checks for this task.

After human review, a separate task must refresh T2-02 implementation entry
against this eight-path scope. No implementation pre-change HEAD or ENTRY_READY
is established here. T2-02 IMPLEMENTATION NOT STARTED; T2-03 NOT STARTED;
G03 OPEN; G05 OPEN.

T2_02_BOUNDED_SCOPE_EXPANSION_APPROVED
