# Second Consumer Pilot Boundary

This document freezes the v3.0 Phase 1 boundary for the second consumer pilot.

## Runtime Boundary

- The pilot is an independent non-audit runtime.
- The pilot is executed through `node packages/guard/src/runSecondConsumerPilot.mjs`.
- The pilot does not integrate into `guard audit`.
- The pilot does not modify `runGuard.mjs`.
- The pilot does not change existing permit gate, audit, or classify semantics.

## Input Boundary

The pilot consumes only existing governance artifacts.

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

`governance_receipt` is audit-bound and must not be accepted as a second consumer pilot input.

## Output Boundary

- The pilot output is a runtime summary only.
- The pilot output is not a governance object.
- The pilot does not introduce a new governance artifact or contract family.

## Phase 1 Completion Standard

v3.0 Phase 1 is complete only if all of the following remain true:

- the pilot remains a standalone non-audit runtime
- the pilot does not connect to `guard audit`
- the pilot consumes only the required and optional existing governance artifacts listed above
- `governance_receipt` remains excluded as an audit-bound input
- the pilot output remains a runtime summary rather than a governance object
- existing permit gate, audit, classify, and governance artifact semantics remain unchanged
- compatibility and verification coverage for the pilot and existing governance flow remain passing

## Exclusions For This Commit

- No Phase 2 work is included here.
- No future runtime expansion is included here.
- No second consumer runtime generalization is included here.
