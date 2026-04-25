import Link from "next/link";

import { boundarySummary, faqItems, primaryCtas, productPositioning } from "../launchCopy";
import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle, mutedTextStyle } from "../siteChrome";

export default function FaqPage() {
  return (
    <SiteChrome
      eyebrow="FAQ"
      title="MindForge Guard FAQ"
      lede="Short answers for buyers evaluating Guard, pricing, demos, and License Hub access."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>{productPositioning.eyebrow}</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>{productPositioning.shortDefinition}</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        {faqItems.map((item) => (
          <article key={item.question} style={{ ...panelStyle, display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{item.question}</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Boundary summary</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>{boundarySummary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/#pricing" style={primaryButtonStyle}>
            {primaryCtas.pricing}
          </Link>
          <Link href="/#demos" style={secondaryButtonStyle}>
            {primaryCtas.demos}
          </Link>
          <Link href="/support" style={secondaryButtonStyle}>
            Support
          </Link>
          <Link href="/legal" style={secondaryButtonStyle}>
            Legal
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
