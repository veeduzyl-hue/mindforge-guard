# Evidence Pack Template: Ops Agent

Use this template for a single operations workflow, such as incident summarization, alert triage, runbook lookup, or operational recommendation preparation.

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
# Ops Agent Evidence Pack

This pack describes one operations-agent workflow for governance review. It uses synthetic, redacted, or summary operational evidence. It does not trigger remediation, change production systems, or grant operational authority.
```

## manifest.json

```json
{
  "pack_id": "ops-agent-pack",
  "pack_version": "v1",
  "pack_type": "single_agent_governance_pack_preview",
  "created_at": "YYYY-MM-DDTHH:MM:SSZ",
  "updated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "owner": "ops_owner",
  "source_repo": "ops-workflow-or-runbook-system",
  "report_target": "single_agent_governance_report_preview_v1"
}
```

## agent-profile.json

```json
{
  "agent_id": "ops-agent",
  "agent_name": "Ops Agent",
  "agent_type": "single_agent",
  "business_owner": "operations_lead",
  "technical_owner": "platform_owner",
  "review_owner": "incident_reviewer",
  "intended_users": ["operators", "incident_reviewers"],
  "operating_context": "Assists with operational summaries and runbook references. Output remains recommendation-only."
}
```

## task-scope.md

```md
intended task:
Assist with one bounded operations workflow by summarizing an alert, incident, or runbook context for human review.

in-scope behavior:
- summarize alert or incident context
- identify relevant runbook sections
- list possible next checks
- show missing evidence and uncertainty

out-of-scope behavior:
- execute remediation
- restart services
- change production configuration
- page external responders automatically
- claim operational recovery

success criteria:
- the output is traceable to runbook or monitoring evidence
- possible next checks are recommendation-only
- missing evidence is explicit
- final operational decision remains outside Guard
```

## action-boundary.yaml

```yaml
allowed_actions:
  - summarize alert context
  - identify runbook references
  - suggest next checks for human review
  - list missing evidence
prohibited_actions:
  - execute remediation
  - restart services
  - modify production configuration
  - page responders automatically
  - claim incident resolution
human_review_required: true
escalation_required: true
external_side_effects: none
```

## tools.yaml

```yaml
tools:
  - tool_id: runbook_reader
    tool_name: Runbook Reader
    tool_type: knowledge_lookup
    permitted_operations:
      - read selected runbook sections
      - return cited runbook references
    prohibited_operations:
      - execute runbook steps
      - write to production systems
      - create or resolve incidents
    requires_human_approval: false
    side_effect_level: none
```

## data-sources.yaml

```yaml
data_sources:
  - data_source_id: redacted_alert_summary
    data_source_name: Redacted Alert Summary
    data_category: operations_event
    access_mode: manual_upload
    sensitivity_level: internal
    retention_note: Store redacted or synthetic operational evidence only.
    usage_purpose: Provide review context for a bounded ops-agent workflow.
```

## review-standards.md

```md
review criteria:
- the report must show operational action boundaries
- the report must distinguish recommendations from production actions
- runbook evidence should be visible where available
- the report must not imply remediation authority
```

## snapshot.json

```json
{
  "snapshot_id": "snapshot-ops-agent-001",
  "version": "v1",
  "commit_sha": "REPLACE_WITH_INCIDENT_OR_RUNBOOK_VERSION",
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
  redacted-alert-summary.md
  runbook-references.md
  monitoring-summary.md
  operator-review-notes.md
```

## Run The Review Commands

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The generated JSON files are review artifacts for human inspection.

MindForge Guard does not approve, block, deploy, certify, or control execution.
