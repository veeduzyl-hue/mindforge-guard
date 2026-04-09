import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function RefundPolicyPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Refund Policy"
      lede="This page describes the minimum current-stage refund and cancellation policy for MindForge Guard commercial delivery. It is intentionally narrower than a full enterprise billing policy."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Refund availability</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Refund requests may be reviewed for recently completed commercial purchases. Approval is not automatic and
            may depend on billing state, delivery state, and whether a commercial license has already been issued and
            used.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>How to request a refund</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Start from account billing or Support, then include the purchase email and order or transaction reference.
            This keeps the request tied to the existing billing lifecycle record.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Refund vs cancellation</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            A refund reverses a completed payment. A cancellation stops the related billing agreement or renewal path.
            They are different lifecycle events and should not be treated as the same request.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What happens to the license</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            If a refund is approved, the related commercial license may be revoked or moved into a non-active state.
            If a billing agreement is canceled, the associated entitlement can also be revoked according to the current
            billing lifecycle rules.
          </p>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link href="/support" style={primaryButtonStyle}>
          Support
        </Link>
        <Link href="/account/billing" style={secondaryButtonStyle}>
          Account billing
        </Link>
      </section>
    </SiteChrome>
  );
}
