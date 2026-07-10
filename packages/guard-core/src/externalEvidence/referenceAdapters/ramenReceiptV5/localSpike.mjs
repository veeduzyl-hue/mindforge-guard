export const RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID =
  "ramen-receipt-v5-local-spike";

const ADAPTER_VERSION = "0.1.0";
const SOURCE_TYPE = "runtime_receipt";
const REFERENCE_STATUS = "non_privileged_reference";
const BOUNDARY = "ramen issues. Guard verifies.";
const SAMPLE_NOTE = "documentation-only sample input";
const CRYPTO_NOTE = "cryptographic verification not performed";
const HASH_NOTE =
  "documentation-only local spike; payload hash computation not performed";
const SIGNATURE_NOTE =
  "documentation-only local spike; cryptographic verification not performed";
const SEVERITY_NOTE = "review significance, not runtime gate";
const REQUIRED_FIELDS = [
  "receipt_id",
  "receipt_version",
  "issuer",
  "issued_at",
  "payload_hash",
  "signature",
  "signing_algorithm",
];

export function createRamenReceiptV5LocalSpikeAdapter() {
  const identity = {
    adapter_name: RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID,
    adapter_version: ADAPTER_VERSION,
    source_type: SOURCE_TYPE,
    reference_status: REFERENCE_STATUS,
    boundary: BOUNDARY,
  };

  function parse(input) {
    const diagnostics = [];
    const limitations = createLimitations(input);

    if (!isPlainObject(input)) {
      diagnostics.push(
        createDiagnostic(
          "parse",
          "input_not_plain_object",
          "input",
          "input must be a plain object",
          "high"
        )
      );

      return {
        status: "parse_error",
        parsed: null,
        diagnostics,
        limitations,
      };
    }

    const parsed = {
      raw: cloneValue(input),
      receipt_id: stringOrUndefined(input.receipt_id),
      receipt_version: stringOrUndefined(input.receipt_version),
      issuer: stringOrUndefined(input.issuer),
      subject: stringOrUndefined(input.subject),
      issued_at: stringOrUndefined(input.issued_at),
      evidence_timestamp: stringOrUndefined(input.issued_at),
      signature: stringOrUndefined(input.signature),
      signing_algorithm: stringOrUndefined(input.signing_algorithm),
      signature_algorithm: stringOrUndefined(input.signing_algorithm),
      payload_hash: stringOrUndefined(input.payload_hash),
      policy_reference: stringOrUndefined(input.policy_reference),
      policy_ref: stringOrUndefined(input.policy_reference),
      evidence_references: arrayOfStrings(input.evidence_references),
      evidence_refs: arrayOfStrings(input.evidence_references),
      raw_payload_available: Boolean(input.raw_payload_available),
    };

    diagnostics.push(
      createDiagnostic(
        "parse",
        "receipt_object_parsed",
        "receipt_id",
        "documentation-only receipt object parsed for review",
        "info",
        parsed.receipt_id
      )
    );

    return {
      status: "parsed",
      parsed,
      diagnostics,
      limitations,
    };
  }

  function validate(parsedInput) {
    const diagnostics = [];
    const parsed = extractParsed(parsedInput);
    const limitations = mergeLimitations(parsedInput?.limitations, parsed);

    if (!parsed || !isPlainObject(parsed)) {
      diagnostics.push(
        createDiagnostic(
          "validate",
          "parsed_input_missing",
          "parsed",
          "parsed receipt data is required before validation",
          "high"
        )
      );

      return {
        status: "invalid",
        required_fields_present: [],
        missing_fields: REQUIRED_FIELDS.slice(),
        diagnostics,
        limitations,
      };
    }

    const required_fields_present = REQUIRED_FIELDS.filter((field) =>
      hasValue(parsed[field])
    );
    const missing_fields = REQUIRED_FIELDS.filter(
      (field) => !required_fields_present.includes(field)
    );

    if (missing_fields.length === 0) {
      diagnostics.push(
        createDiagnostic(
          "validate",
          "minimum_fields_present",
          "receipt",
          "minimum review fields are present",
          "info",
          parsed.receipt_id
        )
      );
    } else {
      diagnostics.push(
        createDiagnostic(
          "validate",
          "minimum_fields_missing",
          missing_fields[0],
          `missing minimum review fields: ${missing_fields.join(", ")}`,
          missing_fields.length > 2 ? "high" : "medium",
          parsed.receipt_id
        )
      );
    }

    return {
      status:
        missing_fields.length === 0
          ? "valid"
          : required_fields_present.length > 0
            ? "partial"
            : "invalid",
      required_fields_present,
      missing_fields,
      diagnostics,
      limitations,
    };
  }

  function verify(parsedInput, validationInput) {
    const diagnostics = [];
    const parsed = extractParsed(parsedInput);
    const validation = extractValidation(validationInput);
    const limitations = mergeLimitations(
      parsedInput?.limitations,
      parsed,
      validationInput?.limitations
    );

    if (!parsed || !validation) {
      diagnostics.push(
        createDiagnostic(
          "verify",
          "verification_inputs_missing",
          "verification",
          "parsed receipt data and validation result are required before verification",
          "high"
        )
      );

      return {
        status: "verification_error",
        integrity: {
          payload_hash_declared: false,
          payload_hash_verified: false,
          reason: HASH_NOTE,
        },
        signature: {
          signature_present: false,
          signing_algorithm: undefined,
          cryptographic_verification_performed: false,
          reason: SIGNATURE_NOTE,
        },
        timestamp: {
          issued_at_visible: false,
        },
        policy: {
          policy_reference_visible: false,
        },
        diagnostics,
        limitations,
      };
    }

    const payload_hash_declared = hasValue(parsed.payload_hash);
    const signature_present = hasValue(parsed.signature);
    const policy_reference_visible = hasValue(parsed.policy_reference);
    const issued_at_visible = hasValue(parsed.issued_at);

    diagnostics.push(
      createDiagnostic(
        "verify",
        "cryptographic_review_interpretation_only",
        "signature",
        CRYPTO_NOTE,
        "medium",
        parsed.receipt_id
      )
    );

    if (!signature_present) {
      diagnostics.push(
        createDiagnostic(
          "verify",
          "signature_missing_for_review",
          "signature",
          "signature field missing from review sample",
          "medium",
          parsed.receipt_id
        )
      );
    }

    return {
      status: "partially_verified",
      integrity: {
        payload_hash_declared,
        payload_hash_verified: false,
        reason: HASH_NOTE,
      },
      signature: {
        signature_present,
        signing_algorithm: parsed.signing_algorithm,
        cryptographic_verification_performed: false,
        reason: SIGNATURE_NOTE,
      },
      timestamp: {
        issued_at_visible,
      },
      policy: {
        policy_reference_visible,
      },
      contract_validation_status: validation.status,
      diagnostics,
      limitations,
    };
  }

  function normalize(parsedInput, validationInput, verificationInput) {
    const parsed = extractParsed(parsedInput);
    const validation = extractValidation(validationInput);
    const verification = extractVerification(verificationInput);
    const diagnostics = collectDiagnostics(
      parsedInput?.diagnostics,
      validationInput?.diagnostics,
      verificationInput?.diagnostics
    );
    const limitations = mergeLimitations(
      parsedInput?.limitations,
      parsed,
      validationInput?.limitations,
      verificationInput?.limitations
    );

    return {
      record_id: buildRecordId(parsed),
      source: {
        adapter_name: identity.adapter_name,
        adapter_version: identity.adapter_version,
        source_type: identity.source_type,
        reference_status: identity.reference_status,
      },
      receipt: {
        receipt_id: parsed?.receipt_id,
        receipt_version: parsed?.receipt_version,
      },
      subject: parsed?.subject,
      contract_validation: validation,
      verification,
      adapter: {
        limitations,
      },
      evidence: {
        raw_payload_available: Boolean(parsed?.raw_payload_available),
        evidence_references: parsed?.evidence_references ?? [],
      },
      diagnostics,
      review: {
        boundary: BOUNDARY,
      },
    };
  }

  function emitFindings(record, diagnosticsInput = []) {
    const diagnostics = Array.isArray(diagnosticsInput) ? diagnosticsInput : [];
    const findings = [];
    const contractStatus = record?.contract_validation?.status ?? "invalid";
    const policyVisible = Boolean(
      record?.verification?.policy?.policy_reference_visible
    );

    findings.push(
      createFinding(
        "receipt_parseable",
        "info",
        "review",
        "receipt sample parsed into a review artifact",
        "Use the normalized record for reviewer inspection."
      )
    );
    findings.push(
      createFinding(
        "contract_validation_status",
        contractStatus === "valid" ? "info" : "medium",
        "compatibility",
        `contract validation status: ${contractStatus}`,
        "Inspect any missing fields before relying on the review artifact."
      )
    );
    findings.push(
      createFinding(
        "signature_not_cryptographically_verified",
        "medium",
        "signature",
        CRYPTO_NOTE,
        "Treat signature presence as review context only."
      )
    );
    findings.push(
      createFinding(
        "payload_hash_not_computed",
        "medium",
        "integrity",
        HASH_NOTE,
        "Use separate review-scoped work before computing or comparing payload hashes."
      )
    );
    findings.push(
      createFinding(
        policyVisible ? "policy_reference_visible" : "policy_reference_missing",
        policyVisible ? "info" : "medium",
        "policy_reference",
        policyVisible
          ? "policy reference is visible for reviewer context"
          : "policy reference is missing from the review sample",
        policyVisible
          ? "Review the cited policy reference for context."
          : "Record the missing policy reference during review."
      )
    );
    findings.push(
      createFinding(
        "human_review_required",
        "high",
        "review",
        "human review remains required for this local spike output",
        "Review diagnostics and limitations before drawing conclusions."
      )
    );

    if (diagnostics.length > 0) {
      findings.push(
        createFinding(
          "diagnostics_present",
          "low",
          "adapter",
          `${diagnostics.length} diagnostic entries are available for review`,
          "Inspect diagnostic detail alongside findings."
        )
      );
    }

    return findings;
  }

  return {
    identity,
    parse,
    validate,
    verify,
    normalize,
    emitFindings,
  };
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function stringOrUndefined(value) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function arrayOfStrings(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}

function hasValue(value) {
  return typeof value === "string" ? value.trim() !== "" : value !== undefined;
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => cloneValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)])
    );
  }

  return value;
}

