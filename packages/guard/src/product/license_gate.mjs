/**
 * Product-level commercial edition gating for monetized analytics surfaces.
 *
 * This module must stay:
 * - additive-only
 * - non-executing
 * - outside the audit main-path semantics
 */

import { normalizeEdition } from "./edition.mjs";

export const EXIT_LICENSE_REQUIRED = 21;

function tierNumFromEdition(edition) {
  const normalized = normalizeEdition(edition);
  if (normalized === "enterprise") return 3;
  if (normalized === "pro_plus") return 2;
  if (normalized === "pro") return 1;
  return 0;
}

function currentEditionFromLicense(lic) {
  if (!lic || lic.kind !== "ok") return normalizeEdition(lic?.edition || "community");
  return normalizeEdition(lic.edition);
}

function licenseState(lic) {
  return lic?.kind === "ok" ? "valid" : lic?.kind || "missing";
}

function installHint(requiredEdition) {
  return `Install a signed ${normalizeEdition(requiredEdition)} license file: guard license install <file>`;
}

/**
 * Returns:
 * - null when access is allowed
 * - { exitCode, stdout, payload } when the requested feature is gated
 */
export function buildLicenseGateResult({ lic, requiredEdition, feature }) {
  const required = normalizeEdition(requiredEdition);
  const currentEdition = currentEditionFromLicense(lic);
  const currentState = licenseState(lic);

  if (
    currentState === "valid" &&
    tierNumFromEdition(currentEdition) >= tierNumFromEdition(required)
  ) {
    return null;
  }

  const gatedByEditionOnly =
    currentState === "valid" &&
    tierNumFromEdition(currentEdition) < tierNumFromEdition(required);

  const payload = {
    ok: false,
    error: gatedByEditionOnly
      ? {
          kind: "edition_mismatch",
          feature: feature || "",
          required_edition: required,
          current_edition: currentEdition,
          license_state: currentState,
          hint: installHint(required),
        }
      : {
          kind: "license_required",
          feature: feature || "",
          required_edition: required,
          current_edition: currentEdition,
          license_state: currentState,
          hint: installHint(required),
        },
  };

  return {
    exitCode: EXIT_LICENSE_REQUIRED,
    payload,
    stdout: JSON.stringify(payload, null, 2) + "\n",
  };
}

export function requireLicenseTierOrExit({ lic, required, feature }) {
  const gate = buildLicenseGateResult({
    lic,
    requiredEdition: required,
    feature,
  });

  if (!gate) return;

  process.stdout.write(gate.stdout);
  process.exit(gate.exitCode);
}
