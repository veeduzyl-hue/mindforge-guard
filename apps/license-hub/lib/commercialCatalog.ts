import { getPaddlePriceByKey, type PaddlePlanKey } from "./paddlePrices";

export type CommercialOfferKind = "community" | "paddle_checkout" | "contact";

export interface CommercialOffer {
  slug: string;
  title: string;
  summary: string;
  editionLabel: string;
  billingIntervalLabel: string;
  priceDisplay?: string;
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
  features: readonly string[];
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
  priceDisplay: string;
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
    priceDisplay: input.priceDisplay,
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
      priceDisplay: "$19 / month",
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
      title: "Pro Yearly",
      summary: "Annual commercial delivery for the same bounded Pro surface, using the verified Paddle-hosted checkout path.",
      editionLabel: "Pro",
      billingIntervalLabel: "Yearly",
      priceDisplay: "$199 / year",
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
      priceDisplay: "$49 / month",
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
      title: "Pro Plus Yearly",
      summary: "Annual checkout for the higher commercial edition using the same verified License Hub delivery and Guard CLI install path.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Yearly",
      priceDisplay: "$499 / year",
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
      summary: "Free path for evaluation and local use.",
      features: ["Open docs", "Local verification", "No checkout"],
      mode: "community",
      ctaLabel: "View Docs",
      ctaHref: "/#quick-help",
    },
    {
      slug: "pro",
      title: "Pro",
      eyebrow: "Self-serve",
      priceLabel: "Monthly / Yearly",
      summary: "Self-serve commercial buying for individuals and small teams.",
      features: ["Self-serve checkout", "License Hub access", "Billing visibility"],
      mode: "self_serve",
      monthlyOffer: proMonthly,
      yearlyOffer: proAnnual,
    },
    {
      slug: "pro-plus",
      title: "Pro+",
      eyebrow: "Higher commercial edition",
      priceLabel: "Monthly / Yearly",
      summary: "Higher commercial tier for broader rollout.",
      features: ["Drift timeline", "Assoc correlate", "Higher commercial tier"],
      mode: "self_serve",
      monthlyOffer: proPlusMonthly,
      yearlyOffer: proPlusAnnual,
    },
    {
      slug: "enterprise",
      title: enterprise.title,
      eyebrow: "Contact-led",
      priceLabel: "Contact us",
      summary: "Contact-led buying for procurement-managed teams.",
      features: ["Contact-led buying", "Procurement review", "Custom terms"],
      mode: "contact",
      ctaLabel: "Contact Sales",
      ctaHref: "/#contact",
    },
  ] as const;
}
