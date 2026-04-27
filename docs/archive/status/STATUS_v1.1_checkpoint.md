# Guard v1.1 Checkpoint Status

## Scope

This document records the current **Guard v1.1 checkpoint** state on `main`.

It is:

- a checkpoint freeze record
- a summary of what `main` currently includes
- a post-merge engineering judgment

It is not:

- a release tag note
- a Phase 3 plan
- a statement that v1.1 is fully release-tag ready

---

## What is included

`main` currently includes the two completed v1.1 cuts:

- Phase 1: `guard action classify`
- Phase 2: canonical action contract hardening

Current v1.1 capability on `main`:

- `guard action classify --text "<string>"`
- JSON artifact output with `kind: "canonical_action"`
- stable canonical action hash
- deterministic normalization for equivalent input text
- local schema validation before artifact output
- fail-closed behavior for invalid classify output
- minimal verification script:
  - `scripts/verify_canonical_action_contract.mjs`

Relevant merged checkpoints:

- `a7dba7d` - `v1.1 phase 1: add canonical action classify cut (#2)`
- `350c508` - `v1.1 phase 2: harden canonical action contract (#3)`

---

## What is explicitly not included

The current checkpoint does not include any of the following:

- no audit integration
- no drift integration
- no snapshot integration
- no risk integration
- no policy enforcement hookup
- no permit hookup
- no new action subcommands beyond `action classify`
- no action command family expansion such as `emit`, `explain`, or `normalize`
- no widened vocabulary expansion beyond the existing bounded classify surface
- no mutation of v1.0.2 stable command contracts
- no mutation of DS-EXIT-001 semantics

Canonical action output remains isolated from existing audit / drift / snapshot / risk outputs.

---

## Validation summary

The following merge-after checks were executed on `main`:

```bash
node packages/guard/src/runGuard.mjs action classify --text "write file README.md"
node packages/guard/src/runGuard.mjs action classify --text "   "
node scripts/verify_canonical_action_contract.mjs
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs drift status
node packages/guard/src/runGuard.mjs license status
```

Observed results:

- `action classify` returns a valid `canonical_action` artifact
- blank input fails closed with structured JSON error and non-zero exit
- canonical action verify script passes
- `status` shows no regression
- `validate-policy` shows no regression
- `drift status` shows no regression
- `license status` shows no regression

---

## Engineering judgment

Current engineering judgment:

- yes, the current `main` state forms a clear v1.1 checkpoint
- the checkpoint boundary is narrow and well-defined
- it is suitable for freeze and later tag-prep evaluation
- it should not yet be treated as a final release tag state

Why this qualifies as a checkpoint:

- Phase 1 introduced the new canonical action surface
- Phase 2 hardened that surface into a machine-consumable contract
- both cuts remain additive-only relative to v1.0.2
- no existing stable command surface was repurposed
- no existing execution chain was coupled to canonical action

Why this is not yet a final release tag:

- the current state is still a bounded checkpoint rather than a full v1.1 feature-complete release
- the correct immediate posture is freeze, not tag
- any tag-prep decision should happen explicitly after checkpoint review, not implicitly from merge state

---

## Current status

- checkpoint state: `checkpoint-ready`
- branch state: merged into `main`
- tag-prep judgment: candidate, but not yet approved
- tag state: not tagged
- repository posture: frozen pending next planning decision

