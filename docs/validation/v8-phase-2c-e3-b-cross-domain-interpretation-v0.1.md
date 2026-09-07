# V8 Phase 2C — E3-B Cross-Domain Interpretation Validation Note v0.1

## Status

```text
E3-B1 Software / Synthetic Finance Delegation = PASS
E3-B2 Software / Synthetic Healthcare Review = PASS
E3-B3 Operational / Synthetic Epistemic Transition = PASS
Phase 2C / E3-B Cross-Domain Interpretation = PASS
MESR Core primitive count = 30 before / 30 after
Core expansion required = NO
Gate 2 = NOT YET
```

This note records internal, controlled architecture evidence. Finance, Healthcare, and Epistemic contexts are synthetic test contexts only. They are not product Domain Packs and do not establish product support for finance, trading, healthcare, clinical governance, knowledge management, or a truth engine.

## Phase 2B hypothesis correction

Before evaluating E3-B, the Phase 2B interpretation is corrected to:

```text
PH-02 EAK Domain Neutrality = UNCHANGED / NOT DIRECTLY TESTED by E3-A1
```

E3-A1 tested one software-change domain across different producers. It strengthened producer portability evidence, not cross-domain neutrality evidence.

## Architecture under test

The test retains the frozen composition model:

```text
MESR Core (30 primitives)
+ Software Change product Domain Pack
+ synthetic Finance test module
+ synthetic Healthcare test module
+ synthetic Epistemic test module
→ one evaluateMesrClaimSupport() engine
```

Synthetic modules may add domain binding context in their own `mesr.domain.synthetic_*` namespaces. They cannot allocate `mesr.core.*`, redefine a Core entry, modify a Claim Boundary, weaken required bindings/non-claims, or create execution authority.

## Canonical Core Pattern Signature

E3-A1 and E3-B compare different things:

```text
E3-A1: same event semantics across producers
       → Canonical Semantic Snapshot equality

E3-B:  materially different domain events
       → Canonical Core Pattern Signature equivalence
```

The Canonical Core Pattern Signature includes:

- Core semantic IDs;
- semantic families;
- support-relation roles and relation values;
- Claim Boundary IDs;
- satisfied/missing required-binding categories;
- transition/boundary pattern roles;
- provenance roles;
- independence/separation roles.

It excludes repository paths, account IDs, instrument/amount values, healthcare identifiers, assertion text, domain labels, raw event values, and presentation metadata. Ordering and serialization are deterministic and machine-readable.

Accepted signature hashes:

| Experiment | Pattern signature SHA-256 |
| --- | --- |
| E3-B1 | `61c62069c5ab2ba0455b075bd1ef87ac943d9f511832e842bd2353df41f83cd2` |
| E3-B2 | `e824112fc6962bf7b114004153a023c69d177e73fdb9ef8689749f9be69a90aa` |
| E3-B3 | `44ddcfb0274df0fc7ef4840ffea2967278ecb05a50fa33ad97d9dc8c90bcd608` |

## E3-B1 — Software versus synthetic Finance

The software case uses repository/path scope. The synthetic Finance case uses account/instrument/amount-limit scope. Both bind the same Core structure:

- principal and actor;
- authority source, scope, delegation, and boundary;
- action and target;
- valid time and provenance;
- evidence, claim, and support relation.

Positive result:

```text
delegation_occurrence = supports
bounded_delegation_scope = supports
software Core pattern == synthetic Finance Core pattern
```

Negative results:

- repository write access and transaction API access both produce `authority_verified = does_not_support` through `CB-03`;
- domain authority, applicable authority, and execution authorization remain non-supporting;
- broader child scopes produce `authority_amplified = does_not_support` through `CB-17`;
- domain scope comparison remains a Domain binding responsibility and does not create a Finance Core primitive.

Outcome: `PASS`.

## E3-B2 — Software versus synthetic Healthcare

The software case binds a code-review artifact to a candidate commit. The synthetic Healthcare case binds a review artifact to a synthetic AI recommendation subject. Both use the same Core review, actor, evidence, claim-scope, temporal, and provenance semantics.

Positive result:

```text
review_exists = supports
software Core pattern == synthetic Healthcare Core pattern
```

Negative results:

- applicable reviewer authority stays separately evaluated and `indeterminate` without authority bindings;
- reviewer/human-field presence produces `meaningful_oversight = does_not_support` through `CB-24`;
- applicable review and authorized decision remain non-supporting without subject, scope, authority, time, rationale, and actionability bindings;
- no medical correctness, diagnosis, treatment, clinical authority, or healthcare product support is inferred.

Outcome: `PASS`.

## E3-B3 — Operational versus synthetic Epistemic

The operational case models candidate code to release state. The synthetic Epistemic case models a captured assertion to an organizationally reusable claim record. State values differ, but both use one Core pattern:

- actor, action, and authority binding;
- state transition, effect, effect boundary, and reliance boundary;
- evidence, verification, claim, and support relation;
- producer/verifier/lineage provenance and temporal basis.

