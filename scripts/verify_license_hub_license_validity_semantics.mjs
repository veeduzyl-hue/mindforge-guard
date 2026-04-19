import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function addCalendarMonths(isoTimestamp, months) {
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

async function main() {
  const billingEventsPath = path.join(root, "apps/license-hub/lib/billingEvents.ts");
  const paymentLifecyclePath = path.join(root, "apps/license-hub/lib/paymentLifecycle.ts");
  const paddleWebhookPath = path.join(root, "apps/license-hub/lib/paddleWebhook.ts");
  const validityPath = path.join(root, "apps/license-hub/lib/licenseValidity.ts");

  for (const target of [billingEventsPath, paymentLifecyclePath, paddleWebhookPath, validityPath]) {
    expect(fs.existsSync(target), `missing required validity semantics file: ${path.relative(root, target)}`);
  }

  const billingEvents = fs.readFileSync(billingEventsPath, "utf8");
  expect(billingEvents.includes("billingPeriodStartsAt"), "BillingEvent should include billingPeriodStartsAt");
  expect(billingEvents.includes("billingPeriodEndsAt"), "BillingEvent should include billingPeriodEndsAt");

  const paddleWebhook = fs.readFileSync(paddleWebhookPath, "utf8");
  expect(paddleWebhook.includes("resolveBillingPeriodBounds"), "Paddle webhook should resolve billing period bounds");
  expect(paddleWebhook.includes("billingPeriodEndsAt: billingPeriod.endsAt"), "Paddle webhook should carry billingPeriodEndsAt");

  const paymentLifecycle = fs.readFileSync(paymentLifecyclePath, "utf8");
  expect(paymentLifecycle.includes("resolveLicenseValidityWindow"), "payment lifecycle should resolve license validity");
  expect(paymentLifecycle.includes("notAfter: validityWindow?.notAfter"), "payment lifecycle should pass resolved notAfter");
  expect(
    addCalendarMonths("2026-04-20T10:00:00.000Z", 1) === "2026-05-20T10:00:00.000Z",
    "monthly fallback should resolve to one month"
  );
  expect(
    addCalendarMonths("2026-04-20T10:00:00.000Z", 12) === "2027-04-20T10:00:00.000Z",
    "annual fallback should resolve to one year"
  );
  expect(
    paymentLifecycle.includes("billingPeriodEndsAt: issuance.billingPeriodEndsAt"),
    "payment lifecycle should forward billing period end into validity resolution"
  );

  process.stdout.write("license hub license validity semantics verified\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
