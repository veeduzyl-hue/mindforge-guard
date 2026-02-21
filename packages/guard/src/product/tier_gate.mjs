import { allowedTiersForEdition, normalizeTier } from "./edition.mjs";

export function filterRulesByEdition(rules, edition) {
  const list = Array.isArray(rules) ? rules : [];
  const allowed = new Set(allowedTiersForEdition(edition));

  return list.filter((r) => {
    const tier = normalizeTier(r && r.tier);
    return allowed.has(tier);
  });
}

export function applyTierGateToPolicy(policy, edition) {
  if (!policy || typeof policy !== "object") return policy;
  const nextRules = filterRulesByEdition(policy.rules, edition);
  return { ...policy, rules: nextRules };
}
