# Experiment 3 - Semantic Portability And Composition Validation v0.1

Status: V8.0 architecture acceptance suite design. All cases are `DESIGNED / NOT RUN`; no portability or composition hypothesis is claimed as passed.

## 1. Purpose

Experiment 3 is the V8.0 semantic architecture acceptance suite. It tests whether different producers, domain contexts, vocabularies, and module compositions preserve Core meaning and bounded claim support.

It is not a research spike, design-partner workflow measurement, compliance assessment, or runtime enforcement test.

The name `Experiment 3` is scoped to V8.0 semantic architecture. Numbered experiments inside the earlier Production Evidence Readiness validation roadmap are document-local workflow/commercial phases and are not silently reclassified by this suite.

## 2. Acceptance Protocol

Every executable case must pin:

- Evidence Contract version;
- MESR Core and module versions;
- EAK evaluator version;
- `basis_valid_at`;
- canonical fixture bytes and expected result bytes;
- producer and verifier identity/version;
- expected support relations and explicit non-claims.

Same pinned inputs must replay byte-equivalently after canonical ordering. A failure cannot be waived by changing vocabulary, presentation, or module order.

## 3. E3-A - Runtime Portability

### E3-A1 - Same Software Change / Different Producers

- `experiment_id`: `E3-A1`
- `hypothesis`: Three producer representations of one software change bind to the same Core semantics and claim boundaries.
- `fixture`: One immutable base/candidate diff, test result, review record, and release-effect record expressed three ways.
- `producer`: GitHub Actions; Guard-native Harness; MCP or OpenTelemetry-derived adapter.
- `domain_context`: Software Change Pack v0.1.
- `input_vocabulary`: GitHub job/artifact terms; native Evidence Pack terms; MCP/OTel event/span terms.
- `expected_core_semantics`: identical IDs for action, authority scope, verification, state transition/effect, review, temporal basis, and claim scope.
- `expected_support_relations`: identical `supports`, `partially_supports`, `contradicts`, `does_not_support`, or `indeterminate` results for the same claims; runtime metadata may differ.
- `explicit_non_claims`: producer normalization does not establish independent verification, authorization, correctness, or production safety.
- `pass_condition`: Canonical semantic bindings, claim boundaries, and EAK results match across all three producers.
- `fail_condition`: A producer requires a different Core meaning/engine, or produces a stronger claim from vocabulary alone.
- `architecture_implication_if_failed`: Runtime Portability and PH-02 weaken; do not add adapters until the mismatch is isolated to a Domain Pack or the Core is reduced without semantic inflation.

### E3-A2 - APAAI Versus Native Evidence

- `experiment_id`: `E3-A2`
- `hypothesis`: External policy-evaluation vocabulary and native evidence preserve the same authority boundary.
- `fixture`: Equivalent records containing `policy_evaluated = true` and native policy-observation evidence.
- `producer`: Synthetic APAAI-style producer and Guard-native producer.
- `domain_context`: Core plus Software Change Pack.
- `input_vocabulary`: `policy_evaluated`, `policy_match`, native `policy_observation`.
- `expected_core_semantics`: evidence observation, claim scope, provenance producer, support relation.
- `expected_support_relations`: policy evaluation presence may be `supports`; `authority_verified` and `execution_authorized` are `does_not_support`.
- `explicit_non_claims`: authority verified, execution authorized, legal compliance, safe.
- `pass_condition`: Both inputs yield the same non-claims and no authority elevation.
- `fail_condition`: `policy_evaluated = true` changes an authority or execution claim to `supports`.
- `architecture_implication_if_failed`: Claim Stability fails for policy vocabulary; reject the Crosswalk or tighten Core boundary rules.

### E3-A3 - Self-Modifiable Runtime

- `experiment_id`: `E3-A3`
- `hypothesis`: Capability change is evaluated independently from authority continuity.
- `fixture`: Before tools `[read]`; after tools `[read, write]`; existing authority remains read-only.
- `producer`: Guard-native synthetic runtime fixture.
- `domain_context`: Core runtime/action context.
- `input_vocabulary`: tool capability inventory and authority scope.
- `expected_core_semantics`: action/tool invocation, authority scope/boundary, state transition, temporal basis.
- `expected_support_relations`: `capability_continuity = changed`; `authority_continuity = does_not_support` or `indeterminate` if the authority source cannot be resolved.
- `explicit_non_claims`: write authorized, authority amplified, execution permitted.
- `pass_condition`: Capability delta is visible and never upgrades authority.
- `fail_condition`: Unchanged actor identity or runtime continuity implies write authority.
- `architecture_implication_if_failed`: INV-04 fails; V8 implementation must stop until capability and authority models are separated.

