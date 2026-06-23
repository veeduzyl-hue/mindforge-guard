export const GUARD_VALIDATION_ERROR_CODES = {
  INVALID_JSON: "INVALID_JSON",
  INVALID_INPUT_TYPE: "INVALID_INPUT_TYPE",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_SCHEMA_VERSION: "INVALID_SCHEMA_VERSION",
  INVALID_PACK_TYPE: "INVALID_PACK_TYPE",
  INVALID_FIELD_TYPE: "INVALID_FIELD_TYPE",
  INVALID_ENUM_VALUE: "INVALID_ENUM_VALUE",
  INVALID_TIMESTAMP: "INVALID_TIMESTAMP",
  INVALID_ARRAY_FIELD: "INVALID_ARRAY_FIELD",
  INVALID_OBJECT_FIELD: "INVALID_OBJECT_FIELD",
  INVALID_MANIFEST: "INVALID_MANIFEST",
  UNKNOWN_VALIDATION_ERROR: "UNKNOWN_VALIDATION_ERROR",
} as const;

export type GuardValidationErrorCode =
  (typeof GUARD_VALIDATION_ERROR_CODES)[keyof typeof GUARD_VALIDATION_ERROR_CODES];

export const GUARD_VALIDATION_WARNING_CODES = {
  EMPTY_ACTIONS: "EMPTY_ACTIONS",
  EMPTY_TOOL_CALLS: "EMPTY_TOOL_CALLS",
  EMPTY_ARTIFACTS: "EMPTY_ARTIFACTS",
  EMPTY_VERIFICATION: "EMPTY_VERIFICATION",
  EMPTY_BLOCKED_ACTIONS: "EMPTY_BLOCKED_ACTIONS",
  EMPTY_RISK_SIGNALS: "EMPTY_RISK_SIGNALS",
  PARTIAL_MANIFEST: "PARTIAL_MANIFEST",
  UNKNOWN_MANIFEST_COMPLETENESS: "UNKNOWN_MANIFEST_COMPLETENESS",
} as const;

export type GuardValidationWarningCode =
  (typeof GUARD_VALIDATION_WARNING_CODES)[keyof typeof GUARD_VALIDATION_WARNING_CODES];

export interface GuardValidationError {
  code: GuardValidationErrorCode;
  path: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface GuardValidationWarning {
  code: GuardValidationWarningCode;
  path: string;
  message: string;
  details?: Record<string, unknown>;
}

export function createValidationError(
  code: GuardValidationErrorCode,
  path: string,
  message: string,
  details?: Record<string, unknown>,
): GuardValidationError {
  return { code, path, message, details };
}

export function createValidationWarning(
  code: GuardValidationWarningCode,
  path: string,
  message: string,
  details?: Record<string, unknown>,
): GuardValidationWarning {
  return { code, path, message, details };
}
