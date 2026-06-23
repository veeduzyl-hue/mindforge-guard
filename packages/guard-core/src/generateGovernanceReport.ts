import type {
  GuardValidationError,
  GuardValidationWarning,
} from "./errors.ts";
import {
  GUARD_REASON_CODE_DEFINITIONS,
  GUARD_REASON_CODES,
  type GuardReasonCode,
} from "./reasonCodes.ts";
import { parseEvidencePack, type EvidencePackV1 } from "./parseEvidencePack.ts";
import {
  GOVERNANCE_REPORT_SCHEMA_VERSION,
  GOVERNANCE_VERDICT_VALUES,
  REPORT_CONFIDENCE_VALUES,
  REPORT_PRIORITY_VALUES,
  RISK_SEVERITY_VALUES,
  type BlockedActionSummaryItem,
  type EvidenceReference,
  type GovernanceReportModel,
  type GovernanceVerdictSummary,
  type HumanReviewRequirement,
  type NextAction,
  type ReportConfidenceValue,
  type RiskSeverityValue,
  type WorkflowRepositorySummary,
} from "./reportModel.ts";
import {
  inspectEvidenceCoverage,
  type InspectEvidenceCoverageResult,
} from "./inspectEvidenceCoverage.ts";
import { validateEvidencePack } from "./validateEvidencePack.ts";

export type GenerateGovernanceReportResult =
  | { ok: true; report: GovernanceReportModel; warnings: GuardValidationWarning[] }
  | {
      ok: false;
      errors: GuardValidationError[];
      warnings: GuardValidationWarning[];
    };

type UnknownRecord = Record<string, unknown>;

const REPORT_SERVICE_GENERATOR = "guard-core-report-service";
const REPORT_SERVICE_VERSION = "1.0.0";
const REASON_CODE_VERSION = "1.0.0";

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function addUnique<T>(items: T[], value: T): void {
  if (!items.includes(value)) {
    items.push(value);
  }
}

function addReasonCodes(target: GuardReasonCode[], values: GuardReasonCode[]): void {
  for (const value of values) {
    addUnique(target, value);
  }
}

function hasReasonCode(
  reasonCodes: GuardReasonCode[],
  reasonCode: GuardReasonCode,
): boolean {
  return reasonCodes.includes(reasonCode);
}

function severityRank(value: RiskSeverityValue): number {
  switch (value) {
    case RISK_SEVERITY_VALUES.CRITICAL:
      return 4;
    case RISK_SEVERITY_VALUES.HIGH:
      return 3;
    case RISK_SEVERITY_VALUES.MEDIUM:
      return 2;
    case RISK_SEVERITY_VALUES.LOW:
      return 1;
    default:
      return 0;
  }
}

function severityFromReasonCode(reasonCode: GuardReasonCode): RiskSeverityValue {
  const hint = GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.severity_hint;
  switch (hint) {
    case "critical":
      return RISK_SEVERITY_VALUES.CRITICAL;
    case "high":
      return RISK_SEVERITY_VALUES.HIGH;
    case "medium":
      return RISK_SEVERITY_VALUES.MEDIUM;
    case "low":
      return RISK_SEVERITY_VALUES.LOW;
    default:
      return RISK_SEVERITY_VALUES.UNKNOWN;
  }
}

function maxSeverity(reasonCodes: GuardReasonCode[]): RiskSeverityValue {
  let current = RISK_SEVERITY_VALUES.NONE;

  for (const reasonCode of reasonCodes) {
    const severity = severityFromReasonCode(reasonCode);
    if (severityRank(severity) > severityRank(current)) {
      current = severity;
    }
  }

  return current;
}

