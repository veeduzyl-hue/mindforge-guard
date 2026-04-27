## Guard v2.6 Governance Activation Phase 1

### Objective
- Introduce Governance Activation Record v1 for explicit permit gate executions on `guard audit`.

### Included
- standalone `governance_activation_record` contract and schema
- explicit opt-in activation record emission via `--governance-activation-record-out <file>`
- optional linkage to receipt, decision record, outcome bundle, application record, and disposition artifacts
- verification for gate off / allow / deny paths

### Explicitly not included
- no second main-path entrypoint
- no audit main-output mutation
- no audit verdict mutation
- no permit gate semantic change
- no governance artifact semantic rewrites
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 1 Position
- `governance_activation_record` is an additive, parallel artifact.
- `guard audit` remains the only governance consumer surface.
- permit gate stays default-off and explicit opt-in.
