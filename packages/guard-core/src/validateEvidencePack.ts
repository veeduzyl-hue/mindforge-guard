import {
  GUARD_VALIDATION_ERROR_CODES,
  GUARD_VALIDATION_WARNING_CODES,
  createValidationError,
  createValidationWarning,
  type GuardValidationError,
  type GuardValidationWarning,
} from "./errors.ts";
import type { EvidencePackV1 } from "./parseEvidencePack.ts";

export type ValidationResult =
  | { ok: true; warnings: GuardValidationWarning[] }
  | {
      ok: false;
      errors: GuardValidationError[];
      warnings: GuardValidationWarning[];
    };

type GuardPackObject = Record<string, unknown>;

type ValidationContext = {
  errors: GuardValidationError[];
  warnings: GuardValidationWarning[];
};

const TOP_LEVEL_REQUIRED_FIELDS = [
  "schema_version",
  "pack_id",
  "pack_type",
  "created_at",
  "producer",
  "workflow",
  "authority",
  "runtime",
  "intent",
  "scope",
  "actions",
  "tool_calls",
  "blocked_actions",
  "artifacts",
  "verification",
  "risk_signals",
  "provenance",
  "manifest",
] as const;

const TOP_LEVEL_OPTIONAL_FIELDS = [
  "plan",
  "policy_observations",
  "human_review",
  "extensions",
] as const;

const TOP_LEVEL_ALLOWED_FIELDS = new Set([
  ...TOP_LEVEL_REQUIRED_FIELDS,
  ...TOP_LEVEL_OPTIONAL_FIELDS,
]);

const PACK_TYPES = new Set([
  "ai_software_change",
  "cyber_remediation",
  "generic_agent_workflow",
]);
const PRODUCER_TYPES = new Set([
  "guard_harness",
  "ci",
  "ide",
  "agent_runtime",
  "manual_import",
]);
const PRODUCER_PROFILES = new Set([
  "local-dev",
  "ci-pr",
  "release-prep",
  "audit-review",
]);
const WORKFLOW_TYPES = new Set([
  "pull_request",
  "release",
  "dependency_upgrade",
  "infra_change",
  "security_patch",
  "data_operation",
  "generic",
]);
const REPOSITORY_PROVIDERS = new Set([
  "github",
  "gitlab",
  "bitbucket",
  "local",
  "unknown",
]);
const ENVIRONMENTS = new Set(["local", "ci", "staging", "production", "unknown"]);
const AUTHORIZATION_STATUSES = new Set([
  "declared",
  "provided",
  "missing",
  "out_of_scope",
  "not_required",
]);
const RUNTIME_TYPES = new Set([
  "harness",
  "ci",
  "ide_agent",
  "agent_runtime",
  "manual",
  "unknown",
]);
const DATA_SENSITIVITIES = new Set(["none", "low", "medium", "high", "unknown"]);
const ACTION_TYPES = new Set([
  "read_file",
  "write_file",
  "run_command",
  "call_tool",
  "modify_code",
  "install_dependency",
  "network_access",
  "git_operation",
  "test_execution",
  "release_operation",
  "other",
]);
const ACTION_STATUSES = new Set(["succeeded", "failed", "blocked", "skipped"]);
const TOOL_CALL_TYPES = new Set([
  "shell",
  "filesystem",
  "git",
  "scanner",
  "test_runner",
  "model",
  "custom",
]);
const BLOCKED_ACTION_REASON_CODES = new Set([
  "PROTECTED_PATH",
  "DESTRUCTIVE_COMMAND",
  "SECRET_ACCESS",
  "NETWORK_NOT_ALLOWED",
  "OUT_OF_SCOPE",
  "MISSING_AUTHORITY",
  "POLICY_DENIED",
  "UNKNOWN",
]);
const SEVERITIES = new Set(["low", "medium", "high", "critical"]);
const ARTIFACT_TYPES = new Set([
  "source_file",
  "diff",
  "log",
  "test_result",
  "scan_result",
  "build_output",
  "screenshot",
  "policy",
  "authorization",
  "report",
  "other",
]);
const VERIFICATION_TYPES = new Set([
  "unit_test",
  "integration_test",
  "static_analysis",
  "security_scan",
  "manual_review",
  "build",
  "rollback_check",
]);
const VERIFICATION_STATUSES = new Set([
  "passed",
  "failed",
  "not_run",
  "inconclusive",
]);
const POLICY_OBSERVATION_STATUSES = new Set([
  "observed",
  "declared",
  "missing",
  "not_applicable",
]);
const HUMAN_REVIEW_STATUSES = new Set(["pending", "completed", "not_required"]);
const RISK_SIGNAL_CATEGORIES = new Set([
  "authority",
  "scope",
  "data",
  "security",
  "release",
  "dependency",
  "rollback",
  "evidence_integrity",
]);
const MANIFEST_COMPLETENESS = new Set([
  "complete",
  "partial",
  "incomplete",
  "unknown",
]);
const PLAN_STATUSES = new Set([
  "planned",
  "in_progress",
  "completed",
  "blocked",
  "skipped",
]);

