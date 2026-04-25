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
      lede="Checkout did not complete, so no paid MindForge Guard license was issued from this session. You can return to pricing, contact sales, or contact support if you expected a successful purchase."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>What to do now</h2>
        <p style={{ margin: 0, color: "#5b5444", lineHeight: 1.65 }}>
          Cancel reason: <strong>{searchParams.reason || "customer_cancelled"}</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Return to Pricing to start a fresh Pro or Pro+ checkout.</li>
          <li>Use Contact for Enterprise or pre-purchase questions.</li>
          <li>Use Support if you expected payment to complete but cannot access License Hub.</li>
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
