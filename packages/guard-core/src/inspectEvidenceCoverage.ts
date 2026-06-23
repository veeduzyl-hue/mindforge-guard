import {
  GUARD_REASON_CODE_DEFINITIONS,
  GUARD_REASON_CODES,
  type GuardReasonCode,
  type GuardReasonSeverityHint,
} from "./reasonCodes.ts";
import type { EvidencePackV1 } from "./parseEvidencePack.ts";
import {
  REPORT_COMPLETENESS_VALUES,
  type MissingEvidenceCategory,
  type MissingEvidenceItem,
  type ReportCompletenessValue,
} from "./reportModel.ts";

export interface InspectEvidenceCoverageResult {
  completeness: ReportCompletenessValue;
  manifest_completeness: ReportCompletenessValue;
  artifact_count: number;
  action_count: number;
  tool_call_count: number;
  verification_count: number;
  blocked_action_count: number;
  missing_evidence_count: number;
  missing_evidence: MissingEvidenceItem[];
  reason_codes: GuardReasonCode[];
}

type UnknownRecord = Record<string, unknown>;

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

function createMissingEvidenceItem(
  reasonCode: GuardReasonCode,
  category: MissingEvidenceCategory,
  evidenceRefs: string[],
  recommendedFix: string | null,
): MissingEvidenceItem {
  const definition = GUARD_REASON_CODE_DEFINITIONS[reasonCode];

  return {
    missing_evidence_id: `missing:${reasonCode.toLowerCase()}`,
    category,
    message: definition.description,
    reason_code: reasonCode,
    severity_hint: definition.severity_hint,
    evidence_refs: evidenceRefs,
    recommended_fix: recommendedFix,
  };
}

function addCoverageFinding(
  missingEvidence: MissingEvidenceItem[],
  reasonCodes: GuardReasonCode[],
  reasonCode: GuardReasonCode,
  category: MissingEvidenceCategory,
  evidenceRefs: string[],
  recommendedFix: string | null,
): void {
  addUnique(reasonCodes, reasonCode);

  if (!missingEvidence.some((item) => item.reason_code === reasonCode)) {
    missingEvidence.push(
      createMissingEvidenceItem(reasonCode, category, evidenceRefs, recommendedFix),
    );
  }
}

function normalizeManifestCompleteness(value: unknown): ReportCompletenessValue {
  if (
    value === REPORT_COMPLETENESS_VALUES.COMPLETE ||
    value === REPORT_COMPLETENESS_VALUES.PARTIAL ||
    value === REPORT_COMPLETENESS_VALUES.INCOMPLETE ||
    value === REPORT_COMPLETENESS_VALUES.UNKNOWN
  ) {
    return value;
  }

  return REPORT_COMPLETENESS_VALUES.UNKNOWN;
}

function mapBlockedActionReasonCode(
  value: unknown,
): GuardReasonCode | null {
  switch (value) {
    case "DESTRUCTIVE_COMMAND":
      return GUARD_REASON_CODES.DESTRUCTIVE_COMMAND_ATTEMPTED;
    case "SECRET_ACCESS":
      return GUARD_REASON_CODES.SECRET_ACCESS_ATTEMPTED;
    case "NETWORK_NOT_ALLOWED":
      return GUARD_REASON_CODES.NETWORK_ACCESS_ATTEMPTED;
    default:
      return null;
  }
}

function hasPassedVerification(
  verificationItems: UnknownRecord[],
  verificationType: string,
): boolean {
  return verificationItems.some(
    (item) =>
      item.verification_type === verificationType && item.status === "passed",
  );
}

function hasVerificationStatus(
  verificationItems: UnknownRecord[],
  verificationType: string,
  statuses: string[],
): boolean {
  return verificationItems.some(
    (item) =>
      item.verification_type === verificationType &&
      typeof item.status === "string" &&
      statuses.includes(item.status),
  );
}

function hasArtifactWithDescription(
  artifacts: UnknownRecord[],
  pattern: RegExp,
): boolean {
  return artifacts.some((artifact) => {
    const path = asString(artifact.path) ?? "";
    const description = asString(artifact.description) ?? "";
    return pattern.test(path) || pattern.test(description);
  });
}

function computeOverallCompleteness(
  manifestCompleteness: ReportCompletenessValue,
  missingEvidenceCount: number,
): ReportCompletenessValue {
  if (
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.UNKNOWN ||
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.INCOMPLETE
  ) {
    return manifestCompleteness;
  }

  if (
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.PARTIAL ||
    missingEvidenceCount > 0
  ) {
    return REPORT_COMPLETENESS_VALUES.PARTIAL;
  }

  return REPORT_COMPLETENESS_VALUES.COMPLETE;
}

