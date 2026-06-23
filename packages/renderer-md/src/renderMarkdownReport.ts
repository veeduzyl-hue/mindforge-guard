import type { GovernanceReportModel } from "../../guard-core/src/reportModel.ts";

function asInlineCode(value: string): string {
  return `\`${value}\``;
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br />");
}

function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Not recorded.";
  }

  return typeof value === "number" ? String(value) : escapeTableCell(value);
}

function formatCodeList(values: readonly string[], limit = values.length): string {
  if (values.length === 0) {
    return "None recorded.";
  }

  return values
    .slice(0, limit)
    .map((value) => asInlineCode(value))
    .join(", ");
}

function pushSection(lines: string[], title: string): void {
  lines.push(`## ${title}`, "");
}

function pushTable(
  lines: string[],
  rows: ReadonlyArray<{ field: string; value: string }>,
): void {
  lines.push("| Field | Value |", "| --- | --- |");
  for (const row of rows) {
    lines.push(`| ${escapeTableCell(row.field)} | ${row.value} |`);
  }
  lines.push("");
}

function pushList(lines: string[], items: readonly string[], emptyMessage: string): void {
  if (items.length === 0) {
    lines.push(emptyMessage, "");
    return;
  }

  for (const item of items) {
    lines.push(`- ${item}`);
  }
  lines.push("");
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

  return escapeTableCell(parts.join("; "));
}

function topReasonCodes(report: GovernanceReportModel): string[] {
  if (report.verdict.reason_codes.length > 0) {
    return [...report.verdict.reason_codes];
  }

  return [...report.reason_codes];
}

