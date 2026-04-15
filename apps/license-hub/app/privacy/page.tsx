import { SiteChrome, panelStyle } from "../siteChrome";

export default function PrivacyPage() {
  return (
    <SiteChrome
      eyebrow="Legal"
      title="Privacy"
      lede="This privacy notice describes the minimum commercial data flow for Guard licensing, License Hub access, and the current third-party billing and email providers. It is intended for formal review before live launch."
    >
      <section style={{ display: "grid", gap: 18 }}>
        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Controller and contact</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Data controller: <strong>[Legal Entity Name]</strong>. Effective date: <strong>[Effective Date]</strong>.
            Privacy contact: <strong>privacy@mail.mindforge.run</strong>.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>What data is collected</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The current commercial flow may collect purchase email, customer identifiers, account session data, order
            and billing state, license identifiers, downloadable signed license artifacts, webhook event metadata, and
            operational mail delivery metadata needed to issue, deliver, and support commercial licenses.
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
            Email delivery providers such as <strong>[Email Provider Name]</strong> may process outbound login or
            license-delivery messages. Replace provider placeholders with the final live providers before launch.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Retention and visibility</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            The system keeps order, billing, session, and license history for <strong>[Retention Period]</strong> or as
            otherwise required to preserve commercial evidence, support continuity, fraud review, and accounting
            records. Customer-facing visibility remains limited to the License Hub portal and account pages.
          </p>
        </article>

        <article style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Requests and questions</h2>
          <p style={{ color: "#5b5444", lineHeight: 1.65 }}>
            Replace this placeholder with the final process for privacy access, correction, deletion, and support
            requests. Default contact: <strong>privacy@mail.mindforge.run</strong>.
          </p>
        </article>
      </section>
    </SiteChrome>
  );
}
