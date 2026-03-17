# Guard Editions

MindForge Guard uses the following canonical edition model:

- `community`
- `pro`
- `pro_plus`
- `enterprise`

## Feature Matrix

| Surface | Community | Pro | Pro Plus | Enterprise |
|---|---|---|---|---|
| Core governance runtime | Yes | Yes | Yes | Yes |
| Policy validation | Yes | Yes | Yes | Yes |
| `guard audit . --staged` | Yes | Yes | Yes | Yes |
| `guard snapshot .` | Yes | Yes | Yes | Yes |
| `guard drift status` | Yes | Yes | Yes | Yes |
| `guard drift timeline` | No | Yes | Yes | Yes |
| `guard drift compare` | No | No | Yes | Yes |
| `guard assoc correlate` | No | No | Yes | Yes |

## Enforcement Notes

- Gated commands fail closed with structured JSON.
- Missing required licenses return exit code `21`.
- Missing required runtime data returns exit code `30`.
- Current CLI gating is enforced at the command entrypoint.
