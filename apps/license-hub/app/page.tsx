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

const v7FirstReportLinks = [
  {
    label: "v7.0 First Report Candidate doc",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
  },
  {
    label: "HR example Evidence Pack",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/tree/main/examples/single-agent-governance-pack/hr-self-service-agent",
  },
  {
    label: "GitHub Release v7.0.1",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.1",
  },
  {
    label: "Historical GitHub Release v7.0.0",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/releases/tag/v7.0.0",
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
            <h2 style={{ margin: 0 }}>Generate your first governance report</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              v7.0.1 is the recommended install target because it restores the packaged CLI entrypoint.
              Install <code>@veeduzyl/mindforge-guard@7.0.1</code>, use the HR self-service example Evidence Pack,
              run <code>pack validate</code>, then run <code>report single-agent</code>.
            </p>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Historical context: v7.0.0 is published as a prior release, including
              <code> @veeduzyl/mindforge-guard@7.0.0</code>; use v7.0.1 for current installs.
            </p>
            <p style={{ ...mutedTextStyle, margin: 0 }}>
              Read authority, behavior evidence, and risk/drift signals for human review. Guard remains
              recommendation-only, non-executing, and non-control-plane.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {v7FirstReportLinks.map((link) => (
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
              Review the current trust, setup, and demo docs before you upgrade.
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
