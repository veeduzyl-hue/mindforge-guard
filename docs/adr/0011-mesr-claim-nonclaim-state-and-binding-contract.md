# ADR 0011: MESR claim, nonclaim, state and binding contract

- Status: Phase A B02 specification disposition; evaluator changes are not authorized.
- Contract / projection identifier: `mesr-claim-state-projection/0.1`.
- Inputs: [ADR 0010](0010-mesr-canonical-id-relation-and-admission-contract.md), [V8-000 matrix](../mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md), [ADR 0008](0008-claim-supportability-is-not-governance-disposition.md).

## Current source and ownership

The current [MESR types](../../packages/guard-core/src/mesr/types.ts) retain `supports`, `partially_supports`, `contradicts`, `does_not_support`, `indeterminate`. The [support evaluator](../../packages/guard-core/src/mesr/supportEvaluator.ts) checks request.required_bindings rather than the union of registry obligations; false and empty arrays pass its presence check, caller-supported parts contribute positives, and registered boundary activation depends on observed_state_ids. [CB-22](../../packages/guard-core/src/mesr/claimBoundaries.ts) currently emits does_not_support for an unsupported producer-to-independence inference. These observations are compatibility debt, not the new six-state implementation.

The [EAK PoC](../../packages/guard-core/src/evidenceAssuranceKernel.ts) remains `0.1.0-poc`; [eakProjection.ts](../../packages/guard-core/src/mesr/eakProjection.ts) remains its existing side projection. [GovernanceReportModel](../../packages/guard-core/src/reportModel.ts) remains 1.0.0 with its own dispositions. No enum is renamed in place.

Core owns meaning, nonclaims and minimum binding predicates. Admitted modules may add contextual obligations without weakening Core. A future versioned MESR/EAK evaluation owns a **per-claim, per-subject, per-scope, per-evaluation-time, per-evidence-basis** state. Producers own attributed input assertions; callers request claims but do not set support states. Reports communicate results without turning them into execution authorization or institutional acceptance.

## Exactly six primary states

| State | Required basis | Does not mean |
|---|---|---|
| `SUPPORTED` | An admitted positive relation, every required binding satisfied, applicable evidence, resolved required claim parts, no applicable prohibited inference or unresolved conflict | Safe, correct beyond scope, independently verified, accepted or executable by default |
| `UNSUPPORTED` | An explicit applicable nonclaim/inference exclusion, or a completed bounded evaluation establishing non-support under its named criterion | The world proposition is false; missing evidence alone is insufficient for this state |
| `UNRESOLVED` | A necessary semantic identity, binding, evidence, independence, scope or current-applicability basis is missing or not established | Failed, false or denied |
| `CONFLICTED` | Traceable, admissible and mutually incompatible evidence assertions about the same predicate, subject, scope and applicable time, with no admitted resolution | Merely different sources, a caller contradiction flag, or different time/subject values |
| `STALE` | Preserved historical basis with explicit evidence/rule that it is no longer applicable to the requested reliance time/subject (expiry, revocation, supersession or changed binding) | Historically false; age alone or an unsupported stale label is insufficient |
| `INCONCLUSIVE` | Necessary evaluation inputs are available and applicable, but the admitted method completes without deciding support/non-support (e.g. a recorded inconclusive verification result) | Missing mandatory inputs, verification failure or an extra report disposition |

`NOT_EVALUABLE` and `SUPPORTED_BY_PRODUCER_ASSERTION` may be dimension annotations with provenance; they are not seventh/eighth primary states. Origin, execution occurrence, verification result, verifier independence, integrity, applicability and acceptance remain distinct dimensions. A producer-supported pass claim can coexist with UNRESOLVED independence.

`UNSUPPORTED != UNRESOLVED`. `does_not_support != world proposition is false`. An exclusion describes the inferential capacity of a particular basis. Where other independently bound evidence legitimately supports the proposition, evaluate that basis separately; do not erase the original nonclaim or grant it retroactive support.

## Binding and precedence contract

For any future opt-in evaluation, effective required bindings are the union of registry required_bindings for all admitted contributing entries, applicable Core claim-boundary obligations, admitted contextual requirements, and caller-added requirements. Callers may add obligations, never subtract them. Resolve IDs and versions before collecting obligations. Unknown IDs/versions cannot be filtered out to create support. Missing predicate definitions make the affected evaluation UNRESOLVED.

Every binding needs a named type/value predicate, subject/scope/time association and source reference. Missing, null, empty or whitespace-only strings do not satisfy a nonempty reference. Empty arrays do not satisfy a required witness/evidence set; an explicitly permitted empty set may represent a bounded zero count but proves no event. Boolean false is a present, valid boolean when the binding permits it; it cannot satisfy a predicate requiring true. Zero is valid only for an admitted numeric predicate, never a substitute for a witness. Presence is separate from semantic satisfaction. Caller assertions of binding satisfaction, independent verification or contradiction are not evidence by themselves.

Evaluate each atomic claim and retain all applicable diagnostics. The primary state uses this deterministic selection order:

