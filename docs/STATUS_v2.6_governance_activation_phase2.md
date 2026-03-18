## Guard v2.6 Governance Activation Phase 2

### Objective
- Stabilize the `governance_activation_record` contract and emission boundary for merge readiness.

### Included
- tightened activation linkage consistency across permit result, application record, disposition, and optional governance artifacts
- stabilized enabled-governance-path boundary for deterministic, unique activation paths
- stronger verification for missing-path / invalid-path handling and linked artifact identity preservation

### Explicitly not included
- no second main-path entrypoint
- no audit main-output mutation
- no audit verdict mutation
- no permit gate semantic change
- no governance artifact semantic rewrites
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 2 Position
- `governance_activation_record` remains a standalone, explicit opt-in, parallel artifact.
- `guard audit` remains the only governance consumer surface.
- deny path remains isolated through `permit_gate_result` stdout and exit code `25`.
