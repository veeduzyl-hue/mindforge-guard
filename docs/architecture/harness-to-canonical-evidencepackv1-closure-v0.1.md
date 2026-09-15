# Harness to canonical EvidencePackV1 closure v0.1

Status: **B03 SPECIFICATION_ONLY**. This contract closes the specification question, not the integration gap. No adapter, evaluator, schema or report implementation is introduced. Gate 1 remains blocked.

## Pinned contracts and source evidence

| Dimension | Pinned basis |
|---|---|
| Guard engineering source | `30512dff336435f8d1c1bf4b633058c374668eb8` plus `20aa844fe6f0239d5c0d18184cf5faffa366abf5` |
| V8-000 evidence commit | `9d535a9329054d645ad1fc56e36bfe267eb33f26` |
| Input producer | guard-native-agent-harness, package version **0.5.0**, source commit `8116457d2a64e45c2154d9f480e68d40937b6ab0` |
| Input producer schema | `mindforge-guard-evidence.v1`, pack_type `execution_facts` |
| Input bundle manifest | `guard-native-evidence-pack-manifest.v1`, evidence_pack_version `v0.3`; these are independent of producer package version |
| Proposed adapter contract | `harness-canonical-closure/0.1`; specification identifier only, no registered adapter |
| Canonical output | EvidencePackV1, schema_version **1.0.0**, existing JSON Schema draft 2020-12 and current closed runtime validator |
| Assurance / report | Current EAK `0.1.0-poc`; GovernanceReportModel `1.0.0`; neither is changed |

Harness sources are local read-only evidence in `D:/AI project/guard-native-agent-harness`: `src/evidence/schema.ts`, `src/evidence/compatibility.ts`, `src/evidence/manifest.ts`, `package.json`. Compatibility.ts copies producer.version from task.harness_version and pack creation time from task.created_at; it does not independently authenticate either. The supported future input tuple must include exact producer/schema versions and source/bundle digests. Unknown/missing/conflicting versions are rejected; no fallback to an adapter with a similar name.

Guard sources: [schema](../../packages/schema/evidence-schema-v1.json), [parser](../../packages/guard-core/src/parseEvidencePack.ts), [validator](../../packages/guard-core/src/validateEvidencePack.ts), [existing MESR Harness adapter](../../packages/guard-core/src/mesr/producerAdapters/harnessAdapter.ts), [ingest summary bridge](../adapters/harness-evidence-ingest-summary-bridge.md), [external evidence types](../../packages/guard-core/src/externalEvidence/types.ts), [EAK](../../packages/guard-core/src/evidenceAssuranceKernel.ts), [report generation](../../packages/guard-core/src/generateGovernanceReport.ts). Read alongside the frozen [reconciliation](../planning/13_V8_000_SOURCE_RECONCILIATION.md).

The existing MESR Harness adapter expects `pack_version` and `records` (`harness-evidence-pack/v0.1`). The ingest bridge emits a preview summary. Neither is a normalizer for the actual producer into EvidencePackV1. External-evidence normalization also has its own contract; names do not establish interchangeability.

## Gap disposition

| Classification | Source-backed gap | Closure specification |
|---|---|---|
| `SCHEMA_COMPATIBILITY_GAP` | Different version/pack_type, field names, required nested keys and verification object vs array | Exact input tuple, explicit field map, then canonical structural validation |
| `SEMANTIC_COMPATIBILITY_GAP` | Producer-only authority flags, action summaries and verification counts are not authority or verification events | Preserve attributed facts and prohibit unsupported claim promotion |
| `PROVENANCE_GAP` | Missing owner/actor/authority basis; no general custody or event-verifier basis; pack manifest is only a reference | Preserve raw bytes, native identities/times and explicit missing-fact records; bind actual bytes before digest claims |
| `ASSURANCE_INTERFACE_GAP` | No canonical Harness -> EAK -> GovernanceReport path; EAK accepts typed input without validating contract | Explicit admission, handoff and separate report projection boundaries |

**PURE_ADAPTER_GAP alone is rejected.** B03 PASS does not mean these integration gaps have been implemented away.

## Field source and missing-fact rules

The [field/provenance map](../adapters/harness-canonical-field-provenance-map-v0.1.md) assigns exactly one source class to every canonical required-in-parent field/variant (137 records from the 194-record V8-000 inventory):

