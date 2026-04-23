# MindForge License Hub

MindForge License Hub is the commercial license delivery and customer portal system for MindForge Guard.

It supports formal purchase fulfillment, signed license delivery, account access, and portal-based license visibility while keeping the Guard CLI local and independent. License Hub is the commercial access layer around Guard, not a hosted execution control plane.

## Overview

License Hub is designed for the part of the product experience that begins after a commercial purchase:

- complete checkout through the billing provider
- record customer, order, and billing lifecycle events
- issue signed license material for eligible paid orders
- provide secure customer sign-in through one-time email links
- let customers view and download licenses from the portal
- provide account visibility for orders, billing, organizations, and seats
- support bounded administrative license operations with recorded history

## What It Does

License Hub provides the commercial delivery path for MindForge Guard:

- commercial checkout completion handling
- signed license issuance and delivery
- customer portal sign-in and license access
- account visibility for orders and billing state
- organization and seat visibility for supported commercial accounts
- recorded operational handling for license lifecycle actions

In practical terms, it helps customers purchase a commercial edition, access their account, retrieve the correct signed license, and manage ongoing commercial access through a hosted portal experience.

## How It Fits With MindForge Guard

License Hub works alongside MindForge Guard, but it does not replace Guard itself.

- **MindForge Guard CLI** remains the local tool for governance checks and license verification
- **License Hub** handles commercial purchase fulfillment, signed license delivery, and customer account access
- the Guard CLI does **not** depend on a hosted control plane for its main execution path
- License Hub does **not** change the semantics of `audit`, `permit`, or `classify`

This separation keeps commercial delivery convenient without changing Guard’s bounded local governance model.

## Typical Workflow

1. A customer selects a commercial edition.
2. Checkout is completed through the billing provider.
3. License Hub records the resulting billing lifecycle events.
4. An eligible paid order receives a signed license.
5. The customer signs in using the purchase email.
6. The customer views or downloads the license in the portal.
7. Guard verifies and uses that license locally.

## Portal Capabilities

The hosted portal supports:

- one-time email sign-in
- license list and license detail views
- signed license download
- account overview
- order and billing visibility
- organization context
- seat entitlement and assignment visibility

For internal operations, License Hub also supports bounded administrative actions such as resend, revoke, extend, and supersede, with recorded action history.

## Editions

License Hub supports the commercial delivery path for MindForge Guard editions:

- **Community** — community usage without commercial checkout
- **Pro** — commercial license delivery for individual developers and small teams
- **Pro+** — expanded commercial delivery through the same portal and local install model
- **Enterprise** — contact-led purchasing for procurement, legal review, and rollout planning

Across all editions, Guard remains local. License Hub handles the commercial delivery and account access layer where applicable.

## Status

License Hub is live and production-ready for:

- formal purchase fulfillment
- signed license delivery
- customer portal access
- license viewing and download
- account visibility

Operational observability is in place for billing, issuance, and portal-related support workflows.

## Running Locally

From the repository root:

```bash
npm.cmd install
npm.cmd run license-hub:dev
```

Use local environment configuration through `apps/license-hub/.env.local`. Keep secrets, live billing credentials, buyer emails, transaction IDs, and license identifiers out of committed files.

## Product Boundary

License Hub is a commercial fulfillment and account access system.

It does **not**:

- replace the Guard CLI
- execute repository decisions
- become a dashboard-first governance control plane
- alter `audit`, `permit`, or `classify`
- require the Guard CLI main path to call a hosted service

Its job is straightforward: support purchase, delivery, access, and account visibility for commercial Guard usage while preserving Guard’s local execution model.