function repositorySummary(value: unknown): WorkflowRepositorySummary | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return {
      provider: null,
      repo_name: value,
      remote_url: null,
      default_branch: null,
      branch: null,
      base_ref: null,
      head_ref: null,
      commit_sha: null,
      pr_number: null,
    };
  }

  const repository = asRecord(value);
  return {
    provider: asString(repository.provider),
    repo_name: asString(repository.repo_name),
    remote_url: asString(repository.remote_url),
    default_branch: asString(repository.default_branch),
    branch: asString(repository.branch),
    base_ref: asString(repository.base_ref),
    head_ref: asString(repository.head_ref),
    commit_sha: asString(repository.commit_sha),
    pr_number: asString(repository.pr_number),
  };
}

function buildEvidenceReferences(pack: EvidencePackV1): EvidenceReference[] {
  const references: EvidenceReference[] = [
    {
      ref_id: `pack:${pack.pack_id}`,
      source: "pack",
      path: "evidence-pack.json",
      artifact_id: null,
      action_id: null,
      tool_call_id: null,
      verification_id: null,
      blocked_action_id: null,
      description: "submitted evidence pack",
    },
  ];

  for (const artifact of asArray<UnknownRecord>(pack.artifacts)) {
    const artifactId = asString(artifact.artifact_id);
    if (!artifactId) {
      continue;
    }

    references.push({
      ref_id: artifactId,
      source: "artifact",
      path: asString(artifact.path),
      artifact_id: artifactId,
      action_id: null,
      tool_call_id: null,
      verification_id: null,
      blocked_action_id: null,
      description: asString(artifact.description),
    });
  }

  for (const action of asArray<UnknownRecord>(pack.actions)) {
    const actionId = asString(action.action_id);
    if (!actionId) {
      continue;
    }

    const target = asRecord(action.target);
    references.push({
      ref_id: actionId,
      source: "action",
      path: asString(target.path),
      artifact_id: null,
      action_id: actionId,
      tool_call_id: asString(action.related_tool_call_id),
      verification_id: null,
      blocked_action_id: null,
      description: asString(action.action_type),
    });
  }

  for (const toolCall of asArray<UnknownRecord>(pack.tool_calls)) {
    const toolCallId = asString(toolCall.tool_call_id);
    if (!toolCallId) {
      continue;
    }

    references.push({
      ref_id: toolCallId,
      source: "tool_call",
      path: null,
      artifact_id: null,
      action_id: null,
      tool_call_id: toolCallId,
      verification_id: null,
      blocked_action_id: null,
      description: asString(toolCall.output_summary) ?? asString(toolCall.input_summary),
    });
  }

  for (const verification of asArray<UnknownRecord>(pack.verification)) {
    const verificationId = asString(verification.verification_id);
    if (!verificationId) {
      continue;
    }

    references.push({
      ref_id: verificationId,
      source: "verification",
      path: null,
      artifact_id: null,
      action_id: null,
      tool_call_id: null,
      verification_id: verificationId,
      blocked_action_id: null,
      description: asString(verification.coverage_note),
    });
  }

  for (const blockedAction of asArray<UnknownRecord>(pack.blocked_actions)) {
    const blockedActionId = asString(blockedAction.blocked_action_id);
    if (!blockedActionId) {
      continue;
    }

    references.push({
      ref_id: blockedActionId,
      source: "blocked_action",
      path: null,
      artifact_id: null,
      action_id: null,
      tool_call_id: null,
      verification_id: null,
      blocked_action_id: blockedActionId,
      description: asString(blockedAction.attempted_action),
    });
  }

  return references;
}

function buildBlockedActionSummaryItems(
  pack: EvidencePackV1,
): BlockedActionSummaryItem[] {
  return asArray<UnknownRecord>(pack.blocked_actions).map((blockedAction) => {
    const mappedReasonCode =
      blockedAction.reason_code === "DESTRUCTIVE_COMMAND"
        ? GUARD_REASON_CODES.DESTRUCTIVE_COMMAND_ATTEMPTED
        : blockedAction.reason_code === "SECRET_ACCESS"
          ? GUARD_REASON_CODES.SECRET_ACCESS_ATTEMPTED
          : blockedAction.reason_code === "NETWORK_NOT_ALLOWED"
            ? GUARD_REASON_CODES.NETWORK_ACCESS_ATTEMPTED
            : null;

    return {
      blocked_action_id:
        asString(blockedAction.blocked_action_id) ?? "blocked_action:unknown",
      attempted_action: asString(blockedAction.attempted_action),
      severity:
        (asString(blockedAction.severity) as RiskSeverityValue | null) ??
        RISK_SEVERITY_VALUES.UNKNOWN,
      reason_code: mappedReasonCode,
      message: asString(blockedAction.policy_ref) ?? asString(blockedAction.reason_code),
      evidence_refs: [],
    };
  });
}