- `DIRECT_FROM_HARNESS`: copy the named source value without strengthening its meaning; source validity and expected type must still be checked.
- `DERIVED_WITH_EXPLICIT_RULE`: a recorded, deterministic transformation with exact inputs and rule, including structural assembly or new artifact identifiers; never an invented real-world fact.
- `EXTERNAL_REQUIRED`: identified supplementary evidence or declared context from a named supplier is necessary and is not present in the producer contract. Its absence prevents emission of an affected non-null required field.
- `UNAVAILABLE`: no admitted basis/rule for this datum from the pinned producer input; record the gap, not a guessed value. A separately scoped future supplementary evidence contract is needed.
- `NOT_APPLICABLE_BY_SCENARIO`: only an explicitly unselected schema variant or omitted optional section; never an excuse to omit a required top-level field or fill a false fact.

The baseline selects generic_agent_workflow / generic only as a structural classification of local execution_facts. This does not establish software-change scope, repository identity, authority, safety or verification. Software-change/release/cyber-specific normalization needs a separately admitted scenario and is not smuggled through defaults. The generic classification does not itself make a pack valid.

Every future conversion has exactly one outcome category in a **separate closure receipt**, not a new public Guard enum:

| Outcome | Rule |
|---|---|
| `MISSING_FACTS` | Input is intelligible, but required canonical facts cannot be represented truthfully. Preserve raw input and a non-canonical candidate/field-gap ledger; **canonical output is absent**, no EAK/report call. |
| `REJECTED` | Unsupported version, invalid input, unsafe/unresolvable reference, digest mismatch, duplicate/conflicting identity, contradictory task linkage, or failed canonical validation. Retain deterministic diagnostic refs; canonical output absent. |
| `CANONICAL_STRUCTURALLY_VALID` | Every required field has an admitted source, selected variants and values pass both canonical boundaries, and the raw/field provenance receipt is complete. This does not assert evidence sufficiency, independence or truth. |

The receipt records contract/input versions, original source digest, raw references, field pointers, source class/rule, supplied provenance, missing/rejection reason, applicable scenario, byte-check results and canonical validation diagnostics. These diagnostic labels are receipt-local, not canonical reason codes. Optional extensions may carry a namespaced reference to it only in a later admitted implementation; this specification adds no JSON fields.

No required canonical owner, authority, time, provenance or verification fact may be fabricated. Do not use `unknown`, the producer ID, adapter ID, current user, current clock, empty string or a synthetic boolean to satisfy a missing non-null factual field. Schema-permitted null represents only a documented unavailable optional value in a required nullable slot. An empty array means no records represented in the bounded input, never that no real-world events exist. Do not discard an unrepresentable nonempty source record to manufacture an empty valid array.

## Raw evidence, event and byte rules

R1. Preserve the original compatibility pack bytes, task/plan files, JSONL events, command results, guard results, final report, manifest and supplied artifacts without rewriting originals. Record all submitted members and absent expected members. Workspace paths and hashes are declarations until checked. Preserve source ordering and JSON pointers/line numbers. Redacted derivatives are distinct bytes with separate digests and a transformation record; never claim the raw and redacted digests are interchangeable.

R2. Canonical pack_id is the structural namespace `hcc-0.1:` followed by SHA-256 of the original producer pack bytes; native pack_id/task_id remain in the receipt. This ID is an adapter artifact identity, not an event/principal identity. Canonical created_at retains the producer pack creation-time declaration. Adapter observation time is a separate receipt value and must not replace task/event time.

R3. Preserve native action_id and event_id, with their source record namespace, task_id, timestamp and byte reference. Tool and blocked-action IDs retain event_id in their distinct canonical collections; receipt cross-references disambiguate them. Reject duplicate IDs within a collection or conflicting duplicates. A matching command_result.event_id may join only within the same task and with consistent command/tool context; preserve both timestamps. Do not attach unrelated command output. Harness action-to-attempt matching is a producer-derived association, not independently proved causality.

R4. Action completed -> succeeded, failed -> failed, blocked -> blocked preserves **producer-reported execution status only**. Native not_recorded does not become skipped, failed or successful; a missing event/time produces MISSING_FACTS when needed for an action row. Do not invent timestamps. run_command success or exit_code 0 never creates a verification-passed event. Unknown tool semantics require external classification; read_file/write_file/run_command retain their exact named action categories, other named invocations may only become call_tool.

