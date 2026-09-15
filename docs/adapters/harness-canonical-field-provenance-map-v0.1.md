# Harness canonical field/provenance map v0.1

Status: **SPECIFICATION_ONLY**. Companion to the [B03 closure contract](../architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md); its R1-R7 rules and missing/rejection behavior are normative. This table is not adapter output and contains no invented instance values.

Source: the immutable [V8-000 JSON inventory](../mesr/implementation-reconciliation.v0.1.json) at `9d535a9329054d645ad1fc56e36bfe267eb33f26`, reconciled to [Evidence Schema v1](../../packages/schema/evidence-schema-v1.json). It contains 194 total field/variant records, of which **137** have required_in_parent=true. All 137 appear exactly once below, including required fields nested in optional sections and alternative variants. The 18 required top-level fields are included. The other 57 records describe optional fields or array item shapes, not additional required properties; their type/closed-key constraints still apply when selected.

Each row uses exactly one of DIRECT_FROM_HARNESS, DERIVED_WITH_EXPLICIT_RULE, EXTERNAL_REQUIRED, UNAVAILABLE, NOT_APPLICABLE_BY_SCENARIO. Source pointers without a prefix refer to the original Harness compatibility pack. `manifest-file` refers to the separately retained Harness evidence-manifest.json. `external` denotes an identified needed source, **not evidence already supplied**.

The baseline selects string variants for generated_by, repository, model and action target; object alternatives are not selected. Optional plan, policy_observations and human_review are omitted from the canonical candidate and preserved raw where present. N/A rows apply only to these choices. No required top-level field is N/A. A structured parent marked DERIVED_WITH_EXPLICIT_RULE means assembly from its child rows, not that its missing children are available.

Direct copies must pass source/type checks. A missing direct input is MISSING_FACTS, not permission to synthesize. A derivation whose preconditions fail also yields MISSING_FACTS, or REJECTED for contradictory/malformed input. External-required and unavailable non-null required values prevent canonical emission. Nullable slots may carry null only with an explicit missing-value record. Empty collections retain a bounded no-records meaning; they cannot hide an unrepresentable source record. Enum mappings below do not change Guard's existing reason-code behavior.

## Required field and variant inventory

