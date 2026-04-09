import { SiteChrome, panelStyle } from "../siteChrome";

export default function TermsPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Terms"
      lede="These terms describe the minimum commercial boundary for MindForge Guard and License Hub. They are intended for formal review before live launch and do not describe a broader control plane, platform, or fully launched enterprise billing system."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Provider and effective date</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            These terms are provided by <strong>[Legal Entity Name]</strong> and take effect on <strong>[Effective Date]</strong>.
            Contact: <strong>legal@your-domain</strong>.
          </p>
        </article>

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
            the checkout, support, or deployment path is live-ready for production payments. Features not explicitly
            described in the current commercial surface are not promised.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Termination and suspension</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Access to the commercial delivery surface may be suspended or terminated if payment is reversed, a related
            subscription or order is canceled, fraud or misuse is reasonably suspected, or required fees remain unpaid.
            If a refund, chargeback, or cancellation revokes a license, the related commercial entitlement may no
            longer remain active and local use rights may end according to the applicable license record.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Governing law and disputes</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            These terms should identify the governing law, venue, and dispute handling process before live launch.
            Replace this placeholder with the approved clause for <strong>[Jurisdiction]</strong> and the agreed
            escalation or dispute process.
          </p>
        </article>
      </section>
    </SiteChrome>
  );
}