1. An applicable Core prohibition of the proposed inference yields UNSUPPORTED for that inference, even if caller-positive parts are supplied. Preserve any separate evidence/conflict diagnostics; a nonclaim is not negative world evidence.
2. Otherwise, an established contradictory evidence basis yields CONFLICTED; neither missing collateral data nor a caller preference resolves it.
3. Otherwise, an established stale basis for a current claim yields STALE, while retaining historical support and any missing-data diagnostics.
4. Otherwise, absent or unsatisfied necessary bindings, unknown semantics or missing currentness evidence yield UNRESOLVED. A positively established negative fact can separately support a bounded negative claim; it does not make a missing binding satisfied for a positive claim.
5. Otherwise, an admitted complete positive proof yields SUPPORTED; a completed explicit non-support determination yields UNSUPPORTED; a completed method that cannot decide yields INCONCLUSIVE.

For a composite claim, preserve the atomic results. Whole-claim support requires every required part to be SUPPORTED; no majority vote or generic maturity maximum. Apply the same precedence to blockers of the composite and retain their per-part provenance. If a part merely lacks evidence, the composite cannot become UNSUPPORTED solely from that absence.

Nonclaim precedence is evidence-path scoped: an observation entry cannot prove independent verification, but a separately bound verification event may support its own permitted claim. No caller assertion can override a Core claim boundary. An unresolved basis for the world-level independence question stays UNRESOLVED even when the narrower inference "producer assertion alone establishes independence" is UNSUPPORTED.

## Versioned compatibility projection

This is a future separate, default-off side artifact contract, not a change to EvidencePackV1, MESR results, EAK results or report JSON. It retains source surface/version, exact legacy value, claim identity, subject/scope, evidence refs, registry/module versions and digests, method version, evaluation_time, primary state, dimension annotations, missing bindings, applied nonclaims and rationale. Missing source basis is recorded explicitly; no evaluator time is substituted for an event time. A projection cannot claim faithful round-trip enum equivalence.

The table supplies candidate routing only. All routes must pass the binding/precedence rules above; legacy labels alone never establish stronger claims.

| Legacy input | New projection rule |
|---|---|
| MESR `supports`; EAK `supported` | SUPPORTED only after the new obligations and evidence basis are independently evaluated; label-only input is UNRESOLVED. Existing shortcuts cannot establish independence/integrity. |
| MESR `partially_supports` | Preserve supported parts; whole claim UNRESOLVED for missing parts, INCONCLUSIVE only for complete but undecidable evaluation, or the explicit blocker state when established. |
| MESR `does_not_support` | UNSUPPORTED for its registered excluded inference. For world proposition with merely absent independent basis, UNRESOLVED. Preserve the old relation and boundary ID. |
| MESR `contradicts`; EAK `contradicted` | CONFLICTED only with the defined contradictory evidence basis. A bare flag is UNRESOLVED. A traceable single counterexample under a complete non-support criterion may yield UNSUPPORTED, without inventing an opposing witness. |
| MESR `indeterminate` | UNRESOLVED for missing semantics/bindings; INCONCLUSIVE only when required basis is complete and method is undecidable. No guessed positive. |
| EAK `unsupported` | UNSUPPORTED only with explicit applicable nonclaim or completed non-support basis; otherwise UNRESOLVED, preserving current eakProjection's conservative distinction. |
| EAK `insufficient_evidence` | UNRESOLVED for the requested claim; retain named missing evidence. Not verification failure. |
| EAK `inadmissible` / applicability `not_applicable` | Preserve admissibility as an annotation. Explicit profile exclusion gives UNSUPPORTED for that profile-specific inference; unknown applicability gives UNRESOLVED. Neither asserts world falsity. |
| Temporal `current` | No support implication. Validate explicit current-applicability basis for this claim/time; a supplied label alone gives UNRESOLVED. |
| Temporal `stale`, `revoked`, `superseded` | STALE for current reliance only with explicit applicable evidence/rule; otherwise UNRESOLVED. Preserve historical standing and original temporal value. |
| Temporal `unresolvable` | UNRESOLVED with the missing temporal basis. |
| Pack verification `passed` / EAK `verified` | May support the producer-attributed, bound check result; does not establish independence. |
| Pack verification `failed` / EAK `partially_verified` | Preserve the exact event result and source mapping; partially_verified cannot be universally decoded as failure. Evaluate the specific property, never infer independence. |
| Pack verification `not_run` or no event | Execution not demonstrated (or explicitly recorded not_run); positive verification-occurrence claim UNRESOLVED absent a complete negative criterion. Never infer failed. |
| Pack verification `inconclusive` | INCONCLUSIVE for a bound check with complete method inputs; missing subject/method/time remains UNRESOLVED. |
| Report `allow`, `require_review`, `inconclusive`, `block` | Preserve verbatim as report dispositions. **No direct mapping** to a primary claim state; report-only input leaves any requested assurance claim UNRESOLVED. |

An external normalized `verified` label, nonempty executed_checks, or present digest is insufficient to project independent verification or artifact integrity. Detailed integrity/independence falsifiers belong to B05, sufficiency/report migration to B06, and temporal implementation to B07. This ADR defines their non-inflation boundary without closing those blockers.

## Acceptance

The [negative-case specification](../validation/v8-b02-claim-state-negative-cases-v0.1.md) defines the required falsifiers. These are review oracles, not executed tests or repaired Experiment 3 acceptance. B02 = **PASS** for explicit specification disposition only. No evaluator, enum, report, reason-code, fixture or runtime change is made; B04-B10 and Gate 1 remain blocked/pending later review.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion.
