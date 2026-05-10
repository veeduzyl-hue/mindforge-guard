# v7.0 Pack Parser Plan

## 1. Scope

- Planning only
- No parser implementation
- No CLI changes
- No runtime integration
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

This plan defines the future design boundary for a Single-Agent Governance Evidence Pack parser.

The parser, if later approved, would read a file-based Evidence Pack and produce a deterministic internal representation for validation and report preparation.

This document does not implement the parser.

## 3. Parser Design Principle

The parser should be:

- deterministic
- local-first
- file-based
- read-only
- non-executing
- sidecar
- evidence-oriented
- schema-aligned
- report-preparation-oriented

The parser must not:

- execute tools
- call external services
- mutate user files
- approve workflows
- block workflows
- grant authority
- deploy anything
- merge anything
- become a runtime control plane

## 4. Candidate Input Scope

Parser future input candidates:

- `manifest.json`
- `agent-profile.json`
- `task-scope.md`
- `action-boundary.yaml`
- `data-sources.yaml`
- `tools.yaml`
- `review-standards.md`
- `evidence/sample-output.json`
- `evidence/run-record.json`
- `snapshot.json`

Inputs are evidence artifacts.
They are not authority grants or runtime permissions.

## 5. Candidate Output Shape

Conceptual parser output only:

- `pack_path`
- `pack_identity`
- `parsed_files`
- `missing_files`
- `malformed_files`
- `required_field_gaps`
- `optional_field_gaps`
- `evidence_refs`
- `owner_refs`
- `action_boundary_summary`
- `data_source_summary`
- `tool_boundary_summary`
- `sample_output_summary`
- `run_record_summary`
- `snapshot_summary`
- `omissions`
- `limitations`
- `parser_warnings`
- `deterministic_pack_hash`

This is a planning-level output shape only.
It does not create a canonical schema.

## 6. Validation Order

Future deterministic parsing order:

1. Resolve pack root
2. Check required files
3. Parse JSON files
4. Inspect YAML files with deterministic parser or minimal key checks
5. Read markdown files as evidence text
6. Validate required fields
7. Classify missing required evidence as omissions
8. Classify missing recommended evidence as limitations
9. Compute deterministic pack hash
10. Produce parser summary for future report preparation

## 7. Error And Finding Classification

| Condition | Future Classification | Report Meaning | Not An Enforcement Action |
| --- | --- | --- | --- |
| missing required file | omission | required evidence is absent and report preparation is incomplete | does not approve, deny, block, merge, deploy, or certify |
| missing required field | omission | required evidence exists but is incomplete for review | does not approve, deny, block, merge, deploy, or certify |
| malformed JSON | omission | required structured evidence is unreadable | does not approve, deny, block, merge, deploy, or certify |
| malformed YAML | omission | required boundary or source evidence is unreadable | does not approve, deny, block, merge, deploy, or certify |
| missing recommended file | limitation | report can proceed with reduced evidence depth | does not approve, deny, block, merge, deploy, or certify |
| empty markdown evidence file | limitation | descriptive review context is present but insufficiently informative | does not approve, deny, block, merge, deploy, or certify |
| unverifiable artifact reference | parser_warning | referenced evidence needs human follow-up before relying on it deeply | does not approve, deny, block, merge, deploy, or certify |
| missing owner | omission | accountability routing is incomplete | does not approve, deny, block, merge, deploy, or certify |
| missing action boundary | omission | authority and permission review context is incomplete | does not approve, deny, block, merge, deploy, or certify |
| missing sample output | omission | review lacks a representative evidence artifact | does not approve, deny, block, merge, deploy, or certify |
| missing snapshot | limitation | drift and comparison readiness are reduced | does not approve, deny, block, merge, deploy, or certify |

Parser classifications are evidence-readiness signals.
They do not approve, deny, block, merge, deploy, or certify.

## 8. Relationship To Existing v7.0 Assets

This plan is downstream of:

- `v7.0 Single-Agent Governance Pack Contract`
- `v7.0 Pack Schema Preview`
- HR self-service example evidence pack
- `v7.0 First Report Flow`
- `v7.0 Report Reading Guide`
- `v7.0 CI Readiness Plan`

The parser plan consumes these planning assets as design inputs.
It does not change them.

## 9. Future CLI Candidate Boundary

Potential future commands, if separately approved:

- `guard pack validate --pack ./single-agent-governance-pack`
- `guard report single-agent --pack ./single-agent-governance-pack --preview`

These commands are not implemented by this plan.
This plan does not change CLI behavior.

## 10. Future Verifier Candidate Boundary

Future verifier candidates only:

- parser reads valid example pack
- parser detects missing required file
- parser detects missing required field
- parser classifies optional missing evidence as limitation
- parser produces deterministic pack hash
- parser rejects authority-expansion fields
- parser does not execute anything

This PR does not create or modify verifiers.

## 11. Security And Safety Boundary

Parser must not:

- follow remote URLs
- execute scripts
- execute tool calls
- read outside the pack root except explicitly provided local refs
- load secrets
- send data externally
- mutate evidence files
- infer approval
- infer legal compliance
- infer deployment safety

## 12. Future Implementation Candidates

Future candidates only:

- pack parser module
- deterministic file walker
- JSON reader
- YAML reader or key scanner
- markdown evidence reader
- pack hash generator
- omission / limitation classifier
- parser preview fixture set
- parser verifier
- CLI validate command
- report preview wiring

Each item must be separately approved.

## 13. Acceptance Criteria

- no parser implementation
- no CLI changes
- no runtime integration
- no schema changes
- no fixture changes
- no verifier changes
- no example changes
- no GitHub Action / workflow / action.yml
- no public docs changes
- no commercial surface changes
- no entitlement changes
- no approval / blocking / safe-to-merge / safe-to-deploy claim
- no compliance / certification claim
- parser remains planned as deterministic, local-first, read-only, non-executing, recommendation-only, and evidence-oriented

## 14. Prohibited Changes

Explicitly prohibited:

- implementing parser
- changing CLI behavior
- adding runtime pack validation
- changing canonical report contract
- adding new schema
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

## 15. Recommended Next Decision

Allowed values:

- hold_pack_parser_plan
- prepare_pack_parser_preview
- prepare_github_action_readiness_plan
- prepare_public_docs_candidate

Recommended:

- prepare_pack_parser_preview

This only authorizes a future parser preview implementation proposal.
It does not authorize CLI changes, public docs, GitHub Actions, Marketplace work, entitlement changes, compliance claims, or commercial surface edits.
