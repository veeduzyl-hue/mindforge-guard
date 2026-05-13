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
    title: "Understand the evidence layer",
    body: "See how Guard turns AI-assisted work into reviewable governance evidence before it becomes trusted.",
    links: [
      {
        label: "Single-agent positioning brief",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_1_single_agent_governance_positioning.md",
      },
    ],
  },
  {
    title: "Review the first workflow",
    body: "Follow the first-report path for a sample single-agent action without turning one synthetic sample into the public hero path.",
    links: [
      {
        label: "First report workflow",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
      },
      {
        label: "Download to first report UX",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_download_to_first_report_ux.md",
      },
    ],
  },
  {
    title: "Choose review depth",
    body: "Compare editions by governance outcome depth while preserving the same bounded runtime posture.",
    links: [
      {
        label: "Choose the Right Edition",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/edition-value-map.md",
      },
      {
        label: "Trust FAQ",
        href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/trust-faq.md",
      },
    ],
  },
] as const;

const firstWorkflowLinks = [
  {
    label: "First report workflow",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
  },
  {
    label: "Synthetic sample evidence bundle",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent",
  },
  {
    label: "Technical install and docs",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_license_hub_copy_candidate.md",
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
  const cardButtonStyle = {
    ...secondaryButtonStyle,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    minHeight: 44,
    padding: "0 18px",
    lineHeight: 1.2,
    fontWeight: 700,
  };

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
            <h2 style={{ margin: 0 }}>Generate a governance report for a single-agent workflow</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Your license unlocks report and analytics depth, while Guard remains local-first, non-executing, and human-review-oriented.
            </p>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Review your first single-agent action with evidence. Start with a sample agent action. Guard validates the evidence bundle, generates a governance report, and shows reviewers the authority boundary, execution evidence, missing evidence, and risk/drift signals.
            </p>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              An Evidence Pack is the review bundle behind an AI-assisted action: task context, allowed scope, action trace, tool/data references, outputs, missing evidence, and reviewer notes.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {firstWorkflowLinks.map((link) => (
              <a key={link.label} href={link.href} style={cardButtonStyle}>
                {link.label}
              </a>
            ))}
          </div>
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
              Review the current trust, setup, and workflow docs before you upgrade.
            </p>
          </div>
          <div className="licenseHubHelperGrid">
            {trustDemoHelperCards.map((card) => (
              <article
                key={card.title}
                className="licenseHubCard licenseHubHelperCard"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#fffaf0",
                  border: "1px solid #d8ccae",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <strong>{card.title}</strong>
                <p style={{ ...mutedTextStyle, margin: 0 }}>{card.body}</p>
                <div className="licenseHubButtonRow">
                  {card.links.map((link) => (
                    <a key={link.label} href={link.href} style={cardButtonStyle}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Secondary technical install</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            The recommended install target for local validation is <code>@veeduzyl/mindforge-guard@7.0.1</code>. Keep <code>npm install -g @veeduzyl/mindforge-guard@7.0.1</code> in install/docs surfaces rather than the public commercial headline.
          </p>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            Guard remains recommendation-only, non-executing, non-control-plane, deterministic, and no extra runtime authority is added for Enterprise.
          </p>
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
          <div className="licenseHubFaqGrid">
            {compactFaq.map((item) => (
              <article
                key={item.question}
                className="licenseHubCard licenseHubFaqCard"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#fffaf0",
                  border: "1px solid #d8ccae",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
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
                ...cardButtonStyle,
                minWidth: 88,
                padding: "0 16px",
              }}
            >
              Legal
            </Link>
            <Link
              href="/support"
              style={{
                ...cardButtonStyle,
                minWidth: 88,
                padding: "0 16px",
              }}
            >
              Support
            </Link>
            <Link
              href="/docs"
              style={{
                ...cardButtonStyle,
                minWidth: 88,
                padding: "0 16px",
              }}
            >
              Docs
            </Link>
          </div>
        </section>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .licenseHubHelperGrid {
              display: grid;
              gap: 12px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              align-items: stretch;
              max-width: 980px;
            }

            .licenseHubFaqGrid {
              display: grid;
              gap: 12px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              align-items: stretch;
            }

            .licenseHubCard {
              align-self: stretch;
            }

            .licenseHubHelperCard {
              min-height: 196px;
            }

            .licenseHubFaqCard {
              min-height: 184px;
            }

            .licenseHubButtonRow {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: auto;
              align-items: center;
            }

            @media (max-width: 960px) {
              .licenseHubHelperGrid,
              .licenseHubFaqGrid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }

            @media (max-width: 640px) {
              .licenseHubHelperGrid,
              .licenseHubFaqGrid {
                grid-template-columns: minmax(0, 1fr);
              }
            }
          `,
        }}
      />
    </main>
  );
}
