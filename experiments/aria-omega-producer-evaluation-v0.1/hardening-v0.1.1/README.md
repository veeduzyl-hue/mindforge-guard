# AOE-PE v0.1.1 Hardening Delta

This additive delta preserves the original AOE-PE v0.1 source fixtures and adds:

- a semantic mapping to the existing Guard Evidence Contract, Verification Findings Taxonomy, Normalized Evidence Record, and EAK type-only contracts;
- eight negative/adversarial cases covering cross-execution evidence promotion, digest/signature conflation, local TSA promotion, RAG retrieval-count inflation, LLM claim override, count mismatch, digest mismatch, and un-retrieved artifact references;
- one positive control proving the evaluator does not downgrade when evidence is present, execution-bound, and digest-verified;
- a deterministic offline oracle and a separate repository-source taxonomy/EAK alignment review.

Run from the repository root:

```bash
node experiments/aria-omega-producer-evaluation-v0.1/hardening-v0.1.1/scripts/verify-hardening.mjs
node experiments/aria-omega-producer-evaluation-v0.1/hardening-v0.1.1/scripts/verify-taxonomy-alignment.mjs
```

The original v0.1 cases and facts are read-only inputs. The delta is research-only, offline, additive, and not wired into aggregate `npm run verify`.

The oracle is not Guard Core, not a production adapter, and not the EAK verifier. Producer assurance remains `NOT_ESTABLISHED`; Guard integration remains `NOT_PERFORMED`.
