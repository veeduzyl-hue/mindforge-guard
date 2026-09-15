# B08 composition hardening cases v0.1

Status: **SPECIFICATION_ONLY / NOT_EXECUTED**. Oracles for [ADR 0016](../adr/0016-mesr-module-version-lock-and-noninterference-contract.md), over the existing resolver. These do not freeze/translate the repaired E3 fixture suite or start B09.

## Common fixture obligations

Start with an explicitly supplied Core + Software domain + crosswalk + presentation-only institutional profile set, known existing manifests and admission evidence. Bind input_set_id, exact registry/version/digest, module/version/byte/content locks, entry versions, B01 relation ledger, B02 required predicates, method version and evaluation_time. Preserve current Core snapshot, reason binding list and base claim results. A valid control must prove the lock and semantic obligations, not merely assert valid=true.

For every negative case, the **whole requested composition** is INVALID_COMPOSITION with semantic_entries=[], mappings=[], profiles=[] in the future admission result; no partial activation. Unresolved basis is an admission failure, not a seventh claim state. A downstream requested claim with no admissible composition is UNRESOLVED under B02 unless a higher-priority state applies. Preserve exact current diagnostics separately; LOCK_* names are proposed envelope diagnostics only.

| ID | Case mutation / request | Expected validation oracle |
|---|---|---|
| C01 | Complete compatible, digest-checked control; permutations of supplied modules | VALID_COMPOSITION; same type/ID order, canonical semantic entries and base claim results; presentation metadata may differ only as declared |
| C02 | Duplicate module_id, including two identical empty profile manifests | Reject LOCK_DUPLICATE_MODULE_ID; no Map/Set collapse |
| C03 | Duplicate semantic ID within a module or across modules | Reject DUPLICATE_MODULE_SEMANTIC_ID / SEMANTIC_COLLISION as applicable; no overwrite |
| C04 | Remove a declared dependency | Reject MISSING_MODULE_DEPENDENCY; complete lock also reports missing basis |
| C05 | Present dependency ID but wrong exact version | Reject LOCK_DEPENDENCY_VERSION_MISMATCH; name presence cannot pass |
| C06 | Core compatibility literal changes, or locked registry/Core differs from supplied version/digest | Preserve INCOMPATIBLE_CORE_VERSION for current literal failure; LOCK_REGISTRY_MISMATCH for lock discrepancy; no latest substitution |
| C07 | Same module/version, altered bytes/content or lock digest | Reject LOCK_CONTENT_MISMATCH; producer-rewritten unadmitted lock is not authority |
| C08 | Domain declares existing Core ID or semantic_overrides | Preserve SEMANTIC_COLLISION / SEMANTIC_OVERRIDE_FORBIDDEN and namespace diagnostics; zero entries |
| C09 | New namespace indirectly entails an excluded Core claim or adds support not in admitted contextual contract | Reject LOCK_SUPPORT_WIDENING; unproved route -> LOCK_NONINTERFERENCE_UNPROVEN; four-word deny list insufficient |
| C10 | Remove/omit a relevant Core nonclaim, including hiding it in profile rendering | Reject LOCK_NONCLAIM_REMOVAL; same IDs/definitions do not excuse removal |
| C11 | Remove required subject/custody/time binding or weaken true/nonempty predicate to presence | Reject LOCK_BINDING_WEAKENING; caller/profile cannot subtract registry union |
| C12 | Candidate exact-alias dossier contains A -> B -> A or self edge | Reject LOCK_ALIAS_CYCLE; no aliases activated even for an acyclic candidate without B01 admission |
| C13 | Supersession predecessor/successor graph has cycle | Reject LOCK_SUPERSESSION_CYCLE; historical resolution preserved |
| C14 | Dependency cycle with compatible versions | Preserve CIRCULAR_MODULE_DEPENDENCY; sorted canonical cycle diagnostic independent of input order |
| C15 | Crosswalk targets incompatible target/source version or profile references an incompatible crosswalk | Reject LOCK_CONTEXT_VERSION_MISMATCH; missing proof -> LOCK_BASIS_UNRESOLVED; mappings do not become aliases |
| C16 | Crosswalk adds semantics; profile adds semantics or mappings | Preserve CROSSWALK_SEMANTICS_FORBIDDEN / PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN |
| C17 | Mapping target absent, provenance/limitations empty, or namespace not owned | Preserve UNRESOLVED_MAPPING_TARGET / INCOMPLETE_MAPPING_PROVENANCE / namespace diagnostics; no partial load |
| C18 | Invalid module mixed with otherwise valid Core/domain/crosswalk/profile | Entire request rejected; zero semantic entries/mappings/profiles, not valid subset |
| C19 | Multiple independent failures and reversed/permuted input | Same auxiliary diagnostic tuple set/order and fixed messages; deterministic canonical cycle witness; legacy issues retained separately |
| C20 | Producer or Consumer offered as semantic module type; malformed arrays/entry data | Reject LOCK_BASIS_UNRESOLVED at shape/type boundary before typed resolver; only four existing types |
| C21 | dependency.version uses range/latest/prerelease syntax outside bounded lock grammar | Reject LOCK_BASIS_UNRESOLVED with exact unsupported syntax; no network selection |
| C22 | Reordered array changes canonical manifest content; newline-only raw byte edit | Recompute separately: content change breaks content lock; raw-only edit still breaks byte lock unless explicitly admitted as new representation |
| C23 | Mapping/profile preserves Core bytes but changes base claim support/required bindings | Reject noninterference even though Core snapshot hash matches |
| C24 | Descriptive orthogonal/adjacent edges form cycles without lifecycle/alias edges | No alias/supersession-cycle failure merely for descriptive cycles; no support inference |
| C25 | Forward dependency/target needs load order incompatible with current type/ID traversal | Reject LOCK_BASIS_UNRESOLVED for unsupported resolution; no new resolver scheduler |
| C26 | Supersession or refines silently activated as entailment; stronger/weaker activated without proof | Reject unadmitted semantic participation/noninterference; preserve B01 relation types/inactive edges |
| C27 | All flags say conformant but no attributable admission dossier or noninterference proof | Reject LOCK_NONINTERFERENCE_UNPROVEN / LOCK_BASIS_UNRESOLVED; declarations do not establish compatibility |

Future test assertions must compare full zero-entry failure output, every retained nonclaim/binding and exact old diagnostic vocabulary, not merely a boolean. These are unexecuted specifications; existing composition verifiers are not evidence of repaired oracle success. No runtime/product changes, B09/B10 work, or Gate 1 opening.
