import crypto from "node:crypto";

import {
  GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY,
  GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION,
  GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS,
  GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS,
  assertValidSecondConsumerReadinessProfile,
} from "./readiness.mjs";

export const SECOND_CONSUMER_CONTRACT_KIND = "governance_second_consumer_contract";
export const SECOND_CONSUMER_CONTRACT_VERSION = "v1";
export const SECOND_CONSUMER_CONTRACT_STABILITY =
  GOVERNANCE_SECOND_CONSUMER_READINESS_STABILITY;
export const SECOND_CONSUMER_CONTRACT_ID = "second_consumer_pilot";
export const SECOND_CONSUMER_CONTRACT_SURFACE = "guard.second_consumer_pilot";
export const SECOND_CONSUMER_CONTRACT_MODE = "explicit_file_input";
export const SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS,
]);
export const SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS,
]);
export const SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS,
]);
export const SECOND_CONSUMER_CONTRACT_MINIMAL_INPUTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS,
]);
export const SECOND_CONSUMER_CONTRACT_NEUTRAL_INPUTS = Object.freeze([
  ...GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS,
]);
export const SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS = Object.freeze([
  "consumer",
  "governance",
  "readiness",
  "dependencies",
  "contracts",
]);
export const SECOND_CONSUMER_CONTRACT_INVOCATION_FLAGS = Object.freeze([
  "--permit-gate-result-in",
  "--governance-decision-record-in",
  "--governance-activation-record-in",
  "--governance-outcome-bundle-in",
  "--governance-application-record-in",
  "--governance-disposition-in",
  "--governance-receipt-in",
  "--out",
  "--pretty",
  "--help",
]);
export const SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING = "utf8";
export const SECOND_CONSUMER_CONTRACT_OUTPUT_EOL = "\n";
export const SECOND_CONSUMER_CONTRACT_PRETTY_INDENT = 2;
export const SECOND_CONSUMER_CONTRACT_OUTPUT_MODE = "atomic_replace";
export const SECOND_CONSUMER_CONTRACT_REPLAY_SAFETY = "same_inputs_same_summary";
export const SECOND_CONSUMER_CONTRACT_EXIT_SUCCESS = 0;
export const SECOND_CONSUMER_CONTRACT_EXIT_FAILURE = 1;
export const SECOND_CONSUMER_CONTRACT_HELP_EXIT = 0;
export const SECOND_CONSUMER_CONTRACT_STDOUT_MODE = "help_or_summary";
export const SECOND_CONSUMER_CONTRACT_STDERR_MODE = "single_line_error";
export const SECOND_CONSUMER_CONTRACT_OUTPUT_WRITE_RULE = "write_only_on_success";
export const SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE = Object.freeze({
  consumer: Object.freeze(["consumer_id", "surface", "mode", "non_audit"]),
  governance: Object.freeze([
    "canonical_action_hash",
    "decision",
    "source_decision",
    "exit_code",
  ]),
  readiness: Object.freeze([
    "profile_version",
    "required_artifacts",
    "optional_artifacts_present",
    "neutral_artifacts",
    "audit_bound_artifacts_excluded",
    "minimal_artifacts",
    "minimal_ready",
    "consumer_neutral_only",
  ]),
  dependencies: Object.freeze([
    "provided_artifacts",
    "allowed_optional_artifacts",
    "activation_enabled_paths",
    "audit_bound_paths_present",
    "dependency_rules_checked",
  ]),
  contracts: Object.freeze([
    "decision_record_surface",
    "activation_record_surface",
  ]),
});

