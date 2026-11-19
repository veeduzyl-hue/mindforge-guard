# Architecture v0.2.x — Windows 11 x64 Native Addon Signature and Distribution Admission v0.1

**Date:** 2026-11-19 UTC+08
**Scope:** Owner-approved bounded engineering, signer-gate negatives and a conditional synthetic client positive test. **NO PRODUCTION TRUST ADMISSION.**
**Fixed parent:** PR #371, `adb43e60a71729c5fab4ac8e1804804bc8d10038`.
**State:** `SIGNED_ADDON_DISTRIBUTION=NOT_ESTABLISHED`; `WIN11_X64_SIGNED_NATIVE_POSITIVE=NOT_RUN`; `OWNER_POLICY_AND_SIGNER_CERTIFICATE=NOT_SUPPLIED`.

## 1. Non-negotiable distinction

The existing I1 synthetic private-NTFS ACL writer checks exact .node SHA256 and source/test directory identity, but **does not verify an Authenticode publisher signature**. Its opt-in mode is a synthetic test hook, not a product distributor. The new preflight is a read-only candidate; it does not silently wire signing into the I1 Writer, Guard CLI, npm packaging, License Hub or release.

A byte digest is integrity evidence only. Get-AuthenticodeSignature Valid is only a starting point: explicitly pin the approved signer certificate (SHA1 thumbprint as identifier **and** full certificate SHA256), the expected trust root, valid code-signing EKU, trusted chain, and cached offline revocation state. The local policy digest supplied by an Owner is **OWNER_MEDIATED**, not independent authenticated approval. A still-unimplemented secure updater, transaction/TOCTOU controls, signing policy lifecycle and external release authority are additional production gates.

Microsoft reference: https://learn.microsoft.com/powershell/module/microsoft.powershell.security/get-authenticodesignature ; https://learn.microsoft.com/en-us/windows/desktop/api/wintrust/ns-wintrust-wintrust_data . Get-AuthenticodeSignature is not itself proven network-isolated by this candidate. Offline X509Chain revocation is fail-closed on unknown/unavailable evidence. No offline-network noninterference claim, secure hardware key protection, timestamp-validity guarantee, or certificate revocation freshness beyond local cache is made.

## 2. Owner-pinned policy (EXAMPLE ONLY, NOT AN APPROVED POLICY)

Create an actual policy **only after** obtaining a legitimately signed x64 Node-API8 PE binary, approving its release SHA and code-signing certificate out-of-band, and recording that approval independently. No PFX/private key is to be copied into GitHub, ChatGPT, the ZIP, or a user report.

```json
{
  "kind": "ARCH_V02X_WIN_SIGNED_ADDON_ADMISSION_POLICY",
  "version": "0.1",
  "scope": "BOUNDED_SYNTHETIC_PACK_ONLY",
  "source_head": "<FULL_OWNER_ACCEPTED_GIT_COMMIT_SHA>",
  "platform": "win32",
  "arch": "x64",
  "node_api_min": 8,
  "artifact_file_name": "private_acl.node",
  "artifact_sha256": "<SIGNED_BINARY_SHA256_LOWERCASE_64_HEX>",
  "artifact_size_bytes": 123456,
  "signer_thumbprint": "<CODE_SIGNER_SHA1_CERT_THUMBPRINT_LOWERCASE_40_HEX>",
  "signer_cert_sha256": "<CODE_SIGNER_CERT_DER_SHA256_LOWERCASE_64_HEX>",
  "root_thumbprint": "<OWNER_APPROVED_TRUST_ROOT_SHA1_LOWERCASE_40_HEX>"
}
```

The fields in angle brackets above are placeholders and **MUST NOT** be installed as values or treated as trust assertions. After Owner review, pin SHA256 of the complete policy file as a separate acceptance input; this gives byte identity but cannot prove who approved that policy. Any approval of a signer certificate, trust anchor, time/revocation policy and release process must be grounded in an independent release record.

## 3. Read-only Windows 11 x64 signed addon gate

The script `scripts/arch_v02x_win11_x64_signed_addon_preflight.ps1` runs in ordinary, non-elevated Windows 11 x64 with Node 24.x. It refuses missing or wrong source SHA/policy hash, unsupported OS/arch/Node-API, reparse paths, malformed signer/root pins, artifact size/hash, unsigned or invalid Authenticode, wrong signer/certificate, self-signed leaf, absent code-signing EKU and incomplete cached revocation/chain proof. It never loads, installs or signs the native file. A hypothetical preflight pass is **`CRYPTOGRAPHIC_PREFLIGHT_PASS_WITH_PRODUCT_HOLD`**, not production admission.

