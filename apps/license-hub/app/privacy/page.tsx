import { SiteChrome, panelStyle } from "../siteChrome";

export default function PrivacyPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Privacy"
      lede="This minimum privacy notice explains the current commercial data flow for Guard licensing, License Hub access, and the bounded Paddle billing integration."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What data is collected</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The current commercial flow may collect purchase email, customer identifiers, order and billing state,
            license identifiers, downloadable signed license artifacts, and limited webhook payloads needed to process
            billing lifecycle events.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Why data is collected</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Data is collected to create or update the customer account, issue and deliver signed licenses, expose portal
            and account views, confirm billing state, and answer support requests related to orders, downloads, refunds,
            or cancellations.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Third-party services</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Paddle is used for hosted checkout and billing events. In the current commercial flow, Paddle may process
            payment method details and send signed billing webhook notifications that License Hub uses for fulfillment.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Retention and visibility</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The system keeps the order, billing, and license history needed to preserve commercial evidence and support
            continuity. The current customer-facing visibility is limited to the License Hub portal and account pages.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Contact</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Use the current Contact and Support pages for privacy questions during this pre-live phase. Dedicated live
            mailbox publication is still part of the pre-launch closeout work.
          </p>
        </article>
      </section>
    </SiteChrome>
  );
}
