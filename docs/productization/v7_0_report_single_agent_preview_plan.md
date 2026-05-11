# v7.0 Report Single-Agent Preview Plan

## 1. Scope

- Planning only
- No report command implementation
- No CLI wiring
- No runtime integration
- No parser changes
- No schema / fixture / verifier changes
- No example changes
- No GitHub Action implementation
- No workflow files
- No action.yml
- No public docs change
- No commercial surface change
- No entitlement change
- No approval / blocking semantics

## 2. Purpose

This plan defines the future design boundary for a candidate report preview command:

`guard report single-agent --pack <path> --preview --json`

The command, if later approved, would use Evidence Pack parser output and pack validation output to prepare a `v7.0` Single-Agent Governance Report preview.

This document does not implement the command.

## 3. Command Design Principle

The future command should be:

- deterministic
- local-first
- file-based
- read-only
- non-executing
- sidecar
- evidence-oriented
- parser-backed
- pack-validation-aware
- canonical-report-contract-aligned
- preview-gated
- human-review-oriented

The command must not:

- execute tools
- call external services
- mutate user files
- approve workflows
- block workflows
- grant authority
- deploy anything
- merge anything
- become a runtime control plane
- become a compliance checker

## 4. Candidate Command Shape

Future candidate only:

`guard report single-agent --pack ./single-agent-governance-pack --preview --json`

Optional future flags may include:

- `--json`
- `--preview`
- `--include-pack-validation`
- `--include-reading-view`
- `--output <path>`
- `--fixture`

These command names and flags are planning candidates only.
They are not implemented by this PR.

## 5. Relationship To Existing v7.0 Assets

This plan is downstream of:

- `single_agent_governance_report_preview v1` canonical contract
- `v7.0` pack parser preview
- `v7.0` CLI pack validate preview
- `v7.0` report reading guide
- `v7.0` policy-aligned report reading view
- `v7.0` example evidence pack
- `v7.0` CI readiness plan

The future command should prepare report preview output from existing evidence and parser / validation signals.
It must not create a second canonical report contract.

## 6. Canonical Contract Boundary

The canonical report contract remains `single_agent_governance_report_preview v1`.

The future command must not:

- create a new canonical schema
- create edition-specific governance semantics
- create entitlement changes
- create compliance certification
- create approval / block / safe-to-merge / safe-to-deploy semantics

## 7. Candidate Inputs

Future command input candidates:

- Evidence Pack path
- parser preview summary
- pack validation preview result
- canonical report preview fixtures / contract expectations
- optional reading-view preference

Inputs are evidence artifacts.
They are not authority grants, runtime permissions, deployment signals, or compliance evidence by themselves.

## 8. Candidate Outputs

Conceptual output only:

- `report_type`
- `report_version`
- `preview`
- `pack_path`
- `pack_validation_summary`
- `action_summary`
- `intent_summary`
- `authority_summary`
- `evidence_summary`
- `admissibility_summary`
- `risk_summary`
- `drift_summary`
- `guardrail_mapping_summary`
- `transition_summary`
- `procedural_receipt_summary`
- `lineage_summary`
- `review_posture`
- `receipt_refs`
- `deterministic_hash`
- `non_enforcement_boundary`
- `artifact_provenance`
- `review_evidence`
- `proposed_action`
- `policy_evaluation_preview`
- `findings`
- `omissions`
- `limitations`
- `reading_view`

Output is conceptual planning only.
It must align with the existing canonical report contract.
It is not approval, denial, blocking, merge permission, deployment permission, or compliance certification.

## 9. Policy-Aligned Reading View Candidate

The future command may optionally organize human-readable interpretation using:

- Authority / Permission Boundary
- Execution / Behavior Evidence
- Risk / Drift / Maturity Signals

But this is a reading view only.
It must not change JSON contract semantics or create compliance claims.

## 10. Exit Code Planning Boundary

Candidate exit semantics only:

- `0`: report preview generated with no omissions
- `2`: report preview generated with limitations
- `3`: report preview generated with omissions
- `4`: malformed input / unreadable pack
- `1`: unexpected tool error

Do not reuse or change deny exit code `25`.
Do not alter existing `audit` / `permit` / `classify` / `drift` / `license` exit semantics.
These exit codes are candidates only and must be separately approved before implementation.

## 11. Relationship To Pack Validate Preview

Pack validate preview is an evidence-readiness step.
Report single-agent preview is a governance report preparation step.

The future report command should:

- reuse pack parser / validation signals
- not duplicate parsing logic
- not weaken pack validation boundaries
- not convert validation into approval or blocking

## 12. Relationship To CI Readiness

A future CI workflow may call report preview as a sidecar artifact generator.

But this plan does not create:

- GitHub Action
- workflow file
- required status check
- CI blocking gate
- merge gate
- deployment gate

## 13. Future Verifier Candidate Boundary

Future verifier candidates only:

- command returns valid JSON
- valid pack produces report preview with expected canonical sections
- missing required evidence produces omissions
- optional missing evidence produces limitations
- malformed pack produces malformed input status
- output includes `non_enforcement_boundary`
- deterministic hash remains stable
- existing CLI commands remain unchanged
- no enforcement / approval / blocking fields appear

This PR does not create or modify verifiers.

## 14. Backward Compatibility Boundary

Future report single-agent preview work must not change:

- `audit` semantics
- `permit` semantics
- `classify` semantics
- `drift` semantics
- `license` semantics
- deny exit code `25`
- current commercial baseline `v6.13.1` behavior
- `v7.0` canonical report contract
- existing verifier outputs
- pack validate preview semantics

## 15. Security And Safety Boundary

Future command must not:

- follow remote URLs
- execute scripts
- execute tool calls
- read outside the pack root except explicitly approved local refs
- load secrets
- send data externally
- mutate evidence files
- infer approval
- infer legal compliance
- infer deployment safety
- become required for merge or deploy

## 16. Future Implementation Candidates

Future candidates only:

- report command route planning
- single-agent report command handler
- pack validation invocation wrapper
- canonical report preview mapper
- JSON output formatter
- reading-view summary formatter
- exit code mapping
- command verifier
- fixture-based command acceptance
- later `docs/product/current` candidate

Each item must be separately approved.

## 17. Acceptance Criteria

- no report command implementation
- no CLI wiring
- no runtime integration
- no parser changes
- no schema changes
- no fixture changes
- no verifier changes
- no example changes
- no GitHub Action / workflow / action.yml
- no package behavior changes
- no public docs changes
- no commercial surface changes
- no entitlement changes
- no approval / blocking / safe-to-merge / safe-to-deploy claim
- no compliance / certification claim
- candidate report command remains planned as deterministic, local-first, read-only, non-executing, recommendation-only, and evidence-oriented

## 18. Prohibited Changes

Explicitly prohibited:

- implementing report command
- changing CLI behavior
- changing `runGuard` routing
- changing package scripts
- changing canonical report contract
- changing parser preview implementation
- changing pack validate preview implementation
- adding new schemas
- adding fixtures
- changing existing verifiers
- changing examples
- adding GitHub Action
- adding workflow files
- adding action.yml
- adding merge gate
- adding deployment gate
- changing entitlement / pricing / License Hub
- changing README / current docs / public demos / release notes / mindforge.run
- adding compliance checker
- adding legal compliance module
- adding maturity certification
- adding runtime control plane

## 19. Recommended Next Decision

Allowed values:

- hold_report_single_agent_preview_plan
- prepare_report_single_agent_preview
- prepare_github_action_readiness_plan
- prepare_public_docs_candidate

Recommended:

- prepare_report_single_agent_preview

This only authorizes a future report preview implementation proposal.
It does not authorize public docs, GitHub Actions, Marketplace work, entitlement changes, compliance claims, or commercial surface edits.