const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const SHA256_PATTERN = /^[A-Fa-f0-9]{64}$/;
const COMMIT_SHA_PATTERN = /^[0-9a-f]{40}$/;

function isPlainObject(value: unknown): value is GuardPackObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addError(
  context: ValidationContext,
  code: GuardValidationError["code"],
  path: string,
  message: string,
  details?: Record<string, unknown>,
): void {
  context.errors.push(createValidationError(code, path, message, details));
}

function addWarning(
  context: ValidationContext,
  code: GuardValidationWarning["code"],
  path: string,
  message: string,
  details?: Record<string, unknown>,
): void {
  context.warnings.push(createValidationWarning(code, path, message, details));
}

function validateObjectShape(
  value: unknown,
  path: string,
  label: string,
  requiredKeys: readonly string[],
  allowedKeys: readonly string[],
  context: ValidationContext,
): value is GuardPackObject {
  if (!isPlainObject(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_OBJECT_FIELD,
      path,
      `${label} must be an object.`,
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return false;
  }

  for (const key of requiredKeys) {
    if (!(key in value)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.MISSING_REQUIRED_FIELD,
        `${path}.${key}`,
        `Missing required field '${key}'.`,
      );
    }
  }

  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_OBJECT_FIELD,
        `${path}.${key}`,
        `Unexpected field '${key}' in ${label}.`,
      );
    }
  }

  return true;
}

function validateNonEmptyString(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a string.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (value.trim().length === 0) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a non-empty string.",
    );
  }
}

function validateNullableString(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (value !== null && typeof value !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a string or null.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (typeof value === "string" && value.trim().length === 0) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must not be an empty string.",
    );
  }
}

function validateBoolean(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value !== "boolean") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a boolean.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
  }
}

function validateInteger(
  value: unknown,
  path: string,
  context: ValidationContext,
  minimum?: number,
): void {
  if (!Number.isInteger(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be an integer.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (minimum !== undefined && (value as number) < minimum) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      `Field must be greater than or equal to ${minimum}.`,
      { receivedValue: value },
    );
  }
}

function validateTimestamp(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_TIMESTAMP,
      path,
      "Timestamp field must be a string.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (!ISO_TIMESTAMP_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_TIMESTAMP,
      path,
      "Timestamp must be a valid ISO 8601 date-time string.",
      { receivedValue: value },
    );
  }
}

function validateEnum(
  value: unknown,
  path: string,
  allowedValues: Set<string>,
  code: GuardValidationError["code"],
  message: string,
  context: ValidationContext,
): void {
  if (typeof value !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a string.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (!allowedValues.has(value)) {
    addError(context, code, path, message, {
      receivedValue: value,
      allowedValues: [...allowedValues],
    });
  }
}

function validateStringArray(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (!Array.isArray(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ARRAY_FIELD,
      path,
      "Field must be an array.",
      { receivedType: typeof value },
    );
    return;
  }

  value.forEach((entry, index) => {
    validateNonEmptyString(entry, `${path}[${index}]`, context);
  });
}

function validateSha256(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a string.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
    return;
  }

  if (!SHA256_PATTERN.test(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
      path,
      "Field must be a 64-character hexadecimal SHA-256 string.",
      { receivedValue: value },
    );
  }
}

