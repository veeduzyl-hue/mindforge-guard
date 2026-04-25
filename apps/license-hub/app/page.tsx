import Link from "next/link";

import { getPricingEditions } from "../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../lib/paddleCheckout";
import {
  mutedTextStyle,
  pageBackgroundStyle,
  panelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "./siteChrome";
import { adoptionReasons, demoCards, faqItems, primaryCtas, productPositioning, whyItMatters } from "./launchCopy";
import { PricingClient } from "./pricing/PricingClient";

export default function HomePage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const compactFaq = faqItems.filter((item) =>
    ["What is Guard?", "Where do I buy?", "Where are the boundaries?"].includes(item.question)
  );

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 22, padding: 32 }}>
          <div style={{ display: "grid", gap: 14, maxWidth: 860 }}>
            <p style={{ margin: 0, color: "#946c2b", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
              MindForge Guard License Hub
            </p>
            <h1 style={{ margin: 0, fontSize: 52, lineHeight: 1.01 }}>
              Buy and manage MindForge Guard commercial licenses.
            </h1>
            <p style={{ ...mutedTextStyle, margin: 0, fontSize: 19, maxWidth: 780 }}>
              License Hub is the purchase and account center for MindForge Guard. Choose an edition, complete secure
              checkout, access signed license delivery, and review billing, organization, and seat details without
              changing Guard CLI behavior.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="#pricing" style={primaryButtonStyle}>
              {primaryCtas.buy}
            </Link>
            <Link href="#pricing" style={secondaryButtonStyle}>
              {primaryCtas.pricing}
            </Link>
            <Link href="#demos" style={secondaryButtonStyle}>
              {primaryCtas.demos}
            </Link>
            <Link href="/login" style={secondaryButtonStyle}>
              {primaryCtas.portal}
            </Link>
          </div>
        </section>

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>What License Hub is for</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Keep the commercial path simple: choose an edition, complete checkout, and manage delivery and account
              details after purchase.
            </p>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {whyItMatters.map((item) => (
              <article key={item.title} style={{ padding: 16, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
                <strong>{item.title}</strong>
                <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>What buyers can do here</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              License Hub keeps pricing, purchase, delivery, and account visibility in one bounded surface.
            </p>
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {adoptionReasons.map((reason) => (
              <div key={reason} style={{ padding: 14, borderRadius: 12, background: "#ffffff", border: "1px solid #d8ccae" }}>
                <strong>{reason}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="demos" style={{ ...panelStyle, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>Need to evaluate Guard first?</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Use the public demos to review workflow fit, buyer value, and edition boundaries before checkout.
            </p>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {demoCards.map((demo) => (
              <article
                key={demo.eyebrow}
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 18,
                  borderRadius: 12,
                  background: "#fffdf8",
                  border: "1px solid #d8ccae",
                }}
              >
                <p style={{ margin: 0, color: "#946c2b", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                  {demo.eyebrow}
                </p>
                <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.18 }}>{demo.title}</h3>
                <p style={{ ...mutedTextStyle, margin: 0 }}>{demo.body}</p>
                <a href={demo.href} style={{ ...secondaryButtonStyle, textAlign: "center" }}>
                  {demo.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" style={{ display: "grid", gap: 12 }}>
          <PricingClient
            environment={config.environment}
            clientToken={config.clientToken}
            successUrl={config.successUrl}
            cancelUrl={config.cancelUrl}
            editions={editions}
          />
        </section>

        <section id="quick-help" style={{ ...panelStyle, display: "grid", gap: 16 }} aria-labelledby="faq-heading">
          <div style={{ display: "grid", gap: 6 }}>
            <h2 id="faq-heading" style={{ margin: 0 }}>
              Buyer FAQ and next steps
            </h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Keep this surface short and transactional. Use FAQ, Legal, and Support for detailed purchase, boundary,
              and account guidance.
            </p>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {compactFaq.map((item) => (
              <article key={item.question} style={{ padding: 16, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
                <strong>{item.question}</strong>
                <p style={{ ...mutedTextStyle, margin: "6px 0 0" }}>{item.answer}</p>
              </article>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="#pricing" style={primaryButtonStyle}>
              {primaryCtas.buy}
            </Link>
            <Link href="#demos" style={secondaryButtonStyle}>
              {primaryCtas.demos}
            </Link>
            <Link href="/login" style={secondaryButtonStyle}>
              {primaryCtas.portal}
            </Link>
            <Link href="/docs" style={secondaryButtonStyle}>
              Docs
            </Link>
            <Link href="/legal" style={secondaryButtonStyle}>
              Legal
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
