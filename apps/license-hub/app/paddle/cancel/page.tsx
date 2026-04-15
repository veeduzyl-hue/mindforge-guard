import Link from "next/link";

import { SiteChrome, panelStyle, pricingPageHref, primaryButtonStyle, secondaryButtonStyle } from "../../siteChrome";

export default async function PaddleCancelPage(props: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const searchParams = (await props.searchParams) || {};

  return (
    <SiteChrome
      eyebrow="Checkout Return"
      title="Checkout canceled"
      lede="The hosted checkout did not complete. No paid entitlement should be issued from this return alone, and the order should remain outside the paid state until a successful payment and webhook fulfillment happen."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>What to do now</h2>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>
          Cancel reason: <strong>{searchParams.reason || "customer_cancelled"}</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Return to Pricing if you want to start a fresh checkout attempt.</li>
          <li>Use Contact for enterprise or pre-purchase questions instead of forcing self-serve checkout.</li>
          <li>Use Support if you expected a paid order but the billing state now looks inconsistent.</li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href={pricingPageHref} style={primaryButtonStyle}>
            Return to pricing
          </Link>
          <Link href="/contact" style={secondaryButtonStyle}>
            Contact
          </Link>
          <Link href="/support" style={secondaryButtonStyle}>
            Support
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