function createLimitations(input) {
  const raw_payload_available = Boolean(
    isPlainObject(input) && input.raw_payload_available
  );

  return {
    raw_payload_available,
    issuer_key_available: false,
    limitations: [
      SAMPLE_NOTE,
      CRYPTO_NOTE,
      "payload hash computation not performed",
      raw_payload_available
        ? "raw payload availability is declared by sample input"
        : "raw payload is not available in sample input",
    ],
  };
}

function mergeLimitations(...sources) {
  const limitations = [];
  let raw_payload_available = false;

  for (const source of sources) {
    if (!source) {
      continue;
    }

    if (typeof source.raw_payload_available === "boolean") {
      raw_payload_available = source.raw_payload_available;
    }

    const values = Array.isArray(source.limitations)
      ? source.limitations
      : Array.isArray(source.limitations?.limitations)
        ? source.limitations.limitations
        : [];

    for (const value of values) {
      if (typeof value === "string" && !limitations.includes(value)) {
        limitations.push(value);
      }
    }
  }

  if (!limitations.includes(SAMPLE_NOTE)) {
    limitations.push(SAMPLE_NOTE);
  }

  if (!limitations.includes(CRYPTO_NOTE)) {
    limitations.push(CRYPTO_NOTE);
  }

  return {
    raw_payload_available,
    issuer_key_available: false,
    limitations,
  };
}

