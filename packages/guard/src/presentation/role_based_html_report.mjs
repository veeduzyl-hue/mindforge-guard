import crypto from 'node:crypto';

// Downstream, deterministic, English-only presentation of a v7.0 preview JSON.
// Do not infer authorization, proof, execution, or verified provenance from fields.
const POSTURES = new Set(['ready_for_review', 'needs_human_review', 'insufficient_evidence', 'out_of_scope', 'unknown']);

export function validatePreviewForRendering(report) {
  if (!report || Array.isArray(report) || typeof report !== 'object') throw new Error('Expected a JSON report object.');
  if (report.object_type !== 'single_agent_governance_report_preview' || report.object_version !== 'v1' || report.report_mode !== 'preview') {
    throw new Error('Unsupported report contract. Expected single_agent_governance_report_preview v1 in preview mode.');
  }
  if (!POSTURES.has(report.review_posture)) throw new Error('Unknown review posture.');
  if (typeof report.agent_identity?.agent_label !== 'string' || !report.agent_identity.agent_label.trim()) throw new Error('Agent identity is missing.');
  if (!Array.isArray(report.findings) || !Array.isArray(report.receipt_refs) || !Array.isArray(report.artifact_provenance?.source_refs)) {
    throw new Error('Required review arrays or provenance references are missing.');
  }
  if (typeof report.deterministic_hash !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(report.deterministic_hash)) {
    throw new Error('Report deterministic_hash is unavailable or invalid.');
  }
  const boundary = report.non_enforcement_boundary;
  const required = {
    recommendation_only: true, non_executing: true, approval_granted: false,
    execution_permission_granted: false, blocking_effect: false,
    merge_authority: false, deployment_authority: false,
    enforcement_action: 'none', legal_compliance_claim: false,
  };
  for (const [field, value] of Object.entries(required)) {
    if (boundary?.[field] !== value) throw new Error(`Non-enforcement contract mismatch: ${field}`);
  }
  const authority = report.authority_envelope;
  for (const field of ['approval_granted', 'execution_permission_granted', 'merge_authority', 'deployment_authority', 'blocking_effect']) {
    if (authority?.[field] !== false) throw new Error(`Authority boundary mismatch: ${field}`);
  }
}

