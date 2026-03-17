# MindForge Guard

MindForge Guard is a commercial CLI for deterministic AI coding governance.

## Run From Repository Root

```bash
node packages/guard/bin/guard.mjs --version
node packages/guard/bin/guard.mjs --help
node packages/guard/bin/guard.mjs status
```

## Current Stable Surface

```bash
node packages/guard/bin/guard.mjs audit . --staged
node packages/guard/bin/guard.mjs snapshot .
node packages/guard/bin/guard.mjs drift status --format json
node packages/guard/bin/guard.mjs drift timeline
node packages/guard/bin/guard.mjs drift compare
node packages/guard/bin/guard.mjs assoc correlate
```

License-gated commands fail closed with structured JSON and exit code `21`.

See:

- [docs/EDITIONS.md](/D:/AI%20project/mindforge-guard/docs/EDITIONS.md)
- [docs/LICENSE.md](/D:/AI%20project/mindforge-guard/docs/LICENSE.md)
- [docs/VERIFY.md](/D:/AI%20project/mindforge-guard/docs/VERIFY.md)
