# Trial Launch Pack

## Who Should Use This

Use this packet when inviting a design partner, external evaluator, internal sponsor, or reviewer to try MindForge Guard with one real AI-assisted workflow.

## What You Will Try

You will:

- pick one bounded workflow;
- build one Evidence Pack;
- run Guard locally to generate deterministic review artifacts;
- prepare a reviewer handoff packet;
- return adoption feedback.

Trial output is review evidence, not approval evidence.

## Timebox

Recommended first trial timebox:

- 30-60 minutes to choose and scope the workflow;
- 30-60 minutes to fill the first Evidence Pack;
- 15-30 minutes to run Guard and prepare the handoff packet;
- 15-30 minutes to complete the feedback form.

## Step 1: Pick One Workflow

Choose one AI-assisted workflow that is easy to describe and safe to share with synthetic, redacted, or summary evidence.

## Step 2: Use The Scorecard

Use the [Workflow Selection Scorecard](./workflow-selection-scorecard.md) to decide whether the workflow is a good first trial.

## Step 3: Build Your Evidence Pack

Follow [Bring Your Own Workflow](./bring-your-own-workflow.md) and start from the packaged templates in [Evidence Pack Templates](../../../examples/evidence-pack-templates/README.md).

## Step 4: Run Guard Locally

Run:

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

The JSON report remains the deterministic source artifact.

## Step 5: Prepare The Handoff Packet

Use the [Report Handoff Checklist](./report-handoff-checklist.md) to prepare the reviewer packet.

If useful, add a human-readable Markdown summary after the JSON report is generated.

## Step 6: Share Feedback

Complete the [Adoption Feedback Form](./adoption-feedback-form.md) after the reviewer sees the packet.

## Trial Packet Links

- [Workflow Selection Scorecard](./workflow-selection-scorecard.md)
- [Bring Your Own Workflow](./bring-your-own-workflow.md)
- [Evidence Pack Templates](../../../examples/evidence-pack-templates/README.md)
- [Report Handoff Checklist](./report-handoff-checklist.md)
- [Adoption Feedback Form](./adoption-feedback-form.md)
- [Security Review Packet v1](./security-review-packet-v1.md)

## What To Send Back

Send back:

- the Evidence Pack folder;
- `guard-pack-validate.json`;
- `guard-single-agent-report.json`;
- optional Markdown summary;
- known missing evidence;
- completed adoption feedback form;
- security review notes if needed.

## Security Rules

Do not share secrets, credentials, tokens, or private keys.

Use synthetic, redacted, or summary evidence for sensitive material.

## Boundary

Guard does not approve, block, deploy, certify, guarantee legal compliance, or control execution.
