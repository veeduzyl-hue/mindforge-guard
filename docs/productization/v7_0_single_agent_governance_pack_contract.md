# v7.0 Single-Agent Governance Pack Contract

## 1. Scope

- Contract planning only
- No CLI implementation
- No runtime schema change
- No fixtures
- No examples
- No verifier change
- No current docs change
- No commercial surface change
- No entitlement change
- No public launch execution

## 2. Contract Purpose

Single-Agent Governance Pack is the file-based input contract candidate for the `v7.0` report.
It packages user or enterprise Agent materials into a versionable, auditable, reviewable evidence package.

Guard reads evidence artifacts.
Guard does not chat with the user to collect governance state.
Guard does not become an agent builder, dashboard, orchestrator, or control plane.

## 3. Pack Directory Structure

Candidate structure:

```text
single-agent-governance-pack/
  manifest.json
  agent-profile.json
  task-scope.md
  action-boundary.yaml
  data-sources.yaml
  tools.yaml
  review-standards.md
  evidence/
    sample-output.json
    run-record.json
  snapshot.json
```

This structure is a contract candidate.
It is not yet a runtime-validated schema.

## 4. File Responsibility Matrix

| File | Required Status | Primary Purpose | Feeds Report Section | Missing Evidence Handling | Notes |
| --- | --- | --- | --- | --- | --- |
| `manifest.json` | required | establish pack identity, version, and report target | `artifact_provenance`, `deterministic_hash` | omission | Canonical pack identity anchor. |
| `agent-profile.json` | required | define the agent identity, owners, and operating context | `intent_summary`, `review_posture` | omission | Missing ownership weakens accountability. |
| `task-scope.md` | required | define intended task boundary and known limits | `intent_summary`, `action_summary` | omission | Scope ambiguity should surface as a report omission. |
| `action-boundary.yaml` | required | define allowed and prohibited action boundary | `authority_summary`, `non_enforcement_boundary` | omission | Authority boundary is mandatory for safe interpretation. |
| `data-sources.yaml` | required | define data dependencies and their use purpose | `evidence_summary`, `artifact_provenance` | omission | Missing source visibility blocks evidence interpretation. |
| `tools.yaml` | required | define tool dependencies and operating constraints | `authority_summary`, `risk_summary` | omission | Tool scope is part of the effective action boundary. |
| `review-standards.md` | recommended | capture review expectations and reference standards | `review_evidence`, `findings` | limitation | Useful for evaluation depth, but not always mandatory in first-pass packs. |
| `evidence/sample-output.json` | required | provide one reviewable output artifact example | `evidence_summary`, `findings` | omission | Output evidence is required for meaningful review. |
| `evidence/run-record.json` | recommended | capture one execution record when available | `procedural_receipt_summary`, `review_evidence` | limitation | Improves procedural evidence depth. |
| `snapshot.json` | optional | support version anchoring and future comparison | `drift_summary`, `lineage_summary` | limitation | May be absent in early packs without blocking initial review. |

## 5. Minimum Field Contract

### `manifest.json`

Minimum fields:

- `pack_id`
- `pack_version`
- `pack_type`
- `created_at`
- `updated_at`
- `owner`
- `source_repo`
- `report_target`

### `agent-profile.json`

Minimum fields:

- `agent_id`
- `agent_name`
- `agent_type`
- `business_owner`
- `technical_owner`
- `review_owner`
- `intended_users`
- `operating_context`

### `task-scope.md`

Must explain:

- intended task
- in-scope behavior
- out-of-scope behavior
- success criteria
- known limitations

### `action-boundary.yaml`

Minimum fields:

- `allowed_actions`
- `prohibited_actions`
- `human_review_required`
- `escalation_required`
- `external_side_effects`

### `data-sources.yaml`

Minimum fields:

- `data_source_id`
- `data_source_name`
- `data_category`
- `access_mode`
- `sensitivity_level`
- `retention_note`
- `usage_purpose`

