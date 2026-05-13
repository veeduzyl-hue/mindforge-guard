import Link from "next/link";

import { SiteChrome, mutedTextStyle, panelStyle, primaryButtonStyle, secondaryButtonStyle } from "../siteChrome";

const trustDocs = [
  {
    title: "Single-agent positioning brief",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/commercial/v7_0_1_single_agent_governance_positioning.md",
  },
  {
    title: "First report workflow",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/v7_0_first_report.md",
  },
  {
    title: "Trust FAQ",
    href: "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/product/current/trust-faq.md",
  },
] as const;

const useCases = [
  {
    title: "AI coding agents",
    body: "Review evidence behind AI-generated code changes before merge or release decisions.",
  },
  {
    title: "Support agents",
    body: "Inspect authority scope, action trace, and missing evidence before service actions are trusted.",
  },
  {
    title: "Operations agents",
    body: "Review execution evidence and risk/drift signals before operational follow-through enters a human process.",
  },
  {
    title: "Internal workflow agents",
    body: "Keep internal approvals, handoffs, and workflow actions reviewable without turning Guard into a control plane.",
  },
] as const;

const reviewSteps = [
  "Start with a sample agent action.",
  "Validate the evidence bundle locally.",
  "Generate a governance report for reviewer reading.",
  "Inspect the authority boundary, execution evidence, missing evidence, and risk/drift signals.",
] as const;

const editionCards = [
  {
    title: "Community",
    body: "See the current governance evidence for one agent workflow.",
  },
  {
    title: "Pro",
    body: "Track governance signals over time.",
  },
  {
    title: "Pro+",
    body: "Compare evidence states and uncover deeper signals.",
  },
  {
    title: "Enterprise",
    body: "Standardize adoption, review packets, and procurement around the same bounded runtime posture. No extra runtime authority.",
  },
] as const;

export default function ProductPage() {
  return (
    <SiteChrome
      eyebrow="Product"
      title="Make AI-assisted work reviewable before it becomes trusted."
      lede="MindForge Guard is a deterministic governance evidence layer for single-agent AI workflows. It helps teams inspect authority, evidence, state, and decision boundaries before AI-assisted work is accepted into business or engineering processes."
      showHeaderNote={false}
    >
      <section style={{ ...panelStyle, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Single-agent governance evidence for human review</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            Not an approval system. Not a blocker. Not a control plane.
          </p>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            Guard remains recommendation-only, non-executing, deterministic, local-first where applicable, and human-review-oriented.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/#pricing" style={primaryButtonStyle}>
            Choose edition
          </Link>
          <Link href="/docs" style={secondaryButtonStyle}>
            Read docs
          </Link>
          <Link href="/faq" style={secondaryButtonStyle}>
            FAQ
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {useCases.map((item) => (
          <article key={item.title} style={{ ...panelStyle, display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>{item.title}</h2>
            <p style={{ ...mutedTextStyle, margin: 0 }}>{item.body}</p>
          </article>
        ))}
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0 }}>From Evidence Pack to governance report</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            An Evidence Pack is the review bundle behind an AI-assisted action: task context, allowed scope, action trace, tool/data references, outputs, missing evidence, and reviewer notes.
          </p>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            Guard turns that evidence bundle into a governance report so reviewers can inspect authority boundary, execution evidence, missing evidence, and risk/drift signals before AI-assisted work is trusted.
          </p>
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Review your first single-agent action with evidence</h2>
          <p style={{ ...mutedTextStyle, margin: 0 }}>
            Start with a sample agent action. Guard validates the evidence bundle, generates a governance report, and shows reviewers the authority boundary, execution evidence, missing evidence, and risk/drift signals.
          </p>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {reviewSteps.map((step) => (
            <div key={step} style={{ padding: 14, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae" }}>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          A synthetic sample evidence bundle for local validation can help teams see the workflow without making one sample workflow the public hero story.
        </p>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0 }}>Editions by customer outcome</h2>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {editionCards.map((item) => (
            <article key={item.title} style={{ padding: 14, borderRadius: 12, background: "#fffaf0", border: "1px solid #d8ccae", display: "grid", gap: 8 }}>
              <strong>{item.title}</strong>
              <p style={{ ...mutedTextStyle, margin: 0 }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Trust and workflow docs</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          Use these docs to compare editions, explain the bounded posture, and move from evidence bundle to review bundle without authority expansion.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {trustDocs.map((doc) => (
            <a key={doc.title} href={doc.href} style={secondaryButtonStyle}>
              {doc.title}
            </a>
          ))}
        </div>
      </section>

        <section style={{ ...panelStyle, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Secondary technical install</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          The recommended install target for local validation is v7.0.1 via <code>@veeduzyl/mindforge-guard@7.0.1</code>.
          Use <code>npm install -g @veeduzyl/mindforge-guard@7.0.1</code> in technical setup docs, not as the public hero story.
        </p>
      </section>

      <section style={{ ...panelStyle, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Boundary</h2>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          Guard stays recommendation-only, additive-only, non-executing, default-off where applicable, non-control-plane, deterministic, local-first where applicable, and human-review-oriented.
        </p>
        <p style={{ ...mutedTextStyle, margin: 0 }}>
          No approval system. No blocking system. No safe-to-deploy claim. No legal compliance guarantee. No compliance certification. No maturity certification.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/legal" style={secondaryButtonStyle}>
            Legal
          </Link>
          <Link href="/docs" style={secondaryButtonStyle}>
            Docs
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