function validateGeneratedBy(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value === "string") {
    validateNonEmptyString(value, path, context);
    return;
  }

  if (
    !validateObjectShape(
      value,
      path,
      "generated_by",
      ["component"],
      ["component", "version", "surface"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.component, `${path}.component`, context);

  if ("version" in value) {
    validateNullableString(value.version, `${path}.version`, context);
  }

  if ("surface" in value) {
    validateNullableString(value.surface, `${path}.surface`, context);
  }
}

function validateRepositoryRef(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value === "string") {
    validateNonEmptyString(value, path, context);
    return;
  }

  if (
    !validateObjectShape(
      value,
      path,
      "workflow.repository",
      [],
      [
        "provider",
        "repo_name",
        "remote_url",
        "default_branch",
        "branch",
        "base_ref",
        "head_ref",
        "commit_sha",
        "pr_number",
      ],
      context,
    )
  ) {
    return;
  }

  if ("provider" in value) {
    validateEnum(
      value.provider,
      `${path}.provider`,
      REPOSITORY_PROVIDERS,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
      "Repository provider must be one of the allowed repository provider values.",
      context,
    );
  }

  for (const key of [
    "repo_name",
    "remote_url",
    "default_branch",
    "branch",
    "base_ref",
    "head_ref",
    "pr_number",
  ] as const) {
    if (key in value) {
      validateNonEmptyString(value[key], `${path}.${key}`, context);
    }
  }

  if ("commit_sha" in value) {
    if (typeof value.commit_sha !== "string") {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
        `${path}.commit_sha`,
        "commit_sha must be a string.",
        { receivedType: Array.isArray(value.commit_sha) ? "array" : typeof value.commit_sha },
      );
    } else if (!COMMIT_SHA_PATTERN.test(value.commit_sha)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_FIELD_TYPE,
        `${path}.commit_sha`,
        "commit_sha must be a 40-character lowercase hexadecimal string.",
        { receivedValue: value.commit_sha },
      );
    }
  }
}

function validateTargetRef(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value === "string") {
    validateNonEmptyString(value, path, context);
    return;
  }

  if (
    !validateObjectShape(
      value,
      path,
      "target",
      ["resource"],
      ["resource", "path", "ref"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.resource, `${path}.resource`, context);

  if ("path" in value) {
    validateNullableString(value.path, `${path}.path`, context);
  }

  if ("ref" in value) {
    validateNullableString(value.ref, `${path}.ref`, context);
  }
}

function validateTimeWindow(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "authority.time_window",
      [],
      ["start_at", "end_at"],
      context,
    )
  ) {
    return;
  }

  if ("start_at" in value) {
    validateTimestamp(value.start_at, `${path}.start_at`, context);
  }

  if ("end_at" in value) {
    validateTimestamp(value.end_at, `${path}.end_at`, context);
  }
}

function validateProducer(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "producer",
      [
        "producer_id",
        "producer_name",
        "producer_version",
        "producer_type",
        "profile",
        "generated_by",
      ],
      [
        "producer_id",
        "producer_name",
        "producer_version",
        "producer_type",
        "profile",
        "generated_by",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.producer_id, `${path}.producer_id`, context);
  validateNonEmptyString(value.producer_name, `${path}.producer_name`, context);
  validateNonEmptyString(value.producer_version, `${path}.producer_version`, context);
  validateEnum(
    value.producer_type,
    `${path}.producer_type`,
    PRODUCER_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "producer_type must be one of the allowed producer types.",
    context,
  );
  validateEnum(
    value.profile,
    `${path}.profile`,
    PRODUCER_PROFILES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "profile must be one of the allowed producer profiles.",
    context,
  );
  validateGeneratedBy(value.generated_by, `${path}.generated_by`, context);
}

function validateWorkflow(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "workflow",
      ["workflow_id", "workflow_name", "workflow_type", "repository", "environment"],
      ["workflow_id", "workflow_name", "workflow_type", "repository", "environment"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.workflow_id, `${path}.workflow_id`, context);
  validateNonEmptyString(value.workflow_name, `${path}.workflow_name`, context);
  validateEnum(
    value.workflow_type,
    `${path}.workflow_type`,
    WORKFLOW_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "workflow_type must be one of the allowed workflow types.",
    context,
  );
  validateRepositoryRef(value.repository, `${path}.repository`, context);
  validateEnum(
    value.environment,
    `${path}.environment`,
    ENVIRONMENTS,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "environment must be one of the allowed environment values.",
    context,
  );
}

function validateAuthority(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "authority",
      [
        "requested_by",
        "owner",
        "reviewers",
        "authorization_status",
        "authorization_evidence",
        "allowed_actions",
        "prohibited_actions",
        "time_window",
      ],
      [
        "requested_by",
        "owner",
        "reviewers",
        "authorization_status",
        "authorization_evidence",
        "allowed_actions",
        "prohibited_actions",
        "time_window",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.requested_by, `${path}.requested_by`, context);
  validateNonEmptyString(value.owner, `${path}.owner`, context);
  validateStringArray(value.reviewers, `${path}.reviewers`, context);
  validateEnum(
    value.authorization_status,
    `${path}.authorization_status`,
    AUTHORIZATION_STATUSES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "authorization_status must be one of the allowed values.",
    context,
  );
  validateStringArray(value.authorization_evidence, `${path}.authorization_evidence`, context);
  validateStringArray(value.allowed_actions, `${path}.allowed_actions`, context);
  validateStringArray(value.prohibited_actions, `${path}.prohibited_actions`, context);
  validateTimeWindow(value.time_window, `${path}.time_window`, context);
}

