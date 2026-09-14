# V8-000 Source Reconciliation

This is source reconciliation, not implementation or release authorization. Current Guard source remains authoritative for behavior; the repaired Research OS supplies candidate future meanings. See the complete [matrix](../mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md), [machine inventory](../mesr/implementation-reconciliation.v0.1.json), [delta backlog](14_SOURCE_RECONCILED_GATE1_BACKLOG.md), and [readiness decision](15_GATE1_READINESS_DECISION.md).

## Recovery and baseline

| Item | Verified state |
|---|---|
| Repository | `D:\AI project\mindforge-guard` |
| Branch | `validation/v8-000-source-reconciliation-v0.1` |
| Canonical base | `30512dff336435f8d1c1bf4b633058c374668eb8` |
| Base ref | `validation/v8-gate-3-institutional-artifact-readiness-v0.1` |
| HEAD / AGENTS constitutional commit | `20aa844fe6f0239d5c0d18184cf5faffa366abf5` |
| DES closure, not imported | `b909228ac9928fbdf22bd7081532683930c4209a`; only CHANGE_LOG.md, EXTERNAL_ARCHITECTURE_SNAPSHOT_v0.1.md, FACT_CHECK_REPORT.md |
| Preserved AGENTS patch SHA-256 | `62bddd822df7d8f91890ce1c3b324a7d371fe5e0564df28a4dd19dd18c4e27ec` |
| Original transition | Reverse patch check proved preservation; restored AGENTS only; clean DES tree; branch created from explicit base; exact patch checked/applied; AGENTS-only commit |
| Before original reconciliation | Clean worktree |
| Resume checkpoint | No tracked diff; diff/stat/check empty; exactly three untracked files below |
| Constitution | V8 section exactly once; RESEARCH_COMPRESSION and SEMANTIC_ARCHITECTURE_REPAIR PASS; V8-000 REQUIRED_NEXT; Gate 1 blocked until V8-000 pass; hard invariants intact |
| Research | Repaired 41 Core + 3 interpretation metadata; seven typed relations; empty active stronger/weaker edges; profile-bound sufficiency requirements verified |

Recovery classified all actual partial files before edits:

| File | Classification | Disposition |
|---|---|---|
| docs/mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md | PARTIAL_VALID | Placeholder retained as the matrix path; completed from reviewed JSON. |
| docs/mesr/implementation-reconciliation.v0.1.json | PARTIAL_VALID | Existing 41/3 verdicts, 56 reason traces and 22 test results retained; identity.declared boundary match corrected from PARTIAL to CONFLICT on direct source evidence; inventories and validation provenance completed. |
| scripts/_build_v8_000.py | PARTIAL_VALID | Its writes were limited to reconciliation JSON/directories. Hard-coded manual judgments were not PASS assertions, but rebuilding would overwrite the draft and depended on temporary files. Repaired into a renderer/validator over the preserved JSON. |
| All three planning outputs | Absent | Newly created. The rejected UI preview was not accepted repository state. |

Pre-recovery SHA-256 values are retained in JSON. Final validation caught a draft patch-digest transcription error (63 hex characters, one missing d); the corrected 64-character digest above was measured from the saved patch, whose bytes exactly match `git diff HEAD^ HEAD -- AGENTS.md`. The patch and AGENTS were not changed. All 97 Research OS files were hashed before reconciliation; the recovered inventory still matched. No AGENTS edit or commit occurred on resume. No file was COMPLETE_VALID, INVALID, STALE or UNRELATED at recovery.

The existing source documents already record internal Gate 1/2 progress and Phase 3A readiness. Those remain historical evidence for the implementation track. They do not bypass the repaired-baseline gate. The next backlog is a delta over that real substrate. `mesr.core.*` remains canonical; research short IDs are candidate mapping keys, not a competing registry or equivalent aliases.

## Evidence Contract

Canonical schema: `packages/schema/evidence-schema-v1.json`, JSON Schema draft 2020-12, `$id=mindforge://schemas/evidence/evidence-schema-v1.json`, `schema_version=1.0.0`. `EvidencePackV1` is defined in `packages/guard-core/src/parseEvidencePack.ts:8`. The closed runtime boundary is `validateEvidencePack.ts:1595`. The JSON/matrix expand schema fields with validator locations, producer and consumer context, and compatibility sensitivity.

