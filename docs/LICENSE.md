# Guard License Guide

MindForge Guard uses an offline signed license file to unlock paid analytics surfaces.

## Edition Model

Canonical edition identifiers:

- `community`
- `pro`
- `pro_plus`
- `enterprise`

## Current Gated Commands

| Command | Required Edition |
|---|---|
| `guard drift timeline` | `pro` |
| `guard drift compare` | `pro_plus` |
| `guard assoc correlate` | `pro_plus` |

If a required license is missing, Guard returns structured JSON and exit code `21`.

## License Storage

Guard stores the local license file at:

- Windows: `C:\Users\<user>\.guard\license.json`
- macOS/Linux: `~/.guard/license.json`

## Install

```bash
guard license install <file>
```

Development path:

```bash
node packages/guard/bin/guard.mjs license install <file>
```

## Check Status

```bash
guard license status
guard license show
```

## Exit Behavior

| Code | Meaning |
|---|---|
| `0` | Success |
| `21` | License required |
| `30` | License validation or runtime error |

## Verification Model

Guard verifies:

- license version
- product identifier
- key identifier
- Ed25519 signature over canonical JSON
- validity window via `not_before` and `not_after`

Public key material is embedded in:

- [packages/guard/src/product/license_keyset.mjs](/D:/AI%20project/mindforge-guard/packages/guard/src/product/license_keyset.mjs)
