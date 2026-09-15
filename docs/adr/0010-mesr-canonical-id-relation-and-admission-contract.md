# ADR 0010: MESR canonical ID, relation and admission contract

- Status: Phase A B01 specification disposition; no registry, resolver or evaluator implementation admitted.
- Contract: `mesr-canonical-admission/0.1` (documentation identifier, not a runtime enum).
- Depends on: [ADR 0009](0009-commercial-baseline-ownership-and-version-dimensions.md), [ADRs 0005](0005-mindforge-evidence-semantics-registry.md) and [0006](0006-composable-evidence-assurance-architecture.md).

## Canonical identity and mapping

Current implementation remains canonical. Preserve the 30 existing `mesr.core.*` entries, their meanings, supports, nonclaims and bindings; preserve domain, crosswalk and profile namespaces. Identity is the stable semantic ID interpreted with its pinned entry version, registry version and content digest. A string match without that basis does not establish semantic equivalence.

The authoritative candidate register is V8-000's [41 Core + 3 metadata rows](../mesr/implementation-reconciliation.v0.1.json), readable in the [matrix](../mesr/07_IMPLEMENTATION_RECONCILIATION_MATRIX.md), at reconciliation commit `9d535a9329054d645ad1fc56e36bfe267eb33f26`. Every row retains exactly one existing implementation verdict: `ALREADY_IMPLEMENTED`, `ALIGN_AND_ADOPT`, `NEEDS_EXPERIMENT`, or `REJECT_OR_DEFER`. Phase A does not reclassify rows.

Research short IDs are **mapping keys, not automatic aliases**. `current_implementation_analogue` means a comparison target, not equality. All 44 rows fail exact equivalence admission; **zero aliases and zero new canonical IDs are admitted by this ADR**. No second registry is created.

| Reconciled case | Disposition |
|---|---|
| `identity.declared` -> `mesr.core.actor.identity_assertion` | PARTIAL meaning / CONFLICT claim boundary: existing entry supports verified_identity. Retain ALIGN_AND_ADOPT only for a separately specified additive facet; never narrow the old entry by alias. |
| `verification.execution_absent`, `verification.independent`, `evidence.integrity_verified` | NEEDS_EXPERIMENT remains; comparison to existing verification/verifier entries grants no equivalence. |
| `evidence.sufficient` | ALIGN_AND_ADOPT retains REQUIRES_REPORT_MIGRATION when projected into the existing report; B01 does not admit that migration or stronger legacy allow wording. |
| `authority.reachable` | **REJECT_OR_DEFER** remains; no reachability service or orchestration requirement. |
| `mesr_assurance.replayable`, `mesr_assurance.claim_stable`, `mesr_assurance.semantic_portable` | Interpretation-process assurance metadata only. Retain the one ALIGN_AND_ADOPT / two NEEDS_EXPERIMENT verdicts. No world/action evidence, truth, independent verification or universal interoperability claim. |

## Alias and version admission

A future alias dossier MUST bind source key/version/digest to target canonical ID/version/digest and demonstrate all of:

1. EXACT meaning, subject, scope, temporal and provenance semantics.
2. EXACT positive claim set AND EXACT explicit nonclaim set, including contextual exclusions.
3. EXACT binding obligations, value predicates, applicability and failure behavior; matching field names alone are insufficient.
4. Compatible version evidence, deterministic positive/negative fixtures, consumer impact review and an explicit admission decision.

PARTIAL meaning, PARTIAL claim boundary, NONE or CONFLICT prohibits an alias. Missing proof also prohibits it. An ALIGN_AND_ADOPT verdict or proposed relation is not alias permission. A compatibility alias must resolve deterministically to one pinned identity, preserve the original key in provenance, reject cycles/ambiguous targets and never use an unpinned latest version. No automatic reverse alias or transitive alias is inferred from mappings.

New descriptive mappings may be additive, but must carry source/target provenance, both versions, mapping purpose, limitations, binding differences, compatibility impact and verdict reference. They must not silently widen supports or remove nonclaims. A mapping contributes no support by itself.

Editorial corrections that preserve every observable semantic obligation may retain identity with a reviewed patch version. Additive entries/metadata require an explicitly versioned opt-in contract; no extra field is injected into existing serialized output. A changed meaning, support set, nonclaim, required binding or temporal predicate needs a distinct semantic revision/new ID and explicit supersession/migration review, even if described as stronger. A version bump alone is not compatibility proof.

Supersession records the predecessor ID/version/digest, successor, effective applicability, rationale and compatibility limits. It does not erase history, retarget old evidence, imply entailment, or retroactively make historical evidence current. Pinning an unavailable version fails admission; do not silently substitute its successor. Existing `status`, `supersedes` and `deprecated_by` fields remain unchanged; this ADR does not claim a historical resolver exists.

## Typed relation contract

Each proposed edge records source/target identity and versions, direction, subject/scope/time conditions, proof references, nonclaims and admission status. Edges are specification metadata; none activates runtime traversal. They are separate from MESR's five claim support relations.

| Relation A -> B | Meaning | Permitted inference boundary |
|---|---|---|
| `refines` | A specializes B in an explicitly bounded context | Inheritance requires a separate proof; it does not automatically entail B or create an alias. |
| `requires` | Evaluating/supporting A requires the specified B basis | Requirement is not satisfaction; missing B cannot support A. No converse inference. |
| `entails` | Under recorded assumptions, every admissible support basis for A supports B | Requires explicit claim/binding proof and preserved exclusions; compose only with compatible subject/scope/time and assumptions. No default transitive closure. |
| `orthogonal_to` | A and B concern independent semantic dimensions for the stated context | Symmetric descriptive relation; neither orders, supports nor negates the other. Not transitive. |
| `adjacent_to` | Contextually related concepts with no asserted implication | Symmetric descriptive relation; no support inference or transitivity. |
| `conflicts_with` | Specified predicates cannot jointly hold under the same bound context | Symmetric only for the stated conflict basis; a declared edge is not evidence that either instance occurred or is false. |
| `supersedes` | A is an explicitly admitted successor to B | Directional lifecycle link; not semantic equality, entailment or currentness proof. Reject lifecycle cycles. |

`stronger_than` and `weaker_than` remain **inactive**. Their existing empty edges are preserved. Activation would require a separately admitted strict monotonic entailment proof within the same dimension and bound claim domain (A entails B, B does not entail A), retained nonclaims, and cycle/compatibility checks. Verification result, independence, integrity, coverage, custody, authority and acceptance must not become a generic maturity ladder.

## Module compatibility and acceptance

Core defines meaning. Modules extend context. No module may silently redefine evidence. Preserve the existing module types `core`, `domain_pack`, `crosswalk`, `institutional_profile`; producers and consumers remain interfaces. A proposed module must pin compatible Core/dependency versions and digests, preserve Core binding/nonclaim obligations, and reject duplicate IDs, overrides, alias cycles, incompatible versions and claims widened through mappings. Presentation cannot change support results. B08 retains implementation-level resolver/version-hardening work; no resolver changes occur here.

B01 = **PASS** for specification closure. Before any implementation, admission evidence must falsify partial/conflicting aliases, nonclaim removal, binding weakening, unsupported relation inference and cross-dimension strength ordering. Repaired Experiment 3 is not executed. B04-B10 remain outside Phase A; Gate 1 remains blocked.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged; recommendation-only, additive-only, non-executing, default-off; no authority scope expansion. Existing reason codes, EvidencePackV1, GovernanceReportModel, CLI/SDK and historical fixtures remain unchanged.
