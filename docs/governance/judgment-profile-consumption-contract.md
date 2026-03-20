# Judgment Profile Consumption Contract

`judgment_profile` is a consumer-facing summary contract over existing governance inputs.

## Inputs

- `policy_permit_bridge_contract`
- `permit_gate_result`
- `governance_decision_record`
- `limited_enforcement_authority_result`

## Output Guarantees

- stable contract identity
- stable judgment classes
- stable source ordering
- recommendation-only semantics
- preserved audit output / verdict / actual exit behavior

## Non-Goals

- no authority execution
- no override workflow
- no mutation of existing governance artifacts
