# Repaired Experiment 3 executable acceptance v0.2

Status: **B09 VALIDATION ONLY; oracle frozen. Gate 1 remains BLOCKED.**

## Scope and authority

This is the B00-B08 repaired acceptance track, following V8_000_PASS_WITH_BLOCKERS and specification closure B00-B08. E3-A/B/C/D here refer to repaired v0.2. The historical [Experiment 3 v0.1](../validation/experiment-3-semantic-portability-and-composition-v0.1.md), earlier domain experiments and Experiment 2B remain unchanged. Prior internal gates do not establish repaired runtime conformance.

Authoritative inputs: ADRs 0010-0016; B03 closure/field map; B02 negatives; B05 I01-I18; B06 S01-S13; B07 T01-T27; B08 C01-C27. Their source inventory/digests are retained in [basis.v0.2.json](../../tests/fixtures/experiment-3-repaired/basis.v0.2.json). B00/version ownership follows ADR 0009 and the separately preserved version-baseline commit.

## Three distinct records

| Record | Meaning |
|---|---|
| ORACLE | Independently authored B00-B08 expectations. The reference evaluator does not read expected states or case IDs. |
| REFERENCE_EVALUATION | Test-only execution of a frozen finite fixture language; not a second canonical engine or real-world truth. |
| CURRENT_RUNTIME_OBSERVATION | Measured unchanged MESR/EAK/temporal/report/reason/module outputs; expected gaps remain evidence. |

[reference.mjs](../../scripts/b09/reference.mjs) is the frozen 0.2.0 kernel. [input-admission.mjs](../../scripts/b09/input-admission.mjs) adds the separately versioned b09-admission-hardening/0.1 entry boundary. Both remain VALIDATION_ONLY_REFERENCE_EVALUATOR / NOT_PRODUCT_RUNTIME / NOT_CANONICAL_MESR_IMPLEMENTATION. The original kernel is valid for its pinned finite corpus, not an arbitrary-input public API. Unexpected kernel exceptions propagate to ERROR and nonzero exit.

## Frozen basis

- Oracle: **0.2.0**. Base input set: **b09-repaired-e3/0.2.0**.
- All 30 existing Core IDs and entry digests, 24 boundaries, 56 reason bindings, registry digest and four-module locks are pinned.
- Research short IDs are not admitted canonical IDs or aliases. Claim names such as verification.independent are test facets under B00-B08; accompanying mesr.core.* entries are canonical anchors, not exact aliases.
- Core, Software domain, test crosswalk and presentation profile use actual existing manifests. Full support/nonclaim/binding inventories, manifest bytes/content, dependencies and context versions are retained.
- The attributable admission dossier is a finite test basis, not institutional authority or product registry admission.
- Profile/claim-set and method versions/digests, subject repo:fixture@revision-b, revision revision-b, scope src/change.ts, evidence refs, and evaluation/reliance time 2026-09-15T10:00:00Z are explicit. Case mutations retain missing values.
- Canonical JSON sorts object keys by code point, preserves arrays and rejects non-JSON/nonfinite values. Set-valued bindings/diagnostics are sorted; event/manifest array order remains meaningful.
- Node v24.15.0 pins legacy observation behavior/native TypeScript stripping. It does not change the released CLI's Node contract.
- No network, wall-clock fallback, mutable latest, LLM interpretation or absolute-path-dependent semantics.

## Executable coverage

| Group | Cases | Boundary |
|---|---:|---|
| B02 N01-N18 including N06a/b and variants | 24 | Six states; binding union; false/empty values; scoped nonclaims; comparable conflict |
| B05 I01-I18 and variants | 23 | Occurrence/result/identity/independence/custody/integrity/acceptance separation |
| B06 S01-S13 and variants | 26 | Bounded profile sufficiency and outward report association |
| B07 T01-T27 and variants | 37 | Reliance, snapshots, continuity, expiry/revocation/supersession and history |
| E3-A | 5 | Producer facts and distinct provenance; actual Harness gaps preserved |
| E3-B | 2 | Absent check versus producer pass with unresolved independence |
| E3-C | 14 | Labels cannot create facts, aliases or equivalences |
| B08 C01-C27 / E3-D and variants | 41 | Deterministic four-module admission and atomic rejection |
| Resume H01-H35 | 35 | Malformed-input rejection and explicit unresolved obligations |

