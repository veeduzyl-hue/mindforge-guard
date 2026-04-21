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

const contactEmail = "billing@mail.mindforge.run";
const contactHref = `mailto:${contactEmail}?subject=MindForge%20Guard%20License%20Hub`;

export default function HomePage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const deliverySteps = [
    {
      title: "\u9009\u62e9\u7248\u672c",
      body: "\u9009\u62e9\u9700\u8981\u7684\u7248\u672c\u3002",
    },
    {
      title: "\u4f7f\u7528\u8d2d\u4e70\u90ae\u7bb1",
      body: "\u4f7f\u7528\u8d2d\u4e70\u90ae\u7bb1\u5b8c\u6210\u7ed3\u8d26\u3002",
    },
    {
      title: "\u8bbf\u95ee\u8bb8\u53ef\u8bc1\u4e2d\u5fc3",
      body: "\u767b\u5f55\u67e5\u770b\u8bb8\u53ef\u8bc1\u4e0e\u8d26\u5355\u3002",
    },
  ] as const;
  const faqItems = [
    {
      question: "\u6708\u4ed8\u548c\u5e74\u5ea6\u6709\u4ec0\u4e48\u533a\u522b\uff1f",
      answer: "\u4ec5\u8ba1\u8d39\u5468\u671f\u4e0d\u540c\u3002",
    },
    {
      question: "\u8d2d\u4e70\u540e\u5982\u4f55\u767b\u5f55\u8bb8\u53ef\u8bc1\u4e2d\u5fc3\uff1f",
      answer: "\u4f7f\u7528\u8d2d\u4e70\u90ae\u7bb1\u767b\u5f55\u3002",
    },
    {
      question: "\u5982\u4f55\u8d2d\u4e70 Enterprise\uff1f",
      answer: "\u8054\u7cfb\u9500\u552e\u5f00\u59cb\u91c7\u8d2d\u5ba1\u67e5\u3002",
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 18, padding: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.02 }}>MindForge Guard</h1>
              <p style={{ ...mutedTextStyle, margin: 0, fontSize: 18 }}>{"\u8bb8\u53ef\u8bc1\u4e2d\u5fc3"}</p>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/login" style={primaryButtonStyle}>
                {"\u767b\u5f55"}
              </Link>
            </nav>
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

        <section id="how-it-works" style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>{"\u8d2d\u4e70\u6b65\u9aa4"}</h2>
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

        <section id="quick-help" style={{ ...panelStyle, display: "grid", gap: 16 }} aria-labelledby="faq-heading">
          <div style={{ display: "grid", gap: 6 }}>
            <h2 id="faq-heading" style={{ margin: 0 }}>
              {"\u5e38\u89c1\u95ee\u9898"}
            </h2>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
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

        <section
          id="contact"
          style={{
            ...panelStyle,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            alignItems: "start",
          }}
        >
          <Link href="/docs" style={{ ...secondaryButtonStyle, display: "block", boxSizing: "border-box", textAlign: "center" }}>
            {"\u6587\u6863"}
          </Link>
          <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
            <a
              href={contactHref}
              aria-label={`Contact ${contactEmail}`}
              title={contactEmail}
              style={{ ...primaryButtonStyle, display: "block", boxSizing: "border-box", textAlign: "center" }}
            >
              {"\u8054\u7cfb"}
            </a>
            <span style={{ ...mutedTextStyle, minWidth: 0, overflowWrap: "anywhere", textAlign: "center", fontSize: 12 }}>
              {contactEmail}
            </span>
          </div>
          <Link href="/legal" style={{ ...secondaryButtonStyle, display: "block", boxSizing: "border-box", textAlign: "center" }}>
            Legal
          </Link>
        </section>
      </div>
    </main>
  );
}