export const SECOND_CONSUMER_CONTRACT_STABLE_EXPORT_SET = Object.freeze([
  "SECOND_CONSUMER_CONTRACT_KIND",
  "SECOND_CONSUMER_CONTRACT_VERSION",
  "SECOND_CONSUMER_CONTRACT_STABILITY",
  "SECOND_CONSUMER_CONTRACT_ID",
  "SECOND_CONSUMER_CONTRACT_SURFACE",
  "SECOND_CONSUMER_CONTRACT_MODE",
  "SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS",
  "SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS",
  "SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS",
  "SECOND_CONSUMER_CONTRACT_MINIMAL_INPUTS",
  "SECOND_CONSUMER_CONTRACT_NEUTRAL_INPUTS",
  "SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS",
  "SECOND_CONSUMER_CONTRACT_INVOCATION_FLAGS",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_EOL",
  "SECOND_CONSUMER_CONTRACT_PRETTY_INDENT",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_MODE",
  "SECOND_CONSUMER_CONTRACT_REPLAY_SAFETY",
  "SECOND_CONSUMER_CONTRACT_EXIT_SUCCESS",
  "SECOND_CONSUMER_CONTRACT_EXIT_FAILURE",
  "SECOND_CONSUMER_CONTRACT_HELP_EXIT",
  "SECOND_CONSUMER_CONTRACT_STDOUT_MODE",
  "SECOND_CONSUMER_CONTRACT_STDERR_MODE",
  "SECOND_CONSUMER_CONTRACT_OUTPUT_WRITE_RULE",
  "SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE",
  "SECOND_CONSUMER_CONTRACT_STABLE_EXPORT_SET",
  "validateSecondConsumerContract",
  "assertValidSecondConsumerContract",
  "validateSecondConsumerSummary",
  "assertValidSecondConsumerSummary",
  "serializeSecondConsumerSummary",
  "computeSecondConsumerSummaryHash",
]);

