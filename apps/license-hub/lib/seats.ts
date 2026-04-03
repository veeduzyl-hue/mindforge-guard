import type { LicenseHubDb, LicenseRecord, OrganizationRecord } from "@mindforge/db";

export async function buildSeatOverview(
  db: LicenseHubDb,
  organization: OrganizationRecord | null,
  customerEmail: string
) {
  if (!organization) {
    return {
      organization: null,
      members: [],
      entitlements: [],
      assignments: [],
      notes: ["No organization scaffold exists yet for this customer email."],
    };
  }

  const [members, entitlements, assignments, licenses] = await Promise.all([
    db.listOrganizationMembers(organization.id),
    db.listSeatEntitlementsByOrganizationId(organization.id),
    db.listSeatAssignmentsByOrganizationId(organization.id),
    db.listLicensesByCustomerEmail(customerEmail),
  ]);

  const licenseByRecordId = new Map(licenses.map((license) => [license.id, license]));

  return {
    organization,
    members,
    entitlements: entitlements.map((entitlement) => ({
      ...entitlement,
      license: licenseByRecordId.get(entitlement.licenseId) ?? null,
      activeAssignments: assignments.filter(
        (assignment) => assignment.seatEntitlementId === entitlement.id && assignment.status === "active"
      ).length,
    })),
    assignments: assignments.map((assignment) => ({
      ...assignment,
      license:
        licenseByRecordId.get(
          entitlements.find((entitlement) => entitlement.id === assignment.seatEntitlementId)?.licenseId || ""
        ) ?? null,
    })),
    notes: [
      "Phase 6 seats remain a bounded skeleton: seat entitlements are license-scoped and organization-assigned.",
      "This surface does not introduce org RBAC, invites, or team provisioning workflows yet.",
    ],
  };
}

export function chooseSeatAssignableLicenses(licenses: LicenseRecord[]) {
  return licenses.filter((license) => license.status === "active");
}
