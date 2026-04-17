import Link from "next/link";

import { SiteChrome, panelStyle, pricingPageHref, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function ContactPage() {
  return (
    <SiteChrome
      eyebrow="Contact"
      title="Contact"
      lede="Use this page for the current published contact lanes: sales, support, and billing. This is a bounded intake page for License Hub commercial delivery, not a CRM or enterprise ticketing platform."
    >
      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Sales contact</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use sales contact for enterprise scope, procurement review, rollout timing, or packaging questions that do
            not fit the current self-serve checkout line.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Include company name, expected users, and timeline</li>
            <li>Enterprise does not use the current self-serve buy buttons</li>
            <li>Route these requests to <strong>sales@your-domain</strong></li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Support contact</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use support contact for account access, portal visibility, license download, or local install help after a
            purchase.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Use the same email that completed checkout</li>
            <li>Reference your order, transaction, or license ID when possible</li>
            <li>Route these requests to <strong>support@your-domain</strong></li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Billing contact</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use billing contact for refund requests, cancellations, duplicate charges, or invoice-state questions.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Refund and cancellation are different requests</li>
            <li>Refunds can revoke the associated commercial license</li>
            <li>Route these requests to <strong>billing@your-domain</strong></li>
          </ul>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Published contact structure</h2>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>
          Replace the placeholder mailbox names before live, but keep the three-lane structure so support, billing, and
          sales remain clearly separated in the public surface and internal routing.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, color: "#5b5444" }}>
          <li><strong>sales@your-domain</strong> for enterprise and commercial packaging</li>
          <li><strong>support@your-domain</strong> for portal, download, and install help</li>
          <li><strong>billing@your-domain</strong> for refund, cancellation, and invoice review</li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/support" style={primaryButtonStyle}>
            Support
          </Link>
          <Link href={pricingPageHref} style={secondaryButtonStyle}>
            Pricing
          </Link>
          <Link href="/refund-policy" style={secondaryButtonStyle}>
            Refund policy
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
