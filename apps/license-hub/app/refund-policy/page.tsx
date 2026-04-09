import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function RefundPolicyPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Refund Policy"
      lede="This page describes the minimum commercial refund and cancellation policy for MindForge Guard delivery. It is intended for formal review before live launch and remains narrower than a full enterprise billing policy."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Policy owner and effective date</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Policy owner: <strong>[Legal Entity Name]</strong>. Effective date: <strong>[Effective Date]</strong>.
            Billing contact: <strong>billing@your-domain</strong>.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Refund availability</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Refund requests should be reviewed either within <strong>[Refund Window]</strong> of the original purchase
            or under a documented case-by-case standard. Approval is not automatic. Review should consider billing
            state, delivery state, evidence of duplicate charge or provisioning failure, and whether a commercial
            license has already been issued, downloaded, or used.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>How to request a refund</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Start from account billing or Support, then include the purchase email and order or transaction reference.
            Refund requests should be sent to <strong>billing@your-domain</strong> so the request remains tied to the
            recorded billing lifecycle.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Refund vs cancellation</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            A refund reverses a completed payment. A cancellation stops a related subscription, renewal, or recurring
            billing agreement from continuing after the current paid period. They are different lifecycle events and
            should not be treated as the same request.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>License and entitlement effect</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            If a refund is approved, the related commercial license may be revoked, superseded, or moved into a
            non-active state. If a cancellation takes effect, the associated entitlement may expire at the end of the
            paid term or be revoked earlier if the applicable billing rules require it. Local Guard CLI state should be
            treated as valid only while the issued license remains active.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Review timing</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Replace this placeholder with the approved response target for billing review, for example <strong>[Review
            Target Time]</strong>, and the approved standard for exceptional cases outside the normal refund window.
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
