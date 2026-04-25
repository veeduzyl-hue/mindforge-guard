import Link from "next/link";

import {
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
        "Commercial access covers checkout, signed license delivery, License Hub account access, and bounded account visibility.",
        "The local Guard CLI remains the runtime governance surface and uses the locally installed signed license file.",
        "License Hub does not provide execution authority, policy takeover, or hosted control-plane behavior.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      bullets: [
        "License Hub may process purchase email, order state, billing state, account session, and license delivery metadata.",
        "The billing provider continues to handle self-serve payment and billing events for checkout.",
        "Operational email is used for login, delivery, account access, and support workflows.",
      ],
    },
    {
      id: "refunds",
      title: "Refunds",
      bullets: [
        "Refunds and cancellations are separate lifecycle actions and may update commercial license status differently.",
        "A refund may cause the related commercial license to become inactive or revoked according to the billing lifecycle.",
        "Billing questions should include the purchase email and available order context.",
      ],
    },
    {
      id: "boundary",
      title: "Product boundary",
      bullets: [
        "MindForge Guard remains recommendation-only, additive-only, non-executing, and local-first.",
        "Audit output, verdict, and exit behavior are not changed by License Hub.",
        "Permit and classify behavior are not changed by License Hub.",
      ],
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={panelStyle}>
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
              <p style={{ margin: 0, color: "#946c2b", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                MindForge Guard License Hub
              </p>
              <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.04 }}>Terms, privacy, refunds, and boundaries</h1>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/#pricing" style={secondaryButtonStyle}>
                Pricing
              </Link>
              <Link href="/login" style={primaryButtonStyle}>
                License Hub
              </Link>
            </div>
          </div>
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
