# v7.0 Onboarding & Evidence Pack Plan

## 1. Scope

- Planning only
- No public commercial surface change
- No current docs change
- No entitlement change
- No CLI implementation
- No schema / fixture / verifier change
- No GitHub Action implementation
- No Marketplace or Multi-Agent work

## 2. Problem Statement

Guard does not primarily lack governance capability.
Guard currently lacks a complete post-download product usage loop.

The missing loop is:
download / install -> choose use case -> prepare input materials -> run Guard -> generate report -> read result -> improve evidence -> CI / periodic review

## 3. Product Principle

Files in. Deterministic governance report out.

Guard should receive a file-based, versionable, auditable Evidence Pack.
Guard should output deterministic governance results and reports.
Guard should not become a chatbot, agent builder, dashboard, orchestrator, or control plane.

## 4. Single-Agent Governance Evidence Pack

Proposed minimum pack structure:

```text
single-agent-governance-pack/
  manifest.json
  agent-profile.json
  task-scope.md
  action-boundary.yaml
  data-sources.yaml
  tools.yaml
  review-standards.md
  evidence/
    sample-output.json
    run-record.json
  snapshot.json
```

| File | Purpose | Status | Feeds Report Generation | Missing Evidence Handling |
| --- | --- | --- | --- | --- |
| `manifest.json` | identifies pack version, pack type, and core pack metadata | required | yes | omission if missing because the pack loses stable identity |
| `agent-profile.json` | defines who the agent is, what role it serves, and basic ownership context | required | yes | omission if missing because the report cannot clearly attribute the workflow |
| `task-scope.md` | explains the intended workflow, task boundary, and use-case context | required | yes | omission if missing because intent and review scope become unclear |
| `action-boundary.yaml` | defines allowed and prohibited actions for the agent or workflow | required | yes | omission if missing because authority boundary cannot be summarized safely |
| `data-sources.yaml` | lists the data sources the workflow depends on and their usage context | required | yes | omission if missing because evidence provenance is incomplete |
| `tools.yaml` | lists the tools the workflow can use and the expected tool role | required | yes | omission if missing because execution context and dependency visibility are incomplete |
| `review-standards.md` | captures the review expectations, controls, or quality standards applied to the workflow | optional | yes | limitation if missing because the report can still run but review criteria stay less explicit |
| `evidence/sample-output.json` | provides one example result produced by the workflow | required | yes | omission if missing because output evidence is absent |
| `evidence/run-record.json` | records one concrete run or execution trace if available | optional | yes | limitation if missing because runtime evidence depth is lower |
| `snapshot.json` | captures version, environment, or comparison-ready state for future review | optional | yes | limitation if missing because drift observation and later comparison are weaker |

## 5. Evidence Pack Question Model

Three report-facing groups:

### Execution Readiness

- Who is the agent?
- What does it do?
- What actions are allowed?
- What actions are prohibited?
- What tools and data sources does it rely on?

### Accountability Evidence

- What did it produce?
- What evidence supports the result?
- Who owns the workflow?
- What evidence is missing?
- What limitations are known?

### Evolution / Drift Signals

- What version is being reviewed?
- Is there a snapshot?
- Is future comparison possible?
- Does the pack support drift observation?

## 6. Personal User First Report Flow

Minimum user path:

1. Install Guard
2. Create or copy an Evidence Pack
3. Fill minimum agent profile
4. Define allowed / prohibited actions
5. Add one sample output
6. Add one run record if available
7. Run report preview
8. Read omissions / limitations
9. Fill missing evidence
10. Optionally connect to CI later

This document does not claim that a specific onboarding or report command already exists in the repo.
If future command names are introduced later, they must be labeled as future candidate commands until separately implemented.

## 7. Enterprise Adoption Flow

Enterprise path:

1. Select one low-risk pilot Agent or AI workflow
2. Assign business owner, technical owner, review owner
3. Collect task scope, action boundary, tools, data sources, sample outputs, run records, standards, snapshot
4. Build Single-Agent Governance Evidence Pack
5. Run Guard locally or in CI
6. Review report across engineering / compliance / business
7. Track remediation items
8. Repeat periodically or during release review
9. Expand to more agents later

State:

- No production data required in first phase
- No replacement of Microsoft / ServiceNow / Feishu / DingTalk / enterprise workflow platforms
- Guard remains a sidecar evidence and governance report layer
- Guard does not automatically block deployment

## 8. Recommended Repo Work Breakdown

Staged plan:

- PR A: `docs/productization/v7_0_onboarding_evidence_pack_plan.md`
- PR B: `docs/productization/v7_0_single_agent_governance_pack_contract.md`
- PR C: `docs/productization/v7_0_first_report_and_enterprise_adoption_flow.md`
- PR D: `examples/single-agent-governance-pack/hr-self-service-agent/`
- PR E: `docs/productization/v7_0_report_reading_guide.md`
- PR F: `docs/productization/v7_0_ci_readiness_plan.md`

These are recommended future PRs only.
Do not create these files now.

## 9. What Not To Build Now

Explicitly blocked:

- Guard Chatbot
- Guard Web Assistant
- digital employee management backend
- agent builder
- low-code workflow platform
- agent marketplace
- enterprise control plane
- fleet inventory
- runtime enforcement
- production tool invocation
- automatic deployment blocking
- GitHub Action implementation
- public launch copy

## 10. Recommended Next Decision

Allowed decision values:

- hold_onboarding_pack
- prepare_evidence_pack_contract
- prepare_first_report_flow

Recommended:

- prepare_evidence_pack_contract

This only authorizes a future planning / contract document.
It does not authorize CLI implementation, schema changes, public docs, examples, or commercial surface edits.
