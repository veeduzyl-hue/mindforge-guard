# Harness Phase 2 External Evidence Spike

This directory contains a bounded, local-only design and verification spike for Guard-native Agent Harness Phase 2 external evidence normalization.

Scope:

- generic external evidence record schema
- local fixtures
- normalized evidence pack sample
- deterministic verification script
- sample review report section

Boundary:

- recommendation-only
- additive-only
- non-executing
- verification-only
- no runtime enforcement
- no control-plane behavior
- no production integration claim
- no live external API
- no `packages/guard/**` changes
- no `audit`, `permit`, or `classify` changes

Ramen is one example only.
This spike does not productize the ramen adapter line.

Run:

```bash
npm run verify:harness-phase2:evidence
```

Artifacts here are for deterministic review preparation only.
They do not approve, block, deploy, certify, or control execution.