### `tools.yaml`

Minimum fields:

- `tool_id`
- `tool_name`
- `tool_type`
- `permitted_operations`
- `prohibited_operations`
- `requires_human_approval`
- `side_effect_level`

### `review-standards.md`

Must explain:

- review criteria
- acceptance expectations
- known policy references
- reviewer notes

### `evidence/sample-output.json`

Minimum fields:

- `sample_id`
- `input_summary`
- `output_summary`
- `output_artifact_ref`
- `expected_behavior`
- `observed_behavior`
- `reviewer_note`

### `evidence/run-record.json`

Minimum fields:

- `run_id`
- `run_timestamp`
- `environment`
- `input_ref`
- `output_ref`
- `tool_calls_summary`
- `errors_or_warnings`
- `reviewer_observation`

### `snapshot.json`

Minimum fields:

- `snapshot_id`
- `version`
- `commit_sha`
- `environment`
- `generated_at`
- `artifact_hashes`
- `comparison_baseline`

## 6. Report Mapping

| Evidence Pack Area | Maps To Report Section | Purpose | Edition Visibility Candidate |
| --- | --- | --- | --- |
| `manifest` | `artifact_provenance`, `deterministic_hash` | anchor pack identity, source traceability, and stable report targeting | all_editions |
| `agent-profile` | `intent_summary`, `review_posture` | explain who the workflow is for and who owns review | Pro |
| `task-scope` | `intent_summary`, `action_summary` | describe the intended task boundary and operating goal | all_editions |
| `action-boundary` | `authority_summary`, `non_enforcement_boundary` | define allowed and prohibited actions without granting authority | Pro |
| `data-sources` | `evidence_summary`, `artifact_provenance` | explain evidence inputs and provenance coverage | all_editions |
| `tools` | `authority_summary`, `risk_summary` | explain tool dependency scope and side-effect risk | Pro |
| `review-standards` | `review_evidence`, `findings` | describe how outputs should be evaluated | Pro+ |
| `sample-output` | `evidence_summary`, `findings` | provide one concrete evidence artifact for review | all_editions |
| `run-record` | `procedural_receipt_summary`, `review_evidence` | capture execution trace and procedural evidence | Pro+ |
| `snapshot` | `drift_summary`, `lineage_summary` | support drift observation and comparison-ready review | Enterprise |

## 7. Omissions and Limitations Rules

- required file missing -> omission
- recommended file missing -> limitation
- optional file missing -> limitation or not_applicable
- malformed file -> omission
- unverifiable reference -> limitation
- missing owner -> omission
- missing action boundary -> omission
- missing sample output -> omission
- missing run record -> limitation
- missing snapshot -> limitation

Omissions and limitations are report findings.
They are not enforcement actions.

## 8. Boundary Rules

This contract does not grant:

- approval authority
- blocking authority
- merge authority
- deployment authority
- execution authority
- runtime enforcement
- production tool invocation
- compliance certification
- legal compliance claim

## 9. Future Implementation Candidates

Future candidates only:

- runtime pack parser
- JSON schema files
- fixture packs
- example hr-self-service-agent pack
- report command wiring
- markdown report output
- CI readiness guide
- GitHub Action wrapper

Each future implementation must be separately approved.

## 10. Verification Recommendation

Future verifier coverage should check:

- pack directory completeness
- required files present
- required fields present
- deterministic hash generation
- omissions / limitations classification
- report mapping stability
- no enforcement semantics

This PR does not create a verifier.

## 11. Recommended Next Decision

Allowed decision values:

- hold_pack_contract
- prepare_pack_schema_preview
- prepare_example_evidence_pack
- prepare_first_report_flow

Recommended:

- prepare_pack_schema_preview

This only authorizes a future schema preview planning / implementation proposal.
It does not authorize runtime CLI changes, public docs, examples, GitHub Actions, Marketplace work, or commercial surface edits.
