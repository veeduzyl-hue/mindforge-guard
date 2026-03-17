# Guard Security Notes

MindForge Guard is designed to keep the commercial CLI surface deterministic and offline-capable.

## Current Security-Relevant Properties

- offline license verification
- embedded public-key verification for license files
- structured JSON error surfaces for machine use
- stable exit-code behavior for CI integration

## Current Scope

This document covers the released v1.0.x surface only.

It does not introduce:

- a control plane
- a hosted service
- background agents
- v1.1 Canonical Action behavior

## License Verification

License verification is performed locally using embedded public keys and canonical JSON signing rules.

Relevant source:

- [packages/guard/src/product/license_verify.mjs](/D:/AI%20project/mindforge-guard/packages/guard/src/product/license_verify.mjs)
- [packages/guard/src/product/license_keyset.mjs](/D:/AI%20project/mindforge-guard/packages/guard/src/product/license_keyset.mjs)