## 4. E3-B - Domain Interpretation

### E3-B1 - Software Versus Finance Delegation

- `experiment_id`: `E3-B1`
- `hypothesis`: Core delegation survives different domain scope shapes without domain-specific Core engines.
- `fixture`: Principal A delegates action X to actor B within S until T; S is repository/path for software and account/instrument/amount for a synthetic finance case.
- `producer`: Guard-native synthetic fixture producer.
- `domain_context`: Software product pack; Finance synthetic architecture fixture only.
- `input_vocabulary`: repository/path and account/instrument/amount.
- `expected_core_semantics`: principal, actor, delegation, authority scope/boundary, temporal basis.
- `expected_support_relations`: Both support delegation occurrence only within their bound scope; neither supports authority amplification or Guard authorization.
- `explicit_non_claims`: Finance product support, trading authorization, legal compliance, execution permission.
- `pass_condition`: One Core delegation model evaluates both contexts; domain bindings differ only in shape.
- `fail_condition`: Finance syntax forces redefinition of Core delegation or authority meaning.
- `architecture_implication_if_failed`: PH-01 Thin Core is weakened; reduce/reshape Core before adding a Finance pack.

### E3-B2 - Software Versus Healthcare Review

- `experiment_id`: `E3-B2`
- `hypothesis`: Review occurrence is Core; applicable reviewer-authority requirements remain domain context.
- `fixture`: Reviewer, review artifact, reviewed subject, and time in software and synthetic healthcare cases.
- `producer`: Guard-native synthetic fixture producer.
- `domain_context`: Software product pack; Healthcare synthetic architecture fixture only.
- `input_vocabulary`: code review and clinical-workflow review terms.
- `expected_core_semantics`: review event, actor, claim scope, temporal basis, provenance.
- `expected_support_relations`: `review_exists = supports`; `applicable_reviewer_authority` remains separately evaluated and may be `indeterminate`.
- `explicit_non_claims`: medical judgment, healthcare product support, approval, legal compliance, execution authorization.
- `pass_condition`: Core review meaning is identical while domain authority bindings differ.
- `fail_condition`: Healthcare vocabulary changes `review_exists` or automatically proves reviewer authority.
- `architecture_implication_if_failed`: PH-02 Domain Neutrality weakens; keep Healthcare out of product scope and revisit review/authority separation.

### E3-B3 - Operational Versus Epistemic Transition

- `experiment_id`: `E3-B3`
- `hypothesis`: Operational and epistemic transitions share one Core state-transition/evidence model.
- `fixture`: Candidate code -> production state; captured assertion -> organizationally reusable claim.
- `producer`: Guard-native synthetic fixture producer.
- `domain_context`: Software transition and evidence-reliance context.
- `input_vocabulary`: deploy/release state and assertion/reliance state.
- `expected_core_semantics`: from-state, to-state, boundary, authority binding, provenance, verification, effect.
- `expected_support_relations`: Transition occurrence is evaluated consistently; outcome correctness and authority stay separate.
- `explicit_non_claims`: deployed change correct, reusable claim true, organizational approval, causal attribution.
- `pass_condition`: Both use one Core transition evaluator with domain/context bindings only.
- `fail_condition`: A second Core engine or conflicting meaning is required.
- `architecture_implication_if_failed`: `PH-02 Domain-Neutrality hypothesis weakened / failed`; stop claims of a single domain-neutral EAK model.

## 5. E3-C - Claim Stability

### E3-C1 - Identity Vocabulary

- `experiment_id`: `E3-C1`
- `hypothesis`: Different identity terms preserve the same authority non-claim.
- `fixture`: Equivalent `identity_verified`, `authenticated_principal`, and `KYA_passed` inputs.
- `producer`: Three synthetic vocabulary adapters.
- `domain_context`: Core identity/authority boundary.
- `input_vocabulary`: the three named terms.
- `expected_core_semantics`: identity assertion plus verification and provenance bindings.
- `expected_support_relations`: identity property may be supported; `authority_verified = does_not_support`.
- `explicit_non_claims`: authority, delegation, approval, execution permission.
- `pass_condition`: All three preserve CB-05.
- `fail_condition`: Any vocabulary supports authority without separate bindings.
- `architecture_implication_if_failed`: PH-03 and the Evidence Semantic Control Point hypothesis weaken materially.

### E3-C2 - Approval Vocabulary

