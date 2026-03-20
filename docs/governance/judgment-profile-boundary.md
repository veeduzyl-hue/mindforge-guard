# Judgment Profile Boundary

`v4.6` freezes the first judgment-layer boundary above the existing permit and limited-authority line.

## Included

- unified `judgment_profile` contract
- stable judgment classes
- stable judgment source order
- stable judgment surface and export boundary
- additive-only mapping from signal / permit / governance / limited-authority recommendation

## Excluded

- actual authority execution
- main-path audit mutation
- verdict mutation
- exit-code mutation
- authority scope expansion
- governance object expansion

## Compatibility

- judgment is derived from existing artifacts
- judgment does not replace permit gate
- judgment does not replace governance decision artifacts
- judgment does not replace limited-authority sidecar
