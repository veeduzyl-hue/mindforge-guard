# V8.0 Gate 2 Formal Closure Audit v0.1

## Status

Gate 2 decision: GATE 2 ONE MINIMAL HARD GAP REMAINS.

The one remaining hard gap is grounded external-vocabulary executable evidence. Six other hard requirements have executable PASS evidence. A third producer is a stretch target, not a Gate 2 blocker. E3-A3 capability/authority mutation remains mandatory before V8.0 RC, but it is not named in the frozen Gate 2 exit rule.

Gate 2 remains NOT YET. This audit does not close it and does not implement the remaining experiment.

## Audit scope and source precedence

This is a repository-grounded architecture evidence audit. It adds no MESR primitive, Claim Boundary, EAK behavior, producer adapter, Crosswalk, Domain Pack, public export, CLI behavior, runtime behavior, or product-domain claim.

The controlling sources are:

1. docs/strategy/v8-semantic-foundation-plan-v0.1.md, section 15, which freezes Gate 2 as requiring at least two producers (target three), at least two domain contexts, at least one external vocabulary, Claim Stability PASS, Composition Stability PASS, Collision Injection PASS, and deterministic replay PASS.
2. docs/validation/experiment-3-semantic-portability-and-composition-v0.1.md, section 10, which repeats the same exit rule.
3. The Experiment 3 case definitions and Phase 2 backlog, which assign experiments to those requirements but do not silently add hard Gate 2 conditions.
4. Phase 2A through Phase 2C validation notes, which provide later evidence but do not redefine the frozen gate.

Later recommendations, experiment-completeness goals, and RC requirements are classified separately. They are not promoted to Gate 2 hard requirements.

## Gate 2 acceptance matrix

| requirement_id | requirement | requirement_type | original_source | current_evidence | evidence_class | status | remaining_gap | closure_experiment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G2-H01 | At least two producer representations preserve the same bounded Core semantics and claim-support consequences | HARD | Semantic Foundation Plan section 15; Experiment 3 section 10 and E3-A1 | GitHub Actions and Guard-native Harness; Phase 2B E3-A1; verify:mesr:runtime-portability | REAL PRODUCER SCHEMA EVIDENCE plus CONTROLLED TEST EVIDENCE | PASS | None for the hard threshold | None |
| G2-H02 | At least two domain contexts reuse the same Core interpretation without Core redefinition | HARD | Semantic Foundation Plan section 15; Experiment 3 section 10 and E3-B | Software plus synthetic Finance, Healthcare, and Epistemic contexts; Phase 2C; verify:mesr:cross-domain | CONTROLLED SYNTHETIC DOMAIN EVIDENCE | PASS | None for architecture portability; production-domain support remains out of scope | None |
| G2-H03 | At least one grounded external vocabulary is mapped and evaluated without importing authority or changing claim boundaries | HARD | Semantic Foundation Plan section 15; Experiment 3 sections 2, 3 E3-A2, and 10; Module Manifest sections 2 and 4 | Test-only framework vocabulary and synthetic Crosswalks only | CONTROLLED TEST EVIDENCE | NOT SATISFIED | No repository-grounded external source version, terminology definition, provenance, and limitations are bound into an executable Crosswalk | E3-A2 Grounded External Vocabulary Crosswalk, after external source revalidation |
| G2-H04 | Claim Stability passes across vocabulary changes | HARD | Semantic Foundation Plan section 15; Experiment 3 sections 5 and 10 | E3-C1 through E3-C4; verify:mesr:claim-stability | INTERNAL EXECUTABLE EVIDENCE plus CONTROLLED TEST EVIDENCE | PASS | Grounding quality remains separate under G2-H03 | None |
| G2-H05 | Composition Stability and Semantic Non-Interference pass | HARD | Semantic Foundation Plan section 15; Experiment 3 E3-D1/E3-D2 and section 10; ADR 0006 | E3-D1 and E3-D2; verify:mesr:composition; Phase 2C Core before/after hash equality | INTERNAL EXECUTABLE EVIDENCE plus CONTROLLED TEST EVIDENCE | PASS | None | None |
| G2-H06 | Collision Injection is rejected deterministically and without partial loading | HARD | Semantic Foundation Plan section 15; Experiment 3 E3-D3 and section 10; ADR 0006 | E3-D3; verify:mesr:composition | INTERNAL EXECUTABLE EVIDENCE plus CONTROLLED TEST EVIDENCE | PASS | None | None |
| G2-H07 | Fixed inputs replay deterministically under pinned semantic/evaluator inputs | HARD | Semantic Foundation Plan section 15; Experiment 3 sections 2 and 10 | Registry ordering, Canonical Semantic Snapshot, producer normalization, Core Pattern Signature, and composition replay verifiers | INTERNAL EXECUTABLE EVIDENCE | PASS | None | None |
| G2-S01 | Third producer representation | STRETCH | Semantic Foundation Plan section 15 says “target three”; Experiment 3 E3-A1 names MCP/OpenTelemetry-derived adapter | No executable third producer | HYPOTHESIS | NOT RUN | Original three-producer experiment target remains incomplete, but the Gate 2 hard minimum is already met | Future bounded third-producer experiment |
| G2-P01 | Capability change remains separate from authority continuity | PRE_RC | INV-04; Experiment 3 E3-A3; Semantic Foundation Plan section 17 Phase 2 backlog and Gate 4 Experiment 3 requirement | Architecture fixture is designed; executable E3-A3 is not present | HYPOTHESIS | NOT RUN | Runtime read to read/write mutation still needs a deterministic negative authority case before RC | E3-A3 Self-Modifiable Runtime |

