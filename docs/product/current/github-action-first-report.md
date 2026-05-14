# GitHub Action: First Governance Report

Use this workflow to run MindForge Guard in GitHub Actions and generate a deterministic governance report artifact for human review.

This GitHub Action is manually triggered and non-blocking. It does not approve, block, deploy, certify, or control execution.

## Current State

PR #251 added this repo-local GitHub Actions workflow as a bounded first-report demo.

That closeout is now complete:

- PR #251 is merged on `main`
- manual workflow_dispatch run #1 succeeded
- the workflow remains `workflow_dispatch` only
- the workflow installs `@veeduzyl/mindforge-guard@7.0.1`
- the workflow generates review artifacts and uploads them for human inspection

This validates repo-local GitHub Actions readiness for the first governance report path.

It does not create a reusable GitHub Marketplace Action.

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

## Repo Workflow vs Marketplace Action

This file documents a repository-local workflow under `.github/workflows/`.

That means it lives inside this repository and is triggered for this repository.

A GitHub Marketplace Action is different. It would need a reusable Action package such as `action.yml`, defined inputs and outputs, versioning, and a distribution path that lets other repositories call it with `uses:`.

The current state proves that Guard can install, run, and upload deterministic review artifacts in GitHub Actions.

It does not yet package Guard as a reusable Marketplace Action for other repositories.

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

Do not use this workflow to require repository changes, control merges, control deployments, substitute for certification, or enforce runtime behavior.

Future teams may adapt the pattern for broader CI reporting, but that should remain separate from Guard's runtime authority boundary unless a later release explicitly changes the contract.

For closeout notes and future GitHub Marketplace Action planning, see [GitHub Marketplace Action Feasibility](./marketplace-action-feasibility.md).
