# I1-OWNER-MANUAL-CLEANUP-SOP v0.2 — Owner-accepted research, NOT a deletion permit

**Accepted baseline:** `I1-OWNER-MANUAL-CLEANUP-CONTRACT-01 = DOCS_AND_SYNTHETIC_DRY_RUN_COMPLETED_WITH_LIMITATIONS`, fixed prior SHA `fe022dae2cb364a474a51675513038dc67261cfe` and original CI #43240399366. Owner accepted bounded disposition and authorized further work on 2026-11-12.

## Operational role separation

| Role | Permitted activity now | Not permitted by this contract |
|---|---|---|
| Owner | Review scope, proposed retention, exact path identity, accept/deny a **new** future Task Contract | Authorize deletion by merely accepting prior research status |
| Steward | Intake, classification, source-to-evidence mapping, non-destructive decision brief | Impersonate Owner, independent verifier or deletion executor |
| Independent evidence reviewer | Verify an authenticated receipt from separately controlled storage, inspect legal hold and copy scope | Share key custody or self-approve its own cleanup |
| Cleanup operator | **No action until separate explicit authorization** | Wildcard recursive deletion, blind retry, SSD/backup erasure claims |

## Decision sequence for any future exact-object operation

1. Identify the single I-1 run, stage name, exact canonical output-parent path, volume serial/dev and file ID/inode. Attach separately retained original run and verification receipts. A textual path alone is NOT sufficient object binding.
2. Check actual NTFS owner SID and DACL; reject inherited broad access, symlink/junction/reparse, incomplete or unexpected descendants, concurrent mutation and insufficient access. Linux/macOS requires equivalent FD/identity checks.
3. Record source classification and **derived report** sensitivity; list cloud sync agents, snapshots, backup targets, data region and customer processor obligations. UNKNOWN triggers HOLD.
4. Record actual jurisdiction-specific retention, legal hold and erasure restrictions, with the policy source, authorized approver and independent verifier. Do not assume any number of days.
5. Require **two distinct authenticated humans** to attest to the exact identity, scope, permissible operation, decision expiry and evidence impact. A field containing “approved” is not authentication.
6. Separate a new approval for any destructive execution. Capture pre-action and post-action independent receipts. Refuse if receipt vault is not separately controlled.
7. Any mismatch/exception/timeout must remain HOLD, not SUCCESS; do not retry or auto-remove the target. Treat SSD, cloud and backups as separate legal/technical erasure domains.

## Current implementation

`manual_dry_run.mjs`: no-delete synthetic object and role checks.  
`approval_packet.mjs`: rejects self-declared signatures, expired windows, identity/path mismatches, active/unknown legal hold, sync and backup uncertainty. Even a fully populated synthetic packet is **SIMULATED_DOCUMENTATION_COMPLETE_NOT_EXECUTION_AUTHORITY**.

**Customer cleanup: NOT AUTHORIZED.** No real human identity service, operational retention policy, protected receipt store, customer input or deletion is present. The CI test harness may delete **its own disposable synthetic test root only**.

## Human Owner Decision Gate

The Owner may adopt this SOP as a **read-only policy draft**. The following additional decisions remain separate and pending: named authorized human roles; custody and identity assurance provider; exact retention/hold policy; supervised synthetic dry-run with real persons; customer deletion/cleanup authorization on an exact immutable object identity.

No Guard runtime status, EAK/Schema, License, CLI authority, main merge or release has been changed.
