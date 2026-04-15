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
      eyebrow="Pricing"
      title="Pricing"
      lede="Choose Community, Pro, Pro+, or Enterprise based on the level of commercial access and governance visibility you need. Monthly and yearly billing live inside Pro and Pro+ once the edition is clear."
    >
      <section style={{ ...subtlePanelStyle, display: "grid", gap: 10 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Choose the edition first</p>
        <p style={{ margin: 0, lineHeight: 1.65, color: "#5b5444" }}>
          Community is documentation-led, Pro and Pro+ are self-serve commercial plans, and Enterprise stays
          contact-led. The page is intentionally organized around plan differences first so monthly versus yearly is a
          second decision, not the first one.
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
          <h2 style={{ marginTop: 0 }}>Need help choosing?</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Start with docs if you are staying on the community path. Use support if you need help deciding between Pro
            and Pro+, or if you have questions about an existing commercial purchase.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/docs" style={secondaryButtonStyle}>
              Read docs
            </Link>
            <Link href="/support" style={secondaryButtonStyle}>
              Support
            </Link>
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Enterprise conversations</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Procurement-led rollout, organization-wide adoption, and commercial coordination beyond self-serve checkout
            still run through the contact path.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/contact" style={primaryButtonStyle}>
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
