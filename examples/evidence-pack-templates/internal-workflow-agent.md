# Evidence Pack Template: Internal Workflow Agent

Use this template for a single internal workflow, such as intake routing, policy explanation, back-office summary preparation, or internal request classification.

## Folder Shape

```text
my-workflow-pack/
  README.md
  manifest.json
  agent-profile.json
  task-scope.md
  action-boundary.yaml
  tools.yaml
  data-sources.yaml
  review-standards.md
  snapshot.json
  evidence/
```

## README.md

```md
# Internal Workflow Agent Evidence Pack

This pack describes one internal workflow agent for governance review. It uses synthetic, redacted, or summary evidence. It does not finalize business decisions, change systems of record, or grant approval authority.
```

## manifest.json

```json
{
  "pack_id": "internal-workflow-agent-pack",
  "pack_version": "v1",
  "pack_type": "single_agent_governance_pack_preview",
  "created_at": "YYYY-MM-DDTHH:MM:SSZ",
  "updated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "owner": "internal_workflow_owner",
  "source_repo": "internal-workflow-system",
  "report_target": "single_agent_governance_report_preview_v1"
}
```

## agent-profile.json

```json
{
  "agent_id": "internal-workflow-agent",
  "agent_name": "Internal Workflow Agent",
  "agent_type": "single_agent",
  "business_owner": "process_owner",
  "technical_owner": "workflow_platform_owner",
  "review_owner": "workflow_reviewer",
  "intended_users": ["internal_requesters", "workflow_reviewers"],
  "operating_context": "Assists with internal workflow summaries and routing recommendations. Output remains recommendation-only."
}
```

## task-scope.md

```md
intended task:
Assist with one bounded internal workflow by summarizing request context, explaining policy references, or recommending routing for human review.

in-scope behavior:
- summarize a redacted internal request
- identify relevant policy references
- recommend routing options
- flag ambiguity or missing evidence

out-of-scope behavior:
- approve requests
- reject requests
- change systems of record
- send messages to external systems
- make employment, finance, legal, or access-control decisions

success criteria:
- the recommendation is traceable to workflow policy evidence
- known limitations are visible
- missing evidence is explicit
- final business action remains outside Guard
```

## action-boundary.yaml

```yaml
allowed_actions:
  - summarize internal request context
  - identify policy references
  - recommend routing options for human review
  - list missing evidence
prohibited_actions:
  - approve requests
  - reject requests
  - update systems of record
  - grant access
  - send external messages
human_review_required: true
escalation_required: true
external_side_effects: none
```

## tools.yaml

```yaml
tools:
  - tool_id: policy_reference_reader
    tool_name: Policy Reference Reader
    tool_type: knowledge_lookup
    permitted_operations:
      - read selected policy references
      - return cited workflow guidance
    prohibited_operations:
      - update policy records
      - approve internal requests
      - modify systems of record
    requires_human_approval: false
    side_effect_level: none
```

## data-sources.yaml

```yaml
data_sources:
  - data_source_id: redacted_internal_request
    data_source_name: Redacted Internal Request
    data_category: internal_workflow
    access_mode: manual_upload
    sensitivity_level: internal
    retention_note: Store redacted or synthetic workflow details only.
    usage_purpose: Provide review context for a bounded internal-workflow agent.
```

## review-standards.md

```md
review criteria:
- the report must show internal workflow action boundaries
- recommendations must be traceable to policy evidence
- missing evidence must be explicit
- the report must not imply business approval authority
```

## snapshot.json

```json
{
  "snapshot_id": "snapshot-internal-workflow-agent-001",
  "version": "v1",
  "commit_sha": "REPLACE_WITH_WORKFLOW_OR_REQUEST_VERSION",
  "environment": "local_preview",
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "artifact_hashes": [],
  "comparison_baseline": null
}
```

## evidence/

Recommended evidence files:

```text
evidence/
  redacted-request-summary.md
  policy-references.md
  routing-rationale.md
  reviewer-notes.md
```

## Run The Review Commands

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The generated JSON files are review artifacts for human inspection.

MindForge Guard does not approve, block, deploy, certify, or control execution.
