# Harness Evidence Ingest Summary Bridge

## 1. Status

Status: internal preview contract

The Guard-owned Harness Evidence Ingest Summary Bridge is an internal preview bridge.
It is additive only, local-only, default-off, non-executing, and consumer-side only.
It is not production integration.

## 2. Purpose

This bridge consumes an already validated Harness `evidence-pack.json` and normalizes producer facts into a Guard-owned ingest summary.

The summary exists to make local ingestion verification easier without changing Guard Core runtime behavior or the stable Guard Core evidence-pack contract.

Harness remains Evidence Producer only.
Guard remains the governance consumer and source of truth.

## 3. Scope

In scope:

- consume an already validated Harness `evidence-pack.json`
- normalize bounded producer facts into a Guard-owned preview summary
- preserve producer boundary metadata
- count actions, blocked actions, tool calls, artifacts, and manifest entries
- list present required artifacts
- list missing optional artifacts
- list hash-verified artifacts
- surface validation success, failures, and warnings from the local verifier

This bridge does not change audit, permit, or classify.

## 4. Non-goals

This bridge does not compute final governance verdicts.
This bridge does not compute Guard reason codes.
This bridge does not compute risk summaries.
This bridge does not score evidence coverage.
This bridge does not generate governance reports.
This bridge does not generate stable evidence indexes.
This bridge does not approve, block, deploy, rollback, merge, commit, execute, or control runtime behavior.
This bridge does not introduce scanner behavior.
This bridge does not add network calls, model runtime behavior, `axios`, `OpenAI`, `Anthropic`, or `fetch`.
This bridge does not change Guard Core runtime paths.
This bridge does not change audit, permit, or classify.

## 5. Input Contract

The input is a Harness-produced `evidence-pack.json` that has already been loaded locally.

Minimum bridge assumptions:

- the file is local
- the pack has already passed local structural validation
- `authority.boundary === "producer_only"`
- `authority.consumer_authority === "mindforge-guard-core"`
- `authority.governance_outputs_emitted === false`
- `authority.execution_authority_granted === false`

Harness remains Evidence Producer only.
Guard remains the governance consumer and source of truth.

## 6. Validation Prerequisites

Before the bridge emits a summary, the local verifier should confirm:

- required top-level fields are present
- producer boundary fields are preserved
- Guard-native governance outputs are absent from the producer pack
- manifest membership is consistent
- required local artifacts are present
- missing optional artifacts are explicitly optional
- any declared manifest hashes are verified deterministically
- safe and unsafe fixture semantics remain bounded

The bridge consumes an already validated Harness `evidence-pack.json`.

## 7. Summary Object Contract

The preview summary object is Guard-owned and currently versioned as `0.1-preview`.

Allowed summary fields:

```js
{
  profile: "harness-evidence-ingest-summary",
  schema_version: "0.1-preview",
  producer: {
    boundary: "producer_only"
  },
  consumer: {
    authority: "mindforge-guard-core",
    summary_owner: "mindforge-guard"
  },
  source_pack: {
    id: "...",
    pack_type: "...",
    artifact_count: 0,
    manifest_count: 0
  },
  ingest_validation: {
    valid: true,
    failures: [],
    warnings: []
  },
  action_observations: {
    completed_actions_count: 0,
    blocked_actions_count: 0,
    tool_calls_count: 0,
    command_outputs_count: 0
  },
  artifact_observations: {
    present_required_artifacts: [],
    missing_optional_artifacts: [],
    hash_verified_artifacts: []
  },
  governance_non_claims: {
    verdict: "not_computed",
    reason_codes: "not_computed",
    risk_summary: "not_computed",
    evidence_coverage: "not_scored",
    governance_report: "not_generated",
    evidence_index: "not_generated",
    approval_authority: "not_granted",
    execution_authority: "not_granted",
    deployment_authority: "not_granted",
    rollback_authority: "not_granted"
  }
}
```

Additional preview-only descriptive fields may be carried if they do not change the bounded non-claim posture.

## 8. Output Semantics

The output is a Guard-owned ingest summary for local preview use only.

