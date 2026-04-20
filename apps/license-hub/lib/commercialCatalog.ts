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
      eyebrow: "",
      priceLabel: "Free",
      summary: "\u67e5\u770b\u5f53\u524d\u6cbb\u7406\u72b6\u6001\u3002",
      features: [
        "\u67e5\u770b policy\u3001audit \u4e0e snapshot \u7ed3\u679c",
        "\u5206\u7c7b action \u5e76\u68c0\u67e5\u5f53\u524d drift \u72b6\u6001",
        "\u7ba1\u7406\u672c\u5730 license \u7684\u5b89\u88c5\u4e0e\u72b6\u6001",
      ],
      mode: "community",
      ctaLabel: "\u67e5\u770b\u6587\u6863",
      ctaHref: "/docs",
    },
    {
      slug: "pro",
      title: "Pro",
      eyebrow: "",
      priceLabel: "Monthly / Yearly",
      summary: "\u67e5\u770b\u6cbb\u7406\u8d8b\u52bf\u3002",
      features: [
        "\u5305\u542b Community \u7684\u5f53\u524d\u72b6\u6001\u4e0e\u9a8c\u8bc1\u80fd\u529b",
        "\u67e5\u770b drift \u65f6\u95f4\u7ebf",
        "\u8ddf\u8e2a\u6cbb\u7406\u53d8\u5316\u7684\u65f6\u95f4\u8d8b\u52bf",
      ],
      mode: "self_serve",
      monthlyOffer: proMonthly,
      yearlyOffer: proAnnual,
    },
    {
      slug: "pro-plus",
      title: "Pro+",
      eyebrow: "",
      priceLabel: "Monthly / Yearly",
      summary: "\u6bd4\u8f83\u53d8\u5316\u5e76\u53d1\u73b0\u66f4\u6df1\u5c42\u4fe1\u53f7\u3002",
      features: [
        "\u5305\u542b Pro \u7684\u8d8b\u52bf\u80fd\u529b",
        "\u6bd4\u8f83 drift \u53d8\u5316",
        "\u5206\u6790\u5173\u8054\u4fe1\u53f7\u4e0e correlate \u7ed3\u679c",
      ],
      mode: "self_serve",
      monthlyOffer: proPlusMonthly,
      yearlyOffer: proPlusAnnual,
    },
    {
      slug: "enterprise",
      title: enterprise.title,
      eyebrow: "",
      priceLabel: "Contact us",
      summary: "\u6807\u51c6\u5316\u91c7\u8d2d\u4e0e\u7ec4\u7ec7\u843d\u5730\u3002",
      features: [
        "\u5f53\u524d CLI \u80fd\u529b\u8fb9\u754c\u4e0e Pro+ \u4e00\u81f4",
        "\u652f\u6301 enterprise purchasing boundary \u4e0b\u7684\u91c7\u8d2d\u6d41\u7a0b",
        "\u4e0d\u627f\u8bfa\u989d\u5916 runtime authority",
      ],
      mode: "contact",
      ctaLabel: "\u8054\u7cfb\u9500\u552e",
      ctaHref: "/contact",
    },
  ] as const;
}
