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
            Phase 1
          </p>
          <h1 style={{ marginTop: 8, fontSize: 42 }}>MindForge License Hub</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>
            A bounded commercial support subsystem for mock payment intake, offline license issuance,
            and delivery-oriented persistence. It is intentionally separate from the Guard CLI main path.
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
            <li>Customer / order upsert</li>
            <li>Ed25519 signed license payload creation</li>
            <li>File-db fallback for local MVP, Prisma schema for follow-on hardening</li>
          </ul>
        </section>

        <section style={cardStyle}>
          <h2>Reserved for Phase 2</h2>
          <ul>
            <li>Portal delivery flow</li>
            <li>Magic link issue + consume flow</li>
            <li>Admin action audit surface</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