function validateRuntimeModel(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (typeof value === "string") {
    validateNonEmptyString(value, path, context);
    return;
  }

  if (
    !validateObjectShape(
      value,
      path,
      "runtime.model",
      ["model_name"],
      ["model_name", "provider", "model_version"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.model_name, `${path}.model_name`, context);

  if ("provider" in value) {
    validateNullableString(value.provider, `${path}.provider`, context);
  }

  if ("model_version" in value) {
    validateNullableString(value.model_version, `${path}.model_version`, context);
  }
}

function validateRuntimeTool(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "runtime.tools[]",
      ["tool_name", "tool_type"],
      ["tool_name", "tool_type", "version", "operation_scope"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.tool_name, `${path}.tool_name`, context);
  validateNonEmptyString(value.tool_type, `${path}.tool_type`, context);

  if ("version" in value) {
    validateNullableString(value.version, `${path}.version`, context);
  }

  if ("operation_scope" in value) {
    validateStringArray(value.operation_scope, `${path}.operation_scope`, context);
  }
}

function validateRuntime(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "runtime",
      [
        "runtime_id",
        "runtime_type",
        "runtime_name",
        "runtime_version",
        "model",
        "tools",
        "execution_mode",
      ],
      [
        "runtime_id",
        "runtime_type",
        "runtime_name",
        "runtime_version",
        "model",
        "tools",
        "execution_mode",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.runtime_id, `${path}.runtime_id`, context);
  validateEnum(
    value.runtime_type,
    `${path}.runtime_type`,
    RUNTIME_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "runtime_type must be one of the allowed runtime types.",
    context,
  );
  validateNonEmptyString(value.runtime_name, `${path}.runtime_name`, context);
  validateNonEmptyString(value.runtime_version, `${path}.runtime_version`, context);
  validateRuntimeModel(value.model, `${path}.model`, context);

  if (!Array.isArray(value.tools)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ARRAY_FIELD,
      `${path}.tools`,
      "runtime.tools must be an array.",
      { receivedType: typeof value.tools },
    );
  } else {
    value.tools.forEach((tool, index) => {
      validateRuntimeTool(tool, `${path}.tools[${index}]`, context);
    });
  }

  validateNonEmptyString(value.execution_mode, `${path}.execution_mode`, context);
}

function validateIntent(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "intent",
      [
        "intent_id",
        "user_goal",
        "agent_task",
        "expected_outcome",
        "declared_constraints",
        "success_criteria",
      ],
      [
        "intent_id",
        "user_goal",
        "agent_task",
        "expected_outcome",
        "declared_constraints",
        "success_criteria",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.intent_id, `${path}.intent_id`, context);
  validateNonEmptyString(value.user_goal, `${path}.user_goal`, context);
  validateNonEmptyString(value.agent_task, `${path}.agent_task`, context);
  validateNonEmptyString(value.expected_outcome, `${path}.expected_outcome`, context);
  validateStringArray(value.declared_constraints, `${path}.declared_constraints`, context);
  validateStringArray(value.success_criteria, `${path}.success_criteria`, context);
}

function validateScope(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "scope",
      ["in_scope", "out_of_scope", "touched_resources", "changed_files", "data_sensitivity"],
      ["in_scope", "out_of_scope", "touched_resources", "changed_files", "data_sensitivity"],
      context,
    )
  ) {
    return;
  }

  validateStringArray(value.in_scope, `${path}.in_scope`, context);
  validateStringArray(value.out_of_scope, `${path}.out_of_scope`, context);
  validateStringArray(value.touched_resources, `${path}.touched_resources`, context);
  validateStringArray(value.changed_files, `${path}.changed_files`, context);
  validateEnum(
    value.data_sensitivity,
    `${path}.data_sensitivity`,
    DATA_SENSITIVITIES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "data_sensitivity must be one of the allowed values.",
    context,
  );
}

