# Architecture v0.2.x — Windows 10/11 x64 Desktop Admission Kit v0.1

**Status:** BOUNDED_CANDIDATE / OWNER_MEDIATED_DESKTOP_EXECUTION_NOT_YET_OBSERVED  
**Authorization:** 2026-11-19 Owner-approved **preparation and bounded synthetic validation**, not product/customer admission or a signed addon release.  
**Fixed parent:** PR #370 source `4ba21c5efd59acb54538e6fe702e679acc507673`.  
**Execution identity:** Obtain the **exact 40-character full HEAD** from this branch's final PR review and use the same value for `-ExpectedHead`; do not substitute the parent SHA or a shortened prefix.

## Why two evidence tracks?

GitHub's hosted Windows x64 labels are Windows **Server** 2022/2025. Its Windows 11 hosted image is ARM64. A hosted Server x64 PASS is not Win10/Win11 desktop evidence. The present kit therefore separates:

1. **Hosted CI:** Windows Server 2022/2025, isolated tarball offline install and default-deny; separately Server 2022 native ACL + actual Pack Review + security negatives and synthetic stage interruption.
2. **Desktop Owner-mediated run:** Windows 10 22H2 x64 (Build 19045) or Windows 11 x64 (Build >=22000), **ordinary non-elevated** PowerShell 5.1 + Node 24.x x64; no native addon is installed, and no production input is allowed. Tests installed tarball, Pack/Report parity, and safe unavailable I-1 behavior only.

Neither track establishes a supported Windows x64 product release or independence of third-party review.

## Minimal desktop operations (after Owner reviews the fixed HEAD)

Use a fresh independent source clone, not the previous research/asset-recovery directory. Preserve historical repositories and avoid altering `main`.

1. Retrieve and inspect the **exact PR branch and full commit SHA**, e.g. from GitHub's Code/Commits panel.
2. Check that the source is the accepted PR and the Git worktree is clean; do not execute untrusted source or an unknown .node artifact.
3. Open **ordinary, non-elevated Windows PowerShell 5.1** (not Administrator) with Node.js 24.x x64 and npm.
4. Inspect environment without modifications:

   ```powershell
   cd 'D:\Guard-Engineering-Recovery\ARCH-v02x-Win-x64-Admission'
   git rev-parse HEAD
   git status --porcelain
   powershell.exe -NoProfile -File .\scripts\arch_v02x_win_x64_installed_cli_admission.ps1
   ```

5. Only if the printed identity is correct and the Owner intends a bounded synthetic test, run in the same **clean, pinned checkout** (replace the placeholder with the complete observed SHA):

   ```powershell
   powershell.exe -NoProfile -File .\scripts\arch_v02x_win_x64_installed_cli_admission.ps1 -Execute -ExpectedHead '<EXACT_40_CHARACTER_COMMIT_SHA>'
   ```

   The script does **not** enable code execution policy bypass or elevate permissions. It runs `npm pack --ignore-scripts --offline`, installs that exact locally-built `.tgz` into a *new temp prefix* with install scripts disabled, and consumes only the repository's **synthetic** HR sample. It records the tarball SHA, installed CLI/version, Pack Validate and Report Preview parity, and deliberate Windows default-deny when no trusted native addon exists. It does **not** install or load a new native addon on desktop. The script leaves the temporary, synthetic-only test directory for human inspection; **no automatic deletion**.

**No network upload, telemetry, secrets, actual Agent credentials, customer Evidence, cloud sync authorization, local account creation, production cleanup or implicit consent.** Any manual copying/uploading of receipts requires a separate review. Do not run in an organization-managed endpoint without local IT permission.

## Required readback and limit of claim

The output record `receipt.json` in the new `%TEMP%\arch-v02x-win-x64-installed-*` directory is the initial Owner-mediated result; the exact 40-char SHA, OS build, user token/elevation, Node/npm versions, package SHA, and explicit PASS/FAIL/NOT_RUN fields must be reviewed without silently upgrading scope. A local run is **OWNER_MEDIATED** until independently corroborated.

| Gate | Expected result on desktop | What it does NOT prove |
|---|---|---|
| Desktop x64 identity / OS build / PS5.1 | Accurate local observation | Enterprise managed-product qualification |
| Normal non-elevated user | Required before `-Execute` | Effective isolation of future signed addon |
| Installed local `.tgz` package | Exact tarball digest and offline installed CLI | Signed publisher provenance or npm registry release |
| Existing Pack Validate + Report Preview | Same synthetic Pack hash and native statuses | Real workflow completeness or approval |
| Windows with no verified addon | Deny with no final Bundle/partial | Successful positive Bundle delivery |
| Signed native addon / true customer distribution | **NOT TESTED / NOT ESTABLISHED** | NOT a product PASS |
| Windows desktop cross-user read denial | **NOT TESTED** in this kit | Native CI run is not client ACL proof |
| Actual power loss, untrusted process, real retention | **NOT TESTED / HOLD** | Synthetic interruption does not prove durability |

Do **not** treat an unsigned hash-only sidecar as production-signed or acceptable. The independent Owner-approved signing certificate, signed manifest, chain validity/revocation policy, independent publisher authority, per-OS install and rollback evidence still require an independent decision.

## Hosted CI controls

The two jobs run from an exact source checkout. Server 2022 additionally builds the existing experimental private-NTFS addon from checked Node 24 headers, runs the three existing synthetic native Windows Pack Review positives, previously defined 10-case actual Writer ACL/parent-swap controls, and a **synthetic staging interruption**. The test-only interruption runs a child process to the actual I-1 stage creation point, forcibly terminates it, then uses the existing read-only inspector to verify an orphan stays review-required. This is **not** a physical disk-power-loss proof or a customer-data recovery operation.

The native `.node` binary is **not distributed** by this kit; hosted CI artifacts should include only bounded receipts, never native binaries or source Pack content. Windows 10/11 x64 real first-user sessions remain pending.

## Immutable governing boundary

```text
ARCH_V02X_X64_HOSTED_CI=TEST_SCOPE_ONLY
WINDOWS10_X64_REAL_USER=NOT_TESTED
WINDOWS11_X64_REAL_USER=NOT_TESTED
SIGNED_NATIVE_ADDON_DISTRIBUTION=NOT_ESTABLISHED
M4_62=NOT_RUN
M5_HUMAN_FIRST_USER=NOT_TESTED
OR_01_TO_05=UNCHANGED
T2_FORMAL_CLOSURE=BLOCKED
S04_FACTUAL_ADMISSION=UNRESOLVED
G03_IMPLEMENTATION=FROZEN
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
NO_REAL_CLEANUP
```

No user data, production host changes, merge, tag, npm publish, main commit, release, acceptance or new institutional verification authority is created by preparing this kit.
