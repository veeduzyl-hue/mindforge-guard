# GitHub Marketplace Action Feasibility

## 1. Current State

PR #251 added a repo-local GitHub Actions workflow for the first governance report path.

That workflow:

- is `workflow_dispatch` only
- has already completed a successful manual run
- installs `@veeduzyl/mindforge-guard@7.0.1`
- runs the first governance report commands
- uploads `guard-pack-validate.json`
- uploads `guard-single-agent-report.json`

This closes the v7.0.1 repo-local GitHub Action readiness step.

It is not a GitHub Marketplace Action.

## 2. Difference Between Repo Workflow and Marketplace Action

The current implementation is a repository-local workflow under `.github/workflows/*.yml`.

It is owned by this repository, runs in this repository, and serves as a manually triggered review-artifact demo for this repository.

A GitHub Marketplace Action is different.

It requires reusable Action packaging such as `action.yml`, a composite action or JavaScript action shape, versioned invocation, input/output contracts, branding, listing-ready copy, and a distribution path that lets other repositories call it through `uses:`.

The current workflow proves GitHub-hosted execution readiness.

It does not create a reusable Action package for other repositories.

## 3. Why Marketplace Action May Be Useful

A future Marketplace Action may be useful because it could:

- lower adoption friction
- let other repositories generate first governance reports without copying workflow YAML
- create a clearer GitHub-native distribution path
- make Guard easier to evaluate in buyer environments

## 4. Why Not Implement Immediately

Marketplace Action packaging should not be implemented immediately because it still needs bounded design work around:

- risk of being misunderstood as an approval gate, blocker, required check, or deployment control path
- input and output boundary design
- versioning strategy
- artifact naming contract
- README and Marketplace copy that stays recommendation-only and review-artifact-only
- consumer examples that remain default-off and human-review-oriented

## 5. Required Product Boundary

Any future GitHub Marketplace Action must preserve the Guard product boundary:

- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- non-control-plane
- deterministic
- local-first where applicable
- human-review-oriented
- does not approve, block, deploy, certify, or control execution
- not an approval system
- not a blocking system
- not a deployment gate
- not a runtime control plane
- no safe-to-deploy claim
- no legal compliance guarantee
- no compliance certification
- no maturity certification
- no extra runtime authority for Enterprise

Marketplace packaging must not change `audit`, `permit`, `classify`, `drift`, or `license` semantics.

It must not change deny exit code `25`.

It must not introduce extra runtime authority, hidden enforcement, or control-plane drift.

## 6. Possible Future Marketplace Action Shape

If pursued later, the minimal shape should stay narrow and explicit.

One possible future design is a composite action that wraps:

```bash
npm install -g @veeduzyl/mindforge-guard@7.0.1
guard pack validate --pack <pack_path> --preview --json > <output_dir>/guard-pack-validate.json
guard report single-agent --pack <pack_path> --preview --json > <output_dir>/guard-single-agent-report.json
```

Possible inputs:

- `pack_path`
- `output_dir`
- `guard_version`

Possible outputs or uploaded artifacts:

- `guard-pack-validate.json`
- `guard-single-agent-report.json`

Default behavior must remain:

- generate artifacts only
- no merge blocking
- no deploy control
- no approval output

## 7. Recommended Future PR Sequence

The smallest safe future sequence is:

1. PR A: Marketplace Action PRD or contract doc only
2. PR B: prototype composite action under an explicitly experimental path
3. PR C: verifier plus example consumer workflow
4. PR D: Marketplace listing copy review
5. PR E: publish or listing only after explicit approval

Each PR should preserve unchanged runtime semantics and keep Marketplace packaging separate from runtime authority.

## 8. Decision Recommendation

Recommendation:

- do not implement GitHub Marketplace Action during v7.0.1 closeout
- treat it as a v7.0.2 or v7.1 planning candidate
- first finish buyer journey consistency from `mindforge.run` to GitHub to First Governance Report to GitHub Action Demo

The current repo-local workflow is already enough to prove first-step GitHub Actions feasibility without changing Guard into a gate, control plane, or reusable approval surface.
