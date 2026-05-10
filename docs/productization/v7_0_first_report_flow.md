# v7.0 First Report Flow

## 1. Scope

- Planning / draft flow only
- No public current docs change
- No canonical contract change
- No schema / fixture / verifier change
- No CLI change
- No example implementation
- No GitHub Action implementation
- No edition entitlement change
- No public commercial surface change
- No launch execution
- No compliance checker
- No approval / blocking semantics

## 2. Purpose

This flow defines the minimum path for a user to understand how a first v7.0 Single-Agent Governance Report should be prepared, generated, read, and improved.

It is intended to bridge:

- Evidence Pack contract
- Pack schema preview
- Report reading guide
- future example pack
- future user-facing documentation

It does not claim that any new onboarding command, report command, example pack, or GitHub Action already exists unless separately implemented.

## 3. Target User

| User Type | Starting Point | Primary Need | Flow Output | Non-Goal |
| --- | --- | --- | --- | --- |
| Individual Developer | Has an AI agent, AI-assisted repo, or AI workflow | Generate and understand the first governance report | first evidence-backed report draft and evidence gap list | approval, deployment safety, compliance certification |
| Technical Team | Has a repo, workflow, or agent prototype under review | Prepare evidence for review and repeatable inspection | reviewable Evidence Pack and deterministic report artifact | CI blocking, merge gate, runtime enforcement |
| Enterprise Pilot Team | Has one low-risk pilot agent or AI workflow | Coordinate business / technical / governance review | pilot review package and remediation list | control plane, orchestrator, legal compliance conclusion |

## 4. First Report Flow Overview

1. Choose one agent or AI workflow
2. Identify the review purpose
3. Prepare a minimum Evidence Pack
4. Check required files and required fields
5. Run available Guard validation / report preview path where implemented
6. Read the report using the three-layer reading view
7. Inspect omissions, limitations, and findings
8. Assign next human owner
9. Improve evidence
10. Repeat the report review
11. Optionally prepare for future CI / PR review

Do not invent current CLI commands.
If command names are mentioned, label them as future candidate commands.

## 5. Minimum Evidence Pack For First Report

Use the candidate pack structure from `v7_0_single_agent_governance_pack_contract.md`:

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

Required for first report:

- `manifest.json`
- `agent-profile.json`
- `task-scope.md`
- `action-boundary.yaml`
- `data-sources.yaml`
- `tools.yaml`
- `evidence/sample-output.json`

Recommended for first report:

- `review-standards.md`
- `evidence/run-record.json`
- `snapshot.json`

Missing required materials should become omissions.
Missing recommended materials should become limitations.
Neither omissions nor limitations are enforcement actions.

## 6. Step-by-Step First Report Preparation

### 6.1 Choose Review Target

Choose one bounded agent or workflow that is:

- low-risk
- clearly scoped
- has sample outputs
- has identifiable owner
- does not require production data for first review

### 6.2 Define Intended Scope

In `task-scope.md`, describe:

- intended task
- in-scope behavior
- out-of-scope behavior
- success criteria
- known limitations

### 6.3 Define Authority Boundary

In `action-boundary.yaml`, define:

- allowed actions
- prohibited actions
- human review required
- escalation required
- external side effects

This defines review context.
It does not grant execution authority.

### 6.4 Add Data And Tool Context

- `data-sources.yaml` should identify data categories, access mode, sensitivity, usage purpose
- `tools.yaml` should identify permitted operations, prohibited operations, human approval needs, side-effect level

This is evidence for review, not runtime control.

### 6.5 Add Output Evidence

- `evidence/sample-output.json` provides one representative output
- `evidence/run-record.json` is recommended if available
- `snapshot.json` is recommended for drift / future comparison

### 6.6 Run Available Validation / Preview

Current flow should use only commands already implemented in repo.
Future candidate commands may be described only as candidates.

Future candidate command names, if later approved, may include:

- `guard pack validate --pack ./single-agent-governance-pack`
- `guard report single-agent --pack ./single-agent-governance-pack --preview`

But this document does not claim those commands currently exist.

## 7. How To Read The First Report

Use the three-layer view:

### Authority / Permission Boundary

Reviewer asks:

- What was the intended task?
- What authority boundary was visible?
- What was proposed?
- What does the report explicitly not authorize?

### Execution / Behavior Evidence

Reviewer asks:

- What happened?
- What evidence supports the report?
- Are receipts, provenance, or deterministic hashes available?
- Is behavior traceable enough for review?

### Risk / Drift / Maturity Signals

Reviewer asks:

- What risk signals appear?
- What drift signals appear?
- What evidence is missing?
- What maturity or readiness signal should guide review?

These are review questions, not approval gates.

## 8. First Report Output Expectations

Expected outputs, conceptually, are:

- machine-readable report artifact where available
- human-readable report view where available
- omissions / limitations / findings
- deterministic hash or receipt references where available
- next human review focus
- evidence improvement list

Do not promise markdown output or new report format unless implemented.

## 9. Evidence Improvement Loop

1. Read omissions
2. Read limitations
3. Identify missing required files or fields
4. Add evidence
5. Re-run validation / preview
6. Compare whether findings become more reviewable
7. Preserve artifacts for future drift / lineage review

Improving evidence does not automatically approve the workflow.
It only improves reviewability.

## 10. Enterprise First Pilot Flow

1. Select one low-risk pilot
2. Assign business owner, technical owner, governance reviewer
3. Prepare Evidence Pack
4. Run local validation / report preview
5. Review across business / technical / governance
6. Convert omissions and findings into remediation items
7. Repeat on next version
8. Later decide whether to connect to CI / release review

No production data required in the first phase.
Guard does not replace Microsoft / ServiceNow / Feishu / DingTalk / enterprise workflow platforms.
Guard remains a sidecar evidence and governance report layer.

## 11. Blocked Interpretations

Explicitly blocked:

- approval
- blocking
- permit / deny authority
- safe-to-merge
- safe-to-deploy
- compliance certification
- legal compliance conclusion
- maturity certification
- policy enforcement
- runtime control plane
- orchestrator
- production tool invocation
- autonomous execution

## 12. Future Work Not Authorized By This Document

- public first-report documentation
- example Evidence Pack
- CLI pack parser
- CLI report command wiring
- JSON schema hardening
- markdown report output
- GitHub Action wrapper
- Marketplace work
- edition entitlement changes
- License Hub changes
- pricing changes
- mindforge.run changes

## 13. Recommended Next Decision

Allowed values:

- hold_first_report_flow
- prepare_example_evidence_pack
- prepare_pack_parser_plan
- prepare_ci_readiness_plan

Recommended:

- prepare_example_evidence_pack

This only authorizes a future planning or draft example pack proposal.
It does not authorize public docs, CLI changes, GitHub Actions, Marketplace work, entitlement changes, or commercial surface edits.