The parser accepts JSON text, Buffer or a non-array object, checks parsing/object shape, then casts. It does not normalize producer schemas or establish conformity. Validation checks 18 required top-level fields, optional plan/policy_observations/human_review/extensions, closed nested keys, enums, timestamps, hash syntax and numeric structure. Empty arrays can produce warnings. `extensions` accepts an arbitrary object; namespacing is a documented convention, not enforced. Validation does not open artifact files, verify hash contents, authenticate principals or verify custody. Report generation performs parsing and validation before coverage. EAK accepts typed input directly; its caller is responsible for contract validation.

| Field family | Current meaning, producer and consumer |
|---|---|
| schema_version / pack_id / pack_type / created_at | Producer contract/scenario/identity/time. Exact version and three scenario enums constrain parser consumers. Creation time is used in authority expiry comparison, not automatically current reliance time. |
| producer | Packager id/name/version/type/profile/generated_by. Coverage checks presence; EAK attributes sources. Not verified principal or authority. |
| workflow / repository | Declared workflow/environment and string or closed repository object, including branch/ref/commit/PR. Report summarizes it; missing branch can affect dependency reasoning. No repository lookup. |
| authority | Requested-by/owner/reviewers/status/evidence refs/allowed and prohibited actions/time window are submitted context. `provided` is not independent verification. Coverage/review/verdict use selected fields; allowed_actions grants nothing. |
| runtime | Declared runtime/model/tools/mode; structural context, not tool availability, invocation or authorization. |
| intent / plan | Declared goals/task/outcome/constraints/criteria and optional planned steps. No implication that an event occurred or criteria passed. |
| scope | Exact in/out lists, touched resources, changed files, sensitivity. Coverage uses list membership and a protected-resource regex, not a general scope/authority prover. |
| actions | Producer act/status/time/target/command and uninterpreted input/output. Report refs, scope and command-output checks; succeeded is not correct outcome or verification pass. |
| tool_calls | Submitted invocation summaries/exit/duration/sensitivity/artifact refs. Coverage checks output/refs. Exit zero does not establish a named verification claim. |
| blocked_actions | Producer block/reason/severity/policy/review flag. Eight input reasons are separate from canonical report reasons. Critical recorded severity can produce report block, without executing a block. |
| artifacts | Submitted ID/path/type/hash/size/MIME/description. Coverage resolves refs; hash syntax does not prove byte integrity. |
| verification | Array of seven verification types and passed/failed/not_run/inconclusive, command/refs/coverage note. Report counts and coverage rules consume it. No mandatory verifier principal, independence, claim-set, environment or per-event evaluation time. |
| policy_observations / human_review | Optional observations and pending/completed/not_required status/notes. Not institutional acceptance; completed review does not automatically clear generated review requirements. |
| risk_signals | Submitted category/severity/message/refs/recommended action. Structurally validated; report risk aggregation mainly follows canonical reasons rather than importing producer verdicts. |
| provenance | Supplied source_pack_hash, generated_at/by, deterministic and redaction flags. Attribution and structural validation, not demonstrated replay, truth or custody. |
| manifest | Submitted files[path,sha256,size_bytes] and completeness label. Coverage/report consume it; Core does not independently enumerate files. |
| extensions | Optional producer material. Does not activate MESR/EAK or grant semantic authority. New mandatory canonical facts require an explicit schema migration. |

Canonical fixtures include `fixtures/ai-pr-low-risk-complete/evidence-pack.json`, missing-test/release/dependency/cyber cases, and corresponding `examples/reports`. Studio accepts external producer submissions through `prototypes/studio/studioWorkflow.mjs:213`. No generic producer-to-EvidencePackV1 normalizer exists in the parser. Consumers are coverage, report/index generation, direct internal EAK callers, Markdown/HTML renderers and Studio. Private Core `index.ts` exports parser/validator/report APIs, not MESR/EAK. The public CLI MJS path does not import MESR/EAK.

## All canonical reason codes

