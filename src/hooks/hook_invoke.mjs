import { HOOK_STATUS, DEFAULT_TIMEOUT_MS, isValidHookStatus } from "./hook_types.mjs";

function nowMs() {
  return Date.now();
}

function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error("HOOK_TIMEOUT")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

function safeJson(x) {
  try { return JSON.stringify(x); } catch { return "{}"; }
}

function normalizeHookResponse(obj) {
  if (!obj || typeof obj !== "object") return { status: HOOK_STATUS.PASS, reason: "invalid response" };
  const status = obj.status;
  const reason = typeof obj.reason === "string" ? obj.reason : "";
  if (!isValidHookStatus(status)) return { status: HOOK_STATUS.PASS, reason: "invalid status" };
  return { status, reason };
}

/**
 * Invoke enterprise hook (fail-safe).
 * @param {object} args
 * @param {string} args.edition - "community" | "pro" | "enterprise" ...
 * @param {object} args.snapshot - decision snapshot object (read-only)
 * @param {number} args.risk_score
 * @param {number} args.exit_intent
 * @param {object} args.config - from loadHookConfig()
 * @returns {Promise<{invoked:boolean,status:string,reason:string,latency_ms:number,error?:string}>}
 */
export async function invokeEnterpriseHook({ edition, snapshot, risk_score, exit_intent, config }) {
  const started = nowMs();

  // hard gate: enterprise only
  if (edition !== "enterprise") {
    return { invoked: false, status: HOOK_STATUS.PASS, reason: "non-enterprise", latency_ms: 0 };
  }
  if (!config || !config.enabled) {
    return { invoked: false, status: HOOK_STATUS.PASS, reason: "hook disabled", latency_ms: 0 };
  }

  const timeoutMs = config.timeout_ms || DEFAULT_TIMEOUT_MS;

  const headers = {
    "content-type": "application/json",
    "user-agent": "mindforge-guard/v0.24",
  };
  if (config.auth && config.auth.type === "bearer" && config.auth.token) {
    headers["authorization"] = `Bearer ${config.auth.token}`;
  }

  const body = {
    snapshot,
    risk_score,
    exit_intent,
  };

  const doFetch = async () => {
    const res = await fetch(config.url, {
      method: "POST",
      headers,
      body: safeJson(body),
    });
    const text = await res.text();

    if (!res.ok) {
      // fail-safe
      return { status: HOOK_STATUS.PASS, reason: `http_${res.status}` };
    }

    let parsed = null;
    try { parsed = JSON.parse(text); } catch { parsed = null; }
    return normalizeHookResponse(parsed);
  };

  try {
    // Node 18+ should have fetch; if not, fail-safe PASS
    if (typeof fetch !== "function") {
      const latency = nowMs() - started;
      return { invoked: true, status: HOOK_STATUS.PASS, reason: "fetch_unavailable", latency_ms: latency, error: "NO_FETCH" };
    }

    const out = await withTimeout(doFetch(), timeoutMs);
    const latency = nowMs() - started;
    return { invoked: true, status: out.status, reason: out.reason || "", latency_ms: latency };
  } catch (e) {
    const latency = nowMs() - started;
    const msg = e && e.message ? e.message : "hook_error";
    // fail-safe PASS
    return { invoked: true, status: HOOK_STATUS.PASS, reason: "hook_failed", latency_ms: latency, error: msg };
  }
}