Positive result:

```text
transition_occurrence = supports
bounded_effect_occurrence = supports
operational Core pattern == synthetic Epistemic Core pattern
```

Negative results:

- an assertion or operational record does not establish warranted reliance or verified truth;
- reliance without separately resolved context, authority, and verification remains `indeterminate`;
- artifact and knowledge-bundle hashes support integrity only;
- `artifact_truth = does_not_support` through `CB-09`;
- producer claims do not establish independent verification through `CB-22`;
- institutional approval, correctness, causality, and execution authority remain separate.

Outcome: `PASS`.

## Core expansion pressure

| Requested semantic concept | Existing Core candidate | Domain binding candidate | Core expansion needed? | Reason |
| --- | --- | --- | --- | --- |
| financial mandate scope | `authority.scope` + `authority.delegation` | `synthetic_finance.mandate.scope` | NO | Account, instrument, amount, and time are domain scope dimensions. |
| reviewer authority | `review.review` + `authority.source/scope` | `synthetic_healthcare.reviewer.requirement` | NO | Review occurrence and applicable authority remain separate claims. |
| meaningful oversight | `review.review` + `CB-24` | rationale/actionability bindings | NO | The existing human-in-loop boundary blocks presence inflation. |
| epistemic reliance | `boundary.reliance` + `claim.scope` + `temporal.basis` | `synthetic_epistemic.reliance.context` | NO | Missing reliance basis safely remains indeterminate. A future dedicated Claim Boundary may improve specificity without adding a primitive. |
| knowledge integrity | `evidence.item/verification` + `CB-09` | `synthetic_epistemic.artifact.knowledge_bundle` | NO | Existing integrity/veracity separation is domain-neutral. |
| state transition | `effect.state_transition` + `boundary.effect` | domain state labels | NO | Operational and epistemic values share one transition structure. |
| delegation attenuation | `authority.delegation/boundary` + `CB-17` | scope comparator and chain-validity binding | NO | Domain comparators establish subset/broader shape; Core preserves non-amplification. |

No `CORE_EXPANSION_PRESSURE` requiring a new primitive was observed. A narrower issue was recorded for future consideration: explicit reliance-specific Claim Boundary coverage could make an `indeterminate` result more descriptive if an Epistemic product context were ever separately authorized. It is not needed for this test and is not a second engine.

## Core mutation check

Canonical Core Registry snapshot SHA-256:

```text
before: c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935
after:  c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935
equal:  true
```

Core primitive count remains `30`; Claim Boundary count remains `24`. Representative Core `supports_claim()` results are byte-equivalent before and after all synthetic modules load.

## Module isolation

Synthetic modules exist only in the E3-B fixture and verifier path. They are not exported through `packages/guard-core/src/index.ts`, imported by the public CLI, included in canonical `npm run verify`, or mentioned as supported domains in product documentation.

The targeted command is:

```text
npm run verify:mesr:cross-domain
```

## What was demonstrated

- materially different scope shapes reuse one Core delegation model;
- materially different review subjects reuse one Core review model;
- operational and epistemic transitions reuse one Core transition/evidence model;
- existing Claim Boundaries prevent access, delegation, human-presence, integrity, and producer vocabulary inflation;
- adding synthetic Domain modules does not mutate Core meaning;
- the 30-primitive thin Core survived these three controlled cross-domain tests.

## What was not demonstrated

- Finance or Healthcare product support;
- trading, payments, medical validation, diagnosis, treatment, or clinical correctness;
- knowledge management, universal ontology, knowledge graph, memory platform, or truth engine;
- complete external-vocabulary or broader runtime portability;
- universal domain neutrality;
- production readiness, execution authority, IAM, enforcement, compliance, or certification.

## Hypothesis update

- `PH-01 Thin Core = STRENGTHENED`, not universally proven.
- `PH-02 EAK Domain Neutrality = STRENGTHENED` by this direct controlled cross-domain test using one supportability engine; full EAK workflow/profile neutrality remains unproven.
- `PH-03 Semantic Non-Interference = STRENGTHENED` because Core bytes and representative Core claim results remain unchanged.
- `PH-04 = UNCHANGED`.
- `PH-05 = UNCHANGED`.

## Gate discipline

```text
Gate 1 = PASS
Phase 2A = PASS
Phase 2A.1 = PASS
Phase 2B / E3-A1 = PASS
Phase 2C / E3-B = PASS
Gate 2 = NOT YET
Gate 3 = NOT RUN
Gate 4 = NOT RUN
```

Gate 2 remains open because formal remaining-condition review is still required, including external vocabulary evidence and broader runtime-portability targets.

## Compatibility invariants

- audit output / verdict / exit unchanged;
- deny exit code `25` unchanged;
- permit and classify behavior unchanged;
- recommendation-only, additive-only, non-executing, default-off;
- no authority scope expansion;
- no public CLI or JSON contract change;
- no public domain-support claim;
- no control-plane, dashboard, platform, or multi-agent orchestration drift.