There are **56** in `packages/guard-core/src/reasonCodes.ts:37`, with definitions and 56 corresponding MESR bindings. The matrix/JSON enumerate each definition/declaration, source occurrences, emitter/consumer, fixtures, tests, report phrases, aliases, role and serialized exposure. The recovered whole-repository literal scan uses replacement decoding for five legacy non-UTF-8 CLI files named in JSON; canonical semantic source and all new artifacts decode strictly, and no meaning is inferred from unreadable text. Literal occurrences and generic consumers/tests are distinguished: a missing literal test reference is not a claim that generic 56/56 binding verification excludes that code. Declaration/binding alone does not prove a rule executes. There are 37 implemented coverage/report trigger codes and 19 declared/bound codes without a current Core emitter.

Exactly one primary role per code: 27 CORE_SEMANTIC, 18 DOMAIN_SEMANTIC, 6 POLICY_RESULT, 5 NEEDS_REVIEW, 0 REPORT_WORDING, 0 LEGACY. NEEDS_REVIEW here marks declared interpretive risk labels without a verified runtime predicate, not a fifth candidate verdict.

Explicit source-vocabulary translations: DESTRUCTIVE_COMMAND -> DESTRUCTIVE_COMMAND_ATTEMPTED; SECRET_ACCESS -> SECRET_ACCESS_ATTEMPTED; NETWORK_NOT_ALLOWED -> NETWORK_ACCESS_ATTEMPTED. They are scoped blocked-action mappings, not global aliases. Other source reasons remain separate. `art_manifest` is a special artifact-ref bypass. Preserve serialized values, ordering, definitions and consumers.

Confirmed conflations, not fixed:

- **Fact + interpretation:** TESTS_NOT_RUN includes present nonpassing/inconclusive records; BUILD_FAILED includes build not_run/inconclusive with no pass; dependency workflow labeling triggers DEPENDENCY_CHANGE_DETECTED without a diff; migration notes are detected by path/description regex.
- **Semantic + policy:** rollback requirement is release-specific. SECURITY_REVIEW_REQUIRED follows cyber/security workflow class even if review occurred. The research hypothesis that it proves missing review occurrence does not match current code.
- **Policy + assurance / assurance + wording:** report allow falls through selected rules and says structurally sufficient without research sufficiency bindings.
- **Historical + current:** TIME_WINDOW_EXPIRED compares against pack.created_at; its MESR binding wording says evaluation time. This is not a fresh reliance-time evaluation.
- **Producer assertion + independence:** EAK has separate fields but some external-item paths infer independence from external verification status/check presence (below).

## Governance Report

`reportModel.ts` defines GovernanceReportModel 1.0.0. After input validation, `generateGovernanceReport.ts:552` applies this precedence:

| Verdict | Exact rule | Layer and consumer risk |
|---|---|---|
| block | Any blocked summary item has critical severity. | Recommendation about recorded blocked activity, displayed by renderers/Studio. No executing block. |
| inconclusive | Otherwise manifest completeness incomplete or unknown. | Report disposition for manifest basis, not a generic MESR claim state. |
| require_review | Otherwise selected authority/owner/test/rollback/cyber reasons or any generated required human review item. | Policy-derived recommendation; not institutional rejection or execution denial. |
| allow | No prior branch produces verdict reasons. | Legacy report-rule fallthrough, not proof every field/claim is verified. |

The allow explanation is exactly: “Authority, scope, verification, and manifest evidence are structurally sufficient.” Unselected coverage reasons may coexist with allow. Preserve `Guard allow != Runtime ALLOW != Institutional Acceptance != Execution Authorization`. Renderers copy verdict/coverage/counts; they issue no commands. Repaired E3-C's guard-legacy allow plus TESTS_NOT_RUN is a vocabulary collision fixture, not a representative generated ordinary software-change report: that reason triggers review.

Coverage completeness combines manifest status and missing-evidence count. MissingEvidenceItem/HumanReviewRequirement/NextAction carry reasons, text, refs and roles. Risk severity is the maximum code severity hint: a report-priority ordering, not an evidence maturity hierarchy. `generateEvidenceIndex.ts` indexes report material. The JSON output and Markdown/HTML wording remain compatibility-sensitive.