export function validateSecondConsumerContract() {
  const errors = [];

  assertValidSecondConsumerReadinessProfile();

  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_REQUIRED_ARTIFACTS)
  ) {
    errors.push("second consumer contract required inputs drifted from readiness");
  }
  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_OPTIONAL_ARTIFACTS)
  ) {
    errors.push("second consumer contract optional inputs drifted from readiness");
  }
  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_AUDIT_BOUND_ARTIFACTS)
  ) {
    errors.push("second consumer contract excluded inputs drifted from readiness");
  }
  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_MINIMAL_INPUTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_MINIMAL_ARTIFACTS)
  ) {
    errors.push("second consumer contract minimal inputs drifted from readiness");
  }
  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_NEUTRAL_INPUTS) !==
    JSON.stringify(GOVERNANCE_SECOND_CONSUMER_NEUTRAL_ARTIFACTS)
  ) {
    errors.push("second consumer contract neutral inputs drifted from readiness");
  }
  if (
    JSON.stringify(SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS) !==
    JSON.stringify(Object.keys(SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE))
  ) {
    errors.push("second consumer contract summary section order drifted");
  }

  for (const list of [
    SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS,
    SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS,
    SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS,
    SECOND_CONSUMER_CONTRACT_MINIMAL_INPUTS,
    SECOND_CONSUMER_CONTRACT_NEUTRAL_INPUTS,
    SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS,
    SECOND_CONSUMER_CONTRACT_INVOCATION_FLAGS,
  ]) {
    if (new Set(list).size !== list.length) {
      errors.push("second consumer contract contains duplicate stable entries");
    }
  }

  if (
    new Set(SECOND_CONSUMER_CONTRACT_STABLE_EXPORT_SET).size !==
    SECOND_CONSUMER_CONTRACT_STABLE_EXPORT_SET.length
  ) {
    errors.push("second consumer contract stable export set contains duplicates");
  }

  for (const section of SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS) {
    const requiredFields = SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE[section];
    if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
      errors.push(`second consumer contract summary section ${section} must declare fields`);
      continue;
    }
    if (new Set(requiredFields).size !== requiredFields.length) {
      errors.push(`second consumer contract summary section ${section} contains duplicate fields`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidSecondConsumerContract() {
  const result = validateSecondConsumerContract();
  if (result.ok) {
    return {
      kind: SECOND_CONSUMER_CONTRACT_KIND,
      version: SECOND_CONSUMER_CONTRACT_VERSION,
      surface: SECOND_CONSUMER_CONTRACT_SURFACE,
    };
  }

  const err = new Error(`second consumer contract invalid: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}

export function validateSecondConsumerSummary(summary) {
  const errors = [];

  assertValidSecondConsumerContract();

  if (!summary || typeof summary !== "object" || Array.isArray(summary)) {
    errors.push("second consumer summary must be an object");
    return { ok: false, errors };
  }

  for (const section of SECOND_CONSUMER_CONTRACT_SUMMARY_SECTIONS) {
    const sectionValue = summary[section];
    if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) {
      errors.push(`second consumer summary must include object section ${section}`);
      continue;
    }
    for (const field of SECOND_CONSUMER_CONTRACT_SUMMARY_SHAPE[section]) {
      if (!(field in sectionValue)) {
        errors.push(`second consumer summary section ${section} is missing field ${field}`);
      }
    }
  }

  if (summary.consumer) {
    if (summary.consumer.consumer_id !== SECOND_CONSUMER_CONTRACT_ID) {
      errors.push("second consumer summary consumer_id drifted");
    }
    if (summary.consumer.surface !== SECOND_CONSUMER_CONTRACT_SURFACE) {
      errors.push("second consumer summary surface drifted");
    }
    if (summary.consumer.mode !== SECOND_CONSUMER_CONTRACT_MODE) {
      errors.push("second consumer summary mode drifted");
    }
    if (summary.consumer.non_audit !== true) {
      errors.push("second consumer summary must remain non-audit");
    }
  }

  if (summary.readiness) {
    if (
      JSON.stringify(summary.readiness.required_artifacts) !==
      JSON.stringify(SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS)
    ) {
      errors.push("second consumer summary required artifact set drifted");
    }
    if (
      JSON.stringify(summary.readiness.audit_bound_artifacts_excluded) !==
      JSON.stringify(SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS)
    ) {
      errors.push("second consumer summary excluded artifact set drifted");
    }
    if (
      JSON.stringify(summary.readiness.minimal_artifacts) !==
      JSON.stringify(SECOND_CONSUMER_CONTRACT_MINIMAL_INPUTS)
    ) {
      errors.push("second consumer summary minimal artifact set drifted");
    }
    if (
      JSON.stringify(summary.readiness.neutral_artifacts) !==
      JSON.stringify(SECOND_CONSUMER_CONTRACT_NEUTRAL_INPUTS)
    ) {
      errors.push("second consumer summary neutral artifact set drifted");
    }
    if (summary.readiness.profile_version !== GOVERNANCE_SECOND_CONSUMER_READINESS_VERSION) {
      errors.push("second consumer summary readiness profile version drifted");
    }
    if (summary.readiness.minimal_ready !== true) {
      errors.push("second consumer summary must preserve minimal_ready true");
    }
    if (summary.readiness.consumer_neutral_only !== true) {
      errors.push("second consumer summary must preserve consumer_neutral_only true");
    }
  }

  if (summary.dependencies) {
    if (
      JSON.stringify(summary.dependencies.allowed_optional_artifacts) !==
      JSON.stringify(SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS)
    ) {
      errors.push("second consumer summary allowed optional artifact set drifted");
    }
    if (summary.dependencies.dependency_rules_checked !== true) {
      errors.push("second consumer summary must preserve dependency_rules_checked true");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidSecondConsumerSummary(summary) {
  const result = validateSecondConsumerSummary(summary);
  if (result.ok) return summary;

  const err = new Error(`second consumer summary invalid: ${result.errors.join("; ")}`);
  err.validation = result;
  throw err;
}

export function serializeSecondConsumerSummary(summary, { pretty = false } = {}) {
  const validated = assertValidSecondConsumerSummary(summary);
  return (
    JSON.stringify(
      validated,
      null,
      pretty ? SECOND_CONSUMER_CONTRACT_PRETTY_INDENT : 0
    ) + SECOND_CONSUMER_CONTRACT_OUTPUT_EOL
  );
}

export function computeSecondConsumerSummaryHash(summary, { pretty = false } = {}) {
  const serialized = serializeSecondConsumerSummary(summary, { pretty });
  return `sha256:${crypto
    .createHash("sha256")
    .update(serialized, SECOND_CONSUMER_CONTRACT_OUTPUT_ENCODING)
    .digest("hex")}`;
}

export function formatSecondConsumerRuntimeError(error) {
  const message = error?.message || String(error);
  return `${message.replace(/[\r\n]+/g, " ").trim()}${SECOND_CONSUMER_CONTRACT_OUTPUT_EOL}`;
}
