import { getPaddlePriceByKey, type PaddlePlanKey } from "./paddlePrices";

const publicProjectDocsUrl = "https://github.com/veeduzyl-hue/mindforge-guard";

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
      summary: "Use MindForge Guard locally with the community policy when a commercial license is not required.",
      editionLabel: "Community",
      billingIntervalLabel: "Free",
      deliveryLabel: "Community access",
      ctaLabel: "Read docs",
      kind: "community",
      bullets: [
        "Local Guard CLI use with the community policy",
        "No commercial checkout required",
        "Audit, permit, and classify behavior remains local and unchanged",
      ],
    },
    checkoutOffer({
      slug: "pro-monthly",
      title: "Pro Monthly",
      summary: "Commercial Guard access for individual developers or small teams that want signed license delivery and account visibility on a monthly billing cycle.",
      editionLabel: "Pro",
      billingIntervalLabel: "Monthly",
      priceDisplay: "$19 / month",
      deliveryLabel: "Licensing Center + CLI install",
      bullets: [
        "Signed license JSON delivered through the Licensing Center",
        "Local Guard CLI license install and status remain authoritative",
        "Account access for orders, billing status, and license downloads",
      ],
      priceKey: "pro_monthly",
    }),
    checkoutOffer({
      slug: "pro-annual",
      title: "Pro Yearly",
      summary: "Annual commercial Guard access for teams that prefer yearly purchasing and the same signed-license delivery.",
      editionLabel: "Pro",
      billingIntervalLabel: "Yearly",
      priceDisplay: "$199 / year",
      deliveryLabel: "Licensing Center + CLI install",
      bullets: [
        "Same signed-license delivery as Pro Monthly",
        "Annual billing through the commercial checkout path",
        "No hosted control-plane dependency for local Guard verification",
      ],
      priceKey: "pro_annual",
    }),
    checkoutOffer({
      slug: "pro-plus-monthly",
      title: "Pro+ Monthly",
      summary: "Monthly access for the higher commercial edition with the same signed-license delivery and local install model.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Monthly",
      priceDisplay: "$49 / month",
      deliveryLabel: "Licensing Center + CLI install",
      bullets: [
        "Commercial fulfillment still ends in a signed downloadable license",
        "Billing lifecycle remains visible in customer account pages",
        "Built for users who need the expanded Pro+ entitlement set",
      ],
      priceKey: "pro_plus_monthly",
    }),
    checkoutOffer({
      slug: "pro-plus-annual",
      title: "Pro+ Yearly",
      summary: "Annual access for the higher commercial edition using Licensing Center delivery and local Guard CLI installation.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Yearly",
      priceDisplay: "$499 / year",
      deliveryLabel: "Licensing Center + CLI install",
      bullets: [
        "Same bounded product posture as the rest of the commercial line",
        "Customer access through portal, account, and downloadable signed licenses",
        "Annual purchasing for Pro+ commercial use",
      ],
      priceKey: "pro_plus_annual",
    }),
    {
      slug: "enterprise",
      title: "Enterprise",
      summary: "Contact-led purchasing for procurement, legal review, and organization rollout planning.",
      editionLabel: "Enterprise",
      billingIntervalLabel: "Contact us",
      deliveryLabel: "Direct review",
      ctaLabel: "Contact sales",
      kind: "contact",
      bullets: [
        "Commercial review for procurement and legal requirements",
        "Support for organization rollout questions",
        "Bounded licensing posture remains aligned with Pro+ capabilities",
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
      eyebrow: "",
      priceLabel: "Free",
      summary: "Start with local visibility for AI-assisted work before release.",
      features: [
        "Run the local Guard CLI with the community policy",
        "Audit, permit, and classify behavior stays local and unchanged",
        "Use the public docs and repository materials",
      ],
      mode: "community",
      ctaLabel: "Read docs",
      ctaHref: publicProjectDocsUrl,
    },
    {
      slug: "pro",
      title: "Pro",
      eyebrow: "",
      priceLabel: "Monthly / yearly",
      summary: "For individuals and small teams that need signed license delivery and stronger release-trust workflows.",
      features: [
        "Signed license delivery through the Licensing Center",
        "Customer Portal visibility for orders, billing state, and license downloads",
        "Local Guard CLI install and status remain license-file based",
      ],
      mode: "self_serve",
      monthlyOffer: proMonthly,
      yearlyOffer: proAnnual,
    },
    {
      slug: "pro-plus",
      title: "Pro+",
      eyebrow: "",
      priceLabel: "Monthly / yearly",
      summary: "For teams that need deeper comparison and paid analytics depth in practice.",
      features: [
        "Includes Pro delivery and customer account visibility",
        "Designed for commercial users who need Pro+ entitlements",
        "Available through monthly or yearly purchase",
      ],
      mode: "self_serve",
      monthlyOffer: proPlusMonthly,
      yearlyOffer: proPlusAnnual,
    },
    {
      slug: "enterprise",
      title: enterprise.title,
      eyebrow: "",
      priceLabel: "Contact sales",
      summary: "Contact-led purchasing for procurement, legal review, and organization rollout planning.",
      features: [
        "Procurement, legal, and rollout questions handled directly",
        "Current commercial entitlement boundary remains aligned with Pro+",
        "No hosted control-plane or extra runtime authority is introduced",
      ],
      mode: "contact",
      ctaLabel: "Contact sales",
      ctaHref: "/contact",
    },
  ] as const;
}
