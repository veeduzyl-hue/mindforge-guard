# v7.0 CI Readiness Plan

## 1. Scope

- Planning only
- No GitHub Action implementation
- No workflow files
- No action.yml
- No CLI changes
- No parser implementation
- No schema / fixture / verifier changes
- No public docs change
- No commercial surface change
- No entitlement change
- No CI blocking / merge gate / deployment gate

## 2. Purpose

This plan defines how `v7.0` report, Evidence Pack contract, pack schema preview, report reading guide, first report flow, and example evidence pack can prepare for future CI / PR review integration.

It does not implement CI behavior.

## 3. CI Readiness Principle

Guard may produce deterministic governance evidence for review.
Guard must not become the merge authority, deployment authority, approval authority, or runtime control plane.

CI integration should be:

- sidecar
- deterministic
- evidence-producing
- non-executing
- recommendation-only
- default-off
- human-review-oriented

## 4. Candidate CI Review Flow

1. Developer prepares Evidence Pack
2. Repository includes or references the pack
3. CI validates pack shape
4. CI runs Guard report preview where implemented
5. CI stores machine-readable output
6. CI stores human-readable summary where implemented
7. Reviewer reads report using three-layer reading view
8. Human reviewer decides next action outside Guard

This flow is a candidate future workflow.
It is not implemented by this PR.

## 5. CI Inputs

Future CI may read:

- Single-Agent Governance Evidence Pack
- pack manifest
- agent profile
- action boundary
- data sources
- tools
- sample output
- run record
- snapshot
- existing report fixtures
- example evidence pack

CI inputs are evidence artifacts.
They are not authority grants.

## 6. CI Outputs

Future CI may produce:

- validation result
- omissions
- limitations
- findings
- deterministic hash
- report artifact
- reviewer summary
- evidence improvement suggestions

CI outputs are review artifacts.
They are not approval, rejection, merge permission, deployment permission, or compliance certification.

## 7. GitHub Actions Readiness Boundary

A future GitHub Actions wrapper may be considered later, but this phase does not implement it.

Explicitly blocked:

- no `.github/workflows`
- no `action.yml`
- no Marketplace publication
- no CI blocking
- no required status check
- no merge gate
- no deployment gate

## 8. PR Review Integration Candidate

Future PR review may surface:

- Is an Evidence Pack present?
- Are required files present?
- Are required fields present?
- What omissions were found?
- What limitations remain?
- What report sections are reviewable?
- Which human owner should review next?

Blocked interpretation:

- PR approved
- PR rejected
- safe to merge
- safe to deploy
- legally compliant
- certified mature

## 9. Edition Fit

Community:

- local evidence visibility
- no CI bundle promise

Pro:

- single-agent review readiness
- no approval or deployment safety promise

Pro+:

- PR / CI governance bundle candidate
- no launched GitHub Action or CI blocking promise

Enterprise:

- evidence package / retention / policy hierarchy candidate
- no control plane or orchestrator promise

## 10. Future Implementation Candidates

Future candidates only:

- pack parser plan
- pack validation CLI
- report preview command wiring
- markdown summary output
- CI artifact output format
- GitHub Action wrapper
- GitHub Marketplace readiness
- docs/product/current CI guide

Each item must be separately approved.

## 11. Acceptance Criteria

- no CLI changes
- no parser implementation
- no workflow files
- no action.yml
- no GitHub Action implementation
- no Marketplace work
- no schema / fixture / verifier changes
- no public docs changes
- no commercial surface changes
- no entitlement changes
- no approval / blocking / safe-to-merge / safe-to-deploy claim
- no compliance / certification claim
- CI remains sidecar, deterministic, evidence-producing, recommendation-only, non-executing, and default-off

## 12. Prohibited Changes

Explicitly prohibited:

- adding GitHub Action
- adding `action.yml`
- adding `.github/workflows/*`
- making Guard a required status check
- adding CI blocking logic
- adding merge gate
- adding deployment gate
- changing CLI behavior
- changing schemas / fixtures / verifiers
- changing entitlement / pricing / License Hub
- changing README / current docs / public demos / release notes / mindforge.run
- adding compliance checker
- adding legal compliance module
- adding maturity certification
- adding runtime control plane

## 13. Recommended Next Decision

Allowed values:

- hold_ci_readiness_plan
- prepare_pack_parser_plan
- prepare_github_action_readiness_plan
- prepare_public_docs_candidate

Recommended:

- prepare_pack_parser_plan

This only authorizes a future planning document for pack parser design.
It does not authorize CLI implementation, GitHub Action work, Marketplace work, entitlement changes, compliance claims, or commercial surface edits.
