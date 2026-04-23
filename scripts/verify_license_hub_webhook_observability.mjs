import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

const injectionPath = "apps/license-hub/lib/webhookFailureInjection.ts";
const webhookPath = "apps/license-hub/lib/billingWebhook.ts";
const issuancePath = "apps/license-hub/lib/issueLicenseForPaidOrder.ts";
const verificationDocPath = "docs/commercial/license-hub-verification-baseline.md";
const runbookPath = "docs/commercial/license-hub-webhook-failure-retry-runbook.md";

for (const relPath of [injectionPath, webhookPath, issuancePath, verificationDocPath, runbookPath]) {
  expect(fs.existsSync(path.join(root, relPath)), `missing webhook observability file: ${relPath}`);
}

const injection = read(injectionPath);
for (const token of [
  "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED",
  "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS",
  "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS",
  "readBooleanEnv(ENABLED_ENV, false)",
  "config.eventIds.has(event.eventId)",
  "config.markers.has(marker)",
  "controlled_failure_injection",
  "webhook_failure_retry_observability_rehearsal",
]) {
  expect(injection.includes(token), `failure injection helper missing boundary token: ${token}`);
}

const webhook = read(webhookPath);
expect(
  webhook.includes("import { maybeThrowControlledWebhookFailure } from \"./webhookFailureInjection\";"),
  "billing webhook should import controlled failure helper"
);
expect(
  webhook.indexOf("createWebhookEvent") < webhook.indexOf("maybeThrowControlledWebhookFailure(event)"),
  "generic billing failure gate should run after event ledger creation"
);
expect(
  webhook.indexOf("maybeThrowControlledWebhookFailure(event)") < webhook.indexOf("applyBillingLifecycle({"),
  "generic billing failure gate should run before lifecycle application"
);
expect(
  webhook.includes("maybeThrowControlledWebhookFailure(normalized)"),
  "Paddle billing failure gate should run for normalized events"
);
expect(
  webhook.indexOf("if (!normalized)") < webhook.indexOf("maybeThrowControlledWebhookFailure(normalized)"),
  "Paddle ignored events should not enter the controlled failure gate"
);

const issuance = read(issuancePath);
expect(
  issuance.includes("findActiveLicenseByOrderId"),
  "license issuance should retain active-license idempotency guard"
);

const verificationDoc = read(verificationDocPath);
for (const token of [
  "Implementation-ready",
  "Operator rehearsal deferred",
  "Not a main-path blocker",
  "Not a launch blocker",
  "default-off controlled failure gate",
  "before billing lifecycle application",
  "No duplicate active license is created",
  "license-hub-webhook-failure-retry-runbook.md",
]) {
  expect(verificationDoc.includes(token), `verification doc missing webhook observability token: ${token}`);
}

const runbook = read(runbookPath);
for (const token of [
  "manual safety-window rehearsal only",
  "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=false",
  "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED=true",
  "ops_webhook_failures",
  "webhook_events",
  "no active license should be issued by the injected failure",
  "Gate is restored to default off",
]) {
  expect(runbook.includes(token), `runbook missing webhook observability token: ${token}`);
}

process.stdout.write("license hub webhook observability boundary verified\n");
