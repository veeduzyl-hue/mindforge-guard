# Schema Compatibility Matrix

## 1. Purpose

This document explains how Guard Evidence Schema v1 relates to expected `guard-native-agent-harness v0.5.x` outputs.

It is a compatibility-direction document, not a parser, fixture, or runtime alignment implementation.

## 2. Compatibility Direction

Compatibility direction is one-way:

- Guard Evidence Schema v1 is the canonical MindForge Guard contract
- Harness outputs should map toward the Guard contract
- raw Harness outputs are not assumed to already equal the canonical Guard pack

This preserves Guard-owned contract control and keeps Harness in the producer role.

## 3. Guard Schema v1 As Canonical Contract

Guard Schema v1 is the canonical contract for Guard-compatible Evidence Packs.

That means:

- Guard owns the top-level structure
- Guard Core remains the only governance source of truth
- Harness is a producer, not a governance authority
- Renderer, Studio, SDK, and CLI remain consumers of Guard Core logic rather than alternate verdict engines

## 4. Expected Mapping From guard-native-agent-harness v0.5.x Outputs

The table below describes the expected direction of mapping from likely Harness-produced facts into the Guard canonical contract.

| Guard Evidence Schema v1 field | Expected Harness v0.5.x source | Compatibility status | Notes |
| --- | --- | --- | --- |
| `schema_version` | Guard-owned wrapper field | guard-only | Harness should not define the canonical Guard schema version. |
| `pack_id` | run identifier or export identifier | partial | Likely derivable, but may need Guard-side normalization. |
| `pack_type` | workflow classification metadata | partial | May require Guard-side mapping into canonical enum values. |
| `created_at` | export timestamp | available | Typically available from producer timestamps. |
| `producer` | harness identity metadata | available | Producer identity is expected from Harness. |
| `workflow` | repo, run, branch, ref, and workflow context | partial | Guard-side shaping may still be needed to populate canonical `workflow.repository` fields such as provider, branch, base_ref, head_ref, commit_sha, and pr_number. |
| `authority` | declared permissions, allowed actions, reviewer notes | partial | Often partially declared, but not guaranteed to be fully evidenced. |
| `runtime` | runtime metadata, model/runtime info, available tools | available | Expected from Harness execution context. |
| `intent` | task prompt, user goal, agent task summary | partial | Usually present, but may need canonical shaping. |
| `scope` | allowed paths, touched files, declared limits | partial | Often partial and may require explicit out-of-scope completion. |
| `plan` | internal step plan or task list | future | May exist later, but not assumed in v0.5.x baseline. |
| `actions` | action log or operation trace | available | Harness is expected to produce bounded execution facts. |
| `tool_calls` | tool invocation trace | available | Harness is expected to produce tool call facts. |
| `blocked_actions` | blocked action trace | available | Harness may produce blocked action facts directly. |
| `artifacts` | exported logs, diffs, files, screenshots, outputs | available | Artifact references are expected producer material. |
| `verification` | test commands, command results, verification outputs | partial | Some verification evidence may be present, but coverage framing may be incomplete. |
| `policy_observations` | policy hints or declared controls | future | Not required for basic producer alignment. |
| `human_review` | reviewer notes or external review metadata | missing | Usually outside Harness runtime collection. |
| `risk_signals` | Guard-side evidence interpretation | guard-only | Harness should not compute Guard risk signals as governance output. |
| `provenance` | export metadata, redaction markers, deterministic export details | partial | Some provenance may exist, but canonical fields may need Guard-side wrapping. |
| `manifest` | file list, export contents, completeness view | partial | File inventory is likely available; completeness classification may need Guard-side normalization. |
| `extensions` | runtime-specific fields outside canonical surface | future | Reserved for future bounded expansion and not the canonical location for repository metadata when `workflow.repository` applies. |

## 5. Fields Likely Already Available From Harness

The following fields are the best fit for producer-owned output:

- `producer`
- `created_at`
- `runtime`
- `actions`
- `tool_calls`
- `blocked_actions`
- `artifacts`
- parts of `workflow`
- parts of `verification`
- parts of `manifest`

These are evidence-production surfaces, not governance-decision surfaces.

## 6. Fields Likely Missing Or Partially Declared

The following fields are likely to be incomplete, absent, or only declared in many Harness-produced outputs:

- `pack_id`
- `pack_type`
- `workflow`
- `authority`
- `intent`
- `scope`
- `verification`
- `provenance`
- `manifest`
- `human_review`
- `plan`

This is acceptable for a compatibility-direction document.
It means raw Harness output may still require Guard-side packaging or normalization before it satisfies the canonical contract.
That includes shaping producer metadata into canonical `workflow.repository` fields and preserving `authority.time_window` with `start_at` / `end_at`.

## 7. Fields That Must Remain Guard-Side Only

The following areas must remain Guard-side only:

- canonical schema version control
- evidence coverage computation
- risk interpretation as governance signal
- governance verdict computation
- governance receipt generation
- unified report model generation

Harness should not compute governance verdicts.
Harness may produce execution facts, blocked action facts, command results, tool call facts, artifacts, and manifest data.
Guard Core computes coverage, risk, verdict, receipt, and report model.

## 8. Migration Notes

Migration from Harness `v0.5.x` toward Schema v1 should follow these principles:

- preserve raw producer facts where possible
- normalize into canonical Guard enums and field names
- avoid moving governance logic into Harness
- keep top-level Guard contract ownership inside MindForge Guard
- use `extensions` for runtime-specific producer fields that do not belong in the canonical top level

Canonical repository metadata for software-change governance should map to `workflow.repository`, not to `extensions`.

This document does not implement migration logic.

## 9. Non-Goals

This compatibility matrix does not:

- implement Harness alignment
- create fixtures
- create parser or validator logic
- create report generation
- change the current `v7.0.1` commercial boundary
- change Guard-first positioning
- turn Harness into a governance authority
