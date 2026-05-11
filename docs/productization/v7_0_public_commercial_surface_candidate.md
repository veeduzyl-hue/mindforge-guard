# v7.0 Public / Commercial Surface Candidate

## 1. Scope

- Candidate review only
- No public launch
- No direct public surface edit
- No README edit
- No docs/product/current edit
- No License Hub edit
- No pricing edit
- No mindforge.run edit
- No release notes edit
- No public demo edit
- No entitlement change
- No GitHub Action
- No Marketplace work
- No compliance / certification / approval / blocking claim

## 2. Current Baseline

MindForge Guard v6.13.1 remains the current commercial baseline until separately changed.

v7.0 has passed internal E2E acceptance and commercial release gate review.
v7.0 is ready for public/commercial surface candidate preparation, but this PR does not launch it.

## 3. Candidate Surface Inventory

| Surface | Candidate Action | Risk Level | Requires Explicit Approval Before Real Edit | Notes |
| --- | --- | --- | --- | --- |
| README | draft update candidate | medium | yes | future separate PR, not in this PR |
| docs/product/current/* | draft update candidate | medium | yes | future separate PR, not in this PR |
| License Hub | no entitlement change | high | yes | future separate PR, not in this PR |
| pricing | no pricing change | high | yes | future separate PR, not in this PR |
| mindforge.run | draft update candidate | high | yes | future separate PR, not in this PR |
| release notes | future separate PR | low | yes | not in this PR |
| public demos | future separate PR | medium | yes | not in this PR |
| GitHub Action / Marketplace | future separate PR | high | yes | not in this PR |

## 4. Candidate Messaging Pillars

- Evidence Pack to Governance Report
- Files in, deterministic governance report out
- Single-Agent Governance Report Preview
- Authority / Permission Boundary
- Execution / Behavior Evidence
- Risk / Drift / Maturity Signals
- Preview-only, non-executing, recommendation-oriented
- No approval / blocking / deployment / merge authority

## 5. Edition Candidate Positioning

Community:
- basic governance visibility
- first evidence-backed report visibility
- no CI bundle promise

Pro:
- single-agent readiness and evidence-backed review
- no approval or deployment safety promise

Pro+:
- PR / CI governance bundle candidate
- no launched GitHub Action or CI blocking promise

Enterprise:
- evidence package / retention / policy hierarchy candidate
- no control plane, orchestrator, legal compliance, or certification promise

This section is candidate positioning only.
It does not change entitlement.

## 6. Candidate Public Claims Allowed

- v7.0 has an internal E2E-accepted single-agent Evidence Pack to Report Preview path
- v7.0 can validate a local Evidence Pack in preview mode
- v7.0 can generate a local single-agent governance report preview
- v7.0 remains local-first, deterministic, non-executing, and evidence-oriented
- v7.0 helps human reviewers see authority boundary, evidence, risk, drift, and maturity signals

## 7. Candidate Public Claims Blocked

- compliance certified
- legally compliant
- maturity certified
- approved for deployment
- safe to merge
- safe to deploy
- automatic blocking
- required CI gate
- GitHub Action launched
- Marketplace available
- enterprise control plane
- orchestrator
- autonomous enforcement
- production runtime monitoring
- entitlement changed
- pricing changed

## 8. Recommended Public Surface Update Sequence

PR A:
README / docs candidate only

PR B:
docs/product/current first-report and report-reading candidate

PR C:
License Hub copy candidate, only if explicitly approved

PR D:
mindforge.run copy candidate, only if explicitly approved

PR E:
release notes candidate

PR F:
GitHub Action readiness / wrapper, separate from v7.0 public launch

Do not bundle pricing, entitlement, GitHub Action, and public docs into one PR.

## 9. Launch Gate Still Required

Even after this candidate review, public launch requires a separate explicit approval.

Required before launch:
- final public copy review
- edition entitlement review
- pricing boundary review
- License Hub deployment risk review
- website deployment risk review
- release notes review
- rollback / revert plan
- final verifier run on main

## 10. Recommended Next Decision

Allowed values:
- hold_public_surface_candidate
- prepare_readme_docs_candidate
- prepare_license_hub_candidate
- prepare_github_action_readiness_plan

Recommended:
- prepare_readme_docs_candidate

Clarify:
This only authorizes a future candidate PR for README / documentation surface review.
It does not authorize pricing changes, entitlement changes, License Hub deployment, mindforge.run publication, GitHub Action implementation, Marketplace work, or compliance claims.
