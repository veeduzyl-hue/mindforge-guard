# MindForge Guard v7.0 GitHub Release Candidate

## Status

- candidate text
- not published by this PR
- no tag created by this PR
- no package published by this PR
- current commercial baseline remains v6.13.1 unless separately approved

## Release Summary

- v7.0 adds a Single-Agent Governance Report preview path
- the preview path covers Evidence Pack, Pack Parser Preview, CLI Pack Validate Preview, Report Single-Agent Preview, and Human Review Reading View
- Report Experience By Edition is framed for Community, Pro, Pro+, and Enterprise

## User-facing Preview Commands

```bash
guard pack validate --pack <path> --preview --json
guard report single-agent --pack <path> --preview --json
```

## Report Experience By Edition

### Community

- current-state governance report preview

### Pro

- trend / timeline-oriented reading where released commands support it

### Pro+

- compare / correlate / deeper signals where released commands support them

### Enterprise

- same runtime entitlement as Pro+ in the current commercial boundary
- procurement / organizational adoption / governance packet framing
- no extra runtime authority

## Verify Chain

- `node scripts/verify_v7_0_readme_docs_candidate.mjs`
- `node scripts/verify_v7_0_report_edition_alignment.mjs`
- `node scripts/verify_v7_0_single_agent_governance_report_preview.mjs`
- `node scripts/verify_v7_0_single_agent_governance_report_cli_preview.mjs`
- `node scripts/verify_v7_0_single_agent_governance_report_final_acceptance.mjs`
- `node scripts/verify_v7_0_single_agent_governance_pack_preview.mjs`
- `node scripts/verify_v7_0_example_evidence_pack.mjs`
- `node scripts/verify_v7_0_pack_parser_preview.mjs`
- `node scripts/verify_v7_0_cli_pack_validate_preview.mjs`
- `node scripts/verify_v7_0_report_single_agent_preview.mjs`
- `node scripts/verify_v7_0_e2e_acceptance.mjs`
- `node scripts/verify_v7_0_commercial_release_gate_review.mjs`

## Not Included / Not Claimed in v7.0

`v7.0` does not provide:

- approval
- blocking
- safe-to-merge
- safe-to-deploy
- deployment approval
- legal compliance guarantee
- compliance certification
- maturity certification
- runtime control plane
- policy engine
- GitHub Action launched
- Marketplace available
- entitlement change
- pricing change

## Boundary

- recommendation-only
- non-executing
- non-control-plane
- local-first where applicable
- deterministic
- human-review-oriented
- no extra runtime authority for Enterprise

