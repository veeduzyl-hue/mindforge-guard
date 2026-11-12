# I-1 Local Pack Review — engineering candidate v0.1

**Status:** ISOLATED_ENGINEERING_CANDIDATE / NOT RELEASED / NOT MERGED.
**Fixed parent:** `main` `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`.
**Scope:** existing First Report folder Pack only. No `--source`, `--repo`, drift, analytics, IAM, remote scan, upload or agent execution.

## Usage (candidate branch only)

```sh
guard review --pack ./hr-self-service-agent --out ./new-review-bundle --format text
# or --format json for stdout metadata
```

The output directory **must not exist**, and its parent must already exist. This command is an explicitly requested, local, additive review operation. It has no license gate. It does not approve, certify, enforce, execute or establish independent assurance.

## How it works

1. Strict preflight of an explicitly selected Pack (7 required files, 3 recommended files, plus optional README), only the `evidence/` allowlist, no extra directories, symlinks, source/output overlap, path traversal references or inaccessible sources.
2. **I1-REAL-WRITER-DATAFLOW-01 candidate (2026-11-12):** Read the selected Pack into one bounded frozen in-memory byte snapshot (11-file allowlist, maximum 4 MiB per file and 16 MiB total), and only then create a same-parent sibling staging directory. **No raw Pack file bytes or `.private-source` directory are written to staging.** Compute source digests, check file identity and reject detected input mutations.
3. Use an additive opt-in read-only in-memory Pack view with the existing `parseSingleAgentGovernancePackPreview` and Single-Agent Report mapper. Both consume the same captured bytes, preserving legacy Pack validation/report JSON and deterministic hash semantics. **Existing standalone commands continue reading disk exactly as before**; only the I-1 candidate uses the new opt-in view.
4. Preserve the validation native status and corresponding exit 0/2/3/4. Usage errors may also exit 2 and must be distinguished from valid-with-limitations by JSON/stderr. Review I/O/preflight errors use separate diagnostics; the overall numeric exit contract is candidate-only.
5. Generate the same Review Bundle envelope with native component JSON, status/limitations, relative artifact paths, SHA-256 digests, report preview, `does_not_support` claims and a human-readable summary. The `pack_path` field inside the Bundle is reduced to a source basename (deliberate path minimization); native CLI commands remain unchanged. **The report/diagnostics can still include sensitive input-derived narratives and identifiers and must not be treated as redacted.**
6. Flush individual derived temp files, rename within staging, generate checksums excluding the checksum index itself, verify source unchanged, then use the existing I1-SEC-01 same-volume no-replace publication. The command rejects existing destinations. On return, attempt to wipe captured Buffer bytes in process memory (not a swap/core-dump guarantee). Errors and termination after staging may retain an incomplete `.guard-i1-partial-*` directory **with derived contents, not original Pack files**; no safe automatic recovery/secure deletion is implied.

## Explicit limitations and stop conditions

- Unlike the pre-existing Pack parser, I-1 deliberately **rejects** unexpected files within the selected root. This strict allowlist is a deliberate candidate restriction: do not silently scan or retain unrelated data or secrets.
- Source reads and after-read digest verification detect ordinary changes; this is **not** a transactional filesystem snapshot against an adversarial concurrent writer. No stronger runtime provenance or file-origin claims are made.
- Exclusive temporary writes and a same-volume final rename are used. Filesystem and non-cooperating external-writer races remain a platform-specific admission test; do not claim universal overwrite immunity from source review alone.
- JSON component fields may contain input-provided narrative or identifiers. Source absolute `pack_path` is minimized but the user must still inspect the Bundle for sensitivity before sharing.
- `ready_for_review` means only ready for human review, not approved, deployed, verified or safe-to-execute.
- M2/M3 `guard review` (broader modes) and M4 original 62-test matrix remain separate. I-1 test IDs `I1-T01..T20` are local, not M4 IDs.
- This candidate remains outside public npm v7.0.1 and does not promote v7.1.0-rc.0 to a stable release.
- No release, PR merge, main update, Entitlement, License Hub, Paddle or commercial prices change is authorized by I-1 implementation.

## Review Bundle contents

```text
<new-output-directory>/
  review-manifest.json
  review-summary.md
  diagnostics.json
  bundle-checksums.json
  components/pack-validation.json
  components/single-agent-governance-report.json  # except malformed input
```

The Bundle is a *delivery envelope*, not a fifth canonical Evidence Contract. `bundle-checksums.json` lists the other files' byte lengths and SHA-256; it never claims completeness of actual Agent execution.

## Verification

- Run `npm run verify` and `npm run verify:v7.0.1` on the fixed engineering branch to prove legacy surface compatibility.
- Run `node scripts/verify_i1_pack_review.mjs` for local I-1 tests: happy path, missing/limited/malformed, symlink/ref escape, output collision, extra-file refusal, Unicode, content mutation and limitations.
- Install **one canonical tarball** into a temporary prefix on Linux, Windows PS5.1, macOS ARM64 and macOS Intel, then run `node scripts/verify_i1_packaged_smoke.mjs` against the installed CLI. No npm publish.
- Record every test result and its actual runner. A green CI badge alone does not prove a production security guarantee or real first-user acceptance.

