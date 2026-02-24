/**
 * Product-level license gating for Guard 1.0
 * - Do NOT affect policy enforcement (repo-level).
 * - ONLY gate monetized analytics surfaces (Pro / Pro+).
 *
 * Exit codes:
 *  21: LICENSE_REQUIRED (stable; do not collide with DS-EXIT-001)
 */

const EXIT_LICENSE_REQUIRED = 21;

function tierNumFromEdition(edition) {
  if (edition === "pro+") return 2;
  if (edition === "pro") return 1;
  return 0;
}

function requiredTierNum(requiredEdition) {
  if (requiredEdition === "pro_plus" || requiredEdition === "pro+") return 2;
  if (requiredEdition === "pro") return 1;
  return 0;
}

export function requireLicenseTierOrExit({ lic, required, feature }) {
  // lic comes from readLicense() in product/license.mjs (kind: missing|ok|expired|not_yet_valid|invalid)
  const currentEdition = lic && lic.kind === "ok" ? lic.edition : "community";
  const current = tierNumFromEdition(currentEdition);
  const need = requiredTierNum(required);

  if (current >= need) return;

  const payload = {
    ok: false,
    error: {
      kind: "license_required",
      feature: feature || "",
      required_edition: required === "pro_plus" ? "pro+" : required,
      current_edition: currentEdition,
      hint: "Install a signed license file: guard license install <file>",
    },
  };

  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
  process.exit(EXIT_LICENSE_REQUIRED);
}
