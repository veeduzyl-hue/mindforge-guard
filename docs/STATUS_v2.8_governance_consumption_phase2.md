## Guard v2.8 Governance Consumption Phase 2

### Objective
- Stabilize the governance consumption profile, consumer-safe dependency boundary, and export surface for merge readiness.

### Included
- tightened required / optional / support-only boundary validation
- stabilized consumption artifact ordering and requirement level constants
- explicit consumer-safe artifact set and dependency ordering checks
- stronger verification for export drift, profile overlap, and surface compatibility

### Explicitly not included
- no new governance object
- no second consumer
- no audit main-output mutation
- no audit verdict mutation
- no permit gate semantic change
- no governance artifact semantic change
- no drift / snapshot / risk integration
- no full enforcement platform

### Phase 2 Position
- governance consumption preparation remains additive-only
- existing runtime behavior and artifact semantics remain unchanged
- the consumer dependency boundary is now explicit, ordered, and verifiable
