# I1-SEC-02 Native NOREPLACE — Isolated Proof of Concept v0.1

**Status:** EXPERIMENT ONLY / NOT A GUARD PRODUCT FEATURE / NOT AN IMPLEMENTATION ADMISSION.

**Frozen source parent:** `a1e6c84a9628430c3a6a8d242ab96f62de79d1f9` (I1-SEC-01 hardening Draft PR #354). Public `main` baseline: `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`.

This folder is a **standalone Python 3.12 ctypes probe of real OS APIs**. It does not import or modify Guard, add a Node native binding, change the npm package, deploy software, access customer data, change local OS security settings, or request Administrator/root. All test data is synthetic and isolated under newly created temporary folders. Linux N15 also uses a separate newly created /dev/shm temporary folder when available, then removes it.

## Native calls, never fallback to normal rename

- **Linux:** glibc `renameat2(dirfd,stage,dirfd,target,RENAME_NOREPLACE=1)`; separate `openat2` path-boundary probe.
- **macOS:** libSystem `renameatx_np(dirfd,stage,dirfd,target,RENAME_EXCL=4)`; test volume/FS recorded.
- **Windows:** `CreateFileW` source directory handle with DELETE permission; `SetFileInformationByHandle(FileRenameInfo, ReplaceIfExists=FALSE)` with no replacement flag; optionally probe `FileRenameInfoEx`. A separate RootDirectory parent-handle probe may be blocked on a particular Win32 implementation, which must remain `G3_NOT_ESTABLISHED` rather than be silently substituted with pathname-based claims.

Each result carries native API, flag, raw errno/Win32 error, OS/arch, filesystem metadata, positive and negative observations. `os.rename` is used only as an explicit **attacker-fixture parent pathname swap** in N09, never as the publication operation or as an unsupported-fs fallback.

## Executed vs unexecuted scope

The scenario IDs come from the previously frozen 24-case I1-SEC-02 research matrix. This PoC executes its supported subset, with separate rows for N06-8/N06-32 and N14-invalid-flag. Entries requiring unavailable physical volumes, real disk exhaustion, a Guard production bundle kill/recovery, native Node addon packaging, or a distinct security principal remain `NOT_TESTED/BLOCKED`, not `PASS`. The runner exits nonzero on failed mandatory G1 cases; a successful job **does not** imply all 24 rows passed.

- G1: atomic no-clobber at commit while the target exists.
- G2: one native operation instead of `stat -> rename` time-of-check race.
- G3: FD/HANDLE anchored parent object; on Windows RootDirectory support must be evidenced rather than inferred.
- G4: **NOT protected** against malicious same-user post-publication modification. N19 explicitly demonstrates this limitation.

## Run (separate disposable workspace only)

```sh
python3 experiments/i1-sec-02-native-noreplace-poc/run_poc.py --output /your/temp/folder/native-receipt.json
```

Never pass a customer or project evidence directory as a test root; the runner creates its own fresh test roots with `tempfile.mkdtemp`. `--output` is the only caller-selected result location.

## Sources (native interface documentation, not machine-proof)

- Linux rename(2): https://man7.org/linux/man-pages/man2/rename.2.html
- Linux openat2(2): https://man7.org/linux/man-pages/man2/openat2.2.html
- Apple XNU `RENAME_EXCL` numeric flag 4: https://github.com/apple/darwin-xnu/blob/main/bsd/sys/vnode_if.h
- Apple volume exclusive rename capability: https://developer.apple.com/documentation/foundation/urlresourcevalues/volumesupportsexclusiverenaming
- Windows `FILE_RENAME_INFO`: https://learn.microsoft.com/en-us/windows/win32/api/winbase/ns-winbase-file_rename_info
- Windows `FILE_RENAME_INFORMATION` root handle semantics: https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntifs/ns-ntifs-_file_rename_information

**Evidence ceiling:** single-syscall no-replace on observed CI host/volume, not durable immutable storage, not independent evidence provenance, not human M5 acceptance, not native Node packaging readiness, not Guard product admission. Do not merge to main or PR #354 without a new Owner decision.
