import { readRiskTrendFromAuditJsonl } from "../risk_trend.mjs";

/**
 * Thin wrapper: keeps association domain independent from audit parsing details.
 */
export function buildRiskDailySeries({ auditPath, window = "7d", nowMs = Date.now() }) {
  return readRiskTrendFromAuditJsonl({ auditPath, window, nowMs });
}