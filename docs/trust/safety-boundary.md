# Safety Boundary

## Purpose

This page explains the trust and safety boundary for the current stable release.

## What Guard Does Today

MindForge Guard is a local-first governance CLI for AI-assisted coding workflows.

In the current stable release, Guard helps teams:

- inspect current repo governance state
- classify AI-assisted actions into deterministic artifacts
- review drift signals
- verify local license state without moving runtime authority into a hosted control plane

## What Guard Does Not Do

In the current stable release, Guard does not:

- take over user execution paths
- silently execute code changes on the user's behalf
- replace the developer's repo workflow
- require an always-on hosted runtime
- turn into a control plane, orchestrator, or dashboard-first product

Guard stays recommendation-oriented and non-executing by default.

## Non-Executing By Default

The current Guard posture remains:

- recommendation-only
- additive-only
- non-executing by default
- default-off where applicable

That means Guard can inspect, classify, summarize, validate, and gate edition-specific analytics access, but it does not become an autonomous runtime authority over the main development path.

## Local And Explicit By Design

Paid capabilities in the current stable release are enabled through a signed local license JSON.

That keeps the runtime path explicit:

- the CLI runs locally
- paid access is unlocked by a locally installed signed license file
- command availability is visible and edition-gated rather than hidden behind a service takeover

License awareness controls access to paid analytics. It does not give Guard hidden authority over user execution paths.

## Current Trust Model

For the current stable release, the trust model is:

1. install the CLI locally
2. inspect version, help, and status locally
3. initialize and validate local repo policy when needed
4. run deterministic inspection commands
5. install a signed local license only if paid analytics are needed

This model preserves offline authority for the CLI runtime path and keeps hosted commercial surfaces additive.

## Related References

- [Quickstart](../quickstart.md)
- [First 10 Minutes With Guard](../first-10-minutes.md)
- [License Activation](../license-activation.md)
- [Editions And Command Map](../EDITIONS.md)
- [Trust FAQ](../product/current/trust-faq.md)
