# MindForge Guard v7.1.0-rc.0 — Release Candidate Review Packet

**Status:** CANDIDATE_ONLY; never published to npm; no Git tag, GitHub Release, production deployment or pricing change authorized by this packet.

## Identity and version

- Parent main (PR #350): `f4ce0fba170bfb85e95f3be1e244f56ffe20a618`
- Package: `@veeduzyl/mindforge-guard`
- Candidate package manifest: `7.1.0-rc.0`
- Current published baseline stays `7.0.1`.
- Version candidate exists only in the dedicated RC branch and downloadable GitHub Actions artifact; it is not an npm registry version.
- Package license: Apache-2.0.
- Packaging must include `bin/guard.mjs`, `src/cli/report_render_html.mjs`, `src/presentation/role_based_html_report.mjs`, `README.md`, `EDITIONS.md`, and `LICENSE`.

## Included changes

1. Existing v7.0.1 local-first Pack Validate and Single-Agent Report Preview.
2. English-only, offline, three-role HTML renderer, merged earlier in PR #349, now included in the RC tarball.
3. Standalone synthetic 11-file HR Self-Service Sample Pack (PR #350); downloaded separately, never bundled in npm package.
4. Pilot-ready English reading instructions, workflow-selection and adoption feedback materials.

## Test gates — no result before evidence

- Root lockfile package version and package manifest both equal `7.1.0-rc.0`.
- `npm ci`, current `npm run verify`, released-baseline `npm run verify:v7.0.1`, license gate and new renderer tests PASS.
- Rebuild independent Sample Pack and match committed ZIP bytes, manifest and member identities.
- Build a **real .tgz** with `npm pack`, install it into a separate temporary prefix, and run CLI from that installation, not the source tree.
- On both Ubuntu and Windows Server 2022 PowerShell 5.1 + Node 24: check version, Pack Validate, Report JSON, deterministic Pack/Report hash equality, English HTML, original JSON unchanged, byte-identical repeated HTML, refuse overwrite, reject invalid UTF-8/JSON and unsupported args.
- Test missing-license boundaries: Community first-report works; `drift timeline`, `drift compare`, `assoc correlate` remain gated with exit code `21`.
- Upload tarball, its SHA-256, CLI receipts, sample ZIP and Pilot Packet as CI Artifacts. All artifacts must be linked to exact head SHA.
- Keep original CI failure records. A later PASS only validates the tested later commit.

## Release restrictions

`RC_BUILD != STABLE_RELEASE`. No npm publish (including `--tag next`), Git tag, GitHub Release, website deploy, Paddle/License Hub/checkout/entitlement mutation, runtime authorization expansion or automatic acceptance. Actual ordinary Windows 10 user test remains separately untested until observed. A GitHub Actions Windows runner is not the same as that user test.

## Commercial boundaries

- Community free entry includes a first JSON report and English HTML presentation in the candidate.
- Pro: USD 19/month, USD 199/year; Pro+: USD 49/month, USD 499/year; Enterprise: contact sales. These are **unchanged existing public prices**.
- No report/viewer SKU, no runtime approval, enforcement, certification or production assurance.
- B1/B2, T2/T3, Producer, EAK/MESR, Sebbi and prior frozen V8 states remain untouched.

## Post-RC decision

Only after evidence readback and human first-user feedback should Owner separately decide version promotion, main merge and stable publish. If there are missing observations, record them as `NOT_TESTED`, not `PASS`.
