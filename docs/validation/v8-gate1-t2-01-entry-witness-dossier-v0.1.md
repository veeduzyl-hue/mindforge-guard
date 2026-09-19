# T2-01 entry witness dossier v0.1

Date: 2026-09-19. Planning/validation witnesses only; no implementation fixtures or product execution. Source HEAD: `56171e4405bc123b8c64aeb3fff747598b489428`. Read with the [serialization contract](../architecture/t2-01-internal-event-result-serialization-v0.1.md) and [entry review](../planning/25_T2_01_IMPLEMENTATION_ENTRY_REVIEW.md).

## Truthfulness and provenance

The following are explicitly authored **synthetic planning declarations**, not evidence that a real check ran, not captured Harness data, and not implementation PASS results. Literal event IDs, timestamps, actors and criteria are supplied as hypothetical inputs here; a future evaluator must never generate these values for missing production evidence. The witness author is this dossier; each JSON pointer is its field-level source. Test records assert a named check and retain its input/output; they do not authenticate that assertion, prove bytes or establish independence.

W01-W03 below are separate, complete input documents. Reusing the same hypothetical event identifier across alternative scenarios does not merge their worlds. All references resolve within each document. Their timestamps are scenario facts, not the tool clock. The checked property and criterion are deliberately bounded. The records' source_namespace/source_ref identify the supplied record; provenance is a direct pointer into that record. No web or filesystem URI is fetched.

## Complete passed witness W01

```json
{
  "contract_version": "t2-01-private-event-result/0.1",
  "requested_dimension": "occurrence_and_result",
  "target": {"subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17"},
  "occurrence_ref":"w:event","result_refs":["w:result"],
  "records": {
    "w:event": {"kind":"verification_occurrence","source_namespace":"planning-witness","source_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","output_refs":["w:output"]},
    "w:result": {"kind":"verification_result","source_namespace":"planning-witness","source_ref":"w:result","event_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","input_ref":"w:input","output_ref":"w:output","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"passed","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim."},
    "w:input": {"kind":"input","source_namespace":"planning-witness","source_ref":"w:input","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","content":{"token":""}},
    "w:output": {"kind":"output","source_namespace":"planning-witness","source_ref":"w:output","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","input_ref":"w:input","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"passed","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim.","content":{"observed":"empty token rejected"}}
  }
}
```

Expected private annotation: ATTRIBUTABLE_OCCURRENCE_WITH_RESULT; exact result passed. The record supports only the attributed check result under this criterion. There is no claim_evaluation without separately supplied canonical evaluation context.

## Complete failed witness W02

```json
{
  "contract_version": "t2-01-private-event-result/0.1",
  "requested_dimension": "occurrence_and_result",
  "target": {"subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17"},
  "occurrence_ref":"w:event","result_refs":["w:result"],
  "records": {
    "w:event": {"kind":"verification_occurrence","source_namespace":"planning-witness","source_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","output_refs":["w:output"]},
    "w:result": {"kind":"verification_result","source_namespace":"planning-witness","source_ref":"w:result","event_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","input_ref":"w:input","output_ref":"w:output","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"failed","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim."},
    "w:input": {"kind":"input","source_namespace":"planning-witness","source_ref":"w:input","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","content":{"token":""}},
    "w:output": {"kind":"output","source_namespace":"planning-witness","source_ref":"w:output","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","input_ref":"w:input","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"failed","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim.","content":{"observed":"empty token accepted"}}
  }
}
```

Expected private annotation: ATTRIBUTABLE_OCCURRENCE_WITH_RESULT; exact result failed. Failure is an attributable completed result, not absent occurrence. A future fully bound T1 pass claim uses its existing completed-non-support criterion; the private annotation itself chooses no primary state.

## Complete inconclusive witness W03

```json
{
  "contract_version": "t2-01-private-event-result/0.1",
  "requested_dimension": "occurrence_and_result",
  "target": {"subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17"},
  "occurrence_ref":"w:event","result_refs":["w:result"],
  "records": {
    "w:event": {"kind":"verification_occurrence","source_namespace":"planning-witness","source_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","output_refs":["w:output"]},
    "w:result": {"kind":"verification_result","source_namespace":"planning-witness","source_ref":"w:result","event_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","input_ref":"w:input","output_ref":"w:output","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"inconclusive","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim."},
    "w:input": {"kind":"input","source_namespace":"planning-witness","source_ref":"w:input","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","content":{"token":""}},
    "w:output": {"kind":"output","source_namespace":"planning-witness","source_ref":"w:output","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","input_ref":"w:input","criterion":"Pass iff empty token is rejected; fail iff accepted; inconclusive iff the instrument records no decision.","result":"inconclusive","limitations":"One declared parser case; producer-attributed; no integrity or independent-check claim.","content":{"observed":"instrument completed with no decision"}}
  }
}
```

Expected private annotation: ATTRIBUTABLE_OCCURRENCE_WITH_RESULT; exact result inconclusive. All mandatory result facts are supplied. This differs from an unknown result or incomplete method input.

## Complete occurrence with result unresolved W04

