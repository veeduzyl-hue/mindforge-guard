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

const trustDemoHelperCards = [
  {
    title: "Start with a safe first run",
    body: "Verify what Guard helps your team inspect before you choose a paid license.",
    links: [
      {
        label: "First 10 Minutes",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/first-10-minutes.md",
      },
    ],
  },
  {
    title: "Understand the boundary",
    body: "Review what Guard does and does not do before it enters higher-risk delivery paths.",
    links: [
      {
        label: "Safety Boundary",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/trust/safety-boundary.md",
      },
      {
        label: "Trust FAQ",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/trust-faq.md",
      },
    ],
  },
  {
    title: "Choose and compare with confidence",
    body: "Use the current edition guide and demos before you upgrade or buy for a team.",
    links: [
      {
        label: "Choose the Right Edition",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/edition-value-map.md",
      },
      {
        label: "Current Product Demos",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/demos/current/README.md",
      },
    ],
  },
] as const;

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

        <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0 }}>Before you choose a license</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Review the current trust, setup, and demo docs before you upgrade.
            </p>
          </div>
          <div className="helper-grid">
            {trustDemoHelperCards.map((card) => (
              <article
                key={card.title}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#fffaf0",
                  border: "1px solid #d8ccae",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 184,
                }}
              >
                <strong>{card.title}</strong>
                <p style={{ ...mutedTextStyle, margin: 0 }}>{card.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                  {card.links.map((link) => (
                    <a key={link.label} href={link.href} style={secondaryButtonStyle}>
                      {link.label}
                    </a>
                  ))}
                </div>
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
          <div className="faq-grid">
            {compactFaq.map((item) => (
              <article
                key={item.question}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#fffaf0",
                  border: "1px solid #d8ccae",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 172,
                }}
              >
                <strong>{item.question}</strong>
                <p style={{ ...mutedTextStyle, margin: 0 }}>{item.answer}</p>
              </article>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
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
      <style jsx>{`
        .helper-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: stretch;
          max-width: 980px;
        }

        .faq-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: stretch;
        }

        @media (max-width: 960px) {
          .helper-grid,
          .faq-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .helper-grid,
          .faq-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