## Outstanding Owner Gates

This candidate is not itself a frozen public command contract. Review numeric overall status behavior, allowed-file constraints, other first-user inputs and filesystem race coverage before final I-1 acceptance. Independent macOS first-user validation remains pending.

## I1-SEC-01 NOREPLACE & failure-injection hardening (candidate-only)

- **Scope:** This patch changes only I-1 local Review Bundle finalization and its local verification. It does not modify `--source`, `--repo`, EAK / MESR / Evidence Schema, published v7.0.1, license gating, other CLI commands or runtime authority.
- **POSIX:** The publisher uses atomic exclusive `mkdir(finalPath)` to claim a fresh destination before the final same-filesystem directory rename. A concurrent independent directory creator must be refused rather than silently overwritten, even when its directory would be empty.
- **Windows:** The final directory is **not** pre-created, because the native directory rename refuses an existing destination. Tests inject a concurrent creator immediately before that rename and require fail-closed behavior.
- **Failure path:** A failed reservation, unexpected output collision, ENOSPC, EACCES, EXDEV or rename I/O error must never return a completed Bundle; the writer attempts to remove only **its own verified empty reservation**, never recursively deletes the destination, removes the private source copy from the partial staging directory and records `INCOMPLETE.json` where possible.
- **Completed Bundle:** Valid native component results, evidence limitations, checksum index and source immutability remain unchanged; completion still requires a successful same-filesystem directory rename.
- **Cross-volume:** Staging and final destination are siblings by construction. A device mismatch or injected `EXDEV` fails closed; no copy-and-delete fallback. Simulated EXDEV is not evidence of a physical cross-volume test.
- **Crash consistency:** A process forcibly killed between reserving an empty output name and renaming can leave an empty claimed destination without a manifest. It is **not a completed Bundle**. A later run must reject the occupied name; review the filesystem and remove a proven-empty orphan manually rather than deleting or overwriting blindly.
- **Threat-model boundary:** This is a bounded no-overwrite solution for ordinary competing directory creators. It is **not a kernel `RENAME_NOREPLACE` guarantee** against a malicious same-user actor allowed to remove and replace the claimed directory or change the parent path while the process runs. It is not independent assurance and does not close production or human-first-user admission.
- **Verification:** Run both `scripts/verify_i1_pack_review.mjs` (original 21 local cases) and `scripts/verify_i1_sec_01_hardening.mjs` (focused security negatives and 5-process contention), plus existing full regressions and a canonical installed-package smoke on Windows, Ubuntu and both macOS architectures. Tests do not introduce Guard/EAK status enum values or change the M4 62-case matrix.

No main merge, npm publish, stable tag, GitHub Release, website change or external customer-data workflow is authorized by I1-SEC-01. Machine pass must be supported by a fixed candidate SHA and original receipts.

## I1-REAL-WRITER-DATAFLOW-01 — Sensitive Data & Integration Gates (2026-11-12)

- **Implemented in isolated candidate branch only.** No raw input snapshot is persisted to the same-parent staging directory. The captured byte Map is bounded to 16 MiB; file contents are read once via the existing NOFOLLOW/open identity check and hashes are verified again before publishing.
- **Parity requirement:** Opt-in memory Pack parse and report mapping must match legacy standalone `pack validate --preview --json` and `report single-agent --preview --json` JSON, excluding I-1's existing `pack_path` basename minimization. The I-1 native exit codes 0/2/3/4, Community access, paid-command gating, and existing schema/status fields remain unchanged.
- **Still sensitive:** The completed Bundle, diagnostic field values, report action/intent summaries and receipt IDs can include user-supplied names or business narratives. A named OneDrive/Dropbox folder is not proof that it is or is not syncing; derived outputs in a sync-enabled directory may still leave the computer. No automatic DLP/redaction or cloud directory ban has been added.
- **Windows ACL gap:** Node `mode:0o700` does not establish effective Windows NTFS DACL isolation. Read ACLs on a synthetic CI stage, record them as observations, and retain Windows client ACL admission as NOT ESTABLISHED until per-user access checks are complete.
- **Recovery gap:** The real Writer still retains derived temporary data on failures or forced process termination; I1-NATIVE-RECOVERY-01 is a separate synthetic-only PoC. No automatic orphan cleanup, secure erasure, independent provenance or G4 postpublish tamper protection has been integrated.
- **Security boundary:** Input pre/post hash detects ordinary concurrent modifications, but is not a transactional filesystem snapshot against a malicious writer that restores bytes between observations. POSIX I1-SEC-01 no-replace remains bounded, not native RENAME_NOREPLACE. Keep real customer Evidence and external first-user admission on HOLD.
- **Owner authorization:** Engineering isolated, synthetic input only; no main merge, npm/GitHub Release, new authority, EAK/Schema, License-Hub, pricing or broader `guard review` modes.
