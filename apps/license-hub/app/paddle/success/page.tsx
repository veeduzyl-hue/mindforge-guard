import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../../siteChrome";

export default function PaddleSuccessPage() {
  return (
    <SiteChrome
      eyebrow="Checkout Return"
      title="Payment received"
      lede="Your MindForge Guard purchase has been submitted. License Hub will make the signed license available in your account as soon as the paid order is ready for delivery."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Next steps</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Use the purchase email to sign in to License Hub.</li>
          <li>Open licenses to view or download the signed license JSON.</li>
          <li>Install the downloaded license locally with the Guard CLI.</li>
          <li>If the license is not visible after a short delay, contact Support with the purchase email.</li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/login" style={primaryButtonStyle}>
            License Hub
          </Link>
          <Link href="/portal/licenses" style={secondaryButtonStyle}>
            View licenses
          </Link>
          <Link href="/account/billing" style={secondaryButtonStyle}>
            Account billing
          </Link>
          <Link href="/support" style={secondaryButtonStyle}>
            Support
          </Link>
          <Link href="/docs" style={secondaryButtonStyle}>
            Docs
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