function esc(input) {
  return String(input ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const display = (v) => v === null || v === undefined || v === '' ? 'Not supplied in the source report.' : String(v);
const formatStatus = (s) => ({
  ready_for_review: 'Ready for human review', needs_human_review: 'Human attention needed',
  insufficient_evidence: 'Insufficient evidence', out_of_scope: 'Out of scope', unknown: 'Unknown',
}[s] || 'Unknown');
const pathCaption = (path) => `<div class="path">Source field: <code>${esc(path)}</code> · <a href="#original-report">Inspect original JSON</a></div>`;
function card(title, content, sourcePath, extra = '') {
  return `<section class="card ${extra}"><h3>${esc(title)}</h3><p>${esc(display(content))}</p>${pathCaption(sourcePath)}</section>`;
}
function listCard(title, items, sourcePath, emptyMessage) {
  const safe = Array.isArray(items) ? items : [];
  return `<section class="card"><h3>${esc(title)}</h3>${safe.length
    ? `<ul class="ref-list">${safe.map(x => `<li><code>${esc(x)}</code></li>`).join('')}</ul>`
    : `<p>${esc(emptyMessage)}</p>`}${pathCaption(sourcePath)}</section>`;
}
function kv(label, value, path) {
  return `<div class="kv"><dt>${esc(label)}</dt><dd>${esc(display(value))}</dd></div>${pathCaption(path)}`;
}
function findingsCard(findings) {
  return `<section class="card"><h3>Reported findings</h3><div class="findings">${findings.map((f, i) => `
  <article class="finding"><span class="number">${i+1}</span><div><strong>${esc(display(f.category))} · ${esc(display(f.severity))}</strong>
  <p>${esc(display(f.summary))}</p>${pathCaption(`/findings/${i}`)}</div></article>`).join('')}</div>
  <p class="fine">Findings are input report statements, not independent confirmation by this renderer.</p></section>`;
}
function checkCard(checks) {
  const items = Array.isArray(checks) ? checks : [];
  return `<section class="card"><h3>Preview checks</h3>${items.length ? `<div class="findings">${items.map((c,i)=>
    `<article class="finding"><span class="number">${i+1}</span><div><strong>${esc(display(c.check_name))} · ${esc(display(c.outcome))}</strong><p>${esc(display(c.summary))}</p>${pathCaption(`/policy_evaluation_preview/checks/${i}`)}</div></article>`).join('')}</div>` : '<p>No checks were supplied.</p>'}
  <p class="fine">Preview checks do not prove execution, security assurance, or compliance.</p></section>`;
}

export function renderRoleBasedHtml(report, rawJsonBytes) {
  validatePreviewForRendering(report);
  if (!Buffer.isBuffer(rawJsonBytes) || !rawJsonBytes.length) throw new Error('Original UTF-8 JSON bytes are required.');
  const byteDigest = crypto.createHash('sha256').update(rawJsonBytes).digest('hex');
  const rawText = new TextDecoder('utf-8', {fatal: true}).decode(rawJsonBytes);
  // Ensure the supplied byte representation matches the already parsed report.
  if (JSON.stringify(JSON.parse(rawText)) !== JSON.stringify(report)) throw new Error('Input bytes and report object do not match.');
  const openIssues = report.review_evidence?.open_issues;
  const checks = report.policy_evaluation_preview?.checks;
  const css = `
:root{--ink:#20324a;--muted:#5c6d80;--line:#dce4ed;--paper:#fff;--canvas:#f3f6fa;--navy:#142944;--navy2:#23546a;--teal:#086a70;--warm:#fff4e2;--amber:#815316;--radius:15px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{background:var(--canvas);color:var(--ink);font:15px/1.65 system-ui,-apple-system,'Segoe UI',Arial,sans-serif;margin:0}
a{color:var(--teal)}a:focus-visible,label:focus-visible,input:focus-visible{outline:3px solid #0b91a2;outline-offset:3px}
.container{max-width:1150px;margin:0 auto;padding:0 24px}.top{background:#fff;border-bottom:1px solid var(--line)}.top .container{display:flex;align-items:center;gap:14px;min-height:65px}.logo{width:36px;height:36px;border-radius:9px;background:var(--navy);color:#fff;display:grid;place-items:center;font-weight:900}.brand{font-weight:800;font-size:15px}.micro{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);font-weight:700}
.hero{background:linear-gradient(125deg,#142a44,#25576a);color:#fff;margin:25px auto 0;border-radius:20px;padding:32px 38px;display:flex;align-items:center;justify-content:space-between;gap:30px}.hero .micro{color:#a5d8da}.hero h1{font-size:clamp(24px,3.2vw,36px);line-height:1.25;margin:10px 0}.hero p{margin:0;color:#d6e5eb;max-width:640px;font-size:13px}.hero-aside{min-width:240px;padding:15px 18px;border:1px solid #6d8795;border-radius:12px;background:rgba(255,255,255,.08)}.hero-aside strong{display:block;font-size:18px;margin:7px 0}.hero-aside p{font-size:12px}.notice{background:var(--warm);border:1px solid #f0dcb8;border-radius:13px;color:#714f19;padding:15px 20px;margin:18px 0}.notice strong{display:block;margin-bottom:4px}.notice p{margin:0;font-size:13px}
.meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}.mini,.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:17px 20px}.mini .value{font-size:13px;font-weight:750;overflow-wrap:anywhere;margin-top:3px}.mini .sub{font-size:11px;color:var(--muted)}
.section-head{margin:28px 0 15px}.section-head h2{margin:0 0 3px;font-size:22px}.section-head p{margin:0;color:var(--muted);font-size:13px}
.role-interface{position:relative}.role-interface input[type=radio]{position:absolute;width:1px;height:1px;opacity:0}.selector{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:18px}.selector label{padding:11px 16px;border-radius:10px;border:1px solid var(--line);background:#fff;color:#526379;cursor:pointer;font-weight:700;font-size:13px}.selector label:hover{background:#ebf4f5}.role-interface input#view-business:checked ~ .selector label[for=view-business],.role-interface input#view-technical:checked ~ .selector label[for=view-technical],.role-interface input#view-governance:checked ~ .selector label[for=view-governance]{background:var(--navy);color:#fff;border-color:var(--navy)}
.panels .panel{display:none}.role-interface input#view-business:checked ~ .panels .role-business,.role-interface input#view-technical:checked ~ .panels .role-technical,.role-interface input#view-governance:checked ~ .panels .role-governance{display:block}
.panel-header{margin:0 0 15px}.panel-header h2{margin:0 0 4px;font-size:21px}.panel-header p{color:var(--muted);margin:0;font-size:13px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card h3{font-size:16px;margin:0 0 8px}.card p{color:#405269;margin:0 0 11px;font-size:13px;line-height:1.77;white-space:pre-wrap;overflow-wrap:anywhere}.full{grid-column:1/-1}.path{font-size:10px;color:#7c8a9a;padding-top:9px;border-top:1px solid #edf1f5;overflow-wrap:anywhere}.path code{font:11px Consolas,monospace;color:#536e82}.ref-list{margin:0 0 12px;padding-left:19px}.ref-list li{margin:5px 0;font-size:12px;overflow-wrap:anywhere}.ref-list code,.code{font:12px Consolas,monospace;overflow-wrap:anywhere}.kv{display:flex;justify-content:space-between;gap:12px;margin:8px 0}.kv dt{color:var(--muted);font-size:12px}.kv dd{margin:0;font-size:12px;text-align:right;font-weight:700;overflow-wrap:anywhere}.finding{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #edf1f5}.finding:last-child{border:0}.finding strong{font-size:12px}.finding p{margin:4px 0}.number{flex:0 0 24px;height:24px;border-radius:7px;background:#e5f3f1;color:var(--teal);display:grid;place-items:center;font-size:11px;font-weight:800}.fine{color:var(--muted)!important;font-size:11px!important}
.raw{margin:26px 0;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:20px}.raw summary{cursor:pointer;font-weight:800}.raw p{font-size:12px;color:var(--muted)}.raw pre{background:#102238;color:#e1ebf0;padding:17px;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:440px;overflow-y:auto;font:11px/1.6 Consolas,monospace}
footer{padding:15px 0 35px;font-size:12px;color:var(--muted)}@media(max-width:750px){.container{padding:0 14px}.hero{padding:25px;display:block}.hero-aside{margin-top:18px}.grid,.meta{grid-template-columns:1fr}.card{padding:17px}.selector{display:grid;grid-template-columns:1fr}.selector label{width:100%}}@media print{body{background:#fff}.hero{background:#fff!important;color:#111;border:1px solid #ccc}.hero p{color:#555}.notice{border:1px solid #bbb}.selector{display:none}.panels .panel{display:block!important;break-before:page}.card{break-inside:avoid}.raw pre{max-height:none}}
`;
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; connect-src 'none'; object-src 'none'">\n<title>MindForge Guard | ${esc(report.agent_identity.agent_label)} | Review Presentation</title>\n<style>${css}</style>\n</head><body>\n<header class="top"><div class="container"><div class="logo" aria-hidden="true">M</div><div><div class="brand">MindForge Guard</div><div class="micro">Evidence presentation · English</div></div></div></header>\n<main class="container"><div class="hero"><div><div class="micro">Single-agent governance report · preview</div><h1>${esc(report.agent_identity.agent_label)}</h1><p>${esc(display(report.intent_summary))}</p></div><div class="hero-aside"><div class="micro">Source review posture</div><strong>${esc(formatStatus(report.review_posture))}</strong><p>Review routing only. Not approval, certification, or permission to execute.</p></div></div>\n<div class="notice"><strong>Human review required · No operational authority</strong><p>The source JSON is a preview derived from an Evidence Pack. The renderer only presents its statements; it does not independently verify evidence, issue approvals, certify compliance, execute actions, or confer merge/deployment authority. References may be generated identifiers, not authenticated receipts.</p></div>\n<div class="meta"><div class="mini"><div class="micro">Source report timestamp</div><div class="value">${esc(display(report.generated_at))}</div><div class="sub">Source-supplied; not the HTML rendering or test time.</div></div><div class="mini"><div class="micro">Reported evidence hash</div><div class="value code">${esc(report.deterministic_hash)}</div><div class="sub">Input report value; not reverified by this renderer.</div></div><div class="mini"><div class="micro">Input JSON byte digest</div><div class="value code">sha256:${byteDigest}</div><div class="sub">Calculated from exact UTF-8 source bytes; distinct digest domain.</div></div></div>\n<div class="section-head"><h2>Choose a reader perspective</h2><p>Three presentations of the same report. Source values and review posture are never recalculated.</p></div>\n<div class="role-interface">\n<input type="radio" id="view-business" name="role" checked><input type="radio" id="view-technical" name="role"><input type="radio" id="view-governance" name="role">\n<nav class="selector" aria-label="Reader perspective"><label for="view-business">Business owner</label><label for="view-technical">Technical reviewer</label><label for="view-governance">Governance / risk reviewer</label></nav>\n<div class="panels">\n<section class="panel role-business"><div class="panel-header"><h2>Business owner</h2><p>What is this agent intended to do, and what should humans review?</p></div><div class="grid">\n${card('Intended task', report.intent_summary, '/intent_summary')}
${card('Observed or summarized action', report.action_summary, '/action_summary')}
${card('Authority boundary', report.authority_summary, '/authority_summary')}
${card('Evidence at a glance', report.evidence_summary, '/evidence_summary')}
${card('Risk signals (source statement)', report.risk_summary, '/risk_summary')}
${card('What happens next?', `Review posture: ${formatStatus(report.review_posture)}. Human review is required; no automatic approval or execution follows.`, '/review_posture')}
</div></section>\n<section class="panel role-technical"><div class="panel-header"><h2>Technical reviewer</h2><p>Trace the stated evidence and distinguish identifiers from verification.</p></div><div class="grid">\n${card('Evidence coverage',report.evidence_summary,'/evidence_summary')}
${card('Lineage statement',report.lineage_summary,'/lineage_summary')}
${listCard('Source references (input-reported)',report.artifact_provenance.source_refs,'/artifact_provenance/source_refs','No source references supplied.')}
${listCard('Receipt references (not independently validated)',report.receipt_refs,'/receipt_refs','No receipt references supplied.')}
${card('Procedural receipt summary',report.procedural_receipt_summary,'/procedural_receipt_summary')}
${card('Transition context',report.transition_summary,'/transition_summary')}
<section class="card full"><h3>Provenance boundaries</h3><dl>${kv('Input origin', report.execution_path_snapshot?.input_origin,'/execution_path_snapshot/input_origin')}${kv('Runtime execution performed',report.execution_path_snapshot?.runtime_execution_performed,'/execution_path_snapshot/runtime_execution_performed')}${kv('Workflow execution performed',report.execution_path_snapshot?.workflow_execution_performed,'/execution_path_snapshot/workflow_execution_performed')}${kv('Metadata completeness (reported)',report.artifact_provenance?.metadata_completeness,'/artifact_provenance/metadata_completeness')}</dl><p class="fine">A reference, digest or “present” flag alone does not establish authenticity, external custody or real-world execution.</p></section>
</div></section>\n<section class="panel role-governance"><div class="panel-header"><h2>Governance / risk reviewer</h2><p>Authority, review findings, omissions, and limits without enforcement.</p></div><div class="grid">\n${card('Authority and prohibited scope',report.authority_summary,'/authority_summary')}
${card('Risk statement',report.risk_summary,'/risk_summary')}
${card('Drift statement',report.drift_summary,'/drift_summary')}
${card('Admissibility statement',report.admissibility_summary,'/admissibility_summary')}
${card('Guardrail mapping',report.guardrail_mapping_summary,'/guardrail_mapping_summary')}
${listCard('Open issues in source report',openIssues,'/review_evidence/open_issues','No open issues are listed. This is not proof that none exist.')}
<div class="full">${findingsCard(report.findings)}</div>
<div class="full">${checkCard(checks)}</div>
<section class="card full"><h3>Non-enforcement boundary (source)</h3><dl>${kv('Recommendation-only',report.non_enforcement_boundary.recommendation_only,'/non_enforcement_boundary/recommendation_only')}${kv('Non-executing',report.non_enforcement_boundary.non_executing,'/non_enforcement_boundary/non_executing')}${kv('Approval granted',report.non_enforcement_boundary.approval_granted,'/non_enforcement_boundary/approval_granted')}${kv('Merge authority',report.non_enforcement_boundary.merge_authority,'/non_enforcement_boundary/merge_authority')}${kv('Deployment authority',report.non_enforcement_boundary.deployment_authority,'/non_enforcement_boundary/deployment_authority')}</dl><p class="fine">The renderer does not enforce these properties; it validates that the input makes no contradictory authority claim.</p></section>
</div></section>\n</div></div>\n<details class="raw" id="original-report"><summary>Inspect the original input JSON (read-only)</summary><p>The content below is the exact decoded UTF-8 input text, HTML-escaped for safe display. Keep the source JSON file for exact byte custody; this HTML is a presentation artifact, not a substitute.</p><pre>${esc(rawText)}</pre></details>\n<footer>MindForge Guard · Offline, English-only report presentation · v0.1 · No network connections, model calls, runtime controls, or new governance decisions.</footer>\n</main></body></html>\n`;
}
