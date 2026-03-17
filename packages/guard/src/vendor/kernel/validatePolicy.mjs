import fs from "node:fs";
import path from "node:path";

function isObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function must(cond, msg, errors) {
  if (!cond) errors.push(msg);
}

function getByPath(obj, dottedPath) {
  const parts = dottedPath.split(".");
  let cur = obj;
  for (const p of parts) {
    cur = cur?.[p];
  }
  return cur;
}

export function validatePolicyObject(policy) {
  const errors = [];

  must(isObject(policy), "policy must be an object", errors);
  if (errors.length) return { ok: false, errors };

  // Required top-level keys
  must(typeof policy.policy_version === "string" && policy.policy_version.length > 0, "policy.policy_version must be a non-empty string", errors);
  must(isObject(policy.defaults), "policy.defaults must be an object", errors);
  must(isObject(policy.thresholds), "policy.thresholds must be an object", errors);
  must(Array.isArray(policy.rules), "policy.rules must be an array", errors);
  must(isObject(policy.exit_codes), "policy.exit_codes must be an object", errors);

  // defaults
  if (isObject(policy.defaults)) {
    if ("fail_mode" in policy.defaults) {
      must(["fail_closed", "fail_open"].includes(policy.defaults.fail_mode), "defaults.fail_mode must be 'fail_closed' or 'fail_open'", errors);
    }
    if ("render_human_summary" in policy.defaults) {
      must(typeof policy.defaults.render_human_summary === "boolean", "defaults.render_human_summary must be boolean", errors);
    }
  }

  // exit_codes
  if (isObject(policy.exit_codes)) {
    for (const k of ["allow", "soft_block", "hard_block", "error"]) {
      must(typeof policy.exit_codes[k] === "number", `exit_codes.${k} must be a number`, errors);
    }
  }

  // thresholds: ensure numeric
  if (isObject(policy.thresholds)) {
    for (const [k, v] of Object.entries(policy.thresholds)) {
      must(typeof v === "number" && Number.isFinite(v), `thresholds.${k} must be a finite number`, errors);
    }
  }

  // rules
  const allowedSeverity = ["soft_block", "hard_block"];
  const allowedOp = [">", ">=", "<", "<=", "==", "!="];

  if (Array.isArray(policy.rules)) {
    policy.rules.forEach((r, idx) => {
      const pfx = `rules[${idx}]`;

      must(isObject(r), `${pfx} must be an object`, errors);
      if (!isObject(r)) return;

      must(typeof r.id === "string" && r.id.length > 0, `${pfx}.id must be a non-empty string`, errors);
      must(typeof r.enabled === "boolean", `${pfx}.enabled must be boolean`, errors);
      must(typeof r.message === "string" && r.message.length > 0, `${pfx}.message must be a non-empty string`, errors);
      must(typeof r.severity === "string" && allowedSeverity.includes(r.severity), `${pfx}.severity must be one of ${allowedSeverity.join(", ")}`, errors);

      must(isObject(r.when), `${pfx}.when must be an object`, errors);
      if (!isObject(r.when)) return;

      const any_of = r.when.any_of;
      must(Array.isArray(any_of) && any_of.length > 0, `${pfx}.when.any_of must be a non-empty array`, errors);

      if (Array.isArray(any_of)) {
        any_of.forEach((c, j) => {
          const cp = `${pfx}.when.any_of[${j}]`;
          must(isObject(c), `${cp} must be an object`, errors);
          if (!isObject(c)) return;

          must(typeof c.metric === "string" && c.metric.length > 0, `${cp}.metric must be a non-empty string`, errors);
          must(typeof c.op === "string" && allowedOp.includes(c.op), `${cp}.op must be one of ${allowedOp.join(", ")}`, errors);

          const hasValue = "value" in c;
          const hasValueRef = "value_ref" in c;

          must(!(hasValue && hasValueRef), `${cp} cannot have both value and value_ref`, errors);
          must(hasValue || hasValueRef, `${cp} must have either value or value_ref`, errors);

          if (hasValue) {
            must(typeof c.value === "number" && Number.isFinite(c.value), `${cp}.value must be a finite number`, errors);
          }
          if (hasValueRef) {
            must(typeof c.value_ref === "string" && c.value_ref.length > 0, `${cp}.value_ref must be a non-empty string`, errors);
            const resolved = getByPath(policy, c.value_ref);
            must(typeof resolved === "number" && Number.isFinite(resolved), `${cp}.value_ref '${c.value_ref}' must resolve to a finite number in policy`, errors);
          }
        });
      }
    });
  }

  // Optional: ensure unique rule IDs
  if (Array.isArray(policy.rules)) {
    const ids = policy.rules.filter(r => isObject(r) && typeof r.id === "string").map(r => r.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    must(dup.length === 0, `duplicate rule ids found: ${Array.from(new Set(dup)).join(", ")}`, errors);
  }

  return { ok: errors.length === 0, errors };
}

export function validatePolicyFile(policyPath) {
  const raw = fs.readFileSync(policyPath, "utf8");
  let policy;
  try {
    policy = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: [`policy.json is not valid JSON: ${e?.message || String(e)}`] };
  }
  const res = validatePolicyObject(policy);
  return { ...res, policy };
}

export function defaultPolicyPath() {
  return path.join(process.cwd(), ".mindforge", "config", "policy.json");
}
