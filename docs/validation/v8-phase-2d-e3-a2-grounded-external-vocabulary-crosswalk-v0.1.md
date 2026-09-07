# V8.0 Phase 2D — E3-A2 Grounded External Vocabulary Crosswalk v0.1

## Status

Phase 2D / E3-A2: PASS.

G2-H03: SATISFIED by controlled, source-pinned, executable evidence.

Gate 2: READY TO CLOSE. This note does not close Gate 2, start Gate 3, or redefine the frozen gate. A separate formal closure checkpoint remains required.

## Boundary

This phase validates one grounded external vocabulary against the existing MESR Core. It adds a test-only Crosswalk, controlled fixtures, a source manifest, and a targeted verifier. It does not add a producer adapter, server, SDK, client, protocol integration, runtime network dependency, public export, CLI command, global verification dependency, execution authority, or product claim.

The result remains recommendation-only, additive-only, non-executing, and default-off. `audit` output, verdict, and exit behavior are unchanged. Deny exit code `25` is unchanged. `permit` and `classify` behavior are unchanged. No authority scope is expanded.

## External source identity

Two source dimensions are intentionally preserved:

- protocol identity: APAAI Protocol v1.0 (RFC-2025-001), from `https://www.apaaiprotocol.org/`;
- machine artifact: `openapi.yaml`, OpenAPI `3.0.3`, `info.version` `0.1.0`, from repository `https://github.com/apaAI-Labs/apaai-protocol` at commit `723defe1972a7e9df19eaff7db3d5d7101297137`.

The pinned artifact was retrieved on 2026-09-07. Its observed byte length was `15981`, line count was `479`, and SHA-256 was `7af928ebf4c421a28d289585471d2407d728d1cc6d18bc1df128827ca9571bc1`. The official site and machine artifact identify Apache-2.0. The website protocol identity and the OpenAPI machine version are not normalized into a single version.

The compact source record is `scripts/fixtures/apaai_protocol_source_manifest_v1.json`. It records identity, URLs, repository, commit, artifact, both version dimensions, retrieval date, license reference, source ambiguities, vocabulary scope used, and explicit non-authority limits. The external artifact is not copied into runtime code and is not fetched during verification.

## Source ambiguities and deterministic rule

Seven source ambiguities are preserved rather than silently repaired:

1. Website v1.0 / RFC-2025-001 and OpenAPI `info.version` 0.1.0 are distinct provenance dimensions.
2. The site presents Action, Policy, and Evidence as three primitives; the OpenAPI also defines Decision. Decision is treated only as a source response record.
3. `/actions` prose/examples use `approved` or `rejected`, while the Decision schema permits `allowed`, `requires_approval`, or `recorded`. Controlled fixtures use the machine enum; prose-only values are rejected.
4. The `/policy` example shape conflicts with the Policy component schema. Controlled fixtures use `rules[].when`, `rules[].mode`, and optional `rules[].require`.
5. `/evidence` examples add check fields such as `metadata` or `error` that are not permitted by the check-item schema. Those fields are rejected.
6. Response `verified` means the source reports all evidence checks passed; it is not independent verification.
7. The site says governance is intentionally out of scope while API descriptions use governance, enforcement, approval, and execution-adjacent language. Those words remain external record content and do not confer Guard authority.

The deterministic precedence rule is: for controlled machine fixtures, the pinned component schema wins over incompatible endpoint prose/examples; all conflicts remain documented in provenance. No field named `policy_evaluated` is invented or used.

## Grounded vocabulary and Crosswalk

The test-only module is `mesr.xw.apaai.openapi_0_1_0.e3_a2`, owns namespace `mesr.xw.apaai`, and has `added_semantics: []`.

Mapped source concepts are limited to:

- Actor and its `kind`, `name`, and `provider` content through Action actor attribution;
- Action and its `id`, `type`, `actor`, `target`, and `timestamp` bindings;
- Policy, `rules`, `when`, `mode`, and `require`;
- Decision, `actionId`, `status`, and `checks`;
- Evidence, `actionId`, `checks`, `pass`, `approver`, `timestamp`, `signed`, and `hash`;
- the `/evidence` response `verified` flag.

The Crosswalk contains 22 mappings to existing MESR Core semantics. It adds no Core primitive and overrides no Core definition, support relation, required binding, or Claim Boundary.

## Semantic boundary results

### Action is not authority

