# T2-01 attributable verification occurrence/result contract v0.1

Status: CANDIDATE_PLANNING_ONLY; uncommitted for owner review. T2-01 / G05. This scopes the occurrence/result portion of ADR 0013's verification-independence-integrity/0.1; the filename does not register a canonical semantic ID or public contract. No implementation authorization.

Sources: [ADR 0013](../adr/0013-independent-verification-and-integrity-evidence-contract.md), [ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md), [B03 R3/R4/R7](harness-to-canonical-evidencepackv1-closure-v0.1.md), [task card](../planning/21_GATE1_IMPLEMENTATION_PLAN.md#t2-01---attributable-verification-occurrence-and-result). See the [field inventory](../validation/v8-gate1-t2-01-planning-evidence-v0.1.md#fieldsource-inventory).

## Definitions and minimum attribution

Verification occurrence means a named check is represented by retained, attributable event evidence in a bound captured context. A report verdict, producer success flag, aggregate count, command exit, nonempty array or generated projection ID cannot establish it. A producer record containing actual bound event evidence may establish a producer-attributed occurrence, with provenance limitations retained; a bare claim does not replace the basis.

Verification result is the exact attributed outcome of that same check under its recorded method and criterion. A failed check can have an attributable occurrence and failed result. A result assertion lacking occurrence basis remains a supplied assertion with unresolved association, not an established check result.

ADR 0013's required occurrence basis:

- Native event identity and source namespace/record reference; producer and verifier attribution bound to the check.
- Subject revision/artifact identity or declared digest, scope and checked_property/claim_set.
- Method ID/version, actual event_time, retained event/output references.

Result additionally requires exact outcome, method's pass/fail criterion, inputs, outputs and limitations. A complete method can return inconclusive; missing inputs do not become a completed inconclusive result. Limitations need a source; an empty default does not prove none exist.

References must point to retained attributable records; a URI string alone is not a witness. Attribution is not authenticated identity, separation or authority. Missing verifier authentication may leave independence unresolved while preserving a separately and sufficiently bound producer-attributed result, as ADR 0013 allows. Missing even check attribution cannot be repaired with producer software identity or an invented verifier.

These are side-evaluation requirements, not added canonical pack fields. Exact internal names, serialization and existing canonical anchor bindings await the implementation-entry dossier. ADR fact names describe obligations, not a new public schema.

## Required versus optional facts

All occurrence groups above are required for full attributable occurrence. Additional result groups are required for a bound result. Original verification_id/status/artifact_refs and producer fields are retained when supplied, but do not guarantee those associations.

Canonical command and coverage_note are nullable and not universally required by T2-01. Preserve supplied values without silently treating them as method or scope. verification_type is source metadata, not a versioned method. Bound inputs/input_ref are required for result; this contract adds no separate universal input_ref occurrence requirement beyond ADR 0013's subject/event/output basis. Subject digest declarations are identifiers, not byte-integrity proof.

The existing T1 evaluation retains claim identity, canonical versions/registry digest/module lock, method version, explicit evaluation_time and evidence basis. Evaluation time must not replace event time. No new canonical ID or automatic alias.

## Occurrence/result relationship

These are requested planning descriptions, not repository primary-state names or a new implemented enum. The referenced contracts provide no exact four-value occurrence enum. Preserve exact legacy statuses separately.

| Planning annotation | Meaning |
|---|---|
| NO_ATTRIBUTABLE_VERIFICATION_OCCURRENCE | Insufficient event basis in supplied evidence; does not assert no real-world verification or failure. |
| ATTRIBUTABLE_VERIFICATION_OCCURRED | Occurrence obligations met; no result claim follows. |
| ATTRIBUTABLE_VERIFICATION_OCCURRED_WITH_RESULT | Occurrence and additional result obligations met; preserve exact passed/failed/inconclusive outcome and criterion. A recorded inconclusive outcome is a present result. |
| ATTRIBUTABLE_VERIFICATION_OCCURRED_RESULT_UNRESOLVED | Occurrence established but a required result value/criterion/input/association is missing. |

The last two refine occurrence, not a total claim-state selector. Contradictory admissible results retain both witnesses and delegate conflict selection to T1-03; no last-write/majority resolution or relabeling as missing. Cross-context facts do not establish occurrence for the requested subject/scope/time. Current applicability remains G07.

Canonical statuses remain passed, failed, not_run and inconclusive. not_run, skipped-only rows and absence do not demonstrate occurrence. An explicitly evidenced negative criterion is distinct from absence and must use existing T1 semantics. Never manufacture a not_run/failed event. Do not universally decode old EAK partially_verified as failed.

## Missing facts and provenance

Preserve missing/unresolved basis, raw assertions, source surface/version, exact legacy values, namespaces, record pointers, subject/scope/time associations and limitations. Do not fabricate event ID, verifier, event time, method/version, criterion, scope, inputs, outputs or result from defaults.

B03 R3 permits command_result.event_id joins only within the same task and consistent command/tool context; retain both timestamps and namespaces, reject conflicting duplicates/cross-task joins. This remains producer-derived execution association, not verification. R4 forbids run_command success/exit 0 from creating verification-passed events. R7 preserves aggregates as metadata and an explicitly scoped empty array as no events represented, not a failed/not_run event.

Use explicitly supplied bounded references and preserve originals/transformation provenance. Digest presence cannot establish recomputation, byte equality or verified custody. This planning contract invents no factual values.

## T1-03 and T1-04 interaction

T2-01 supplies factual evidence and missing-fact diagnostics. T1-03 alone selects SUPPORTED, UNSUPPORTED, UNRESOLVED, CONFLICTED, STALE, INCONCLUSIVE. Preserve Core prohibition -> comparable conflict -> proven applicability loss -> missing obligation -> completed determination precedence, with per-claim/evidence-path diagnostics.

Verification occurred != SUPPORTED. Verification passed != SUPPORTED automatically. Verification absent != UNSUPPORTED automatically. Complete inconclusive evidence differs from missing inputs. No direct mapping from occurrence annotations, statuses or report dispositions to claim states. All admitted bindings and nonclaims must be evaluated through T1.

T1-04 admission preserves canonical identity/version/digest, bindings, nonclaims, precedence and Core noninterference. No Core override, removed nonclaim, weakened binding, support widening, silent alias, competing registry or second selector. Resolve existing anchors before implementation; missing bindings do not authorize new semantics.

## Deferrals and nonclaims

- DEFER_TO_T2_02: exact-byte integrity, byte domains/counts, expected/observed digests, recomputation and comparison evidence. No simulation or closure here.
- DEFER_TO_T2_03: authenticated principal identity, separation/control, independence and custody. Retaining event-bound checker attribution remains T2-01; independent identity/custody proof is not its success criterion.
- G03: future truthful Harness facts/mapping/integration. B03-pinned counts/paths cannot supply events; G03 stays OPEN with no Harness/adapter edit.
- G07 current applicability and G06 sufficiency/report association remain later work. G05 stays OPEN.

Verification occurred != Verification independent. Verification result != Verification integrity. Verification passed != Outcome correct, automatic SUPPORTED, authority, accepted, compliant or execution permission. Verification evidence absent != Verification failed. Verification result != Approval, Safe, Institutional Acceptance or Compliance. Evidence != Authority != Execution.

No runtime enforcement, control plane, certification, audit opinion or public migration. Audit output/verdict/exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Canonical schema, EAK buildVerifications, report bytes, public exports, licensing and commercial defaults stay untouched.

## Admission and reversibility

This candidate is PARTIAL for implementation: exact bindings/predicates/serialization and complete attributable witnesses need a reviewed dossier. Future controls/regressions require separate authorization; no execution/test success is claimed here. Withdraw only reviewed new side paths while preserving T1 and all evidence. Fabricated/cross-context facts, old-output changes, a second selector or authority expansion trigger rollback/review.
