# V8.0 Semantic Foundation Plan v0.1

Status: Phase 1 Gate 1 architecture baseline. Architecture artifacts and repository validation complete; Gate 2 execution remains not run.

## 1. Objective

V8.0 advances the existing Guard evidence chain without redesigning Guard Core:

```text
Current:
Evidence Pack -> Validation -> Reason Codes -> Governance Report

Target:
Evidence Pack -> Evidence Contract -> MESR semantic binding
-> EAK claim support evaluation -> governance / institutional disposition
-> institutional artifact
```

Phase 1 freezes architecture, semantics, acceptance criteria, and the Experiment 3 design before implementation. It does not implement a production MESR registry, module loader, temporal engine, or EAK binding layer.

## 2. Strategic Hypothesis

[HYPOTHESIS] MindForge Guard can evolve as independent Evidence Assurance Infrastructure for consequential AI actions and transitions.

[HYPOTHESIS] Its long-term direction may be an **Evidence Semantic Control Point**: a stable place where evidence meaning and claim boundaries are preserved across producers, domains, and institutional expressions.

These are not claims of market validation, ecosystem adoption, standard status, category leadership, certification authority, universal semantic authority, execution authority, or proven commercial demand.

The fixed architecture formula is:

```text
Evidence Contract transports facts.
MESR stabilizes meaning.
EAK limits claims.
Domain Packs extend context.
Crosswalks translate external vocabularies.
Institutional Profiles change expression, not meaning.
```

## 3. Current Validated Baseline

[INTERNAL EVIDENCE] The selected V8 branch baseline is commit `04c0d4c3376712b53101c7f96bd25b31f2eace94`, the tip of the linear Evidence Assurance checkpoint chain based on `origin/main` commit `e861fb725ce9436e5e22735f0a88db7682b84b09`.

[INTERNAL EVIDENCE] The chain contains the accepted bounded EAK PoC and deterministic fixtures. It demonstrates a local, bounded implementation of supportability, missing evidence, contradiction, residual uncertainty, provenance, and deterministic result hashing. It does not demonstrate cross-domain MESR portability or production module composition.

[EXTERNAL EVIDENCE] Experiment 1.1 records one specific fresh GitHub Actions artifact/run/commit continuity case. It establishes `FRESH_CI_ARTIFACT_AVAILABLE = YES`; it does not establish same-commit deployment continuity or an independent second producer.

[INTERNAL EVIDENCE] Experiment 2A has an operational package and reports `EXPERIMENT_2A_OPERATIONAL_READY = YES`. Experiment 2B remains `WAITING_FOR_DESIGN_PARTNER`; no design partner, commercial validation, or institutional invariance is claimed.

[CONVERGING SIGNAL] Existing Evidence Contract, reason-code, external evidence, normalized record, report, and EAK assets consistently separate producer facts, verification, governance output, and external decision ownership. This supports the V8 direction but does not prove the strategic hypotheses.

## 4. Architecture Invariants

The ten normative and testable invariants are frozen in [V8.0 Semantic Foundation Architecture Invariants](../architecture/v8-semantic-foundation-invariants-v0.1.md):

1. Evidence does not create authority.
2. Verification does not create execution permission.
3. Verified identity and verified authority are distinct claims.
4. Capability continuity does not imply authority continuity.
5. Claim support is bound by subject, scope, time, and provenance.
6. Producer self-report is not independent verification.
7. Integrity proves preservation, not truth.
8. Domain modules cannot redefine Core meaning.
9. Institutional Profiles cannot alter semantic IDs or claim boundaries.
10. Guard never converts assurance into execution authority.

All phases preserve `audit` output/verdict/exit, deny exit code `25`, existing `permit` and `classify` behavior, recommendation-only, additive-only, non-executing, default-off where applicable, and no authority expansion.

## 5. Target Architecture

| Layer | Owns | Does not own |
| --- | --- | --- |
| Evidence Pack / Evidence Contract | Canonical factual input syntax and producer handoff | semantic truth, verification, disposition |
| MESR | Stable semantic IDs, definitions, bindings, relations, explicit non-claims, versioning | facts, policy decision, authority, execution |
| EAK | Deterministic claim-support evaluation over bound evidence | Governance Report verdict, approval, execution permission |
| Governance / institutional disposition | Existing downstream `allow`, `require_review`, `inconclusive`, `block` expression | MESR Core truth, runtime authority |
| Institutional artifact | Presentation, grouping, export, review communication | semantic override, verdict recomputation, execution |

Guard verifies consequential transitions. Guard does not execute, approve, authorize, certify, or own them.

## 6. MESR Scope

[ARCHITECTURE DECISION] MESR Core v0.1 contains exactly 30 primitives across Actor, Authority, Intent/Action, Boundary, Effect/Outcome, Evidence, Claim, Provenance, Temporal, and Review/Uncertainty concerns.

The entry contract includes semantic ID, namespace, version, definition, status, supported claims, explicit non-claims, strength/conflict relations, required bindings, provenance, supersession, and deprecation.

