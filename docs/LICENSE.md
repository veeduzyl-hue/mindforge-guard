# Guard License Guide

Guard uses an **offline, signed license file (v2, Ed25519)** to unlock Pro and Pro+ features.

This document explains:

- How editions work
- How to install a license
- How to verify license status
- Common error states and exit codes

---

## 1. Editions

Guard supports three editions:

| Edition    | Drift Timeline | Drift Compare | Assoc Correlate |
|------------|----------------|---------------|-----------------|
| Community  | ❌             | ❌            | ❌              |
| Pro        | ✅             | ❌            | ❌              |
| Pro+       | ✅             | ✅            | ✅              |

Community edition is the default when no license is installed.

---

## 2. License File Format

Guard expects a **signed JSON file (version=2)**.

Example:

```json
{
  "version": 2,
  "product": "guard",
  "license_id": "lic_xxx",
  "key_id": "mf_k1_2026",
  "edition": "pro",
  "customer": "example",
  "not_before": "2026-02-24T00:00:00.000Z",
  "not_after": "2026-12-31T23:59:59.000Z",
  "issued_at": "2026-02-24T12:00:00.000Z",
  "nonce": "random_hex",
  "signature": "base64url_ed25519_signature"
}
```

Properties:

version must be 2

product must be "guard"

signature must verify against Guard's embedded public key

not_before / not_after define validity window (UTC ISO8601)

3. Install License

To activate a license:

guard license install <file>

Or via node (development):

node ./packages/guard/src/runGuard.mjs license install <file>

If successful:

Activated license:
edition: pro
not_before: ...
not_after: ...
key_id: ...
license_id: ...

Exit code: 0

4. License Storage Location

The license is stored locally at:

macOS / Linux:

~/.guard/license.json

Windows:

C:\Users\<user>\.guard\license.json

You may remove it manually to revert to Community edition:

rm ~/.guard/license.json
5. Checking License State

If no license is installed:

guard drift timeline

Returns:

{
  "ok": false,
  "error": {
    "kind": "license_required",
    "feature": "drift timeline",
    "required_edition": "pro",
    "current_edition": "community"
  }
}

Exit code: 21

6. License Error States
6.1 Signature Verification Failed
License install failed.
state: invalid
reason: signature verification failed

Exit code: 30

Possible causes:

License file modified (tampered)

Wrong public key embedded in Guard

Corrupted file

6.2 Expired License
License install failed.
state: expired
reason: license expired

Exit code: 30

Cause:

not_after is in the past

6.3 Not Yet Valid
License install failed.
state: not_yet_valid

Cause:

Current time is before not_before

7. Exit Codes (Stable Contract)

Guard reserves the following exit codes:

Code	Meaning
0	Success
21	LICENSE_REQUIRED
30	LICENSE_INVALID / EXPIRED
10	Soft governance block
20	Hard governance block

These exit codes are stable and safe to rely on in CI/CD pipelines.

8. Security Model

Guard verifies:

Ed25519 signature (canonical JSON payload)

Valid time window

Matching product field

Recognized key_id

Private signing keys are never included in Guard.

Only public keys are embedded in:

packages/guard/src/product/license_keyset.mjs
9. Key Rotation

Guard supports key rotation via key_id.

When rotating keys:

Add new public key entry in LICENSE_KEYSET

Keep old keys to support existing customers

Issue new licenses referencing new key_id

10. Summary

Guard licensing is:

Offline

Cryptographically signed

Deterministic

CI-friendly

Edition-aware

Stable exit-code based

This ensures Guard can be safely used in local dev, CI pipelines, and enterprise environments without external dependency.
