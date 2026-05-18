# Design Partner Trial Kit

## Purpose

Provide a complete external trial flow that helps a design partner test MindForge Guard with one real AI-assisted workflow and return structured adoption feedback.

This trial is for adoption feedback, not certification.

## Who This Trial Is For

Use this kit with:

- external design partners;
- internal sponsors testing one external-facing workflow;
- reviewers who want to evaluate whether Guard is usable as review evidence;
- teams that can share synthetic, redacted, or summary evidence.

## What The Trial Tests

The trial tests whether a partner can:

- choose one bounded AI-assisted workflow;
- fill an Evidence Pack without extra explanation;
- generate a JSON governance report;
- prepare a readable handoff packet for human review;
- return clear feedback about adoption friction.

JSON report is the deterministic source artifact.

Markdown summary is a human-readable handoff layer.

## Trial Workflow

1. Choose one AI-assisted workflow
2. Pick the closest Evidence Pack template
3. Fill the Evidence Pack with synthetic, redacted, or summary evidence
4. Run local validation
5. Generate JSON governance report
6. Optional: prepare Markdown handoff summary
7. Share report packet with reviewer
8. Return feedback

## Trial Inputs

Prepare:

- one bounded workflow description;
- one chosen Evidence Pack template;
- a reviewer or design-partner contact;
- synthetic, redacted, or summary evidence;
- known missing evidence notes.

Do not share secrets, credentials, tokens, or private keys.

## Required Commands

Run:

```bash
guard pack validate --pack my-workflow-pack --preview --json > guard-pack-validate.json
guard report single-agent --pack my-workflow-pack --preview --json > guard-single-agent-report.json
```

If a human-readable handoff is useful, add an optional Markdown summary after the JSON report is generated.

## What To Send Back

Return:

- the Evidence Pack folder;
- `guard-pack-validate.json`;
- `guard-single-agent-report.json`;
- optional Markdown summary;
- known missing evidence;
- security review notes when needed;
- completed adoption feedback form.

## Success Signals

Strong trial signals:

- the workflow boundary is understandable to a human reviewer;
- the Evidence Pack is fillable without special tooling;
- the JSON report is useful as review evidence;
- the Markdown handoff is useful when forwarding the packet;
- the team can identify one next workflow to trial.

## Weak Signals

Weak trial signals:

- the workflow is too broad to describe clearly;
- the reviewer cannot tell what is allowed or prohibited;
- sensitive evidence cannot be redacted safely;
- the packet is mistaken for approval evidence;
- adoption feedback cannot identify the next improvement.

## Security / Redaction Rules

Use synthetic, redacted, or summary evidence for sensitive material.

Do not require a participant to submit production secrets, credentials, tokens, private keys, or unauthorized private records.

## Boundary

This trial kit preserves Guard as a review-evidence layer for adoption feedback only.

MindForge Guard does not approve, block, deploy, certify, guarantee legal compliance, or control execution.
