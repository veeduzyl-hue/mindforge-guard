# MindForge Guard Release Process

This repo ships MindForge Guard via GitHub Releases (primary). npm publish is optional.

## Preconditions

- Node.js >= 18
- npm available
- Clean working tree (no tgz artifacts committed)

## 1. Update version

Edit `packages/guard/package.json`:

- `version`: X.Y.Z

## 2. Local CLI verification (no global install)

From repo root:

```bash
node packages/guard/bin/guard.mjs --version
node packages/guard/bin/guard.mjs --help
node packages/guard/bin/guard.mjs status