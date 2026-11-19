# MindForge Guard — M5 Independent First-User Trial v0.2

**PRIVATE INVITATION / SYNTHETIC DATA ONLY / EXPERIMENTAL UNRELEASED CANDIDATE**

Goal: ask a person with **no previous MindForge Guard hands-on use** to test whether the P1-readable First Report is understandable and whether the bounded Windows synthetic First Report workflow can be completed without coaching. This is a voluntary usability study, not an independent Assurance audit, safety certification, contract, or an invitation to use employer/customer data.

**Source under test:** fixed P1 candidate Git SHA `2a5365ea422b6dfb7f3d7bba81138e1e53862be1` built on PR #377. This is NOT the published `@veeduzyl/mindforge-guard@7.0.1` package; the study is a new candidate usability evidence object, not a retrospective reclassification of historical M5.

## 0. First read — safety, eligibility and privacy

- Participate only voluntarily; you may stop at any time without explanation. No fee, employment or product access is implied by the invitation.
- Use only the included **synthetic HR Self-Service Agent** example. Never paste or upload real employee records, customer data, source code, credentials, log files, secrets or production Evidence.
- Do not install any unsigned Native Addon, change Windows ExecutionPolicy, run as Administrator or authorize a cloud service. The test needs no Azure or public Guard release.
- We ask for an anonymous participant code (`M5-P01`, etc.), a date/timezone, broad OS and runtime versions, task outcomes, durations and feedback. You do not need to share your real name, employer, email address, full paths, screenshots containing PII, or raw documents.
- Do not open the assessor's scoring rubric. Stop and record a BLOCKED result if anything requires real data, unknown privileged software or unclear cleanup. Leave the synthetic temporary folder for your own inspection; no automatic removal is necessary.
- Please use a **Windows 10/11 x64 desktop**, Windows PowerShell 5.1, Node.js 24 x64 and Git for Track B. Track A requires only a browser and local HTML support. If you have used Guard CLI before, you may contribute report-reading feedback but cannot be counted as the independent *first-time workflow* participant.

## Choose exactly one test track before you begin

**Track A — Report comprehension (10–15 minutes, no install).** Open `reading/report.html` from the extracted package. Do not open `reading/report.json` until instructed. Without searching the web or asking for assistance, answer the report-understanding questions below in your own words. This track measures readability and comprehension; alone it **does not satisfy the M5 full First Report user workflow gate**.

**Track B — Uncoached full Windows first use (about 20–30 minutes expected, not a success threshold).** Do not preview `reading/report.html` before completing your own workflow. You will use the **locally provided** fixed-source Git bundle (no GitHub network required), inspect and decide on eight synthetic structural mappings, and generate your own HTML report with Guard. The project Owner/observer should be silent and give only safety help.

## Track A — uncoached reading prompts

1. Open `reading/report.html`. Can you find the Agent's intended task? Write it in one sentence.
2. What does `Ready for human review` authorize, and what does it **not** authorize?
3. Switch through all three reader perspectives using keyboard only (Tab and arrow keys) or mouse. What kind of information changes between the three views? Does the underlying review status change?
4. Locate at least one `Source field` link and the expandable original JSON. Do those references independently verify that a source really executed?
5. Identify one limitation that would prevent using the report alone as production Assurance.
6. At normal zoom and 200% browser zoom, rate the readability of body text, link labels and source metadata. Note any scrolling, focus, contrast or comprehension difficulty.
7. Record the time you first opened the report and the time you finished answering. Write what confused you most and what you expected but did not find.

Do not use ChatGPT, a developer, an internal source guide or the answer key to complete the questions. A wrong or unknown answer is valuable usability evidence.

## Track B — offline Windows full first-use flow

**Start timer BEFORE reading these steps.** Extract the downloaded ZIP into a newly chosen directory. Open a normal, non-administrator PowerShell window. Use no actual HR records; the program includes its own fixed synthetic sample.

