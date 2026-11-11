# I1-SEC-02 — Owner Disposition Register Entry · 2026-11-11

**Document class:** Owner decision record for a bounded experiment; NOT a new Guard runtime status or product Evidence Contract.
**Disposition:** `POC_COMPLETED_WITH_BOUNDARIES`
**Authority:** Human Owner, explicit instruction in this conversation on 2026-11-11 (Asia/Singapore): "同意你的建议，请将建议将 I1-SEC-02 登记为 POC_COMPLETED_WITH_BOUNDARIES。 同时授权你继续执行解决 Windows 父目录 HANDLE 绑定问题，并补充 macOS 实际卷类型核验。"

## Accepted object (fixed)

| Item | Identity / decision |
| --- | --- |
| Experiment | I1-SEC-02 — Native NOREPLACE feasibility PoC |
| Accepted previous PoC Head | `ef69a2702cc0ed8aaff07729331070e80bdb54d4` |
| Original CI run | https://github.com/veeduzyl-hue/mindforge-guard/actions/runs/42971697651 |
| Previous machine evidence | Linux, Windows, macOS ARM64, macOS Intel, bounded G1/G2 native syscall tests |
| Accepted label | `POC_COMPLETED_WITH_BOUNDARIES` |
| Independent assurance | NOT ESTABLISHED |
| Guard product integration | NOT AUTHORIZED |
| PR #354 | Draft, not merged; previous Head `a1e6c84a9628430c3a6a8d242ab96f62de79d1f9` |
| main | Not modified by this record; previous baseline `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c` |
| Human first-user validation | PENDING / NOT TESTED |

## Limits expressly retained

1. Native operation G1/G2 bounded on the CI host/filesystem tested; support for other volumes, kernels, SMB/network mounts and physical failure modes is NOT ESTABLISHED.
2. POSIX parent FD binding G3 bounded; Windows Win32 `FileRenameInfo` RootDirectory returned error 87 in the original PoC, so Windows G3 is NOT ESTABLISHED at the time of this decision.
3. macOS original receipt did not independently identify the exact filesystem backing the test directory (`UNKNOWN`); a separate volume-identity readback remains required.
4. G4 protection against a malicious same-user actor modifying a published Bundle is NOT ESTABLISHED; native NOREPLACE alone does not offer durable tamper resistance.
5. No native Node-API addon, npm package implementation, license/entitlement update, Schema/EAK change or stable release is authorized.
6. This **research disposition is not approval to merge PR #354 or to add native syscalls to Guard production code**.

## Follow-on authorization (separate work item)

Owner authorizes **isolated experiment** I1-SEC-02-FOLLOWUP:
- Investigate and, if practical, demonstrate Windows native destination parent HANDLE-bound rename, preserving `ReplaceIfExists=FALSE` semantics and raw NTSTATUS/Win32 errors; no kernel drivers, no privilege escalation.
- On macOS ARM64 and Intel, independently read back actual temporary volume filesystem using a native filesystem information API and cross-check against mount/diskutil information; never infer APFS from runner labels alone.
- Preserve original failed tests and new raw machine receipts; mark unsupported branches as BLOCKED, not PASS.
- Only write to a new `experiment/` branch, new synthetic temporary test locations and a documentation/CI artifact folder. No modifications to `main`, PR #354, the Guard CLI/runtime, Schema, EAK, package or production release.
- Stop/retain HOLD if the native API cannot be invoked safely in this sandbox, path identity cannot be established, or a success depends on noncanonical or destructive fallback.

**New experiment outcome remains NOT_RUN at the instant of this owner entry.** Acceptance of the earlier PoC does not pre-accept subsequent experiments.

## Record location and scope

This is an additive, source-linked Owner disposition in the isolated research branch. It must not be misconstrued as a mutation of any pre-existing frozen centralized Owner Decision Register elsewhere. Future consolidation into a governing register requires checking its exact identity and change controls.