function createDiagnostic(stage, code, field, message, severity, evidence_ref) {
  return {
    diagnostic_id: `${RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID}:${stage}:${code}`,
    stage,
    code,
    field,
    message,
    evidence_ref,
    severity,
  };
}

function collectDiagnostics(...diagnosticGroups) {
  return diagnosticGroups.flatMap((group) => (Array.isArray(group) ? group : []));
}

function extractParsed(value) {
  if (value && isPlainObject(value.parsed)) {
    return value.parsed;
  }

  return isPlainObject(value) ? value : null;
}

function extractValidation(value) {
  if (value && typeof value.status === "string") {
    return value;
  }

  return null;
}

function extractVerification(value) {
  if (value && typeof value.status === "string") {
    return value;
  }

  return {
    status: "verification_error",
    integrity: {
      payload_hash_declared: false,
      payload_hash_verified: false,
      reason: HASH_NOTE,
    },
    signature: {
      signature_present: false,
      signing_algorithm: undefined,
      cryptographic_verification_performed: false,
      reason: SIGNATURE_NOTE,
    },
    timestamp: {
      issued_at_visible: false,
    },
    policy: {
      policy_reference_visible: false,
    },
    diagnostics: [],
    limitations: mergeLimitations(),
  };
}

function buildRecordId(parsed) {
  return `${RAMEN_RECEIPT_V5_LOCAL_SPIKE_ID}:${parsed?.receipt_id ?? "unknown"}`;
}

function createFinding(
  finding_type,
  severity,
  category,
  message,
  recommendation
) {
  return {
    finding_type,
    severity,
    category,
    message,
    recommendation,
    boundary: BOUNDARY,
    severity_interpretation: SEVERITY_NOTE,
  };
}
