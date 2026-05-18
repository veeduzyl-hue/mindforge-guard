# Evidence Pack Template: Support Agent

Use this template for a single support workflow, such as ticket triage, draft response preparation, knowledge-base answer generation, or escalation routing.

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
# Support Agent Evidence Pack

This pack describes one support-agent workflow for governance review. It uses synthetic, redacted, or summary ticket evidence. It does not send customer messages, resolve tickets, or grant approval authority.
```

## manifest.json

```json
{
  "pack_id": "support-agent-pack",
  "pack_version": "v1",
  "pack_type": "single_agent_governance_pack_preview",
  "created_at": "YYYY-MM-DDTHH:MM:SSZ",
  "updated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "owner": "support_operations_owner",
  "source_repo": "support-workflow-or-ticket-system",
  "report_target": "single_agent_governance_report_preview_v1"
}
```

## agent-profile.json

```json
{
  "agent_id": "support-agent",
  "agent_name": "Support Agent",
  "agent_type": "single_agent",
  "business_owner": "support_lead",
  "technical_owner": "support_platform_owner",
  "review_owner": "support_quality_reviewer",
  "intended_users": ["support_agents", "support_reviewers"],
  "operating_context": "Assists with support triage and draft response preparation. Output remains recommendation-only."
}
```

## task-scope.md

```md
intended task:
Assist with one bounded support workflow by summarizing ticket context, suggesting response drafts, or identifying escalation needs.

in-scope behavior:
- summarize a redacted ticket
- draft a response for human review
- identify knowledge-base references
- recommend escalation when confidence is limited

out-of-scope behavior:
- send customer messages
- close tickets
- change customer account state
- access unnecessary private data
- make refund or service entitlement decisions

success criteria:
- the draft is traceable to approved support material
- uncertainty is visible
- escalation conditions are explicit
- output remains recommendation-only
```

## action-boundary.yaml

```yaml
allowed_actions:
  - summarize redacted ticket context
  - draft support response for human review
  - identify knowledge-base references
  - recommend escalation
prohibited_actions:
  - send customer messages
  - close tickets
  - change account state
  - issue refunds
  - promise service outcomes
human_review_required: true
escalation_required: true
external_side_effects: none
```

## tools.yaml

```yaml
tools:
  - tool_id: knowledge_base_reader
    tool_name: Knowledge Base Reader
    tool_type: knowledge_lookup
    permitted_operations:
      - read approved support articles
      - return article references
    prohibited_operations:
      - modify support articles
      - write to ticket system
      - message customers
    requires_human_approval: false
    side_effect_level: none
```

## data-sources.yaml

```yaml
data_sources:
  - data_source_id: redacted_ticket_summary
    data_source_name: Redacted Ticket Summary
    data_category: support_ticket
    access_mode: manual_upload
    sensitivity_level: internal
    retention_note: Store redacted or synthetic ticket details only.
    usage_purpose: Provide review context for a bounded support-agent workflow.
```

## review-standards.md

```md
review criteria:
- the report must show the support action boundary
- the draft must be traceable to knowledge-base evidence
- uncertainty and escalation conditions must be visible
- the report must not imply ticket closure or customer-message authority
```

## snapshot.json

```json
{
  "snapshot_id": "snapshot-support-agent-001",
  "version": "v1",
  "commit_sha": "REPLACE_WITH_TICKET_OR_WORKFLOW_VERSION",
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
  redacted-ticket-summary.md
  knowledge-base-references.md
  draft-response.md
  escalation-notes.md
```

## Run The Review Commands

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The generated JSON files are review artifacts for human inspection.

MindForge Guard does not approve, block, deploy, certify, or control execution.