It summarizes producer facts and verifier outcomes.
It does not transform producer facts into Guard governance conclusions.

Allowed semantics include:

- counts of completed actions
- counts of blocked actions
- counts of tool calls
- counts of command outputs recorded by the producer
- lists of present required artifacts
- lists of missing optional artifacts
- lists of hash-verified artifacts
- local validation success, failures, and warnings

## 9. Governance Non-claims

The bridge must preserve these governance non-claims:

- `verdict: "not_computed"`
- `reason_codes: "not_computed"`
- `risk_summary: "not_computed"`
- `evidence_coverage: "not_scored"`
- `governance_report: "not_generated"`
- `evidence_index: "not_generated"`
- `approval_authority: "not_granted"`
- `execution_authority: "not_granted"`
- `deployment_authority: "not_granted"`
- `rollback_authority: "not_granted"`

The bridge does not compute final governance verdicts.
The bridge does not compute Guard reason codes.
The bridge does not compute risk summaries.
The bridge does not score evidence coverage.
The bridge does not generate governance reports.
The bridge does not generate stable evidence indexes.
The bridge does not approve, block, deploy, rollback, merge, commit, execute, or control runtime behavior.

## 10. Evidence Pack Mapping

Representative mapping direction:

- `producer.*` maps to preview producer identity and boundary preservation
- `authority.boundary` maps to `producer.boundary`
- `authority.consumer_authority` maps to `consumer.authority`
- `pack_id` maps to `source_pack.id`
- `pack_type` maps to `source_pack.pack_type`
- `artifacts.length` maps to `source_pack.artifact_count`
- `manifest.files.length` maps to `source_pack.manifest_count`
- completed `actions` map to `action_observations.completed_actions_count`
- `blocked_actions.length` maps to `action_observations.blocked_actions_count`
- `tool_calls.length` maps to `action_observations.tool_calls_count`
- completed tool calls with output summaries map to `action_observations.command_outputs_count`
- artifact path checks map to `artifact_observations.present_required_artifacts`
- optional missing artifacts map to `artifact_observations.missing_optional_artifacts`
- manifest hash matches map to `artifact_observations.hash_verified_artifacts`

This mapping is producer-fact normalization only.

## 11. Negative-boundary Expectations

The bridge must not:

- compute final governance verdicts from Harness producer metadata
- compute Guard reason codes from Harness producer metadata
- compute risk summaries from Harness producer metadata
- score evidence coverage from Harness producer metadata
- generate governance reports from Harness producer metadata
- generate stable evidence indexes from Harness producer metadata
- approve, block, deploy, rollback, merge, commit, or execute anything
- control runtime behavior
- introduce scanner behavior
- introduce network calls or model behavior

Harness remains Evidence Producer only.
Guard remains the governance consumer and source of truth.

## 12. Verification Commands

Local verification commands:

```bash
npm.cmd run verify
node scripts/verify_harness_evidence_ingestion.mjs
node scripts/verify_harness_evidence_ingestion.mjs --summary
```

The local verifier should also check that this contract document exists and preserves the required non-claim language.

## 13. Acceptance Criteria

This preview bridge is acceptable when:

- the bridge remains additive only
- the bridge remains local-only
- the bridge remains default-off
- the bridge remains non-executing
- the bridge remains consumer-side only
- the summary object uses `profile: "harness-evidence-ingest-summary"`
- the summary object uses `schema_version: "0.1-preview"`
- the summary preserves `producer_only`
- the summary preserves `consumer.authority: "mindforge-guard-core"`
- the summary preserves `consumer.summary_owner: "mindforge-guard"`
- the summary preserves all governance non-claims
- the verifier passes for both safe and unsafe fixtures
- audit, permit, and classify remain unchanged

## 14. Future Compatibility Notes

This contract is preview-only and not a stable public API.

Future changes, if any, should:

- remain Guard-owned
- remain additive
- preserve the non-claim posture
- avoid changing Guard Core runtime paths
- avoid changing the stable Guard Core evidence-pack contract
- stay local-only and default-off unless a later explicitly scoped release changes that posture

If promoted later, promotion should happen through a separately reviewed bounded step rather than implicit drift.
