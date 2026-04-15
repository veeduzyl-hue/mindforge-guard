import Link from "next/link";

import { getCommercialOffers } from "../lib/commercialCatalog";
import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "./siteChrome";

export default function HomePage() {
  const offers = getCommercialOffers();
  const paidOffers = offers.filter((offer) => offer.kind === "paddle_checkout");

  return (
    <SiteChrome
      eyebrow="Phase 6.5"
      title="MindForge License Hub"
      lede="MindForge License Hub is the bounded commercial delivery surface for Guard licensing: verified checkout intake, signed webhook fulfillment, downloadable licenses, portal and account visibility, and local CLI verification without touching the Guard main path."
    >
      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What is live on this surface</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Verified hosted checkout entry for four commercial catalog entries</li>
            <li>Signed webhook fulfillment into orders, billing, portal, and downloadable licenses</li>
            <li>Local Guard CLI verify, install, license status, and guard status</li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What is not being claimed</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>No team, seat, org, or dashboard platform launch claim</li>
            <li>No authority expansion into the Guard CLI main path</li>
            <li>No control-plane takeover or autonomous execution claim</li>
          </ul>
        </article>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>Pricing entry</h2>
            <p style={{ margin: "8px 0 0", color: "#5b5444", lineHeight: 1.65 }}>
              The self-serve commercial path now points to the four verified Paddle price mappings only.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/pricing" style={primaryButtonStyle}>
              Open pricing
            </Link>
            <Link href="/docs" style={secondaryButtonStyle}>
              Read docs
            </Link>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {paidOffers.map((offer) => (
            <div key={offer.slug} style={{ padding: 16, borderRadius: 14, background: "#fffaf0", border: "1px solid #d8ccae" }}>
              <strong>{offer.title}</strong>
              <p style={{ margin: "8px 0 0", color: "#5b5444" }}>
                {offer.editionLabel} | {offer.billingIntervalLabel}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Portal and account</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Customers can sign in with the purchase email, inspect orders and billing, and download the signed license
            artifact.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/login" style={secondaryButtonStyle}>
              Login
            </Link>
            <Link href="/account" style={secondaryButtonStyle}>
              Account
            </Link>
          </div>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Support and legal</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The minimum support and legal pages are now part of this same bounded surface so the commercial path is not
            dangling after checkout.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/support" style={secondaryButtonStyle}>
              Support
            </Link>
            <Link href="/terms" style={secondaryButtonStyle}>
              Terms
            </Link>
          </div>
        </article>
      </section>
    </SiteChrome>
  );
}