```json
{
  "contract_version":"t2-01-private-event-result/0.1",
  "requested_dimension":"occurrence_and_result",
  "target":{"subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17"},
  "occurrence_ref":"w:event","result_refs":[],
  "records":{
    "w:event":{"kind":"verification_occurrence","source_namespace":"planning-witness","source_ref":"w:event","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","producer":"sample-ci/1.0","verifier":"sample-checker/1.0","output_refs":["w:output"]},
    "w:output":{"kind":"output","source_namespace":"planning-witness","source_ref":"w:output","event_id":"check-17","subject":"sample/change-17","revision":"revision-a","scope":"parser-case-17","checked_property":"rejects-empty-token","method":"parser-case-check","method_version":"1.0.0","event_time":"2026-09-18T10:00:00Z","content":{"observed":"named check invocation recorded; result not supplied"}}
  }
}
```

Expected annotation: ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED. Missing result/criterion/input/limitations remain missing. Existing stronger verification.occurred cannot gain support from this record. W04o uses this exact explicit input with only requested_dimension replaced by occurrence: ATTRIBUTABLE_OCCURRENCE; result was not requested, and no result claim is made. This request choice is not a factual default.

## Falsifier and conflict inventory

The following edits are exact planning witness definitions over the literal base, not evaluator repair rules. Every unmentioned supplied field is retained verbatim. Removal means absent, never null/default substitution. Future controls should separately cover null, empty, whitespace and wrong types. Expected annotations abbreviate NO_ATTRIBUTABLE_OCCURRENCE as NO and ATTRIBUTABLE_OCCURRENCE_RESULT_UNRESOLVED as RESULT_UNRESOLVED below; these abbreviations are not serialized values.

| ID | Explicit witness input | Expected finding |
|---|---|---|
| W05 | W01 remove records[w:event].event_id | NO; event identity missing, no ID generated from ref/hash |
| W06 | W01 remove records[w:event].subject | NO; target subject cannot fill the event |
| W07 | W01 remove records[w:event].scope | NO; scope missing; command/target scope cannot fill it |
| W08a | W01 remove records[w:event].method | NO; no method from producer/tool name |
| W08b | W01 remove records[w:event].method_version | NO; producer version cannot fill method version |
| W09 | W01 remove records[w:event].event_time | NO; no evaluation/current-clock substitution |
| W10 | W01 remove records[w:result].criterion | RESULT_UNRESOLVED; output criterion must not silently repair the selected result record |
| W11 | W01 remove records[w:result].event_ref | RESULT_UNRESOLVED; no join by proximity or matching status |
| W12 | W01 replace records[w:result].revision with revision-b | RESULT_UNRESOLVED; same event label does not transfer across revisions; repeat with scope other-case and time 2026-09-18T11:00:00Z as separate controls |
| W13 | Exact union construction below | RESULT_UNRESOLVED with both admissible results retained and conflict diagnostic; never failed by majority or passed by preference |
| W14 | Keep W01 target/control fields; remove occurrence_ref; result_refs=[]; replace records with {"w:command":{"kind":"command_result","event_id":"command-17","exit_code":0}} | NO; execution success supplies no verification event |
| W15 | Same empty event selection; records={"w:aggregate":{"passed":8,"failed":0,"paths":["reports/tests.json"]}} | NO; counts/path supply no event, method, verifier or result association |
| W16 | Same empty event selection; records={"w:assertion":{"producer":"sample-ci/1.0","verified":true,"status":"passed"}} | NO; producer assertion alone cannot establish bound occurrence |
| W17 | W01 remove records[w:result].result | RESULT_UNRESOLVED; no status copied from output or default inconclusive |
| W18 | W01 remove records[w:result].limitations | RESULT_UNRESOLVED; no default none |
| W19 | W01 remove records[w:event].verifier | NO; producer identity cannot invent checker attribution |
| W20 | W01 remove records[w:input] | RESULT_UNRESOLVED; retained ref alone is not input witness |
| W21 | W01 remove records[w:output] | NO; output witness missing |
| W22 | W01 remove records[w:event].source_namespace | NO; namespace missing |
| W23 | W01 remove records[w:event].checked_property | NO; method name cannot invent checked property |
| W24 | W01 remove records[w:event].revision | NO; target revision is not event revision |
| W25 | W01 replace records[w:result].source_namespace with other-producer | RESULT_UNRESOLVED; no implicit cross-namespace mapping |

W13 is the explicit union of the full W01 and W02 declarations in one context: keep W01 target and event facts; set occurrence.output_refs=["w:output-pass","w:output-fail"], result_refs=["w:result-pass","w:result-fail"]. Copy W01 result/output records to the pass keys and W02 result/output records to the fail keys. In each copied record set source_ref to its new exact key, and each result.output_ref to its matching new output key. Keep event_ref=w:event, input_ref=w:input, identical event_id/property/method/version/criterion/subject/revision/scope/time and both original content/result/limitations. Retain the full W01 input record once. Delete the superseded w:result/w:output keys. This explicitly supplies two incompatible, individually attributable outcomes, not two different checks. No output is overwritten. A future T1 claim evaluation with complete canonical context must retain both and use existing same-predicate-subject-scope-time/0.1 conflict selection for the pass claim. No new conflict state or side selector is introduced.

