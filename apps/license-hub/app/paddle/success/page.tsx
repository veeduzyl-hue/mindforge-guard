import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../../siteChrome";

export default function PaddleSuccessPage() {
  return (
    <SiteChrome
      eyebrow="Checkout Return"
      title="Payment submitted"
      lede="Paddle reported a completed checkout return. License delivery still depends on the signed webhook being accepted and mapped into the existing billing lifecycle before the downloadable license appears."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Next steps</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Wait a moment for webhook fulfillment to update the order and issue the license.</li>
          <li>Sign in with the purchase email to view portal licenses and account billing.</li>
          <li>If the order does not settle correctly, use Support instead of retrying random checkout attempts.</li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/login" style={primaryButtonStyle}>
            Login
          </Link>
          <Link href="/portal/licenses" style={secondaryButtonStyle}>
            Portal licenses
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
