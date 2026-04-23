import type { BillingEvent } from "./billingEvents";
import { readBooleanEnv } from "./env";

const ENABLED_ENV = "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_ENABLED";
const EVENT_IDS_ENV = "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_EVENT_IDS";
const MARKERS_ENV = "LICENSE_HUB_WEBHOOK_FAILURE_INJECTION_MARKERS";

type JsonRecord = Record<string, unknown>;

type ControlledFailureError = Error & {
  stage: string;
  reason: string;
};

interface FailureInjectionConfig {
  enabled: boolean;
  eventIds: Set<string>;
  markers: Set<string>;
}

function parseCsvEnv(name: string): Set<string> {
  return new Set(
    String(process.env[name] || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" ? (value as JsonRecord) : {};
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
}

function getConfig(): FailureInjectionConfig {
  return {
    enabled: readBooleanEnv(ENABLED_ENV, false),
    eventIds: parseCsvEnv(EVENT_IDS_ENV),
    markers: parseCsvEnv(MARKERS_ENV),
  };
}

function firstMarker(rawPayload: unknown): string | null {
  const payload = asRecord(rawPayload);
  const data = asRecord(payload.data);
  const customData = asRecord(data.custom_data || data.customData);
  const metadata = asRecord(data.metadata || payload.metadata);

  return (
    asString(customData.mindforge_webhook_failure_marker) ||
    asString(customData.webhook_failure_marker) ||
    asString(customData.license_hub_webhook_failure_marker) ||
    asString(metadata.mindforge_webhook_failure_marker) ||
    asString(metadata.webhook_failure_marker) ||
    asString(metadata.license_hub_webhook_failure_marker) ||
    asString(payload.mindforge_webhook_failure_marker) ||
    asString(payload.webhook_failure_marker) ||
    asString(payload.license_hub_webhook_failure_marker)
  );
}

function createControlledFailure(event: BillingEvent, selector: string): ControlledFailureError {
  const error = new Error(
    `controlled webhook failure injection for observability rehearsal: ${selector}`
  ) as ControlledFailureError;
  error.stage = "controlled_failure_injection";
  error.reason = "webhook_failure_retry_observability_rehearsal";
  return error;
}

export function maybeThrowControlledWebhookFailure(event: BillingEvent): void {
  const config = getConfig();
  if (!config.enabled) {
    return;
  }

  if (config.eventIds.has(event.eventId)) {
    console.warn(
      JSON.stringify({
        webhook_failure_injection: true,
        selector_type: "event_id",
        event_id: event.eventId,
        event_type: event.eventType,
      })
    );
    throw createControlledFailure(event, `event_id:${event.eventId}`);
  }

  const marker = firstMarker(event.rawPayload);
  if (marker && config.markers.has(marker)) {
    console.warn(
      JSON.stringify({
        webhook_failure_injection: true,
        selector_type: "marker",
        event_id: event.eventId,
        event_type: event.eventType,
      })
    );
    throw createControlledFailure(event, `marker:${marker}`);
  }
}
