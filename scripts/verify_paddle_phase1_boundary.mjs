import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function requireFile(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`missing required file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

const priceMap = requireFile("apps/license-hub/lib/paddlePrices.ts");
for (const token of [
  "PADDLE_PRICE_ID_PRO_MONTHLY",
  "PADDLE_PRICE_ID_PRO_ANNUAL",
  "PADDLE_PRICE_ID_PRO_PLUS_MONTHLY",
  "PADDLE_PRICE_ID_PRO_PLUS_ANNUAL",
]) {
  if (!priceMap.includes(token)) {
    throw new Error(`price mapping missing env override: ${token}`);
  }
}

const checkoutRoute = requireFile("apps/license-hub/app/api/paddle/checkout/route.ts");
if (!checkoutRoute.includes("createPaddleCheckout")) {
  throw new Error("checkout route is not wired to createPaddleCheckout");
}

const billingWebhook = requireFile("apps/license-hub/lib/billingWebhook.ts");
if (!billingWebhook.includes('providerConfig.provider === "paddle"')) {
  throw new Error("billing webhook is not delegating to Paddle handling");
}

const paddleWebhook = requireFile("apps/license-hub/lib/paddleWebhook.ts");
for (const token of ["transaction.completed", "transaction.payment_failed", "subscription.canceled", "adjustment.updated"]) {
  if (!paddleWebhook.includes(token)) {
    throw new Error(`missing Paddle event mapping: ${token}`);
  }
}

const releaseNote = requireFile("docs/product/release-baseline-post-v6.13.md");
if (!releaseNote.includes("v6.13.0") || !releaseNote.includes("post-`v6.13.0`")) {
  throw new Error("release baseline note is missing expected version framing");
}

console.log("paddle phase1 boundary verified");