Bindings such as credential, target, valid-from/until, revocation, claim subject, transformation, observed/verified time, freshness, `basis_valid_at`, decision ref, and residual uncertainty remain fields/relations rather than ontology expansion.

MESR is not a universal ontology, knowledge graph, policy/compliance engine, authority issuer, certification registry, or truth engine.

## 7. EAK Boundary

EAK answers “What does the evidence support?” for a versioned, bound claim. It consumes Evidence Contract facts after MESR binding and returns deterministic support relations, explicit non-claims, missing evidence, contradictions, and residual uncertainty.

It does not answer “Should this execute?”, “Is this legally compliant?”, or “Has Guard approved it?”. It cannot become a Policy Decision Point.

The existing EAK PoC remains unchanged in Phase 1. Phase 2 must explicitly bind its current statuses to MESR relations; ambiguous `unsupported` cases default to `indeterminate` unless a registered claim boundary permits `does_not_support`.

## 8. Claim Support Model

The controlled relation set is:

- `supports`;
- `partially_supports`;
- `contradicts`;
- `does_not_support`;
- `indeterminate`.

Every evaluation is bound to subject, scope, time, provenance, evaluator version, and evidence refs. A support relation is not a Governance Report verdict and never creates execution authority.

The initial 24 explicit non-claim boundaries are frozen in the [Claim Boundary Registry](../specs/mesr-claim-boundary-registry-v0.1.md).

## 9. Temporal Semantics

`basis_valid_at` separates evidence production/verification time from the time at which an institution relies on it. Controlled basis states are `current`, `stale`, `revoked`, `superseded`, and `unresolvable`.

Dead-basis scenarios cover credential revocation, approval expiry, policy/runtime/capability/deployment change, source supersession, review/execution subject mismatch, and commit-time versus review-time authority. Phase 1 defines deterministic contract and scenarios only.

## 10. Module Architecture

The composition model is Stable Core + additive Domain Packs + External Crosswalks + Institutional Profiles.

- Core alone defines Core meaning.
- Domain Packs add context and stricter domain bindings in their namespace.
- Crosswalks map external concepts to MESR IDs without importing normative authority.
- Profiles change expression, grouping, and emphasis only.

Semantic Non-Interference requires existing Core claim results to remain unchanged as conforming Crosswalks and Profiles are added. Collision attempts such as `verified = approved` make the entire module invalid.

## 11. Software Change Pack

Software Change Domain Pack v0.1 is the only product Domain Pack in scope. It binds base revision, proposed change, review subject, verification artifact, accepted revision, release identity, deployment effect, rollback reference, code-owner authority, and review/execution subject equality.

Finance and Healthcare appear only as synthetic architecture fixtures. They are not product support or domain judgment claims.

## 12. Experiment 3

Experiment 3 is the V8 architecture acceptance suite, not an ordinary spike. It is fully designed in [Semantic Portability And Composition Validation](../validation/experiment-3-semantic-portability-and-composition-v0.1.md):

- E3-A tests runtime/producer portability.
- E3-B tests domain interpretation without Core redefinition.
- E3-C tests vocabulary-independent claim boundaries.
- E3-D tests composition stability and collision rejection.

All 13 cases define hypothesis, fixture, producer, domain context, vocabulary, expected Core semantics, support relations, explicit non-claims, pass, fail, and architecture implication. All remain `DESIGNED / NOT RUN` in Phase 1.

## 13. Experiment 2 Interaction

```text
Experiment 2 = institutional / workflow validation
Experiment 3 = semantic architecture validation
```

Experiment 2 asks whether reviewers accept bounded claims, where statements overreach, which evidence is missing/stale, whether scope is clear, when producer self-report is insufficient, and whether independent verification is needed. It also measures workflow and commercial hypotheses.

Experiment 3 asks whether semantics are portable, claim boundaries stable, and modules non-interfering. It does not use Experiment 2's buyer/workflow measurement model. The existing Experiment 2 operational package is unchanged.

## 14. Explicit Non-Goals

V8.0 Phase 1 does not implement:

- runtime enforcement or a policy decision point;
- kill switch, agent orchestration, IAM, or AI firewall;
- full GRC or incident-management platform;
- generic compliance platform or legal compliance determination;
- large Studio redesign, marketplace, or connector explosion;
- LLM-heavy semantic reasoning or hidden chain-of-thought governance;
- certification authority;
- universal AI governance ontology or universal protocol;
- production cloud assurance service;
- full Finance or Healthcare pack;
- knowledge-graph truth engine;
- pricing changes.

These items are rejected, deferred, mapped to adjacent systems, or watched. They are not current requirements.

## 15. Release Gates

### Gate 1 - Semantic Architecture Ready

Exit requires five ADRs, ten testable invariants, MESR Core v0.1, Semantic ID/versioning, claim/non-claim and support-relation models, Temporal Basis, Module Manifest, Software Pack, reason-code migration design, and the Experiment 3 matrix.

