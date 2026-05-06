# v6.20 — Execution-Bound Transition Validity Preview

## Status

Scope card only. Not implemented.

## One-Sentence Objective

Add a fixture-backed preview that explains whether a declared pre-execution transition preserves the already-mapped symbolic prerequisites needed for execution-bound validity, without granting, denying, blocking, or enforcing execution.

## Core Narrative

Transition explanation, not execution permission.

## Relationship To v6.17-v6.19

- `v6.17` establishes admissibility readiness / prerequisite explanation
- `v6.18` establishes execution-time authority drift / validity explanation
- `v6.19` maps requirements to symbolic guardrail surfaces
- `v6.20` may compare a declared transition against those frozen summaries
- `v6.20` does not recompute `v6.17-v6.19` decisions

## Recommended Scope

- focus on execution-bound transition validity preview
- use transition validity as the bounded comparison frame
- defer full state equivalence
- consume deterministic summaries / receipt refs only
- remain fixture-backed

`v6.20` should consume only frozen `v6.17-v6.19`-style artifacts by reference or deterministic summary:

- `v6.17` admissibility readiness / prerequisite summaries
- `v6.18` execution-time authority drift / validity summaries
- `v6.19` symbolic guardrail mapping summaries

## Out Of Scope

- no commit gate
- no permit gate
- no deployment gate
- no runtime enforcement
- no policy engine
- no full symbolic runtime
- no automatic blocker
- no execution authority grant
- no live repo reads
- no live source fetching
- no external API calls
- no commercial entitlement change
- no formal proof of state equivalence

## Candidate Future Object

`execution_bound_transition_validity_preview v1`

## Candidate Future CLI

Candidate only, not accepted:

- `guard transition explain --preview --json --fixture-file <file>`

## Candidate Future Output Invariants

- `preview: true`
- `explanation_only: true`
- `enforcement_action: "none"`
- `blocking_effect: false`
- `execution_authority_granted: false`
- `no_commit_gate: true`
- `no_permit_gate: true`
- `no_deployment_gate: true`
- `deterministic_hash`

## Candidate Future Exit Semantics

- `0` = successful preview explanation
- `2` = CLI usage / unknown command / missing required option
- `30` = malformed fixture / invalid schema
- `21` reserved for commercial/license gate and not used
- `25` reserved for permit gate deny and not used
- no new global exit semantics

## Candidate PR Plan If Approved Later

- `PR-A`: boundary doc, schema, one compact fixture bundle, preview verifier, optional CLI only if approved
- `PR-B`: hardening, final acceptance verifier, internal final acceptance doc

## File Growth Rule

- scope card PR: exactly 1 file
- future PR-A target: 6-7 files maximum
- future PR-B target: 2-3 files maximum
- no one-case-one-file fixture pattern

## Commercial Baseline Protection

- `v6.13.1` remains current commercial baseline
- no README/current docs change
- no `docs/product/current` change
- no `docs/demos/current` change
- no License Hub change
- no pricing change
- no commercial edition change
- no release notes
- no `mindforge.run` change

## Production Safety

- no production systems touched
- no network calls
- no database access
- no Paddle / Resend / Neon access
- no Vercel config change
- no deployment hooks
- no runtime mutation

## Risks And Mitigations

- risk: transition validity is mistaken for execution permission
  mitigation: keep `v6.20` fixture-backed, explanation-only, recommendation-only, and explicitly non-enforcing
- risk: state equivalence becomes a formal verification promise
  mitigation: defer full state equivalence and scope `v6.20` to preview-only transition explanation
- risk: `v6.20` becomes commit/deploy gating
  mitigation: prohibit commit, permit, deployment, blocking, and enforcement semantics in the scope card and any future output contract
- risk: CLI invites live repo inspection
  mitigation: keep any future CLI candidate fixture-backed only, with no live repo reads and no source fetching
- risk: consuming `v6.17-v6.19` creates lineage explosion
  mitigation: consume deterministic summaries / receipt refs only and avoid recomputing prior version objects

## Final Recommendation

Do not implement until this scope card is reviewed and approved.
