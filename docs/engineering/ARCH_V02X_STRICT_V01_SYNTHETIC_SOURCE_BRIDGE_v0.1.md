# Architecture v0.2.x — Source Admission Option B, strict-v0.1 SYNTHETIC Bridge

**Fixed source parent:** post-merge `main` at `6cfc5fbc109c9d39ea6c592c121c419f81009051` (PR #385 P1 CSS and Owner-authorized PR #388 CI fix). **Owner disposition:** PR #386 Option B **ACCEPTED_AS_BOUNDED_DESIGN_DIRECTION** (versioned opt-in strict Source Admission; preserve legacy Pack Parser). **Scope:** isolated synthetic-only engineering candidate; not a public command, not real-data ingestion, not a release.

## Intent and minimal integration boundary

Clean-main branch introduces exact already tested PR #383 Source Admission script and its 15 synthetic P0G tests, with byte-identical source Git blobs, then adds standalone `scripts/arch_v02x_strict_source_bridge_synthetic.mjs` and SRC-TXB test cases. It deliberately **does not modify** `packages/guard/src/productization/single_agent_pack_parser_preview.mjs`, `packages/guard/bin/guard.mjs`, the I1 secure Review Bundle Writer, native Addon, package entrypoints, license, editions, schema or EAK.

The strict bridge accepts only `--source <explicit absolute synthetic fixed-Pack path> --fixture-root <new marked system TEMP root> --source-contract strict-v0.1-synthetic --format json --expected-source-digest sha256:<64hex>`. Two independent opt-in environment variables are required: `ARCH_V02X_P0_SOURCE_ADMISSION_SYNTHETIC_ONLY=1` and `ARCH_V02X_STRICT_SOURCE_BRIDGE_SYNTHETIC_ONLY=1`. The underlying gate admits only fixed HR example files within a marked, disposable TEMP fixture, enforces an allowlist, file type/cap, root containment and symlink/junction/hardlink checks. A different contract name/version is refused. The bridge must not print source path or raw values.

### Bounded operation

1. Source Admission **preflight** reads each allowlisted synthetic file with fixed identity, returns normalized content-set SHA without exporting raw bytes; match exact Owner/test-provided `--expected-source-digest`.
2. Only on successful preflight, call existing `guard pack validate --pack <synthetic path> --preview --json` in a separate process and require `valid_with_no_omissions` with a native SHA256 deterministic Pack hash.
3. Repeat Source Admission **postflight** and compare content set digest, source count and byte count before emitting `VALIDATED_BOUNDED_SYNTHETIC_NOT_PRODUCTION_ADMITTED`.
4. Any preflight/digest/version/native/postflight failure returns nonzero and normalized `BLOCKED`, no partial success. Output cannot promote `HOLD`, production admission or raw business policy authority.

**Critical limitation:** pre/post checks are **not** a transactionally immutable filesystem snapshot. Hostile concurrent mutation during the legacy parse window and real Windows cross-user DACL are not established. A production implementation will need a separately approved secure capture/snapshot, policy version/hash-domain separation, human permission review and Source/Bundle contract admission. This preview demonstrates Option B's compatibility intent, not that the legacy parser is safe for arbitrary paths. The old parser still accepts extra binary/hidden/symlink inputs if invoked directly.

## Test design

- Preserve exact predecessor P0 gate blobs from PR #383; execute P0G-01..15 independently with original M4 62 still NOT RUN.
- Execute `SRC-TXB-01..12` against fixed, disposable synthetic inputs: two default-off gates, correct explicit contract and pinned source digest, same native Pack validation hash as the legacy route, hidden/opaque/unknown input rejection, stale source digest, selected source outside marked root, symlinked allowlisted file rejection, and no altered source after tests.
- If hosted Windows cannot create symlink fixtures, report specific `NOT_TESTED` rather than false PASS. The result is an experimental bridge test, not original M4 REL/BND/CLI case execution.
- Execute existing Guard `npm run verify:v7.0.1` and legacy role-based renderer compatibility on Linux and Windows Server 2022 x64; do not count hosted CI as owner Windows 11 or a human session.

## Full retained states

```text
SOURCE_ADMISSION_OPTION_B=OWNER_ACCEPTED_DESIGN_DIRECTION_LIMITED
STRICT_V01_BRIDGE=DEFAULT_OFF_FIXED_SYNTHETIC_ONLY
LEGACY_PACK_HASH_AND_EXISTING_COMMANDS=UNCHANGED
LEGACY_P0_INPUT_GAPS=OPEN_FOR_DIRECT_LEGACY_PATH
SECURE_SNAPSHOT_REAL_SOURCE_CAPTURE=NOT_IMPLEMENTED
PUBLIC_GUARD_REVIEW_SOURCE_CLI=NOT_AUTHORIZED
M4_ORIGINAL_62=NOT_RUN
M5_INDEPENDENT_HUMAN=NOT_TESTED
M5_FULL_WINDOWS_GIT_HISTORY_EXTERNAL_HANDOFF=HOLD
I1_SIGNED_NATIVE_ADDON=DEFERRED
OR_01_TO_05=UNCHANGED
NO_MAIN_MERGE
NO_RELEASE
NO_CUSTOMER_DATA
```

**STOP for Owner review;** no production Source Admission, customer data or main merge is implied by synthetic CI results.
