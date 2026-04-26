import Link from "next/link";

import { getPricingEditions } from "../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../lib/paddleCheckout";
import {
  mutedTextStyle,
  pageBackgroundStyle,
  panelStyle,
  secondaryButtonStyle,
} from "./siteChrome";
import { PricingClient } from "./pricing/PricingClient";

export default function HomePage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const purchaseFlow = [
    {
      title: "Choose an edition",
      body: "Pick Community, Pro, Pro+, or Enterprise.",
    },
    {
      title: "Use your purchase email",
      body: "Use one email for checkout, sign-in, and delivery visibility.",
    },
    {
      title: "Sign in after purchase",
      body: "Open License Hub with the same email for licenses and billing.",
    },
  ] as const;
  const compactFaq = [
    {
      question: "Where does checkout happen?",
      answer: "Checkout starts below on the License Hub pricing surface after you enter the purchase email.",
    },
    {
      question: "How do I sign in after purchase?",
      answer: "Use the same purchase email to sign in to License Hub and access licenses, billing, and account pages.",
    },
    {
      question: "How are licenses delivered?",
      answer: "After purchase, signed licenses are delivered through License Hub for download and account visibility.",
    },
    {
      question: "Is MindForge Guard still local after purchase?",
      answer: "Yes. License Hub adds purchase, delivery, and account access without changing local Guard CLI behavior.",
    },
    {
      question: "How does Enterprise purchasing work?",
      answer: "Enterprise remains contact-led. Use the Enterprise card or Contact/Support paths for procurement and rollout questions.",
    },
    {
      question: "Where can I find legal and support information?",
      answer: "Use Legal for terms, privacy, refunds, and boundaries. Use Support for purchase, delivery, and account help.",
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 12, padding: 20 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>
                MindForge Guard
              </h1>
              <p style={{ margin: 0, color: "#5b5444", fontSize: 15, fontWeight: 600 }}>
                License Hub
              </p>
            </div>
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

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>Purchase flow</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>Three steps: buy, sign in, manage access.</p>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {purchaseFlow.map((step) => (
              <article key={step.title} style={{ padding: 16, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
                <strong>{step.title}</strong>
                <p style={{ ...mutedTextStyle, margin: "6px 0 0" }}>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="quick-help" style={{ ...panelStyle, display: "grid", gap: 16 }} aria-labelledby="faq-heading">
          <div style={{ display: "grid", gap: 6 }}>
            <h2 id="faq-heading" style={{ margin: 0 }}>
              Purchase and account FAQ
            </h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Use these answers when you need help buying, signing in, or finding support.
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
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            <Link
              href="/legal"
              style={{
                ...secondaryButtonStyle,
                minWidth: 88,
                padding: "9px 14px",
                textAlign: "center",
              }}
            >
              Legal
            </Link>
            <Link
              href="/support"
              style={{
                ...secondaryButtonStyle,
                minWidth: 88,
                padding: "9px 14px",
                textAlign: "center",
              }}
            >
              Support
            </Link>
            <Link
              href="/docs"
              style={{
                ...secondaryButtonStyle,
                minWidth: 88,
                padding: "9px 14px",
                textAlign: "center",
              }}
            >
              Docs
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
