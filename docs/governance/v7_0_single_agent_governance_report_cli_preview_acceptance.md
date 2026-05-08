# v7.0 Single-Agent Governance Report CLI Preview Acceptance

## Status

This is `v7.0` Phase 2B only.

It adds preview-only CLI access to the accepted `single_agent_governance_report_preview v1` contract.

It consumes the Phase 2A schema, fixtures, and verifier contract.

## CLI Command Shape

`node packages/guard/src/runGuard.mjs report single-agent --preview --json --fixture-file <file>`

## Verification

Run:

`node scripts/verify_v7_0_single_agent_governance_report_preview.mjs`

Expected:

`PASS: v7.0 single_agent_governance_report_preview schema and fixtures validated.`

Run:

`node scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs`

Expected:

`PASS: v7.0 single_agent_governance_report CLI preview validated.`

## Fixture Coverage

All five accepted Phase 2A fixtures are validated through the CLI preview path:

- `ready_for_review.json`
- `needs_human_review.json`
- `insufficient_evidence.json`
- `out_of_scope.json`
- `unknown.json`

## Invalid Fixture Coverage

The CLI verifier creates a temporary invalid fixture with:

- `review_posture: approve`
- `readiness_verdict` present

It confirms:

- non-zero exit
- no partial report JSON on stdout
- no approval, blocking, merge, deployment, permit, commit, or execution authority implication

## Output Boundary

Valid CLI output preserves:

- `object_type`
- `object_version`
- `report_mode`
- `review_posture`
- `pre_v6_14_capability_foundation`
- `non_enforcement_boundary`

## Help Text Boundary

The `runGuard` change is limited to additive preview-command discoverability and does not alter runtime behavior outside the new preview path.

## Boundary

This phase does not create new governance semantics.

This phase does not alter Pre-v6.14 capabilities.

This phase does not replace:

- `status` / `validate-policy`
- `audit`
- `snapshot`
- `action classify`
- `drift`
- `assoc`
- `risk`
- `license`
- verification chain

This phase does not change `audit`, `permit`, `classify`, `drift`, or `license` semantics.

This phase does not change deny exit code `25`.

This phase does not create GitHub Action implementation.

This phase does not create `action.yml`.

This phase does not create workflow files.

This phase does not create Marketplace launch surface.

This phase does not change README, current docs, License Hub, pricing, `mindforge.run`, demos, or release notes.

This phase does not change the commercial baseline.

Current commercial baseline remains `MindForge Guard v6.13.1`.

## Review Posture Boundary

`review_posture` remains the only readiness vocabulary.

`readiness_verdict` is intentionally not introduced.

The CLI preview does not approve, reject, block, permit, commit, merge, deploy, or execute any change.

## Scope Boundary

Multi-Agent remains out of scope.

Commercial launch remains blocked before Phase 5.