## Gate 2 evidence ledger

| Requirement | Type | Evidence | Evidence class | Status |
| --- | --- | --- | --- | --- |
| Two producer families and producer-neutral semantic result | HARD | Phase 2B E3-A1; canonical snapshots equal across GitHub-shaped and Harness-shaped controlled inputs; repository-grounded schemas replay independently | REAL PRODUCER SCHEMA EVIDENCE / CONTROLLED TEST EVIDENCE | PASS |
| Two or more architecture domain contexts | HARD | Phase 2C E3-B1/B2/B3; Core count 30 to 30; Core registry hash unchanged | CONTROLLED SYNTHETIC DOMAIN EVIDENCE | PASS |
| Grounded external vocabulary | HARD | Phase 2A test-only framework Crosswalks have source_version test-only-v0.1, fixture provenance, and test-only URI references | CONTROLLED TEST EVIDENCE only | NOT SATISFIED |
| Claim Stability | HARD | E3-C1/C2/C3/C4 and Claim Boundary preservation | INTERNAL EXECUTABLE EVIDENCE / CONTROLLED TEST EVIDENCE | PASS |
| Composition Stability | HARD | E3-D1/D2 canonical equality and module-order invariance | INTERNAL EXECUTABLE EVIDENCE / CONTROLLED TEST EVIDENCE | PASS |
| Collision Injection | HARD | E3-D3 rejects protected semantic overrides as INVALID_MODULE | INTERNAL EXECUTABLE EVIDENCE / CONTROLLED TEST EVIDENCE | PASS |
| Deterministic replay | HARD | Registry, snapshot, producer normalization, composition, and Core Pattern Signature repeat byte-equivalently | INTERNAL EXECUTABLE EVIDENCE | PASS |
| Third producer | STRETCH | Design names MCP/OpenTelemetry-derived adapter; no executable evidence | HYPOTHESIS | NOT RUN |
| Capability/authority mutation | PRE_RC | INV-04 and E3-A3 design only | HYPOTHESIS | NOT RUN |

## Producer requirement audit

The frozen Gate 2 text says “at least two producers (target three).” Therefore:

- two producers are the HARD threshold;
- the third producer is a STRETCH target;
- Phase 2B's scoped two-producer E3-A1 result satisfies the Gate 2 producer threshold;
- the original E3-A1 three-representation case remains incomplete as experiment strengthening, but it is not a Gate 2 blocker.

The producer evidence has two qualities that must remain distinct:

- repository-grounded GitHub Actions and Harness samples prove that both schemas can be normalized;
- controlled equivalent fixtures prove semantic snapshot equality for the same bounded synthetic software-change facts.

No claim is made that the two repository-grounded samples describe the same event or that the producers are equivalent systems.

## Domain requirement audit

The frozen Gate 2 text requires at least two domain contexts. It does not require production domain support.

