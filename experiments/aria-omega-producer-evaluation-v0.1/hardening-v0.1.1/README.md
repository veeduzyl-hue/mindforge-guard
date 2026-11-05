# AOE-PE v0.1.1 Hardening Delta

This additive delta preserves the original AOE-PE v0.1 source fixtures and adds:

- semantic mapping to existing Guard Evidence Contract, Verification Findings Taxonomy, Normalized Evidence Record, and EAK type-only contracts;
- thirteen negative/adversarial cases covering cross-execution evidence promotion, digest/signature conflation, local TSA promotion, RAG retrieval-count inflation, LLM status override, claim-count mismatch, payload digest mismatch, un-retrieved artifact references, and self-asserted independent verification;
- two positive controls proving the evaluator does not downgrade when evidence is present, bound to the current execution, and digest-verified;
- a deterministic offline oracle and a separate repository-source taxonomy/EAK alignment review.

Run from the repository root:

    node experiments/aria-omega-producer-evaluation-v0.1/hardening-v0.1.1/scripts/verify-hardening.mjs
    node experiments/aria-omega-producer-evaluation-v0.1/hardening-v0.1.1/scripts/verify-taxonomy-alignment.mjs

The original v0.1 cases and facts are read-only inputs. This delta is research-only, offline, additive, and not wired into aggregate npm run verify.

The oracle is not Guard Core, not a production adapter, and not the EAK verifier. Producer assurance remains NOT_ESTABLISHED; Guard integration remains NOT_PERFORMED.
