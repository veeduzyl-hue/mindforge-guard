import Link from "next/link";

import { requireAccountContext, buildBillingSummaryForEmail } from "../../lib/account";

export default async function AccountPage() {
  const { session, customer, organization, db } = await requireAccountContext();
  const billing = await buildBillingSummaryForEmail(db, session.email);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1>Account</h1>
      <p>Signed in as {session.email}</p>
      <p>{customer ? "Your License Hub customer record is active." : "No customer record is available for this email yet."}</p>
      <p>{organization ? `Organization: ${organization.name}` : "No organization is attached to this account yet."}</p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 24 }}>
        <section style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Billing</h2>
          <p>Latest payment status: {billing.latestPaymentStatus}</p>
          <p>Fulfillment state: {billing.fulfillmentState}</p>
          <p>Orders: {billing.orderCount}</p>
          <p>Active licenses: {billing.activeLicenseCount}</p>
          <p>
            <Link href="/account/billing">View billing</Link>
          </p>
        </section>
        <section style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Licenses</h2>
          <p>Signed licenses available for download and local install.</p>
          <p>
            <Link href="/account/licenses">View licenses</Link>
          </p>
        </section>
        <section style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Orders</h2>
          <p>Commercial order history and billing-provider references.</p>
          <p>
            <Link href="/account/orders">View orders</Link>
          </p>
        </section>
        <section style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Organization</h2>
          <p>Organization profile and member visibility for team purchases.</p>
          <p>
            <Link href="/account/organization">View organization</Link>
          </p>
        </section>
        <section style={{ padding: 16, border: "1px solid #d1cab8", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Seats</h2>
          <p>Seat entitlements and assignments for eligible commercial licenses.</p>
          <p>
            <Link href="/account/seats">View seats</Link>
          </p>
        </section>
      </div>

      <p style={{ marginTop: 24 }}>
        <Link href="/portal">Back to License Hub</Link>
      </p>
    </main>
  );
}
