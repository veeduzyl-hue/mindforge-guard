# Architecture v0.2.x — Azure Artifact Signing operator runbook v0.1

**State:** PREPARATION COMPLETE ONLY WHEN APPROVED; `SIGNING_NOT_PERFORMED` until Owner has a real eligible Azure account, validated identity/profile, signed-file output and exact machine receipt. This runbook is a *bounded engineering candidate* on an isolated branch. No main merge, npm release, real Evidence, automatic customer installation or entitlement expansion.

## 1. Choose a legitimate trust issuer

**Preferred: Azure Artifact Signing (formerly Trusted Signing), Public Trust.** Microsoft currently lists Singapore as an eligible organization country in its *Artifact Signing Quickstart*, but Public Trust **individuals** are limited to the USA and Canada. An organization must complete identity validation and meet Microsoft's actual eligibility requirements; choosing a nearby Azure region does not change eligibility. If there is no eligible organization, consider a reputable organizational OV code signing certificate and a separate hardware-backed signing process; do not substitute a CI self-signed certificate for Public Trust.

Primary sources: [Artifact Signing quickstart](https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart), [Signing integrations](https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-signing-integrations), [Certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management), [Signer RBAC](https://learn.microsoft.com/en-us/azure/artifact-signing/tutorial-assign-roles), [Microsoft SignTool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool).

### Azure Portal steps — performed by the account owner

1. In [Azure Portal](https://portal.azure.com), use an eligible **paid** Azure subscription (not trial/free/sponsored), register `Microsoft.CodeSigning` if required, and create an **Artifact Signing Account** in a supported region. Preserve the resulting region-specific `https://<region>.codesigning.azure.net` endpoint.
2. Complete **Public Trust organization identity validation** in the portal. Do **not** upload ID/company incorporation documents, bank details or personal identity materials to GitHub or ChatGPT; submit them only to Microsoft's official verification workflow.
3. Create a **Public Trust certificate profile** bound to the validated organization. Record the **approved publisher identity**, region, account name and certificate profile name. These names are identifiers, not authority by themselves.
4. Grant only the named operator identity the **Artifact Signing Certificate Profile Signer** role at certificate profile scope. Avoid subscription-wide Owner, permanent client secrets in GitHub or broad service principal privileges. If CI integration is independently authorized later, prefer workload-identity OIDC with a protected GitHub environment and explicit Owner review; **not** a push-to-sign default workflow.
5. Inspect the actual price, terms and supported geography in your tenant before purchasing/creating a billable resource. This repo change does **not** perform Azure resource creation or purchase.

## 2. Prepare the reproducible unsigned native source

On an approved Windows 11 x64 operator host, use a **fresh, clean, exact-source-SHA checkout** of the accepted isolated experiment. The Native Addon must be compiled from the pinned C++ source using approved x64 Node 24 headers, `node.lib` and MSVC. The existing `experiments/i1-real-writer-win-acl-integration-01/build.mjs` is an experimental build helper, **not** a production installer. Keep its build receipt and verify the unsigned `.node` source SHA, binary SHA and Node-API identity. Copy the unsigned binary to an owned **outside-repository** directory. Do not reuse a binary from an unknown ZIP or overwrite an existing signed file.

**Important:** Windows PE Authenticode signing *modifies binary bytes*. The **unsigned** and **signed** SHA-256 values are expected to differ. A successful signed result must be pinned separately. Repeat the approval of the *per-release signed artifact*, not an assumed reproducible signed hash.

## 3. Install Microsoft-supplied signing tools locally

Use an officially sourced Windows SDK SignTool (x64) and Microsoft's `Azure.CodeSigning.Dlib.dll`, for example via the official Artifact Signing Client Tools or the Microsoft.ArtifactSigning.Client NuGet package. Verify tool identity and hash against a separately reviewed installation receipt; use the paths discovered on your machine, not arbitrary binaries in the repository.

Use `az login` interactively on the trusted operator PC with an identity that has *Certificate Profile Signer*. Do not paste `az access-token`, PFX, client secrets, session tokens or Azure login credentials into this chat or GitHub. Microsoft's SignTool/Dlib consumes your authenticated Azure identity; no private signing key is locally stored by Guard.

Create a local `metadata.json` **outside the checkout**, without credentials:

```json
{
  "Endpoint": "https://<ACTUAL_SUPPORTED_REGION>.codesigning.azure.net/",
  "CodeSigningAccountName": "<YOUR_VALIDATED_ACCOUNT>",
  "CertificateProfileName": "<YOUR_APPROVED_PUBLIC_TRUST_PROFILE>"
}
```

Replace **all** placeholders with actual Azure values. Endpoint must correspond to the account region. The metadata file may contain service identifiers but must not contain a token, key, password or secret. The operator script refuses unrecognized metadata fields.

## 4. Safe operator script — default does not sign

From the **new fixed-source checkout** (the exact SHA must match the approved branch), run:

```powershell
powershell.exe -NoProfile -File .\scripts\arch_v02x_azure_artifact_signing_operator.ps1
```

Expected: `CHECK_ONLY_NOT_SIGNED_NO_CLOUD_CALL_NO_FILES_CREATED`. This is safe to inspect and does not sign, create files, or call Azure.

After Azure identity validation, account/profile approval, accepted toolchain/source identity, and separate Owner signoff, the approved operator fills local variables and calls the explicit signing command:

```powershell
$head = '<40-character approved isolated Git HEAD>'
$unsigned = '<absolute path to newly-built UNSIGNED private_acl.node outside Git repo>'
$signtool = '<absolute path to Microsoft Windows SDK x64 signtool.exe>'
$dlib = '<absolute path to Microsoft Azure.CodeSigning.Dlib.dll>'
$metadata = '<absolute path to local metadata.json>'
$out = '<absolute existing isolated local output parent>'
$args = @{
  ExpectedSourceHead = $head
  UnsignedAddonFile = $unsigned
  ExpectedUnsignedSha256 = (Get-FileHash -LiteralPath $unsigned -Algorithm SHA256).Hash.ToLowerInvariant()
  SignToolPath = $signtool
  ExpectedSignToolSha256 = (Get-FileHash -LiteralPath $signtool -Algorithm SHA256).Hash.ToLowerInvariant()
  DlibPath = $dlib
  ExpectedDlibSha256 = (Get-FileHash -LiteralPath $dlib -Algorithm SHA256).Hash.ToLowerInvariant()
  MetadataPath = $metadata
  ExpectedMetadataSha256 = (Get-FileHash -LiteralPath $metadata -Algorithm SHA256).Hash.ToLowerInvariant()
  OutputParent = $out
}
# Do not run until actual values and signing authority have been independently reviewed.
.\scripts\arch_v02x_azure_artifact_signing_operator.ps1 @args -ExecuteSign -AcknowledgeExternalSigning
```

The script performs source/worktree, Windows 11 x64/Node 24, file path/reparse, unsigned binary hash, Microsoft tool/Dlib hash, metadata endpoint and input-not-already-signed preflight. It then **copies** the unsigned .node into a new owned directory and invokes Microsoft's SignTool with Azure's Dlib, `sign /fd SHA256 /tr http://timestamp.acs.microsoft.com /td SHA256 /dlib ... /dmdf ...`. The script checks SignTool verify `/pa`, an Authenticode signature, and an observed timestamp certificate, then records **unsigned/signed distinct SHA** and signer certificate evidence. Failure retains the candidate directory for Owner review; no automatic delete or distribution.

A working account, login and exact external tools are required. `Get-AuthenticodeSignature` may fail to establish offline revocation without a fresh cache; the script's immediate sign-host result does **not** prove later offline consumer validation. Neither successful signing nor SignTool `Valid` auto-approves a release.

## 5. Critical correction to PR #372's existing signer-pin model

Microsoft Artifact Signing certificates are **short-lived (~72 hours) and renew frequently**. PR #372's proof-of-concept policy pins one leaf thumbprint and checks `UtcNow <= NotAfter`. This can be appropriate only for a single, freshly issued *per-artifact candidate*; it is **not** a durable profile identity and is expected to reject timestamped artifacts after the leaf expires. Replacing the leaf/NotAfter checks with a permissive subject-name match is **not acceptable**. Production needs independent Owner-pinned **validated issuer/profile identity**, trusted timestamp and chain verification at the correct signing time, revocation freshness, per-release binary/leaf receipt, secure loading/storage and rollback. The positive PR #372 path stays **HOLD**, even if this signing operator generates a signed candidate.

Microsoft's signing service certificates rotate daily and rely on trusted RFC 3161 timestamps to remain verifiable after expiration: [Certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management). The Microsoft timestamp endpoint recommended for Artifact Signing is `http://timestamp.acs.microsoft.com`.

## 6. Evidence and stop boundaries

| Condition | Status now | Required to change |
| --- | --- | --- |
| Azure verified organization/individual eligibility | NOT ESTABLISHED | Owner's real Azure subscription and portal identity validation |
| Public Trust profile/Signer RBAC | NOT ESTABLISHED | Actual account/profile and scoped role receipt |
| Microsoft/Azure-signed x64 `.node` | NOT CREATED | A real signing session using the validated service and authorized operator |
| Time-stamp, chain, revocation | NOT TESTED with real signed file | Signed binary, timestamp token and policy-controlled chain/revocation evidence |
| Win11 x64 positive signed Pack | NOT RUN | Separate modified production-appropriate verification and actual Owner-mediated client run |
| CI 9 unsigned denial cases in PR #372 | VERIFIED_BOUNDED_NEGATIVE | Preserved; no substitution for positive signed path |
| Independent owner trust-policy signature, code-sign identity rotation, installer/rollback | HOLD | Separate Owner trust/release design and tests |
| M4 62 / M5 human | NOT RUN / NOT TESTED | Independent original test plan and human user evidence |
| Main merge / npm publish / signed production distribution | NOT AUTHORIZED | Separate Owner acceptance and release gate |

Stop at Owner review. No Azure payment or identity submission is performed by the GitHub operator kit; no private keys, CA certificates, signable payloads or secret tokens are committed. This work does not modify T2/S04/G03/Sebbi or OR-01..OR-05 statuses.