Phase 2C provides executable architecture evidence across Software and controlled synthetic Finance, Healthcare, and Epistemic contexts. The Canonical Core Pattern Signatures match inside each cross-domain pair, Core remains 30 primitives, and Core registry bytes remain unchanged.

This satisfies the HARD architecture-domain requirement. It does not establish Finance, Healthcare, trading, clinical, knowledge-management, or other production domain support.

## Claim Stability audit

E3-C1 through E3-C4 are executable and pass:

- identity vocabulary cannot elevate verified identity into authority;
- approval-like vocabulary cannot bypass subject, scope, authority, and time bindings;
- integrity vocabulary cannot inflate into truth or correctness;
- test-only framework vocabulary cannot inflate mapping presence into compliance or certification.

Claim Stability is therefore PASS as a mechanism. The fact that C4 is test-only does not invalidate the mechanism test, but it also does not satisfy the separately frozen grounded external-vocabulary requirement.

## Composition Stability and collision audit

E3-D1 and E3-D2 demonstrate byte-equivalent Core claim results after conforming synthetic Crosswalk/Profile composition and after dynamic synthetic Crosswalk addition. Module order is canonical.

E3-D3 rejects collision attempts before evaluation, identifies the invalid module boundary, and does not partially load definitions. This satisfies both Composition Stability and Collision Injection.

Phase 2C additionally demonstrates that loading three synthetic Domain modules leaves the canonical Core registry hash unchanged:

- before: c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935
- after: c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935

## Deterministic replay audit

Deterministic replay is satisfied by concrete verifier behavior, not merely by general test success:

- verify:mesr:registry validates the fixed 30-entry registry, 24 boundaries, and temporal contract;
- verify:mesr:runtime-portability normalizes each controlled and repository-grounded producer input twice and requires byte-identical canonical snapshots;
- verify:mesr:claim-stability evaluates vocabulary variants through one deterministic evaluator;
- verify:mesr:composition requires canonical snapshot equality and module-order invariance;
- verify:mesr:cross-domain repeats and reverses input ordering while requiring identical Canonical Core Pattern Signatures.

## External vocabulary audit

The Gate 2 external-vocabulary requirement is not satisfied.

Phase 2A intentionally uses local placeholders:

- source_version is test-only-v0.1;
- provenance points to fixture module IDs;
- references use test-only URI schemes;
- framework concepts are named test_framework, test_nist_like, and test_owasp_like.

This is valid CONTROLLED TEST EVIDENCE for Claim Stability and composition mechanics. It is not REPOSITORY-GROUNDED EXTERNAL SEMANTIC EVIDENCE.

Repository inventory:

| Candidate | Repository grounding | Boundary relevance | Decision |
| --- | --- | --- | --- |
| APAAI / policy_evaluated | E3-A2 design and one strategic WATCH recommendation; no pinned external source, version, authoritative terminology, or source-derived mapping provenance | Directly tests policy evaluation versus authority, approval, execution, and compliance | Preferred minimum candidate, but EXTERNAL SOURCE REVALIDATION REQUIRED |
| NIST / ISO / OWASP | Architecture examples and deliberately synthetic test-like Crosswalks only | Useful for mapping versus certification/compliance boundaries | Insufficient grounding |
| MCP / OpenTelemetry | Named only as a possible third producer shape | Producer portability, not currently grounded semantic Crosswalk vocabulary | Not the minimum vocabulary candidate |
| Singapore Consensus / Agentree / GAUI | No repository evidence found | Unknown without external source work | Not eligible for repository-grounded implementation |

APAAI is preferred only because the frozen E3-A2 case already defines the narrow authority-boundary question. The repository does not currently contain enough APAAI source material to assert that Action, Policy, Evidence, or policy_evaluated are normative APAAI semantics. Those terms must not be invented.

## E3-A2 classification

Classification: HARD closure vehicle for G2-H03.

The hard requirement is “at least one grounded external vocabulary,” not the E3-A2 label by itself. E3-A2 is the frozen case specifically designed to test external policy-evaluation vocabulary against native evidence without authority elevation. Completing a grounded, source-pinned variant of this case is the minimum way to satisfy G2-H03.

The currently designed “synthetic APAAI-style producer” is not enough by itself. External source revalidation must precede fixture implementation.

## E3-A3 classification

Classification: PRE_RC.

