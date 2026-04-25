import { mainSiteHref, SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const repoDocsHref = "https://github.com/veeduzyl-hue/mindforge-guard";

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
            <strong>Launch announcement</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              The launch announcement lives in the repository history, but this page no longer links to the outdated release note path.
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
    </SiteChrome>
  );
}
