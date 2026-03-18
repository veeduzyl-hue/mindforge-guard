# v1.2 Policy-to-Permit Bridge Candidate Status

## Scope
This branch records the v1.2-start candidate for the `policy-to-permit bridge contract`.

It is intentionally outside the v1.1 boundary. v1.1 stops at the enforcement-adjacent checkpoint and does not include the policy-to-permit bridge contract.

## Candidate contents
- policy-to-permit bridge contract helper under `runtime/governance/bridge`
- policy-to-permit bridge schema under `runtime/governance/bridge`
- audit-side opt-in bridge contract emission
- smoke verification for the bridge contract

## Version boundary
- Not part of v1.1
- Candidate for v1.2 start
- Additive only
- No merge into `main` yet
- No release tag yet

## Current state
- branch-status: candidate
- release-track: v1.2-start
- containment: relocated out of `runtime/actions`
- phase-2: contract stabilization in progress
- permit-gate: not included
- enforcement: not included
- merged: false
- tagged: false
