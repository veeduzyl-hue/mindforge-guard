## Guard v2.5 Governance Disposition Phase 2

### Objective
- Stabilize the `governance_disposition` contract and emission boundary for merge readiness.

### Included
- tightened disposition linkage consistency across permit result, application record, and optional governance artifacts
- stabilized emission boundary verification for missing-path and invalid-path handling
- compatibility verification for off / allow / deny paths without mutating audit main output

### Explicitly not included
- no second main-path entrypoint
- no audit main-output mutation
- no audit verdict mutation
- no permit gate semantic change
- no governance receipt / decision record / outcome bundle / application record semantic change
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 2 Position
- `governance_disposition` remains a standalone, explicit opt-in, parallel artifact.
- `guard audit` remains the only governance consumer surface.
- deny path remains isolated through `permit_gate_result` stdout and exit code `25`.
