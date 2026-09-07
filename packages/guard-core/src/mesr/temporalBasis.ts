import {
  MESR_TEMPORAL_BASIS_STATUSES,
  type MesrTemporalBasis,
  type MesrValidationResult,
} from "./types.ts";

const OFFSET_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function validateMesrTemporalBasis(input: MesrTemporalBasis): MesrValidationResult {
  const issues: MesrValidationResult["issues"] = [];
  const timestampFields = ["observed_at", "verified_at", "valid_from", "valid_until", "basis_valid_at"] as const;
  for (const field of timestampFields) {
    const value = input[field];
    if (value !== null && (!OFFSET_TIMESTAMP.test(value) || Number.isNaN(Date.parse(value)))) {
      issues.push({ code: "INVALID_OFFSET_TIMESTAMP", subject: input.claim_ref, field, detail: String(value) });
    }
  }
  if (!(MESR_TEMPORAL_BASIS_STATUSES as readonly string[]).includes(input.basis_status)) {
    issues.push({ code: "INVALID_BASIS_STATUS", subject: input.claim_ref, field: "basis_status", detail: input.basis_status });
  }
  if (!input.basis_valid_at) {
    issues.push({ code: "MISSING_BASIS_VALID_AT", subject: input.claim_ref, field: "basis_valid_at", detail: "basis_valid_at is required" });
  }
  if (input.provenance_refs.length === 0 && input.basis_status === "current") {
    issues.push({ code: "CURRENT_WITHOUT_PROVENANCE", subject: input.claim_ref, field: "provenance_refs", detail: "missing provenance cannot resolve to current" });
  }
  issues.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  return { valid: issues.length === 0, issues };
}