function buildHumanReviewRequirements(
  pack: EvidencePackV1,
  coverage: InspectEvidenceCoverageResult,
): HumanReviewRequirement[] {
  const workflow = asRecord(pack.workflow);
  const authority = asRecord(pack.authority);
  const workflowType = asString(workflow.workflow_type) ?? "generic";
  const requirements: HumanReviewRequirement[] = [];

  const addRequirement = (
    reviewId: string,
    reviewerRole: HumanReviewRequirement["reviewer_role"],
    reasonCode: GuardReasonCode,
    message: string,
  ) => {
    if (!requirements.some((item) => item.reason_code === reasonCode)) {
      requirements.push({
        review_id: reviewId,
        reviewer_role: reviewerRole,
        reason_code: reasonCode,
        message,
        required: true,
        evidence_refs: [],
      });
    }
  };

  const genericReviewTriggers = [
    GUARD_REASON_CODES.MISSING_AUTHORITY,
    GUARD_REASON_CODES.DECLARED_AUTHORITY_ONLY,
    GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION,
    GUARD_REASON_CODES.TESTS_NOT_RUN,
    GUARD_REASON_CODES.TESTS_FAILED,
    GUARD_REASON_CODES.BUILD_NOT_RUN,
    GUARD_REASON_CODES.BUILD_FAILED,
    GUARD_REASON_CODES.MANIFEST_INCOMPLETE,
    GUARD_REASON_CODES.BLOCKED_ACTION_PRESENT,
  ];

  if (coverage.reason_codes.some((code) => genericReviewTriggers.includes(code))) {
    addRequirement(
      "review:generic",
      "reviewer",
      GUARD_REASON_CODES.HUMAN_REVIEW_REQUIRED,
      "A human review step is needed before relying on this governance report.",
    );
  }

  if (
    pack.pack_type === "cyber_remediation" ||
    workflowType === "security_patch" ||
    hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED)
  ) {
    addRequirement(
      "review:security",
      "security",
      GUARD_REASON_CODES.SECURITY_REVIEW_REQUIRED,
      "Security review is needed for the cyber-oriented workflow.",
    );
  }

  if (
    workflowType === "dependency_upgrade" &&
    (
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.DEPENDENCY_CHANGE_DETECTED) ||
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED)
    )
  ) {
    addRequirement(
      "review:owner",
      "owner",
      GUARD_REASON_CODES.OWNER_REVIEW_REQUIRED,
      "Owner review is needed for the dependency-oriented workflow.",
    );
  }

  if (
    workflowType === "release" &&
    (
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.ROLLBACK_MISSING) ||
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.ROLLBACK_UNVERIFIED)
    )
  ) {
    addRequirement(
      "review:release",
      "release",
      GUARD_REASON_CODES.RELEASE_REVIEW_REQUIRED,
      "Release review is needed before relying on this release summary.",
    );
  }

  const highRiskWorkflowTypes = new Set(["release", "security_patch", "dependency_upgrade"]);
  if (
    highRiskWorkflowTypes.has(workflowType) &&
    !asString(authority.owner)
  ) {
    addRequirement(
      "review:owner-missing",
      "owner",
      GUARD_REASON_CODES.OWNER_REVIEW_REQUIRED,
      "Owner review is needed because owner context is absent.",
    );
  }

  return requirements;
}

