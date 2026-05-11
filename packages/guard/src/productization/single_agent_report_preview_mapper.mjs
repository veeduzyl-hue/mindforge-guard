import fs from "node:fs";
import path from "node:path";

const NON_ENFORCEMENT_MESSAGE =
  "Pack-backed single-agent report preview is evidence-readiness and review output only. It does not approve, block, merge, deploy, certify, or execute.";

const TASK_SCOPE_SECTIONS = [
  "intended task:",
  "in-scope behavior:",
  "out-of-scope behavior:",
  "success criteria:",
  "known limitations:"
];

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n");
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length >= 1))].sort();
}

function readJsonIfExists(packRoot, relativePath) {
  const filePath = path.join(packRoot, relativePath);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function readTextIfExists(packRoot, relativePath) {
  const filePath = path.join(packRoot, relativePath);
  if (!fs.existsSync(filePath)) return "";
  try {
    return normalizeText(fs.readFileSync(filePath, "utf8"));
  } catch {
    return "";
  }
}

function parseMarkdownSections(text, sectionNames) {
  const sections = {};
  const normalized = normalizeText(text);
  const lines = normalized.split("\n");
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const matchingSection = sectionNames.find((section) => line.toLowerCase() === section);
    if (matchingSection) {
      currentSection = matchingSection;
      sections[currentSection] = [];
      continue;
    }
    if (currentSection) {
      sections[currentSection].push(rawLine);
    }
  }

  const output = {};
  for (const sectionName of sectionNames) {
    output[sectionName] = (sections[sectionName] || [])
      .map((line) => line.trim())
      .filter((line) => line.length >= 1)
      .join(" ")
      .trim();
  }
  return output;
}

function countYamlItems(text, sectionName) {
  const lines = normalizeText(text).split("\n");
  let inSection = false;
  let count = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === `${sectionName}:`) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:\s*/.test(trimmed)) {
      break;
    }
    if (inSection && /^\-\s+/.test(trimmed)) {
      count += 1;
    }
  }

  return count;
}

function listYamlItems(text, sectionName) {
  const lines = normalizeText(text).split("\n");
  let inSection = false;
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === `${sectionName}:`) {
      inSection = true;
      continue;
    }
    if (inSection && /^[A-Za-z0-9_-]+:\s*/.test(trimmed)) {
      break;
    }
    if (inSection && /^\-\s+/.test(trimmed)) {
      items.push(trimmed.replace(/^\-\s+/, ""));
    }
  }

  return items;
}

function determineReviewPosture(packValidation, parserSummary) {
  if (packValidation.validation_status === "invalid_due_to_omissions") {
    return "insufficient_evidence";
  }
  if (packValidation.validation_status === "valid_with_limitations" || parserSummary.parser_warnings.length > 0) {
    return "needs_human_review";
  }
  return "ready_for_review";
}

function determineMetadataCompleteness(packValidation, parserSummary) {
  if (
    packValidation.validation_status === "invalid_due_to_omissions" ||
    parserSummary.malformed_files.length > 0
  ) {
    return "incomplete";
  }
  if (packValidation.limitations.length > 0 || parserSummary.parser_warnings.length > 0) {
    return "partial";
  }
  return "complete";
}

function buildPolicyChecks(packValidation, parserSummary) {
  const checks = [];
  const validationSeverity =
    packValidation.validation_status === "invalid_due_to_omissions"
      ? "high"
      : packValidation.validation_status === "valid_with_limitations"
        ? "medium"
        : "low";
  const validationOutcome =
    packValidation.validation_status === "invalid_due_to_omissions"
      ? "missing_evidence"
      : packValidation.validation_status === "valid_with_limitations"
        ? "attention_required"
        : "satisfied";
  const validationSummary =
    packValidation.validation_status === "invalid_due_to_omissions"
      ? "Required evidence is missing, so the pack-backed preview is not yet ready for ordinary review."
      : packValidation.validation_status === "valid_with_limitations"
        ? "Required evidence is present, but recommended review depth is incomplete and needs human attention."
        : "Pack validation completed with no omissions and provides a stable evidence basis for preview review.";

  checks.push({
    check_id: "check-pack-validation-status",
    check_name: "pack-validation-status",
    outcome: validationOutcome,
    severity: validationSeverity,
    summary: validationSummary
  });

  checks.push({
    check_id: "check-pack-boundary-scope",
    check_name: "single-agent-pack-boundary",
    outcome: "satisfied",
    severity: "low",
    summary:
      "The preview remains bounded to a single-agent governance report path and does not grant merge, deployment, blocking, or execution authority."
  });

  if (parserSummary.parser_warnings.length > 0) {
    checks.push({
      check_id: "check-parser-warnings",
      check_name: "parser-warning-follow-up",
      outcome: "attention_required",
      severity: "medium",
      summary: `Parser warnings require reviewer follow-up: ${parserSummary.parser_warnings.join("; ")}`
    });
  }

  return checks;
}

