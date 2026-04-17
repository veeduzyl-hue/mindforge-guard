import path from "node:path";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function wrapPem(label: string, base64Body: string): string {
  const body = base64Body.replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g) || [];
  return [`-----BEGIN ${label}-----`, ...lines, `-----END ${label}-----`].join("\n");
}

function normalizePem(value: string, label: "PRIVATE KEY" | "PUBLIC KEY"): string {
  const trimmed = value.trim().replace(/^"(.*)"$/, "$1");
  const normalized = trimmed.includes("\\n") ? trimmed.replace(/\\+n/g, "\n") : trimmed;

  if (normalized.startsWith("-----BEGIN ")) {
    return normalized;
  }

  if (/^[A-Za-z0-9+/=\s]+$/.test(normalized)) {
    return wrapPem(label, normalized);
  }

  return normalized;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getLicenseHubBaseUrl(): string {
  return trimTrailingSlash(process.env.LICENSE_HUB_BASE_URL || "http://localhost:3000");
}

export function getLicenseIssuerConfig() {
  return {
    issuerName: process.env.LICENSE_ISSUER_NAME || "MindForge Licensing Authority",
    keyId: requireEnv("LICENSE_KEY_ID"),
    privateKeyPem: normalizePem(requireEnv("LICENSE_PRIVATE_KEY_PEM"), "PRIVATE KEY"),
    publicKeyPem: normalizePem(requireEnv("LICENSE_PUBLIC_KEY_PEM"), "PUBLIC KEY"),
  };
}

export function getLicenseHubDbDefaults() {
  const provider =
    process.env.LICENSE_HUB_DB_PROVIDER ||
    (process.env.VERCEL || process.env.NODE_ENV === "production" ? "prisma" : "file");
  return {
    provider,
    fileDbPath:
      process.env.LICENSE_HUB_FILE_DB_PATH ||
      path.join(process.cwd(), ".mindforge", "license-hub", "dev-db.json"),
  };
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getBillingProviderConfig() {
  return {
    provider: process.env.BILLING_PROVIDER || "billing_provider",
    webhookSecret: process.env.BILLING_WEBHOOK_SECRET || "",
    signatureHeader: process.env.BILLING_SIGNATURE_HEADER || "x-billing-signature",
    allowUnsignedDev: readBooleanEnv("BILLING_ALLOW_UNSIGNED_DEV", false),
  };
}

export function getPaddleConfig() {
  const environment: "sandbox" | "production" =
    (process.env.PADDLE_ENV || "sandbox").toLowerCase() === "production" ? "production" : "sandbox";
  const licenseHubBaseUrl = getLicenseHubBaseUrl();
  return {
    environment,
    apiBaseUrl: environment === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com",
    apiKey: process.env.PADDLE_API_KEY || "",
    clientToken: process.env.PADDLE_CLIENT_TOKEN || "",
    webhookSecret: process.env.PADDLE_WEBHOOK_SECRET || "",
    webhookToleranceSeconds: Number(process.env.PADDLE_WEBHOOK_TOLERANCE_SECONDS || "300"),
    checkoutSuccessUrl: process.env.PADDLE_CHECKOUT_SUCCESS_URL || `${licenseHubBaseUrl}/paddle/success`,
    checkoutCancelUrl: process.env.PADDLE_CHECKOUT_CANCEL_URL || `${licenseHubBaseUrl}/paddle/cancel`,
    checkoutTargetUrl: `${licenseHubBaseUrl}/pricing`,
  };
}

export function getMailProviderConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY || "",
    resendFromEmail: process.env.RESEND_FROM_EMAIL || "",
  };
}

export function readBooleanEnv(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  return value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes";
}

export function readCsvEnv(name: string): string[] {
  return String(process.env[name] || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
