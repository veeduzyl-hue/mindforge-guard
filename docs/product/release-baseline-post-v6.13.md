# Release Baseline After `v6.13.0`

This note freezes the development baseline for Paddle Phase 1.

## Baseline statement

- The currently installable Guard CLI artifact remains the `v6.13.0` tarball.
- Paddle checkout / webhook / fulfillment work proceeds on the post-`v6.13.0` commercial support mainline now present on `origin/main`.
- Do not mix the published `v6.13.0` CLI release promise with the newer, not-yet-retagged License Hub commercial support baseline.

## Operational interpretation

- `v6.13.0` remains the released CLI anchor for install and offline license UX.
- The payment integration line attaches Paddle to the already-merged License Hub phase 4, Guard CLI phase 5, and phase 6 / 6.5 commercial support surfaces.
- Until a newer formal tag exists, treat this as a bounded commercial support mainline, not a new released CLI semantic line.

## Preserved invariants

- `audit` output / verdict / exit unchanged
- recommendation-only
- additive-only
- non-executing
- default-off where applicable
- no authority expansion
