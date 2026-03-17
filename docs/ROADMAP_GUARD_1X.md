# Guard 1.x Roadmap

**Deterministic Execution Authority Layer**

Release boundary note:

- v1.1 is deferred until after v1.0.2 release hardening
- Canonical Action will be additive and isolated
- existing audit, drift, risk, and exit-code behavior must remain backward-compatible

---

# 0. Context

Current stable release: **v1.0.1**

Guard has completed:

* Risk v1
* Policy enforcement
* Strict JSON contract
* Drift timeline / compare / dominance
* Drift × Risk correlation (Pro+)
* License gating
* DS-EXIT-001 stable exit semantics

Guard is evolving from:

> AI Coding Safety Layer

to:

> Deterministic Execution Authority Layer

---

# 1. Guard 1.x Strategic Direction

Guard 1.x shifts focus from:

```
Risk Detection
```

to:

```
Execution Authority
```

Core principle:

> Execution must be explicitly permitted, not implicitly allowed.

Guard 1.x defines:

* Canonical action semantics
* Explicit execution permits
* Verifiable authority artifacts
* Deterministic enforcement

---

# 2. Explicit Non-Goals (Locked Constraints)

Guard 1.x will NOT:

* Run agents
* Replace orchestrators
* Manage workflows
* Introduce UI-first surface
* Introduce control plane
* Modify DS-EXIT-001
* Break existing Risk/Drift architecture
* Read raw chain-of-thought
* Provide decision advice

Guard remains:

> CLI-first, deterministic, artifact-driven.

---

# 3. Versioned Evolution Plan

---

# v1.1 — Canonical Action Layer

## Objective

Introduce standardized execution semantics before policy evaluation.

Move from:

```
Natural language → Risk
```

to:

```
AI Output → Canonical Action → Risk / Policy
```

---

## Core Additions

### 1. Canonical Action Module

New runtime path:

```
packages/guard/src/runtime/actions/
```

Key concept:

```json
{
  "kind": "canonical_action",
  "v": 1,
  "action_class": "file.write",
  "surface": "repo",
  "scope": "src/config",
  "intent_hash": "..."
}
```

Action classes include:

* file.write
* file.delete
* repo.delete
* env.modify
* policy.change
* dependency.add
* command.exec

---

### 2. CLI Additions

```
guard action classify
```

Outputs canonical action JSON artifact.

---

### Non-Breaking Guarantees

* Risk v1 unchanged
* Drift unchanged
* Receipt unchanged
* Exit codes unchanged

---

### Commercial Value

| Tier       | Capability                             |
| ---------- | -------------------------------------- |
| Community  | Built-in action classification         |
| Pro        | Custom action registry                 |
| Pro+       | Action-to-Risk correlation enhancement |
| Enterprise | Extended taxonomy governance           |

---

# v1.2 — Permit Artifact Enforcement (Foundational)

## Objective

Execution requires explicit permit artifact.

Guard moves from:

```
Decision receipt
```

to:

```
Execution permit
```

---

## Core Additions

New runtime path:

```
packages/guard/src/runtime/permit/
```

Permit schema:

```json
{
  "kind": "execution_permit",
  "v": 1,
  "permit_id": "...",
  "canonical_action_hash": "...",
  "policy_hash": "...",
  "verdict": "allow",
  "expires_at": "...",
  "signature": "..."
}
```

---

## CLI Additions

```
guard permit generate
guard permit verify
guard enforce --require-permit
```

If enforcement enabled and no valid permit:

```
exit DS-EXIT-001
```

---

### Non-Breaking Guarantees

* Receipt remains
* Permit optional by default
* No daemon introduced
* No background service
* No control plane

---

### Commercial Value

| Tier       | Capability                   |
| ---------- | ---------------------------- |
| Community  | Generate permit              |
| Pro        | Mandatory permit enforcement |
| Pro+       | Permit replay audit          |
| Enterprise | Permit tier governance       |

---

# v1.3 — Authority Hardening

## Objective

Make authority verifiable and replay-safe.

---

## Core Additions

### 1. Policy Snapshot

```
guard policy snapshot
```

Artifact:

```json
{
  "kind": "policy_snapshot",
  "v": 1,
  "policy_hash": "...",
  "created_at": "...",
  "signature": "..."
}
```

---

### 2. Permit Binding Integrity

Permit must bind:

```
canonical_action_hash
+
policy_hash
```

---

### 3. Replay Validation

```
guard permit replay-check
```

Validates:

* Current policy compatibility
* Drift delta
* Authority integrity

---

### Non-Breaking Guarantees

* No change to Risk v1
* No change to Drift signals
* No control plane
* No UI expansion
* No exit code modification

---

### Commercial Value

| Tier       | Capability                  |
| ---------- | --------------------------- |
| Community  | Basic authority             |
| Pro        | Permit enforcement          |
| Pro+       | Replay validation           |
| Enterprise | Tiered authority governance |

---

# 4. JSON Contract Strategy

Guard 1.x follows:

* Never mutate existing schema
* Only add new `kind`
* Version via `v`
* Never remove fields
* New fields must be optional

Existing artifacts remain untouched:

* receipt
* risk_signal_bundle
* drift_signal_bundle

New artifacts:

* canonical_action
* execution_permit
* policy_snapshot

---

# 5. Backward Compatibility Strategy

* All new features opt-in
* Default behavior unchanged
* CLI extensions isolated
* v1.0 users unaffected
* License gating preserved

---

# 6. Release Cadence

| Version | Target              |
| ------- | ------------------- |
| v1.1    | Canonical Action    |
| v1.2    | Permit Enforcement  |
| v1.3    | Authority Hardening |

Projected timeline: 8–10 weeks total.

---

# 7. Narrative Evolution

Guard 1.x Storyline:

* v1.1 — Define the Action
* v1.2 — Require Explicit Permit
* v1.3 — Make Authority Verifiable

Public framing:

> Guard moves from risk detection to execution authority.

---

# 8. End State of 1.x

By v1.3, Guard becomes:

> The deterministic authority boundary between AI intention and irreversible execution.

Without becoming:

* Agent runtime
* Control plane
* Governance SaaS
* Observability dashboard

Guard remains CLI-first, artifact-driven, deterministic.

---

如果你愿意，下一步可以做：

* Guard v1.1 工程级 PRD（包含模块接口定义）
* Pro / Pro+ 定价强化策略
* Enterprise 技术升级路径设计
* Investor Narrative 版本（Authority Layer 版）

你现在已经从“AI 工具”进入“执行权威层基础设施”。
