import { mainSiteHref, SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const repoDocsHref = "https://github.com/veeduzyl-hue/mindforge-guard";
const trustDemoPackDocs = [
  {
    title: "First 10 Minutes With Guard",
    body: "Start with the current first-run path before you choose a paid license.",
    href: `${repoDocsHref}/blob/main/docs/first-10-minutes.md`,
  },
  {
    title: "Safety Boundary",
    body: "Understand what Guard does and does not do before it enters higher-risk delivery paths.",
    href: `${repoDocsHref}/blob/main/docs/trust/safety-boundary.md`,
  },
  {
    title: "Choose the Right Guard Edition",
    body: "Review the buyer-readable edition value map before upgrading.",
    href: `${repoDocsHref}/blob/main/docs/product/current/edition-value-map.md`,
  },
  {
    title: "Current Product Demos",
    body: "Run the current demos before upgrading or choosing a team rollout path.",
    href: `${repoDocsHref}/blob/main/docs/demos/current/README.md`,
  },
  {
    title: "Trust FAQ",
    body: "Use the current FAQ for trust, positioning, and commercial boundary questions.",
    href: `${repoDocsHref}/blob/main/docs/product/current/trust-faq.md`,
  },
] as const;

export default function DocsPage() {
  return (
    <SiteChrome
      eyebrow="Docs"
      title="MindForge Guard docs"
      lede="Product docs explain MindForge Guard. License Hub docs explain purchase, signed license delivery, and account access."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Documentation paths</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Launch status</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              License Hub is live. For current product and documentation context, use the repository docs and the main site.
            </p>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Product site</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use mindforge.run for the main Guard story, positioning, and buyer-facing product explanation.
            </p>
            <a href={mainSiteHref} style={secondaryButtonStyle}>
              mindforge.run
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Repository docs</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use the public repository for edition boundaries, license install guidance, and verification materials.
            </p>
            <a href={repoDocsHref} style={primaryButtonStyle}>
              Repo docs
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>FAQ and License Hub</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use FAQ for buyer questions, then use License Hub after purchase to view licenses and download signed JSON.
            </p>
          </article>
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Trust and demo pack</h2>
          <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
            This is the canonical trust and demo entry for License Hub visitors evaluating Guard before they choose a license.
          </p>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", alignItems: "stretch" }}>
          {trustDemoPackDocs.map((doc) => (
            <article key={doc.title} style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12, background: "#fffdf8", alignContent: "start" }}>
              <strong>{doc.title}</strong>
              <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>{doc.body}</p>
              <a href={doc.href} style={{ ...secondaryButtonStyle, marginTop: "auto" }}>
                Open guide
              </a>
            </article>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
