import Link from "next/link";

import { mainSiteHref, SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";
import { releaseAnnouncement } from "../launchCopy";

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
              {releaseAnnouncement.title}. Use this as the official short-form launch message.
            </p>
            <a href={`${repoDocsHref}/blob/main/docs/product/main-site-release-announcement-v1.md`} style={primaryButtonStyle}>
              Read announcement copy
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Product site</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use mindforge.run for the main Guard story, positioning, and buyer-facing product explanation.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a href={mainSiteHref} style={secondaryButtonStyle}>
                Open mindforge.run
              </a>
              <Link href="/product" style={secondaryButtonStyle}>
                Product page
              </Link>
            </div>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>Repository docs</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use the public repository for edition boundaries, license install guidance, and verification materials.
            </p>
            <a href={repoDocsHref} style={primaryButtonStyle}>
              Open repository docs
            </a>
          </article>
          <article style={{ display: "grid", gap: 8, padding: 16, border: "1px solid #d8ccae", borderRadius: 12 }}>
            <strong>FAQ and License Hub</strong>
            <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.6 }}>
              Use FAQ for buyer questions, then use License Hub after purchase to view licenses and download signed JSON.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/faq" style={secondaryButtonStyle}>
                FAQ
              </Link>
              <Link href="/login" style={secondaryButtonStyle}>
                License Hub
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteChrome>
  );
}
