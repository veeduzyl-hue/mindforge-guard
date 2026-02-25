# Guard

**AI Coding Governance Layer**  
Drift Intelligence · Risk Signal · License-Aware CLI

Guard is the first commercial product of the **MindForge CDS (Cognitive Decision System)**.

It provides deterministic, offline governance for AI-native development workflows.

------------------------------------------------------------------------

## Why Guard Exists

AI coding tools accelerate development — but they also introduce:

- Hidden structural drift  
- Unbounded refactors  
- Silent risk amplification  
- Non-deterministic CI behavior  

Guard introduces a governance layer between AI-generated change and production acceptance.

It is not an observability dashboard.  
It is a **decision boundary system**.

------------------------------------------------------------------------

## Core Capabilities

### Drift Intelligence

- Drift density  
- Unique module expansion  
- Time-bucketed drift timeline  
- Window comparison  

```bash
guard drift status
guard drift timeline
guard drift compare
```

------------------------------------------------------------------------

### Risk Signal Awareness

- Risk score trends  
- Drift × risk correlation  
- Lag analysis  
- Stability diagnostics  

```bash
guard assoc correlate
```

------------------------------------------------------------------------

### Deterministic Exit Codes

Guard is CI-first.

| Code | Meaning |
|------|---------|
| 0    | Success |
| 10   | Soft governance block |
| 20   | Hard governance block |
| 21   | License required |
| 30   | License invalid / expired |

Stable exit codes make Guard safe for CI/CD integration.

------------------------------------------------------------------------

## Editions

| Edition     | Drift Timeline | Drift Compare | Assoc Correlate |
|------------|----------------|---------------|-----------------|
| Community | ❌             | ❌            | ❌              |
| Pro       | ✅             | ❌            | ❌              |
| Pro+      | ✅             | ✅            | ✅              |

Community is default.  
Pro unlocks timeline.  
Pro+ unlocks compare and correlation.

------------------------------------------------------------------------

## Open Core Model

Guard follows an open-core architecture.

The core governance runtime is open source.

Advanced analytics modules (Drift Timeline, Drift Compare, Association Correlation) require a signed Pro or Pro+ license.

Licensing is:

- Offline  
- Cryptographically signed (Ed25519)  
- Deterministic  
- CI-safe  

Community edition remains fully usable without a license.

------------------------------------------------------------------------

## License Model

Guard uses:

- Ed25519 signatures  
- Canonical JSON signing  
- Embedded public key verification  
- Offline license validation  

Install license:

```bash
guard license install <file>
```

Stored at:

~/.guard/license.json

------------------------------------------------------------------------

## Quick Start

Community mode:

```bash
node ./packages/guard/src/runGuard.mjs drift status
```

Activate license:

```bash
guard license install pro.license.json
```

------------------------------------------------------------------------

## Architecture Positioning

Guard is not:

- Another agent dashboard  
- A SaaS monitoring tool  

Guard is:

- A governance boundary  
- A structural intelligence layer  
- A deterministic CLI contract  

It sits between AI execution and organizational acceptance.

------------------------------------------------------------------------

## Who Guard Is For

- AI-native solo developers  
- Startup engineering teams  
- CI-driven product orgs  
- Enterprises adopting AI coding  

------------------------------------------------------------------------

## Status

- License system: stable (v2)  
- Exit code contract: stable  
- Drift engine: deterministic  
- Commercial gating: active  

Guard is production-ready.
