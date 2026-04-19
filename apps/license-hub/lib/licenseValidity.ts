import { getPaddlePriceByKey } from "./paddlePrices";

type LicenseInterval = "monthly" | "annual";

interface LicenseValidityWindowInput {
  occurredAt?: string | null;
  billingPeriodStartsAt?: string | null;
  billingPeriodEndsAt?: string | null;
  interval?: string | null;
  priceKey?: string | null;
}

export interface LicenseValidityWindow {
  notBefore: string;
  notAfter: string;
  source: "billing_period_end" | "interval_fallback";
  interval: LicenseInterval | null;
}

function asIsoTimestamp(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  return Number.isFinite(Date.parse(normalized)) ? normalized : null;
}

function normalizeInterval(input: Pick<LicenseValidityWindowInput, "interval" | "priceKey">): LicenseInterval | null {
  const rawInterval = String(input.interval || "")
    .trim()
    .toLowerCase();

  if (rawInterval === "monthly" || rawInterval === "month") {
    return "monthly";
  }

  if (
    rawInterval === "annual" ||
    rawInterval === "annually" ||
    rawInterval === "year" ||
    rawInterval === "yearly"
  ) {
    return "annual";
  }

  const mappedPrice = getPaddlePriceByKey(String(input.priceKey || ""));
  return mappedPrice?.interval || null;
}

function addCalendarMonths(isoTimestamp: string, months: number): string {
  const source = new Date(isoTimestamp);
  const target = new Date(source.getTime());
  const sourceDay = source.getUTCDate();

  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();

  target.setUTCDate(Math.min(sourceDay, lastDayOfTargetMonth));
  target.setUTCHours(
    source.getUTCHours(),
    source.getUTCMinutes(),
    source.getUTCSeconds(),
    source.getUTCMilliseconds()
  );

  return target.toISOString();
}

export function resolveLicenseValidityWindow(
  input: LicenseValidityWindowInput
): LicenseValidityWindow | null {
  const notBefore =
    asIsoTimestamp(input.billingPeriodStartsAt) ||
    asIsoTimestamp(input.occurredAt) ||
    new Date().toISOString();
  const billingPeriodEndsAt = asIsoTimestamp(input.billingPeriodEndsAt);
  const interval = normalizeInterval(input);

  if (billingPeriodEndsAt && Date.parse(billingPeriodEndsAt) > Date.parse(notBefore)) {
    return {
      notBefore,
      notAfter: billingPeriodEndsAt,
      source: "billing_period_end",
      interval,
    };
  }

  if (!interval) {
    return null;
  }

  return {
    notBefore,
    notAfter: addCalendarMonths(notBefore, interval === "monthly" ? 1 : 12),
    source: "interval_fallback",
    interval,
  };
}