R5. Artifact bytes must be supplied through explicit bundle references, resolved within the admitted input root with no traversal or silent external lookup. Record exact bytes, byte length and SHA-256. A source manifest hash is a declaration: compare it to freshly read bytes and retain expected/observed digest plus checker identity/version/time. Mismatch rejects; missing required bytes creates MISSING_FACTS. Character counts cannot become byte lengths. Hash presence != artifact integrity verified; successful local byte comparison != independent custody or real-world truth.

R6. Source_pack_hash is SHA-256 over the original compatibility pack bytes, never the transformed output or a reserialized JSON object. Manifest files describe the retained, explicitly enumerated evidence members, each with their checked bytes/size/hash. Include the source pack as a distinct raw member; do not create a circular self-hash of the canonical output. Completeness is relative to the admitted bundle inventory, not universal evidence sufficiency. `complete` requires every listed required member checked and no unresolved member; otherwise withhold canonical closure on required gaps. Do not relabel unknown completeness as complete.

R7. Verification requires actual attributable event/property/method/subject/scope/result/time evidence. The current Harness verification counts/paths are preserved as raw producer metadata and cannot supply a canonical verification row. With no events supplied, an explicitly scoped empty verification array means none represented and UNRESOLVED verification; it is not a not_run event. Enriched events require a later admitted event mapping. Producer verification != independent verification; B05 retains the principal/custody falsifiers. Acceptance occurrence != acceptance authority.

## Canonical and downstream boundaries

First validate the admitted producer tuple, raw bundle membership and provenance. Assemble only sourced canonical values under the closed schema. Then require `parseEvidencePack` and `validateEvidencePack` success and conformance to the pinned JSON schema (including selected oneOf branches). Parser success is only parsing/object-shape success. Never cast a failed candidate into EvidencePackV1 to bypass validation. Any discrepancy between schema and validator must be reported and separately resolved, not patched in this phase.

Canonical validation checks structure, enums, time/hash syntax and closed keys. It does not authenticate owners, verify authority, read artifact bytes, establish independence, prove sufficiency or perform execution. Byte checks and their limited conclusions are explicit receipt evidence outside that structural boundary.

EAK handoff may occur only in a later separately admitted, default-off integration after canonical validation. The caller must supply the validated pack plus explicitly admitted auxiliary evidence contracts; a typed argument is not validation. No receipt-only assertion becomes an EAK fact automatically. Current PoC status shortcuts remain documented debt; [ADR 0011](../adr/0011-mesr-claim-nonclaim-state-and-binding-contract.md) governs future claim projection without changing current results.

GovernanceReportModel remains unchanged. A future report call uses the canonical validated pack and existing generator rules; a future semantic provenance/assurance artifact is separate and explicitly versioned. There is no automatic EAK-state -> report-verdict mapping. Report allow remains a bounded recommendation, not execution permission, safety, sufficiency proof or acceptance. B06 owns any later report migration choice.

## Invariants and future acceptance cases

Harness Producer compatibility != Canonical EvidencePackV1 compatibility.

Harness ingestion bridge != Canonical Harness -> EAK -> GovernanceReport integration.

Execution success != Verification passed. Producer verification != Independent verification. Declared owner/authority != Verified owner/authority. Hash presence != Artifact integrity verified.

Before separately scoped implementation, future fixtures must cover: raw tuple mismatch; missing owner/repository/model/actor; not_recorded action with null time; duplicate and cross-task event joins; no verification events; producer pass without independence; missing artifact bytes and digest mismatch; character/byte count differences; unknown block reason and absent review requirement; nonempty unrepresentable records; schema/parser/validator disagreement; rejected handoff and unchanged report serialization. **These fixtures are not created or run in Phase A.**

B03 = **PASS** for specification closure: all four gap classes, all required field sources and all downstream boundaries have explicit disposition. Integration remains unavailable until missing facts, later contracts and implementation gates are satisfied. No Harness implementation, Evidence Contract, Governance Report, reason code, Experiment 2B or repaired Experiment 3 change occurs.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion or runtime takeover.