function buildNextActions(
  coverage: InspectEvidenceCoverageResult,
  reviewRequirements: HumanReviewRequirement[],
): NextAction[] {
  const actions: NextAction[] = [];

  const addAction = (
    actionId: string,
    actionType: NextAction["action_type"],
    reasonCode: GuardReasonCode,
    ownerRole: NextAction["owner_role"],
    priority: NextAction["priority"],
    message: string,
  ) => {
    if (!actions.some((item) => item.reason_code === reasonCode)) {
      actions.push({
        action_id: actionId,
        action_type: actionType,
        message,
        reason_code: reasonCode,
        owner_role: ownerRole,
        priority,
      });
    }
  };

  const reasonCodes = coverage.reason_codes;

  if (
    reasonCodes.some((code) =>
      [
        GUARD_REASON_CODES.MISSING_AUTHORITY,
        GUARD_REASON_CODES.DECLARED_AUTHORITY_ONLY,
        GUARD_REASON_CODES.OWNER_MISSING,
        GUARD_REASON_CODES.REVIEWER_MISSING,
        GUARD_REASON_CODES.TIME_WINDOW_MISSING,
        GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED,
      ].includes(code),
    )
  ) {
    const authorityReasonCode =
      hasReasonCode(reasonCodes, GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED)
        ? GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED
        : hasReasonCode(reasonCodes, GUARD_REASON_CODES.MISSING_AUTHORITY)
          ? GUARD_REASON_CODES.MISSING_AUTHORITY
          : hasReasonCode(reasonCodes, GUARD_REASON_CODES.DECLARED_AUTHORITY_ONLY)
            ? GUARD_REASON_CODES.DECLARED_AUTHORITY_ONLY
            : hasReasonCode(reasonCodes, GUARD_REASON_CODES.OWNER_MISSING)
              ? GUARD_REASON_CODES.OWNER_MISSING
              : hasReasonCode(reasonCodes, GUARD_REASON_CODES.REVIEWER_MISSING)
                ? GUARD_REASON_CODES.REVIEWER_MISSING
                : GUARD_REASON_CODES.TIME_WINDOW_MISSING;

    addAction(
      "next:authority",
      "clarify_authority",
      authorityReasonCode,
      "owner",
      REPORT_PRIORITY_VALUES.HIGH,
      "Clarify or strengthen the authority material for this workflow.",
    );
  }

  if (
    reasonCodes.some((code) =>
      [
        GUARD_REASON_CODES.TESTS_NOT_RUN,
        GUARD_REASON_CODES.TESTS_FAILED,
        GUARD_REASON_CODES.BUILD_NOT_RUN,
        GUARD_REASON_CODES.BUILD_FAILED,
        GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION,
        GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED,
      ].includes(code),
    )
  ) {
    addAction(
      "next:verification",
      "rerun_verification",
      hasReasonCode(reasonCodes, GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED)
        ? GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED
        : hasReasonCode(reasonCodes, GUARD_REASON_CODES.TESTS_NOT_RUN)
          ? GUARD_REASON_CODES.TESTS_NOT_RUN
          : GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION,
      "developer",
      REPORT_PRIORITY_VALUES.HIGH,
      "Strengthen verification evidence for the recorded change.",
    );
  }

  if (
    reasonCodes.some((code) =>
      [
        GUARD_REASON_CODES.ROLLBACK_MISSING,
        GUARD_REASON_CODES.ROLLBACK_UNVERIFIED,
      ].includes(code),
    )
  ) {
    addAction(
      "next:rollback",
      "document_rollback",
      hasReasonCode(reasonCodes, GUARD_REASON_CODES.ROLLBACK_MISSING)
        ? GUARD_REASON_CODES.ROLLBACK_MISSING
        : GUARD_REASON_CODES.ROLLBACK_UNVERIFIED,
      "operator",
      REPORT_PRIORITY_VALUES.HIGH,
      "Provide rollback evidence for the release-oriented workflow.",
    );
  }

  if (
    reasonCodes.some((code) =>
      [
        GUARD_REASON_CODES.MANIFEST_INCOMPLETE,
        GUARD_REASON_CODES.ARTIFACT_HASH_MISSING,
        GUARD_REASON_CODES.ARTIFACT_REF_UNRESOLVED,
        GUARD_REASON_CODES.PRODUCER_IDENTITY_UNKNOWN,
      ].includes(code),
    )
  ) {
    addAction(
      "next:provenance",
      "provide_provenance",
      hasReasonCode(reasonCodes, GUARD_REASON_CODES.ARTIFACT_REF_UNRESOLVED)
        ? GUARD_REASON_CODES.ARTIFACT_REF_UNRESOLVED
        : hasReasonCode(reasonCodes, GUARD_REASON_CODES.ARTIFACT_HASH_MISSING)
          ? GUARD_REASON_CODES.ARTIFACT_HASH_MISSING
          : GUARD_REASON_CODES.MANIFEST_INCOMPLETE,
      "operator",
      REPORT_PRIORITY_VALUES.MEDIUM,
      "Align the manifest, artifact, and provenance material with the report input.",
    );
  }

  for (const reviewRequirement of reviewRequirements) {
    addAction(
      `next:review:${reviewRequirement.review_id}`,
      "request_review",
      reviewRequirement.reason_code,
      reviewRequirement.reviewer_role,
      REPORT_PRIORITY_VALUES.MEDIUM,
      reviewRequirement.message,
    );
  }

  return actions;
}

