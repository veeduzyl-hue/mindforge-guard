# I1-NATIVE-ADAPTER-SPIKE-v0.1 — Isolated, default-OFF Node-API8 bridge

**Research candidate only**. This package is **not imported by Guard**, **not referenced by any Guard package.json/workspace**, and must not be merged or published without separate Owner approval.

### Frozen identity / permission envelope
- Product main at admission: `3bad6d7fc69b64cdc7ef594edff97cfaeba62b0c`
- I1-SEC-01 Draft PR #354 head: `a1e6c84a9628430c3a6a8d242ab96f62de79d1f9`
- Native OS PoC: `ef69a2702cc0ed8aaff07729331070e80bdb54d4`
- Follow-up Windows G3 / macOS actual volume: `11349588a4604d4c472a00fea00e6bb7c0d3ee2e`
- Accepted Owner disposition: `I1-SEC-02=POC_COMPLETED_WITH_BOUNDARIES`
- New work is restricted to this directory and a new isolated CI workflow. No Guard CLI / Evidence Schema / EAK / License Hub / published npm changes.

### Adapter contract (not public Guard contract)
C++ source exports only `renameNoReplace(sourceParent,sourceName,destinationParent,destinationName)`, using Node-API v8. The native code holds directory FDs/HANDLEs over the strict no-replace syscall and reads back source and destination parent identities. On Linux it uses `renameat2(RENAME_NOREPLACE)`; on macOS, `renameatx_np(RENAME_EXCL)`; on Windows it dynamically calls `ntdll!NtSetInformationFile(FileRenameInformation=10,ReplaceIfExists=FALSE)`.

- Two gates: `I1_NATIVE_SPIKE_ENABLED=1` **and** `enabled:true,mode:'SYNTHETIC_ONLY'`.
- A fresh synthetic fixture root must contain an explicit marker. No other directories are eligible for the test loader.
- Expected SHA-256 of local `.node` binary is supplied explicitly. Missing/corrupt module or Node permission denial is REFUSED, never silently degraded to `fs.renameSync` or copy/unlink.
- The raw native result distinguishes `COMMITTED_CONFIRMED`, `COMMITTED_LOCATOR_UNCONFIRMED` (commit happened, locator not confirmed), `REFUSED_ALREADY_EXISTS`, unsupported or unknown errors. Internal labels only, not Guard public status enums.
- A successful rename neither protects G4 post-publication tampering nor establishes authentic provenance or institutional assurance.
- Source and destination path identities are checked at the end of the operation. A changed pathname can never turn a successful native commit into a false claim of non-commit. Handle-binding does not guarantee that an adversary cannot relink the public name immediately after readback.

### Build/distribution
- No binary in Git source. CI builds per-OS/arch `native_adapter.node` from exact source and records SHA-256; package is `private:true`, has **zero install scripts** and an isolated offline local-tarball smoke. It is not a multi-platform published npm dependency.
- Prebuilt binary hashes are not a signature or durable trust guarantee; no software signing, SBOM attestation, supply-chain release, or Windows 10/11 desktop compatibility is claimed.
- Node 24 CI is the bounded tested version, Node-API v8 is the ABI target. ABI stability does not prove OS/arch/CRT/distribution compatibility.

### Crash/recovery posture
A separate **read-only synthetic staging audit** demonstrates that SIGKILL may strand `.private-source` containing data. Such a stage must be classified as unresolved; neither the audit nor the adapter silently deletes, overwrites, exposes, or returns a clean completion receipt. Cleanup in tests is restricted to an owned disposable temporary root and is not offered as a Guard product operation.

### Support policy for this spike
Windows 11 desktop = candidate pending native consumer evidence; Windows 10 22H2 = legacy-compatibility research only, **not an approved support commitment**. Windows Server 2022 CI cannot substitute for either.

No M4 case, I1-SEC-01 test, or external user acceptance is promoted by this spike.
