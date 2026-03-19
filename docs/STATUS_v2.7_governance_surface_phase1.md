## Guard v2.7 Governance Surface Phase 1

### Objective
- Consolidate the current governance artifacts into a clear, stable Governance Surface without adding a new governance object.

### Included
- governance surface map for artifact tiering and consumer-facing boundary explanation
- stable export set declaration for permit governance runtime
- governance surface verification for export and boundary stability

### Explicitly not included
- no new governance object
- no permit gate semantic change
- no audit main-output mutation
- no audit verdict mutation
- no second consumer
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 1 Position
- `guard audit` remains the only governance consumer surface.
- permit gate remains explicit opt-in and default-off.
- existing governance artifacts keep their semantics; only export boundary and tiering are consolidated.