function buildVerdict(
  pack: EvidencePackV1,
  coverage: InspectEvidenceCoverageResult,
  reviewRequirements: HumanReviewRequirement[],
  blockedItems: BlockedActionSummaryItem[],
): GovernanceVerdictSummary {
  const workflow = asRecord(pack.workflow);
  const authority = asRecord(pack.authority);
  const workflowType = asString(workflow.workflow_type) ?? "generic";
  const authorityStatus = asString(authority.authorization_status);
  const highRiskWorkflowTypes = new Set(["release", "security_patch", "dependency_upgrade"]);

  const verdictReasonCodes: GuardReasonCode[] = [];

  if (blockedItems.some((item) => item.severity === RISK_SEVERITY_VALUES.CRITICAL)) {
    addReasonCodes(verdictReasonCodes, [
      GUARD_REASON_CODES.BLOCKED_ACTION_PRESENT,
      ...blockedItems
        .map((item) => item.reason_code)
        .filter((value): value is GuardReasonCode => value !== null),
    ]);

    return {
      value: GOVERNANCE_VERDICT_VALUES.BLOCK,
      reason_codes: verdictReasonCodes,
      explanation: "Critical blocked activity is present in the submitted evidence.",
      confidence: REPORT_CONFIDENCE_VALUES.HIGH,
    };
  }

  if (
    coverage.manifest_completeness === "incomplete" ||
    coverage.manifest_completeness === "unknown"
  ) {
    addReasonCodes(verdictReasonCodes, coverage.reason_codes);
    return {
      value: GOVERNANCE_VERDICT_VALUES.INCONCLUSIVE,
      reason_codes: verdictReasonCodes,
      explanation: "Manifest completeness is not strong enough for a final governance summary.",
      confidence: REPORT_CONFIDENCE_VALUES.LOW,
    };
  }

  if (hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.MISSING_AUTHORITY)) {
    addUnique(verdictReasonCodes, GUARD_REASON_CODES.MISSING_AUTHORITY);
  }

  if (
    highRiskWorkflowTypes.has(workflowType) &&
    hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.OWNER_MISSING)
  ) {
    addUnique(verdictReasonCodes, GUARD_REASON_CODES.OWNER_MISSING);
  }

  if (
    pack.pack_type === "ai_software_change" &&
    (
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION) ||
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.TESTS_NOT_RUN) ||
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.TESTS_FAILED)
    )
  ) {
    addReasonCodes(verdictReasonCodes, coverage.reason_codes.filter((code) =>
      [
        GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION,
        GUARD_REASON_CODES.TESTS_NOT_RUN,
        GUARD_REASON_CODES.TESTS_FAILED,
      ].includes(code),
    ));
  }

  if (
    workflowType === "release" &&
    (
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.ROLLBACK_MISSING) ||
      hasReasonCode(coverage.reason_codes, GUARD_REASON_CODES.ROLLBACK_UNVERIFIED)
    )
  ) {
    addReasonCodes(verdictReasonCodes, coverage.reason_codes.filter((code) =>
      [
        GUARD_REASON_CODES.ROLLBACK_MISSING,
        GUARD_REASON_CODES.ROLLBACK_UNVERIFIED,
      ].includes(code),
    ));
  }

  if (
    pack.pack_type === "cyber_remediation" &&
    authorityStatus !== "provided"
  ) {
    addUnique(verdictReasonCodes, GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED);
  }

  if (reviewRequirements.some((item) => item.required)) {
    addReasonCodes(
      verdictReasonCodes,
      reviewRequirements.map((item) => item.reason_code),
    );
  }

  if (verdictReasonCodes.length > 0) {
    return {
      value: GOVERNANCE_VERDICT_VALUES.REQUIRE_REVIEW,
      reason_codes: verdictReasonCodes,
      explanation: verdictReasonCodes
        .map((code) => GUARD_REASON_CODE_DEFINITIONS[code].description)
        .slice(0, 3)
        .join(" "),
      confidence: REPORT_CONFIDENCE_VALUES.MEDIUM,
    };
  }

  return {
    value: GOVERNANCE_VERDICT_VALUES.ALLOW,
    reason_codes: [],
    explanation: "Authority, scope, verification, and manifest evidence are structurally sufficient.",
    confidence: REPORT_CONFIDENCE_VALUES.HIGH,
  };
}

