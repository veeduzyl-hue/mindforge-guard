# I1-WIN-DEFAULT-FAIL-CLOSED — Admission & Signed Native Distribution Contract v0.2

**Source baseline:** I1-REAL-WRITER-WIN-ACL-INTEGRATION-01 Owner-accepted experimental evidence at `0c642a0db48387074b6cbafcec102722348706d2`.  
**New engineering candidate:** isolated branch `experiment/i1-win-default-fail-closed-20261112`; no main merge or npm publish.

## Product security default (candidate-only)

- On **Windows**, the I-1 `guard review --pack --out` candidate refuses staging when the verified native private-DACL creator is missing, disabled, unable to load, incorrectly hashed, unable to bind the parent object or unable to verify the stage DACL. **It must never fall back** to `mkdtempSync + chmod(0700)` or the legacy permissive ACL.
- A currently implemented experimental path remains **SYNTHETIC_ONLY** and requires explicit environment gating, a synthetic marker, exact native module digest and verified output location. That is an engineering test, **not a supported production configuration**.
- Linux/macOS candidate behavior remains unchanged; Windows old I-1 success fixture tests intentionally cannot run in default mode and must be re-designed around a signed, installed verified addon before support is admitted.
- No irreversible cleanup/retry, production secret, customer input or new Guard status/approval authority is introduced.

## Signed distribution contract (not yet implemented)

| Admission check | Required evidence |
|---|---|
| Build origin and binary reproducibility | Pinned C++ source HEAD, toolchain, Node-API ABI target, Windows x64/ARM64 binary hash; independent rebuild comparison |
| Runtime integrity and signer trust | Offline-verifiable code-signature chain from a pinned Owner-approved publisher certificate; revocation/expiry policy; no local hash-only replacement for trusted signature |
| Platform support | Windows 11 **x64** ordinary user fresh install + cross-account DACL test, Windows 11 ARM64 full addon install test; Windows 10 legacy compatibility and security-support policy separately determined |
| Installation and recovery | Package manifest, offline install, no hidden postinstall privilege escalation, missing/wrong binary or corrupted trust root fails closed, rollback to a **safe unavailable** I-1 state |
| Path and native permissions | Handle-bound parent identity before/after creation, reject junction/reparse, effective second-account denial on actual I-1 output and all derived files |
| Data protection | No raw Pack duplicate; report may contain sensitive narrative; authorized output destination and backup/sync policies enforced/verified separately |
| Release | Independent CI receipts, permitted architecture matrix, operator signoff, explicit Owner admission/merge decision and a new tagged release gate |

**No signing certificate, trust-root, production KMS, platform distribution channel or customer Windows11 x64 endpoint has been supplied. These are P0 BLOCKERS.** Do not invent credentials or code-sign binaries with a self-signed CI certificate and claim product trust.

## Required evidence matrix

- Actual x64 Windows11 non-admin fresh installation: NOT_TESTED.
- Windows11 ARM64 protected DACL + positive public read / negative private read in a **standalone API experiment**: PASS_BOUNDED, not full Guard addon.
- Windows Server 2022 x64 actual Writer opt-in private ACL/parent attack: PASS_BOUNDED.
- Windows Server 2022 default deny with addon unavailable: PASS_BOUNDED on isolated candidate.
- Signed canonical npm binary distribution, verified rollback, per-platform code signing: NOT_IMPLEMENTED.
- Public main, customer Evidence, independent receipt custody and real cleanup: NOT AUTHORIZED.

**Proposed Owner decision:** approve only the *fail-closed engineering semantics* as a candidate; preserve `WINDOWS_PRODUCT_ADMISSION=HOLD` and require explicit later signing/rollout policy.
