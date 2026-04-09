import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function SupportPage() {
  return (
    <SiteChrome
      eyebrow="Support"
      title="Support"
      lede="Use this page for commercial support around billing, license delivery, downloads, installs, refunds, and cancellations. This is a bounded support surface for License Hub, not a full ticketing platform."
    >
      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Billing support</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use billing support when a checkout completed but your order status, invoice, refund request, or
            cancellation state needs review.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Confirm the purchase email used at checkout</li>
            <li>Include the order or transaction reference when available</li>
            <li>Use <strong>billing@your-domain</strong> for refunds, cancellations, invoice questions, or duplicate charges</li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>License download and install</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            If you need help retrieving or installing the signed license JSON, start with the portal and account
            surfaces, then fall back to manual support.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Login with the purchase email</li>
            <li>Download the latest signed license JSON</li>
            <li>Run local CLI verify, install, and status commands</li>
            <li>Use <strong>support@your-domain</strong> for portal access, download, or install help</li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Portal and account</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Portal and account pages expose the current customer-facing lifecycle. They are the first place to confirm
            order status, billing state, and available licenses.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>`/portal/licenses` for downloadable signed licenses</li>
            <li>`/account/orders` for paid and pending orders</li>
            <li>`/account/billing` for the latest billing and fulfillment state</li>
          </ul>
        </article>
      </section>

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Refunds and cancellations</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Refunds and cancellations are handled separately. Read the refund policy before asking for a change in
            billing state, especially when a license has already been issued.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/refund-policy" style={primaryButtonStyle}>
              Refund policy
            </Link>
            <Link href="/account/billing" style={secondaryButtonStyle}>
              Account billing
            </Link>
          </div>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Support routing</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Replace the placeholder addresses below with the final published mailboxes before live. Keep the routing
            structure intact so billing, license support, and sales requests do not collapse into one ambiguous lane.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li><strong>support@your-domain</strong> for account, portal, download, and install support</li>
            <li><strong>billing@your-domain</strong> for refunds, cancellations, invoices, and charge questions</li>
            <li><strong>sales@your-domain</strong> for enterprise, procurement, and rollout timing</li>
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/contact" style={primaryButtonStyle}>
              Contact
            </Link>
            <Link href="/pricing" style={secondaryButtonStyle}>
              Pricing
            </Link>
          </div>
        </article>
      </section>
    </SiteChrome>
  );
}
