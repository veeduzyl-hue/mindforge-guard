import fs from "node:fs";
import path from "node:path";
import { DEFAULT_TIMEOUT_MS } from "./hook_types.mjs";

function toAbsRepoPath(p) {
  // guard 包一般在 packages/guard；config �?repo root �?.mindforge/hooks.json
  // �?process.cwd() 作为 repo root（你当前脚本基本都以 repo root 运行�?
  return path.resolve(process.cwd(), p);
}

function readJson(file) {
  const raw = fs.readFileSync(file, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function resolveEnvToken(spec) {
  // 支持 "ENV:XXX" �?直接 token
  if (!spec || typeof spec !== "string") return "";
  if (spec.startsWith("ENV:")) {
    const k = spec.slice("ENV:".length);
    return process.env[k] || "";
  }
  return spec;
}

export function loadHookConfig() {
  const cfgPath = toAbsRepoPath(".mindforge/hooks.json");
  if (!fs.existsSync(cfgPath)) {
    return { enabled: false, reason: "hooks.json missing" };
  }

  const json = readJson(cfgPath);
  if (!json) return { enabled: false, reason: "hooks.json invalid json" };

  const enabled = Boolean(json.enabled);
  if (!enabled) return { enabled: false, reason: "hooks disabled" };

  if (json.type !== "webhook") return { enabled: false, reason: "unsupported hook type" };
  if (!json.url || typeof json.url !== "string") return { enabled: false, reason: "missing url" };

  const timeout_ms = Number.isFinite(json.timeout_ms) ? Math.max(1, json.timeout_ms) : DEFAULT_TIMEOUT_MS;

  let auth = null;
  if (json.auth && json.auth.type === "bearer") {
    const token = resolveEnvToken(json.auth.token);
    auth = { type: "bearer", token };
  }

  return {
    enabled: true,
    type: "webhook",
    url: json.url,
    timeout_ms,
    auth,
  };
}
