## Guard v3.0 Second Consumer Pilot Phase 1

### Objective
- Start the first non-audit governance consumer pilot on top of the existing governance surface, consumption profile, and second-consumer readiness profile.
- Prove that a second consumer can reuse the existing governance contracts without changing `guard audit`.

### Included
- standalone second consumer pilot runtime
- consumer-neutral file-input summary for required and optional governance artifacts
- second consumer pilot verification for boundary and compatibility stability
- v3.0 phase status docs

### Explicitly not included
- no new governance object
- no second consumer runtime rollout beyond the pilot
- no audit main-output mutation
- no audit verdict mutation
- no permit gate semantic change
- no governance artifact semantic change
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 1 Position
- the second consumer remains an explicit pilot, not a new main path
- existing runtime behavior and artifact semantics remain unchanged
- current work validates reuse of the existing governance contracts on a non-audit consumer surface
