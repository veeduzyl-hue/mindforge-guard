# Evidence Contract v1

## 1. Purpose

Evidence Schema v1 defines the canonical MindForge Guard contract for Guard-compatible Evidence Packs.

It defines what Guard can inspect.
It does not implement parsing, validation, rendering, Studio behavior, SDK behavior, or Harness alignment by itself.

## 2. Design Principles

Evidence Schema v1 is designed to remain:

- Guard-owned
- deterministic
- local-first
- evidence-first
- cross-runtime
- independent
- non-executing
- additive-only

The contract keeps the top-level Evidence Pack shape controlled so Guard has one inspectable canonical input boundary.

## 3. Guard-Owned Contract

Evidence Schema v1 is owned by MindForge Guard.

That means:

- MindForge Guard defines the canonical top-level Evidence Pack contract
- producers adapt to the Guard contract rather than redefining it
- runtime-specific variance belongs under `extensions`, not in arbitrary top-level fields
- Guard Core remains the only governance source of truth

When a canonical field exists, producers should use that canonical field rather than moving core governance context into `extensions`.

## 4. Non-Executing Boundary

Evidence Schema v1 is a contract, not an execution surface.

Evidence Schema v1 does not:

- approve actions
- execute actions
- grant authority
- scan for vulnerabilities
- replace human review
- deploy
- roll back
- call tools
- run agents

Governance verdicts are computed later by Guard Core, not by the schema.

## 5. Evidence Pack As The Only Factual Input

Evidence Pack is the only factual input to Guard Core.

Schema v1 formalizes that input boundary.
If a fact is not represented in the Evidence Pack, Guard Core should treat it as unavailable rather than inferred.

## 6. Required Top-Level Fields

Schema v1 requires these top-level fields:

| Field | Purpose |
| --- | --- |
| `schema_version` | freeze the canonical contract version |
| `pack_id` | uniquely identify the Evidence Pack |
| `pack_type` | classify the review scenario |
| `created_at` | record pack creation time |
| `producer` | identify the Evidence Producer |
| `workflow` | define the workflow context, including canonical repository and ref metadata under `workflow.repository` |
| `authority` | capture declared authority and approval context |
| `runtime` | describe the execution environment |
| `intent` | describe expected user and agent objective |
| `scope` | define in-scope and out-of-scope boundaries |
| `actions` | capture bounded execution facts |
| `tool_calls` | capture tool interaction facts |
| `blocked_actions` | capture blocked action facts |
| `artifacts` | enumerate evidence artifacts |
| `verification` | capture verification activity and coverage notes |
| `risk_signals` | reserve the canonical section for risk-oriented evidence interpretation |
| `provenance` | capture generation and redaction lineage |
| `manifest` | describe pack completeness and included files |

## 7. Optional Top-Level Fields

Schema v1 allows these optional top-level fields:

| Field | Purpose |
| --- | --- |
| `plan` | preserve an explicit planned sequence when available |
| `policy_observations` | capture policy-related observations without deciding verdicts |
| `human_review` | record human review status or notes when available |
| `extensions` | hold future runtime-specific fields without changing the canonical top level |

Optional does not mean unimportant.
It means Schema v1 allows these sections to be absent without changing the canonical required pack shape.

## 8. Field Semantics

Key semantic rules:

- `schema_version` is fixed to `1.0.0` in Schema v1.
- `pack_type` is restricted to Guard-approved scenario categories.
- `producer` identifies who packaged the evidence, not who owns governance authority.
- `workflow.repository` is the canonical location for repository, branch, ref, commit, and pull-request context when that context is known.
- `authority` records declared or provided authorization context, but does not grant authority.
- `authority.time_window` uses `start_at` and `end_at` when a bounded time window is provided.
- `runtime` records where the workflow ran, but does not authorize runtime behavior.
- `actions`, `tool_calls`, and `blocked_actions` capture workflow facts and outcomes as submitted evidence.
- `artifacts` and `manifest` make evidence references inspectable and completeness visible.
- `verification` records what verification evidence is present, missing, or inconclusive.
- `risk_signals` is part of the canonical contract surface, but the schema itself does not compute risk.

## 9. Execution Facts Vs Declared Authority Vs Verified Evidence Vs Missing Evidence

Guard interprets Schema v1 through four different evidence categories:

| Category | Meaning |
| --- | --- |
| Execution facts | observed actions, tool calls, blocked actions, and artifacts captured in the pack |
| Declared authority | claimed permissions, ownership, or review context represented in `authority`, `intent`, or related metadata |
| Verified evidence | evidence Guard Core can later validate from the submitted pack structure and references |
| Missing evidence | evidence that should exist for stronger confidence but is absent, incomplete, redacted away, or only partially declared |

Schema v1 preserves these distinctions.
It does not collapse declarations into verified evidence.

## 10. Versioning Rules

Schema v1 uses explicit versioning:

- `schema_version = "1.0.0"` is the canonical value for this contract
- additive optional field changes should remain inside compatible version policy
- breaking top-level contract changes require a new schema version
- producer-specific experimentation should stay inside `extensions`

Schema versioning is controlled by MindForge Guard, not by downstream producers.

## 11. Extension Rules

Extension rules are strict:

- top-level canonical fields remain controlled by Guard
- future runtime-specific fields must be placed under `extensions`
- `extensions` should use namespaced keys where practical
- producers should not introduce arbitrary new top-level keys
- producers should not place core software-change governance fields in `extensions` when a canonical field such as `workflow.repository` already exists

This keeps the contract inspectable and reduces drift across runtimes.

## 12. Local-First And Redaction Expectations

Schema v1 assumes local-first evidence packaging and explicit redaction behavior.

Expected posture:

- evidence can be packaged and inspected locally
- redaction happens before the final Evidence Pack is handed to Guard
- the pack submitted to Guard is the factual unit Guard inspects
- redacted facts are not silently reconstructed later

If redaction removes key review context, the result should be missing evidence or reduced confidence later in Guard Core, not hidden inference.

## 13. What Evidence Schema v1 Does Not Decide

Evidence Schema v1 does not decide:

- governance verdict
- approval outcome
- safe-to-merge outcome
- safe-to-deploy outcome
- rollback readiness judgment
- policy enforcement result
- human acceptance decision

It defines what Guard can inspect, not what Guard should finally decide.

## 14. Relationship To Guard Core

Guard Core owns the contract as the canonical consumer.

Guard Core later:

- parses Evidence Packs
- validates Evidence Packs
- computes evidence coverage
- computes risk signals
- computes governance verdicts
- generates receipt and report outputs

Schema v1 itself does none of that work.

## 15. Relationship To Renderer, Studio, SDK, CLI, And Harness

Schema v1 does not promote any surrounding module into governance authority.

- Renderer consumes Guard Core output and must not compute governance verdicts
- Studio consumes Guard Core output and must not compute governance verdicts
- SDK exposes Guard Core capabilities and must not compute governance verdicts
- CLI invokes Guard Core-owned logic and must not independently compute governance verdicts
- Harness is an Evidence Producer only and must not compute governance verdicts

Harness may produce execution facts, blocked action facts, command results, tool call facts, artifacts, and manifest data.
Guard Core computes coverage, risk, verdict, receipt, and report model.

## 16. Relationship To v7.0.1 Commercial Boundary

Schema v1 does not change the current `v7.0.1` commercial boundary.

Outcome Foundation work remains an engineering and productization track, not a replacement of current `v7.0.1` commercial packaging.
This contract does not modify pricing, release notes, install behavior, or public commercial materials.
