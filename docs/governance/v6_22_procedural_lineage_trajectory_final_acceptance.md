# v6.22 - Procedural Lineage Trajectory Preview Boundary

## Final Acceptance Status

`v6.22` Procedural Lineage Trajectory Preview Boundary is internally final accepted / RC-frozen.

Core narrative: `Trajectory visibility, not trajectory control`.

- no release
- no README/current docs change
- no License Hub change
- no pricing change
- no commercial edition change
- no demo change
- no mindforge.run change

## Accepted Scope

The accepted `v6.22` RC-frozen scope is:

- fixture-backed preview artifact that records and explains a bounded procedural lineage trajectory across frozen `v6.17-v6.21` summaries and receipt refs
- deterministic preview trajectory output only
- additive-only governance surface expansion

Accepted scope statement:

- fixture-backed preview artifact that records and explains a bounded procedural lineage trajectory across frozen v6.17-v6.21 summaries and receipt refs

Accepted CLI status:

- no CLI accepted in `v6.22` PR-A / PR-B

Accepted CLI freeze statement:

- no CLI accepted in v6.22 PR-A / PR-B

Accepted runtime status:

- no runGuard dispatch
- no runtime command behavior

## Accepted Output Invariants

The accepted output invariants remain:

- `preview: true`
- `visibility_only: true`
- `explanation_only: true`
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

`v6.22` remains preview-only, visibility-only, explanation-only, recommendation-only, fixture-backed, deterministic, additive-only, non-executing, and non-enforcing.

## Accepted Enum Boundaries

Accepted `trajectory_status` values:

- `visible`
- `partially_visible`
- `insufficient_lineage`
- `out_of_scope`
- `unknown`

Accepted `segment_type` values:

- `admissibility_prerequisite`
- `authority_drift_validity`
- `symbolic_guardrail_mapping`
- `transition_validity`
- `procedural_artifact_receipt`

Accepted `finding_type` values:

- `lineage_ref_recorded`
- `segment_summary_recorded`
- `missing_lineage_ref`
- `insufficient_lineage_evidence`
- `trajectory_control_out_of_scope`
- `optimization_out_of_scope`
- `rerouting_out_of_scope`
- `orchestration_out_of_scope`
- `workflow_execution_out_of_scope`
- `not_preview_determinable`

Accepted `verification_surface` values:

- `fixture_declared`
- `receipt_ref_declared`
- `deterministic_summary_declared`
- `external_system_required`
- `human_review_required`
- `not_preview_determinable`

## Exit Code Boundaries

Accepted exit semantics remain:

- exit `0` for successful preview explanation, including `visible`, `partially_visible`, `insufficient_lineage`, `out_of_scope`, and `unknown`
- exit `2` for usage / malformed invocation for the verifier or fixture harness where applicable
- exit `30` for malformed fixture / invalid schema / command-scoped validation
- exit `21` remains reserved for commercial / license gating and is not used by `v6.22`
- exit `25` remains reserved for permit gate deny and is not used by `v6.22`
- no new global exit semantics were introduced

## Visibility / Non-Control Boundaries

The RC-frozen visibility and non-control boundaries remain:

- no trajectory optimization
- no trajectory control
- no task rerouting
- no workflow execution
- no agent orchestration
- no permission grant
- no lineage approval
- no trajectory-safe-to-execute proof
- no runtime enforcement
- no policy engine
- no commercial entitlement change
- no authority expansion

The accepted `trajectory_boundary` remains:

- `visibility_only: true`
- `explanation_only: true`
- `trajectory_control_performed: false`
- `optimization_performed: false`
- `rerouting_performed: false`
- `workflow_execution_performed: false`
- `agent_orchestration_performed: false`
- `permission_granted: false`
- `file_mutation_performed: false`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `does_not_control_trajectory: true`
- `does_not_optimize_trajectory: true`
- `does_not_reroute_tasks: true`
- `does_not_execute_workflow: true`
- `does_not_orchestrate_agents: true`
- `does_not_grant_permission: true`
- `does_not_mutate_files: true`
- `does_not_approve_lineage_progression: true`
- `does_not_prove_trajectory_safe_to_execute: true`

## Commercial Baseline Protection

`v6.13.1` remains the current commercial baseline.
No release or public commercial docs were updated.
No commercial entitlement surface was changed.

## Production Safety

`v6.22` remains fixture-backed and preview-only.
It performs no live repo reads during command execution.
It performs no live source fetching.
It performs no external API calls.
It performs no database access.
It does not optimize trajectories.
It does not control trajectories.
It does not reroute tasks.
It does not execute workflows.
It does not orchestrate agents.
It does not grant permissions.
It does not approve lineage progression.
It does not mutate files.
It does not alter `audit`, `permit`, or `classify` semantics.

## File Growth Control

PR-B remains intentionally narrow:

- one final acceptance verifier
- one internal final acceptance record

No new `v6.22` product features were added in this freeze pass.
