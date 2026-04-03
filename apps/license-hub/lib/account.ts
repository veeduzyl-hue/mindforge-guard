import { getLicenseHubDb } from "@mindforge/db";

import { requirePortalCustomer } from "./auth";
import { getSessionFromCookies } from "./session";

export class AccountAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "AccountAuthError";
  }
}

export async function requireAccountContext() {
  const { session, customer, db } = await requirePortalCustomer();
  const organization =
    customer
      ? await db.ensureOrganizationForCustomer({
          customerId: customer.id,
          customerEmail: customer.email,
          customerName: customer.name,
        })
      : null;

  return {
    session,
    customer,
    organization,
    db,
  };
}

export async function buildBillingSummaryForEmail(
  db: Awaited<ReturnType<typeof requireAccountContext>>["db"],
  email: string
) {
  const [orders, licenses] = await Promise.all([
    db.listOrdersByCustomerEmail(email),
    db.listLicensesByCustomerEmail(email),
  ]);

  const latestOrder = orders[0] ?? null;
  const latestPaidOrder = orders.find((order) => order.status === "paid") ?? null;

  return {
    orderCount: orders.length,
    licenseCount: licenses.length,
    activeLicenseCount: licenses.filter((license) => license.status === "active").length,
    latestOrder,
    latestPaidOrder,
    latestPaymentStatus: latestOrder?.status ?? "none",
    renewalHint:
      latestPaidOrder && licenses.some((license) => license.status === "active")
        ? "Renew by replacing the locally installed license with the latest signed JSON from License Hub."
        : "Complete payment and download the signed license JSON from License Hub before installing it in Guard CLI.",
  };
}

export async function requireAccountApiContext() {
  const session = await getSessionFromCookies();
  if (!session) {
    throw new AccountAuthError("unauthorized", 401);
  }

  const db = await getLicenseHubDb();
  const customer = await db.getCustomerByEmail(session.email);
  const organization =
    customer
      ? await db.ensureOrganizationForCustomer({
          customerId: customer.id,
          customerEmail: customer.email,
          customerName: customer.name,
        })
      : null;

  return {
    session,
    customer,
    organization,
    db,
  };
}
