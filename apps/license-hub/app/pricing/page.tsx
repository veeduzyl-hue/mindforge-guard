import Link from "next/link";

import { SiteChrome, panelStyle, primaryButtonStyle, secondaryButtonStyle, subtlePanelStyle } from "../siteChrome";
import { PricingClient } from "./PricingClient";
import { getCommercialOffers } from "../../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../../lib/paddleCheckout";

export default function PricingPage() {
  const offers = getCommercialOffers();
  const config = getPaddleClientBootConfig();

  return (
    <SiteChrome
      eyebrow="Commercial Intake"
      title="Pricing"
      lede="Choose one of the four verified commercial checkout paths, then receive a signed license through License Hub for local Guard CLI verification, installation, and status checks."
    >
      <section style={{ ...subtlePanelStyle, display: "grid", gap: 10 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>What this page does</p>
        <p style={{ margin: 0, lineHeight: 1.65, color: "#5b5444" }}>
          Community does not go through payment. Pro and Pro+ map to the verified Paddle-hosted checkout catalog.
          Enterprise stays contact-led. Nothing here implies a fully launched control plane, team billing platform, or
          live-ready production checkout.
        </p>
      </section>

      <PricingClient
        environment={config.environment}
        clientToken={config.clientToken}
        successUrl={config.successUrl}
        cancelUrl={config.cancelUrl}
        offers={offers}
      />

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>After purchase</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            A successful checkout hands off to signed webhook fulfillment, then License Hub exposes the order, billing
            state, downloadable license JSON, and portal/account visibility.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/paddle/success" style={secondaryButtonStyle}>
              Success flow
            </Link>
            <Link href="/login" style={secondaryButtonStyle}>
              License Hub login
            </Link>
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Need a hand?</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use Support for billing, download, install, refund, or cancellation questions. Use Contact for sales,
            rollout, or procurement conversations.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/support" style={primaryButtonStyle}>
              Support
            </Link>
            <Link href="/contact" style={secondaryButtonStyle}>
              Contact
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
