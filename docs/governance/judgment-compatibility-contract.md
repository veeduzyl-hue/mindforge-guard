# Judgment Compatibility Contract

`judgment_compatibility_contract` freezes the consumer-facing compatibility guarantees for the judgment layer.

## Guarantees

- recommendation-only remains true
- additive-only remains true
- permit-gate semantics remain preserved
- enforcement-pilot semantics remain preserved
- limited-authority semantics remain preserved
- audit output remains preserved
- audit verdict remains preserved
- actual exit code remains preserved
- deny exit code `25` remains preserved
- no governance object is added

## Boundary

- authority scope remains `review_gate_deny_exit_recommendation_only`
- no execution semantics are introduced
- no main-path takeover is introduced