## Harness truthfulness map

Availability below concerns the exact stated fact strength. Repository evidence only: [B03](../architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md) R3/R4/R7 and [field map](../adapters/harness-canonical-field-provenance-map-v0.1.md). Pin: guard-native-agent-harness 0.5.0, source `8116457d2a64e45c2154d9f480e68d40937b6ab0`; no latest Harness checkout was examined. These classifications are not claims that any actual values were supplied in this task.

| Fact at stated strength | Classification | Source and limitation |
|---|---|---|
| Original canonical verification_id | AVAILABLE_CURRENT_GUARD_INPUT | Evidence schema $defs.verification; row identity does not prove native event |
| Native verification event_id | MISSING_CURRENT_HARNESS | Tool event IDs are execution IDs; no conversion |
| Verification source namespace/reference | MISSING_CURRENT_HARNESS | R3 namespaces apply to observed execution joins, not invented checks |
| Event-bound subject/revision | MISSING_CURRENT_HARNESS | General pack metadata does not bind a check |
| Event scope | MISSING_CURRENT_HARNESS | Counts/paths do not establish scope |
| Checked property | MISSING_CURRENT_HARNESS | R7 lacks event/property mapping |
| Check method | MISSING_CURRENT_HARNESS | Tool/command/type labels insufficient |
| Method version | MISSING_CURRENT_HARNESS | Producer version is different metadata |
| Actual verification time | MISSING_CURRENT_HARNESS | Tool timestamp is not verification time |
| Input association | MISSING_CURRENT_HARNESS | No bound verification input witness |
| Output association | MISSING_CURRENT_HARNESS | No bound verification output witness |
| Pass/fail criterion | MISSING_CURRENT_HARNESS | Exit 0 is not check criterion evidence |
| Raw canonical status | AVAILABLE_CURRENT_GUARD_INPUT | passed/failed/not_run/inconclusive declarations; no association implied |
| Attributed bound result | MISSING_CURRENT_HARNESS | Aggregate statuses do not supply result event |
| Event-to-result association | MISSING_CURRENT_HARNESS | No admitted native verification join |
| Event-bound checker attribution | MISSING_CURRENT_HARNESS | Generated projection verifier ID is not actual checker |
| Event-bound producer attribution | MISSING_CURRENT_HARNESS | Raw pack producer does not prove producer-to-check linkage |
| Raw producer identity/version/generated_by | AVAILABLE_CURRENT_HARNESS | /producer/id, /producer/version, /provenance/generated_by; declarations only |
| Sourced result limitations | MISSING_CURRENT_HARNESS | Not inferable from nullable coverage_note |
| Original artifact_refs | AVAILABLE_CURRENT_GUARD_INPUT | References do not establish input/output roles or integrity |
| Raw verification_type/command/coverage_note | AVAILABLE_CURRENT_GUARD_INPUT | Preserve; not replacements for method/version/scope/criterion |
| Real enriched Harness verification mapping | REQUIRES_G03_OR_FUTURE_ADAPTER | Must be separately admitted against actual events; no modification here |
| Bytes/recomputation/equality assurance | REQUIRES_G03_OR_FUTURE_ADAPTER | Current Harness declarations insufficient; proof method owned by T2-02 |
| Authenticated checker/control/separation/custody | REQUIRES_G03_OR_FUTURE_ADAPTER | Supplementary proof owned by T2-03; no identity issuance here |

The future-adapter classification does not transfer T2-02/03 ownership to G03 or prohibit explicitly supplied non-Harness offline records. EvidencePackV1 verification fields/statuses remain unchanged. G03 stays OPEN; no empty array becomes a failed/not_run event.

## Scope inspection and limits

Recovery commands observed clean worktree and exact planning HEAD. Only the three authorized entry Markdown paths were written. Document validation covers embedded JSON parsing, reference presence/context consistency in the four full witnesses, local links and whitespace/scope inspection; it does not execute the planned product predicates or claim-state evaluator. Historical T1/compiler/regression evidence is accepted in its original context, not revalidated here.

Required implementation acceptance remains future work: actual before/after observations, T1 extra-obligation enforcement, preservation of conflicts and nonclaims, complete/incomplete inconclusive distinction, existing B09 task slices, import/default-off isolation and selected public regressions. No product tests, Harness changes, verifier edits, implementation fixtures, commit of these documents, merge, tag or release.

Planning findings: truthful witnesses PASS; missing-fact preservation PASS; T2-02/T2-03 boundaries PASS; T1-03/T1-04 preserved by unchanged-source delegation design. No implementation PASS is claimed. Public migration NO; authority expansion NO; product implementation started NO.

Recorded document checks: four embedded JSON blocks parsed successfully; W01-W04 source keys, selected references and supplied event/result/output context comparisons passed. Relative Markdown targets resolved and no trailing whitespace was found. `git diff --check` exited 0; tracked and staged name diffs were empty; untracked enumeration contained exactly the three authorized entry documents. HEAD remained `56171e4405bc123b8c64aeb3fff747598b489428`. These are document/scope checks only, not execution of a T2-01 evaluator.
