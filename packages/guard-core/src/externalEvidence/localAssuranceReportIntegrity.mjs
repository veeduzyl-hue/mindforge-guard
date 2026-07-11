import { createHash } from "node:crypto";

const DIGEST_ALGORITHM = "sha256";
const DIGEST_ENCODING = "hex";
const CANONICALIZATION_PROFILE = "guard-local-assurance-report-v0.1";
const COVERED_ARTIFACT_TYPE = "assurance_report";
const INTEGRITY_REFERENCE_PREFIX = "guard-local-integrity://assurance-report/v0.1";

export function createAssuranceReportIntegrityReference(report) {
  const projectedReport = projectAssuranceReportContent(report);
  const canonicalContent = canonicalizeProjectedValue(projectedReport);
  const digest = createHash(DIGEST_ALGORITHM)
    .update(canonicalContent, "utf8")
    .digest(DIGEST_ENCODING);

  return {
    digest,
    digest_algorithm: DIGEST_ALGORITHM,
    integrity_ref: buildIntegrityReference(projectedReport),
  };
}

export function verifyAssuranceReportIntegrity(report) {
  const assuranceReport = expectPlainObject(report, "report");
  const ownDescriptors = getOwnPropertyDescriptors(
    assuranceReport,
    "report"
  );
  const integrityDescriptor = ownDescriptors.report_integrity;

  if (!integrityDescriptor) {
    throw new TypeError(
      "report.report_integrity must be declared as an own data property"
    );
  }

  const declaredIntegrity = expectDeclaredIntegrityReference(
    integrityDescriptor.value,
    "report.report_integrity",
    assuranceReport
  );
  const actualIntegrity = createAssuranceReportIntegrityReference(assuranceReport);

  return {
    matches: declaredIntegrity.normalizedDigest === actualIntegrity.digest,
    algorithm: DIGEST_ALGORITHM,
    expectedDigest: declaredIntegrity.normalizedDigest,
    actualDigest: actualIntegrity.digest,
  };
}

export function canonicalizeAssuranceReport(report) {
  return canonicalizeProjectedValue(projectAssuranceReportContent(report));
}

function projectAssuranceReportContent(report) {
  const assuranceReport = expectPlainObject(report, "report");
  const ownDescriptors = getOwnPropertyDescriptors(
    assuranceReport,
    "report"
  );
  const projectedReport = {};

  for (const key of Object.keys(ownDescriptors)) {
    if (key === "report_integrity") {
      continue;
    }

    const descriptor = ownDescriptors[key];
    if (!descriptor.enumerable) {
      continue;
    }

    projectedReport[key] = descriptor.value;
  }

  return projectedReport;
}

function canonicalizeProjectedValue(value) {
  return serializeCanonicalValue(value, "report", new Set());
}

function serializeCanonicalValue(value, path, ancestors) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return serializeArray(value, path, ancestors);
  }

  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "boolean":
      return value ? "true" : "false";
    case "number":
      if (!Number.isFinite(value)) {
        throw new TypeError(
          `unsupported canonical report value at ${path}: non-finite number`
        );
      }
      return JSON.stringify(value);
    case "object":
      return serializePlainObject(value, path, ancestors);
    case "undefined":
      throw new TypeError(
        `unsupported canonical report value at ${path}: undefined`
      );
    case "function":
      throw new TypeError(
        `unsupported canonical report value at ${path}: function`
      );
    case "symbol":
      throw new TypeError(
        `unsupported canonical report value at ${path}: symbol`
      );
    case "bigint":
      throw new TypeError(
        `unsupported canonical report value at ${path}: bigint`
      );
    default:
      throw new TypeError(
        `unsupported canonical report value at ${path}: unsupported value`
      );
  }
}

function serializeArray(value, path, ancestors) {
  if (ancestors.has(value)) {
    throw new TypeError(
      `unsupported canonical report value at ${path}: cyclic reference`
    );
  }

  ancestors.add(value);

  try {
    return `[${value
      .map((entry, index) =>
        serializeCanonicalValue(entry, `${path}[${index}]`, ancestors)
      )
      .join(",")}]`;
  } finally {
    ancestors.delete(value);
  }
}

function serializePlainObject(value, path, ancestors) {
  if (!isPlainObject(value)) {
    throw new TypeError(
      `unsupported canonical report value at ${path}: non-plain object`
    );
  }

  if (ancestors.has(value)) {
    throw new TypeError(
      `unsupported canonical report value at ${path}: cyclic reference`
    );
  }

  ancestors.add(value);

  try {
    const descriptors = getOwnPropertyDescriptors(value, path);
    const entries = Object.keys(descriptors)
      .sort()
      .map((key) => {
        const descriptor = descriptors[key];
        if (!descriptor.enumerable) {
          return null;
        }

        const entry = descriptor.value;
        return `${JSON.stringify(key)}:${serializeCanonicalValue(
          entry,
          `${path}.${key}`,
          ancestors
        )}`;
      })
      .filter((entry) => entry !== null);

    return `{${entries.join(",")}}`;
  } finally {
    ancestors.delete(value);
  }
}

function buildIntegrityReference(report) {
  const parameters = [
    `artifact=${encodeURIComponent(COVERED_ARTIFACT_TYPE)}`,
    `report_id=${encodeURIComponent(
      expectString(report.report_id, "report.report_id")
    )}`,
    `verification_id=${encodeURIComponent(
      expectString(report.verification_id, "report.verification_id")
    )}`,
    `canonicalization=${encodeURIComponent(CANONICALIZATION_PROFILE)}`,
    `digest_encoding=${encodeURIComponent(DIGEST_ENCODING)}`,
  ];

  return `${INTEGRITY_REFERENCE_PREFIX}?${parameters.join("&")}`;
}

