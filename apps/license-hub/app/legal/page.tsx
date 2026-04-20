import Link from "next/link";

import {
  eyebrowStyle,
  mutedTextStyle,
  pageBackgroundStyle,
  panelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../siteChrome";

export default function LegalPage() {
  const legalSections = [
    {
      id: "terms",
      title: "Terms",
      bullets: [
        "Commercial access covers checkout, portal visibility, billing state, and signed license delivery.",
        "Local Guard CLI verify, install, and status stay authoritative for the installed license artifact.",
        "No broader dashboard, control-plane, or execution authority is implied by this site.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      bullets: [
        "License Hub may process purchase email, order state, billing state, license identifiers, and login session data.",
        "Paddle remains the payment and billing event provider for the self-serve line.",
        "Operational mail delivery stays limited to login, delivery, and support flows for License Hub.",
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      bullets: [
        "Refunds and cancellations are different lifecycle actions and are reviewed separately.",
        "A refund may revoke or deactivate the related commercial license.",
        "Billing questions should stay tied to the purchase email and order reference.",
      ],
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <p style={eyebrowStyle}>Legal</p>
              <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.04 }}>Terms, privacy, and refunds.</h1>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/#pricing" style={secondaryButtonStyle}>
                Pricing
              </Link>
              <Link href="/login" style={secondaryButtonStyle}>
                Login
              </Link>
              <Link href="/#contact" style={primaryButtonStyle}>
                Contact
              </Link>
            </div>
          </div>
          <p style={{ ...mutedTextStyle, margin: 0, fontSize: 18, maxWidth: 760 }}>
            One legal page for the live commercial surface. Terms, privacy, and refund handling stay visible without
            interrupting the main buying flow.
          </p>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          {legalSections.map((section) => (
            <article key={section.id} id={section.id} style={{ ...panelStyle, display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>{section.title}</h2>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#3e382b", lineHeight: 1.6 }}>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