export function renderMarkdownReport(report: GovernanceReportModel): string {
  const lines: string[] = [];
  const topReasons = topReasonCodes(report);
  const scopeSignal =
    report.scope_summary.changed_file_count > 0
      ? `${report.scope_summary.changed_file_count} changed file(s)`
      : `${report.scope_summary.touched_resource_count} touched resource(s)`;

  lines.push(
    `# Governance Report: ${report.workflow_summary.workflow_name}`,
    "",
  );

  pushSection(lines, "Executive Summary");
  lines.push(
    `This Markdown report presents the canonical Guard Core output for pack ${asInlineCode(report.source_pack_id)} and report ${asInlineCode(report.report_id)}.`,
    "",
    `The current verdict is ${asInlineCode(report.verdict.value)} with evidence completeness ${asInlineCode(report.evidence_coverage.completeness)}, ${report.evidence_coverage.missing_evidence_count} missing evidence item(s), and ${report.human_review_requirements.length} human review requirement(s).`,
    "",
  );
  pushList(
    lines,
    [
      `Top reason codes: ${formatCodeList(topReasons, 5)}`,
      `Workflow: ${escapeTableCell(report.workflow_summary.workflow_name)} (${asInlineCode(report.workflow_summary.workflow_type)})`,
      `Authority status: ${asInlineCode(report.authority_summary.authorization_status)}`,
      `Scope signal: ${scopeSignal}`,
    ],
    "None recorded.",
  );

  pushSection(lines, "Verdict");
  pushTable(lines, [
    { field: "Verdict", value: asInlineCode(report.verdict.value) },
    {
      field: "Explanation",
      value: formatValue(report.verdict.explanation),
    },
    {
      field: "Confidence",
      value: asInlineCode(report.verdict.confidence),
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.verdict.reason_codes),
    },
  ]);

  pushSection(lines, "Workflow");
  pushTable(lines, [
    { field: "Report ID", value: asInlineCode(report.report_id) },
    { field: "Pack ID", value: asInlineCode(report.source_pack_id) },
    {
      field: "Report schema version",
      value: asInlineCode(report.report_schema_version),
    },
    {
      field: "Source schema version",
      value: asInlineCode(report.source_schema_version),
    },
    {
      field: "Workflow name",
      value: escapeTableCell(report.workflow_summary.workflow_name),
    },
    {
      field: "Workflow type",
      value: asInlineCode(report.workflow_summary.workflow_type),
    },
    {
      field: "Pack type",
      value: asInlineCode(report.workflow_summary.pack_type),
    },
    {
      field: "Environment",
      value: asInlineCode(report.workflow_summary.environment),
    },
    {
      field: "Repository",
      value: repositorySummary(report),
    },
  ]);

  pushSection(lines, "Authority");
  pushTable(lines, [
    {
      field: "Authorization status",
      value: asInlineCode(report.authority_summary.authorization_status),
    },
    {
      field: "Requested by",
      value: formatValue(report.authority_summary.requested_by),
    },
    {
      field: "Owner",
      value: formatValue(report.authority_summary.owner),
    },
    {
      field: "Reviewers",
      value:
        report.authority_summary.reviewers.length > 0
          ? report.authority_summary.reviewers
              .map((value) => asInlineCode(value))
              .join(", ")
          : "None recorded.",
    },
    {
      field: "Time window start",
      value: formatValue(report.authority_summary.time_window?.start_at),
    },
    {
      field: "Time window end",
      value: formatValue(report.authority_summary.time_window?.end_at),
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.authority_summary.reason_codes),
    },
  ]);

  pushSection(lines, "Scope");
  pushTable(lines, [
    {
      field: "Changed file count",
      value: String(report.scope_summary.changed_file_count),
    },
    {
      field: "Touched resource count",
      value: String(report.scope_summary.touched_resource_count),
    },
    {
      field: "In-scope count",
      value: String(report.scope_summary.in_scope_count),
    },
    {
      field: "Out-of-scope count",
      value: String(report.scope_summary.out_of_scope_count),
    },
    {
      field: "Data sensitivity",
      value: formatValue(report.scope_summary.data_sensitivity),
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.scope_summary.reason_codes),
    },
  ]);

  pushSection(lines, "Evidence Coverage");
  pushTable(lines, [
    {
      field: "Completeness",
      value: asInlineCode(report.evidence_coverage.completeness),
    },
    {
      field: "Manifest completeness",
      value: asInlineCode(report.evidence_coverage.manifest_completeness),
    },
    {
      field: "Artifact count",
      value: String(report.evidence_coverage.artifact_count),
    },
    {
      field: "Action count",
      value: String(report.evidence_coverage.action_count),
    },
    {
      field: "Tool call count",
      value: String(report.evidence_coverage.tool_call_count),
    },
    {
      field: "Verification count",
      value: String(report.evidence_coverage.verification_count),
    },
    {
      field: "Blocked action count",
      value: String(report.evidence_coverage.blocked_action_count),
    },
    {
      field: "Missing evidence count",
      value: String(report.evidence_coverage.missing_evidence_count),
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.evidence_coverage.reason_codes),
    },
  ]);

  pushSection(lines, "Risk Summary");
  pushTable(lines, [
    {
      field: "Max severity",
      value: asInlineCode(report.risk_summary.max_severity),
    },
    {
      field: "Risk count",
      value: String(report.risk_summary.risk_count),
    },
    {
      field: "Risk categories",
      value:
        report.risk_summary.risk_categories.length > 0
          ? report.risk_summary.risk_categories
              .map((value) => asInlineCode(value))
              .join(", ")
          : "None recorded.",
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.risk_summary.reason_codes),
    },
  ]);

  pushSection(lines, "Blocked Actions");
  pushList(
    lines,
    report.blocked_actions_summary.items.map((item) => {
      const parts = [
        `${asInlineCode(item.blocked_action_id)} (${asInlineCode(item.severity)})`,
        item.attempted_action ? `action: ${item.attempted_action}` : null,
        item.reason_code ? `reason: ${asInlineCode(item.reason_code)}` : null,
        item.message ? `note: ${item.message}` : null,
      ].filter((value): value is string => Boolean(value));

      return parts.join("; ");
    }),
    "No blocked actions recorded.",
  );

  pushSection(lines, "Verification");
  pushTable(lines, [
    {
      field: "Total count",
      value: String(report.verification_summary.total_count),
    },
    {
      field: "Passed count",
      value: String(report.verification_summary.passed_count),
    },
    {
      field: "Failed count",
      value: String(report.verification_summary.failed_count),
    },
    {
      field: "Not-run count",
      value: String(report.verification_summary.not_run_count),
    },
    {
      field: "Inconclusive count",
      value: String(report.verification_summary.inconclusive_count),
    },
    {
      field: "Reason codes",
      value: formatCodeList(report.verification_summary.reason_codes),
    },
  ]);

  pushSection(lines, "Missing Evidence");
  pushList(
    lines,
    report.missing_evidence.map((item) => {
      const parts = [
        `${asInlineCode(item.reason_code)} (${asInlineCode(item.severity_hint)})`,
        item.message,
        item.recommended_fix ? `recommended fix: ${item.recommended_fix}` : null,
        item.evidence_refs.length > 0
          ? `evidence refs: ${item.evidence_refs.map((value) => asInlineCode(value)).join(", ")}`
          : null,
      ].filter((value): value is string => Boolean(value));

      return parts.join("; ");
    }),
    "No missing evidence recorded.",
  );

  pushSection(lines, "Human Review Required");
  pushList(
    lines,
    report.human_review_requirements.map((item) => {
      const parts = [
        `${asInlineCode(item.review_id)} for ${asInlineCode(item.reviewer_role)}`,
        `reason: ${asInlineCode(item.reason_code)}`,
        item.message,
      ];

      return parts.join("; ");
    }),
    "No human review requirements recorded.",
  );

  pushSection(lines, "Next Actions");
  pushList(
    lines,
    report.next_actions.map((item) => {
      const parts = [
        `${asInlineCode(item.action_id)} (${asInlineCode(item.action_type)})`,
        `owner: ${asInlineCode(item.owner_role)}`,
        `priority: ${asInlineCode(item.priority)}`,
        `reason: ${asInlineCode(item.reason_code)}`,
        item.message,
      ];

      return parts.join("; ");
    }),
    "No next actions recorded.",
  );

  pushSection(lines, "Evidence References");
  if (report.evidence_refs.length === 0) {
    lines.push("None recorded.", "");
  } else {
    lines.push("| Reference | Source | Description | Path |", "| --- | --- | --- | --- |");
    for (const reference of report.evidence_refs) {
      lines.push(
        `| ${asInlineCode(reference.ref_id)} | ${asInlineCode(reference.source)} | ${formatValue(reference.description)} | ${formatValue(reference.path)} |`,
      );
    }
    lines.push("");
  }

  pushSection(lines, "Provenance");
  pushTable(lines, [
    {
      field: "Generated by",
      value: asInlineCode(report.provenance.generated_by),
    },
    {
      field: "Generator version",
      value: asInlineCode(report.provenance.generator_version),
    },
    {
      field: "Deterministic",
      value: report.provenance.deterministic ? "Yes" : "No",
    },
    {
      field: "Source pack hash",
      value: asInlineCode(report.provenance.source_pack_hash),
    },
    {
      field: "Reason code version",
      value: asInlineCode(report.provenance.reason_code_version),
    },
    {
      field: "Generated at",
      value: asInlineCode(report.generated_at),
    },
  ]);

  return `${lines.join("\n").trim()}\n`;
}
