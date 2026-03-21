# Explainability and Rationale Contract

`v5.1 Phase 1` freezes the explainability boundary for governance snapshot consumers.

Contract guarantees:
- explainability remains descriptive only
- rationale remains descriptive only
- execution remains disabled
- default-on remains disabled
- evidence / policy / enforcement / approval / judgment semantics remain preserved
- audit output, verdict, and actual exit semantics remain preserved
- deny exit code remains `25`
- no authority scope expansion
- no main-path takeover

Boundary ids:
- `bounded_governance_explainability_contract`
- `bounded_governance_rationale_contract`
