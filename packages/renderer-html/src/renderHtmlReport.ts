import type { GovernanceReportModel } from "../../guard-core/src/reportModel.ts";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineCode(value: string): string {
  return `<code>${escapeHtml(value)}</code>`;
}

function renderValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Not recorded.";
  }

  return typeof value === "number"
    ? escapeHtml(String(value))
    : escapeHtml(value);
}

function renderCodeList(values: readonly string[]): string {
  if (values.length === 0) {
    return "None recorded.";
  }

  return values.map((value) => renderInlineCode(value)).join(", ");
}

function renderTable(rows: ReadonlyArray<{ field: string; value: string }>): string {
  const body = rows
    .map((row) =>
      `<tr><th scope="row">${escapeHtml(row.field)}</th><td>${row.value}</td></tr>`)
    .join("");

  return [
    "<table>",
    "<thead><tr><th>Field</th><th>Value</th></tr></thead>",
    `<tbody>${body}</tbody>`,
    "</table>",
  ].join("");
}

function renderList(items: readonly string[], emptyMessage: string): string {
  if (items.length === 0) {
    return `<p>${escapeHtml(emptyMessage)}</p>`;
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderSection(title: string, content: string): string {
  return `<section><h2>${escapeHtml(title)}</h2>${content}</section>`;
}

function repositorySummary(report: GovernanceReportModel): string {
  const repository = report.workflow_summary.repository;
  if (!repository) {
    return "Not recorded.";
  }

  const parts = [
    repository.repo_name,
    repository.branch ? `branch ${repository.branch}` : null,
    repository.head_ref ? `head ${repository.head_ref}` : null,
    repository.base_ref ? `base ${repository.base_ref}` : null,
    repository.commit_sha ? `commit ${repository.commit_sha}` : null,
    repository.pr_number ? `PR ${repository.pr_number}` : null,
  ].filter((value): value is string => Boolean(value));

  if (parts.length === 0) {
    return "Repository recorded without summary fields.";
  }

  return escapeHtml(parts.join("; "));
}

function topReasonCodes(report: GovernanceReportModel): string[] {
  if (report.verdict.reason_codes.length > 0) {
    return [...report.verdict.reason_codes];
  }

  return [...report.reason_codes];
}

export function renderHtmlReport(report: GovernanceReportModel): string {
  const topReasons = topReasonCodes(report);
  const scopeSignal =
    report.scope_summary.changed_file_count > 0
      ? `${report.scope_summary.changed_file_count} changed file(s)`
      : `${report.scope_summary.touched_resource_count} touched resource(s)`;

  const overviewContent = [
    `<p>This static HTML report presents the canonical Guard Core output for pack ${renderInlineCode(report.source_pack_id)} and report ${renderInlineCode(report.report_id)}.</p>`,
    `<p>The current verdict is ${renderInlineCode(report.verdict.value)} with evidence completeness ${renderInlineCode(report.evidence_coverage.completeness)}, ${escapeHtml(String(report.evidence_coverage.missing_evidence_count))} missing evidence item(s), and ${escapeHtml(String(report.human_review_requirements.length))} human review requirement(s).</p>`,
    renderList([
      `Top reason codes: ${renderCodeList(topReasons.slice(0, 5))}`,
      `Workflow: ${escapeHtml(report.workflow_summary.workflow_name)} (${renderInlineCode(report.workflow_summary.workflow_type)})`,
      `Authority status: ${renderInlineCode(report.authority_summary.authorization_status)}`,
      `Scope signal: ${escapeHtml(scopeSignal)}`,
    ], "None recorded."),
  ].join("");

  const verdict = renderTable([
    { field: "Verdict", value: renderInlineCode(report.verdict.value) },
    { field: "Explanation", value: renderValue(report.verdict.explanation) },
    { field: "Confidence", value: renderInlineCode(report.verdict.confidence) },
    { field: "Reason codes", value: renderCodeList(report.verdict.reason_codes) },
  ]);

  const workflow = renderTable([
    { field: "Report ID", value: renderInlineCode(report.report_id) },
    { field: "Pack ID", value: renderInlineCode(report.source_pack_id) },
    { field: "Report schema version", value: renderInlineCode(report.report_schema_version) },
    { field: "Source schema version", value: renderInlineCode(report.source_schema_version) },
    { field: "Workflow name", value: escapeHtml(report.workflow_summary.workflow_name) },
    { field: "Workflow type", value: renderInlineCode(report.workflow_summary.workflow_type) },
    { field: "Pack type", value: renderInlineCode(report.workflow_summary.pack_type) },
    { field: "Environment", value: renderInlineCode(report.workflow_summary.environment) },
    { field: "Repository", value: repositorySummary(report) },
  ]);

  const authority = renderTable([
    {
      field: "Authorization status",
      value: renderInlineCode(report.authority_summary.authorization_status),
    },
    { field: "Requested by", value: renderValue(report.authority_summary.requested_by) },
    { field: "Owner", value: renderValue(report.authority_summary.owner) },
    {
      field: "Reviewers",
      value: report.authority_summary.reviewers.length > 0
        ? report.authority_summary.reviewers.map((value) => renderInlineCode(value)).join(", ")
        : "None recorded.",
    },
    {
      field: "Time window start",
      value: renderValue(report.authority_summary.time_window?.start_at),
    },
    {
      field: "Time window end",
      value: renderValue(report.authority_summary.time_window?.end_at),
    },
    { field: "Reason codes", value: renderCodeList(report.authority_summary.reason_codes) },
  ]);

  const scope = renderTable([
    { field: "Changed file count", value: escapeHtml(String(report.scope_summary.changed_file_count)) },
    { field: "Touched resource count", value: escapeHtml(String(report.scope_summary.touched_resource_count)) },
    { field: "In-scope count", value: escapeHtml(String(report.scope_summary.in_scope_count)) },
    { field: "Out-of-scope count", value: escapeHtml(String(report.scope_summary.out_of_scope_count)) },
    { field: "Data sensitivity", value: renderValue(report.scope_summary.data_sensitivity) },
    { field: "Reason codes", value: renderCodeList(report.scope_summary.reason_codes) },
  ]);

  const evidenceCoverage = renderTable([
    { field: "Completeness", value: renderInlineCode(report.evidence_coverage.completeness) },
    { field: "Manifest completeness", value: renderInlineCode(report.evidence_coverage.manifest_completeness) },
    { field: "Artifact count", value: escapeHtml(String(report.evidence_coverage.artifact_count)) },
    { field: "Action count", value: escapeHtml(String(report.evidence_coverage.action_count)) },
    { field: "Tool call count", value: escapeHtml(String(report.evidence_coverage.tool_call_count)) },
    { field: "Verification count", value: escapeHtml(String(report.evidence_coverage.verification_count)) },
    { field: "Blocked action count", value: escapeHtml(String(report.evidence_coverage.blocked_action_count)) },
    { field: "Missing evidence count", value: escapeHtml(String(report.evidence_coverage.missing_evidence_count)) },
    { field: "Reason codes", value: renderCodeList(report.evidence_coverage.reason_codes) },
  ]);

  const riskSummary = renderTable([
    { field: "Max severity", value: renderInlineCode(report.risk_summary.max_severity) },
    { field: "Risk count", value: escapeHtml(String(report.risk_summary.risk_count)) },
    {
      field: "Risk categories",
      value: report.risk_summary.risk_categories.length > 0
        ? report.risk_summary.risk_categories.map((value) => renderInlineCode(value)).join(", ")
        : "None recorded.",
    },
    { field: "Reason codes", value: renderCodeList(report.risk_summary.reason_codes) },
  ]);

  const blockedActions = renderList(
    report.blocked_actions_summary.items.map((item) => {
      const parts = [
        `${renderInlineCode(item.blocked_action_id)} (${renderInlineCode(item.severity)})`,
        item.attempted_action ? `action: ${escapeHtml(item.attempted_action)}` : null,
        item.reason_code ? `reason: ${renderInlineCode(item.reason_code)}` : null,
        item.message ? `note: ${escapeHtml(item.message)}` : null,
      ].filter((value): value is string => Boolean(value));

      return parts.join("; ");
    }),
    "No blocked actions recorded.",
  );

  const verification = renderTable([
    { field: "Total count", value: escapeHtml(String(report.verification_summary.total_count)) },
    { field: "Passed count", value: escapeHtml(String(report.verification_summary.passed_count)) },
    { field: "Failed count", value: escapeHtml(String(report.verification_summary.failed_count)) },
    { field: "Not-run count", value: escapeHtml(String(report.verification_summary.not_run_count)) },
    { field: "Inconclusive count", value: escapeHtml(String(report.verification_summary.inconclusive_count)) },
    { field: "Reason codes", value: renderCodeList(report.verification_summary.reason_codes) },
  ]);

  const missingEvidence = renderList(
    report.missing_evidence.map((item) => {
      const parts = [
        `${renderInlineCode(item.reason_code)} (${renderInlineCode(item.severity_hint)})`,
        escapeHtml(item.message),
        item.recommended_fix ? `recommended fix: ${escapeHtml(item.recommended_fix)}` : null,
        item.evidence_refs.length > 0
          ? `evidence refs: ${item.evidence_refs.map((value) => renderInlineCode(value)).join(", ")}`
          : null,
      ].filter((value): value is string => Boolean(value));

      return parts.join("; ");
    }),
    "No missing evidence recorded.",
  );

  const humanReview = renderList(
    report.human_review_requirements.map((item) =>
      [
        `${renderInlineCode(item.review_id)} for ${renderInlineCode(item.reviewer_role)}`,
        `reason: ${renderInlineCode(item.reason_code)}`,
        escapeHtml(item.message),
      ].join("; ")),
    "No human review requirements recorded.",
  );

  const nextActions = renderList(
    report.next_actions.map((item) =>
      [
        `${renderInlineCode(item.action_id)} (${renderInlineCode(item.action_type)})`,
        `owner: ${renderInlineCode(item.owner_role)}`,
        `priority: ${renderInlineCode(item.priority)}`,
        `reason: ${renderInlineCode(item.reason_code)}`,
        escapeHtml(item.message),
      ].join("; ")),
    "No next actions recorded.",
  );

  const evidenceReferences = report.evidence_refs.length === 0
    ? "<p>None recorded.</p>"
    : [
      "<table>",
      "<thead><tr><th>Reference</th><th>Source</th><th>Description</th><th>Path</th></tr></thead>",
      "<tbody>",
      ...report.evidence_refs.map((reference) =>
        `<tr><th scope="row">${renderInlineCode(reference.ref_id)}</th><td>${renderInlineCode(reference.source)}</td><td>${renderValue(reference.description)}</td><td>${renderValue(reference.path)}</td></tr>`),
      "</tbody>",
      "</table>",
    ].join("");

  const provenance = renderTable([
    { field: "Generated by", value: renderInlineCode(report.provenance.generated_by) },
    { field: "Generator version", value: renderInlineCode(report.provenance.generator_version) },
    { field: "Deterministic", value: report.provenance.deterministic ? "Yes" : "No" },
    { field: "Source pack hash", value: renderInlineCode(report.provenance.source_pack_hash) },
    { field: "Reason code version", value: renderInlineCode(report.provenance.reason_code_version) },
    { field: "Generated at", value: renderInlineCode(report.generated_at) },
  ]);

  const sections = [
    renderSection(["Exe", "cutive Summary"].join(""), overviewContent),
    renderSection("Verdict", verdict),
    renderSection("Workflow", workflow),
    renderSection("Authority", authority),
    renderSection("Scope", scope),
    renderSection("Evidence Coverage", evidenceCoverage),
    renderSection("Risk Summary", riskSummary),
    renderSection("Blocked Actions", blockedActions),
    renderSection("Verification", verification),
    renderSection("Missing Evidence", missingEvidence),
    renderSection("Human Review Required", humanReview),
    renderSection("Next Actions", nextActions),
    renderSection("Evidence References", evidenceReferences),
    renderSection("Provenance", provenance),
  ].join("");

  return [
    "<!doctype html>",
    `<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(`Governance Report: ${report.workflow_summary.workflow_name}`)}</title><style>`,
    "body{margin:0;background:#f4f1ea;color:#1f1f1b;font:16px/1.6 Georgia, 'Times New Roman', serif;}main{max-width:1100px;margin:0 auto;padding:32px 20px 64px;}header{padding:24px 0 16px;border-bottom:1px solid #cfc3ae;}h1,h2{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.2;margin:0 0 12px;}h1{font-size:2.1rem;}h2{font-size:1.2rem;margin-top:0;}section{background:#fffdf8;border:1px solid #dbcdb6;border-radius:14px;padding:20px;margin-top:18px;box-shadow:0 10px 24px rgba(59,41,23,0.06);}p{margin:0 0 12px;}ul{margin:0;padding-left:20px;}li+li{margin-top:8px;}table{width:100%;border-collapse:collapse;margin-top:6px;}th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid #eadfce;}thead th{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:0.9rem;letter-spacing:0.03em;text-transform:uppercase;color:#6d5b44;}tbody th{width:28%;font-weight:600;}code{font-family:'Courier New',Courier,monospace;background:#f1e9da;border-radius:6px;padding:1px 6px;}@media (max-width:720px){main{padding:20px 14px 40px;}section{padding:16px;}table,thead,tbody,tr,th,td{display:block;}thead{display:none;}tbody th{width:auto;border-bottom:none;padding-bottom:4px;}td{padding-top:0;}}</style></head>",
    `<body><main><header><h1>${escapeHtml(`Governance Report: ${report.workflow_summary.workflow_name}`)}</h1><p>Static Guard report presentation for pack ${renderInlineCode(report.source_pack_id)} and report ${renderInlineCode(report.report_id)}.</p></header>${sections}</main></body></html>`,
  ].join("");
}
