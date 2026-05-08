# v7.0 Single-Agent Governance Report 10-Minute Demo Path

## Scope

Internal demo path only.

## Demo Goal

Show how an AI-assisted change fixture becomes a governance-ready evidence report.

## Required Command

`node packages/guard/src/runGuard.mjs report single-agent --preview --json --fixture-file fixtures/single_agent_governance_report/ready_for_review.json`

## Suggested 10-Minute Flow

- minute 0-1: explain the input fixture and why it represents an AI-assisted change candidate
- minute 1-3: run the CLI preview command and show the JSON report output
- minute 3-5: inspect `action_summary`, `evidence_summary`, and `review_posture`
- minute 5-7: inspect `pre_v6_14_capability_foundation`
- minute 7-8: inspect `non_enforcement_boundary`
- minute 8-10: explain what the report supports and what it does not support

## Demo Postures

Use existing fixtures only:

- `fixtures/single_agent_governance_report/ready_for_review.json`
- `fixtures/single_agent_governance_report/needs_human_review.json`
- `fixtures/single_agent_governance_report/insufficient_evidence.json`

Suggested walkthrough:

- `ready_for_review`: show a report with sufficient evidence for ordinary human review
- `needs_human_review`: show ambiguity, drift, or risk signals that require closer inspection
- `insufficient_evidence`: show how the report stays bounded when supporting evidence is missing

## Review Posture Boundary

`review_posture` is:

- not approval
- not rejection
- not enforcement
- not a commit gate
- not a deployment gate
- not a merge gate

## Non-Enforcement Boundary

The report does not approve, reject, block, permit, commit, merge, deploy, or execute any change.

## Pre-v6.14 Foundation

The report references, but does not replace:

- `status` / `validate-policy`
- `audit`
- `snapshot`
- `action classify`
- `drift status` / `timeline` / `compare`
- `assoc correlate`
- `Risk v1` / `Spread Risk`
- `license` / `edition gate`
- verification chain

## What The Demo Supports

This demo helps a user understand:

- how a fixture-backed preview report is produced
- how evidence sections summarize an AI-assisted change
- how `review_posture` guides human review-readiness without making a decision
- how Pre-v6.14 capabilities remain visible as supporting evidence contributions
- how the report stays recommendation-only and non-executing

## What The Demo Does Not Support

This demo does not show:

- approval
- rejection
- enforcement
- workflow execution
- commit authority
- merge authority
- deployment authority
- GitHub Action implementation
- Marketplace behavior
- Multi-Agent behavior

## Explicit Non-Goals

- no commercial launch
- no README or current docs update
- no License Hub update
- no pricing update
- no `mindforge.run` update
- no release notes
- no GitHub Action
- no Marketplace
- no Multi-Agent
- no new verifier
- no CLI behavior change

## Next Phase

The next possible phase after this demo path is `Phase 5 commercial release gate review`.

Phase 5 must not begin until explicitly approved.
