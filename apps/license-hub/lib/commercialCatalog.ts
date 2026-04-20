import { getPaddlePriceByKey, type PaddlePlanKey } from "./paddlePrices";

export type CommercialOfferKind = "community" | "paddle_checkout" | "contact";

export interface CommercialOffer {
  slug: string;
  title: string;
  summary: string;
  editionLabel: string;
  billingIntervalLabel: string;
  deliveryLabel: string;
  ctaLabel: string;
  kind: CommercialOfferKind;
  bullets: readonly string[];
  priceKey?: PaddlePlanKey;
  priceId?: string;
}

export type PricingEditionMode = "community" | "self_serve" | "contact";

export interface PricingEdition {
  slug: string;
  title: string;
  eyebrow: string;
  priceLabel: string;
  summary: string;
  audience: string;
  audienceLabel: string;
  includesLead: string;
  includes: readonly string[];
  upgradeNote: string;
  billingNote?: string;
  mode: PricingEditionMode;
  ctaLabel?: string;
  ctaHref?: string;
  monthlyOffer?: CommercialOffer;
  yearlyOffer?: CommercialOffer;
}

function requirePrice(key: PaddlePlanKey) {
  const price = getPaddlePriceByKey(key);
  if (!price) {
    throw new Error(`Missing Paddle price definition for ${key}`);
  }
  return price;
}

function checkoutOffer(input: {
  slug: string;
  title: string;
  summary: string;
  editionLabel: string;
  billingIntervalLabel: string;
  deliveryLabel: string;
  bullets: readonly string[];
  priceKey: PaddlePlanKey;
}): CommercialOffer {
  const price = requirePrice(input.priceKey);
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    editionLabel: input.editionLabel,
    billingIntervalLabel: input.billingIntervalLabel,
    deliveryLabel: input.deliveryLabel,
    ctaLabel: `Buy ${input.title}`,
    kind: "paddle_checkout",
    bullets: input.bullets,
    priceKey: price.key,
    priceId: price.priceId,
  };
}

export function getCommercialOffers(): readonly CommercialOffer[] {
  return [
    {
      slug: "community",
      title: "Community",
      summary: "Use MindForge Guard without a commercial checkout when the repository-level community policy is enough.",
      editionLabel: "Community",
      billingIntervalLabel: "No self-serve payment",
      deliveryLabel: "Repo policy only",
      ctaLabel: "Read docs",
      kind: "community",
      bullets: [
        "No Paddle checkout",
        "No commercial license delivery",
        "Keep local audit, permit, and classify flows unchanged",
      ],
    },
    checkoutOffer({
      slug: "pro-monthly",
      title: "Pro Monthly",
      summary: "Commercial Guard delivery for individual developers or small teams that want a signed license and account visibility on a monthly billing cycle.",
      editionLabel: "Pro",
      billingIntervalLabel: "Monthly",
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Signed license JSON delivered through License Hub",
        "Guard CLI local verify, install, and status remain authoritative",
        "Portal and account pages expose orders, billing, and license downloads",
      ],
      priceKey: "pro_monthly",
    }),
    checkoutOffer({
      slug: "pro-annual",
      title: "Pro Annual",
      summary: "Annual commercial delivery for the same bounded Pro surface, using the verified Paddle-hosted checkout path.",
      editionLabel: "Pro",
      billingIntervalLabel: "Annual",
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Uses the same commercial license semantics as Pro Monthly",
        "Checkout is mapped to the verified annual Paddle catalog entry",
        "No dashboard or control-plane expansion is implied",
      ],
      priceKey: "pro_annual",
    }),
    checkoutOffer({
      slug: "pro-plus-monthly",
      title: "Pro+ Monthly",
      summary: "Monthly checkout for the higher commercial edition while preserving the same offline license installation model.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Monthly",
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Commercial fulfillment still ends in a signed downloadable license",
        "Billing lifecycle remains visible in License Hub account surfaces",
        "Checkout stays inside the verified four-price Paddle catalog",
      ],
      priceKey: "pro_plus_monthly",
    }),
    checkoutOffer({
      slug: "pro-plus-annual",
      title: "Pro+ Annual",
      summary: "Annual checkout for the higher commercial edition using the same verified License Hub delivery and Guard CLI install path.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Annual",
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Same bounded product posture as the rest of the commercial line",
        "No new seat, org, or platform semantics are introduced here",
        "Customer access is still through portal, account, and downloadable signed licenses",
      ],
      priceKey: "pro_plus_annual",
    }),
    {
      slug: "enterprise",
      title: "Enterprise",
      summary: "Enterprise discussions are contact-led. They do not go through the current self-serve checkout path.",
      editionLabel: "Enterprise",
      billingIntervalLabel: "Contact us",
      deliveryLabel: "Direct review",
      ctaLabel: "Contact sales",
      kind: "contact",
      bullets: [
        "No self-serve payment on the current site",
        "Use contact intake for procurement, legal, or rollout questions",
        "Do not assume a fully launched team or admin platform from this page",
      ],
    },
  ] as const;
}