```powershell
$ErrorActionPreference = 'Stop'
$kit = '<ABSOLUTE_PATH_TO_EXTRACTED_M5_KIT>'
$bundle = Join-Path $kit 'source\mindforge-guard-p1-fixed.bundle'
$target = Join-Path $env:USERPROFILE 'Documents\Guard-M5-FirstUser-Synthetic'
if (-not (Test-Path -LiteralPath $bundle -PathType Leaf)) { throw 'M5_SOURCE_BUNDLE_NOT_FOUND' }
if (Test-Path -LiteralPath $target) { throw 'M5_TARGET_ALREADY_EXISTS_DO_NOT_OVERWRITE' }

# Compare this digest with the separate invitation's approved ZIP/source identity.
Get-FileHash -LiteralPath $bundle -Algorithm SHA256
git clone $bundle $target
if ($LASTEXITCODE -ne 0) { throw 'M5_OFFLINE_CLONE_FAILED' }
Set-Location $target
$head = (git rev-parse HEAD).Trim()
if ($head -ne '2a5365ea422b6dfb7f3d7bba81138e1e53862be1') { throw 'M5_WRONG_SOURCE_HEAD' }
git status --porcelain
$env:ARCH_V02X_FIRST_REPORT_DEMO_SYNTHETIC_ONLY = '1'
$demo = Join-Path $env:TEMP ('guard-v02x-synthetic-' + [guid]::NewGuid().ToString('N'))
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode prepare --workspace $demo
```

**Pause here and record the start time, any error, and number of manual commands.** Open the files indicated by the program:

```powershell
notepad (Join-Path $demo 'START_HERE.txt')
notepad (Join-Path $demo 'mapping-review.synthetic.json')
notepad (Join-Path $demo 'mapping-decisions.synthetic.json')
explorer.exe (Join-Path $demo 'synthetic-input-pack')
```

Independently review each source locator and the corresponding **synthetic** file and decide `confirm`, `reject` or `defer`. The default for all eight mappings is `defer`. If you confirm an item after reviewing its synthetic source, set `decision` to `confirm`, `basis` to `source_reviewed`, and `notes` to `['synthetic_checked_structure']` for **that item only**. Do not automatically approve all eight, and do not change source hashes, mapping IDs or original synthetic files. A `reject` or `defer` is a legitimate user result; it will prevent this particular fixed demonstration from producing a final delivery.

If and only if you deliberately confirmed all eight, save the file and run:

```powershell
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode complete --workspace $demo
node .\scripts\arch_v02x_m3_first_report_walkthrough_synthetic.mjs --mode status --workspace $demo
if (Test-Path -LiteralPath (Join-Path $demo 'delivery\report.html')) {
    Invoke-Item (Join-Path $demo 'delivery\report.html')
}
```

**Do not feel compelled to get `COMPLETE` success.** Record the actual stop reason if any. If a report opens, answer the same comprehension questions in Track A using your own generated report; do not open the packaged `reading/report.html` in place of your output.

## Evidence and results to return

Complete `M5_P1_OBSERVATION_FORM_v0.2.md` and `M5_P1_SESSION_RECEIPT_TEMPLATE.json`, preserving actual statuses and `NOT_RUN` where applicable. If the task was never started or ended early, report that exactly. You can return these files privately to the inviter; **do not return a raw Pack, a system event log, screenshots showing user names/paths, or real files**.

**No participant contact, participation, completion or acceptance is implied merely because this test packet exists.** The Owner must review the real observer's transcript/receipt and make a separate M5 disposition; uncoached first use is not proven by automated CI.

---

## 中文简要说明

此包仅用于 **MindForge Guard 合成 First Report 的独立首次用户可用性测试**。A 轨道只看本地 HTML 报告并回答理解问题；B 轨道在普通权限 Windows PowerShell 5.1 使用离线 Git bundle、Node.js 24，在全新的临时目录自行核对 8 个合成字段并运行 PREPARE/COMPLETE。没有真实客户数据，也不要求安装签名/未签名 Native Addon。请自行记录开始与结束时间、命令次数、求助次数、遇到的错误，以及对 `Ready for human review` 和“没有执行/审批权”的理解。不得为了完成实验而强行将 `defer` 改为 `confirm`。B 轨道需要**此前从未使用过 Guard** 的外部参与者才能作为 M5 独立首次使用证据。测试者可以随时停止；结果仍按实际失败、暂缓和未知情况登记。
