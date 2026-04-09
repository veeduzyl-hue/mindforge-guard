export type PaddlePlanKey =
  | "pro_monthly"
  | "pro_annual"
  | "pro_plus_monthly"
  | "pro_plus_annual";

export interface PaddlePriceDefinition {
  key: PaddlePlanKey;
  priceId: string;
  edition: "pro" | "pro_plus";
  plan: "pro" | "pro_plus";
  interval: "monthly" | "annual";
  label: string;
}

function readPriceIdEnv(name: string, fallback: string): string {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  const normalized = value.trim();
  return normalized || fallback;
}

export const PADDLE_PRICE_DEFINITIONS: readonly PaddlePriceDefinition[] = [
  {
    key: "pro_monthly",
    priceId: readPriceIdEnv("PADDLE_PRICE_ID_PRO_MONTHLY", "pri_01knr4k285kt6rqg4pqr41jq4q"),
    edition: "pro",
    plan: "pro",
    interval: "monthly",
    label: "Pro Monthly",
  },
  {
    key: "pro_annual",
    priceId: readPriceIdEnv("PADDLE_PRICE_ID_PRO_ANNUAL", "pri_01knr4n5x8snpc64mj5g8m3nt9"),
    edition: "pro",
    plan: "pro",
    interval: "annual",
    label: "Pro Annual",
  },
  {
    key: "pro_plus_monthly",
    priceId: readPriceIdEnv("PADDLE_PRICE_ID_PRO_PLUS_MONTHLY", "pri_01knr4sna1wth46e39r1ggnj73"),
    edition: "pro_plus",
    plan: "pro_plus",
    interval: "monthly",
    label: "Pro+ Monthly",
  },
  {
    key: "pro_plus_annual",
    priceId: readPriceIdEnv("PADDLE_PRICE_ID_PRO_PLUS_ANNUAL", "pri_01knr4vkcexh1y1djnc5qk8419"),
    edition: "pro_plus",
    plan: "pro_plus",
    interval: "annual",
    label: "Pro+ Annual",
  },
] as const;

const BY_KEY = new Map(PADDLE_PRICE_DEFINITIONS.map((entry) => [entry.key, entry]));
const BY_PRICE_ID = new Map(PADDLE_PRICE_DEFINITIONS.map((entry) => [entry.priceId, entry]));

export function listPaddlePrices(): readonly PaddlePriceDefinition[] {
  return PADDLE_PRICE_DEFINITIONS;
}

export function getPaddlePriceByKey(key: string): PaddlePriceDefinition | null {
  return BY_KEY.get(key as PaddlePlanKey) || null;
}

export function getPaddlePriceById(priceId: string | null | undefined): PaddlePriceDefinition | null {
  if (!priceId) {
    return null;
  }
  return BY_PRICE_ID.get(String(priceId).trim()) || null;
}
