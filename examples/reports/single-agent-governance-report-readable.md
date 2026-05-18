# Human-Readable Single-Agent Governance Report Sample

This Markdown sample shows one way to hand off a generated Guard report to a human reviewer.

The JSON report remains the deterministic source artifact. This Markdown file is a readable summary pattern only. It does not replace `guard-single-agent-report.json`.

> Not an approval system. Not a blocker. Not a control plane.

## 1. Report Identity

| Field | Value |
|---|---|
| Report target | `single_agent_governance_report_preview_v1` |
| Evidence Pack | `hr-self-service-agent-pack` |
| Workflow type | Single-agent HR self-service workflow |
| Report purpose | Help a human reviewer inspect scope, authority boundary, evidence coverage, missing evidence, and risk/drift signals |

## 2. Reviewer Summary

The Evidence Pack describes a low-risk HR self-service workflow that summarizes synthetic handbook content. The pack states that the workflow should remain recommendation-only, should escalate ambiguous questions to a human HR channel, and should not access private employee records or trigger external side effects.

Recommended reviewer focus:

- confirm the task scope is narrow enough;
- confirm the allowed and prohibited actions are clear;
- inspect whether cited evidence supports the sample answer;
- record missing evidence before any operational reuse.

## 3. Authority Boundary

Allowed actions:

- summarize synthetic handbook content;
- explain handbook leave timing rules at a general policy level;
- point the requester to a human HR channel when confidence is limited.

Prohibited actions:

- finalize leave requests;
- change payroll information;
- access private employee records;
- make employment decisions;
- send messages to external systems.

Human review remains required. External side effects are listed as none.

## 4. Evidence Coverage

Evidence visible to the reviewer:

- agent profile;
- task scope;
- action boundary;
- data-source boundary;
- tool boundary;
- review standards;
- snapshot metadata;
- sample output and run evidence where present.

Evidence that may require reviewer follow-up:

- whether the handbook source is current;
- whether escalation rules match the organization's actual HR process;
- whether private employee data is excluded from the review packet;
- whether the workflow remains inside recommendation-only language in real use.

## 5. Risk And Drift Signals

Reviewers should inspect:

- scope drift: the workflow answering questions outside the described task scope;
- authority drift: outputs implying approval, final decisions, or execution authority;
- evidence drift: missing or stale handbook, prompt, tool, or run evidence;
- data drift: unexpected use of sensitive or private employee data.

## 6. Human Review Notes

Use this section to record reviewer observations.

```md
reviewer:
date:
packet reviewed:
questions:
missing evidence:
follow-up owner:
```

## 7. Handoff Packet

Attach these files when forwarding the report:

- Evidence Pack folder;
- `guard-pack-validate.json`;
- `guard-single-agent-report.json`;
- this Markdown summary if used;
- security review notes if the packet leaves the implementation team.

## Boundary

This Markdown summary does not approve, block, deploy, certify, guarantee legal compliance, or control execution.
