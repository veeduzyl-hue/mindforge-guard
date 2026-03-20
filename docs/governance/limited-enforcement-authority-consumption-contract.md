# Limited Enforcement Authority Consumption Contract

## Consumer Classification

- artifact id: `limited_enforcement_authority_result`
- tier: `external_consumer_surface`
- requirement: `optional`
- consumer-safe: `true`

## Stable Linkage Targets

- `permit_gate_result`
- `governance_decision_record`
- `governance_activation_record`

## Consumption Expectations

- consumers may rely on the finalized limited-authority sidecar shape
- consumers may rely on the public export surface remaining additive-only
- consumers may not assume actual authority execution
- consumers may not assume audit main output mutation
- consumers may not assume audit verdict mutation
- consumers may not assume actual exit-code mutation
