# MindForge Evidence Semantics Registry - Core v0.1

Status: Gate 1 semantic specification. No production MESR registry or loader is implemented in this phase.

## 1. Purpose And Layer Boundary

MESR Core v0.1 gives bounded evidence concepts stable meaning between the Evidence Contract and EAK claim-support evaluation.

```text
Evidence Contract transports facts.
MESR stabilizes meaning.
EAK limits claims.
Governance Report communicates downstream disposition.
```

Evidence Pack remains the only factual input to Guard Core. MESR neither creates facts nor replaces the Evidence Contract. EAK evaluates claim support against MESR-bound facts. Existing Governance Report values remain downstream and unchanged.

## 2. Entry Contract

Every semantic entry must contain:

| Field | Contract |
| --- | --- |
| `semantic_id` | Stable, globally unique machine-readable identifier. |
| `namespace` | Owning namespace; only Core may own `mesr.core.*`. |
| `version` | Semantic version of this entry's contract. |
| `definition` | Normative bounded meaning. |
| `status` | `draft`, `active`, `deprecated`, or `superseded`. |
| `supports` | Claims this meaning can support when required bindings are satisfied. |
| `does_not_support` | Stronger or adjacent claims explicitly prohibited from inference. Required and non-empty. |
| `stronger_than` | Semantic IDs for strictly weaker meanings, when applicable. |
| `weaker_than` | Semantic IDs for strictly stronger meanings, when applicable. |
| `conflicts_with` | Semantic IDs that cannot describe the same bound fact at the same evaluation point. |
| `required_bindings` | Subject, scope, time, provenance, and type-specific bindings required for use. |
| `provenance` | Authoritative registry source and change record. |
| `supersedes` | Prior ID or version explicitly replaced by this entry. |
| `deprecated_by` | Replacement ID when status is `deprecated`. |

Unknown or absent fields never support a stronger claim. `does_not_support` protects against semantic inflation such as `logged -> evidenced -> verified -> assured -> approved -> compliant -> safe`.

## 3. Core Primitive Registry

Core v0.1 contains exactly 30 primitives. Domain-specific requirements are not Core primitives.

