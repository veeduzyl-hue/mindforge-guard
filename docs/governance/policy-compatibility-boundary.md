# Policy Compatibility Boundary

`v4.9` phase 2 extends the policy lifecycle layer with a bounded compatibility surface.

Frozen boundaries:
- recommendation-only
- additive-only
- non-executing
- default-off
- authority-scope preserving
- consumer-compatible

Preserved semantics:
- permit gate semantics preserved
- enforcement semantics preserved
- approval semantics preserved
- judgment semantics preserved
- audit output preserved
- audit verdict preserved
- actual exit code preserved
- denied exit code preserved at `25`
- no governance object addition

Not allowed:
- actual execution
- automatic execution
- default-on rollout
- authority scope expansion
- audit main-path takeover
