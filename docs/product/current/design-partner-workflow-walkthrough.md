# Design Partner Workflow Walkthrough

Use this walkthrough when asking an external evaluator, internal sponsor, or design partner to test MindForge Guard with one real AI-assisted workflow.

The goal is to learn whether the Evidence Pack and governance report are understandable, reusable, and useful for human review.

> Not an approval system. Not a blocker. Not a control plane.

## Recommended Walkthrough

1. Pick one bounded workflow.
2. Copy the closest Evidence Pack template.
3. Replace private or sensitive evidence with synthetic, redacted, or summary evidence.
4. Run local validation and report generation.
5. Share the report packet with a human reviewer.
6. Capture where the reviewer was confused, blocked, or asked for more evidence.

## What To Send

A useful design-partner packet should include:

- workflow type;
- Evidence Pack folder;
- `guard-pack-validate.json`;
- `guard-single-agent-report.json`;
- optional Markdown summary;
- known missing evidence;
- reviewer questions;
- security review notes if needed.

Do not send production secrets, private customer records, access tokens, raw credentials, or data that the recipient should not review.

## Feedback Questions

Ask the reviewer:

- Could you understand what the workflow is allowed to do?
- Could you understand what the workflow is not allowed to do?
- Was the evidence enough to review the workflow?
- Which evidence was missing?
- Which report sections were unclear?
- Would this packet be useful in your current AI-assisted workflow review process?
- What would need to change before you could reuse this packet with another team?

## Adoption Signals

Strong adoption signals:

- the reviewer can explain the workflow boundary after reading the packet;
- missing evidence becomes visible instead of hidden;
- the team can reuse the same pack structure for another workflow;
- the packet can be forwarded without extra explanation.

Weak adoption signals:

- the reviewer cannot tell what the workflow does;
- action boundaries are too vague;
- evidence is scattered outside the pack;
- the report is treated as an approval rather than review evidence;
- sensitive information must be removed manually after the packet is generated.

## Response Template

```md
workflow reviewed:
template used:
time to first pack:
time to first report:
most useful section:
least clear section:
missing evidence:
security concern:
next workflow to try:
```

## Boundary

This walkthrough is for adoption feedback only. It does not change pricing, checkout, License Hub behavior, license API behavior, entitlement, runtime authority, or CLI command semantics.

MindForge Guard does not approve, block, deploy, certify, guarantee legal compliance, or control execution.
