import path from "node:path";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getLicenseIssuerConfig() {
  return {
    issuerName: process.env.LICENSE_ISSUER_NAME || "MindForge Licensing Authority",
    keyId: requireEnv("LICENSE_KEY_ID"),
    privateKeyPem: requireEnv("LICENSE_PRIVATE_KEY_PEM"),
    publicKeyPem: requireEnv("LICENSE_PUBLIC_KEY_PEM"),
  };
}

export function getLicenseHubDbDefaults() {
  return {
    provider: process.env.LICENSE_HUB_DB_PROVIDER || "file",
    fileDbPath:
      process.env.LICENSE_HUB_FILE_DB_PATH ||
      path.join(process.cwd(), ".mindforge", "license-hub", "dev-db.json"),
  };
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
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
