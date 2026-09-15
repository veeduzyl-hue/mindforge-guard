# ADR 0016: MESR module version lock and noninterference contract

- Status: B08 specification decision, 2026-09-15; SPECIFICATION_ONLY.
- Contract: `mesr-composition-lock/0.1`, a future validation envelope around existing manifests/composition, not a resolver platform.
- Inputs: [B01](0010-mesr-canonical-id-relation-and-admission-contract.md), [B02](0011-mesr-claim-nonclaim-state-and-binding-contract.md), [moduleManifest.ts](../../packages/guard-core/src/mesr/moduleManifest.ts), [types.ts](../../packages/guard-core/src/mesr/types.ts), [existing composition verifier](../../scripts/verify_mesr_composition.mjs).

## Existing substrate and precise debt

The current four types are `core`, `domain_pack`, `crosswalk`, `institutional_profile`. Keep them. Producers/consumers are interfaces, not runtime semantic module types. Current composition sorts by type then module_id.localeCompare, checks dependency presence and cycles, namespace ownership, semantic collisions, declared overrides and conformance requirements. It returns INVALID_COMPOSITION with empty semantic_entries, mappings and profiles on any collected issue.

Current validation accepts exactly the string `>=0.1.0 <0.2.0` for core_compatibility; it does not compute arbitrary version ranges or evaluate dependency.version. Duplicate module IDs are not explicitly rejected (Set/Map can collapse them). The four forbidden support strings are not an exhaustive support/nonclaim/binding proof. No content lock, general alias resolver, admitted supersession evaluator or full entry noninterference proof is established by this code. Existing tests establish bounded override/collision/type cases, not the repaired negatives below.

Core defines meaning. Modules extend context. No module may silently redefine evidence.

## Versioned lock envelope

The future auxiliary envelope has closed fields: contract_version, registry, modules, relation_ledger_ref, admission_basis_refs, validation_method and input_set_id. Missing/unknown fields, unavailable bytes or unsupported formats fail admission, without mutating old manifest objects. Registry contains exact version, content digest, canonicalization_method and Core identity/version/digest. Every modules row contains unique module_id, module_type, exact version, namespace, manifest_byte_ref/SHA-256, semantic_content_digest, dependencies and compatibility_basis_ref. Dependencies list exact module_id/version/digest tuples. Lock rows are sorted by type rank then module ID and must match the actual complete supplied manifest set with no extras/omissions.

For this bounded envelope, module/registry versions use exact numeric MAJOR.MINOR.PATCH with no leading zeros, prerelease/build suffix, wildcard, latest or network selection. Dependency.version must be an exact version and equal the resolved dependency's version; unsupported range syntax fails explicitly. The existing Core compatibility expression is retained verbatim and additionally evaluated as the numeric half-open interval 0.1.0 <= selected Core < 0.2.0. A different Core range/contract requires separate admission; this phase does not invent a general version language. Matching versions alone never prove compatible meaning.

Crosswalk source_version is external vocabulary metadata (e.g. existing test-only-v0.1), not coerced to a semantic module version. Its source document/version/digest and target canonical ID/version/digest must resolve through an admitted mapping basis. Institutional profiles pin the Core/domain/crosswalk versions they reference through the auxiliary compatibility basis, even when the current presentation-only manifest does not declare all those dependencies. Missing proof fails admission rather than silently adding manifest fields.

Hash exact supplied manifest bytes with SHA-256, record representation and byte length, and verify parsed manifest equality to the locked content. For in-memory manifests, the later method must export an explicitly identified canonical JSON representation: recursively sort object keys by Unicode code point, preserve array order, UTF-8 without BOM, no whitespace, JSON primitive encoding, reject non-JSON values, nonfinite numbers and duplicate keys. The semantic_content_digest covers the complete exported manifest (including entries, supports, nonclaims, bindings, relations, mappings and presentation); separate entry digests cover each full entry. Registry digest covers its full versioned definition/boundary/binding inventory with the same explicit canonicalization. A byte digest is not interchangeable with a content digest. The lock and referenced admission proofs are separately attributable and digest-bound; a producer rewriting both content and its own lock cannot establish admission.

## Deterministic validation and atomic admission

All checks happen on a temporary composition. No registered entry, mapping or presentation is published until every check succeeds. Reuse existing validateMesrModuleManifest/composeMesrModules behavior in a later opt-in validator; do not rewrite them now. A new validation failure must produce **zero admitted semantic entries, zero admitted mappings and zero admitted profiles for that composition**. Previously valid independent compositions remain separate; no valid subset of a failing request is silently activated.

