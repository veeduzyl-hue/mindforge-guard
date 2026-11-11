# I1-SEC-02 Follow-up Experiment · Windows HANDLE Binding & macOS Volume Identity

## Scope

This is a separately approved, isolated continuation of Native NOREPLACE PoC v0.1.

- Owner disposition of original PoC: **`POC_COMPLETED_WITH_BOUNDARIES`**, recorded in [OWNER_DISPOSITION_20261111.md](OWNER_DISPOSITION_20261111.md).
- Frozen old PoC: `ef69a2702cc0ed8aaff07729331070e80bdb54d4`.
- New experimental work: `win_handle_followup.py` + `macos_fs_followup.py`, plus one limited CI workflow. No modifications to Guard CLI, I1-SEC-01, PR #354, Schema, License, main or npm.
- Human owner permits isolated native Windows directory HANDLE binding validation and real macOS filesystem readback. No privileged operations; only disposable synthetic local directories.

## Windows hypothesis and acceptance

1. Preserve observed `SetFileInformationByHandle(FileRenameInfo=3, RootDirectory!=NULL)` rejection; do not rewrite the historic failure as success.
2. Use distinct ntdll native `NtSetInformationFile(FileRenameInformation=10)`, `IO_STATUS_BLOCK`, an open source directory handle and an open destination parent HANDLE, `ReplaceIfExists=FALSE`. This is not the Win32 Class 3 API.
3. On test NTFS, prove a fresh relative destination exists after success and an occupied destination is rejected with an actual **NTSTATUS collision** (not an unrelated `ERROR_NOT_SAME_DEVICE` or `ERROR_INVALID_PARAMETER`).
4. Move the open parent directory's *pathname* to an alternate location, replace the old pathname with a decoy, then prove the native relative rename deposits a synthetic artifact under the **original bound parent object**, not the decoy.
5. Eight concurrent synthetic contenders must have exactly one winner; rejected sources and foreign data remain unchanged.
6. G4 remains not established. Raw `NTSTATUS` and Win32 mapping kept separate.

**Important limit:** User-mode ntdll API is a research candidate. Results on a Windows Server 2022/NTFS runner do not imply production Node-API compatibility, Windows 10 acceptance, security against a malicious same-user actor after publication, or support on all filesystems.

## macOS hypothesis and acceptance

1. Use the Darwin `statfs` and `fstatfs` functions to identify `f_fstypename` for the **actual newly created test directory** and verify the file descriptor, mount point and filesystem identity are consistent.
2. Cross-check the same mount via `mount` and `diskutil info -plist`; preserve any unavailable secondary data rather than guessing.
3. Test `renameatx_np(RENAME_EXCL)` on the same observed volume: existing-target reject and fresh-target success.
4. Execute independently on macOS ARM64 and macOS Intel, record their actual `fstypename`; do not infer APFS from the runner name.

## Stops and non-claims

- If Windows native root binding or the parent-rename negative cannot be demonstrated, retain G3=HOLD.
- If statfs/fstatfs fail or disagree, volume identity remains UNKNOWN.
- All permanent changes prohibited: no production integration, no Guard runtime, no PR #354 merge, no main merge, no npm/GitHub Release or website deployment.
- Prior `POC_COMPLETED_WITH_BOUNDARIES` decision remains valid even if follow-on tests fail.
- All conclusions must link exact head SHA and original CI machine receipts.