function validatePlan(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "plan",
      ["steps"],
      ["plan_id", "summary", "steps"],
      context,
    )
  ) {
    return;
  }

  if ("plan_id" in value) {
    validateNullableString(value.plan_id, `${path}.plan_id`, context);
  }

  if ("summary" in value) {
    validateNullableString(value.summary, `${path}.summary`, context);
  }

  if (!Array.isArray(value.steps)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ARRAY_FIELD,
      `${path}.steps`,
      "plan.steps must be an array.",
      { receivedType: typeof value.steps },
    );
    return;
  }

  value.steps.forEach((step, index) => {
    if (
      !validateObjectShape(
        step,
        `${path}.steps[${index}]`,
        "plan.steps[]",
        ["step_id", "description", "status"],
        ["step_id", "description", "status"],
        context,
      )
    ) {
      return;
    }

    validateNonEmptyString(step.step_id, `${path}.steps[${index}].step_id`, context);
    validateNonEmptyString(step.description, `${path}.steps[${index}].description`, context);
    validateEnum(
      step.status,
      `${path}.steps[${index}].status`,
      PLAN_STATUSES,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
      "plan.steps[].status must be one of the allowed plan statuses.",
      context,
    );
  });
}

function validateAction(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "actions[]",
      [
        "action_id",
        "timestamp",
        "actor",
        "action_type",
        "target",
        "command",
        "inputs",
        "outputs",
        "status",
        "related_tool_call_id",
      ],
      [
        "action_id",
        "timestamp",
        "actor",
        "action_type",
        "target",
        "command",
        "inputs",
        "outputs",
        "status",
        "related_tool_call_id",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.action_id, `${path}.action_id`, context);
  validateTimestamp(value.timestamp, `${path}.timestamp`, context);
  validateNonEmptyString(value.actor, `${path}.actor`, context);
  validateEnum(
    value.action_type,
    `${path}.action_type`,
    ACTION_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "action_type must be one of the allowed action types.",
    context,
  );
  validateTargetRef(value.target, `${path}.target`, context);
  validateNullableString(value.command, `${path}.command`, context);
  validateEnum(
    value.status,
    `${path}.status`,
    ACTION_STATUSES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "status must be one of the allowed action statuses.",
    context,
  );
  validateNullableString(value.related_tool_call_id, `${path}.related_tool_call_id`, context);
}

function validateToolCall(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "tool_calls[]",
      [
        "tool_call_id",
        "timestamp",
        "tool_name",
        "tool_type",
        "input_summary",
        "output_summary",
        "exit_code",
        "duration_ms",
        "sensitive_input_detected",
        "artifact_refs",
      ],
      [
        "tool_call_id",
        "timestamp",
        "tool_name",
        "tool_type",
        "input_summary",
        "output_summary",
        "exit_code",
        "duration_ms",
        "sensitive_input_detected",
        "artifact_refs",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.tool_call_id, `${path}.tool_call_id`, context);
  validateTimestamp(value.timestamp, `${path}.timestamp`, context);
  validateNonEmptyString(value.tool_name, `${path}.tool_name`, context);
  validateEnum(
    value.tool_type,
    `${path}.tool_type`,
    TOOL_CALL_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "tool_type must be one of the allowed tool call types.",
    context,
  );
  validateNullableString(value.input_summary, `${path}.input_summary`, context);
  validateNullableString(value.output_summary, `${path}.output_summary`, context);

  if (value.exit_code !== null) {
    validateInteger(value.exit_code, `${path}.exit_code`, context);
  }

  if (value.duration_ms !== null) {
    validateInteger(value.duration_ms, `${path}.duration_ms`, context, 0);
  }

  validateBoolean(value.sensitive_input_detected, `${path}.sensitive_input_detected`, context);
  validateStringArray(value.artifact_refs, `${path}.artifact_refs`, context);
}

function validateBlockedAction(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "blocked_actions[]",
      [
        "blocked_action_id",
        "timestamp",
        "attempted_action",
        "reason_code",
        "policy_ref",
        "severity",
        "human_review_required",
      ],
      [
        "blocked_action_id",
        "timestamp",
        "attempted_action",
        "reason_code",
        "policy_ref",
        "severity",
        "human_review_required",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.blocked_action_id, `${path}.blocked_action_id`, context);
  validateTimestamp(value.timestamp, `${path}.timestamp`, context);
  validateNonEmptyString(value.attempted_action, `${path}.attempted_action`, context);
  validateEnum(
    value.reason_code,
    `${path}.reason_code`,
    BLOCKED_ACTION_REASON_CODES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "reason_code must be one of the allowed blocked action reason codes.",
    context,
  );
  validateNullableString(value.policy_ref, `${path}.policy_ref`, context);
  validateEnum(
    value.severity,
    `${path}.severity`,
    SEVERITIES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "severity must be one of the allowed severity values.",
    context,
  );
  validateBoolean(value.human_review_required, `${path}.human_review_required`, context);
}