E3-A3 is not listed in the frozen Gate 2 exit rule, so it is not a Gate 2 hard blocker. It remains mandatory before V8.0 RC because:

- INV-04 is a normative V8 invariant;
- the Phase 2 backlog explicitly selected A3 as a first executable fixture;
- E3-A3 says failure requires stopping V8 implementation;
- Gate 4 requires Experiment 3 PASS.

Its required negative case remains: adding write capability to a read-only runtime must not support write authority or authority continuity.

## Third producer classification

Classification: STRETCH.

“At least two producers (target three)” is explicit. GitHub Actions plus Guard-native Harness satisfy the hard count. An MCP/OpenTelemetry-derived producer may strengthen ecosystem portability and complete the original three-representation target, but it must not block Gate 2 or trigger adapter work merely to improve a count.

## Gate 2 decision

GATE 2 ONE MINIMAL HARD GAP REMAINS.

Six of seven frozen HARD requirements have sufficient executable evidence. G2-H03 grounded external vocabulary is the only hard requirement that remains unsatisfied.

Gate 2 remains NOT YET.

## Exact remaining hard gap

One version-pinned, provenance-bearing, repository-grounded external vocabulary must be mapped through a test-only Crosswalk and evaluated with the existing MESR Core and claim-support engine.

The evidence must demonstrate that external vocabulary:

- does not change Core semantic meaning;
- does not change Claim Boundaries;
- does not acquire normative, approval, certification, compliance, or execution authority;
- replays deterministically;
- retains source version, provenance, and limitations.

## Minimum closure experiment recommendation

Recommended next experiment: E3-A2 Grounded External Vocabulary Crosswalk.

Prerequisite: EXTERNAL SOURCE REVALIDATION REQUIRED.

Preferred source candidate: APAAI, only if a repository-citable authoritative source confirms the exact versioned vocabulary and meanings used by the fixture.

Minimum experiment boundary:

1. Record the authoritative source, version/date, exact external terms, and limitations in repository evidence.
2. Create a local test-only Crosswalk; do not implement the APAAI protocol or a producer runtime.
3. Compare grounded external vocabulary with equivalent Guard-native evidence using the existing Core and evaluator.
4. Prove these non-inferences:
   - Action does not imply Authority.
   - Policy Evaluated does not imply Authority Verified.
   - Policy Evaluated does not imply Guard Approval or Execution Authorized.
   - Evidence Produced does not imply Independent Verification.
   - Protocol Conformance does not imply Compliance.
5. Require deterministic replay, Core mutation equality, Claim Boundary stability, and public-surface isolation.

If the external source does not support the proposed terms or meanings, stop. Do not invent APAAI semantics and do not substitute an ungrounded fixture merely to close Gate 2.

## Stretch and Pre-RC remaining work

STRETCH:

- a third producer, such as a bounded MCP/OpenTelemetry-derived adapter experiment;
- broader producer/runtime portability beyond the hard two-producer threshold.

PRE_RC:

- E3-A3 capability-versus-authority mutation;
- full Gate 4 review of Experiment 3 completeness, semantic provenance, module non-interference, v7.0.1 regressions, local-first determinism, hidden-LLM absence, and authority non-expansion.

These items must not be counted as the current Gate 2 hard gap.

## Current V8 status

- Gate 1 = PASS
- Phase 2A = PASS
- Phase 2A.1 = PASS
- Phase 2B / E3-A1 = PASS
- Phase 2C / E3-B = PASS
- Gate 2 = NOT YET
- Gate 3 = NOT RUN
- Gate 4 = NOT RUN

## Preserved compatibility and authority boundary

- audit output, verdict, and exit semantics unchanged;
- deny exit code 25 unchanged;
- permit and classify behavior unchanged;
- recommendation-only, additive-only, non-executing, and default-off;
- no authority scope expansion;
- no public CLI, JSON, Node runtime, license, install, demo, or product-domain surface change;
- no control-plane, dashboard-first, platform, or multi-agent orchestration drift.

## Audit conclusion

The Gate has neither been inflated nor relaxed. The third producer target and E3-A3 remain visible without becoming Gate 2 blockers. Synthetic Crosswalk mechanics remain valid evidence without being promoted to grounded external semantics.

Gate 2 can close only after the one remaining hard external-vocabulary condition receives source-pinned executable evidence and a separate closure decision.
