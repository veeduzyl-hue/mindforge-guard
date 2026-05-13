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

const trustDemoPackDocs = [
  {
    title: "First 10 Minutes With Guard",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/first-10-minutes.md",
  },
  {
    title: "Safety Boundary",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/trust/safety-boundary.md",
  },
  {
    title: "Choose the Right Guard Edition",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/edition-value-map.md",
  },
  {
    title: "Current Product Demos",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/demos/current/README.md",
  },
  {
    title: "Trust FAQ",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/trust-faq.md",
  },
] as const;

const v7ReportSteps = [
  "Install @veeduzyl/mindforge-guard@7.0.0",
  "Use the HR self-service example Evidence Pack",
  "Run pack validate and report single-agent",
  "Read authority, behavior evidence, and risk/drift signals",
] as const;

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
          <Link href="#demos" style={secondaryButtonStyle}>
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
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0 }}>From Evidence Pack to Governance Report</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            v7.0.0 is published with a First Governance Report in 10 Minutes path for local, deterministic review.
            The report experience by edition remains recommendation-only, non-executing, non-control-plane, and
            human-review-oriented.
          </p>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {v7ReportSteps.map((step) => (
            <div key={step} style={{ padding: 14, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          Community previews current-state reports; Pro adds timeline-oriented reading where released commands support it;
          Pro+ adds compare, correlate, and deeper signals where released commands support them; Enterprise keeps the same
          runtime entitlement as Pro+ with no extra runtime authority.
        </p>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Start with trust and demo docs</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          Understand the current boundary, compare editions, and run the current demos before you upgrade.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {trustDemoPackDocs.map((doc) => (
            <a key={doc.title} href={doc.href} style={secondaryButtonStyle}>
              {doc.title}
            </a>
          ))}
        </div>
      </section>

      <section id="demos" style={{ ...panelStyle, display: "grid", gap: 14 }}>
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