Action maps to bounded action/actor records. Its presence does not support verified authority, approval, execution authorization, correctness, or safe effect. `CB-01` is exercised for evidence-presence-to-authority inflation.

### Policy or enforce is not Guard authority

Policy is an external evidence/scope record. `mode: enforce` is retained as source vocabulary only. It does not activate Guard enforcement and does not support Guard authority, approval, execution permission, or legal compliance. `CB-19` prevents policy-match-to-legal-compliance inflation.

### Decision is not Guard disposition

APAAI Decision is an external response record. `allowed`, `requires_approval`, and `recorded` are source status labels; none becomes a Guard governance disposition, permit result, CLI verdict, or execution decision.

### Evidence pass is not independent verification

Evidence check `pass: true` and response `verified: true` are producer observations. They do not support independent verification, correctness, safety, or compliance. `CB-22` requires source separation, method, and limitations for independent verification.

### Hash or signing is not truth or authority

`hash` is preserved as source record content, not a verified integrity result. `signed: true` is an attributable source assertion, not verified signature authenticity. Neither supports truth, correctness, authority, or execution permission. No false `artifact_integrity` or `signature_verified` state is synthesized.

### Approver record is not applicable approval

An `approver` string records attribution only. Without subject, scope, authority, and time bindings it does not support applicable review or approval. `CB-18` is exercised.

### Protocol conformance is not compliance or certification

A protocol mapping or source policy match does not support legal compliance or certification. `CB-19` and `CB-20` are exercised. APAAI source use is not Guard endorsement, certification, or a product support claim.

## Native versus APAAI controlled equivalence

The APAAI fixture and Guard-native controlled fixture use different raw schemas and retain different provenance/external references. They encode the same bounded action, policy-record, external-decision-record, evidence-observation, and explicit non-claim facts. Their canonical MESR semantic snapshots are byte-equal.

- raw schema equality: false;
- semantic provenance equality: false;
- external reference equality: false;
- canonical semantic equality: true;
- canonical semantic snapshot SHA-256: `899035da5d7329bf9584afe5c7b3f0b24a603ab0da41df8a15dbf3bff8e7a325`.

## Semantic non-interference

- Core primitive count: `30 -> 30`;
- Core registry SHA-256: `c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935 -> c7fd4a1ab76a80f06b3551e9abfba6cb0efda8b8eed9d05ccc11a04385518935`;
- Claim Boundary count: `24 -> 24`;
- canonical Claim Boundary SHA-256: `e6fe1f78f2107fce0bcf17385f19470381782c262dd29dd5348511397825e0e8 -> e6fe1f78f2107fce0bcf17385f19470381782c262dd29dd5348511397825e0e8`;
- representative `supports_claim` results before/after composition: byte-equivalent;
- Crosswalk added semantics: `0`;
- applied negative boundaries: `CB-01`, `CB-18`, `CB-19`, `CB-20`, `CB-22`.

## Determinism and negative coverage

Two independent fixture constructions and evaluations produce the same canonical semantic bytes and hash. Five incompatible source-shape fixtures are rejected deterministically: two prose-only Decision statuses, one incompatible Policy example, and two unsupported Evidence-check fields. Twenty negative semantic-inflation assertions permit only `does_not_support` or `indeterminate`; none resolves to `supports` or `partially_supports`.

## Acceptance criteria