| # | Family | Semantic ID | Definition | Required bindings | Supports | Does not support |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Actor | `mesr.core.actor.principal` | Entity on whose behalf an action or claim is represented. | `principal_id`, provenance | principal identity reference | verified identity, authority, approval |
| 2 | Actor | `mesr.core.actor.actor` | Entity that performed or is reported to have performed an action. | `actor_id`, subject, provenance | actor attribution | principal equivalence, authority, intent correctness |
| 3 | Actor | `mesr.core.actor.identity_assertion` | Assertion binding an identifier or credential to an actor. | actor, credential/source, observed/verified time | identity assertion presence; verified identity only with verification | authority, delegation, current standing |
| 4 | Authority | `mesr.core.authority.source` | Identified source from which an authority claim originates. | source identity, subject, provenance | authority-source attribution | source validity, applicable authority, execution permission |
| 5 | Authority | `mesr.core.authority.scope` | Bounded actions, targets, resources, and constraints to which authority evidence refers. | subject, action, target, scope, valid time, provenance | scope-bounded authority claim | broader authority, current authority without temporal basis |
| 6 | Authority | `mesr.core.authority.delegation` | Recorded transfer of bounded authority from a source to a delegate. | delegator, delegate, scope, valid time, provenance | delegation occurrence and bounded scope | authority amplification, transitive delegation, execution permission |
| 7 | Authority | `mesr.core.authority.declared` | Producer-supplied authority assertion without independent authority verification. | producer, subject, scope, asserted time | declared authority only | verified authority, current authority, execution authorization |
| 8 | Intent / Action | `mesr.core.intent.intent` | Declared objective associated with a subject or proposed action. | declaring actor, subject, scope, time | intent declaration | action occurrence, outcome, authority |
| 9 | Intent / Action | `mesr.core.action.action` | Bounded act proposed, attempted, observed, or completed. | actor, target, action type, time, provenance | action-state claim within captured bounds | authorization, correct outcome, causal attribution |
| 10 | Intent / Action | `mesr.core.action.tool_invocation` | Invocation or attempted invocation of a named tool. | actor, tool, inputs/ref, status, time, provenance | invocation occurrence/status | tool-output truth, authorization, safe effect |
| 11 | Boundary | `mesr.core.boundary.authority` | Limit within which an authority claim may be evaluated. | subject, allowed action, target/scope, time | authority-boundary match | authority validity by itself, approval |
| 12 | Boundary | `mesr.core.boundary.execution` | Limit between evidence interpretation and an external execution decision. | evaluated claim, external decision owner | separation of assurance from execution | execution permission or control |
| 13 | Boundary | `mesr.core.boundary.effect` | Limit of effects attributable to a bounded action or transition. | action, target, before/after state, provenance | bounded effect claim | outcome correctness, complete side-effect absence |
| 14 | Boundary | `mesr.core.boundary.reliance` | Context and time in which an institution relies on evidence. | relying party/context, `basis_valid_at`, provenance | reliance-basis evaluation | timeless validity or universal applicability |
| 15 | Effect / Outcome | `mesr.core.effect.effect` | Observed or asserted change associated with an action. | action ref, affected subject, time, provenance | bounded effect occurrence | causation, correctness, safety |
| 16 | Effect / Outcome | `mesr.core.effect.outcome` | Result state observed or asserted after an action or transition. | subject, state, observation time, provenance | outcome occurrence | causal attribution, desired outcome, safety |
| 17 | Effect / Outcome | `mesr.core.effect.state_transition` | Bound movement from one identified state to another. | `from_state`, `to_state`, boundary, time, provenance | transition occurrence | authority, correctness, completeness |
| 18 | Evidence | `mesr.core.evidence.item` | Addressable artifact or record offered as evidence. | evidence ID/ref, producer/source, subject, provenance | evidence presence and bounded content | sufficiency, truth, authority |
| 19 | Evidence | `mesr.core.evidence.observation` | Recorded observation made by an identified source or method. | observer/source, subject, method, observed time | observation occurrence/content | independent verification, truth beyond method |
| 20 | Evidence | `mesr.core.evidence.attestation` | Signed or attributable assertion by an identified attester. | attester, subject, assertion, time, provenance | attributable assertion/authenticity when verified | claim correctness, authority unless separately bound |
| 21 | Evidence | `mesr.core.evidence.verification` | Bounded act that checks a stated property using an identified method and verifier. | verifier, method, subject, scope, `verified_at`, result, limitations | checked property within scope | approval, execution authority, untested properties |
| 22 | Claim | `mesr.core.claim.claim` | Evaluated proposition with an explicit subject and boundaries. | claim ID, subject, predicate, scope, time | claim identity | claim truth or support without evidence |
| 23 | Claim | `mesr.core.claim.scope` | Subject, scope, time, and provenance boundary of a claim. | subject, scope, valid/reliance time, provenance | bounded applicability | transfer to another subject/scope/time |
| 24 | Claim | `mesr.core.claim.support_relation` | Relation between bound evidence and a bound claim. | evidence refs, claim ref, evaluator/version, rationale | one relation from the controlled set | governance disposition, execution permission |
| 25 | Provenance | `mesr.core.provenance.producer` | Entity or process that emitted or packaged evidence. | producer identity/version, output ref, time | production attribution | independent verification, issuer trust |
| 26 | Provenance | `mesr.core.provenance.verifier` | Entity or process that performed a bounded verification. | verifier identity/version, method, subject, time | verification attribution | independence unless producer separation is established |
| 27 | Provenance | `mesr.core.provenance.lineage` | Ordered source and transformation history of an artifact or semantic result. | source refs, transformations, versions, times | traceable lineage | truth, completeness, authority |
| 28 | Temporal | `mesr.core.temporal.basis` | Evaluation of whether evidence remains a valid basis at reliance time. | produced/observed/verified time, `basis_valid_at`, expiry/revocation/supersession refs | one controlled basis status | timeless validity, authority by itself |
| 29 | Review | `mesr.core.review.review` | Human or institutional review event over a bound subject. | reviewer, subject hash/ref, scope, time, provenance | review occurrence | applicable reviewer authority, approval, execution permission |
| 30 | Review / Uncertainty | `mesr.core.review.disposition` | External or Guard report expression about a reviewed evidence state, retaining residual uncertainty. | review/evaluation ref, decision/rationale ref, owner, time | bounded disposition record | semantic truth, execution authority, certification |

`residual_uncertainty`, `missing`, `partial`, `conflicting`, and `unsupported` are controlled states attached to claim support relations and dispositions, rather than extra ontology objects. This keeps Core thin.

## 4. Controlled Binding Vocabulary

