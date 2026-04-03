import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "linear-gradient(180deg, rgba(244,241,232,1) 0%, rgba(232,225,206,1) 100%)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <section style={cardStyle}>
          <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "#946c2b" }}>
            Phase 6
          </p>
          <h1 style={{ marginTop: 8, fontSize: 42 }}>MindForge License Hub</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>
            A bounded commercial support subsystem for billing lifecycle handling, offline license issuance,
            portal delivery, admin operations, and the new account-oriented Phase 6 skeleton. It remains
            intentionally separate from the Guard CLI main path.
          </p>
        </section>

        <section style={cardStyle}>
          <h2>Available now</h2>
          <ul>
            <li>
              <code>POST /api/webhooks/mock-payment</code> for <code>payment.succeeded</code>
            </li>
            <li>
              <a href="/login">Magic link login</a> and customer portal license download flow
            </li>
            <li>Billing webhook lifecycle handling, refund/cancellation processing, and system action audit logs</li>
            <li>Admin revoke / resend / extend / supersede actions</li>
            <li>
              <a href="/account">Account surface</a> for orders, licenses, billing visibility, and organization/seats overview
            </li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2>Phase 6 bounded skeleton</h2>
          <ul>
            <li>Organization and seat assignment data model + APIs</li>
            <li>Optional online activation protocol skeleton</li>
            <li>Offline Guard CLI install / verify remains authoritative</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