**207 unique executable cases**, plus **603 separately executed Core noninterference probes** and replay/permutation checks. Probes are not inflated into fixture count. The initial 167 grew to 172 before interruption through S04.label_only, S04.bad_profile_digest, N08.predicate_override, I10.unresolved_ref and E3-A.actual_harness_gaps. Resume adds 35 admission cases; the 172-case corpus/expectations remain unchanged.

## Acceptance boundaries

E3-A positives are synthetic CI and explicitly supplemented Harness-style events. Producers emit facts, not equivalence assertions. Bounded results agree while producer provenance differs. The actual Harness schema/count/exit-only control yields MISSING_FACTS, no canonical pack, and unresolved verification. No production Harness adapter is implemented or implied.

E3-B keeps producer pass SUPPORTED with SUPPORTED_BY_PRODUCER_ASSERTION provenance, world-level independence UNRESOLVED without principal/separation/custody basis, and producer-only inference UNSUPPORTED. No absent event is synthesized as failed or not_run.

E3-C covers Runtime ALLOW, Guard allow, external ALLOW, VERIFIED, APPROVED, SAFE, ACCEPTED, COMPLIANT, IDENTITY, AUTHORITY, TESTS PASSED, ACCEPTANCE, HISTORICAL VALID and CURRENT STANDING. The finite test contract admits no name-only mapping: automatic equivalences, name-only aliases, policy-to-world promotions and report-wording-to-proof promotions are all zero.

**Guard allow != Runtime ALLOW != evidence.sufficient != Institutional Acceptance != Execution Authorization.**

E3-D uses the existing four types. Every invalid requested composition returns semantic_entries=[], mappings=[], profiles=[]; no partial activation. Current diagnostics remain verbatim in observations; LOCK_* remains auxiliary reference vocabulary. Descriptive cycles are not alias/supersession cycles. No new scheduler or alias resolver is installed.

B06 is test-only: legacy allow without profile basis stays UNRESOLVED; complete bound evidence may be SUPPORTED; explicit material gap yields UNSUPPORTED; complete undecidable materiality yields INCONCLUSIVE. Mismatched report links prevent association without changing standalone sufficiency. Validated legacy allow/require_review/block report bytes remain unchanged.

## Runtime observation limits

The [observation baseline](../../tests/fixtures/experiment-3-repaired/runtime-observation-baseline.v0.2.json) contains case, surface, measured result, expected result, classification, source/command and notes. Original case hashes are preserved.

EAK receives an explicit test-only producer-status projection into a copy of a canonical control pack. This is not validated Harness normalization. Legacy report checks use a separate schema-valid control and compare bytes before/after assurance evaluation. Three malformed legacy composition inputs and 35 admission-only controls are outside current typed APIs. Their reference tests execute; none is silently skipped.

## Reproduction and freeze

Run both commands from the repository root:

~~~text
node scripts/verify_v8_b09_repaired_experiment_3.mjs
node scripts/verify_v8_b09_acceptance_resume.mjs
~~~

The first executes the preserved corpus, 603 probes and runtime snapshots. The second rechecks admission, H01-H35, live observations and final serialized acceptance. Assertions/errors return nonzero. An expected validation rejection is not an evaluator exception.

[freeze.v0.2.json](../../tests/fixtures/experiment-3-repaired/freeze.v0.2.json) pins exact bytes. [replay.v0.2.json](../../tests/fixtures/experiment-3-repaired/replay.v0.2.json) records three equal result hashes. The authoring utility is never called by verification and refuses overwrite after freeze. Any later semantic oracle change requires **ORACLE_REVISION_REQUIRED**, an explained/reviewed version and preserved predecessor evidence. No semantic oracle revision occurred on resume.

Audit output / verdict / exit unchanged; deny exit code 25 unchanged; permit behavior unchanged; classify behavior unchanged. Recommendation-only, additive-only, non-executing, default-off where applicable; no authority scope expansion. No control-plane, dashboard or orchestration drift. CLI/JSON, licensing/offline authority, install and demo paths unchanged.