- `experiment_id`: `E3-C2`
- `hypothesis`: Approval-like words do not bypass subject, scope, authority, and time bindings.
- `fixture`: `approved`, `signed_off`, and `accepted` with complete and incomplete binding variants.
- `producer`: Three synthetic vocabulary adapters.
- `domain_context`: Core review plus Software Change Pack.
- `input_vocabulary`: the three named terms.
- `expected_core_semantics`: review, reviewer/actor, claim scope, temporal basis, disposition.
- `expected_support_relations`: `applicable_review_exists = supports` only when all four bindings match; incomplete cases are `indeterminate` or `does_not_support` under CB-18.
- `explicit_non_claims`: `execution_authorized_by_guard`, legal compliance, certification.
- `pass_condition`: Vocabulary alone never changes the result.
- `fail_condition`: An approval word bypasses a missing binding or authorizes execution.
- `architecture_implication_if_failed`: Claim Stability fails; Crosswalk acceptance must stop.

### E3-C3 - Integrity Vocabulary

- `experiment_id`: `E3-C3`
- `hypothesis`: Hash and signature vocabulary supports integrity/authenticity only.
- `fixture`: `sha256_valid` and `signature_verified` over the same artifact.
- `producer`: Native integrity verifier and synthetic signature adapter.
- `domain_context`: Core evidence/provenance.
- `input_vocabulary`: hash and signature terms.
- `expected_core_semantics`: evidence item, attestation, verification, lineage.
- `expected_support_relations`: `artifact_integrity = supports`; `artifact_truth` and `claim_correctness = does_not_support`.
- `explicit_non_claims`: truth, correctness, safety, authority, approval.
- `pass_condition`: Both preserve CB-09/CB-10.
- `fail_condition`: Valid cryptography supports content truth or authorization.
- `architecture_implication_if_failed`: INV-07 fails; V8 implementation must stop.

### E3-C4 - Framework Conformance Vocabulary

- `experiment_id`: `E3-C4`
- `hypothesis`: Framework mappings remain evidence of mapping/presence, not normative determinations.
- `fixture`: `NIST mapped`, `ISO mapped`, and `AIUC control satisfied` synthetic records.
- `producer`: Three synthetic Crosswalk adapters.
- `domain_context`: Core plus external Crosswalks.
- `input_vocabulary`: named framework terms with pinned source versions.
- `expected_core_semantics`: evidence item, claim scope, support relation, provenance.
- `expected_support_relations`: corresponding framework evidence presence may be `supports`; stronger legal/certification/safety claims are `does_not_support`.
- `explicit_non_claims`: legally compliant, certified, safe, execution authorized.
- `pass_condition`: Every mapping preserves CB-19/CB-20.
- `fail_condition`: Crosswalk presence creates normative authority or a stronger claim.
- `architecture_implication_if_failed`: Reject the Crosswalk and weaken/kill the semantic-control-point claim if stable boundaries cannot be preserved.

## 6. E3-D - Composition Stability

### E3-D1 - Crosswalk And Profile Invariance

- `experiment_id`: `E3-D1`
- `hypothesis`: Adding conforming Crosswalks and Profiles does not change existing claim results.
- `fixture`: One software change evaluated under `Core + Software Pack`, then under `Core + Software Pack + NIST Crosswalk + Audit Profile`.
- `producer`: Guard-native fixture producer.
- `domain_context`: Software Change Pack.
- `input_vocabulary`: Native terms plus NIST mapping and Audit presentation labels.
- `expected_core_semantics`: byte-equivalent Core bindings after presentation fields are removed.
- `expected_support_relations`: byte-equivalent `supports_claim()` results.
- `explicit_non_claims`: certification, compliance, approval, execution authorization.
- `pass_condition`: Only external references, mapping metadata, grouping, and presentation differ.
- `fail_condition`: Any semantic ID, claim boundary, relation, or temporal status changes.
- `architecture_implication_if_failed`: PH-03 Semantic Non-Interference fails; composable architecture cannot proceed.

### E3-D2 - Dynamic OWASP Crosswalk Addition

- `experiment_id`: `E3-D2`
- `hypothesis`: A newly added conforming Crosswalk is non-interfering.
- `fixture`: D1 composition before and after adding a version-pinned OWASP Crosswalk.
- `producer`: Guard-native fixture producer plus synthetic OWASP mapper.
- `domain_context`: Software Change Pack.
- `input_vocabulary`: native, NIST, and OWASP concepts.
- `expected_core_semantics`: unchanged Core IDs and bindings; additive mapping refs only.
- `expected_support_relations`: unchanged relations for all pre-existing claims.
- `explicit_non_claims`: OWASP mapped does not mean secure, compliant, certified, or authorized.
- `pass_condition`: New references/mappings/presentation context are additive and deterministic.
- `fail_condition`: Existing result changes or module order affects output.
- `architecture_implication_if_failed`: Dynamic composition is unsafe; require static/pinned composition or abandon Crosswalk modularity.

