# I1-NATIVE-RECOVERY-01 · Crash-Safe Staging Retention & Locator Integrity (isolated)

**Status:** Experimental synthetic-only hardening. Not integrated into Guard, PR #354, PR #355, PR #356, or published npm. No authority expansion.

### Frozen baseline and scope
- Parent Node-API8 Spike: `c6364ef107060cb74c4baecee1862e5ffe2f44bc`
- Guard main baseline: `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`
- Owner accepted I1-SEC-02 as `POC_COMPLETED_WITH_BOUNDARIES`; I1 Native Spike has only a **recommended**, not yet Owner-accepted, `SPIKE_COMPLETED_WITH_LIMITATIONS`.
- Only `experiments/i1-native-recovery-01/**` plus the isolated CI workflow may change.
- This prototype reuses the prior `load.mjs` Node-API8 adapter, **without changing its C++ code, product import graph, or public CLI exit/status definitions**.

### Security objectives and exact experimental claims

1. **Avoid the original sensitive raw staging copy:** the fixture source is read into memory for a bounded synthetic derivation. Only `derived.json`, `review-manifest.json`, and a source-free `staging-journal.json` are written to staging. No `.private-source` is created by the new prototype. Negative tests scan for a synthetic private canary after each deterministic process termination.
2. **No false success after a crash:** termination checkpoints are (a) source read; (b) stage created; (c) derived files written; (d) immediately before native commit; (e) native commit completed, before receipt; (f) receipt written. Every audit is read-only and classifies incomplete/unacknowledged outcomes for human review. A missing receipt **never** proves that no commit happened.
3. **Atomic namespace commit remains native-only:** the existing experimental N-API adapter performs strict NOREPLACE and returns raw namespace/locator states; no `fs.rename`, copy/delete fallback, or automatic cleanup.
4. **Locator readback:** native adapter binds source and destination parent FD/HANDLE during its syscall. Separate explicit readback records path-based device/inode identity, component digest and directory fsync attempt. Later read-only audit spots an absent visible target, a moved/replaced parent path with a same-content decoy, and content or manifest modification on the same directory identity.
5. **Fail-closed and preserve uncertainty:** if the native module is missing, its expected SHA-256 is wrong, or native commit is refused, staging remains unresolved; no false `COMMITTED_CONFIRMED` or blind deletion.
6. **Crash durability limited:** `fsync` calls on regular files and available parent directories are observations, **not power-cut durability evidence**. On Windows directory sync is not established. A `SIGKILL` is not a hardware power failure.

### Important residual security limits

- The original I-1 candidate Writer on PR #354 **still creates `.private-source`**, and is completely unchanged by this experiment. No customer evidence is processed or released.
- Real Guard report output can contain input-provided identifiers/narratives; deleting the raw private copy does not imply staging is non-sensitive. This PoC uses derived hashes only.
- Readback proves identity **only at a particular observation instant**; an adversarial same-user process can change public directory names, bytes or even the external receipt after that. The independent evidence authenticity / G4 boundary remains **NOT ESTABLISHED**.
- The test fixture's root is gated by `.i1-native-spike-synthetic-only`; its simple marker is a scope marker, **not an authentication security boundary**.
- No automatic deletion or physical secure erasure of orphan stages is supplied. Only the test harness removes **its own temp roots** after its run; this is not a product recovery operation.
- SIGKILL/progressive checkpoints are synthetic. Power loss, mmap/pagecache/swap/core dump, malicious kernel/privileged actor, unsupported filesystems, Windows 10/11 desktop and Node module release signing are NOT_TESTED.

### Review state model (experiment-only labels)

- `UNCOMMITTED_ORPHAN_REVIEW_REQUIRED` — a staging directory still exists, never silently deleted.
- `COMMITTED_WITHOUT_RECEIPT_OWNER_REVIEW` — published tree present but no external completion receipt; **does not mean failure**.
- `RECEIPT_WITH_MISSING_OR_REBOUND_PUBLIC_PATH` — prior receipt exists, user-visible target missing or replaced.
- `LOCATOR_IDENTITY_CHANGED_OWNER_REVIEW` — content may match, but inode/device identity changed.
- `CONTENT_DIGEST_CHANGED_OWNER_REVIEW` — identity matches but content/manifest changed compared with the prior receipt.
- `VALID_AT_AUDIT_INSTANT` — manifest checksums and recorded object identity match **at audit**, not a future security guarantee or organizational approval.
- `PRIVATE_SOURCE_RETAINED_CRITICAL` — legacy or external stage with `.private-source`; manual review required.

These are **not Guard product schema/status additions**.

### Independent verification

Run `node experiments/i1-native-adapter-spike-v0.1/build.mjs` in an isolated environment with appropriate Node-API8 toolchain, then set `I1_RECOVERY_RECEIPT_DIR` to a new folder and run `node experiments/i1-native-recovery-01/verify_recovery.mjs`. The script creates and deletes only its *own* synthetic temporary fixtures; GitHub CI retains machine receipts outside the repo. The helper `crash_child.mjs` refuses to run without both explicit synthetic-only test gates.

**No merge / product integration / release is authorized by this work.**
