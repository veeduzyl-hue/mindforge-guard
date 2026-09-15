# Evidence sufficiency side artifact v0.1

Status: **SPECIFICATION_ONLY / NOT_IMPLEMENTED**. Architecture selected by [ADR 0014](../adr/0014-profile-bound-evidence-sufficiency-and-report-boundary.md): VERSIONED_SIDE_ARTIFACT. This document specifies a future artifact; it adds no schema file, runtime type, report field or evaluator.

## Closed documentation schema

Proposed artifact schema identifier: `guard-evidence-sufficiency-side-artifact/0.1`. Unknown keys or invalid field types produce an artifact-validation error; they are not silently ignored or mapped to report verdicts. A well-formed evaluation with incomplete evidential basis remains a valid diagnostic artifact with state UNRESOLVED, subject to B02 precedence. Required envelope keys may explicitly contain null where stated below, with a matching missing_bindings entry; null never satisfies the claim predicate. No guessed profile, latest registry, empty witness set or current clock fallback.

| Key | Type and constraint | Binding semantics |
|---|---|---|
| schema_version | Exact identifier above | Independent of EvidencePackV1/report versions |
| artifact_id | Nonempty producer-assigned record ID | Identity only; never a support proof |
| source | Object: pack_ref, pack_schema_version, pack_digest, report_reference | pack_ref/version/digest nullable with gaps; digest is algorithm/value for exact source bytes |
| source.report_reference | Null, or object: report_id, report_schema_version, report_digest, byte_representation, evidence_ref | Optional outward link; if present all fields required and resolved. Use 1.0.0 only for an actual 1.0.0 report, not a default |
| subject | Null, or object: subject_id, revision, artifact_refs | Nonempty ID/revision and explicitly associated refs; missing subject -> UNRESOLVED |
| profile_id / profile_version / profile_digest | Nullable nonempty strings / algorithm-value digest | Exact assurance profile and immutable content; not a display profile or mutable latest |
| claim_set_id / claim_set_version / claim_set_digest | Same constrained types | Resolve to frozen nonempty claim list; bind each claim's canonical ID, version, subject/scope and requirements |
| scope | Null, or object: included, excluded, environment_ref | Lists of explicit scope members and environment ref; exclusions may be empty only by explicit scope definition; unspecified scope is not universal |
| evaluation_time | Nullable offset timestamp | Actual supplied evaluation instant; absent -> UNRESOLVED; never pack.created_at or generated_at substitution |
| reliance_time | Nullable offset timestamp | Present when claiming applicability for a distinct intended reliance instant; otherwise evaluation_time is the explicitly declared target. B07 rules apply |
| evidence_refs | Array of typed evidence references | Each ref: ref_id, source_ref, source_pointer, digest, subject_ref, scope_ref, event_time, role. Individual unavailable bindings recorded; an empty array cannot support sufficiency |
| registry | Object: version, digest | Nullable bound values with gaps; unavailable/unknown semantic basis prevents support |
| module_lock | Null, or B08 versioned lock record/reference with digest and resolved modules | Must include exact Core and all contributing module versions/content; invalid composition contributes zero entries |
| method | Object: method_id, method_version, method_digest | Nullable values with gaps; frozen deterministic sufficiency and materiality criteria |
| material_gap_result | Object: status, criterion_ref, evaluated_requirement_ids, gaps, evidence_refs | status is no_material_gap, material_gap, unresolved or inconclusive (dimension result, not primary state); no_material_gap requires complete evaluation against the entire frozen requirement list |
| claim_results | Array of per-claim results | Each: canonical_id/version, subject_ref, scope_ref, state, evidence_refs, missing_bindings, applied_nonclaims, rationale; all required claims represented, including unresolved ones |
| primary_state | Exactly B02's six-state enum | SUPPORTED / UNSUPPORTED / UNRESOLVED / CONFLICTED / STALE / INCONCLUSIVE; not a boolean or report disposition |
| missing_bindings | Array of objects: field, predicate_ref, reason, source_ref | Explicit absent/unsatisfied basis; empty only when all required predicates satisfied |
| applied_nonclaims / limitations | Arrays of attributed exclusions / nonempty limitation statements | Retain Core and applicable module exclusions; no weakening |
| provenance | Object: producer_ref, evaluator_ref, input_set_id, input_digest, transformation_refs, generated_at | Attribution, exact input basis and actual creation event. Missing facts are null with gaps, never synthesized; generated_at != evaluation_time |