| Criterion | Result | Evidence |
| --- | --- | --- |
| AC-A2-01 Protocol identity source pinned | PASS | Official URL and declared protocol identity in source manifest |
| AC-A2-02 Machine-readable source pinned to exact repository commit/artifact | PASS | Repository, 40-character commit, artifact URL, byte metadata, SHA-256 |
| AC-A2-03 Website protocol version and OpenAPI artifact version remain distinct | PASS | Separate declared and machine version fields |
| AC-A2-04 Source ambiguity recorded, not silently corrected | PASS | Seven enumerated ambiguity records and deterministic treatment |
| AC-A2-05 Only source-grounded vocabulary mapped | PASS | 22-entry allowlisted mapping set; non-source field rejected |
| AC-A2-06 Core count remains exactly 30 | PASS | `30 -> 30` assertion |
| AC-A2-07 Core hash/definitions unchanged | PASS | Equal canonical registry bytes and hash |
| AC-A2-08 APAAI Action does not imply authority | PASS | Negative action authority/approval/execution assertions; `CB-01` |
| AC-A2-09 Policy/enforce vocabulary does not imply Guard authority/approval | PASS | Negative authority/approval/execution/legal assertions; `CB-19` |
| AC-A2-10 External Decision does not become Guard governance disposition | PASS | Decision maps only as external record/observation |
| AC-A2-11 Evidence pass does not imply independent verification | PASS | Producer observation boundary `CB-22` |
| AC-A2-12 Hash/signing does not imply truth/authority | PASS | No synthesized integrity/signature-verification state; negative assertions |
| AC-A2-13 Approval record does not bypass subject/scope/authority/time | PASS | Missing subject/scope/authority/time; `CB-18` |
| AC-A2-14 Protocol conformance/mapping does not imply compliance/certification | PASS | `CB-19` and `CB-20` |
| AC-A2-15 APAAI and native controlled-equivalent fixtures produce semantic-equivalent canonical results | PASS | Equal canonical semantic snapshot |
| AC-A2-16 External provenance preserved | PASS | Raw/provenance/external-reference inequality assertions |
| AC-A2-17 Deterministic replay PASS | PASS | Two equal replays; stable canonical hash |
| AC-A2-18 Crosswalk remains test-only/internal/default-off | PASS | No public export/CLI/global verify/runtime network; presentation flags false |
| AC-A2-19 E3-A/B/C/D regressions PASS | PASS | Targeted, registry, reason, stability, composition, cross-domain, portability, runtime, aggregate Phase 2 |
| AC-A2-20 v7/EAK/CLI regressions PASS | PASS | EAK PoC, real producer, fresh artifact, `verify`, `verify:core`, `verify:v7.0.1` |

## Verification record

The following commands pass on the final staged snapshot:

- `npm run verify:mesr:apaai-crosswalk`
- `npm run verify:mesr:cross-domain`
- `npm run verify:mesr:runtime-portability`
- `npm run verify:mesr:claim-stability`
- `npm run verify:mesr:composition`
- `npm run verify:mesr:registry`
- `npm run verify:mesr:reason-bindings`
- `npm run verify:v8:runtime-compatibility`
- `npm run verify:v8:semantic-foundation:phase2`
- `npm run verify:evidence-assurance-kernel:poc`
- `npm run verify:evidence-assurance-experiment-1:real-producer`
- `npm run verify:evidence-assurance-experiment-1-1:fresh-artifact`
- `npm run verify`
- `npm run verify:core`
- `npm run verify:v7.0.1`
- `git diff --check`

The initial `verify:v7.0.1` invocation correctly stopped at its historical changed-path precondition because this phase's tracked files were unstaged. It was then rerun on the final staged snapshot, which is the verifier's intended clean-index comparison condition, without modifying or weakening the v7.0.1 verifier.

## Evidence classification

- official website and pinned repository artifact: EXTERNAL SOURCE EVIDENCE;
- compact source manifest: SOURCE-PINNED PROVENANCE RECORD;
- APAAI/Native fixtures, ambiguity negatives, and Crosswalk: CONTROLLED SOURCE-PINNED CROSSWALK EVIDENCE;
- Core/hash/boundary/support/replay assertions: INTERNAL EXECUTABLE EVIDENCE;
- no production APAAI compatibility, interoperability, certification, or protocol conformance is claimed.

## Gate 2 hard-condition disposition

| Requirement | Status after Phase 2D |
| --- | --- |
| G2-H01 Two producer representations | PASS |
| G2-H02 Two or more domain contexts | PASS |
| G2-H03 Grounded external vocabulary without authority import or boundary change | PASS |
| G2-H04 Claim Stability | PASS |
| G2-H05 Composition Stability and Semantic Non-Interference | PASS |
| G2-H06 Collision Injection | PASS |
| G2-H07 Deterministic replay | PASS |

All seven frozen hard conditions now have PASS evidence. The resulting decision is `Gate 2 = READY TO CLOSE`, not `Gate 2 = CLOSED`.

## Remaining classifications

- Third producer representation remains STRETCH and does not block Gate 2.
- E3-A3 capability-versus-authority mutation remains PRE_RC and mandatory before V8.0 RC; it is not a frozen Gate 2 hard condition.

## Recommended next step

Run a separate formal Gate 2 closure checkpoint that reviews this Phase 2D evidence together with the accepted Gate 2 audit. Do not auto-start Gate 3 from this implementation checkpoint.
