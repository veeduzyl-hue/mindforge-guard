import Link from "next/link";

import { SiteChrome, panelStyle, pricingPageHref, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function DocsPage() {
  return (
    <SiteChrome
      eyebrow="Commercial Notes"
      title="Docs"
      lede="This short note captures the current commercial delivery boundary: hosted checkout intake, License Hub fulfillment, signed license delivery, and local Guard CLI verification remain bounded and authoritative."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Current stage</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Hosted checkout intake is wired to the four commercial catalog entries.</li>
          <li>Official webhook fulfillment, order updates, license issuance, and CLI install flow are working.</li>
          <li>The public sales surface is limited to commercial intake, support, legal, and account or license delivery.</li>
        </ul>
      </section>

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What buyers get</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Signed license delivery through License Hub</li>
            <li>Portal and account visibility for orders, billing, and downloads</li>
            <li>Local Guard CLI verify, install, and status workflows</li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Operational expectations</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Published pricing, support, refund, privacy, and terms pages stay aligned with the live commercial surface.</li>
            <li>Paddle catalog, credentials, and notification destination stay synchronized with the deployed environment.</li>
            <li>Support, legal, and billing handling remain bounded to the current License Hub commercial scope.</li>
          </ul>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link href={pricingPageHref} style={primaryButtonStyle}>
          Pricing
        </Link>
        <Link href="/support" style={secondaryButtonStyle}>
          Support
        </Link>
      </section>
    </SiteChrome>
  );
}
