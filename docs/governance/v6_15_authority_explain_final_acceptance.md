# v6.15 Authority Explain Preview Final Acceptance / RC Freeze

## Scope

The accepted `v6.15` preview scope includes:

- `constructible_current_state` implemented
- `state_validity_at_bind_time` implemented
- coverage matrix implemented
- `valid` / `stale` / `mismatch` / `unknown` bind-time validity coverage
- deterministic hash stability hardened
- reserved object boundaries preserved
- non-enforcement boundary preserved

## Frozen Boundaries

The `v6.15` Authority Explain Preview remains RC-frozen with the following boundaries:

- `commitment_candidate` remains reserved
- `admissibility_result` remains reserved
- `commitment_receipt` remains deferred
- no commit gate
- no admissibility decision
- no runtime enforcement
- no `v6.16` Grounding / Provenance
- no commercial update
- no release / tag

## Verification Chain

The RC freeze verification chain is:

- `node scripts/verify_v6_14_authority_boundary_fixtures.mjs`
- `node scripts/verify_v6_14_authority_check_preview.mjs`
- `node scripts/verify_v6_14_authority_preview_acceptance.mjs`
- `node scripts/verify_v6_15_authority_explain_preview.mjs`
- `node scripts/verify_v6_15_authority_explain_acceptance.mjs`
- `node scripts/verify_v6_15_authority_explain_final_acceptance.mjs`

## Final Verdict

`v6.15` Authority Explain Preview is RC-frozen as an internal governance boundary.

It is not a commercial release.
It does not update the `v6.13.1` commercial baseline.
It does not authorize release preparation unless explicitly approved later.