function buildFindings(packValidation, parserSummary, receiptRefs) {
  const findings = [];
  let findingIndex = 1;
  const primaryRef = receiptRefs[0] || "receipt:pack-preview";

  for (const omission of parserSummary.omissions) {
    findings.push({
      finding_id: `finding-pack-omission-${String(findingIndex).padStart(3, "0")}`,
      category: "omission",
      severity: "high",
      summary: omission,
      related_ref: primaryRef
    });
    findingIndex += 1;
  }

  for (const limitation of packValidation.limitations) {
    findings.push({
      finding_id: `finding-pack-limitation-${String(findingIndex).padStart(3, "0")}`,
      category: "limitation",
      severity: "medium",
      summary: limitation,
      related_ref: primaryRef
    });
    findingIndex += 1;
  }

  for (const warning of parserSummary.parser_warnings) {
    findings.push({
      finding_id: `finding-pack-warning-${String(findingIndex).padStart(3, "0")}`,
      category: "parser_warning",
      severity: "medium",
      summary: warning,
      related_ref: primaryRef
    });
    findingIndex += 1;
  }

  if (findings.length === 0) {
    findings.push({
      finding_id: "finding-pack-ready-001",
      category: "readiness_note",
      severity: "low",
      summary: "Pack-backed evidence is sufficient for preview review without implying approval or execution authority.",
      related_ref: primaryRef
    });
  }

  return findings;
}

function buildOpenIssues(parserSummary, packValidation) {
  return uniqueSorted([
    ...parserSummary.omissions.map((value) => `Resolve omission: ${value}`),
    ...packValidation.limitations.map((value) => `Address limitation: ${value}`),
    ...parserSummary.parser_warnings.map((value) => `Review parser warning: ${value}`)
  ]);
}

function buildFoundation(packId, packValidation, parserSummary, snapshotId, sampleId, reviewOwner) {
  const statusLabel = packValidation.validation_status;
  const snapshotRef = snapshotId ? `snapshot:${snapshotId}` : `snapshot:${packId}`;
  const reviewOwnerRef = reviewOwner ? `owner:${reviewOwner}` : `owner:${packId}`;
  const sampleRef = sampleId ? `sample:${sampleId}` : `sample:${packId}`;
  const warningRef = parserSummary.parser_warnings[0] ? `warning:${packId}` : `verify:${packId}`;

  return {
    status_validate_policy: {
      present: true,
      contributes_to: ["guardrail_mapping_summary", "admissibility_summary"],
      artifact_refs: [`pack-validate:${packId}:${statusLabel}`],
      contract_preserved: true
    },
    audit: {
      present: true,
      contributes_to: ["evidence_summary", "risk_summary", "receipt_refs"],
      evidence_refs: [`pack-audit-signal:${packId}`],
      contract_preserved: true
    },
    snapshot: {
      present: true,
      contributes_to: ["drift_summary", "transition_summary", "deterministic_hash"],
      snapshot_refs: [snapshotRef],
      contract_preserved: true
    },
    action_classify: {
      present: true,
      contributes_to: ["action_summary", "intent_summary", "risk_summary"],
      artifact_refs: [sampleRef],
      contract_preserved: true
    },
    drift: {
      present: true,
      contributes_to: ["drift_summary", "lineage_summary"],
      drift_refs: [snapshotRef],
      contract_preserved: true
    },
    assoc_correlate: {
      present: true,
      contributes_to: ["lineage_summary", "guardrail_mapping_summary"],
      correlation_refs: [reviewOwnerRef],
      contract_preserved: true
    },
    risk: {
      present: true,
      contributes_to: ["risk_summary", "review_posture"],
      risk_refs: [`risk:${packId}:${statusLabel}`],
      contract_preserved: true
    },
    license_edition_gate: {
      present: true,
      contributes_to: ["non_enforcement_boundary"],
      artifact_refs: [`license-boundary:${packId}`],
      contract_preserved: true,
      entitlement_changed: false
    },
    verification_chain: {
      present: true,
      contributes_to: ["deterministic_hash", "receipt_refs"],
      verifier_refs: [warningRef, `parser:${parserSummary.parser_version}`],
      contract_preserved: true
    }
  };
}

