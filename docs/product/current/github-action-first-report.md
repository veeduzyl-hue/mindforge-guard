# GitHub Action: First Governance Report

Use this workflow to run MindForge Guard in GitHub Actions and generate a deterministic governance report artifact for human review.

This GitHub Action is manually triggered and non-blocking. It does not approve, block, deploy, certify, or control execution.

## What This Workflow Does

The workflow validates the sample single-agent Evidence Pack and generates a first governance report artifact in GitHub Actions.

It runs the same first-report path documented for local use:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
guard --version
guard --help
guard pack validate --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
guard report single-agent --pack examples/single-agent-governance-pack/hr-self-service-agent --preview --json
```

## What It Does Not Do

This workflow is not an approval gate, not a blocker, not a deployment gate, and not a runtime control plane.

It does not claim that a change is safe to deploy.

It does not provide a legal compliance guarantee, compliance certification, or maturity certification.

It does not change Guard runtime semantics, CLI command semantics, licensing semantics, checkout behavior, entitlement, or release boundaries.

## How To Run It

1. Open the repository in GitHub.
2. Go to **Actions**.
3. Select **MindForge Guard First Governance Report**.
4. Choose **Run workflow**.
5. Download the uploaded artifact after the run completes.

The workflow is `workflow_dispatch` only. It is intentionally not attached to `push` or `pull_request` by default.

## What Artifacts It Uploads

The workflow uploads two review artifacts:

- `guard-pack-validate.json`
- `guard-single-agent-report.json`

These files are deterministic review artifacts for a human reviewer to inspect.

## How To Read The Report

Read `guard-single-agent-report.json` through these review layers:

- authority boundaries
- execution evidence
- missing evidence
- risk/drift signals

The report is a review artifact. Final review decisions happen outside Guard.

## Product Boundary

MindForge Guard remains recommendation-only, additive-only, non-executing, default-off where applicable, non-control-plane, deterministic, local-first where applicable, and human-review-oriented.

The GitHub Action preserves that boundary. It runs Guard commands, writes JSON files, and uploads those files as review artifacts.

It does not approve, block, deploy, certify, or control execution.

## When To Use This

Use this workflow when a team wants a quick GitHub-hosted walkthrough of the first governance report path before deciding how to operationalize Guard locally or in CI.

It is useful for evaluation, onboarding, internal demonstration, and first-review packet generation.

## When Not To Use This

Do not use this workflow as a required check, merge gate, deployment control, certification substitute, or runtime enforcement path.

Future teams may adapt the pattern for broader CI reporting, but that should remain separate from Guard's runtime authority boundary unless a later release explicitly changes the contract.