function requireOffer(offers: readonly CommercialOffer[], slug: string): CommercialOffer {
  const offer = offers.find((entry) => entry.slug === slug);
  if (!offer) {
    throw new Error(`Missing commercial offer for ${slug}`);
  }
  return offer;
}

export function getPricingEditions(): readonly PricingEdition[] {
  const offers = getCommercialOffers();
  const community = requireOffer(offers, "community");
  const proMonthly = requireOffer(offers, "pro-monthly");
  const proAnnual = requireOffer(offers, "pro-annual");
  const proPlusMonthly = requireOffer(offers, "pro-plus-monthly");
  const proPlusAnnual = requireOffer(offers, "pro-plus-annual");
  const enterprise = requireOffer(offers, "enterprise");

  return [
    {
      slug: "community",
      title: community.title,
      eyebrow: "Open path",
      priceLabel: "Free",
      summary: "Start with the open Guard path when you want to evaluate, learn, or stay on a community-only buying motion.",
      audience: "Independent developers, evaluators, and teams that are not yet buying Guard commercially.",
      audienceLabel: "Best for",
      includesLead: "Base community capabilities include:",
      includes: [
        "Open access to the existing Guard community surface",
        "A straightforward way to explore Guard before any commercial commitment",
        "A clean upgrade path to Pro when you want commercial buying and account access",
      ],
      upgradeNote: "Upgrade to Pro when you want self-serve commercial purchase, portal access, and post-purchase account visibility.",
      mode: "community",
      ctaLabel: "Explore Community",
      ctaHref: "/docs",
    },
    {
      slug: "pro",
      title: "Pro",
      eyebrow: "Self-serve",
      priceLabel: "Monthly or Yearly",
      summary: "Move from evaluation into a clean commercial buying path for developers and smaller teams ready to adopt Guard seriously.",
      audience: "Individuals and small teams that want to buy Guard without switching into a contact-led sales process.",
      audienceLabel: "Best for",
      includesLead: "Includes Community all capabilities, plus:",
      includes: [
        "Self-serve commercial checkout for Guard",
        "License Hub portal access with order and billing visibility",
        "Commercial license delivery tied to the purchase email",
        "The same Pro edition whether you choose monthly or yearly billing",
      ],
      upgradeNote: "Upgrade to Pro+ when you want the higher commercial edition for broader internal rollout and a stronger buyer-facing package.",
      billingNote: "Choose the billing cadence that matches your budget. Monthly and yearly stay inside the same Pro edition.",
      mode: "self_serve",
      monthlyOffer: proMonthly,
      yearlyOffer: proAnnual,
    },
    {
      slug: "pro-plus",
      title: "Pro+",
      eyebrow: "Higher commercial edition",
      priceLabel: "Monthly or Yearly",
      summary: "Choose the higher commercial edition when your team wants a stronger rollout posture while keeping the same easy self-serve purchase flow.",
      audience: "Teams and organizations expanding beyond an individual buying motion and preparing for broader adoption.",
      audienceLabel: "Best for",
      includesLead: "Includes Pro all capabilities, plus:",
      includes: [
        "A higher commercial edition than Pro",
        "A clearer package for broader team rollout and internal stakeholder buy-in",
        "The same License Hub access and self-serve buying motion with a stronger commercial tier",
        "The same Pro+ edition whether you choose monthly or yearly billing",
      ],
      upgradeNote: "Move to Enterprise when procurement, legal review, or a contact-led buying process becomes part of the decision.",
      billingNote: "Choose monthly for flexibility or yearly for a committed buying cycle. Both stay inside the same Pro+ edition.",
      mode: "self_serve",
      monthlyOffer: proPlusMonthly,
      yearlyOffer: proPlusAnnual,
    },
    {
      slug: "enterprise",
      title: enterprise.title,
      eyebrow: "Contact-led",
      priceLabel: "Talk to us",
      summary: "Keep Enterprise contact-led when your buying process includes procurement, stakeholder review, or a tailored rollout conversation.",
      audience: "Teams with procurement, legal, security review, or customized commercial buying requirements.",
      audienceLabel: "Best for",
      includesLead: "Enterprise buying support includes:",
      includes: [
        "A contact-led commercial conversation instead of forced self-serve checkout",
        "Space for procurement, legal, and rollout planning",
        "A clearer path for larger-team or organization-level buying discussions",
      ],
      upgradeNote: "Use Enterprise when the decision needs a team buying motion rather than an individual self-serve purchase.",
      mode: "contact",
      ctaLabel: "Contact Enterprise",
      ctaHref: "/contact",
    },
  ] as const;
}
