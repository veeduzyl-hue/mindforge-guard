# Guard Non-Goals

## Purpose

This document lists what Outcome Foundation work is explicitly not trying to build.

It preserves the Guard-first boundary and avoids platform drift while the current `v7.1` commercial boundary remains untouched.

## Explicit Non-Goals

The current track does not aim to build:

- full SaaS
- multi-tenant control plane
- complex RBAC / SSO / SCIM
- multi-agent platform
- general Agent framework
- vulnerability scanner
- Codex replacement
- Daybreak replacement
- AI coding assistant
- automatic approval system
- automatic deployment
- automatic rollback
- exploit generation
- malware analysis platform
- model benchmark platform
- token monitoring platform
- agent marketplace
- long-term memory or vector database
- model routing layer
- hosted Evidence Pack storage

## Commercial Boundary Protection

The following are out of scope for this track:

- touching the current `v7.1` commercial boundary
- renaming current commercial release materials
- overwriting current commercial release materials
- repositioning current pricing, release notes, or public commercial packaging

New Outcome Foundation work is an engineering and productization track.
It is not a replacement for `v7.1` commercial packaging.

## Governance Boundary Protection

The current track also does not make Guard:

- an execution engine
- a tool runner
- an agent runtime
- a deployment controller
- a rollback controller
- a hidden approval authority
- a hosted verdict service

Guard Core remains the only governance source of truth.
Evidence Pack remains the only factual input.