function validateArtifact(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "artifacts[]",
      [
        "artifact_id",
        "path",
        "artifact_type",
        "sha256",
        "size_bytes",
        "content_type",
        "description",
      ],
      [
        "artifact_id",
        "path",
        "artifact_type",
        "sha256",
        "size_bytes",
        "content_type",
        "description",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.artifact_id, `${path}.artifact_id`, context);
  validateNonEmptyString(value.path, `${path}.path`, context);
  validateEnum(
    value.artifact_type,
    `${path}.artifact_type`,
    ARTIFACT_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "artifact_type must be one of the allowed artifact types.",
    context,
  );
  validateSha256(value.sha256, `${path}.sha256`, context);
  validateInteger(value.size_bytes, `${path}.size_bytes`, context, 0);
  validateNonEmptyString(value.content_type, `${path}.content_type`, context);
  validateNonEmptyString(value.description, `${path}.description`, context);
}

function validateVerification(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "verification[]",
      [
        "verification_id",
        "verification_type",
        "status",
        "command",
        "artifact_refs",
        "coverage_note",
      ],
      [
        "verification_id",
        "verification_type",
        "status",
        "command",
        "artifact_refs",
        "coverage_note",
      ],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.verification_id, `${path}.verification_id`, context);
  validateEnum(
    value.verification_type,
    `${path}.verification_type`,
    VERIFICATION_TYPES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "verification_type must be one of the allowed verification types.",
    context,
  );
  validateEnum(
    value.status,
    `${path}.status`,
    VERIFICATION_STATUSES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "verification status must be one of the allowed values.",
    context,
  );
  validateNullableString(value.command, `${path}.command`, context);
  validateStringArray(value.artifact_refs, `${path}.artifact_refs`, context);
  validateNullableString(value.coverage_note, `${path}.coverage_note`, context);
}

function validatePolicyObservation(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "policy_observations[]",
      ["observation_id", "policy_ref", "status", "summary"],
      ["observation_id", "policy_ref", "status", "summary", "evidence_refs"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.observation_id, `${path}.observation_id`, context);
  validateNonEmptyString(value.policy_ref, `${path}.policy_ref`, context);
  validateEnum(
    value.status,
    `${path}.status`,
    POLICY_OBSERVATION_STATUSES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "policy observation status must be one of the allowed values.",
    context,
  );
  validateNonEmptyString(value.summary, `${path}.summary`, context);

  if ("evidence_refs" in value) {
    validateStringArray(value.evidence_refs, `${path}.evidence_refs`, context);
  }
}

function validateHumanReview(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "human_review",
      ["status", "reviewers"],
      ["status", "reviewers", "decision_note", "follow_up_actions"],
      context,
    )
  ) {
    return;
  }

  validateEnum(
    value.status,
    `${path}.status`,
    HUMAN_REVIEW_STATUSES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "human_review.status must be one of the allowed values.",
    context,
  );
  validateStringArray(value.reviewers, `${path}.reviewers`, context);

  if ("decision_note" in value) {
    validateNullableString(value.decision_note, `${path}.decision_note`, context);
  }

  if ("follow_up_actions" in value) {
    validateStringArray(value.follow_up_actions, `${path}.follow_up_actions`, context);
  }
}

function validateRiskSignal(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "risk_signals[]",
      ["signal_id", "category", "severity", "message", "evidence_refs", "recommended_action"],
      ["signal_id", "category", "severity", "message", "evidence_refs", "recommended_action"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.signal_id, `${path}.signal_id`, context);
  validateEnum(
    value.category,
    `${path}.category`,
    RISK_SIGNAL_CATEGORIES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "risk_signals[].category must be one of the allowed values.",
    context,
  );
  validateEnum(
    value.severity,
    `${path}.severity`,
    SEVERITIES,
    GUARD_VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE,
    "risk_signals[].severity must be one of the allowed values.",
    context,
  );
  validateNonEmptyString(value.message, `${path}.message`, context);
  validateStringArray(value.evidence_refs, `${path}.evidence_refs`, context);
  validateNonEmptyString(value.recommended_action, `${path}.recommended_action`, context);
}