Phase 1 supplies these artifacts. Gate 1 is complete at this architecture checkpoint: repository validation is green and the artifacts are prepared as one local commit. This does not advance Gate 2, Gate 3, or Gate 4.

### Gate 2 - Semantic Portability Proven

Future evidence requires at least two producers (target three), at least two domain contexts, at least one external vocabulary, Claim Stability PASS, Composition Stability PASS, Collision Injection PASS, and deterministic replay PASS. Phase 1 does not claim any PASS.

### Gate 3 - Institutional Artifact Proven

Future Experiment 2/design-partner evidence must show reviewers can use and accept bounded claims, non-claims, missing/stale evidence, producer/verifier separation, and residual uncertainty without treating Guard as authority. Phase 1 defines criteria only.

### Gate 4 - V8.0 RC

Future RC requires v7.0.1 regressions PASS, Experiment 3 PASS, semantic provenance PASS, module non-interference PASS, no authority expansion, no hidden LLM dependency, and preserved local-first deterministic behavior.

## 16. Kill / Pivot Criteria

- K1: Core redefinition for each new domain kills the Thin Core hypothesis.
- K2: Vocabulary-driven claim-boundary drift materially weakens the Semantic Control Point hypothesis.
- K3: Required Core override kills Composable Semantic Architecture.
- K4: Reviewer rejection of independent claim boundaries weakens the commercial assurance hypothesis.
- K5: No recurring assurance-relevant consequential event leaves event-based commercialization unvalidated.

Failure is an allowed result. Architecture language must be narrowed when evidence triggers a criterion.

## 17. Implementation Backlog

### Phase 2 - First Deterministic Binding

1. Encode the 30 Core entries and 24 claim boundaries as versioned machine-readable data.
2. Add all 56 Reason Code -> MESR bindings without renaming or changing reason-code behavior.
3. Add deterministic EAK binding from current PoC statuses to MESR relations.
4. Implement manifest validation and Semantic Non-Interference collision rejection.
5. Add first executable E3 fixtures: A1 producer normalization, A3 capability/authority separation, C1/C3 claim stability, D1/D3 composition.
6. Keep the binding internal, additive, and default-off; do not change Governance Report or CLI contracts.

### Phase 3 - Hardening And Gate 2 Evidence

1. Complete remaining E3 executable fixtures and deterministic replay.
2. Harden namespace/version/deprecation/supersession handling.
3. Add Temporal Basis contract evaluation for the defined acceptance scenarios.
4. Run compatibility verification against v7.0.1 and the accepted EAK/Experiment lineage.
5. Freeze Gate 2 evidence only if every mandatory case passes; otherwise apply kill/pivot criteria.

### PR / Merge / Release Path

Phase 1 is one docs-only local commit on `feat/v8-semantic-foundation-baseline-v0.1`. No push, PR, merge, tag, or release occurs in this task. A future PR should remain architecture-only, explicitly state unchanged runtime/commercial surfaces, and base review on the selected accepted checkpoint until that lineage is merged to main.

## 18. Gate 1 Acceptance Questions

| Question | Phase 1 answer |
| --- | --- |
| Evidence Contract vs MESR boundary clear? | Yes - facts/syntax versus stable meaning. |
| MESR vs EAK boundary clear? | Yes - registry meaning versus claim evaluation. |
| EAK support vs Governance disposition separated? | Yes - five support relations versus four unchanged report values. |
| Core/Domain/Crosswalk/Profile override contract clear? | Yes - Semantic Non-Interference and fail-closed collision rules. |
| Can Experiment 3 falsify portability/stability/composition? | Yes - 13 cases include explicit failure and implications. |
| Are kill/pivot criteria defined? | Yes - K1 through K5. |

## 19. Recommended Next Step

If Gate 1 is accepted, the only recommended next step is:

```text
V8.0 Phase 2
Reason Code -> MESR binding
+ EAK deterministic semantic binding
+ first Experiment 3 executable fixtures
```

Do not proceed directly to full V8.0 implementation.
## 20. Phase 1 Acceptance Record

The following validation completed on the Phase 1 staged change:

- `git diff --cached --check` passed;
- 30 Core primitive IDs, 24 claim boundaries, 10 invariants, and 13 Experiment 3 cases were structurally counted;
- all 13 Experiment 3 cases contain every required acceptance field;
- all 56 existing reason codes are mapped exactly once with no duplicates;
- all Core and Software semantic IDs used by the migration table resolve;
- all relative links in the 14 Phase 1 documents resolve;
- EAK PoC, Experiment 1, and Experiment 1.1 verifiers passed;
- `verify:v7.0.1`, `verify:core`, and the aggregate `verify` passed;
- CLI version/help/status smoke passed with version `7.0.1`;
- no unstaged change or non-document path is present.

Gate decision: `V8.0_GATE_1 = PASS`. This is architecture readiness only. Experiment 3 remains `DESIGNED / NOT RUN` and Gate 2 remains open.
