import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function DocsPage() {
  return (
    <SiteChrome
      eyebrow="Commercial Notes"
      title="Docs"
      lede="This short note captures the current commercial delivery boundary: sandbox checkout is validated, License Hub fulfillment is working, and local Guard CLI verification remains authoritative."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Current stage</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Paddle sandbox hosted checkout has been validated end to end.</li>
          <li>Official webhook fulfillment, order updates, license issuance, and CLI install flow are working.</li>
          <li>The public sales surface is still pre-live and should not be described as production-ready checkout.</li>
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
          <h2 style={{ marginTop: 0 }}>Before live</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Stable staging or production ingress instead of quick tunnel infrastructure</li>
            <li>Live Paddle catalog, live credentials, and final webhook destination management</li>
            <li>Published support mailbox and finalized legal copy review</li>
          </ul>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link href="/pricing" style={primaryButtonStyle}>
          Pricing
        </Link>
        <Link href="/support" style={secondaryButtonStyle}>
          Support
        </Link>
      </section>
    </SiteChrome>
  );
}