export function inspectEvidenceCoverage(
  pack: EvidencePackV1,
): InspectEvidenceCoverageResult {
  const authority = asRecord(pack.authority);
  const workflow = asRecord(pack.workflow);
  const scope = asRecord(pack.scope);
  const producer = asRecord(pack.producer);
  const provenance = asRecord(pack.provenance);
  const manifest = asRecord(pack.manifest);
  const repository = asRecord(workflow.repository);

  const actions = asArray<UnknownRecord>(pack.actions);
  const toolCalls = asArray<UnknownRecord>(pack.tool_calls);
  const blockedActions = asArray<UnknownRecord>(pack.blocked_actions);
  const artifacts = asArray<UnknownRecord>(pack.artifacts);
  const verificationItems = asArray<UnknownRecord>(pack.verification);
  const manifestFiles = asArray<UnknownRecord>(manifest.files);

  const missingEvidence: MissingEvidenceItem[] = [];
  const reasonCodes: GuardReasonCode[] = [];

  const packCreatedAt = asString(pack.created_at);
  const authorityStatus = asString(authority.authorization_status);
  const owner = asString(authority.owner);
  const reviewers = asArray<string>(authority.reviewers).filter(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  const authorizationEvidence = asArray<string>(authority.authorization_evidence).filter(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  const timeWindow = asRecord(authority.time_window);
  const timeWindowStart = asString(timeWindow.start_at);
  const timeWindowEnd = asString(timeWindow.end_at);
  const workflowType = asString(workflow.workflow_type) ?? "generic";
  const dataSensitivity = asString(scope.data_sensitivity);
  const inScope = asArray<string>(scope.in_scope).filter(
    (item) => typeof item === "string",
  );
  const outOfScope = asArray<string>(scope.out_of_scope).filter(
    (item) => typeof item === "string",
  );
  const touchedResources = asArray<string>(scope.touched_resources).filter(
    (item) => typeof item === "string",
  );
  const changedFiles = asArray<string>(scope.changed_files).filter(
    (item) => typeof item === "string",
  );
  const manifestCompleteness = normalizeManifestCompleteness(manifest.completeness);
  const artifactIdSet = new Set(
    artifacts
      .map((artifact) => asString(artifact.artifact_id))
      .filter((value): value is string => value !== null),
  );

  if (
    authorityStatus === "missing" ||
    authorizationEvidence.length === 0
  ) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.MISSING_AUTHORITY,
      "authority",
      authorizationEvidence,
      "Provide explicit authority evidence for the recorded workflow.",
    );
  }

  if (authorityStatus === "declared") {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.DECLARED_AUTHORITY_ONLY,
      "authority",
      authorizationEvidence,
      "Provide stronger authority evidence beyond declaration-only status.",
    );
  }

  if (!owner) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.OWNER_MISSING,
      "authority",
      [],
      "Add owner context for the workflow.",
    );
  }

  if (reviewers.length === 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.REVIEWER_MISSING,
      "authority",
      [],
      "Add reviewer context for the workflow.",
    );
  }

  if (!timeWindowStart || !timeWindowEnd) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.TIME_WINDOW_MISSING,
      "authority",
      [],
      "Add a bounded authority time window.",
    );
  } else if (
    packCreatedAt &&
    !Number.isNaN(Date.parse(packCreatedAt)) &&
    !Number.isNaN(Date.parse(timeWindowEnd)) &&
    Date.parse(timeWindowEnd) < Date.parse(packCreatedAt)
  ) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.TIME_WINDOW_EXPIRED,
      "authority",
      [],
      "Refresh the authority time window.",
    );
  }

  if (dataSensitivity === "unknown" || !dataSensitivity) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.DATA_SENSITIVITY_UNKNOWN,
      "scope",
      [],
      "Declare data sensitivity for the workflow scope.",
    );
  }

  const changedOutsideScope = changedFiles.filter(
    (file) => inScope.length > 0 && !inScope.includes(file),
  );
  if (changedOutsideScope.length > 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.UNDECLARED_FILE_CHANGE,
      "scope",
      changedOutsideScope,
      "Align the declared scope with the changed files.",
    );
  }

  const touchedProtectedResources = touchedResources.filter((resource) =>
    /(secret|credential|private|\.pem|id_rsa|\.env)/i.test(resource),
  );
  if (touchedProtectedResources.length > 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.PROTECTED_RESOURCE_TOUCHED,
      "scope",
      touchedProtectedResources,
      "Limit or justify access to protected resources.",
    );
  }

  const actionsOutOfScope = actions
    .map((action) => asRecord(action.target))
    .map((target) => asString(target.path) ?? asString(target.resource))
    .filter((value): value is string => value !== null)
    .filter((value) => outOfScope.includes(value));
  if (actionsOutOfScope.length > 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.OUT_OF_SCOPE_ACTION,
      "scope",
      actionsOutOfScope,
      "Keep recorded actions within the declared scope.",
    );
  }

  if (verificationItems.length === 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION,
      "verification",
      [],
      "Provide verification material for the workflow.",
    );
  }

  const hasUnitOrIntegrationRecord = verificationItems.some((item) =>
    item.verification_type === "unit_test" ||
    item.verification_type === "integration_test"
  );
  const hasPassedUnitOrIntegration = verificationItems.some(
    (item) =>
      (item.verification_type === "unit_test" ||
        item.verification_type === "integration_test") &&
      item.status === "passed",
  );
  const hasFailedUnitOrIntegration = verificationItems.some(
    (item) =>
      (item.verification_type === "unit_test" ||
        item.verification_type === "integration_test") &&
      item.status === "failed",
  );
  const hasNotRunUnitOrIntegration = verificationItems.some(
    (item) =>
      (item.verification_type === "unit_test" ||
        item.verification_type === "integration_test") &&
      item.status === "not_run",
  );

  if (
    pack.pack_type === "ai_software_change" &&
    workflowType !== "release" &&
    workflowType !== "dependency_upgrade"
  ) {
    if (!hasUnitOrIntegrationRecord) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.TESTS_NOT_RUN,
        "verification",
        [],
        "Provide unit or integration test coverage for the software change.",
      );
      addUnique(reasonCodes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION);
    } else if (hasFailedUnitOrIntegration) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.TESTS_FAILED,
        "verification",
        [],
        "Resolve failing tests and resubmit evidence.",
      );
      addUnique(reasonCodes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION);
    } else if (hasNotRunUnitOrIntegration || !hasPassedUnitOrIntegration) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.TESTS_NOT_RUN,
        "verification",
        [],
        "Provide successful unit or integration test evidence.",
      );
      addUnique(reasonCodes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION);
    }
  }

  const hasBuildRecord = verificationItems.some(
    (item) => item.verification_type === "build",
  );
  const hasBuildPassed = hasPassedVerification(verificationItems, "build");
  const hasBuildFailed = hasVerificationStatus(verificationItems, "build", ["failed"]);

  if (
    pack.pack_type === "ai_software_change" ||
    workflowType === "release" ||
    workflowType === "dependency_upgrade"
  ) {
    if (!hasBuildRecord) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.BUILD_NOT_RUN,
        "verification",
        [],
        "Provide build verification evidence.",
      );
    } else if (hasBuildFailed || !hasBuildPassed) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.BUILD_FAILED,
        "verification",
        [],
        "Provide a successful build result.",
      );
    }
  }

  if (workflowType === "release") {
    const hasRollbackRecord = verificationItems.some(
      (item) => item.verification_type === "rollback_check",
    );
    const hasPassedRollback = hasPassedVerification(
      verificationItems,
      "rollback_check",
    );

    const hasRollbackNotRun = hasVerificationStatus(
      verificationItems,
      "rollback_check",
      ["not_run"],
    );

    if (!hasPassedRollback) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        !hasRollbackRecord || hasRollbackNotRun
          ? GUARD_REASON_CODES.ROLLBACK_MISSING
          : GUARD_REASON_CODES.ROLLBACK_UNVERIFIED,
        "rollback",
        [],
        "Provide a passed rollback check for the release workflow.",
      );
    }
  }

  if (workflowType === "dependency_upgrade") {
    addUnique(reasonCodes, GUARD_REASON_CODES.DEPENDENCY_CHANGE_DETECTED);

    const lockfileChanged = changedFiles.some((file) =>
      /lockfile|package-lock\.json|pnpm-lock\.yaml|yarn\.lock/i.test(file),
    );
    if (lockfileChanged) {
      addUnique(reasonCodes, GUARD_REASON_CODES.LOCKFILE_CHANGED);
    }

    const hasIntegrationPassed = hasPassedVerification(
      verificationItems,
      "integration_test",
    );
    const hasIntegrationRecord = verificationItems.some(
      (item) => item.verification_type === "integration_test",
    );

    if (!hasIntegrationPassed) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED,
        "verification",
        [],
        "Provide stronger compatibility verification for the dependency change.",
      );
      addUnique(reasonCodes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION);
    } else if (!hasIntegrationRecord) {
      addUnique(reasonCodes, GUARD_REASON_CODES.INSUFFICIENT_VERIFICATION);
    }

    const hasMigrationNotes = hasArtifactWithDescription(
      artifacts,
      /(migration|upgrade)/i,
    );
    if (!hasMigrationNotes) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.MIGRATION_NOT_DOCUMENTED,
        "verification",
        [],
        "Provide migration or upgrade notes for the dependency change.",
      );
    }
  }

  if (pack.pack_type === "cyber_remediation" && authorityStatus !== "provided") {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.CYBER_AUTHORIZATION_REQUIRED,
      "authority",
      authorizationEvidence,
      "Provide explicit authorization for the cyber-oriented workflow.",
    );
  }

  if (
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.PARTIAL ||
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.INCOMPLETE ||
    manifestCompleteness === REPORT_COMPLETENESS_VALUES.UNKNOWN ||
    manifestFiles.length === 0
  ) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.MANIFEST_INCOMPLETE,
      "manifest",
      [],
      "Provide a complete manifest inventory for the pack.",
    );
  }

  for (const artifact of artifacts) {
    if (!asString(artifact.sha256)) {
      addCoverageFinding(
        missingEvidence,
        reasonCodes,
        GUARD_REASON_CODES.ARTIFACT_HASH_MISSING,
        "artifact",
        [asString(artifact.artifact_id) ?? "artifact:unknown"],
        "Add a stable artifact hash.",
      );
    }
  }

  const referencedArtifactIds = [
    ...toolCalls.flatMap((toolCall) =>
      asArray<string>(toolCall.artifact_refs).filter(
        (value) => typeof value === "string",
      ),
    ),
    ...verificationItems.flatMap((verification) =>
      asArray<string>(verification.artifact_refs).filter(
        (value) => typeof value === "string",
      ),
    ),
    ...authorizationEvidence,
  ];

  const unresolvedArtifactRefs = referencedArtifactIds.filter(
    (artifactId) => artifactId !== "art_manifest" && !artifactIdSet.has(artifactId),
  );
  if (unresolvedArtifactRefs.length > 0) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.ARTIFACT_REF_UNRESOLVED,
      "artifact",
      unresolvedArtifactRefs,
      "Align artifact references with the submitted artifact inventory.",
    );
  }

  if (
    !asString(producer.producer_id) ||
    !asString(producer.producer_name) ||
    !producer.generated_by
  ) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.PRODUCER_IDENTITY_UNKNOWN,
      "provenance",
      [],
      "Provide stable producer identity metadata.",
    );
  }

  if (provenance.deterministic !== true) {
    addUnique(reasonCodes, GUARD_REASON_CODES.NON_DETERMINISTIC_PRODUCER);
  }

  if (blockedActions.length > 0) {
    addUnique(reasonCodes, GUARD_REASON_CODES.BLOCKED_ACTION_PRESENT);
  }

  for (const blockedAction of blockedActions) {
    const mappedReasonCode = mapBlockedActionReasonCode(blockedAction.reason_code);
    if (mappedReasonCode) {
      addUnique(reasonCodes, mappedReasonCode);
    }
  }

  for (const toolCall of toolCalls) {
    if (!asString(toolCall.output_summary)) {
      addUnique(reasonCodes, GUARD_REASON_CODES.TOOL_OUTPUT_MISSING);
    }
  }

  for (const action of actions) {
    if (action.command && Object.keys(asRecord(action.outputs)).length === 0) {
      addUnique(reasonCodes, GUARD_REASON_CODES.COMMAND_RESULT_MISSING);
    }
  }

  if (!asString(provenance.source_pack_hash)) {
    addCoverageFinding(
      missingEvidence,
      reasonCodes,
      GUARD_REASON_CODES.PRODUCER_IDENTITY_UNKNOWN,
      "provenance",
      [],
      "Provide stable source pack provenance.",
    );
  }

  if (
    workflowType === "dependency_upgrade" &&
    !asString(repository.branch)
  ) {
    addUnique(reasonCodes, GUARD_REASON_CODES.BREAKING_CHANGE_UNVERIFIED);
  }

  const completeness = computeOverallCompleteness(
    manifestCompleteness,
    missingEvidence.length,
  );

  return {
    completeness,
    manifest_completeness: manifestCompleteness,
    artifact_count: artifacts.length,
    action_count: actions.length,
    tool_call_count: toolCalls.length,
    verification_count: verificationItems.length,
    blocked_action_count: blockedActions.length,
    missing_evidence_count: missingEvidence.length,
    missing_evidence: missingEvidence,
    reason_codes: reasonCodes,
  };
}
