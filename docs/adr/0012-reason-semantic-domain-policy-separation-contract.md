# ADR 0012: Reason semantics, domain interpretation and policy separation

- Status: B04 specification decision, 2026-09-15; SPECIFICATION_ONLY.
- Contract: `reason-semantic-separation/0.1`; no runtime registration.
- Basis: [V8-000](../planning/13_V8_000_SOURCE_RECONCILIATION.md), [B01](0010-mesr-canonical-id-relation-and-admission-contract.md), [B02](0011-mesr-claim-nonclaim-state-and-binding-contract.md).

## Decision

Preserve all 56 serialized reason values, declaration/binding order, emitter predicates, descriptions, severity hints, report behavior and consumers. Add only this interpretation specification and its [56-code delta ledger](../mesr/reason-code-semantic-delta-v0.1.md). Current source remains authoritative for current behavior. The ledger does not update the existing migration specification or MESR bindings.

| Layer | Owns | Required boundary |
|---|---|---|
| FACT | An attributed source record, exact input field/predicate and observation context | Distinguish a fact about submitted bytes from a fact about the world. Missing record is not event absence. |
| SEMANTIC INTERPRETATION | A bounded claim under pinned Core meaning and admitted domain context | Bind subject, scope, time, evidence, method and nonclaims; B02 governs support states. |
| POLICY RESULT | A named current report rule and recommendation | Review requirement is not proof review never occurred; no execution authority. |
| REPORT WORDING | Existing descriptions, review messages, recommendations and verdict explanations | Preserve bytes and order. Wording is not an independent evidence source. |

Reason-code presence != proof of the world-level semantic proposition. Reason-code absence != proof of its negation. A report can correctly serialize a legacy reason while its proposed world-level interpretation remains UNRESOLVED. An explicitly excluded inference is UNSUPPORTED for that evidence path, without proving world falsity.

## Additive mapping contract

A future opt-in interpretation record must retain source report/pack reference and digest, exact legacy code and occurrence position, source generator/reason-code version, source predicate/location, canonical semantic ID/version/digest, domain mapping version, registry/module lock, subject/scope/evaluation_time, evidence refs, applied policy rule, unchanged wording reference, B02 state, missing bindings and nonclaims. Unknown source context cannot be filled from the reason's English name. Unavailable Harness facts remain unavailable under [B03](../architecture/harness-to-canonical-evidencepackv1-closure-v0.1.md).

The source code is a compatibility key, never a canonical ID alias. Retain `mesr.core.*` and current domain IDs without narrowing or widening their current meanings. Research short IDs remain candidate mapping keys; all 41+3 verdicts and zero-alias admission from B01 remain unchanged. A stricter future facet needs its own versioned admission and independent evidence evaluation; it cannot replace the existing binding's `supported_claim` in place. Core nonclaims, typed relations and inactive stronger/weaker relations remain intact.

## Source-backed obligations

The [ledger](../mesr/reason-code-semantic-delta-v0.1.md) records CURRENT_OBSERVATION, CURRENT_INTERPRETATION, CURRENT_POLICY_EFFECT, CURRENT_REPORT_WORDING, FUTURE_SEMANTIC_MAPPING and NONCLAIMS for every code. It distinguishes 37 implemented trigger codes from 19 declaration/binding-only codes; some direct coverage branches are unreachable after normal report validation. Declaration-only codes acquire no new emitters.

Known collisions are explicit: tests absent/not_run/inconclusive/mixed records; builds with failed or no passed records; release-only rollback requirements; dependency labels and path regexes; cyber/security review classification; authority declarations and pack-time expiry; artifact hashes and references; owner/reviewer metadata. Recovery/remediation/world success must not be inferred from these labels.

Preserve insertion order separately from declaration order: coverage findings append uniquely in source traversal order; report reasons append coverage, verdict, review and next-action reasons, retaining first occurrence. Do not sort serialized output to match the canonical list. Preserve the three scoped blocked-action translations and `art_manifest` reference bypass; they are not global aliases.

## Acceptance and limits

B04 = PASS for specification closure if the complete ledger and falsifiers retain the old behavior while requiring a separate evidential basis for new meanings. No trigger tests or repaired Experiment 3 are run here. Future migration must separately verify unchanged report JSON, Markdown/HTML, evidence indexes, fixtures and CLI/SDK consumers before implementation admission.

Audit output / verdict / exit and deny 25 unchanged; permit/classify unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. EvidencePackV1, reason definitions/bindings, GovernanceReportModel 1.0.0 and MESR/EAK remain unchanged. B09/B10 are pending; Gate 1 remains BLOCKED.
