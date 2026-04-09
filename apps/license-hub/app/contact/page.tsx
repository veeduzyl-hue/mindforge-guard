import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

export default function ContactPage() {
  return (
    <SiteChrome
      eyebrow="Contact"
      title="Contact"
      lede="Use this page for the minimum current-stage contact lanes: sales, support, and billing. This is a bounded intake page, not a full CRM or enterprise ticketing system."
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
            <li>Keep requests scoped to the current Guard + License Hub commercial boundary</li>
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
            <li>Start with Support if you are unsure which lane is correct</li>
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
            <li>Billing visibility starts in the account billing page</li>
          </ul>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>How to reach the current team</h2>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>
          A dedicated live mailbox is not published yet. For this pre-live commercial phase, use the same purchase
          email flow that License Hub already uses, then follow up with the current operator channel that issued your
          evaluation or onboarding link. This keeps contact paths honest while live support routing is still being
          finalized.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/support" style={primaryButtonStyle}>
            Support
          </Link>
          <Link href="/pricing" style={secondaryButtonStyle}>
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
