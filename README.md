# Guard

**Deterministic Governance Boundary for AI-Generated Code**  
Drift Intelligence · Risk Signals · License-Aware CLI

Guard is the first commercial product of the **MindForge CDS (Cognitive Decision System)**.

It provides a deterministic, offline governance layer between AI-generated change and production acceptance.

---

## 🚀 30‑Second Overview

AI coding tools accelerate development — but they also introduce:

- Hidden structural drift  
- Unbounded refactors  
- Silent risk amplification  
- Non-deterministic CI behavior  

Guard establishes a **decision boundary** between AI execution and organizational approval.

It is **not** an observability dashboard.  
It is a **governance contract for AI-native development.**

---

## ⚡ Quick Start (Community Mode)

Run drift status:

```bash
node ./packages/guard/src/runGuard.mjs drift status
```

Try a Pro feature without a license:

```bash
node ./packages/guard/src/runGuard.mjs drift timeline; echo $?
```

You will receive:

- Structured JSON error  
- Exit code `21` (LICENSE_REQUIRED)  

Install a license:

```bash
guard license install <file>
```

Then re-run:

```bash
node ./packages/guard/src/runGuard.mjs drift timeline
```

---

## 🧠 Core Capabilities

### Drift Intelligence

- Drift density  
- Unique module expansion  
- Time-bucketed timeline  
- Window comparison  

```bash
guard drift status
guard drift timeline
guard drift compare
```

### Risk Signal Awareness

- Risk score trends  
- Drift × risk correlation  
- Lag analysis  
- Stability diagnostics  

```bash
guard assoc correlate
```

---

## 🔐 Deterministic Exit Codes (CI‑Safe)

Guard is CI-first.

| Code | Meaning |
|------|---------|
| 0    | Success |
| 10   | Soft governance block |
| 20   | Hard governance block |
| 21   | License required |
| 30   | License invalid / expired |

These exit codes are stable and safe to rely on in CI/CD pipelines.

---

## 📦 Editions

| Edition     | Drift Timeline | Drift Compare | Assoc Correlate |
|------------|----------------|---------------|-----------------|
| Community | ❌             | ❌            | ❌              |
| Pro       | ✅             | ❌            | ❌              |
| Pro+      | ✅             | ✅            | ✅              |

- **Community** → Core governance runtime  
- **Pro** → Time-series drift intelligence  
- **Pro+** → Comparative and correlation diagnostics  

---

## 🧩 Open-Core Architecture

Guard follows an **open-core model**.

The core governance engine is open source.

Advanced analytics modules require a signed Pro or Pro+ license.

Licensing is:

- Offline  
- Cryptographically signed (Ed25519)  
- Canonical JSON verified  
- Deterministic  
- CI-safe  

Community edition remains fully usable without a license.

---

## 🏗 Architecture Positioning

Guard is not:

- An agent dashboard  
- A SaaS monitoring tool  
- A cloud-dependent service  

Guard is:

- A governance boundary  
- A structural intelligence layer  
- A deterministic CLI contract  

It sits between AI execution and organizational acceptance.

---

## 👥 Who Guard Is For

- AI-native solo developers  
- Startup engineering teams  
- CI-driven product organizations  
- Enterprises adopting AI coding  

---

## 📚 Documentation

- docs/LICENSE.md → Licensing guide  
- docs/EDITIONS.md → Feature matrix  
- docs/SECURITY.md → Signing and verification model  

---

## 🟢 Status

- License system: stable (v2)  
- Exit code contract: stable  
- Drift engine: deterministic  
- Commercial gating: active  

Guard is production-ready.

---

## 📣 About MindForge

Guard is the first commercial product in the MindForge CDS ecosystem — a Cognitive Decision System designed for deterministic governance in AI-native environments.
