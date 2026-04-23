export const productPositioning = {
  eyebrow: "Runtime governance for AI-assisted execution",
  headline: "Ship AI-assisted work with release trust you can verify.",
  body:
    "AI accelerates execution. Guard gives teams the missing governance surface: execution visibility, local verification, and reviewable evidence before work reaches release.",
  shortDefinition: "A local way to make AI-assisted work visible, verifiable, and reviewable before release.",
} as const;

export const primaryCtas = {
  buy: "Buy Guard",
  pricing: "View Pricing",
  demos: "See Real Demos",
  portal: "Open Customer Portal",
} as const;

export const whyItMatters = [
  {
    title: "AI-assisted execution moves faster than review",
    body: "Teams can ship more change, but lose confidence when the execution trail is hard to inspect.",
  },
  {
    title: "Release trust needs evidence",
    body: "Guard turns governance checks into local, reviewable signals your team can use before release.",
  },
  {
    title: "Adoption should not require a takeover",
    body: "Use Guard alongside existing workflows without forcing a hosted control plane into the main path.",
  },
] as const;

export const adoptionReasons = [
  "Make AI-assisted work visible before it becomes release drift",
  "Verify governance locally instead of depending on a hidden service",
  "Compare change over time when static status is not enough",
  "Give buyers and reviewers a concrete path from evidence to release confidence",
] as const;

const repoDocsBase = "https://github.com/veeduzyl-hue/mindforge-guard/blob/main/docs/demos";

export const demoCards = [
  {
    eyebrow: "Demo A",
    title: "Review AI-assisted changes before release",
    body:
      "See how Guard makes AI-assisted work visible before it becomes downstream release risk. This is the fastest way to understand the day-to-day adoption value.",
    cta: "View demo",
    href: `${repoDocsBase}/DEMO_A_AI_CODING_GOVERNANCE.md`,
  },
  {
    eyebrow: "Demo B",
    title: "Prove release governance readiness",
    body:
      "Walk through release evidence, readiness artifacts, and verification surfaces that make governance review concrete before publication.",
    cta: "Read walkthrough",
    href: `${repoDocsBase}/DEMO_B_RELEASE_GOVERNANCE.md`,
  },
  {
    eyebrow: "Demo C",
    title: "Compare editions in practice",
    body:
      "Use one buyer scenario to see where Community ends, why Pro matters, and when Pro+ becomes the practical upgrade.",
    cta: "See workflow",
    href: `${repoDocsBase}/DEMO_C_COMMERCIAL_EDITIONS_BOUNDARY.md`,
  },
] as const;

export const faqItems = [
  {
    question: "What is Guard?",
    answer: productPositioning.shortDefinition,
  },
  {
    question: "Why do teams need it?",
    answer:
      "AI-assisted execution can outpace release review. Guard gives teams visibility and evidence before that work ships.",
  },
  {
    question: "Where do I buy?",
    answer: "Choose Pro or Pro+ on Pricing, then use the purchase email for Customer Portal access.",
  },
  {
    question: "Does Guard become a control plane?",
    answer:
      "No. Guard remains local-first and non-executing. Commercial licensing supports access and delivery, not runtime takeover.",
  },
  {
    question: "Where are the boundaries?",
    answer: "Detailed license, legal, and product-boundary language lives in Docs and Legal.",
  },
] as const;

export const boundarySummary =
  "MindForge Guard remains recommendation-only, additive-only, non-executing, and local-first. Licensing supports purchase and delivery without changing Guard CLI semantics.";

export const releaseAnnouncement = {
  title: "MindForge Guard is now available for commercial purchase",
  subtitle:
    "A runtime governance layer for AI-assisted execution, built for teams that need release trust, local verification, and usable governance evidence without adopting a hosted control plane.",
  bullets: [
    "Review AI-assisted changes before they become release drift",
    "Produce verifiable governance evidence before publication",
    "Choose Community, Pro, Pro+, or Enterprise from a clear commercial edition boundary",
    "Buy through the Licensing Center and install the signed license locally",
  ],
} as const;
