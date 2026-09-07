# V8 Phase 2B — E3-A1 Runtime Portability Validation Note v0.1

## Status

```text
E3-A1 Two-Producer Runtime Portability = PASS
Initial Runtime Portability Evidence = strengthened
Gate 2 = NOT YET
E3-B Cross-Domain Interpretation = NOT RUN
```

This note records a bounded, internal V8 development-path experiment. It does not change the public v7 runtime contract (`Node >=18`), expose MESR through the public CLI, or add execution authority.

## Evidence classification

### REAL PRODUCER SCHEMA EVIDENCE

- GitHub Actions: `scripts/fixtures/evidence_assurance_experiment_1_1_fresh_artifact.mjs` is the existing sanitized real-producer workflow/artifact sample.
- Guard-native Harness: `experiments/harness-phase-2-external-evidence/fixtures/mixed-evidence-pack.json` is the existing repository-grounded `pack_version: 0.1` Evidence Pack sample.

These samples are independently replayed through their adapters to demonstrate successful normalization. They are not asserted to describe the same event and are not compared for semantic equality.

### CONTROLLED TEST EVIDENCE

`scripts/fixtures/mesr_e3_a1_runtime_portability_fixtures.mjs` encodes one deliberately controlled software-change scenario twice:

- a GitHub Actions-shaped representation with workflow/run and artifact identifiers;
- a Harness Evidence Pack representation with record, source, tool-call, and pack identifiers.

The raw structures and producer-native identifiers intentionally differ. They represent the same synthetic semantic facts; they are not the same production event independently observed by two systems.

### HYPOTHESIS

The experiment tests only the initial two-producer portability hypothesis. It does not prove broad runtime portability, cross-domain neutrality, or third-producer compatibility.
Correction recorded at the start of Phase 2C:

```text
PH-02 EAK Domain Neutrality = UNCHANGED / NOT DIRECTLY TESTED by E3-A1
```

E3-A1 tested the same domain across different producers, not materially different domains.

## Existing producer assets reviewed

GitHub Actions assets:

- `docs/validation/evidence-assurance-experiment-1-1-continuity-closure-v0.1.md`
- `docs/validation/evidence-assurance-experiment-1-real-producer-selection-v0.1.md`
- `scripts/fixtures/evidence_assurance_experiment_1_1_fresh_artifact.mjs`
- `scripts/fixtures/evidence_assurance_experiment_1_real_cases.mjs`
- `scripts/verify_evidence_assurance_experiment_1_real_producer.mjs`
- `scripts/verify_evidence_assurance_experiment_1_1_fresh_artifact.mjs`
- `packages/guard-core/src/evidenceAssuranceKernel.ts`

Harness assets:

- `docs/adr/0002-harness-as-producer.md`
- `docs/harness/phase-2-external-evidence-record-schema.md`
- `docs/harness/phase-2-pack-normalizer-renderer.md`
- `docs/harness/phase-2-external-evidence-ingestion-brief.md`
- `docs/adapters/harness-evidence-ingest-formal-adapter-review.md`
- `experiments/harness-phase-2-external-evidence/fixtures/mixed-evidence-pack.json`
- `experiments/harness-phase-2-external-evidence/normalize-evidence-pack.mjs`
- `scripts/verify_harness_phase2_external_evidence_schema.mjs`
- `scripts/verify_harness_phase2_pack_normalizer_renderer.mjs`

## Adapter boundary

```text
producer-native syntax
  -> deterministic local producer adapter
  -> normalized evidence facts + fact-level provenance
  -> shared MESR Core/software registry and support evaluator
  -> Canonical Semantic Snapshot
```

The adapters only extract, normalize, bind, and preserve provenance. Claim evaluation remains in the MESR projection/evaluator layer. The adapters do not register semantics, create Claim Boundaries, render reports, assign risk, grant authority, or produce a governance verdict.

The registry is a fixed local list sorted by adapter ID. There is no network discovery, marketplace, remote loading, or public export.

## Adapter versions

| Adapter | Adapter version | Supported producer schema | MESR Core compatibility |
| --- | --- | --- | --- |
| `mesr.adapter.github-actions` | `0.1.0` | `evidence-assurance-experiment-1.1/v0.1` | `>=0.1.0 <0.2.0` |
| `mesr.adapter.github-actions` | `0.1.0` | `github-actions-controlled-equivalence/v0.1` (test only) | `>=0.1.0 <0.2.0` |
| `mesr.adapter.guard-native-harness` | `0.1.0` | `harness-evidence-pack/v0.1` | `>=0.1.0 <0.2.0` |

