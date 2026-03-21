# Policy Pinning And Migration Contract

The policy lifecycle layer exposes two bounded phase-2 contracts:

- `policy_pinning_contract`
- `policy_migration_readiness_profile`

The contracts are limited to readiness and compatibility semantics.

They guarantee:
- recommendation-only posture
- additive-only posture
- no execution enablement
- no default-on enablement
- bounded authority scope
- policy receipt readiness
- policy consumer compatibility
- audit output / verdict / exit preservation

They do not provide:
- execution authority
- override authority
- authority scope expansion
- governance object creation
