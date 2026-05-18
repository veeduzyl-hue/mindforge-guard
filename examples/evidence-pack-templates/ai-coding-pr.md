# Evidence Pack Template: AI Coding PR

Use this template for a single AI-assisted coding workflow, such as a pull request draft, refactor, test update, dependency review, or code-generation task.

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
# AI Coding PR Evidence Pack

This pack describes one AI-assisted coding workflow for governance review. It uses redacted or synthetic evidence where needed. It does not grant merge authority, production authority, or approval authority.
```

## manifest.json

```json
{
  "pack_id": "ai-coding-pr-pack",
  "pack_version": "v1",
  "pack_type": "single_agent_governance_pack_preview",
  "created_at": "YYYY-MM-DDTHH:MM:SSZ",
  "updated_at": "YYYY-MM-DDTHH:MM:SSZ",
  "owner": "technical_owner_engineering",
  "source_repo": "owner/repo",
  "report_target": "single_agent_governance_report_preview_v1"
}
```

## agent-profile.json

```json
{
  "agent_id": "ai-coding-pr-agent",
  "agent_name": "AI Coding PR Agent",
  "agent_type": "single_agent",
  "business_owner": "engineering_manager_or_product_owner",
  "technical_owner": "repository_owner",
  "review_owner": "code_reviewer_or_governance_reviewer",
  "intended_users": ["developers", "code_reviewers"],
  "operating_context": "Assists with code change preparation and review evidence. Output remains recommendation-only."
}
```

## task-scope.md

```md
intended task:
Assist with one bounded code change or pull request preparation task.

in-scope behavior:
- summarize intended code change
- identify touched files
- explain tests or checks run
- list assumptions and missing evidence
- prepare reviewer notes

out-of-scope behavior:
- merge pull requests
- modify production systems
- bypass review
- claim production readiness

success criteria:
- the proposed change is traceable to issue, prompt, or task context
- test and review evidence is visible
- missing evidence is explicit
- output remains recommendation-only
```

## action-boundary.yaml

```yaml
allowed_actions:
  - summarize proposed code changes
  - identify changed files and test evidence
  - prepare reviewer notes
  - point to missing evidence
prohibited_actions:
  - merge pull requests
  - approve pull requests
  - modify repository settings
  - bypass required human review
human_review_required: true
escalation_required: true
external_side_effects: none
```

## tools.yaml

```yaml
tools:
  - tool_id: repository_reader
    tool_name: Repository Reader
    tool_type: code_context
    permitted_operations:
      - read selected files
      - summarize diffs
      - inspect test outputs
    prohibited_operations:
      - push commits
      - merge pull requests
      - change repository settings
    requires_human_approval: false
    side_effect_level: none
```

## data-sources.yaml

```yaml
data_sources:
  - data_source_id: pull_request_context
    data_source_name: Pull Request Context
    data_category: code_review
    access_mode: read_only_or_manual_upload
    sensitivity_level: internal
    retention_note: Store redacted review evidence only where needed.
    usage_purpose: Provide review context for a bounded AI-assisted code workflow.
```

## review-standards.md

```md
review criteria:
- the report must show task scope and action boundary
- the report must show changed-file or test evidence where available
- the report must identify missing evidence
- the report must not imply approval, merge authority, or production authority
```

## snapshot.json

```json
{
  "snapshot_id": "snapshot-ai-coding-pr-001",
  "version": "v1",
  "commit_sha": "REPLACE_WITH_COMMIT_OR_PR_SHA",
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
  prompt-or-task-summary.md
  redacted-diff-summary.md
  test-output-summary.md
  reviewer-notes.md
```

## Run The Review Commands

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The generated JSON files are review artifacts for human inspection.

MindForge Guard does not approve, block, deploy, certify, or control execution.
