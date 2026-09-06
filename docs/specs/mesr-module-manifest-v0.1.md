# MESR Module Manifest And Semantic Non-Interference v0.1

Status: Gate 1 manifest contract. No production module loader is implemented in this phase.

## 1. Composition Model

```text
Stable Core
+ Additive Domain Packs
+ External Crosswalks
+ Institutional Profiles
```

Core defines meaning. Modules extend context. No module may silently redefine evidence meaning.

## 2. Module Types

| Type | May do | Must not do |
| --- | --- | --- |
| `core` | Define `mesr.core.*`, Core bindings, relations, and non-claims. | Grant execution authority or replace Evidence Contract/Report. |
| `domain_pack` | Add domain scope, bindings, interpretation, and stricter requirements in its namespace. | Allocate Core IDs, weaken Core bindings/non-claims, change Core support relations. |
| `crosswalk` | Map an external vocabulary concept to an existing MESR ID with provenance and limitations. | Copy normative authority, certify conformance, redefine the target. |
| `institutional_profile` | Change language, grouping, presentation, emphasis, and report layout. | Change semantic IDs, claim boundaries, temporal results, or `supports_claim()`. |

## 3. Manifest Contract

```yaml
module_id: mesr.module.software.v0_1
module_type: domain_pack
version: 0.1.0
semantic_namespace: mesr.domain.software
core_compatibility: ">=0.1.0 <0.2.0"
dependencies:
  - module_id: mesr.core
    version: 0.1.0
added_semantics:
  - mesr.domain.software.change.subject
mappings: []
external_references: []
prohibited_overrides:
  - mesr.core.*
  - core.required_bindings
  - core.support_relations
  - core.does_not_support
conformance_requirements:
  - semantic_non_interference
  - deterministic_resolution
  - explicit_provenance
  - no_execution_authority
```

Required fields are `module_id`, `module_type`, `version`, `semantic_namespace`, `core_compatibility`, `dependencies`, `added_semantics`, `mappings`, `external_references`, `prohibited_overrides`, and `conformance_requirements`. Arrays are present even when empty so canonical serialization is deterministic.

## 4. Namespace And Dependency Rules

1. `module_id`, namespace, and version uniquely identify a module release.
2. Only `core` owns `mesr.core.*`.
3. A Domain Pack owns exactly its declared `mesr.domain.<domain>.*` namespace.
4. A Crosswalk owns `mesr.xw.<source>.*`; every mapping has an external concept, target semantic ID, mapping relation, source version, provenance, and limitations.
5. A Profile owns `mesr.profile.<institution>.*` identifiers but no semantic meaning.
6. Dependencies form an acyclic, version-resolved graph. Missing, circular, or incompatible dependencies reject the composition.
7. Resolution order is Core, Domain Packs sorted by `module_id`, Crosswalks sorted by `module_id`, then Profiles sorted by `module_id`.

## 5. Semantic Non-Interference

For a fixed Evidence Pack, Core version, EAK version, and `basis_valid_at`:

```text
supports_claim(Core + Domain Pack)
=
supports_claim(Core + Domain Pack + any conforming Crosswalks + any conforming Profiles)
```

A Domain Pack may add new domain claims, but it cannot change the evaluation of an already-defined Core claim. A stricter domain applicability requirement may make a domain claim indeterminate; it cannot rewrite Core meaning.

## 6. Collision Detection

A future loader must reject a module before evaluation when it:

- defines an existing semantic ID with different normative content;
- allocates outside its namespace;
- removes or weakens a Core `required_binding` or `does_not_support` entry;
- changes a Core support relation;
- maps presentation text back into semantic evaluation;
- claims normative or legal authority from a Crosswalk;
- creates an execution permission, approval, certification, or enforcement result.

Mandatory collision fixtures:

| Collision | Expected result |
| --- | --- |
| `verified = approved` | `INVALID_MODULE` |
| `identity_verified = authority_verified` | `INVALID_MODULE` |
| `signature_valid = artifact_true` | `INVALID_MODULE` |
| `framework_mapped = legally_compliant` | `INVALID_MODULE` |
| `assessment_passed = execution_authorized` | `INVALID_MODULE` |

Rejection must identify module, conflicting entry, protected field, and deterministic reason code. It must not partially load the module.

## 7. Conformance Tests Required In Phase 2

- manifest shape and canonical serialization;
- namespace ownership;
- dependency compatibility and cycle rejection;
- duplicate-ID identical-definition handling without duplicate meaning;
- conflicting-definition rejection;
- Core claim results stable before/after Crosswalk and Profile load;
- collision injection rejection;
- no execution-authority field in semantic output.

## 8. Non-Goals

This contract does not create a marketplace, plugin runtime, knowledge graph, remote registry, dynamic code execution path, policy engine, certification system, or hosted control plane.