function validateProvenance(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "provenance",
      [
        "source_pack_hash",
        "generated_at",
        "generated_by",
        "deterministic",
        "redaction_applied",
      ],
      [
        "source_pack_hash",
        "generated_at",
        "generated_by",
        "deterministic",
        "redaction_applied",
      ],
      context,
    )
  ) {
    return;
  }

  validateSha256(value.source_pack_hash, `${path}.source_pack_hash`, context);
  validateTimestamp(value.generated_at, `${path}.generated_at`, context);
  validateGeneratedBy(value.generated_by, `${path}.generated_by`, context);
  validateBoolean(value.deterministic, `${path}.deterministic`, context);
  validateBoolean(value.redaction_applied, `${path}.redaction_applied`, context);
}

function validateManifestFile(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (
    !validateObjectShape(
      value,
      path,
      "manifest.files[]",
      ["path", "sha256", "size_bytes"],
      ["path", "sha256", "size_bytes"],
      context,
    )
  ) {
    return;
  }

  validateNonEmptyString(value.path, `${path}.path`, context);
  validateSha256(value.sha256, `${path}.sha256`, context);
  validateInteger(value.size_bytes, `${path}.size_bytes`, context, 0);
}

function validateManifest(value: unknown, path: string, context: ValidationContext): void {
  if (
    !validateObjectShape(
      value,
      path,
      "manifest",
      ["files", "completeness"],
      ["files", "completeness"],
      context,
    )
  ) {
    return;
  }

  if (!Array.isArray(value.files)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_MANIFEST,
      `${path}.files`,
      "manifest.files must be an array.",
      { receivedType: typeof value.files },
    );
  } else {
    value.files.forEach((file, index) => {
      validateManifestFile(file, `${path}.files[${index}]`, context);
    });
  }

  if (typeof value.completeness !== "string") {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_MANIFEST,
      `${path}.completeness`,
      "manifest.completeness must be a string.",
      { receivedType: typeof value.completeness },
    );
    return;
  }

  if (!MANIFEST_COMPLETENESS.has(value.completeness)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_MANIFEST,
      `${path}.completeness`,
      "manifest.completeness must be one of the allowed completeness values.",
      { receivedValue: value.completeness, allowedValues: [...MANIFEST_COMPLETENESS] },
    );
    return;
  }

  if (value.completeness === "partial" || value.completeness === "incomplete") {
    addWarning(
      context,
      GUARD_VALIDATION_WARNING_CODES.PARTIAL_MANIFEST,
      `${path}.completeness`,
      "Manifest completeness indicates the pack may omit some evidence files.",
      { completeness: value.completeness },
    );
  }

  if (value.completeness === "unknown") {
    addWarning(
      context,
      GUARD_VALIDATION_WARNING_CODES.UNKNOWN_MANIFEST_COMPLETENESS,
      `${path}.completeness`,
      "Manifest completeness is unknown.",
    );
  }
}

function validateExtensions(
  value: unknown,
  path: string,
  context: ValidationContext,
): void {
  if (!isPlainObject(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_OBJECT_FIELD,
      path,
      "extensions must be an object when present.",
      { receivedType: Array.isArray(value) ? "array" : typeof value },
    );
  }
}

function validateArrayField(
  value: unknown,
  path: string,
  warningCode: GuardValidationWarning["code"],
  warningMessage: string,
  itemValidator: (entry: unknown, itemPath: string, context: ValidationContext) => void,
  context: ValidationContext,
): void {
  if (!Array.isArray(value)) {
    addError(
      context,
      GUARD_VALIDATION_ERROR_CODES.INVALID_ARRAY_FIELD,
      path,
      "Field must be an array.",
      { receivedType: typeof value },
    );
    return;
  }

  if (value.length === 0) {
    addWarning(context, warningCode, path, warningMessage);
    return;
  }

  value.forEach((entry, index) => itemValidator(entry, `${path}[${index}]`, context));
}