function expectDeclaredIntegrityReference(value, label, report) {
  const reference = expectPlainObject(value, label);
  const descriptors = getOwnPropertyDescriptors(reference, label);
  const digest = expectString(reference.digest, `${label}.digest`);
  const digestAlgorithm = expectString(
    reference.digest_algorithm,
    `${label}.digest_algorithm`
  );
  const integrityRef = expectString(
    reference.integrity_ref,
    `${label}.integrity_ref`
  );

  if (digestAlgorithm !== DIGEST_ALGORITHM) {
    throw new TypeError(`${label}.digest_algorithm must be ${DIGEST_ALGORITHM}`);
  }

  if (!/^[0-9a-fA-F]{64}$/.test(digest)) {
    throw new TypeError(
      `${label}.digest must be a 64-character hexadecimal SHA-256 digest`
    );
  }

  if (Object.keys(descriptors).sort().join(",") !== "digest,digest_algorithm,integrity_ref") {
    throw new TypeError(
      `${label} must contain only digest, digest_algorithm, and integrity_ref`
    );
  }

  if (!integrityRef.startsWith(`${INTEGRITY_REFERENCE_PREFIX}?`)) {
    throw new TypeError(
      `${label}.integrity_ref must use the local assurance report integrity reference format`
    );
  }

  const declaration = parseIntegrityDeclaration(integrityRef, label);

  if (declaration.artifact !== COVERED_ARTIFACT_TYPE) {
    throw new TypeError(
      `${label}.integrity_ref must declare artifact=${COVERED_ARTIFACT_TYPE}`
    );
  }

  if (declaration.canonicalization !== CANONICALIZATION_PROFILE) {
    throw new TypeError(
      `${label}.integrity_ref must declare canonicalization=${CANONICALIZATION_PROFILE}`
    );
  }

  if (declaration.digestEncoding !== DIGEST_ENCODING) {
    throw new TypeError(
      `${label}.integrity_ref must declare digest_encoding=${DIGEST_ENCODING}`
    );
  }

  if (declaration.reportId !== expectString(report.report_id, "report.report_id")) {
    throw new TypeError(
      `${label}.integrity_ref report_id must match report.report_id`
    );
  }

  if (
    declaration.verificationId !==
    expectString(report.verification_id, "report.verification_id")
  ) {
    throw new TypeError(
      `${label}.integrity_ref verification_id must match report.verification_id`
    );
  }

  return {
    digest,
    normalizedDigest: digest.toLowerCase(),
    digest_algorithm: digestAlgorithm,
    integrity_ref: integrityRef,
  };
}

function expectPlainObject(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be a plain object`);
  }

  return value;
}

function expectString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${label} must be a non-empty string`);
  }

  return value;
}

function isPlainObject(value) {
  const prototype = Object.getPrototypeOf(value);

  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (prototype === Object.prototype || prototype === null)
  );
}

function getOwnPropertyDescriptors(value, path) {
  const symbolKeys = Object.getOwnPropertySymbols(value);
  if (symbolKeys.length > 0) {
    throw new TypeError(
      `unsupported canonical report value at ${path}: symbol-keyed property`
    );
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === "toJSON") {
      throw new TypeError(
        `unsupported canonical report value at ${path}: toJSON property is not supported`
      );
    }

    if ("get" in descriptor || "set" in descriptor) {
      if (
        typeof descriptor.get === "function" ||
        typeof descriptor.set === "function"
      ) {
        throw new TypeError(
          `unsupported canonical report value at ${path}.${key}: accessor property`
        );
      }
    }

    if (descriptor.value === undefined && descriptor.enumerable) {
      throw new TypeError(
        `unsupported canonical report value at ${path}.${key}: undefined`
      );
    }
  }

  return descriptors;
}

function parseIntegrityDeclaration(integrityRef, label) {
  const query = integrityRef.slice(INTEGRITY_REFERENCE_PREFIX.length + 1);
  const searchParams = new URLSearchParams(query);
  const artifact = expectIntegrityDeclarationValue(
    searchParams.get("artifact"),
    `${label}.integrity_ref artifact`
  );
  const reportId = expectIntegrityDeclarationValue(
    searchParams.get("report_id"),
    `${label}.integrity_ref report_id`
  );
  const verificationId = expectIntegrityDeclarationValue(
    searchParams.get("verification_id"),
    `${label}.integrity_ref verification_id`
  );
  const canonicalization = expectIntegrityDeclarationValue(
    searchParams.get("canonicalization"),
    `${label}.integrity_ref canonicalization`
  );
  const digestEncoding = expectIntegrityDeclarationValue(
    searchParams.get("digest_encoding"),
    `${label}.integrity_ref digest_encoding`
  );

  if (searchParams.size !== 5) {
    throw new TypeError(
      `${label}.integrity_ref must declare only artifact, report_id, verification_id, canonicalization, and digest_encoding`
    );
  }

  return {
    artifact,
    reportId,
    verificationId,
    canonicalization,
    digestEncoding,
  };
}

function expectIntegrityDeclarationValue(value, label) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${label} is required`);
  }

  return value;
}