| Rule | Required oracle | Existing diagnostic / future envelope diagnostic |
|---|---|---|
| Module uniqueness | Duplicate IDs reject even for identical content/versions and empty profiles | New specification-only `LOCK_DUPLICATE_MODULE_ID` |
| Semantic uniqueness | Duplicate IDs within/across modules reject; no last-write override | Preserve DUPLICATE_MODULE_SEMANTIC_ID, SEMANTIC_COLLISION |
| Dependency presence / cycles | All declared dependencies supplied; no dependency cycle | Preserve MISSING_MODULE_DEPENDENCY, CIRCULAR_MODULE_DEPENDENCY |
| Dependency version | Every exact version and digest matches selected module | New `LOCK_DEPENDENCY_VERSION_MISMATCH` / `LOCK_CONTENT_MISMATCH` |
| Registry/Core compatibility | Registry/Core/version/digest exact; existing range check plus numeric test | Preserve INCOMPATIBLE_CORE_VERSION for existing predicate; new `LOCK_REGISTRY_MISMATCH` for lock discrepancy |
| Content lock | Recompute byte/content digests with declared method and compare all supplied entries | New `LOCK_CONTENT_MISMATCH`; missing/unsupported basis `LOCK_BASIS_UNRESOLVED` |
| Core ownership / overrides | Compare full Core snapshot against pinned authoritative content; no mutation through new namespace or mappings | Preserve SEMANTIC_OVERRIDE_FORBIDDEN, SEMANTIC_COLLISION, namespace diagnostics; new `LOCK_NONINTERFERENCE_UNPROVEN` for unproved indirect modification |
| Support widening | Every inherited/composed inference stays within admitted support/binding/nonclaim contract; no new route around a Core exclusion | Preserve AUTHORITY_EXPANSION_FORBIDDEN for its four strings; new `LOCK_SUPPORT_WIDENING` or `LOCK_NONINTERFERENCE_UNPROVEN` |
| Nonclaim preservation | Every applicable Core/source-path exclusion retained, including contextual application; no hiding via mapping/profile | New `LOCK_NONCLAIM_REMOVAL` |
| Binding preservation | Effective requirements are B02 union; value predicates/context not weakened; mapping proof retains requirements | New `LOCK_BINDING_WEAKENING` |
| Alias cycles / ambiguity | B01 admission dossier required; cyclic/ambiguous edges reject even in a candidate ledger; no alias activated here | New `LOCK_ALIAS_CYCLE` / `LOCK_BASIS_UNRESOLVED` |
| Supersession cycles | Directed lifecycle graph acyclic and endpoints version/digest-bound; predecessor preserved | New `LOCK_SUPERSESSION_CYCLE` |
| Crosswalk/profile compatibility | Exact external/target/module versions resolve and compatibility proofs pass; profile remains presentation-only | Preserve UNRESOLVED_MAPPING_TARGET, INCOMPLETE_MAPPING_PROVENANCE, CROSSWALK_SEMANTICS_FORBIDDEN, PROFILE_SEMANTIC_PARTICIPATION_FORBIDDEN; new `LOCK_CONTEXT_VERSION_MISMATCH` |

All LOCK_* labels above are **specification-only auxiliary diagnostic names**, not new canonical reason codes or current MesrValidationIssue values. Current diagnostic names, fields, ordering and outputs remain unchanged. No renaming to Research vocabulary occurs. The future envelope keeps exact legacy issues separately from its own diagnostics and reports INVALID_COMPOSITION rather than a partial success. Malformed data must be checked before invoking typed functions, avoiding throw-based partial admission.

## Noninterference proof, order and relations

A domain pack may introduce contextual entries only under its owned namespace and an explicit B01 admission basis identifying Core anchors, meaning, supports, exclusions and required predicates. For every proposed support route, provide a deterministic proof obligation that its admissible input domain implies the Core requirements and retains all relevant exclusions. A bare conformance flag, matching string sets or a small forbidden-word list is not proof. A new contextual claim without an existing support analogue needs its own admitted claim/binding contract; unproved relations yield admission failure, not optimistic compatibility. No probabilistic language reasoning is used for admission.

Core snapshot equality is necessary but insufficient: compare effective outputs for frozen base claim requests with/without additive crosswalk/profile context, including each Core nonclaim and omitted/false/empty required binding. Crosswalks can map vocabulary only; `maps_to` is not alias or entails. Profiles present, never change support. B06 assurance profiles remain external evaluation criteria, not semantic participation by institutional_profile.

B01's seven typed relations retain their directions/conditions. No automatic transitive closure, alias or entailment from refines/requires/adjacent_to/orthogonal_to/supersedes; conflicts_with requires bound context. stronger_than/weaker_than remain inactive. Cycles in descriptive adjacent_to/orthogonal_to graphs are not mislabeled lifecycle cycles. Alias/supersession candidate edges are checked as separate typed graphs and never activated by this contract.

Preserve current type order Core -> domain_pack -> crosswalk -> institutional_profile and current module-ID ordering for the pinned environment. Do not replace it with a new scheduler/topological resolver. Require dependencies/targets necessary for evaluation to be available at their existing load position; a graph needing unsupported forward resolution fails with LOCK_BASIS_UNRESOLVED rather than silently reordering. Pin runtime/comparison method for legacy issue ordering. The new envelope uses explicit ASCII module IDs and sorts auxiliary diagnostics by (rule_id, subject, field, related_id, detail) with code-point ordering; messages use fixed templates and never current time, absolute paths or input encounter order. Canonical cycle witnesses start at the least ID and traverse sorted edges. Report all independently evaluable failures; skip dependent semantic inference after unresolved identity/shape and record that missing basis. Reversed/permuted input yields identical canonical diagnostics and admission results. Existing issue bytes are retained as legacy evidence, not retroactively normalized.

## Acceptance and boundary

[B08 cases](../validation/v8-b08-composition-hardening-cases-v0.1.md) specify positive and negative oracles. B08 = PASS for rules against the existing resolver; no runtime tests, resolver platform, module distribution service, alias admission or repaired Experiment 3 execution. Gate 1 remains BLOCKED; B09/B10 are not started.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Existing module types/manifests/diagnostics, canonical IDs, EvidencePackV1, reason codes, GovernanceReportModel and EAK/MESR implementation remain unchanged.
