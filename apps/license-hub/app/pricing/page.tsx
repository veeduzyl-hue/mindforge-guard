import Link from "next/link";

import {
  SiteChrome,
  eyebrowStyle,
  mutedTextStyle,
  panelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  subtlePanelStyle,
} from "../siteChrome";
import { PricingClient } from "./PricingClient";
import { getPricingEditions } from "../../lib/commercialCatalog";
import { getPaddleClientBootConfig } from "../../lib/paddleCheckout";

export default function PricingPage() {
  const editions = getPricingEditions();
  const config = getPaddleClientBootConfig();
  const comparisonCards = [
    {
      title: "Community",
      summary: "Free starting point for learning, evaluation, and teams staying on the open path.",
    },
    {
      title: "Pro",
      summary: "Includes Community, plus self-serve commercial buying, portal access, and account visibility.",
    },
    {
      title: "Pro+",
      summary: "Includes Pro, plus the higher commercial edition for broader rollout and stronger buyer-facing packaging.",
    },
    {
      title: "Enterprise",
      summary: "Contact-led path for procurement, stakeholder review, and tailored team buying conversations.",
    },
  ] as const;
  const deliverySteps = [
    {
      title: "1. Choose your edition",
      body: "Start free with Community, move into self-serve with Pro or Pro+, or switch to Enterprise when the buying process needs a conversation.",
    },
    {
      title: "2. Buy with the right email",
      body: "For Pro and Pro+, choose monthly or yearly on the same card and purchase with the email that should own the account.",
    },
    {
      title: "3. Get portal access",
      body: "After purchase, use that same email to access License Hub, view your license, and check order and billing history.",
    },
  ] as const;
  const faqItems = [
    {
      question: "Do monthly and yearly unlock different capability?",
      answer: "No. Monthly and yearly change billing cadence, not the edition itself. Pro stays Pro, and Pro+ stays Pro+.",
    },
    {
      question: "What is the main difference between Community and Pro?",
      answer: "Community is the free starting point. Pro includes Community and adds self-serve commercial purchase, License Hub access, and post-purchase account visibility.",
    },
    {
      question: "How is Pro+ positioned?",
      answer: "Pro+ includes Pro and adds the higher commercial edition for teams that want a stronger rollout-ready commercial package without leaving the self-serve buying path.",
    },
    {
      question: "How do I access my license after purchase?",
      answer: "Use the same purchase email to sign in to License Hub, where you can view your license, order history, and billing visibility in one place.",
    },
    {
      question: "Is Enterprise self-serve on this page?",
      answer: "No. Enterprise remains contact-led so procurement and rollout discussions can happen before purchase.",
    },
  ] as const;

  return (
    <SiteChrome
      eyebrow="Commercial Editions"
      title="MindForge Guard Pricing"
      lede="Start with Community, move into Pro or Pro+ when you are ready to buy, and keep Enterprise contact-led for team, procurement, and tailored commercial conversations."
    >
      <section style={{ ...panelStyle, display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <p style={eyebrowStyle}>Hero</p>
          <h2 style={{ margin: 0, fontSize: 32 }}>A clearer upgrade path from free evaluation to commercial rollout</h2>
          <p style={{ ...mutedTextStyle, margin: 0, maxWidth: 860 }}>
            This page is built to help buyers understand who each edition is for, what it includes, and when it makes
            sense to move up from Community to Pro, Pro+, or Enterprise.
          </p>
        </div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ padding: 18, borderRadius: 16, background: "#fffaf0", border: "1px solid #d8ccae" }}>
            <strong>Community</strong>
            <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>Free for evaluation, learning, and teams staying on the open path.</p>
          </div>
          <div style={{ padding: 18, borderRadius: 16, background: "#fffaf0", border: "1px solid #d8ccae" }}>
            <strong>Pro</strong>
            <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>Self-serve commercial buying for developers and smaller teams.</p>
          </div>
          <div style={{ padding: 18, borderRadius: 16, background: "#fff6df", border: "1px solid #cfa24c" }}>
            <strong>Pro+</strong>
            <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>Higher commercial edition for broader rollout and stronger internal buy-in.</p>
          </div>
          <div style={{ padding: 18, borderRadius: 16, background: "#fffaf0", border: "1px solid #d8ccae" }}>
            <strong>Enterprise</strong>
            <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>Contact-led buying for procurement, teams, and tailored commercial review.</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/pricing#pricing-grid" style={primaryButtonStyle}>
            Compare editions
          </Link>
          <Link href="/contact" style={secondaryButtonStyle}>
            Talk to sales
          </Link>
        </div>
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

      <section style={{ ...subtlePanelStyle, display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={eyebrowStyle}>Capability comparison</p>
          <h2 style={{ margin: 0 }}>Edition difference at a glance</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            The cards above carry the main story. This section stays short and only reinforces the upgrade path.
          </p>
        </div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {comparisonCards.map((card) => (
            <article
              key={card.title}
              style={{ padding: 18, borderRadius: 16, background: "rgba(255,255,255,0.92)", border: "1px solid #d8ccae" }}
            >
              <strong>{card.title}</strong>
              <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>{card.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={eyebrowStyle}>How delivery works</p>
          <h2 style={{ margin: 0 }}>A simple buying and access flow</h2>
        </div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {deliverySteps.map((step) => (
            <article
              key={step.title}
              style={{ padding: 18, borderRadius: 16, background: "#fffaf0", border: "1px solid #d8ccae" }}
            >
              <strong>{step.title}</strong>
              <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={eyebrowStyle}>FAQ</p>
          <h2 style={{ margin: 0 }}>Common buying questions</h2>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {faqItems.map((item) => (
            <article
              key={item.question}
              style={{ padding: 18, borderRadius: 16, background: "#fffaf0", border: "1px solid #d8ccae" }}
            >
              <strong>{item.question}</strong>
              <p style={{ ...mutedTextStyle, margin: "8px 0 0" }}>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          ...panelStyle,
          display: "grid",
          gap: 16,
          background: "linear-gradient(135deg, rgba(31, 59, 99, 0.96), rgba(74, 103, 61, 0.96))",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ ...eyebrowStyle, color: "#f8d98b" }}>Enterprise contact</p>
          <h2 style={{ margin: 0, fontSize: 30 }}>Need a contact-led buying motion?</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", maxWidth: 760 }}>
            Enterprise stays off the self-serve path on purpose. Use the contact channel when the buying decision
            includes procurement, stakeholder alignment, or a more tailored commercial conversation.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/contact" style={{ ...primaryButtonStyle, background: "#ffffff", color: "#1f3b63" }}>
            Contact enterprise
          </Link>
          <Link href="/support" style={{ ...secondaryButtonStyle, borderColor: "rgba(255,255,255,0.5)", color: "#ffffff" }}>
            Support
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
