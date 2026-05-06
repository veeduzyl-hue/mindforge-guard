# v6.22 - Procedural Lineage Trajectory Preview Boundary

## Status

`v6.22` starts as an internal preview-only governance boundary.

Core narrative: `Trajectory visibility, not trajectory control`.

It does not change the current commercial release baseline.
`v6.13.1` remains the current commercial baseline.
No README, current product docs, current demo docs, License Hub, pricing, release asset, or public commercial entitlement surface is changed.

## Boundary Definition

`v6.22` records and explains a bounded procedural lineage trajectory across frozen `v6.17-v6.21` summaries and receipt refs.

The boundary is:

- fixture-backed
- visibility-only
- explanation-only
- preview-only
- recommendation-only
- non-executing
- additive-only
- deterministic
- non-enforcing
- default-off

The PR-A preview surface is verifier-harness only.
There is no CLI in PR-A.
There are no `runGuard` changes in PR-A.

The required preview output includes:

- `schema_version`
- `preview: true`
- `visibility_only: true`
- `explanation_only: true`
- `trajectory_status`
- `trajectory_control_performed: false`
- `optimization_performed: false`
- `rerouting_performed: false`
- `workflow_execution_performed: false`
- `agent_orchestration_performed: false`
- `permission_granted: false`
- `file_mutation_performed: false`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `input_ref`
- `lineage_refs`
- `trajectory_segments[]`
- `trajectory_findings[]`
- `trajectory_boundary`
- `deterministic_hash`

## Frozen Summary Consumption

`v6.22` consumes deterministic frozen lineage only:

- `v6.17` admissibility prerequisite summaries / receipt refs
- `v6.18` execution-time authority drift / validity summaries
- `v6.19` symbolic guardrail mapping summaries
- `v6.20` transition validity / preservation summaries
- `v6.21` procedural artifact patch receipt summaries

It does not recompute those prior decisions.
It does not read live repo state during preview construction.

## Fixture Scope

The compact fixture bundle for `v6.22` includes procedural lineage trajectory cases for:

- `visible`
- `partially_visible`
- `insufficient_lineage`
- `out_of_scope`
- `unknown`

The compact fixture bundle keeps lineage visibility first and treats trajectory as a bounded explanation frame only.

## Not Included

`v6.22` does not include:

- no trajectory optimizer
- no runtime controller
- no multi-agent orchestrator
- no auto rerouting system
- no workflow executor
- no policy engine
- no commit gate behavior
- no permit gate behavior
- no deployment gate behavior
- no runtime enforcement layer
- no workflow execution
- no agent orchestration
- no task rerouting
- no permission grant
- no lineage approval
- no trajectory-safe-to-execute proof
- no commercial entitlement change
- no live repo reads
- no source fetching
- no external API calls
- no file mutation
- exit `21`
- exit `25`

## Verification Surface

PR-A verification starts with:

- `node scripts/verify_v6_22_procedural_lineage_trajectory_preview.mjs`

The verifier constructs deterministic preview trajectories from the compact fixture bundle, validates the schema and fixture contract, and confirms the non-control boundary.
The preview trajectory remains bounded to frozen summaries plus receipt refs only.