There is no Preview/Final lifecycle enum in GovernanceReportModel. Studio markdown_preview/html_preview and export readiness reflect the same generated model; “final” wording does not create authority. EAK LocalGovernanceMappingPreview is default_off=true/public_contract_changed=false. Institutional Artifact v0.1 is a separate controlled fixture/schema, not replacement report JSON or acceptance. Its Phase 3A fixture invokes MESR support evaluation, not the EAK projection. Prior fixtures/snapshots and outcome-foundation, MESR report-equality and institutional-artifact tests remain unchanged.

## EAK maturity and semantic limits

**PROTOTYPE_VALIDATION_ONLY**. Kernel version is `0.1.0-poc`; it is not exported from private Core's index or the installed CLI. Inputs are EvidencePackV1 plus optional normalized records, external assurance reports and review scope. It builds production_evidence_readiness profile/families, sources, claims, observations, verification and supportability. Origin, verification, integrity, corroboration, admissibility and independence have separate fields.

Family precedence: not applicable -> inadmissible; contradiction -> contradicted; missing evidence -> insufficient_evidence; supported family -> supported; otherwise unsupported. Overall results prioritize contradictions, missing evidence and admissible unsupported families. Residual uncertainty is retained separately and does not automatically veto supported. Deterministic input/result hashes establish process integrity, not truth.

`buildVerifications` maps pack passed to verified, failed to partially_verified, while retaining producer-provided limitations. External-record/report loops in `buildEvidenceItems` assign independently_verified from record.status=verified or nonempty executed_checks, without comparing producer/executor/verifier principals or custody. Nonempty failed/skipped checks also satisfy the latter presence condition. Report digest presence becomes integrity bound. These are material PoC shortcuts, not independent-assurance proof.

`externalEvidence/types.ts` and verificationTypes.ts describe parse/validate/verify/normalize, package/manifest/profile/request/job/result/report contracts. Local normalization/report/composition/job/idempotency/usage/adapter-selection fixtures and the Ramen v5 spike are bounded implementations. They are not a deployed service or general identity/custody verifier. `mesr/eakProjection.ts` is an internal side projection: contradicted -> contradicts; insufficient/inadmissible -> indeterminate; unsupported -> does_not_support only when a registered boundary applies, otherwise indeterminate. Legacy verdicts remain separate.

## MESR maturity and support evaluator

**ACTIVE_RESEARCH + IMPLEMENTED_INTERNAL_SUBSTRATE**: 30 Core entries, 29 Software seed entries, 24 claim boundaries, 56 reason bindings, five support relations, temporal shape validation, canonical snapshots, Core pattern signatures, EAK projection, two producer adapters, module composition and bounded domain/crosswalk fixtures. ADRs 0004/0005/0006 and docs/specs/mesr-* document existing architecture.

Canonical namespaces are mesr.core.*, mesr.domain.software.*, mesr.xw.*, mesr.profile.*. Lifecycle/version/supersedes/deprecated_by fields exist, but no general historical registry-version store or alias resolver implements all research supersession semantics. Baseline tracked-source searches find none of reconstructability.replayable, semantic.claim_stable, semantic.portable or the three new metadata IDs. No compatibility alias is required for those absent names; process metadata remains outside world/action semantics.

The identity_assertion entry explicitly supports verified_identity, conflicting with the repaired declaration-only nonclaim; identity.declared therefore has claim_boundary_match=CONFLICT, while its ALIGN_AND_ADOPT verdict permits only a separate additive facet. The evaluator checks request.required_bindings, not an automatic union of registry required_bindings. Caller-supplied supported_claim_parts contribute positive claims. Explicit non-claims are carried in output; blocking depends on registered observed-state/claim boundaries. False and empty arrays count as present to this evaluator, while the producer projection helper treats arrays differently. Binding conformance needs negative experiments before stronger claims are adopted.

## Relations, states, sufficiency and time