### E3-D3 - Collision Injection

- `experiment_id`: `E3-D3`
- `hypothesis`: A module cannot override Core meaning.
- `fixture`: Domain Pack attempts `verified = approved`; companion fixtures attempt identity/authority, signature/truth, framework/compliance, and assessment/authorization collisions.
- `producer`: Malicious or invalid synthetic module producer.
- `domain_context`: Module-loader conformance.
- `input_vocabulary`: prohibited override declarations.
- `expected_core_semantics`: none added; protected Core remains unchanged.
- `expected_support_relations`: no evaluation occurs for the invalid composition.
- `explicit_non_claims`: partial acceptance, silent override, execution authorization.
- `pass_condition`: Entire module is deterministically rejected as `INVALID_MODULE` with collision provenance.
- `fail_condition`: Module loads partially/fully or changes any claim result.
- `architecture_implication_if_failed`: Composable Semantic Architecture fails (K3); stop module implementation.

## 7. Acceptance Matrix Summary

| Experiment | Acceptance target | Status |
| --- | --- | --- |
| E3-A1 | Same change, three producers, same semantics/support | Designed / not run |
| E3-A2 | Policy vocabulary cannot elevate authority | Designed / not run |
| E3-A3 | Capability continuity separated from authority continuity | Designed / not run |
| E3-B1 | Delegation Core survives software/synthetic-finance scopes | Designed / not run |
| E3-B2 | Review Core survives software/synthetic-healthcare contexts | Designed / not run |
| E3-B3 | One Core transition model spans operational/epistemic cases | Designed / not run |
| E3-C1 | Identity vocabulary preserves authority non-claim | Designed / not run |
| E3-C2 | Approval vocabulary cannot bypass bindings | Designed / not run |
| E3-C3 | Integrity cannot inflate into truth | Designed / not run |
| E3-C4 | Framework mapping cannot inflate into compliance/certification | Designed / not run |
| E3-D1 | NIST Crosswalk/Audit Profile do not change support | Designed / not run |
| E3-D2 | Dynamic OWASP Crosswalk is non-interfering | Designed / not run |
| E3-D3 | Semantic collision is rejected | Designed / not run |

## 8. Non-Consensus Hypotheses

| ID | Hypothesis | Validation owner |
| --- | --- | --- |
| PH-01 | A thin MESR Core can survive multiple domains without ontology explosion. | E3-B and Core primitive-count review |
| PH-02 | The same supportability model can evaluate multiple domains without domain-specific Core engines. | E3-A/E3-B |
| PH-03 | Adding Domain Packs, Crosswalks, or Institutional Profiles does not change Core meaning. | E3-D |
| PH-04 | Independent evidence semantics and assurance remain valuable even when runtime/IAM/security/GRC controls become stronger. | Primarily Experiment 2/design partners; not provable by this suite alone |
| PH-05 | Economic value scales with recurring assurance-relevant consequential transitions rather than seats. | Commercial hypothesis only; Experiment 2/repeat reviews, no pricing implementation here |

## 9. Kill / Pivot Criteria

| ID | Trigger | Required response |
| --- | --- | --- |
| K1 | Each new domain requires redefinition of Core semantics. | Thin MESR Core hypothesis fails; shrink/restructure Core or stop cross-domain claim. |
| K2 | External vocabulary changes claim boundaries. | Evidence Semantic Control Point hypothesis weakens materially; reject mappings and revisit the boundary model. |
| K3 | A module must override Core to work. | Composable Semantic Architecture fails; stop modular implementation. |
| K4 | Institutional reviewers do not accept independent claim boundaries. | Independent assurance commercial hypothesis weakens; use Experiment 2 evidence before further productization. |
| K5 | No recurring assurance-relevant consequential events are found. | Usage/event-based commercialization remains unvalidated; do not implement pricing around it. |

## 10. Gate 2 Exit Rule

Gate 2 cannot be marked complete until executable evidence demonstrates at least two producers (target three), at least two domain contexts, at least one external vocabulary, Claim Stability, Composition Stability, Collision Injection, and deterministic replay. This design document does not satisfy those execution requirements.
