/** Private ADR 0011 selector. This is precedence of attributable blockers,
 * not a severity ordering, runtime permission or a report disposition. */
export const CLAIM_STATES = Object.freeze(["SUPPORTED", "UNSUPPORTED", "UNRESOLVED", "CONFLICTED", "STALE", "INCONCLUSIVE"] as const);
export type ClaimState = typeof CLAIM_STATES[number];
export interface StateBasis {
  prohibitions: readonly unknown[];
  conflicts: readonly unknown[];
  stale: readonly unknown[];
  missing: readonly string[];
  positive: readonly unknown[];
  negative: readonly unknown[];
  undecidable: readonly unknown[];
}