| Dimension | Current state | Primary migration requirement |
|---|---|---|
| refines/requires/entails/orthogonal_to/adjacent_to | Not first-class MesrSemanticEntry fields; binding names are not semantic prerequisite evaluation. | ADDITIVE_METADATA |
| conflicts_with/supersedes | Fields/reference validation exist; conflict/lifecycle evaluation incomplete. | NEEDS_EXPERIMENT |
| stronger_than/weaker_than | Current Core/Software edges empty; no active generic strength traversal. | NO_CHANGE for existing edges |
| Verification result vs independence | Separate types; EAK shortcut conflates them. | BREAKING_IF_CHANGED for existing PoC classifications; experiment first |
| Acceptance authority vs occurrence | Nonclaims and CB-18 separate concepts; full predicates absent. | ADDITIVE_METADATA |
| Presence/integrity/coverage/custody/sufficiency | Partial representations; digest-presence/sufficiency shortcuts; custody absent. | NEEDS_EXPERIMENT |
| Authority verification/currentness/scope | Source/scope/declaration/time substrate separate; presence/status is not verification. | ADDITIVE_METADATA |
| Historical/current standing | Explicit boundary and supplied statuses, no recomputation. | NEEDS_EXPERIMENT |
| Research short IDs / canonical IDs | Partial granularity and nonclaim overlap, not equality. | NO_CHANGE now; future proven rename would require COMPATIBILITY_ALIAS_REQUIRED |

| Requested state | Existing surface | SEMANTIC_DEBT / difference |
|---|---|---|
| SUPPORTED | MESR supports, EAK supported | Different preconditions/evaluators; no automatic equivalence. |
| UNSUPPORTED | MESR does_not_support, EAK unsupported | Registered prohibited inference is not proof a world proposition is false. |
| UNRESOLVED | MESR indeterminate, EAK insufficient_evidence/uncertainty | No dedicated enum. Producer claim with missing independence currently hits CB-22 -> does_not_support. |
| CONFLICTED | MESR contradicts, EAK contradicted | Explicit contradiction input, not general multi-source conflict resolution. |
| STALE | temporal.basis_status=stale | Separate supplied metadata, not computed claim-support state. |
| INCONCLUSIVE | Pack verification or report inconclusive | Different result/report contexts, not interchangeable with indeterminate. |

E3-B must separate execution evidence from epistemic status of independence. Current projection can retain tests_executed/tests_passed and return does_not_support for independence. It prevents inflation but does not express repaired UNRESOLVED. Missing verification event needs a bounded search and not-evaluable independence. Do not rename old enums in place.

The scoped wording search covers sufficient/complete/ready/verified/passed/approved/accepted/compliant. Material hits are legacy allow wording, coverage completeness, EAK readiness, producer result conversion, review markers and renderer counts. Future evidence.sufficient requires profile_id, claim_set_id, scope and evaluation_time (research additionally requires refs/material-gap result). Current profile/conclusions/review_scope are partial analogues; created_at/generated_at is not automatically evaluation_time. Use an opt-in versioned artifact or explicit future report migration, preserving old JSON/phrase now.

Historical evidence remains immutable. Current applicability requires separate freshness/expiry/revocation/supersession/subject/environment/authority evaluation. temporalBasis.ts validates shape/status/date/provenance, not these evaluations. License expiration/revocation and governance receipt histories are separate established contracts, not a generic MESR standing evaluator. Reuse their facts only through explicit bindings; do not repurpose them.

## Software Change domain separation

| Area | Current fact and interpretation | Policy result / wording | Proposed domain semantic / Core dependency |
|---|---|---|---|
| Tests | Unit/integration records; missing/failure/no-pass rules | Ordinary software deficiency -> review; TESTS_NOT_RUN wording is broader than absence | execution_not_demonstrated / execution absence; result_verified / scoped verification |
| Release | Workflow and subject/release refs, not acceptance | Rollback gap -> RELEASE_REVIEW_REQUIRED | acceptance_recorded and authorization_not_demonstrated / decision vs authority |
| Rollback | rollback_check presence/status; procedure presence not tested capability | Release requires pass; ROLLBACK_MISSING/UNVERIFIED | declared capability, absent evidence, verified rehearsal / evidence, capability, outcome |
| Dependency | dependency_upgrade label and lockfile regex, not independently examined diff | Missing integration/migration -> review; owner review | change_observed from actual diff / action observation |
| Security review | Cyber/security class and optional review record | Class triggers SECURITY_REVIEW_REQUIRED regardless of occurrence | recorded/not_demonstrated/result_verified separately / action vs verification |
| Artifacts | Paths, refs, digest syntax; no canonical byte check | Ref/hash gaps affect coverage | integrity_verified / successful integrity check |
| Ownership | Owner/reviewer strings, principal context | High-risk missing owner -> OWNER_REVIEW_REQUIRED | ownership.declared / identity declaration |
| Authority | Producer authorization status/refs | Missing/declared review and cyber provided-status rule | release authorization evidence / current scope-bound authority |
| Breaking change | Missing integration pass or branch, not detected break | BREAKING_CHANGE_UNVERIFIED -> review | detected analysis vs current waiver / observation vs acceptance |
| Remediation | Cyber/security context; no general closure proof | Security/authority review | closure_verified / bounded outcome + independence |
| Recovery | Rollback refs/checks/environment; not future effectiveness | Release review where applicable | readiness_verified / capability + environment continuity |

