# I1-REAL-WRITER-RECOVERY-02 — Real Writer Read-Only Recovery & Locator Contract v0.1

**Status:** Isolated engineering candidate / Not merged / Not published / Explicit Owner review required.
**Frozen parent:** `a9afa99391ad36f2f47449eeaaf7d10d52c4448c` (I1-REAL-WRITER-DATAFLOW-01 accepted as `IMPLEMENTED_AND_VERIFIED_BOUNDED`).
**Public product main at authorization:** `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`.
**Scope:** Actual I-1 Pack Review candidate only, 11-file bounded First Report Pack. Do not change Schema/EAK/MESR, edition/license, CLI public command modes/exit codes, Guard authority, npm or release.

## Implementation boundary

1. Add `packages/guard/src/cli/review_recovery_readonly.mjs` for a **read-only, bounded inspection of a single explicitly named I-1 output** and sibling partial-stage directories. Scan only the known I-1 output filenames and the existing 5-file checksums index. No recursive arbitrary root scan, no external network, no mutation.
2. A standalone **Owner-only** script `node scripts/i1_real_writer_recovery_inspect.mjs --parent <absolute-existing-output-parent> --name <output-basename> [--prior <saved-read-only-receipt>]` prints JSON. It is **not** a new public `guard` CLI command; it makes no files by itself. Nonzero exit 2 signals human review, 30 signals untrustworthy inspection.
3. `receiptCandidate` is a minimal, **unauthenticated, user-retained observation**: output basename, dev/inode identity of parent + final directory, manifest/checksum index SHA-256, observation timestamp, no original Pack file bytes, no raw report narrative. The Owner may explicitly save this output to a separate secure store, but the tool does not automatically persist it.
4. A completed Bundle with valid manifest/checksum index is `COMPLETE_BUNDLE_AT_INSPECTION_ONLY`, **not a verified real-world action, not independent assurance, not definitive historical delivery success**, and cannot prove content will not be changed after inspection.
5. `INCOMPLETE` markers or partial derived stages are **not retry-safe**, not automatically deleted, and may contain private owner narrative. Legacy `.private-source` remnants are classified `LEGACY_RAW_SOURCE_COPY_CRITICAL` and are never read or automatically erased.
6. An externally supplied prior receipt can indicate a parent/inode/digest change, but is **not cryptographically authenticated** and may itself be modified by the same user. No G4 durable anti-tamper claim.
7. Adjust only the real Writer's error path to prevent creating a **phantom partial stage** when native/legacy directory rename already published the output and a following failure occurs. CLI stderr must say that completion is *not acknowledged*, not assert nonpublication. Existing numeric exit codes remain unchanged.

## Failure status contract (inspection-only, no new Guard status enum)

| Observation | Read-only classification | Human action |
|---|---|---|
| Final missing, no stage | `NO_FINAL_OUTPUT_OBSERVED_OUTCOME_UNKNOWN` | Inspect actual user/OS history. Do not infer noncommit and retry blindly |
| Empty stage | `EMPTY_STAGE_REVIEW_REQUIRED` | Confirm stage ownership and lifecycle before any manual action |
| Stage with `INCOMPLETE.json` | `INCOMPLETE_MARKER_REVIEW_REQUIRED` | Check final target *as well*; no self-delete |
| Derived stage without marker | `UNCOMMITTED_STAGE_REVIEW_REQUIRED` | Assume derived content potentially sensitive |
| Historical raw copy present | `LEGACY_RAW_SOURCE_COPY_CRITICAL` | Escalate privacy/retention review before any cleanup |
| Bundle with correct manifest/index, no prior | `COMPLETE_BUNDLE_AT_INSPECTION_ONLY` | May be human reviewable; not a historical receipt |
| Final incomplete, symlink or corrupted | `PUBLISHED_INTEGRITY_UNVERIFIED_OWNER_REVIEW` or `UNTRUSTED_FINAL_ENTRY_REVIEW_REQUIRED` | Quarantine by Owner policy; no automatic repair |
| Bundle same bytes but different object inode | `LOCATOR_IDENTITY_CHANGED_REVIEW_REQUIRED` | Inspect possible path replacement or relocated parent |
| Bundle same object but digest different from prior | `CONTENT_DIGEST_CHANGED_REVIEW_REQUIRED` | Inspect manipulation; prior receipt itself may be untrusted |
| Prior receipt but public output missing | `PRIOR_RECEIPT_FINAL_OUTPUT_ABSENT_REVIEW_REQUIRED` | Investigate without assuming data destroyed |

## Manual cleanup / retention gate

**Not implemented by this task.** A future human process must, before any irreversible operation:

- Capture the exact output parent, canonical path, file system, NTFS ACL/owner, relevant backup/sync status and the original created-at run identity. Confirm this exact directory belongs to the intended I-1 run; similar-looking directory names are not sufficient.
- Independently verify that the directory inode/file ID and its children have not changed since inspection; reject symlinks, junctions, mounts, and unknown entries. An Owner or approved operator must authorize a specific exact path and retain the authorization record.
- Identify whether derived reports contain credentials, customer narratives, regulated data, sensitive IDs or accidental secrets; apply the organization's retention/classification policy and appropriate backup controls before considering deletion.
- Keep failure, inspection and manual handling receipts separate from the potentially tampered Bundle. Explicitly state whether cloud sync or backups could have copied data and that ordinary deletion is **not** secure erasure on SSD, backup, or cloud.
- Never run broad wildcard deletion, recursive cleanup of untrusted data, silent retry or product-side auto recovery. Stop on ambiguous ownership, ACL, path identity, retention, legal hold, or observed unexpected data.

**No automatic cleanup authorization is granted.** A developer test harness removing its *own new disposable synthetic temp root* is not a product cleanup action.

## Remaining P0/P1 risks

- **P0 Windows NTFS DACL:** `mode:0o700` does not prove private ACL; an inherited `Authenticated Users: Modify` ACE was observed in the previous Windows Server 2022 CI test. Not solved here.
- **P0 provenance and crash retention:** Internal Bundle manifest and checksums provide *self-consistency*, not an independently stored, signed, durable receipt. A failure after rename but before acknowledgement is still unresolved until observation. Actual power-loss and durable journal replay remain NOT_TESTED.
- **P1 derived data and cloud sync:** Both staged derived files and published output may contain narrative/identifiers. The absence of raw Pack copy does not imply redaction. The output parent may be backed by OneDrive, Dropbox, SMB, or user-selected sync; neither presence nor absence of synchronization was established by the CI synthetic directory.
- **G4:** Malicious same-user actor can replace the public directory or alter the Bundle and the unsafeguarded external receipt. This module does not change the previously bounded NOREPLACE threat model.
- **Platform:** Actual Windows 10/11 desktop user tests, independent M5 first-user review and real customer Evidence remain HOLD / NOT AUTHORIZED.

## Verification

Run full prior Guard regressions, original 21-case I-1 suite (Windows inherited symlink creation case NOT_TESTED), SEC-01 hardening suite, Dataflow-01 suite and the new **actual Writer recovery & fault-injection suite**. Test with a fixed HEAD on Linux, Windows Server 2022/PowerShell 5.1, macOS ARM64 and macOS Intel, using a Linux-built canonical candidate npm tarball installed and run on each platform. All user-data fixtures synthetic.

Draft PR only. Owner must separately approve any merge to the feature branch, main, npm release, new public recovery CLI or automated cleanup.
