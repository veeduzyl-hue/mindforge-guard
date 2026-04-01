import {
  buildLicenseGateResult,
  EXIT_LICENSE_REQUIRED,
} from "../packages/guard/src/product/license_gate.mjs";

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const missingGate = buildLicenseGateResult({
  lic: { kind: "missing" },
  requiredEdition: "pro",
  feature: "drift_timeline",
});

expect(missingGate, "missing license should be gated");
expect(missingGate.exitCode === EXIT_LICENSE_REQUIRED, "missing license should exit 21");
expect(missingGate.payload.error.kind === "license_required", "missing license should return license_required");
expect(missingGate.payload.error.license_state === "missing", "missing license state mismatch");
expect(missingGate.payload.error.required_edition === "pro", "required edition mismatch for missing license");

const expiredGate = buildLicenseGateResult({
  lic: { kind: "expired", edition: "pro", not_after: "2026-03-31T00:00:00Z" },
  requiredEdition: "pro",
  feature: "drift_timeline",
});

expect(expiredGate, "expired license should be gated");
expect(expiredGate.payload.error.kind === "license_required", "expired license should return license_required");
expect(expiredGate.payload.error.license_state === "expired", "expired license state mismatch");

const notYetValidGate = buildLicenseGateResult({
  lic: { kind: "not_yet_valid", edition: "pro", not_before: "2026-04-02T00:00:00Z" },
  requiredEdition: "pro",
  feature: "drift_timeline",
});

expect(notYetValidGate, "not_yet_valid license should be gated");
expect(
  notYetValidGate.payload.error.kind === "license_required",
  "not_yet_valid license should return license_required"
);
expect(
  notYetValidGate.payload.error.license_state === "not_yet_valid",
  "not_yet_valid license state mismatch"
);

const mismatchGate = buildLicenseGateResult({
  lic: { kind: "ok", edition: "pro" },
  requiredEdition: "pro_plus",
  feature: "drift_compare",
});

expect(mismatchGate, "insufficient valid edition should be gated");
expect(mismatchGate.exitCode === EXIT_LICENSE_REQUIRED, "edition mismatch should exit 21");
expect(mismatchGate.payload.error.kind === "edition_mismatch", "edition mismatch kind mismatch");
expect(mismatchGate.payload.error.license_state === "valid", "edition mismatch license_state mismatch");
expect(mismatchGate.payload.error.current_edition === "pro", "edition mismatch current edition mismatch");
expect(
  mismatchGate.payload.error.required_edition === "pro_plus",
  "edition mismatch required edition mismatch"
);

const enterpriseAllowed = buildLicenseGateResult({
  lic: { kind: "ok", edition: "enterprise" },
  requiredEdition: "pro_plus",
  feature: "assoc_correlate",
});

expect(enterpriseAllowed === null, "enterprise should satisfy pro_plus feature gating");

process.stdout.write("commercial edition boundary verified\n");