The following are fields or relations on the 30 primitives, not additional Core objects:

- Actor: `credential`.
- Authority: `valid_from`, `valid_until`, `revocation`.
- Action: `target`.
- Claim: `claim_subject`.
- Provenance: `source`, `transformation`.
- Temporal: `observed_at`, `verified_at`, `valid_at`, `freshness`, `superseded_by`, `basis_valid_at`.
- Review: `decision_ref`, `rationale_ref`.
- Uncertainty: `missing`, `partial`, `conflicting`, `unsupported`, `residual_uncertainty`.

Bindings are namespaced contract fields. A Domain Pack may specialize their allowed shape but cannot weaken Core requirements.

## 5. Claim Support Relation Contract

| Relation | Meaning | Deterministic condition |
| --- | --- | --- |
| `supports` | Evidence is sufficient for the exact bound claim. | All required bindings match; no disqualifying contradiction; evidence meets the claim rule. |
| `partially_supports` | Evidence supports a strict subset of the claim or required bindings. | Supported subset and missing/weak bindings are explicit. |
| `contradicts` | Evidence is materially inconsistent with the bound claim. | Conflict is explicit, traceable, and evaluated under the same subject/scope/time. |
| `does_not_support` | The evidence type or state is explicitly insufficient for the stronger claim. | A registered non-claim boundary applies; this is not proof that the claim is false. |
| `indeterminate` | Available evidence cannot establish another relation. | Missing, stale, ambiguous, inapplicable, or unresolvable basis remains. |

Relations are mutually exclusive for the same evidence set, claim, evaluator version, and `basis_valid_at`. Residual uncertainty may accompany any relation and cannot be suppressed.

## 6. Current EAK PoC Compatibility

Phase 2 must add an explicit versioned binding. The default design is:

| Current PoC status | MESR relation | Constraint |
| --- | --- | --- |
| `supported` | `supports` | Only when MESR required bindings are satisfied. |
| `contradicted` | `contradicts` | Contradiction must retain evidence refs. |
| `insufficient_evidence` | `indeterminate` | Missing evidence remains explicit. |
| `inadmissible` | `indeterminate` | Admissibility stays a separate dimension. |
| `unsupported` | `does_not_support` or `indeterminate` | `does_not_support` requires a registered boundary; otherwise use `indeterminate`. |

This specification does not modify the PoC implementation.

## 7. Namespace And Semantic ID Architecture

Namespaces are lowercase dotted identifiers:

- `mesr.core.*` - Core meaning, owned only by the Core registry.
- `mesr.domain.software.*` - Software Change Domain Pack.
- `mesr.domain.<reserved>.*` - future domain namespaces; Finance and Healthcare are not product packs in v0.1.
- `mesr.xw.<source>.*` - external vocabulary crosswalk entries.
- `mesr.profile.<institution>.*` - presentation/profile identifiers; never Core meanings.

Rules:

1. A semantic ID does not contain a mutable version.
2. `version` carries the semantic version separately.
3. Domain modules cannot allocate `mesr.core.*`.
4. Crosswalks cannot redefine their mapping target.
5. Profiles cannot create aliases that alter claim boundaries.
6. Deprecated IDs remain resolvable and never silently change meaning.

## 8. Versioning

- Patch: wording or provenance correction with identical normative meaning and bindings.
- Minor: compatible additive semantics, optional bindings, or non-weakening non-claims.
- Major: incompatible required-binding, definition, relation, or non-claim change. A major change normally requires a new semantic ID or explicit `supersedes` chain.
- Deprecation: retain the old entry with `status: deprecated` and `deprecated_by`.
- Supersession: the replacement declares `supersedes`; consumers do not auto-upgrade without an explicit compatibility rule.

Removing a non-claim, weakening required bindings, or changing what a semantic entry supports is incompatible even if its JSON shape is unchanged.

## 9. Determinism And Failure

Same evidence bytes + same Evidence Contract version + same MESR entry versions + same EAK version + same `basis_valid_at` must yield the same semantic bindings and support relations. Unknown IDs, unresolved versions, conflicting definitions, missing required bindings, and namespace collisions fail closed to rejection or `indeterminate`; they never resolve to a stronger claim.

## 10. Explicit Non-Goals

Core v0.1 is not a universal ontology, knowledge graph, policy engine, compliance engine, authority issuer, certification registry, legal determination service, runtime controller, LLM reasoning layer, or cloud dependency.
