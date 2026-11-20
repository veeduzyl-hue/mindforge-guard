# MindForge Guard Architecture v0.2.x — P0 Source Admission Trust Boundary v0.1

**Owner authorization:** 2026-11-20, continue Track B P0 after PR #381 diagnostics. **Fixed parent:** PR #381 `6b4503478fe58636ca25a06d29ed741a3c9240be`. **Status:** isolated, default-off synthetic prototype, NOT a patch to the existing canonical Pack Parser, public Source Onboarding, `guard review --source`, I1 Native Writer, Schema/EAK, License, Edition, main, npm package or customer data.

## 1. Actual diagnostic motivation

PR #381 six independent bounded supporting probes, run on Linux x64 and Windows Server 2022 x64, found two non-equivalent P0 design gaps in the **current legacy Pack parser**: (a) extra hidden/binary synthetic files are included in the deterministic Pack digest without invalidating `valid_with_no_omissions`; (b) a synthetic link to a file outside the selected Pack root is followed and hashed. M4 `REL-05`, `REL-06`, `BND-07` are RELATED, not actual original-case executions. Original M4 62/62 remain NOT RUN.

The separate I1 Review Bundle Writer already has a different stricter allowlist/snapshot/NTFS staging contract. Do not confuse the legacy parser's current behavior with that isolated I1 path. Silently modifying legacy content hashing could invalidate existing Pack hashes or result statuses; any actual canonical change requires separate Owner backward-compatibility and release approval.

## 2. Strict source-admission prototype: synthetic only

New standalone script: `scripts/arch_v02x_source_admission_gate_synthetic.mjs`. **Requires** all of:

- Explicit opt-in `ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY=1`, no default execution.
- `--fixture-root` an absolute new directory directly under OS system TEMP named `arch-v02x-p0-owned-<32hex>` with immutable exact marker `.ARCH_V02X_P0_SYNTHETIC_SOURCE_ONLY`.
- `--pack` an explicit absolute subdirectory of that newly marked fixture; `--format json` only. No implicit working directory, network, customer path, recursive arbitrary file enumeration or user-specified production root.
- A strict set of ten permitted root entries (`README.md`, `manifest.json`, `agent-profile.json`, `task-scope.md`, `action-boundary.yaml`, `data-sources.yaml`, `tools.yaml`, `review-standards.md`, `snapshot.json`, `evidence`) and only `sample-output.json`/`run-record.json` within `evidence`. Missing required seven canonical sources fails closed. Unknown/hidden/opaque or additional nested file/dir fails even if current legacy parser would return valid.
- Path-relative/absolute containment checks plus lstat and realpath identity of each source component; symlinks/junctions/referrals fail. Each allowlisted file is opened read-only, checked via file descriptor device/inode, mtime/ctime, byte count, fixed resource caps and link-count (hardlink) bounds before and after read. Exact limited source bytes are hashed but never exported or persisted.
- One stdout-only sanitized receipt with file count, total bytes and source-content-set digest. No source contents, user paths, raw environment, credentials, file copying, authorization or delivery output.

**Negative result** is exit 24, bounded machine reason, no partial output. **Positive result** means only `BOUNDARY_OBSERVED_FOR_SYNTHETIC_FIXTURE`; it is not real data admission, independent certificate, true multi-process TOCTOU-proof capture, validated closed-world list for every business case, or a cryptographically signed producer artifact.

## 3. Legacy backward-compatibility deliberately preserved

Both `packages/guard/src/productization/single_agent_pack_parser_preview.mjs` and `packages/guard/src/cli/review_bundle_writer.mjs` remain completely unchanged in this PR. In tests the existing `guard pack validate --preview --json` must retain `valid_with_no_omissions` for the same frozen clean synthetic HR Pack and the same recorded Pack hash. The separate new gate cannot be retroactively claimed to apply to existing CLI call paths.

Legacy parsing of extra binary/hidden files is still an **observed GAP** in the legacy interface, not a new product-bug fix. Do not hook this experimental gate into Pack Validate or product `guard review` without an explicit transition policy: profile/versioning, expected hash changes, edition/backward compatibility, canonical schema contracts, source failures and consumer communication.

## 4. Evidence acceptance and separate M4 classification

`P0G-01..P0G-15` synthetic cases exercise default-deny, fixed valid sample, legacy valid hash/exit, extra hidden/binary/unrelated/nested, missing required, changed content fingerprint, outside-root, symlink, junction and hardlink when host permits, size cap and proof that legacy extra input remains accepted. A test can be `NOT_TESTED` if the host cannot construct a specific Windows symlink/junction; never count it as PASS. Linux/Windows CI source identity must be exactly pinned.

**No P0G result is an original M4 case.** `M4_ORIGINAL_62=NOT_RUN`. No human M5 first use is witnessed; signed Addon remains DEFERRED. OR-01..05, T2/S04/G03/Sebbi states unchanged.

## 5. Next legal integration gate

Prepare a separate `M3 Source Contract Transition & Backward Compatibility Decision` answering: (i) accept legacy Pack input for old commands or version a new stricter path; (ii) whether excluded sources are entirely rejected, external-referenced or inventory-only; (iii) exact symlink/junction identity semantics and file descriptor safety; (iv) canonical Pack hash domain and cross-version parity; (v) real content redaction and retention policy; (vi) real input negative tests, release authority and independent QA. **This current prototype authorizes none of those transitions.**

```text
SYNTHETIC_SOURCE_GATE=EXPERIMENTAL_DEFAULT_OFF
LEGACY_PACK_PARSER=UNMODIFIED
M4_ORIGINAL_62=NOT_RUN
REAL_CUSTOMER_SOURCE_ADMISSION=NOT_AUTHORIZED
I1_SIGNED_NATIVE_BUNDLE=NOT_USED
M5_HUMAN=NOT_TESTED
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```
