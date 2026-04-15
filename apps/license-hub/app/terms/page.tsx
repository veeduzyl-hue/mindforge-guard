import { SiteChrome, panelStyle } from "../siteChrome";

export default function TermsPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Terms"
      lede="These terms describe the minimum commercial boundary for MindForge Guard and License Hub. They apply to the bounded commercial delivery surface and do not describe a broader control plane, platform, or enterprise billing system."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Provider and effective date</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            These terms govern the commercial delivery surface made available through MindForge License Hub and apply
            when a customer purchases, accesses, or downloads commercial license materials through this site. Use the
            support or contact channels on this site for billing or legal questions related to this surface.
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
            bypass account or billing controls, or present this bounded commercial surface as a fully launched
            enterprise control plane.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Disclaimer</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The current commercial surface is provided on a bounded basis. Its scope is limited to checkout intake,
            account and portal visibility, signed license delivery, and related billing lifecycle handling. Features
            not explicitly described in the current commercial surface are not promised.
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
            Commercial disputes and escalation should follow the governing terms, order record, and support handling
            path associated with the relevant purchase. Nothing on this page expands the commercial surface beyond the
            bounded License Hub delivery path.
          </p>
        </article>
      </section>
    </SiteChrome>
  );
}