export function validateEvidencePack(pack: EvidencePackV1 | unknown): ValidationResult {
  const context: ValidationContext = { errors: [], warnings: [] };

  if (!isPlainObject(pack)) {
    return {
      ok: false,
      errors: [
        createValidationError(
          GUARD_VALIDATION_ERROR_CODES.INVALID_INPUT_TYPE,
          "$",
          "Evidence Pack must be a parsed object.",
          { receivedType: Array.isArray(pack) ? "array" : typeof pack },
        ),
      ],
      warnings: [],
    };
  }

  for (const field of TOP_LEVEL_REQUIRED_FIELDS) {
    if (!(field in pack)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.MISSING_REQUIRED_FIELD,
        `$.${field}`,
        `Missing required top-level field '${field}'.`,
      );
    }
  }

  for (const key of Object.keys(pack)) {
    if (!TOP_LEVEL_ALLOWED_FIELDS.has(key)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_OBJECT_FIELD,
        `$.${key}`,
        `Unexpected top-level field '${key}'.`,
      );
    }
  }

  if ("schema_version" in pack) {
    if (typeof pack.schema_version !== "string") {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_SCHEMA_VERSION,
        "$.schema_version",
        "schema_version must be a string.",
        { receivedType: Array.isArray(pack.schema_version) ? "array" : typeof pack.schema_version },
      );
    } else if (pack.schema_version !== "1.0.0") {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_SCHEMA_VERSION,
        "$.schema_version",
        "schema_version must be '1.0.0'.",
        { receivedValue: pack.schema_version },
      );
    }
  }

  if ("pack_id" in pack) {
    validateNonEmptyString(pack.pack_id, "$.pack_id", context);
  }

  if ("pack_type" in pack) {
    validateEnum(
      pack.pack_type,
      "$.pack_type",
      PACK_TYPES,
      GUARD_VALIDATION_ERROR_CODES.INVALID_PACK_TYPE,
      "pack_type must be one of the allowed Evidence Pack types.",
      context,
    );
  }

  if ("created_at" in pack) {
    validateTimestamp(pack.created_at, "$.created_at", context);
  }

  if ("producer" in pack) {
    validateProducer(pack.producer, "$.producer", context);
  }

  if ("workflow" in pack) {
    validateWorkflow(pack.workflow, "$.workflow", context);
  }

  if ("authority" in pack) {
    validateAuthority(pack.authority, "$.authority", context);
  }

  if ("runtime" in pack) {
    validateRuntime(pack.runtime, "$.runtime", context);
  }

  if ("intent" in pack) {
    validateIntent(pack.intent, "$.intent", context);
  }

  if ("scope" in pack) {
    validateScope(pack.scope, "$.scope", context);
  }

  if ("plan" in pack) {
    validatePlan(pack.plan, "$.plan", context);
  }

  if ("actions" in pack) {
    validateArrayField(
      pack.actions,
      "$.actions",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_ACTIONS,
      "actions is empty.",
      validateAction,
      context,
    );
  }

  if ("tool_calls" in pack) {
    validateArrayField(
      pack.tool_calls,
      "$.tool_calls",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_TOOL_CALLS,
      "tool_calls is empty.",
      validateToolCall,
      context,
    );
  }

  if ("blocked_actions" in pack) {
    validateArrayField(
      pack.blocked_actions,
      "$.blocked_actions",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_BLOCKED_ACTIONS,
      "blocked_actions is empty.",
      validateBlockedAction,
      context,
    );
  }

  if ("artifacts" in pack) {
    validateArrayField(
      pack.artifacts,
      "$.artifacts",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_ARTIFACTS,
      "artifacts is empty.",
      validateArtifact,
      context,
    );
  }

  if ("verification" in pack) {
    validateArrayField(
      pack.verification,
      "$.verification",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_VERIFICATION,
      "verification is empty.",
      validateVerification,
      context,
    );
  }

  if ("policy_observations" in pack) {
    if (!Array.isArray(pack.policy_observations)) {
      addError(
        context,
        GUARD_VALIDATION_ERROR_CODES.INVALID_ARRAY_FIELD,
        "$.policy_observations",
        "policy_observations must be an array when present.",
        { receivedType: typeof pack.policy_observations },
      );
    } else {
      pack.policy_observations.forEach((entry, index) => {
        validatePolicyObservation(entry, `$.policy_observations[${index}]`, context);
      });
    }
  }

  if ("human_review" in pack) {
    validateHumanReview(pack.human_review, "$.human_review", context);
  }

  if ("risk_signals" in pack) {
    validateArrayField(
      pack.risk_signals,
      "$.risk_signals",
      GUARD_VALIDATION_WARNING_CODES.EMPTY_RISK_SIGNALS,
      "risk_signals is empty.",
      validateRiskSignal,
      context,
    );
  }

  if ("provenance" in pack) {
    validateProvenance(pack.provenance, "$.provenance", context);
  }

  if ("manifest" in pack) {
    validateManifest(pack.manifest, "$.manifest", context);
  }

  if ("extensions" in pack) {
    validateExtensions(pack.extensions, "$.extensions", context);
  }

  if (context.errors.length > 0) {
    return {
      ok: false,
      errors: context.errors,
      warnings: context.warnings,
    };
  }

  return {
    ok: true,
    warnings: context.warnings,
  };
}
