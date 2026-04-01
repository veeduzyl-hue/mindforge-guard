# Guard License Guide

MindForge Guard uses an offline signed license file to unlock paid analytics surfaces.

## Canonical Editions

- `community`
- `pro`
- `pro_plus`
- `enterprise`

## License Lifecycle States

`guard` recognizes these license states:

| State | Meaning | Gate behavior |
|---|---|---|
| `missing` | No local license file | gated commands return `license_required` |
| `invalid` | License file exists but fails parse or signature validation | gated commands return `license_required` |
| `expired` | License file is cryptographically valid but past `not_after` | gated commands return `license_required` |
| `not_yet_valid` | License file is cryptographically valid but before `not_before` | gated commands return `license_required` |
| `valid` | License file is valid and inside its time window | gated commands either pass or return `edition_mismatch` if the tier is too low |

## Gated Commands

| Command | Required edition |
|---|---|
| `guard drift timeline` | `pro` |
| `guard drift compare` | `pro_plus` |
| `guard assoc correlate` | `pro_plus` |

## Gate Contract

### `license_required`

Used when the local license is:

- missing
- invalid
- expired
- not yet valid

JSON shape:

```json
{
  "ok": false,
  "error": {
    "kind": "license_required",
    "feature": "drift_timeline",
    "required_edition": "pro",
    "current_edition": "community",
    "license_state": "missing",
    "hint": "Install a signed pro license file: guard license install <file>"
  }
}
```

### `edition_mismatch`

Used when the local license is valid but the edition is below the required tier.

JSON shape:

```json
{
  "ok": false,
  "error": {
    "kind": "edition_mismatch",
    "feature": "drift_compare",
    "required_edition": "pro_plus",
    "current_edition": "pro",
    "license_state": "valid",
    "hint": "Install a signed pro_plus license file: guard license install <file>"
  }
}
```

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | Success |
| `21` | Commercial gate blocked the command |
| `30` | Validation or runtime error |

### Contract Decision

The formal commercial contract should keep gate exit code `21`.

Reason:

- the implementation already uses `21`
- existing docs already mostly align on `21`
- changing to `1` would introduce an unnecessary commercial contract break
- `21` keeps gated product denial distinct from ordinary runtime failure

## License Commands

### `guard license status`

Text output contract:

- missing: `license: missing`
- invalid: `license: invalid (...)`
- expired: `license: expired (...)`
- not yet valid: `license: not_yet_valid (...)`
- valid: `license: ok (<edition>) expires: ...`

### `guard license show`

JSON output contract:

- returns the structured result of local license inspection
- includes state, edition, path, and lifecycle metadata when available

### `guard license install <file>`

Success:

- exit `0`
- JSON payload with `ok: true` and installed license metadata

Failure:

- exit `30`
- `license_install_invalid` when the file fails validation or time-window checks

### `guard license remove`

Success:

- exit `0`
- JSON payload with `ok`, `removed`, and `path`

## Storage

Guard stores the local license file at:

- Windows: `C:\Users\<user>\.guard\license.json`
- macOS/Linux: `~/.guard/license.json`

Public key material is embedded in:

- [packages/guard/src/product/license_keyset.mjs](/D:/AI%20project/mindforge-guard/packages/guard/src/product/license_keyset.mjs)