## Harness compatibility

Additional read-only producer source: `D:\AI project\guard-native-agent-harness`, clean HEAD `8116457d2a64e45c2154d9f480e68d40937b6ab0`. Hashes of src/evidence/schema.ts and compatibility.ts are pinned. Its compatibility emitter produces the exact observed `mindforge-guard-evidence.v1 / execution_facts` form. Producer source is corroborating evidence, not authority over Guard.

| Harness field | Actual canonical mismatch / future closure |
|---|---|
| schema_version / pack_type | Both exact values rejected. Explicit versioned adapter and evidenced scenario selection required. |
| pack_id / created_at | Compatible scalar concepts; keep task identity and original creation time. |
| producer.id/version/role | Missing canonical id/name/version/type/profile/generated_by; separate producer and adapter provenance. |
| workflow task/planner/mode/count/outputs | Missing workflow id/name/type/repository/environment. Never fabricate repository/ref from labels. |
| authority producer-only flags | Not owner/reviewers/status/evidence/action scope/time. Flags must not become provided authority. |
| runtime workspace/evidence directory/availability/summary | Missing canonical identity/type/version/model/tools/mode. Guard availability is not authority. |
| intent.user_prompt | Partial goal analogue; no full intent/task/outcome/constraints/criteria contract. |
| scope local/policy/registered-tool/allowlist flags | Not path/resource/change/sensitivity scope. Local policy is not current authority. |
| actions | Plan matching yields completed/failed/blocked/not_recorded, nullable timestamp and requested tool/input. Canonical actor/type/target/input/output and succeeded enum differ. Unmatched plan is not execution. |
| tool_calls | Event/task IDs, object output_summary, native policy decision, risk/status differ from canonical summaries/exit/ref contract. Preserve namespaced policy observations. |
| blocked_actions | Native request/block_reason/matched_rule lacks canonical attempted action/reason/policy/review fields. No permissive default mapping. |
| artifacts | path/kind/producer/bytes/characters lacks ID/type/hash/size/MIME/description. Actual bytes required to compute hashes. |
| verification | Counts/file paths object, not array of verification events. Command success cannot synthesize test PASS. |
| risk_signals | Native signal/source/event/tool/level/rule differs from canonical signal/category/message/ref/action. |
| provenance | Directory/source_files/local-generation flags lack canonical hash/time/determinism/redaction. Local generation is not independence or replay proof. |
| manifest | Reference to external manifest, not files+completeness. Must materialize verified inventory with explicit omissions. |

Existing ingest-summary bridge handles synthetic harness_evidence_pack_v1 and emits 0.1-preview summary, not EvidencePackV1. Phase 2 external-evidence normalizer emits typed records. MESR Harness adapter accepts pack_version=0.1 plus records/claims (harness-evidence-pack/v0.1), and emits ProducerSemanticInput. These are distinct experimental formats. There is no canonical integration for the current compatibility emitter.

Classifications: **SCHEMA_COMPATIBILITY_GAP, SEMANTIC_COMPATIBILITY_GAP, PROVENANCE_GAP, ASSURANCE_INTERFACE_GAP**. It is not PURE_ADAPTER_GAP because mandatory facts and assurance bindings are missing, not just renamed. `Harness Producer compatibility != Canonical EvidencePackV1 compatibility`; `Harness ingestion bridge != Canonical Harness -> EAK -> GovernanceReport integration`.

