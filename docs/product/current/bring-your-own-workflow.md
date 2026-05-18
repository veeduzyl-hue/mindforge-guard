# Bring Your Own Workflow

Use this guide after the first sample report works locally. The goal is to turn one of your own AI-assisted workflows into a bounded Evidence Pack and generate a deterministic governance report that a human reviewer can read, reuse, and forward.

MindForge Guard remains a governance evidence layer for single-agent AI workflows.

> Not an approval system. Not a blocker. Not a control plane.

## What This Guide Helps You Do

This guide helps an external user move from the packaged sample path to a user-owned workflow path:

1. choose one AI-assisted workflow;
2. describe the workflow as an Evidence Pack;
3. validate the pack locally;
4. generate a governance report;
5. share the report with a human reviewer or design-partner contact.

The final human review decision remains outside Guard.

## Pick One Workflow First

Start with one workflow that is already observable and easy to explain.

Recommended first workflows:

| Workflow type | Best first use | Template |
|---|---|---|
| AI coding PR | AI-assisted code change, refactor, or test update | `examples/evidence-pack-templates/ai-coding-pr.md` |
| Support agent | Ticket triage, response drafting, or knowledge-base answer | `examples/evidence-pack-templates/support-agent.md` |
| Ops agent | Incident summary, runbook lookup, or operational recommendation | `examples/evidence-pack-templates/ops-agent.md` |
| Internal workflow agent | Back-office workflow summary, intake routing, or policy explanation | `examples/evidence-pack-templates/internal-workflow-agent.md` |

Avoid starting with workflows that directly modify production systems, trigger external side effects, or require private data to understand the first report.

## Evidence Pack Minimum Shape

Create a folder for your workflow pack. A practical first pack should include:

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

Use the packaged sample as the reference structure:

```bash
examples/single-agent-governance-pack/hr-self-service-agent
```

The first pack does not need production secrets, private customer data, or legal conclusions. Replace sensitive material with synthetic, redacted, or summary evidence where possible.

## Fill The Pack

Use these review questions as the minimum completion checklist.

### Agent profile

- What is the agent or AI-assisted workflow called?
- Who owns it from the business side?
- Who owns it technically?
- Who should review the report?
- Who uses the workflow?
- What is the intended operating context?

### Task scope

- What is in scope?
- What is out of scope?
- What should the workflow never do?
- What counts as enough evidence for human review?
- What known limitations should the reviewer see?

### Action boundary

- What actions are allowed?
- What actions are prohibited?
- Is human review required?
- Are there external side effects?
- Does the workflow remain recommendation-only?

### Tools and data sources

- Which tools are used?
- Which tool operations are permitted?
- Which tool operations are prohibited?
- Which data sources are read?
- What sensitivity level applies?
- What evidence is missing or intentionally omitted?

### Snapshot and evidence

- Which commit, run, ticket, prompt, or workflow version is represented?
- Which evidence files are attached?
- Which hashes, timestamps, or identifiers can help a reviewer reproduce the packet?
- What evidence is intentionally redacted?

## Validate And Generate

After filling the pack, run:

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The JSON report is the deterministic review artifact. Human-readable summaries or Markdown handoffs should preserve the JSON report as the source artifact.

For a Markdown handoff model, see:

- `examples/reports/single-agent-governance-report-readable.md`

## Optional GitHub Actions Path

To let an external repository generate review artifacts manually, copy:

```text
examples/github-actions/bring-your-own-governance-report.yml
```

into:

```text
.github/workflows/mindforge-guard-governance-report.yml
```

The workflow is `workflow_dispatch` only. It uploads report artifacts for human inspection. It does not approve, block, deploy, certify, or control execution.

## Review Packet To Share

A complete first user-owned workflow review packet should include:

- the Evidence Pack folder;
- `guard-pack-validate.json`;
- `guard-single-agent-report.json`;
- optional Markdown summary;
- known missing evidence;
- questions for the reviewer;
- security review notes if the packet is shared outside the implementation team.

For security review preparation, see:

- [Security Review Packet v1](./security-review-packet-v1.md)

## Design Partner Feedback Loop

Use the design-partner walkthrough when sharing the first external workflow report:

- [Design Partner Workflow Walkthrough](./design-partner-workflow-walkthrough.md)

Good feedback should identify where the Evidence Pack was easy to fill, where report interpretation was unclear, and which missing evidence should become a better template field.

## Boundary

This guide is docs-and-examples only. It does not change pricing, checkout, License Hub behavior, license API behavior, entitlement, runtime authority, or CLI command semantics.

MindForge Guard does not approve, block, deploy, certify, guarantee legal compliance, or control execution.
