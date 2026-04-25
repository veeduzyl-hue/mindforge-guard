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
import { PricingClient } from "./pricing/PricingClient";

export default function HomePage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const compactFaq = [
    {
      question: "Where do I buy?",
      answer: "Choose Community, Pro, Pro+, or Enterprise below. Use the purchase email field before starting checkout.",
    },
    {
      question: "How do I sign in after purchase?",
      answer: "Use the same purchase email to sign in to License Hub and access licenses, billing, and account pages.",
    },
    {
      question: "Where do legal, support, and boundary details live?",
      answer: "Use Legal for terms, privacy, refunds, and boundaries. Use Support for purchase, delivery, and account help.",
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 18, padding: 28 }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 760 }}>
            <p style={{ margin: 0, color: "#946c2b", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
              MindForge Guard License Hub
            </p>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.05 }}>
              Purchase, sign in, and manage your License Hub account.
            </h1>
            <p style={{ ...mutedTextStyle, margin: 0, fontSize: 17, maxWidth: 720 }}>
              Buy a license, sign in with your purchase email, and manage delivery and account access in one place.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="#pricing" style={primaryButtonStyle}>
              See pricing
            </Link>
            <Link href="/login" style={secondaryButtonStyle}>
              Sign in
            </Link>
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
              Purchase and account FAQ
            </h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Use these links when you need help buying, signing in, or finding legal and support details.
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
            <Link href="/login" style={secondaryButtonStyle}>
              Login
            </Link>
            <Link href="/faq" style={secondaryButtonStyle}>
              FAQ
            </Link>
            <Link href="/legal" style={secondaryButtonStyle}>
              Legal
            </Link>
            <Link href="/support" style={secondaryButtonStyle}>
              Support
            </Link>
            <Link href="/docs" style={secondaryButtonStyle}>
              Docs
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
