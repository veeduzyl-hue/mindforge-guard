import Link from "next/link";

import { boundarySummary, productPositioning } from "../launchCopy";
import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const supportEmail = "billing@mail.mindforge.run";
const supportHref = `mailto:${supportEmail}?subject=MindForge%20Guard%20Support`;

export default function SupportPage() {
  const supportAreas = [
    {
      title: "Pre-purchase",
      body: `Questions about Pro, Pro+, Enterprise purchasing, or whether Guard fits your team. ${productPositioning.shortDefinition}`,
    },
    {
      title: "After purchase",
      body: "Help with License Hub sign-in, signed license download, billing visibility, or account access.",
    },
    {
      title: "Local install",
      body: "Use the downloaded signed license JSON with the local Guard CLI license verify, install, status, and show commands.",
    },
    {
      title: "Boundary questions",
      body: boundarySummary,
    },
  ] as const;

  return (
    <SiteChrome
      eyebrow="Support"
      title="Support for Guard purchase and licensing"
      lede="Support covers purchase questions, License Hub access, signed license delivery, and local license installation guidance."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {supportAreas.map((area) => (
            <article key={area.title} style={{ padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
              <strong>{area.title}</strong>
              <p style={{ margin: "8px 0 0", color: "#5b5444", lineHeight: 1.6 }}>{area.body}</p>
            </article>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <a href={supportHref} style={primaryButtonStyle}>
            Email support
          </a>
          <Link href="/login" style={secondaryButtonStyle}>
            License Hub
          </Link>
          <Link href="/docs" style={secondaryButtonStyle}>
            Docs
          </Link>
          <Link href="/faq" style={secondaryButtonStyle}>
            FAQ
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