After an external signed artifact is available, inspect in a **separate clean exact-SHA checkout**, ordinary non-elevated PowerShell 5.1:

```powershell
$head = (git rev-parse HEAD).Trim()
$approvedPolicyHash = '<OWNER_APPROVED_POLICY_FILE_SHA256>'
$addon = '<ABSOLUTE_PATH_TO_OFFLINE_SIGNED_PRIVATE_ACL.NODE>'
$policy = '<ABSOLUTE_PATH_TO_OWNER_REVIEWED_POLICY.JSON>'
powershell.exe -NoProfile -File .\scripts\arch_v02x_win11_x64_signed_addon_preflight.ps1 -AddonFile $addon -PolicyFile $policy -ExpectedPolicySha256 $approvedPolicyHash -ExpectedSourceHead $head
```

**Do not run these placeholders.** No certificate/key or signed binary is present in this candidate; the expected disposition is HOLD until genuine materials exist.

## 4. Positive Bundle path — separately gated and NOT YET EXECUTED

The optional `scripts/arch_v02x_win11_x64_signed_pack_synthetic.ps1` must first repeat the full signature gate; only after this genuinely succeeds and the Owner intentionally sets `-ExecuteSynthetic` does it run one explicitly selected **synthetic First Report Pack**, in a new user-owned temporary directory with the existing I1 synthetic marker. It must preserve existing canonical Pack/Report native statuses, five checksums, non-execution claims and NTFS private ACL. No arbitrary source path, customer data, native installer, package publication, new Guard CLI mode or automatic cleanup is authorized.

```powershell
powershell.exe -NoProfile -File .\scripts\arch_v02x_win11_x64_signed_pack_synthetic.ps1 -AddonFile $addon -PolicyFile $policy -ExpectedPolicySha256 $approvedPolicyHash -ExpectedSourceHead $head -ExecuteSynthetic
```

This pathway is **not** a genuine signed-addon product install; it invokes the existing experiment-only synthetic I1 hook. It also does not establish an effective private-read denial against a distinct actual Windows account, independent release trust, secure anti-TOCTOU loading, certificate lifecycle policy, seamless rollback, or real human first-user acceptance. Those require separately authorized probes/release controls.

## 5. Hosted CI is NEGATIVE-only

GitHub Windows Server 2022 x64 CI compiles the existing experimental N-API8 PE binary **unsigned**, and expects nine scoped security-negative tests to refuse. No fake signer, CI self-signed root, test certificate, secret key or trust-store modification may convert the result into a signed positive. No native .node binary is attached to CI artifacts; only sanitized test receipts are uploaded. A green negative CI indicates the unsigned/incorrect policy gate fails closed, **not** that any signed add-on has passed or that Windows 11 x64 positive Bundle works.

## 6. Release blockers and evidence classifications

| Gate | Current status | Evidence to close |
| --- | --- | --- |
| Signed x64 binary with Owner-approved publisher chain | NOT ESTABLISHED | Licensed CA/enterprise-approved code signing material, independently approved signer/root, signed PE, verifiable digest and timestamps/revocation policy |
| Offline revocation freshness and network controls | NOT ESTABLISHED | Explicit trust policy, cached CRL/OCSP freshness receipt, verified no-network procedure and reproducible signed-file validation |
| Packaged native addon distribution | NOT IMPLEMENTED | Signed package identity, no postinstall escalation, safe default/rollback and installation evidence |
| Windows 11 x64 native Pack positive | NOT RUN | Signed gate success + explicitly requested synthetic Pack + exact input/CLI/binary SHA + verified ACL / checksums |
| Distinct ordinary-user DACL denial | NOT TESTED | Real second principal positive public control and private negative, exact client build, independent receipt |
| Windows 10 x64 | NOT TESTED | Separate operating system decision and support policy |
| M4 62 cases / M5 human first-user | NOT RUN / NOT TESTED | Separate tests and actual human session |
| Independent receipt custody | HOLD | Independent verifier, protected receipt trust domain and review |
| Main merge, release, customer Evidence, new schema or authority | NOT AUTHORIZED | Separate Owner scope and acceptance gates |

Original T2 BLOCKED, S04 UNRESOLVED, G03 FROZEN, Sebbi HOLD, and OR-01..OR-05 remain unchanged.

**STOP:** No main merge, no npm publish, no code-signing keys, no native production integration, no customer test, no automatic cleanup and no release. Record every nonexecuted signing/client positive scenario as NOT RUN rather than inferring PASS.
