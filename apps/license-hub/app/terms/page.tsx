import { SiteChrome, panelStyle } from "../siteChrome";

export default function TermsPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Terms"
      lede="These terms describe the current minimum commercial boundary for MindForge Guard and License Hub. They do not describe a broader control plane, platform, or live-ready enterprise billing system."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Product object</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The commercial product currently covers MindForge Guard commercial licensing, License Hub account and
            portal access, signed license delivery, and bounded billing lifecycle handling.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>License scope</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            A successful purchase may result in a signed commercial license tied to the purchase email or customer
            record. Local Guard CLI verification, installation, and status remain authoritative for the installed
            license artifact.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Prohibited use</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            You may not misrepresent the commercial delivery surface as granting rights beyond the purchased license,
            bypass account or billing controls, or present this current pre-live commercial surface as a fully launched
            enterprise control plane.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Disclaimer</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The current commercial surface is provided on a bounded, evolving basis. Sandbox validation does not mean
            the checkout or support path is live-ready for production payments. Features not explicitly shown in the
            current product surface are not promised.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Termination and suspension</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Access to the commercial delivery surface may be limited or suspended when payment is reversed, a related
            order is canceled, or misuse of the current commercial path is detected. When a refund or cancellation
            revokes a license, the related commercial entitlement may no longer remain active.
          </p>
        </article>
      </section>
    </SiteChrome>
  );
}
