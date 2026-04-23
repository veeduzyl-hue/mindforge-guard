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
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Signed license JSON delivered through License Hub",
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
      deliveryLabel: "License Hub + CLI install",
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
      deliveryLabel: "License Hub + CLI install",
      bullets: [
        "Commercial fulfillment still ends in a signed downloadable license",
        "Billing lifecycle remains visible in License Hub account pages",
        "Built for users who need the expanded Pro+ entitlement set",
      ],
      priceKey: "pro_plus_monthly",
    }),
    checkoutOffer({
      slug: "pro-plus-annual",
      title: "Pro+ Yearly",
      summary: "Annual access for the higher commercial edition using License Hub delivery and local Guard CLI installation.",
      editionLabel: "Pro+",
      billingIntervalLabel: "Yearly",
      priceDisplay: "$499 / year",
      deliveryLabel: "License Hub + CLI install",
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
      priceLabel: "\u514d\u8d39",
      summary: "\u672c\u5730 Guard CLI \u4e0e\u793e\u533a\u7b56\u7565\u3002",
      features: [
        "\u4f7f\u7528\u793e\u533a\u7b56\u7565\u8fd0\u884c\u672c\u5730 Guard CLI",
        "\u4fdd\u6301 audit\u3001permit \u548c classify \u672c\u5730\u884c\u4e3a\u4e0d\u53d8",
        "\u67e5\u9605\u516c\u5f00\u6587\u6863\u4e0e\u9879\u76ee\u8d44\u6599",
      ],
      mode: "community",
      ctaLabel: "\u67e5\u770b\u6587\u6863",
      ctaHref: publicProjectDocsUrl,
    },
    {
      slug: "pro",
      title: "Pro",
      eyebrow: "",
      priceLabel: "\u6708\u4ed8 / \u5e74\u5ea6",
      summary: "\u9762\u5411\u4e2a\u4eba\u548c\u5c0f\u56e2\u961f\u7684\u5546\u4e1a\u8bb8\u53ef\u8bc1\u3002",
      features: [
        "\u901a\u8fc7 License Hub \u4ea4\u4ed8\u7b7e\u540d\u8bb8\u53ef\u8bc1",
        "\u53ef\u67e5\u770b\u8ba2\u5355\u3001\u8d26\u5355\u72b6\u6001\u548c\u8bb8\u53ef\u8bc1\u4e0b\u8f7d",
        "\u672c\u5730 Guard CLI \u5b89\u88c5\u548c\u72b6\u6001\u4ecd\u4ee5\u8bb8\u53ef\u8bc1\u4e3a\u51c6",
      ],
      mode: "self_serve",
      monthlyOffer: proMonthly,
      yearlyOffer: proAnnual,
    },
    {
      slug: "pro-plus",
      title: "Pro+",
      eyebrow: "",
      priceLabel: "\u6708\u4ed8 / \u5e74\u5ea6",
      summary: "\u9762\u5411\u66f4\u9ad8\u5546\u4e1a\u7248\u672c\u7684\u7b7e\u540d\u8bb8\u53ef\u8bc1\u4ea4\u4ed8\u3002",
      features: [
        "\u5305\u542b Pro \u7684 License Hub \u4ea4\u4ed8\u4e0e\u8d26\u6237\u53ef\u89c1\u6027",
        "\u9002\u7528\u4e8e\u9700\u8981 Pro+ \u6743\u76ca\u7684\u5546\u4e1a\u4f7f\u7528",
        "\u652f\u6301\u6708\u4ed8\u6216\u5e74\u5ea6\u8d2d\u4e70",
      ],
      mode: "self_serve",
      monthlyOffer: proPlusMonthly,
      yearlyOffer: proPlusAnnual,
    },
    {
      slug: "enterprise",
      title: enterprise.title,
      eyebrow: "",
      priceLabel: "\u8054\u7cfb\u9500\u552e",
      summary: "\u9762\u5411\u91c7\u8d2d\u3001\u6cd5\u52a1\u548c\u7ec4\u7ec7\u843d\u5730\u7684\u5546\u4e1a\u6c9f\u901a\u3002",
      features: [
        "\u652f\u6301\u91c7\u8d2d\u3001\u6cd5\u52a1\u548c\u90e8\u7f72\u95ee\u9898\u6c9f\u901a",
        "\u5546\u4e1a\u6743\u76ca\u8fb9\u754c\u4e0e Pro+ \u4fdd\u6301\u4e00\u81f4",
        "\u4e0d\u6269\u5c55\u4e3a\u6258\u7ba1\u63a7\u5236\u5e73\u9762",
      ],
      mode: "contact",
      ctaLabel: "\u8054\u7cfb\u9500\u552e",
      ctaHref: "/contact",
    },
  ] as const;
}