An explicitly unsupported schema/version returns `UNSUPPORTED_PRODUCER_VERSION`; the adapter does not guess renamed or absent fields. Changing an adapter version may change extraction logic but may not silently redefine an MESR semantic ID.

## Grounded fields and limits

The GitHub real replay reads the existing sanitized fields for producer, workflow/run identity, repository, commit, ref/event/actor, conclusion, timestamps, artifact/run/commit binding, artifact identity, and Guard-computed digest. It does not add a GitHub API, recover redacted fields, treat a producer conclusion as independent verification, or infer deployment evidence that is absent.

The Harness real replay reads the existing Evidence Pack fields for pack version/identity, record identity/type/source/source schema, subject actor/run/task/tool, command execution evidence, claims, timestamp, and raw-reference digest. It does not change Harness behavior, parse free-form claim detail as authority, or treat Harness as a verifier.

The controlled GitHub schema and controlled Harness claim vocabulary are local test encodings only. They are not advertised as production producer contracts.

## Controlled scenario

The controlled facts bind:

- repository `example/repo`, base `commit-A`, candidate `commit-B`;
- changed path `src/payment.ts`, actor `agent-build-01`, action `modify`;
- declared path scope only;
- tests executed and passed for `commit-B`;
- artifact digest bound to `commit-B`;
- review bound to `commit-B`, path scope, authority reference, and time;
- release identity and observed staging effect bound to `commit-B`;
- independent verification and execution authority explicitly not implied.

Producer-native workflow run, artifact, pack, record, source, and tool-call identifiers remain in `producer_native_metadata` and fact-level provenance. They are excluded from semantic equality.

## Canonical comparison

Both controlled inputs resolve through the same 30-entry MESR Core registry and software-domain seed. The canonical comparison includes:

- Core semantic IDs;
- support relations;
- active Claim Boundaries;
- required-binding statuses;
- explicit non-claims;
- subject/effect binding semantics.

It excludes producer-native IDs, display metadata, raw field names, and transformation provenance. The two canonical snapshots are structurally and byte-for-byte equal: 15 Core IDs, 12 support relations, and 26 subject/effect bindings in the accepted fixture.

## Negative results

| Case | GitHub-shaped consequence | Harness-shaped consequence | Result |
| --- | --- | --- | --- |
| approval vocabulary without subject/scope/authority/time | `applicable_review_exists = does_not_support` via `CB-18`; `authority_verified` and `execution_authorized` remain blocked | same | symmetric |
| valid artifact hash | `artifact_integrity = supports`; truth/correctness/safety/authorization do not support | same | symmetric |
| verification result removed | `tests_passed = indeterminate`, missing `result` | same | symmetric |
| verification subject `commit-B`, release subject `commit-C` | explicit contradiction | same | symmetric |

Producer vocabulary receives no semantic privilege.

## Provenance and determinism

Each extracted fact retains producer ID, producer schema version, adapter ID/version, and a native JSON pointer. Producer-native metadata is retained separately and excluded from semantic equality.

For each controlled input and each repository-grounded replay input, normalization plus snapshot construction is run twice. The serialized canonical snapshots are byte-identical.

## Acceptance summary

All `AC-A1-01` through `AC-A1-16` pass under the targeted verifier and required regression suite. The dedicated command is:

```text
npm run verify:mesr:runtime-portability
```

It is intentionally not part of canonical `npm run verify` because MESR remains internal, default-off, and V8 development-path only.

## Demonstrated and not demonstrated

Demonstrated:

- two different producer representations can preserve the same bounded software-change meaning;
- producer vocabulary does not change claim-support outcomes in the tested cases;
- schema rejection, provenance, missing evidence, and mismatch handling are deterministic and symmetric.

Not demonstrated:

- GitHub and Harness are equivalent systems;
- the replay samples are the same event;
- cross-domain interpretation (`E3-B`);
- broad runtime or authority portability (`E3-A2/A3`);
- network connectors, runtime enforcement, policy decision authority, certification, or production readiness.

## Compatibility invariants

- audit output / verdict / exit unchanged;
- deny exit code `25` unchanged;
- permit and classify behavior unchanged;
- recommendation-only, additive-only, non-executing, default-off;
- no authority scope expansion;
- no public CLI or JSON contract change;
- no control-plane, dashboard, platform, or multi-agent orchestration drift.
