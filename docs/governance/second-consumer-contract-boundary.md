# Second Consumer Contract Boundary

This document freezes the promoted second-consumer contract boundary for v3.1 Phase 1.

## Contract Position

- The contract promotes the released standalone second consumer pilot from `v3.0.0`.
- The contract does not turn the pilot into a second main-path takeover.
- The contract does not integrate into `guard audit`.
- The contract does not modify `runGuard.mjs`.

## Stable Input Boundary

### Required Inputs

- `permit_gate_result`
- `governance_decision_record`
- `governance_activation_record`

### Optional Inputs

- `governance_outcome_bundle`
- `governance_application_record`
- `governance_disposition`

### Excluded Inputs

- `governance_receipt`

`governance_receipt` remains audit-bound and excluded from the promoted second-consumer contract.

## Stable Output Boundary

- The output remains a runtime summary.
- The output is still not a governance object.
- The stable summary surface is frozen at:
  - `consumer`
  - `governance`
  - `readiness`
  - `dependencies`
  - `contracts`

## Promotion Guarantees

- second consumer input classes remain required / optional / excluded only
- minimal inputs remain the required input set
- consumer-neutral inputs remain limited to the required and optional input sets
- the promoted contract remains additive-only relative to the released pilot
- existing audit, permit gate, classify, and governance artifact semantics remain unchanged

## Phase 1 Completion Standard

v3.1 Phase 1 is complete only if all of the following remain true:

- the promoted contract remains a standalone non-audit second consumer surface
- the contract does not connect to `guard audit`
- the contract does not change `runGuard.mjs`
- the required, optional, and excluded input sets remain stable
- the summary output remains a runtime summary instead of a governance object
- the summary section and field order remain stable
- existing governance verification and pilot verification remain passing
