export type LicenseEdition = "community" | "pro" | "pro_plus" | "enterprise";

export interface LicenseEntitlements {
  analytics: {
    drift_timeline: boolean;
    drift_compare: boolean;
    assoc_correlate: boolean;
  };
}

export function normalizeLicenseEdition(value: string): LicenseEdition {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "pro+") {
    return "pro_plus";
  }
  if (normalized === "pro_plus") {
    return "pro_plus";
  }
  if (normalized === "enterprise") {
    return "enterprise";
  }
  if (normalized === "pro") {
    return "pro";
  }
  return "community";
}

const ENTITLEMENT_MATRIX: Record<LicenseEdition, LicenseEntitlements> = {
  community: {
    analytics: {
      drift_timeline: false,
      drift_compare: false,
      assoc_correlate: false,
    },
  },
  pro: {
    analytics: {
      drift_timeline: true,
      drift_compare: false,
      assoc_correlate: false,
    },
  },
  pro_plus: {
    analytics: {
      drift_timeline: true,
      drift_compare: true,
      assoc_correlate: true,
    },
  },
  enterprise: {
    analytics: {
      drift_timeline: true,
      drift_compare: true,
      assoc_correlate: true,
    },
  },
};

export function resolveEntitlementsForEdition(edition: string): LicenseEntitlements {
  return ENTITLEMENT_MATRIX[normalizeLicenseEdition(edition)];
}