Minimum closure contract: pin producer/adapter/schema versions; retain raw bytes/digests/field provenance; map every field explicitly; preserve unavailable facts; distinguish planned/completed/verified/accepted; inventory artifact bytes/manifest; reject unsupported formats/scenarios; output canonical validation diagnostics and missing evidence; prove valid transformed input passes Guard and missing facts never become fabricated values. No adapter implemented now.

## Repaired Experiment 3 feasibility

| Experiment | Current substrate | Remaining delta |
|---|---|---|
| E3-A | GitHub/Harness adapters, ProducerSemanticInput, MESR projection, paired normalization and distinct provenance tests | Repaired example.ci/example.runtime inputs are unsupported formats; explicit constraint/environment/claim-set coverage missing. Specify fixture normalizer/oracle; equal bounded claims, distinct provenance; Execution Success != Verification Passed. |
| E3-B | Current domain fixtures and CB-22 | Separate no-record from producer assertion + unresolved independence; specify search boundary and dimension annotations NOT_EVALUABLE/SUPPORTED_BY_PRODUCER_ASSERTION without treating them as extra primary states. |
| E3-C | Claim boundaries, claim-stability and grounded APAAI crosswalk | Runtime ALLOW, Guard allow and external ALLOW stay namespaced; VERIFIED/APPROVED/SAFE/ACCEPTED/COMPLIANT have zero automatic equivalences. StegVerse remains unresolved. |
| E3-D | Existing manifest, resolver, Core/Software module, crosswalk/profile loading and deterministic composition tests | Reuse resolver. Literal core compatibility string is checked, but dependency.version is not evaluated. Duplicate/override checks exist; arbitrary claim widening is not exhaustively rejected by limited forbidden-claim list. Specify locked versions/digests and repaired negatives. |

Current E3-D is in-memory composition; absence of a module distribution service is not a defect. Invalid composition returns zero semantic entries. Current diagnostic codes differ from research REJECT_*; a future fixture translation may map them without renaming contracts. Research six conceptual module classes must not overwrite four implemented semantic module types; Producer/Consumer are separate interfaces. Old E3 passes do not establish repaired E3 acceptance. No new normalizer/resolver implementation is added.

## Version baseline

| Dimension | Source-supported conclusion |
|---|---|
| HISTORICAL_RELEASE_BASELINE | Local v6.13.0/v6.13.1/v7.0.0/v7.0.1 tags and RELEASE history; v6.13 is described there as historical lineage. Remote publication not rechecked. |
| CURRENT_COMMERCIAL_BASELINE | AGENTS/skill v6.13 versus README/RELEASE/current product docs v7.0.1. Retain VERSION_BASELINE_AMBIGUITY; no constitutional/version normalization. |
| CURRENT_ENGINEERING_BASELINE | Pinned 30512df + AGENTS-only 20aa844; CLI/lock 7.0.1, private Core 0.1.0, root no product version; release/ absent. |
| INTERNAL_V8_STATE | Implemented internal substrate and prior Gate 1/2/Phase 3A validation lineage, not shipped V8; institutional external requirements unrun; repaired-track implementation not started. |

## Validation and unchanged surfaces

Recovered 22 baseline verifiers passed on Node v24.15.0/Windows: registry, reason bindings, claim stability, composition, runtime portability, cross-domain, APAAI crosswalk, institutional artifact, runtime isolation, EAK PoC, three local external-evidence verifiers, Harness ingestion, v7 example pack, three core CLI checks and four v7.0.1 checks. Commands/stdout/stderr are retained in JSON. Additional recovery validation is recorded there and in the decision. Existing tests are observations, not evidence that repaired E3 passes.

The non-runtime validator verifies candidate/count/verdict/classification completeness; exact Markdown rendering; reason declaration and source trace coverage; required inventories and five outputs; base/HEAD/AGENTS/patch; protected tracked tree and Research OS; allowed output paths; and no automatic ALLOW mapping additions. Mechanical checks do not replace review of manual semantic judgments.

Preserved: audit output/verdict/exit and deny exit 25; permit/classify behavior; CLI/SDK/JSON/report contracts; licensing/offline authority; install/demo paths and version declarations. Work is recommendation-only, additive-only, non-executing, default-off where applicable, with no authority/control-plane/dashboard/orchestration expansion. Experiment 2B reviewer packages/questions/contracts/history remain untouched. No reconciliation artifact is committed.
