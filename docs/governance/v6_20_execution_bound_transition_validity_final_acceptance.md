# v6.20 - Execution-Bound Transition Validity Preview

## Final Acceptance Status

`v6.20` Execution-Bound Transition Validity Preview is internally final accepted / RC-frozen.

Core narrative: `Transition explanation, not execution permission`.

- no release
- no README/current docs change
- no License Hub change
- no pricing change
- no commercial edition change
- no demo change
- no mindforge.run change

## Accepted Scope

The accepted `v6.20` RC-frozen scope is:

- fixture-backed preview explanation of whether a declared pre-execution transition preserves already-mapped symbolic prerequisites needed for execution-bound validity
- deterministic JSON output only
- additive-only governance surface expansion

Accepted CLI:

- `guard transition explain --preview --json --fixture-file <file>`

## Accepted Output Invariants

The accepted output invariants remain:

- `preview: true`
- `explanation_only: true`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `execution_authority_granted: false`
- `input_ref`
- `input_summary`
- `declared_transition`
- `prerequisite_refs`
- `transition_findings[]`
- `preservation_summary`
- `non_enforcement_boundary`
- `deterministic_hash`

`v6.20` remains preview-only, explanation-only, recommendation-only, fixture-backed, deterministic, additive-only, non-executing, and non-enforcing.

## Accepted Enum Boundaries

Accepted `transition_status` values:

- `preserved`
- `changed`
- `partially_preserved`
- `not_applicable`
- `unknown`

Accepted `finding_type` values:

- `prerequisite_preserved`
- `prerequisite_changed`
- `prerequisite_partially_preserved`
- `insufficient_transition_evidence`
- `not_applicable_to_transition`

Accepted `verification_surface` values:

- `fixture_declared`
- `receipt_ref_declared`
- `symbolic_mapping_ref_declared`
- `external_system_required`
- `human_review_required`
- `not_preview_determinable`

## Exit Code Boundaries

Accepted exit semantics remain:

- exit `0` for successful preview explanation, including `preserved`, `changed`, `partially_preserved`, `not_applicable`, and `unknown`
- exit `2` for CLI usage / unknown command / missing required option
- exit `30` for command-scoped validation / malformed fixture / invalid schema or JSON contract input
- exit `21` remains reserved for commercial / license gating and is not used by `v6.20`
- exit `25` remains reserved for permit gate deny and is not used by `v6.20`
- no new global exit semantics were introduced

## Non-Enforcement Boundaries

The RC-frozen non-enforcement boundaries remain:

- no execution permission
- no state equivalence proof
- no admit / deny / defer behavior
- no allow / block behavior
- no commit gate
- no permit gate
- no deployment gate
- no runtime enforcement
- no policy engine
- no full symbolic runtime
- no commercial entitlement change
- no execution authority granted
- no authority expansion

## Commercial Baseline Protection

`v6.13.1` remains the current commercial baseline.
No release or public commercial docs were updated.
No commercial entitlement surface was changed.

## Production Safety

`v6.20` remains fixture-backed and preview-only.
It reads only the provided fixture file during command execution.
It performs no live repo reads during command execution.
It performs no live source fetching.
It performs no external API calls.
It performs no database access.
It does not mutate files.
It does not alter audit, permit, or classify semantics.

## File Growth Control

PR-B remains intentionally narrow:

- one final acceptance verifier
- one internal final acceptance record

No new v6.20 product features were added in this freeze pass.
