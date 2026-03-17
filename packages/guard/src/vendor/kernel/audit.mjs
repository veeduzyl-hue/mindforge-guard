/* ------------------------------------------------------------------ */
/* Kernel-level pure helpers                                          */
/* ------------------------------------------------------------------ */

function resolveValueRef(policy, ref) {
  const parts = ref.split(".");
  let cur = policy;
  for (const p of parts) {
    cur = cur?.[p];
  }
  return cur;
}

function compare(op, a, b) {
  switch (op) {
    case ">": return a > b;
    case ">=": return a >= b;
    case "<": return a < b;
    case "<=": return a <= b;
    case "==": return a === b;
    case "!=": return a !== b;
    default: return false;
  }
}

function evalWhen(policy, signals, when) {
  if (!when) return false;
  const any = when.any_of || [];
  for (const cond of any) {
    const metric = cond.metric;
    const op = cond.op;
    const left = signals[metric];
    const right =
      cond.value_ref
        ? resolveValueRef(policy, cond.value_ref)
        : cond.value;

    if (compare(op, left, right)) return true;
  }
  return false;
}

function verdictRank(v) {
  if (v === "error") return 3;
  if (v === "hard_block") return 2;
  if (v === "soft_block") return 1;
  return 0;
}

/* ------------------------------------------------------------------ */
/* 🧠 PURE KERNEL ENGINE                                              */
/* ------------------------------------------------------------------ */

/**
 * Deterministic evaluation engine.
 *
 * INPUT:
 *   policy  – loaded policy object
 *   signals – computed diff signals
 *
 * OUTPUT:
 *   {
 *     verdict: "allow" | "soft_block" | "hard_block",
 *     score: number,
 *     reasons: []
 *   }
 *
 * No I/O.
 * No filesystem.
 * No git.
 * No path.
 * Pure logic only.
 */
export function evaluateAudit({ policy, signals }) {
  const reasons = [];
  let worst = "allow";
  let score = 0;

  for (const rule of policy.rules || []) {
    if (!rule.enabled) continue;

    const hit = evalWhen(policy, signals, rule.when);
    if (!hit) continue;

    const severity = rule.severity;

    reasons.push({
      code: rule.id,
      message: rule.message || "Rule hit",
      severity,
      evidence: {
        signals,
        rule: { id: rule.id }
      }
    });

    score += severity === "hard_block" ? 2 : 1;

    const candidate =
      severity === "hard_block"
        ? "hard_block"
        : "soft_block";

    if (verdictRank(candidate) > verdictRank(worst)) {
      worst = candidate;
    }
  }

  const verdict =
    worst === "hard_block"
      ? "hard_block"
      : worst === "soft_block"
      ? "soft_block"
      : "allow";

  return { verdict, score, reasons };
}
// alpha-verify spread A
