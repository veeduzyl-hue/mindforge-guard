import Link from "next/link";

import {
  adoptionReasons,
  boundarySummary,
  demoCards,
  primaryCtas,
  productPositioning,
  releaseAnnouncement,
  whyItMatters,
} from "../launchCopy";
import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle, mutedTextStyle } from "../siteChrome";

export default function ProductPage() {
  return (
    <SiteChrome
      eyebrow="Product"
      title="MindForge Guard"
      lede={productPositioning.body}
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0 }}>{productPositioning.headline}</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            {releaseAnnouncement.subtitle}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/#pricing" style={primaryButtonStyle}>
            {primaryCtas.buy}
          </Link>
          <Link href="/#demos" style={secondaryButtonStyle}>
            {primaryCtas.demos}
          </Link>
          <Link href="/faq" style={secondaryButtonStyle}>
            FAQ
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {whyItMatters.map((item) => (
          <article key={item.title} style={{ ...panelStyle, display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{item.title}</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>{item.body}</p>
          </article>
        ))}
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Adoption value</h2>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {adoptionReasons.map((reason) => (
            <div key={reason} style={{ padding: 14, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
              <strong>{reason}</strong>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Evaluation demos</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {demoCards.map((demo) => (
            <article key={demo.eyebrow} style={{ display: "grid", gap: 10, padding: 16, borderRadius: 12, background: "#fffdf8", border: "1px solid #d8ccae" }}>
              <strong>{demo.title}</strong>
              <p style={{ ...mutedTextStyle, margin: 0 }}>{demo.body}</p>
              <a href={demo.href} style={secondaryButtonStyle}>
                {demo.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Boundary</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>{boundarySummary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/legal" style={secondaryButtonStyle}>
            Legal
          </Link>
          <Link href="/docs" style={secondaryButtonStyle}>
            Docs
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