export function buildSingleAgentReportPreview({ packRoot, parserSummary, packValidation }) {
  const resolvedPackRoot = path.resolve(packRoot);
  const manifest = readJsonIfExists(resolvedPackRoot, "manifest.json") || {};
  const agentProfile = readJsonIfExists(resolvedPackRoot, "agent-profile.json") || {};
  const sampleOutput = readJsonIfExists(resolvedPackRoot, "evidence/sample-output.json") || {};
  const runRecord = readJsonIfExists(resolvedPackRoot, "evidence/run-record.json") || {};
  const snapshot = readJsonIfExists(resolvedPackRoot, "snapshot.json") || {};
  const taskScopeSections = parseMarkdownSections(
    readTextIfExists(resolvedPackRoot, "task-scope.md"),
    TASK_SCOPE_SECTIONS
  );
  const actionBoundaryText = readTextIfExists(resolvedPackRoot, "action-boundary.yaml");
  const dataSourcesText = readTextIfExists(resolvedPackRoot, "data-sources.yaml");
  const toolsText = readTextIfExists(resolvedPackRoot, "tools.yaml");

  const packId = manifest.pack_id || path.basename(resolvedPackRoot);
  const sampleId = sampleOutput.sample_id || `${packId}-sample`;
  const runId = runRecord.run_id || `${packId}-run`;
  const reviewOwner = agentProfile.review_owner || manifest.owner || "team/governance-review";
  const generatedAt =
    manifest.updated_at ||
    snapshot.generated_at ||
    runRecord.run_timestamp ||
    manifest.created_at ||
    "1970-01-01T00:00:00Z";
  const reviewPosture = determineReviewPosture(packValidation, parserSummary);
  const openIssues = buildOpenIssues(parserSummary, packValidation);
  const receiptRefs = uniqueSorted([
    `receipt:pack:${packId}`,
    `receipt:sample:${sampleId}`,
    `receipt:run:${runId}`
  ]);
  const sourceRefs = uniqueSorted([
    `pack:${packId}`,
    manifest.source_repo ? `source:${manifest.source_repo}` : `source:${packId}`,
    ...parserSummary.evidence_refs
  ]);
  const metadataCompleteness = determineMetadataCompleteness(packValidation, parserSummary);
  const allowedActions = listYamlItems(actionBoundaryText, "allowed_actions");
  const prohibitedActions = listYamlItems(actionBoundaryText, "prohibited_actions");

  const reviewStatus =
    reviewPosture === "ready_for_review"
      ? "reviewable"
      : reviewPosture === "needs_human_review"
        ? "human_review_required"
        : "evidence_incomplete";

  const evidenceSummary =
    reviewPosture === "insufficient_evidence"
      ? `Evidence is incomplete because ${parserSummary.omissions.join("; ")}.`
      : reviewPosture === "needs_human_review"
        ? `Evidence is reviewable, but human follow-up is needed for ${packValidation.limitations.join("; ") || parserSummary.parser_warnings.join("; ")}.`
        : `Evidence includes ${parserSummary.parsed_files.length} parsed files, sample output traceability, and deterministic pack hashing.`;

  const admissibilitySummary =
    reviewPosture === "insufficient_evidence"
      ? "The pack-backed preview is not ready for ordinary review because required evidence is missing or malformed."
      : reviewPosture === "needs_human_review"
        ? "The pack-backed preview is reviewable, but limitations or warnings justify a stronger human review posture."
        : "The pack-backed preview appears sufficiently complete for ordinary human review without implying approval.";

  const riskSummary =
    reviewPosture === "insufficient_evidence"
      ? "High-severity evidence gaps reduce confidence in the pack-backed preview and require remediation before ordinary review."
      : reviewPosture === "needs_human_review"
        ? "Medium-severity limitations or parser warnings indicate bounded review risk that should be handled by a human reviewer."
        : "No high-severity risk indicator is visible in the pack-backed preview, and the surface remains recommendation-only.";

  const driftSummary =
    snapshot.comparison_baseline
      ? `Snapshot comparison baseline ${snapshot.comparison_baseline} is present for future drift interpretation, with no authority expansion signal implied by this preview.`
      : "No comparison baseline is present, so drift interpretation remains preview-only and bounded to current evidence.";

  const transitionSummary =
    runRecord.run_id
      ? `Run record ${runRecord.run_id} and deterministic pack hashing preserve a bounded transition path from evidence pack to report preview.`
      : "The preview preserves a bounded transition path from local evidence pack inputs to report JSON output.";

  const findings = buildFindings(packValidation, parserSummary, receiptRefs);

  return {
    object_type: "single_agent_governance_report_preview",
    object_version: "v1",
    report_mode: "preview",
    generated_at: generatedAt,
    agent_identity: {
      agent_id: agentProfile.agent_id || `${packId}-agent`,
      agent_kind: agentProfile.agent_type || "single_agent",
      agent_label: agentProfile.agent_name || packId,
      source_kind: "pack_preview",
      single_agent: true
    },
    capability_boundary: {
      boundary_scope: "single_agent_governance_report",
      absorbed_evidence_structure: [
        "agent_identity",
        "capability_boundary",
        "authority_envelope",
        "execution_path_snapshot",
        "proposed_action",
        "policy_evaluation_preview",
        "findings",
        "review_evidence",
        "artifact_provenance"
      ],
      single_agent_only: true,
      multi_agent_in_scope: false,
      github_action_implementation_in_scope: false,
      cli_behavior_change_in_scope: false,
      separate_product_claim: false
    },
    authority_envelope: {
      authority_scope: "human_review_only",
      recommendation_only: true,
      approval_granted: false,
      execution_permission_granted: false,
      merge_authority: false,
      deployment_authority: false,
      blocking_effect: false
    },
    execution_path_snapshot: {
      input_origin: "pack",
      execution_surface: "internal_preview",
      runtime_execution_performed: false,
      workflow_execution_performed: false,
      github_action_wrapper_used: false,
      repo_ref: manifest.source_repo || `${packId}@preview`,
      path_summary:
        reviewPosture === "insufficient_evidence"
          ? "The pack-backed preview remains bounded, but missing required evidence prevents ordinary review readiness."
          : reviewPosture === "needs_human_review"
            ? "The pack-backed preview remains bounded and non-executing, with limitations that require human review."
            : "The pack-backed preview remains bounded, deterministic, and non-executing for human review only."
    },
    proposed_action: {
      action_kind: "pack_backed_governance_report_preview",
      change_scope: "single_agent_governance_pack",
      in_scope: true,
      summary:
        taskScopeSections["intended task:"] ||
        "Prepare a bounded single-agent governance report preview from a local evidence pack."
    },
    policy_evaluation_preview: {
      evaluation_mode: "deterministic_pack_preview",
      severity_model: "severity_only",
      probability_scoring: false,
      legal_compliance_scoring: false,
      checks: buildPolicyChecks(packValidation, parserSummary)
    },
    findings,
    review_evidence: {
      review_required: true,
      review_status: reviewStatus,
      review_owner: reviewOwner,
      open_issues: openIssues
    },
    artifact_provenance: {
      source_refs: sourceRefs,
      generated_flags: {
        ai_assisted: true,
        pack_backed: true,
        human_review_required: true
      },
      metadata_completeness: metadataCompleteness,
      watermark_enforcement: false,
      content_labeling_enforcement: false,
      legal_proof: false
    },
    pre_v6_14_capability_foundation: buildFoundation(
      packId,
      packValidation,
      parserSummary,
      snapshot.snapshot_id || null,
      sampleId,
      reviewOwner
    ),
    action_summary:
      sampleOutput.output_summary ||
      "The pack-backed preview summarizes a bounded single-agent evidence package for human review.",
    intent_summary:
      taskScopeSections["intended task:"] ||
      agentProfile.operating_context ||
      "The pack appears intended to support recommendation-only governance review.",
    authority_summary:
      prohibitedActions.length > 0
        ? `The authority boundary is review-only, with prohibited actions including ${prohibitedActions.slice(0, 3).join(", ")}.`
        : "The preview remains review-only and does not grant merge, deployment, execution, or blocking authority.",
    evidence_summary: evidenceSummary,
    admissibility_summary: admissibilitySummary,
    risk_summary: riskSummary,
    drift_summary: driftSummary,
    guardrail_mapping_summary:
      `The pack declares ${allowedActions.length} allowed actions, ${prohibitedActions.length} prohibited actions, ${countYamlItems(dataSourcesText, "data_sources")} data sources, and ${countYamlItems(toolsText, "tools")} tools for bounded review context.`,
    transition_summary: transitionSummary,
    procedural_receipt_summary:
      `Procedural receipt references are deterministic and traceable through ${receiptRefs.join(", ")}.`,
    lineage_summary:
      `The preview preserves bounded lineage from ${manifest.source_repo || packId} through sample output ${sampleId} to deterministic hash ${packValidation.deterministic_pack_hash}.`,
    review_posture: reviewPosture,
    receipt_refs: receiptRefs,
    deterministic_hash: packValidation.deterministic_pack_hash,
    non_enforcement_boundary: {
      recommendation_only: true,
      non_executing: true,
      approval_granted: false,
      execution_permission_granted: false,
      blocking_effect: false,
      deployment_authority: false,
      merge_authority: false,
      enforcement_action: "none",
      legal_compliance_claim: false,
      message: NON_ENFORCEMENT_MESSAGE
    }
  };
}