export function generateGovernanceReport(
  input: string | Buffer | unknown,
): GenerateGovernanceReportResult {
  const parsed = parseEvidencePack(input);
  if (!parsed.ok) {
    return {
      ok: false,
      errors: parsed.errors,
      warnings: [],
    };
  }

  const validation = validateEvidencePack(parsed.pack);
  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  const pack = parsed.pack;
  const authority = asRecord(pack.authority);
  const workflow = asRecord(pack.workflow);
  const scope = asRecord(pack.scope);
  const provenance = asRecord(pack.provenance);
  const verificationItems = asArray<UnknownRecord>(pack.verification);

  const coverage = inspectEvidenceCoverage(pack);
  const blockedItems = buildBlockedActionSummaryItems(pack);
  const reviewRequirements = buildHumanReviewRequirements(pack, coverage);
  const nextActions = buildNextActions(coverage, reviewRequirements);
  const verdict = buildVerdict(pack, coverage, reviewRequirements, blockedItems);
  const allReasonCodes: GuardReasonCode[] = [];

  addReasonCodes(allReasonCodes, coverage.reason_codes);
  addReasonCodes(allReasonCodes, verdict.reason_codes);
  addReasonCodes(
    allReasonCodes,
    reviewRequirements.map((item) => item.reason_code),
  );
  addReasonCodes(
    allReasonCodes,
    nextActions.map((item) => item.reason_code),
  );

  const riskCategories = allReasonCodes.reduce<string[]>((items, reasonCode) => {
    const category = GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category;
    if (category && !items.includes(category)) {
      items.push(category);
    }
    return items;
  }, []);

  const report: GovernanceReportModel = {
    report_id: `governance-report:${pack.pack_id}:${GOVERNANCE_REPORT_SCHEMA_VERSION}`,
    report_schema_version: GOVERNANCE_REPORT_SCHEMA_VERSION,
    generated_at:
      asString(provenance.generated_at) ??
      asString(pack.created_at) ??
      "1970-01-01T00:00:00Z",
    source_pack_id: pack.pack_id,
    source_schema_version: pack.schema_version,
    workflow_summary: {
      workflow_id: asString(workflow.workflow_id) ?? "workflow:unknown",
      workflow_name: asString(workflow.workflow_name) ?? "unknown workflow",
      workflow_type: asString(workflow.workflow_type) ?? "generic",
      pack_type: pack.pack_type,
      environment: asString(workflow.environment) ?? "unknown",
      repository: repositorySummary(workflow.repository),
    },
    verdict,
    authority_summary: {
      authorization_status:
        asString(authority.authorization_status) ?? "unknown",
      requested_by: asString(authority.requested_by),
      owner: asString(authority.owner),
      reviewers: asArray<string>(authority.reviewers).filter(
        (value) => typeof value === "string" && value.trim().length > 0,
      ),
      time_window: authority.time_window
        ? {
            start_at: asString(asRecord(authority.time_window).start_at),
            end_at: asString(asRecord(authority.time_window).end_at),
          }
        : null,
      reason_codes: coverage.reason_codes.filter((reasonCode) =>
        GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category === "authority",
      ),
    },
    scope_summary: {
      in_scope_count: asArray(scope.in_scope).length,
      out_of_scope_count: asArray(scope.out_of_scope).length,
      touched_resource_count: asArray(scope.touched_resources).length,
      changed_file_count: asArray(scope.changed_files).length,
      data_sensitivity: asString(scope.data_sensitivity),
      reason_codes: coverage.reason_codes.filter((reasonCode) =>
        ["scope", "data_security"].includes(
          GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category ?? "",
        ),
      ),
    },
    evidence_coverage: {
      completeness: coverage.completeness,
      manifest_completeness: coverage.manifest_completeness,
      artifact_count: coverage.artifact_count,
      action_count: coverage.action_count,
      tool_call_count: coverage.tool_call_count,
      verification_count: coverage.verification_count,
      blocked_action_count: coverage.blocked_action_count,
      missing_evidence_count: coverage.missing_evidence_count,
      reason_codes: coverage.reason_codes.filter((reasonCode) =>
        ["evidence_integrity", "verification", "release_rollback", "dependency_change"].includes(
          GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category ?? "",
        ),
      ),
    },
    risk_summary: {
      max_severity: maxSeverity(allReasonCodes),
      risk_count: allReasonCodes.length,
      risk_categories: riskCategories as GovernanceReportModel["risk_summary"]["risk_categories"],
      reason_codes: allReasonCodes,
    },
    blocked_actions_summary: {
      count: blockedItems.length,
      critical_count: blockedItems.filter(
        (item) => item.severity === RISK_SEVERITY_VALUES.CRITICAL,
      ).length,
      high_count: blockedItems.filter(
        (item) => item.severity === RISK_SEVERITY_VALUES.HIGH,
      ).length,
      items: blockedItems,
      reason_codes: coverage.reason_codes.filter((reasonCode) =>
        GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category === "tool_action",
      ),
    },
    verification_summary: {
      total_count: verificationItems.length,
      passed_count: verificationItems.filter((item) => item.status === "passed").length,
      failed_count: verificationItems.filter((item) => item.status === "failed").length,
      not_run_count: verificationItems.filter((item) => item.status === "not_run").length,
      inconclusive_count: verificationItems.filter(
        (item) => item.status === "inconclusive",
      ).length,
      reason_codes: coverage.reason_codes.filter((reasonCode) =>
        ["verification", "release_rollback", "dependency_change"].includes(
          GUARD_REASON_CODE_DEFINITIONS[reasonCode]?.category ?? "",
        ),
      ),
    },
    missing_evidence: coverage.missing_evidence,
    human_review_requirements: reviewRequirements,
    next_actions: nextActions,
    evidence_refs: buildEvidenceReferences(pack),
    reason_codes: allReasonCodes,
    provenance: {
      generated_by: REPORT_SERVICE_GENERATOR,
      generator_version: REPORT_SERVICE_VERSION,
      deterministic: true,
      source_pack_hash:
        asString(provenance.source_pack_hash) ?? `source-pack:${pack.pack_id}`,
      reason_code_version: REASON_CODE_VERSION,
    },
  };

  return {
    ok: true,
    report,
    warnings: validation.warnings,
  };
}