| Canonical field/variant | Source class | Source or exact bounded derivation / missing-fact rule |
|---|---|---|
| `/schema_version` | DERIVED_WITH_EXPLICIT_RULE | Output contract literal 1.0.0; not a rewrite of the retained input version. |
| `/pack_id` | DERIVED_WITH_EXPLICIT_RULE | R2: hcc-0.1: plus SHA-256 of original producer pack bytes; preserve native ID separately. |
| `/pack_type` | DERIVED_WITH_EXPLICIT_RULE | Generic baseline classification generic_agent_workflow; no software-change claim. |
| `/created_at` | DIRECT_FROM_HARNESS | /created_at, producer pack/task creation declaration; do not substitute adapter time. |
| `/producer` | DERIVED_WITH_EXPLICIT_RULE | Assemble only sourced child values below; preserve original producer metadata. |
| `/producer/producer_id` | DIRECT_FROM_HARNESS | /producer/id. |
| `/producer/producer_name` | DERIVED_WITH_EXPLICIT_RULE | Use /producer/id as a display label, with source attribution; no verified name claim. |
| `/producer/producer_version` | DIRECT_FROM_HARNESS | /producer/version; must match admitted 0.5.0 tuple. |
| `/producer/producer_type` | DERIVED_WITH_EXPLICIT_RULE | guard_harness for the exact admitted producer identity; structural type only. |
| `/producer/profile` | EXTERNAL_REQUIRED | External ingestion/review context must select an evidenced canonical profile; local mode alone does not imply local-dev review purpose. |
| `/producer/generated_by` | DIRECT_FROM_HARNESS | /provenance/generated_by as original producer attribution; adapter identity is separate in receipt. |
| `/producer/generated_by{oneOf:0}` | DIRECT_FROM_HARNESS | Same source string; nonempty string required. |
| `/producer/generated_by{oneOf:1}` | NOT_APPLICABLE_BY_SCENARIO | Object alternative unselected; use string variant. |
| `/producer/generated_by{oneOf:1}/component` | NOT_APPLICABLE_BY_SCENARIO | Parent object alternative unselected. |
| `/workflow` | DERIVED_WITH_EXPLICIT_RULE | Assemble child mappings, withholding output if required context absent. |
| `/workflow/workflow_id` | DIRECT_FROM_HARNESS | /workflow/task_id; validate consistency with raw task ID. |
| `/workflow/workflow_name` | DERIVED_WITH_EXPLICIT_RULE | Use /workflow/task_id as display label only. |
| `/workflow/workflow_type` | DERIVED_WITH_EXPLICIT_RULE | generic for admitted execution_facts; do not infer PR/release/security intent. |
| `/workflow/repository` | EXTERNAL_REQUIRED | External subject/repository declaration bound to task; workspace_root alone does not prove a repository. |
| `/workflow/repository{oneOf:0}` | EXTERNAL_REQUIRED | Nonempty repository identity string from same external subject declaration. |
| `/workflow/repository{oneOf:1}` | NOT_APPLICABLE_BY_SCENARIO | Object alternative unselected. |
| `/workflow/environment` | DIRECT_FROM_HARNESS | /workflow/mode = local, as declared environment. |
| `/authority` | DERIVED_WITH_EXPLICIT_RULE | Assemble external authority context; producer_only flags cannot populate factual authority values. |
| `/authority/requested_by` | EXTERNAL_REQUIRED | Task-bound requester declaration with source; never use producer or current process user as substitute. |
| `/authority/owner` | EXTERNAL_REQUIRED | Subject/task-bound owner declaration; declaration is not verification. |
| `/authority/reviewers` | EXTERNAL_REQUIRED | Review-context declaration, including explicit empty reviewer set if that is the declared context. |
| `/authority/authorization_status` | DERIVED_WITH_EXPLICIT_RULE | In this producer-only baseline use missing to describe absent authorization evidence; never provided/not_required from producer-only flags. Any richer status needs another admitted scenario. |
| `/authority/authorization_evidence` | DERIVED_WITH_EXPLICIT_RULE | Empty list for this bounded input with no authorization evidence; receipt records absence. Do not discard separately supplied authorization records. |
| `/authority/allowed_actions` | EXTERNAL_REQUIRED | Bounded authority-context action list; local tool allowlist is not authority. |
| `/authority/prohibited_actions` | EXTERNAL_REQUIRED | Bounded authority-context prohibition list; do not translate local safety policy into authority. |
| `/authority/time_window` | EXTERNAL_REQUIRED | Authority-context time window; an explicitly unprovided window may be an empty object with gap record, not invented task timestamps. |
| `/runtime` | DERIVED_WITH_EXPLICIT_RULE | Assemble sourced runtime descriptors. |
| `/runtime/runtime_id` | EXTERNAL_REQUIRED | Declared runtime instance/reference bound to task; producer identity alone is not instance identity. |
| `/runtime/runtime_type` | DERIVED_WITH_EXPLICIT_RULE | harness for admitted producer source; structural class only. |
| `/runtime/runtime_name` | DERIVED_WITH_EXPLICIT_RULE | /producer/id as runtime software label only. |
| `/runtime/runtime_version` | DIRECT_FROM_HARNESS | /producer/version for this admitted Harness runtime lineage. |
| `/runtime/model` | DIRECT_FROM_HARNESS | /workflow/planner_model if nonempty; null/absent needs external declared model context or MISSING_FACTS. No guessed model. |
| `/runtime/model{oneOf:0}` | DIRECT_FROM_HARNESS | Same planner_model string and precondition. |
| `/runtime/model{oneOf:1}` | NOT_APPLICABLE_BY_SCENARIO | Object alternative unselected. |
| `/runtime/model{oneOf:1}/model_name` | NOT_APPLICABLE_BY_SCENARIO | Parent alternative unselected. |
| `/runtime/tools` | EXTERNAL_REQUIRED | Task-bound declared runtime tool inventory; observed calls are not the complete registered tool inventory. |
| `/runtime/tools/*/tool_name` | EXTERNAL_REQUIRED | Same explicit tool inventory, each nonempty tool name. |
| `/runtime/tools/*/tool_type` | EXTERNAL_REQUIRED | Same inventory's declared tool classification. |
| `/runtime/execution_mode` | DIRECT_FROM_HARNESS | /workflow/mode = local; preserves declared execution mode. |
| `/intent` | DERIVED_WITH_EXPLICIT_RULE | Assemble sourced goal plus required external task/outcome context. |
| `/intent/intent_id` | DERIVED_WITH_EXPLICIT_RULE | Structural identifier intent: plus /workflow/task_id, recorded as adapter-generated. |
| `/intent/user_goal` | DIRECT_FROM_HARNESS | /intent/user_prompt if nonempty. |
| `/intent/agent_task` | EXTERNAL_REQUIRED | Explicit assigned task text bound to task ID; user prompt is not silently duplicated as an established assignment. |
| `/intent/expected_outcome` | EXTERNAL_REQUIRED | Declared outcome; expected_outputs list/path presence does not establish outcome meaning. |
| `/intent/declared_constraints` | EXTERNAL_REQUIRED | Explicit task constraints; producer booleans are not a complete user constraint list. |
| `/intent/success_criteria` | EXTERNAL_REQUIRED | Explicit declared criteria; no success criterion fabricated from command exit status. |
| `/scope` | DERIVED_WITH_EXPLICIT_RULE | Assemble bounded scope context; local_only is not a complete scope declaration. |
| `/scope/in_scope` | EXTERNAL_REQUIRED | Task/subject-bound declared scope. |
| `/scope/out_of_scope` | EXTERNAL_REQUIRED | Task/subject-bound exclusions. |
| `/scope/touched_resources` | EXTERNAL_REQUIRED | Captured resource inventory with coverage basis; output paths do not enumerate all touches. |
| `/scope/changed_files` | EXTERNAL_REQUIRED | Subject-bound change inventory, e.g. separately supplied diff plus explicit interpretation; do not infer solely from artifact paths. |
| `/scope/data_sensitivity` | DERIVED_WITH_EXPLICIT_RULE | unknown records unclassified sensitivity; never none/low from local execution. |
| `/plan/steps` | NOT_APPLICABLE_BY_SCENARIO | Optional plan omitted; native plan preserved raw. |
| `/plan/steps/*/step_id` | NOT_APPLICABLE_BY_SCENARIO | Parent optional plan omitted. |
| `/plan/steps/*/description` | NOT_APPLICABLE_BY_SCENARIO | Parent optional plan omitted. |
| `/plan/steps/*/status` | NOT_APPLICABLE_BY_SCENARIO | Parent optional plan omitted; no not_recorded -> skipped substitution. |
| `/actions` | DERIVED_WITH_EXPLICIT_RULE | Map every native /actions row with R3-R4; unrepresentable nonempty rows block emission. |
| `/actions/*/action_id` | DIRECT_FROM_HARNESS | /actions/*/action_id; preserve event linkage in receipt. |
| `/actions/*/timestamp` | DIRECT_FROM_HARNESS | /actions/*/timestamp; null for not_recorded is a gap, not a new timestamp. |
| `/actions/*/actor` | EXTERNAL_REQUIRED | Event/task-bound actor attribution; producer software is not automatically the acting principal. |
| `/actions/*/action_type` | DERIVED_WITH_EXPLICIT_RULE | R4 exact read_file/write_file/run_command names; other nonempty requested_tool -> call_tool; missing name blocks. |
| `/actions/*/target` | EXTERNAL_REQUIRED | Event-bound target resource reference; requested_tool alone is not target. |
| `/actions/*/target{oneOf:0}` | EXTERNAL_REQUIRED | Same nonempty target string. |
| `/actions/*/target{oneOf:1}` | NOT_APPLICABLE_BY_SCENARIO | Object alternative unselected. |
| `/actions/*/target{oneOf:1}/resource` | NOT_APPLICABLE_BY_SCENARIO | Parent object alternative unselected. |
| `/actions/*/command` | DERIVED_WITH_EXPLICIT_RULE | R3 joined command_result.command when present; otherwise null with missing/not-command annotation. |
| `/actions/*/inputs` | DIRECT_FROM_HARNESS | /actions/*/requested_input, uninterpreted. |
| `/actions/*/outputs` | DERIVED_WITH_EXPLICIT_RULE | R3 joined native command result or tool output summary preserved as uninterpreted value; absent -> null with receipt annotation. |
| `/actions/*/status` | DERIVED_WITH_EXPLICIT_RULE | R4 completed -> succeeded; failed/blocked unchanged; not_recorded blocks row emission. |
| `/actions/*/related_tool_call_id` | DERIVED_WITH_EXPLICIT_RULE | Native event_id only if matching canonical tool row exists; blocked action without tool call -> null. Reject conflicting join. |
| `/tool_calls` | DERIVED_WITH_EXPLICIT_RULE | Map all native /tool_calls rows, preserve order and R3 identity. |
| `/tool_calls/*/tool_call_id` | DIRECT_FROM_HARNESS | /tool_calls/*/event_id. |
| `/tool_calls/*/timestamp` | DIRECT_FROM_HARNESS | /tool_calls/*/timestamp; preserve joined command timestamp separately. |
| `/tool_calls/*/tool_name` | DIRECT_FROM_HARNESS | /tool_calls/*/tool_name. |
| `/tool_calls/*/tool_type` | EXTERNAL_REQUIRED | Bound tool catalog classification into canonical enum; do not guess from free-form name. |
| `/tool_calls/*/input_summary` | DERIVED_WITH_EXPLICIT_RULE | Deterministic JSON encoding of native input with recursively sorted object keys and array order preserved; raw bytes kept. |
| `/tool_calls/*/output_summary` | DERIVED_WITH_EXPLICIT_RULE | Same encoding of native output_summary; otherwise native error_summary string; neither -> null, with missing annotation. Preserve both if both exist in receipt. |
| `/tool_calls/*/exit_code` | DERIVED_WITH_EXPLICIT_RULE | R3 joined command_result.exit_code or null if absent; no synthesis of zero. |
| `/tool_calls/*/duration_ms` | DIRECT_FROM_HARNESS | /tool_calls/*/duration_ms, only if valid nonnegative integer; no rounding. |
| `/tool_calls/*/sensitive_input_detected` | EXTERNAL_REQUIRED | Bound detection result or explicit supplied detection observation; missing does not become false. |
| `/tool_calls/*/artifact_refs` | DERIVED_WITH_EXPLICIT_RULE | Link only R5 byte-bound artifact rows explicitly referenced by this event; empty means no mapped refs, not no outputs. Unresolved declared ref blocks. |
| `/blocked_actions` | DERIVED_WITH_EXPLICIT_RULE | Map all native /blocked_actions; retain block_reason/matched_rule/input in receipt. |
| `/blocked_actions/*/blocked_action_id` | DIRECT_FROM_HARNESS | /blocked_actions/*/event_id. |
| `/blocked_actions/*/timestamp` | DIRECT_FROM_HARNESS | /blocked_actions/*/timestamp. |
| `/blocked_actions/*/attempted_action` | DERIVED_WITH_EXPLICIT_RULE | requested_tool as label plus deterministic JSON encoding of requested_input; preserve raw values. |
| `/blocked_actions/*/reason_code` | DERIVED_WITH_EXPLICIT_RULE | Copy block_reason only when exactly in the eight canonical input enums; otherwise UNKNOWN and retain original text. No canonical report reason is emitted here. |
| `/blocked_actions/*/policy_ref` | DIRECT_FROM_HARNESS | /blocked_actions/*/matched_rule as declared policy reference, not verified policy authority. |
| `/blocked_actions/*/severity` | DIRECT_FROM_HARNESS | Native low/medium/high; no severity upgrade. |
| `/blocked_actions/*/human_review_required` | EXTERNAL_REQUIRED | Explicit contextual review requirement; blocked status/severity alone cannot fabricate boolean. |
| `/artifacts` | DERIVED_WITH_EXPLICIT_RULE | R5 map every native artifact plus retained evidence members with explicit membership; unavailable bytes block. |
| `/artifacts/*/artifact_id` | DERIVED_WITH_EXPLICIT_RULE | artifact: plus SHA-256 of UTF-8 JSON tuple [source pack digest, exact source path]; receipt stores tuple. |
| `/artifacts/*/path` | DIRECT_FROM_HARNESS | Native artifact path or manifest-file/files/*/path for retained raw evidence member; preserve source namespace. |
| `/artifacts/*/artifact_type` | DERIVED_WITH_EXPLICIT_RULE | other is the bounded unclassified type; do not infer verified test/authorization type from extension. |
| `/artifacts/*/sha256` | DERIVED_WITH_EXPLICIT_RULE | R5 SHA-256 of supplied bytes, compare any declared digest; missing bytes -> MISSING_FACTS. |
| `/artifacts/*/size_bytes` | DERIVED_WITH_EXPLICIT_RULE | R5 measured byte length; compare declarations, never use characters as bytes. |
| `/artifacts/*/content_type` | DERIVED_WITH_EXPLICIT_RULE | application/octet-stream as opaque-byte packaging type; no content recognition claim. |
| `/artifacts/*/description` | DERIVED_WITH_EXPLICIT_RULE | Exact source path as display label; no inferred content/result claim. |
| `/verification` | DERIVED_WITH_EXPLICIT_RULE | R7 empty array means no canonical events represented from this producer contract; preserve aggregate object raw. Additional event evidence requires a separately admitted mapping. |
| `/verification/*/verification_id` | UNAVAILABLE | No canonical event in aggregate counts/paths; never synthesize one. |
| `/verification/*/verification_type` | UNAVAILABLE | No check type established by counts/paths. |
| `/verification/*/status` | UNAVAILABLE | Command success/counts are not a verification result. |
| `/verification/*/command` | UNAVAILABLE | No identified verification event to attach command to; raw command results remain execution facts. |
| `/verification/*/artifact_refs` | UNAVAILABLE | No bound verification event/artifact relation. |
| `/verification/*/coverage_note` | UNAVAILABLE | No event-specific coverage basis; absence cannot be converted into successful verification. |
| `/policy_observations/*/observation_id` | NOT_APPLICABLE_BY_SCENARIO | Optional section omitted; native policy facts preserved raw. |
| `/policy_observations/*/policy_ref` | NOT_APPLICABLE_BY_SCENARIO | Parent optional section omitted. |
| `/policy_observations/*/status` | NOT_APPLICABLE_BY_SCENARIO | Parent optional section omitted. |
| `/policy_observations/*/summary` | NOT_APPLICABLE_BY_SCENARIO | Parent optional section omitted. |
| `/human_review/status` | NOT_APPLICABLE_BY_SCENARIO | Optional section omitted; no not_required inference. |
| `/human_review/reviewers` | NOT_APPLICABLE_BY_SCENARIO | Parent optional section omitted. |
| `/risk_signals` | DERIVED_WITH_EXPLICIT_RULE | Map all native risk observations only with required contextual category/action; no silent dropping. |
| `/risk_signals/*/signal_id` | DERIVED_WITH_EXPLICIT_RULE | risk: plus SHA-256 of UTF-8 JSON tuple [source pack digest, signal_type, source_path, event_id]; reject conflicting duplicates. |
| `/risk_signals/*/category` | EXTERNAL_REQUIRED | Explicit contextual category in canonical enum; tool_risk_level is not a canonical category. |
| `/risk_signals/*/severity` | DIRECT_FROM_HARNESS | /risk_signals/*/observed_level if canonical enum; invalid value rejects. |
| `/risk_signals/*/message` | DERIVED_WITH_EXPLICIT_RULE | Label composed from exact signal_type, tool_name and observed_level, without added governance claim. |
| `/risk_signals/*/evidence_refs` | DERIVED_WITH_EXPLICIT_RULE | R3 event cross-reference plus R5 retained source_path artifact reference; unresolved source blocks. |
| `/risk_signals/*/recommended_action` | EXTERNAL_REQUIRED | Explicit supplied contextual recommendation; producer observation alone cannot invent one. |
| `/provenance` | DERIVED_WITH_EXPLICIT_RULE | Assemble source and transformation provenance; unavailable required facts block canonical emission. |
| `/provenance/source_pack_hash` | DERIVED_WITH_EXPLICIT_RULE | R6 SHA-256 of original compatibility pack bytes. |
| `/provenance/generated_at` | EXTERNAL_REQUIRED | Actual canonical packaging-event timestamp from a future adapter receipt; native task.created_at is not generation time. |
| `/provenance/generated_by` | EXTERNAL_REQUIRED | Actual canonical packager identity/version from same transformation receipt; do not impersonate original producer. |
| `/provenance/generated_by{oneOf:0}` | EXTERNAL_REQUIRED | Same packager identity as nonempty string; source producer preserved in /producer and receipt. |
| `/provenance/generated_by{oneOf:1}` | NOT_APPLICABLE_BY_SCENARIO | Object alternative unselected. |
| `/provenance/generated_by{oneOf:1}/component` | NOT_APPLICABLE_BY_SCENARIO | Parent object alternative unselected. |
| `/provenance/deterministic` | UNAVAILABLE | generated_from_local_files_only does not establish canonical deterministic generation. Requires later explicit generation-method conformance basis, not a default true/false. |
| `/provenance/redaction_applied` | UNAVAILABLE | Native contract does not establish full redaction history; summaries are not proof of no redaction. Requires explicit provenance disposition, not default false. |
| `/manifest` | DERIVED_WITH_EXPLICIT_RULE | R6 assemble enumerated retained evidence members, no circular output self-hash. |
| `/manifest/files` | DERIVED_WITH_EXPLICIT_RULE | R6 explicit retained bundle inventory, preserving manifest-file membership and any justified additions. |
| `/manifest/files/*/path` | DIRECT_FROM_HARNESS | manifest-file/files/*/path for retained native members; explicit packaging map required if derivative path differs. |
| `/manifest/files/*/sha256` | DERIVED_WITH_EXPLICIT_RULE | R5-R6 recompute over retained bytes and compare native declared hash. |
| `/manifest/files/*/size_bytes` | DERIVED_WITH_EXPLICIT_RULE | R5-R6 measured byte count; compare native declared count. |
| `/manifest/completeness` | DERIVED_WITH_EXPLICIT_RULE | R6 complete only relative to fully enumerated required bundle inventory and checked bytes; otherwise withhold closure on required gaps, preserve missing/unknown status in receipt. |

## Applicability and limitations

UNAVAILABLE verification child fields are conditionally required only if an event row is emitted; the baseline emits none and preserves the absence explicitly. UNAVAILABLE provenance booleans are unconditionally required and therefore block canonical output from the pinned producer alone. A later supplementary generation/redaction contract is needed to supply those facts; Phase A does not pretend they are known. This is a completed missing-fact disposition, not a claim of integration readiness.

Optional repository/model/generated_by/action-target object children remain governed by the original schema if a later scenario selects them. They cannot be introduced without updating this versioned mapping's scenario and provenance review. The optional extensions container never substitutes for missing required canonical fields or activates MESR/EAK.

This table classifies input provenance; DIRECT_FROM_HARNESS does not imply truth, integrity or independent verification. External declarations can satisfy a declared-context slot only with attribution; verified authority/independence needs separate evidence. Every failed derivation or unavailable fact remains visible in the closure receipt, even when the legacy schema permits omission/null/empty data. No runtime/public contract changed.
