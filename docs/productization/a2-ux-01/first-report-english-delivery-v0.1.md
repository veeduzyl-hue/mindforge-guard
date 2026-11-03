# A2-UX-01 — English First Report Delivery v0.1

**Next-release candidate. Not part of published npm v7.0.1.**

MindForge Guard is a deterministic, local-first evidence presentation layer for single-agent AI workflows. It presents bounded evidence for human review; it is not an approval system, blocker, control plane, compliance certification, or execution authority.

## Standalone sample distribution

Download the independent [standalone sample ZIP](../../../downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip), [manifest](../../../downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip.manifest.json), and [SHA-256 sidecar](../../../downloads/mindforge-guard-hr-self-service-sample-pack-v0.1.zip.sha256) from the repository. It contains exactly eleven unchanged synthetic Evidence Pack files, not a source repository archive. Source commit: `46d77530a28b0a28d02e1c7ba29ccfa52e265849`; sample tree: `f943fc9ced5f3087e70ecebcdf1cc7a5b323cce1`. Verify the ZIP with the adjacent `.sha256` file and inspect its manifest. Archive SHA-256, Git Blob SHA-1 and Guard logical deterministic hash are distinct digest domains.

Extract into an empty, short-path working directory. The archive root is `hr-self-service-agent/`; retain the nested `evidence/` folder. The pack is synthetic and illustrative only, not evidence of a customer's own workflow or production behavior.

## First report flow

Install the released Guard package, verify its version, extract the sample, validate it and generate JSON. Check each process exit code, stderr, JSON status and report hash. Do not infer success from file existence alone.

```sh
guard pack validate --pack hr-self-service-agent --preview --json > pack-validation.json
guard report single-agent --pack hr-self-service-agent --preview --json > first-report.json
```

### Windows PowerShell 5.1

PowerShell 5.1 native `>` redirection writes UTF-16LE. Use native CMD redirection instead:

```powershell
cmd.exe /d /c 'guard.cmd pack validate --pack "hr-self-service-agent" --preview --json 1>"pack-validation.json" 2>"pack-validation.stderr.txt"'
if ($LASTEXITCODE -ne 0) { throw 'Pack Validate failed; inspect JSON and stderr.' }
cmd.exe /d /c 'guard.cmd report single-agent --pack "hr-self-service-agent" --preview --json 1>"first-report.json" 2>"first-report.stderr.txt"'
if ($LASTEXITCODE -ne 0) { throw 'Report generation failed; inspect JSON and stderr.' }
```

### English HTML renderer release distinction

The `guard report render --input first-report.json --out first-report.html --format html` command is on repository main after PR #349, but **is not included in published npm v7.0.1**. Do not advertise it as available to v7.0.1 users. It requires a future separately authorized package release, or the candidate source checkout for source testing.

The HTML offers Business owner, Technical reviewer and Governance / Risk reviewer perspectives over the same JSON. It is an offline reading aid and does not recalculate or approve governance findings. The original JSON is embedded as escaped read-only text; inspect it for sensitive information before sharing the HTML.

`ready_for_review` means ready for human review, not approval, assurance, certification, or permission to execute. Source timestamps may refer to fixture time, not actual execution time. A reference, hash or `present` flag does not independently authenticate provenance.

## Commercial packaging

| Edition | Price (unchanged) | First-report allocation |
|---|---:|---|
| Community | Free | Standalone sample, Pack Validate, JSON preview and English HTML when released |
| Pro | $19/month; $199/year | Community plus released timeline and historical governance capabilities |
| Pro+ | $49/month; $499/year | Pro plus released comparison and deeper analytics |
| Enterprise | Contact sales | Procurement, rollout and bounded review support; no extra runtime authority |

No new HTML-report SKU, per-report fee or per-seat view fee is proposed. Paddle, License Hub, prices and entitlements remain unchanged.

A bounded human-assisted First Governance Report Pilot may be explored separately at an indicative USD 1,500–3,000 per engagement. This is research-only pricing, not a published offer or commitment. It excludes certification, legal conclusions, execution control and production assurance.

No npm release, version/tag update, website deployment, Paddle or License Hub change is authorized by this work.
