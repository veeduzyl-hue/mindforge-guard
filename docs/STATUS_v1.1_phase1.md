# Guard v1.1 Phase 1 Status

## Scope

This document records the freeze state for **Guard v1.1 Phase 1** on branch:

- `v1.1-canonical-action`

Phase 1 in this cut has a single goal:

- safely introduce `guard action classify` as the first Canonical Action Layer surface

This status file is a freeze record for branch review. It is **not** a release tag note and does **not** imply v1.1 is fully complete.

---

## Phase Goal

The only target for this phase was:

- add `guard action classify`

Required constraints for this cut:

- additive only
- deterministic
- side-effect free
- no audit writes
- no drift writes
- no snapshot writes
- no Risk v1 changes
- no policy enforcement hookup
- no permit hookup
- no change to v1.0.2 stable command contracts
- no change to DS-EXIT-001 semantics

---

## Delivered Surface

The following command surface is now available:

```bash
guard action classify --text "<string>"
```

Current supported input form:

- `--text "<string>"`
- `--text=<string>`

Current output shape:

- JSON artifact
- `kind: "canonical_action"`
- stable canonical action hash
- deterministic output for equivalent normalized input

Example output shape:

```json
{
  "kind": "canonical_action",
  "version": "v1",
  "input": {
    "text": "write file README.md"
  },
  "action": {
    "action_class": "file.write",
    "canonical_label": "file.write",
    "target_type": "file",
    "target_ref": "README.md",
    "attributes": {
      "surface": "repo",
      "risk_hint": "mutation"
    }
  },
  "canonical_action_hash": "sha256:...",
  "deterministic": true,
  "side_effect_free": true
}
```

---

## Commits in This Cut

Relevant commits for this phase cut:

- `c10fb27` — `feat(actions): emit canonical_action artifact for classify`
- `554d0b6` — `feat(cli): wire action classify into guard CLI`

These commits are intentionally separated into:

1. runtime/actions artifact layer
2. CLI integration layer

This preserves review clarity and keeps the change bounded.

---

## Files Changed

Files changed for this phase cut:

- `packages/guard/src/runtime/actions/canonical.schema.json`
- `packages/guard/src/runtime/actions/classify.mjs`
- `packages/guard/src/runtime/actions/hashAction.mjs`
- `packages/guard/src/runtime/actions/index.mjs`
- `packages/guard/src/cli/action.mjs`
- `packages/guard/src/runGuard.mjs`

Files explicitly not changed:

- `packages/guard/src/runAudit.mjs`
- `packages/guard/src/runtime/drift/*`
- `packages/kernel/src/risk_v1.mjs`
- `packages/guard/src/product/license*.mjs`

Unrelated local file not included in this cut:

- `packages/guard/package-lock.json` (untracked, not part of this phase commit set)

---

## Behavioral Boundaries Preserved

This phase **does not** do any of the following:

- does not write audit artifacts
- does not trigger drift
- does not modify snapshot behavior
- does not alter Risk v1
- does not connect to policy enforcement
- does not connect to permit or license gating
- does not inject canonical action data into existing audit / drift / snapshot / risk outputs
- does not change existing v1.0.2 stable command defaults
- does not alter DS-EXIT-001 semantics

---

## Manual Verification Summary

The following commands were manually executed and verified:

### Help / dispatch verification

```bash
node packages/guard/src/runGuard.mjs --help
node packages/guard/src/runGuard.mjs action --help
node packages/guard/src/runGuard.mjs action classify --help
node packages/guard/src/runGuard.mjs action unknown
```

Verified outcomes:

- top-level help remains available
- `action --help` resolves correctly
- `action classify --help` resolves to subcommand help
- unknown subcommand behavior is bounded and reasonable

### New command verification

```bash
node packages/guard/src/runGuard.mjs action classify --text "write file README.md"
node packages/guard/src/runGuard.mjs action classify --text "write file README.md"
node packages/guard/src/runGuard.mjs action classify --text " write   file   README.md "
```

Verified outcomes:

- command runs successfully
- output artifact kind is `canonical_action`
- repeated equivalent input produces stable output
- normalized equivalent input produces the same canonical result and hash

### Existing command regression check

```bash
node packages/guard/src/runGuard.mjs status
node packages/guard/src/runGuard.mjs validate-policy
node packages/guard/src/runGuard.mjs drift status
node packages/guard/src/runGuard.mjs license status
```

Verified outcomes:

- commands still run
- no observed regression in default behavior
- no canonical action fields injected into existing outputs

### Side-effect check

A manual before/after check was performed against local runtime state (including `.mindforge` inspection).

Verified outcome:

- no new audit/drift/snapshot/runtime state writes observed from `action classify`

---

## Engineering Judgment

Current engineering judgment for this branch state:

- `guard action classify` is successfully introduced as the first Canonical Action Layer cut
- implementation remains additive-only relative to v1.0.2
- compatibility boundary is preserved
- the branch is suitable for push and branch review
- this state is appropriate for **tag-prep freeze**, but not yet a release tag

---

## Current Status

Status of this branch cut:

- **phase:** v1.1 Phase 1
- **cut:** Canonical Action classify
- **state:** frozen for review
- **tag status:** not tagged
- **release judgment:** review-ready, not release-tagged

---

## Next Immediate Step

Recommended next action:

1. push branch
2. keep this cut frozen
3. perform human review against the two phase commits
4. defer further Canonical Action expansion until this cut is explicitly accepted

Suggested commands:

```bash
git status --short
git push -u origin v1.1-canonical-action
git add docs/STATUS_v1.1_phase1.md
git commit -m "docs(status): record v1.1 phase 1 classify freeze state"
git push
```
