import Link from "next/link";

import {
  eyebrowStyle,
  mutedTextStyle,
  pageBackgroundStyle,
  panelStyle,
} from "../siteChrome";
import { PricingClient } from "./PricingClient";
import { getPricingEditions } from "../../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../../lib/paddleCheckout";

export default function PricingPage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const deliverySteps = [
    {
      title: "Choose your edition",
      body: "Pick Community, Pro, Pro+, or Enterprise.",
    },
    {
      title: "Buy with your email",
      body: "Use one email for checkout and account access.",
    },
    {
      title: "Access License Hub",
      body: "Sign in with that email after purchase.",
    },
  ] as const;
  const faqItems = [
    {
      question: "Monthly vs Yearly",
      answer: "Monthly and Yearly change billing cadence only. Pro stays Pro, and Pro+ stays Pro+.",
    },
    {
      question: "How do I access License Hub after purchase?",
      answer: (
        <>
          Use the purchase email to sign in at <Link href="/login">License Hub login</Link>.
        </>
      ),
    },
    {
      question: "How do I buy Enterprise?",
      answer: (
        <>
          Enterprise stays contact-led. Use the <Link href="/contact">contact page</Link> to start the buying process.
        </>
      ),
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 8, padding: 28 }}>
          <p style={eyebrowStyle}>Pricing</p>
          <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.02 }}>MindForge Guard Pricing</h1>
          <p style={{ ...mutedTextStyle, margin: 0, fontSize: 18, maxWidth: 680 }}>
            Choose your edition, buy with your email, and get into License Hub fast.
          </p>
        </section>

        <div id="pricing-grid">
          <PricingClient
            environment={config.environment}
            clientToken={config.clientToken}
            successUrl={config.successUrl}
            cancelUrl={config.cancelUrl}
            editions={editions}
          />
        </div>

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={eyebrowStyle}>How it works</p>
            <h2 style={{ margin: 0 }}>Buy in three steps</h2>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {deliverySteps.map((step) => (
              <article
                key={step.title}
                style={{ padding: 16, borderRadius: 14, background: "#fffaf0", border: "1px solid #d8ccae" }}
              >
                <strong>{step.title}</strong>
                <p style={{ ...mutedTextStyle, margin: "6px 0 0" }}>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={eyebrowStyle}>FAQ</p>
            <h2 style={{ margin: 0 }}>Common questions</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {faqItems.map((item) => (
              <article
                key={item.question}
                style={{ padding: 16, borderRadius: 14, background: "#fffaf0", border: "1px solid #d8ccae" }}
              >
                <strong>{item.question}</strong>
                <p style={{ ...mutedTextStyle, margin: "6px 0 0" }}>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
