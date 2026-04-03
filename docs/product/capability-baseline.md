# Capability Baseline

## SKU baseline

MindForge Guard currently has four canonical editions:

- Community
- Pro
- Pro+
- Enterprise

The edition matrix itself is unchanged in this document. This page explains the current product packaging around that matrix.

## Guard CLI capabilities by edition

| Capability | Community | Pro | Pro+ | Enterprise |
|---|---|---|---|---|
| `status` | Yes | Yes | Yes | Yes |
| `validate-policy` | Yes | Yes | Yes | Yes |
| `audit` | Yes | Yes | Yes | Yes |
| `snapshot` | Yes | Yes | Yes | Yes |
| `action classify` | Yes | Yes | Yes | Yes |
| `drift status` | Yes | Yes | Yes | Yes |
| `drift timeline` | No | Yes | Yes | Yes |
| `drift compare` | No | No | Yes | Yes |
| `assoc correlate` | No | No | Yes | Yes |
| local license install/status/show/remove | Yes | Yes | Yes | Yes |

## License Hub supporting surfaces

These surfaces support the commercial lifecycle but do not redefine CLI entitlement:

| Surface | Current state |
|---|---|
| customer portal download | real delivery surface |
| account orders/licenses/billing view | real delivery surface |
| admin resend/revoke/extend/supersede | real delivery surface |
| billing webhook lifecycle handling | real delivery surface |
| organization overview | bounded skeleton |
| seats assignment | bounded skeleton |
| online activation API | optional skeleton |

## What is sellable now

The current commercial package can be sold as:

- a local governance CLI with clear edition gating
- signed license delivery and re-delivery
- customer account visibility for orders, licenses, and billing state
- operator-assisted commercial lifecycle handling

## What is not fully launched

Do not present the following as fully launched capabilities:

- full team / org seat management
- org invites and RBAC
- billing dashboard / reconciliation UI
- online activation as a required product path
- CLI account login

## Stable packaging language

Recommended wording:

- Community is the baseline governance CLI.
- Pro and Pro+ add paid analytics depth.
- Enterprise is the procurement and packaging surface, not a runtime-authority expansion.
- License Hub supports delivery, lifecycle handling, and account visibility around the CLI.

## Boundary reminders

- No change to edition matrix
- No change to gate contract
- No change to deny exit semantics
- No change to offline license authority
