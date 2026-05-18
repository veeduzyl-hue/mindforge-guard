# Evidence Pack Templates

These templates help external users convert one AI-assisted workflow into an Evidence Pack for MindForge Guard review.

They are copy-writing templates, not runtime authority grants. They do not contain production secrets, private customer data, legal conclusions, or deployment instructions.

## Templates

| Template | Use when the workflow is about |
|---|---|
| [AI Coding PR](./ai-coding-pr.md) | AI-assisted code changes, refactors, tests, or pull request preparation |
| [Support Agent](./support-agent.md) | Ticket triage, response drafting, customer knowledge-base answers, or escalation routing |
| [Ops Agent](./ops-agent.md) | Incident summaries, runbook lookup, alert triage, or operational recommendations |
| [Internal Workflow Agent](./internal-workflow-agent.md) | Internal intake, policy explanation, back-office routing, or workflow summaries |

## Recommended Folder Shape

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

After filling a pack, run:

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The report is a review artifact. The final human review decision remains outside Guard.

MindForge Guard does not approve, block, deploy, certify, or control execution.
