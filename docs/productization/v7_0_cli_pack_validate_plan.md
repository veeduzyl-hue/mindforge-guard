# v7.0 CLI Pack Validate Plan

## 1. Scope

- Planning only
- No CLI implementation
- No command wiring
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

This plan defines the future design boundary for a candidate CLI validation command:

`guard pack validate --pack <path>`

The command, if later approved, would use the preview parser to validate a Single-Agent Governance Evidence Pack and produce deterministic validation output.

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

`guard pack validate --pack ./single-agent-governance-pack --json`

Optional future flags may include:

- `--json`
- `--strict`
- `--include-limitations`
- `--hash`
- `--fixture`
- `--preview`

These command names and flags are planning candidates only.
They are not implemented by this PR.

## 5. Candidate Inputs

Future command input candidates:

- pack path
- parser preview output
- schema preview expectations
- local fixture pack
- example evidence pack

Inputs are evidence artifacts.
They are not authority grants, runtime permissions, or deployment signals.

## 6. Candidate Outputs

Conceptual output only:

- `command`
- `pack_path`
- `parser_version`
- `validation_status`
- `omissions`
- `limitations`
- `parser_warnings`
- `deterministic_pack_hash`
- `files_checked`
- `required_fields_checked`
- `review_focus`
- `non_enforcement_boundary`

`validation_status` allowed conceptual values:

- `valid_with_no_omissions`
- `valid_with_limitations`
- `invalid_due_to_omissions`
- `invalid_due_to_malformed_input`

Output is not a canonical schema.
Output is not approval, denial, blocking, merge permission, deployment permission, or compliance certification.

## 7. Exit Code Planning Boundary

Candidate exit semantics only:

- `0`: validation completed with no omissions
- `2`: validation completed with limitations
- `3`: validation completed with omissions
- `4`: malformed input / unreadable pack
- `1`: unexpected tool error

Do not reuse or change deny exit code `25`.
Do not alter existing `audit` / `permit` / `classify` / `drift` / `license` exit semantics.
These exit codes are candidates only and must be separately approved before implementation.

## 8. Relationship To Parser Preview

The future CLI command should call the preview parser rather than duplicating parsing logic.

It should preserve parser boundaries:

- read-only
- local-first
- no external calls
- no tool execution
- no mutation
- no approval / blocking / deployment / merge semantics

## 9. Relationship To Report Preview

Pack validation is a pre-report evidence readiness step.

It may help future report preparation by identifying:

- missing required files
- missing required fields
- malformed input
- limitations
- parser warnings
- deterministic pack hash

It does not produce a full governance report by itself unless a separate report command is approved later.

## 10. Relationship To CI Readiness

A future CI workflow may call pack validation as a sidecar evidence check.

But this plan does not create:

- GitHub Action
- workflow file
- required status check
- CI blocking gate
- merge gate
- deployment gate

## 11. Future Verifier Candidate Boundary

Future verifier candidates only:

- command returns valid JSON
- valid pack returns `validation_status` `valid_with_no_omissions`
- optional missing pack returns `valid_with_limitations`
- required missing pack returns `invalid_due_to_omissions`
- malformed JSON pack returns `invalid_due_to_malformed_input`
- deterministic hash remains stable
- no enforcement / approval / blocking fields appear
- existing CLI commands remain unchanged

This PR does not create or modify verifiers.

## 12. Backward Compatibility Boundary

Future CLI pack validate work must not change:

- `audit` semantics
- `permit` semantics
- `classify` semantics
- `drift` semantics
- `license` semantics
- deny exit code `25`
- current commercial baseline `v6.13.1` behavior
- `v7.0` canonical report contract
- existing verifier outputs

## 13. Security And Safety Boundary

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

## 14. Future Implementation Candidates

Future candidates only:

- CLI route planning
- pack validate command handler
- parser invocation wrapper
- JSON output formatter
- exit code mapping
- command verifier
- fixture-based command acceptance
- docs/productization command behavior note
- later `docs/product/current` candidate

Each item must be separately approved.

## 15. Acceptance Criteria

- no CLI implementation
- no command wiring
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
- candidate CLI remains planned as deterministic, local-first, read-only, non-executing, recommendation-only, and evidence-oriented

## 16. Prohibited Changes

Explicitly prohibited:

- implementing CLI command
- changing CLI behavior
- changing `runGuard` routing
- changing package scripts
- changing canonical report contract
- changing parser preview implementation
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

## 17. Recommended Next Decision

Allowed values:

- hold_cli_pack_validate_plan
- prepare_cli_pack_validate_preview
- prepare_github_action_readiness_plan
- prepare_public_docs_candidate

Recommended:

- prepare_cli_pack_validate_preview

This only authorizes a future CLI preview implementation proposal.
It does not authorize public docs, GitHub Actions, Marketplace work, entitlement changes, compliance claims, or commercial surface edits.
