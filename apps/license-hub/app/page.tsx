import Link from "next/link";

import { getPricingEditions } from "../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../lib/paddleCheckout";
import {
  eyebrowStyle,
  mutedTextStyle,
  pageBackgroundStyle,
  panelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  subtlePanelStyle,
} from "./siteChrome";
import { PricingClient } from "./pricing/PricingClient";

const docsHref = "https://github.com/veeduzyl-hue/mindforge-guard/tree/main/apps/license-hub";

export default function HomePage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const deliverySteps = [
    {
      title: "Choose your edition",
      body: "Pick Community, Pro, Pro+, or Enterprise.",
    },
    {
      title: "Buy with your email",
      body: "Use one email for checkout and License Hub.",
    },
    {
      title: "Access License Hub",
      body: "Sign in after purchase to view billing and licenses.",
    },
  ] as const;
  const faqItems = [
    {
      question: "Monthly vs Yearly",
      answer: "Monthly and Yearly change billing cadence only. Pro stays Pro, and Pro+ stays Pro+.",
    },
    {
      question: "How do I access License Hub after purchase?",
      answer: "Use the purchase email at login to open your portal and account surfaces.",
    },
    {
      question: "How do I buy Enterprise?",
      answer: "Enterprise stays contact-led. Use the contact lane below to start procurement review.",
    },
  ] as const;
  const helpCards = [
    {
      title: "Login",
      body: "Open License Hub with the purchase email.",
      href: "/login",
      label: "Open Login",
      style: primaryButtonStyle,
    },
    {
      title: "Contact",
      body: "Use sales, support, or billing contact lanes.",
      href: "/#contact",
      label: "Open Contact",
      style: secondaryButtonStyle,
    },
    {
      title: "Docs",
      body: "Read the repo guide for install and verify.",
      href: docsHref,
      label: "Open Docs",
      style: secondaryButtonStyle,
    },
    {
      title: "Legal",
      body: "Terms, privacy, and refund policy in one page.",
      href: "/legal",
      label: "Open Legal",
      style: secondaryButtonStyle,
    },
  ] as const;

  return (
    <main style={pageBackgroundStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <section style={{ ...panelStyle, display: "grid", gap: 24, padding: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <p style={eyebrowStyle}>License Hub</p>
              <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.02 }}>Buy MindForge Guard fast.</h1>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/#pricing" style={secondaryButtonStyle}>
                Pricing
              </Link>
              <Link href="/#quick-help" style={secondaryButtonStyle}>
                Help
              </Link>
              <Link href="/legal" style={secondaryButtonStyle}>
                Legal
              </Link>
              <Link href="/login" style={primaryButtonStyle}>
                Login
              </Link>
            </nav>
          </div>

          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={{ display: "grid", gap: 14 }}>
              <p style={{ ...mutedTextStyle, margin: 0, fontSize: 18, maxWidth: 640 }}>
                Choose your edition, buy with your email, and get into License Hub without extra steps.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/#pricing" style={primaryButtonStyle}>
                  Choose a Plan
                </Link>
                <Link href="/login" style={secondaryButtonStyle}>
                  Portal Login
                </Link>
              </div>
            </div>

            <div
              style={{
                ...subtlePanelStyle,
                display: "grid",
                gap: 10,
                padding: 18,
                alignContent: "start",
              }}
            >
              <strong>What you get</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["Self-serve checkout", "License Hub access", "Billing visibility"].map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      padding: "8px 12px",
                      background: "#fffaf0",
                      border: "1px solid #d8ccae",
                      fontWeight: 600,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{ display: "grid", gap: 12 }}>
          <div style={{ ...panelStyle, display: "grid", gap: 8, padding: 24 }}>
            <p style={eyebrowStyle}>Pricing</p>
            <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.05 }}>Choose your edition</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>Four editions. Two self-serve paths. One email through checkout and portal.</p>
          </div>
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

        <section id="quick-help" style={{ ...panelStyle, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={eyebrowStyle}>Quick help</p>
            <h2 style={{ margin: 0 }}>FAQ and next actions</h2>
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

          <div
            id="contact"
            style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {helpCards.map((card) => (
              <article
                key={card.title}
                style={{ padding: 16, borderRadius: 14, background: "#fffaf0", border: "1px solid #d8ccae" }}
              >
                <strong>{card.title}</strong>
                <p style={{ ...mutedTextStyle, margin: "6px 0 12px" }}>{card.body}</p>
                {card.href.startsWith("http") ? (
                  <a href={card.href} style={card.style}>
                    {card.label}
                  </a>
                ) : (
                  <Link href={card.href} style={card.style}>
                    {card.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
