# v5.1 Phase 1: Governance Snapshot Profile and Explainability Boundary

Status: candidate in development

Scope:
- introduce `governance_snapshot_profile`
- introduce explainability and rationale boundary contracts
- introduce snapshot consumer / validation / export surface
- preserve additive-only, recommendation-only, non-executing, default-off behavior

Preserved semantics:
- audit main output unchanged
- audit main verdict unchanged
- actual audit exit code unchanged
- deny exit code preserved at `25`
- `--permit-gate` semantics preserved
- `--enforcement-pilot` semantics preserved
- `--limited-enforcement-authority` semantics preserved
- no authority scope expansion
- no main-path takeover
- no governance object addition
