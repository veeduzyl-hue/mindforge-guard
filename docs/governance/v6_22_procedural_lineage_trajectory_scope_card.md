# v6.22 — Procedural Lineage Trajectory Preview Boundary

## Status

Scope card only. Not implemented.

## One-Sentence Objective

Add a fixture-backed preview artifact that records and explains a bounded procedural lineage trajectory across frozen v6.17-v6.21 summaries and receipt refs, without controlling, optimizing, rerouting, executing, orchestrating, enforcing, approving, blocking, or mutating anything.

## Core Narrative

Trajectory visibility, not trajectory control.

## Relationship To v6.17-v6.21

- `v6.17` explains admissibility prerequisite declaration.
- `v6.18` explains execution-time authority drift / validity.
- `v6.19` maps requirements to symbolic guardrail surfaces.
- `v6.20` explains declared transition preservation.
- `v6.21` receipts declared procedural artifact / skill-patch changes.
- `v6.22` may explain the bounded lineage trajectory across those frozen artifacts.
- `v6.22` does not recompute `v6.17-v6.21` decisions.
- `v6.22` does not control or optimize the trajectory.
- `v6.22` does not execute, orchestrate, reroute, approve, block, or enforce anything.

`v6.22` should consume only frozen `v6.17-v6.21`-style artifacts by reference or deterministic summary:

- `v6.17` admissibility prerequisite summaries / receipt refs
- `v6.18` execution-time authority drift / validity summaries
- `v6.19` symbolic guardrail mapping summaries
- `v6.20` transition validity / preservation summaries
- `v6.21` procedural artifact patch receipt summaries

## Recommended Scope

- focus on lineage visibility first
- treat trajectory as a bounded explanation frame
- consume deterministic summaries / receipt refs only
- remain fixture-backed if implemented later
- remain visibility-only if implemented later
- avoid CLI in early implementation
- keep `runGuard` unchanged in early implementation

## Out Of Scope

- no trajectory optimizer
- no runtime controller
- no multi-agent orchestrator
- no auto rerouting system
- no workflow executor
- no policy engine
- no commit gate
- no permit gate
- no deployment gate
- no runtime enforcement layer
- no commercial entitlement change
- no live repo reads
- no source fetching
- no external API calls
- no file mutation
- no workflow execution
- no agent orchestration
- no task rerouting
- no permission grant
- no proof that a trajectory is safe to execute
- no approval that a lineage may proceed

## Candidate Future Object

`procedural_lineage_trajectory_preview v1`

## Candidate Future CLI

No CLI recommended for `PR-A`.

If a CLI is ever considered later, mark it as candidate only and not accepted:

- `guard trajectory explain --preview --json --fixture-file <file>`

`v6.22` `PR-A` should likely remain schema / fixture / verify-first with no CLI and no `runGuard` dispatch.

## Candidate Future Output Invariants

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
- `trajectory_segments`
- `trajectory_findings`
- `trajectory_boundary`
- `deterministic_hash`

## Candidate Future Exit Semantics

- `0` = successful preview explanation
- `2` = usage / malformed invocation for verifier or fixture harness if applicable
- `30` = malformed fixture / invalid schema
- `21` reserved for commercial/license gate and not used
- `25` reserved for permit gate deny and not used
- no new global exit semantics

## Candidate PR Plan If Approved Later

- `PR-A`: boundary doc, schema, one compact fixture bundle, preview verifier, no CLI, no `runGuard` change
- `PR-B`: hardening, final acceptance verifier, internal final acceptance doc

## File Growth Rule

- scope card PR: exactly 1 file
- future `PR-A` target: 4 files, maximum 5
- future `PR-B` target: 2 files, maximum 3
- no one-case-one-file fixture pattern

## Commercial Baseline Protection

- `v6.13.1` remains current commercial baseline
- no README/current docs change
- no `docs/product/current` change
- no `docs/demos/current` change
- no License Hub change
- no pricing change
- no commercial edition change
- no release notes
- no `mindforge.run` change

## Production Safety

- no production systems touched
- no network calls
- no database access
- no Paddle / Resend / Neon access
- no Vercel config change
- no deployment hooks
- no runtime mutation
- no workflow execution
- no agent orchestration
- no task rerouting
- no permission grant
- no file mutation
- no trajectory optimization or control

## Risks And Mitigations

- risk: trajectory language drifts into optimization or control
  mitigation: keep `v6.22` visibility-only, fixture-backed, deterministic, explanation-only, and explicitly non-enforcing
- risk: lineage aggregation drifts into orchestration or workflow planning
  mitigation: prohibit orchestration, execution, and rerouting semantics and constrain the boundary to frozen lineage summaries plus receipt refs only
- risk: aggregated lineage looks like a gate or policy decision
  mitigation: preserve preview-only, visibility-only, non-executing, non-enforcing semantics with `enforcement_action: "none"` and `blocking_effect: false`
- risk: CLI or `runGuard` exposure implies live repo analysis
  mitigation: keep `v6.22` `PR-A` schema / fixture / verify-first with no CLI and no `runGuard` dispatch
- risk: lineage scope explodes across too many prior details
  mitigation: consume deterministic summaries / receipt refs only and avoid recomputing prior version objects

## Final Recommendation

Do not implement until this scope card is reviewed and approved.