Typed digests are `{algorithm, value}` with an admitted algorithm and matching syntax. Reference resolution records exact byte domains; presence alone is not B05 integrity. Gap entries name requirement_id, materiality rule, missing/unsatisfied predicate and evidence refs. Claimed non-materiality requires the profile's explicit rule and evidence; arbitrary omission is not allowed. Empty gaps is not equivalent to no_material_gap unless complete requirement evaluation is proved.

For deterministic replay, pin input bytes and every profile/claim/registry/module/method digest and both requested times. Preserve evidence/event array order; use canonical key ordering and sort set-valued bindings/diagnostics by explicit field tuples under the admitted method. Artifact generation time is recorded input metadata; it is not a hidden clock read by semantic evaluation. An envelope hash proves reproducibility only for those bytes, not truth or sufficiency.

## Evaluation contract

1. Resolve identities/versions and validate B08 composition atomically. Unknown/invalid basis is recorded; do not drop an unresolved claim or substitute another registry.
2. Build the B02 union of Core, entry, admitted contextual/profile and caller-added requirements. Reject attempts to subtract obligations; preserve applicable nonclaim exclusions.
3. Evaluate evidence associations, B05 integrity/independence requirements when required by the profile, and B07 applicability. Preserve atomic claim results and source attribution.
4. Evaluate the full profile requirement list and materiality criteria. Missing profile, claim set, scope, time, evidence or gap criterion means UNRESOLVED. Complete but undecidable gap evaluation gives INCONCLUSIVE. Traceable material gaps under a completed criterion give UNSUPPORTED for sufficiency. Apply higher-priority Core prohibition, conflict or stale states per B02.
5. SUPPORTED requires all required atomic claims SUPPORTED, every necessary binding satisfied, all material-gap checks completed with no_material_gap and no unresolved applicable conflict/exclusion. A count, legacy allow or integrity hash is never a substitute.

## Report reference behavior

Link **side artifact -> report**, never report -> side artifact in 1.0.0. Bind report ID, schema version, exact serialized bytes/digest and source-pack association. If no report is supplied, report_reference is null and standalone evaluation can proceed if its independent basis is complete. If a supplied report link is unresolved/mismatched, retain a link diagnostic and do not claim linkage; a consumer must not attach the result to that report. This does not silently change an otherwise independent sufficiency claim, unless the profile itself requires the link. No self-referential hash or mutation of old report bytes.

No verdict mutation, reason-code rewriting, index injection, renderer annotation or CLI change. No automatic switch from preview to final and no institutional decision authority. Explicit opt-in is needed in a later implementation task; Phase B creates only this specification.

## Specification oracles (NOT_EXECUTED)

| ID | Basis | Expected result |
|---|---|---|
| S01 | Legacy allow and no separate sufficiency basis | Legacy report unchanged; sufficiency UNRESOLVED |
| S02 | Remove each of profile_id, claim_set_id, scope, evaluation_time, evidence_refs or material_gap_result basis in turn | UNRESOLVED with exact missing obligation, not sufficient=false |
| S03 | Unknown registry version/digest, missing method version or unresolved module lock | UNRESOLVED; invalid composition supplies zero admitted semantic entries |
| S04 | Complete bound profile/claim set, every required atomic result SUPPORTED, no_material_gap under completed criterion | Sufficiency SUPPORTED only for bound scope/time; acceptance still separate |
| S05 | Complete evaluation establishes an unfulfilled material requirement | Sufficiency UNSUPPORTED with criterion/ref; underlying action is not automatically false/unsafe |
| S06 | Material-gap field says no_material_gap but requirement coverage incomplete | UNRESOLVED; empty gaps does not pass |
| S07 | Caller/profile omits a registry-required witness, supplies false for true predicate or [] for witnesses | UNRESOLVED for unsatisfied predicate; explicit prohibited weakening inference UNSUPPORTED |
| S08 | Conflict or explicit stale applicability with collateral gaps | B02 CONFLICTED or STALE precedence; preserve gaps and history |
| S09 | All mandatory inputs available but complete method cannot decide materiality | INCONCLUSIVE, not absent evidence |
| S10 | Legacy require_review with independently sufficient evidence | Both retained; no override to allow or acceptance |
| S11 | Report ID matches but bound bytes differ, or report link absent | Mismatch prevents association; absence permits standalone result only when profile does not require report. Legacy bytes unchanged |
| S12 | Presentation profile/crosswalk rewrites labels or hides a required claim | Labels cannot change support; hidden required claim remains evaluated/unresolved; semantic participation rejected under B08 |
| S13 | Harness lacks canonical facts required by B03 | No synthesized pack/check/authority; evaluation records gaps, never sufficient |

These oracles close the architecture choice and validation design only. GovernanceReportModel remains 1.0.0. Gate 1 remains BLOCKED; B09/B10 are not started.
