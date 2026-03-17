# Guard Release Verification Matrix

This matrix reflects the current v1.0.x commercial CLI surface and was refreshed during v1.0.2 release hardening.

| Command | Expected Exit | JSON Output | License Requirement | Verification Status |
|---|---|---|---|---|
| `guard --version` | `0` | No | None | Verified success |
| `guard --help` | `0` | No | None | Verified success |
| `guard status` | `0` | No | None | Verified success |
| `guard audit . --staged` | `0` on success | Yes | None | Verified success |
| `guard snapshot .` | `0` with prior audit, `30` without one | Yes | None | Verified success |
| `guard drift status --format json` | `0` | Yes | None | Verified success |
| `guard drift timeline` | `0` with valid license and data, `21` without license, `30` on missing required data | Yes | `pro` | Verified fail-closed |
| `guard drift compare` | `0` with valid license and data, `21` without license, `30` on missing required data | Yes | `pro_plus` | Verified fail-closed |
| `guard assoc correlate` | `0` with valid license and data, `21` without license | Yes | `pro_plus` | Verified fail-closed |

## Verification Notes

- `guard audit . --staged` requires git access to the repository state.
- `guard snapshot .` depends on an existing audit artifact.
- The current verification pass was performed from the repository root using `node packages/guard/bin/guard.mjs`.
