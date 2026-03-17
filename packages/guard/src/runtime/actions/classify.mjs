import { BUILTIN_ACTIONS } from "./registry.mjs";

export function normalizeActionText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function lower(text) {
  return normalizeActionText(text).toLowerCase();
}

function fileTargetFromText(text) {
  const match = text.match(/\b(?:file|path)\s+([^\s]+)/i);
  return match ? match[1] : null;
}

export function classifyAction(input) {
  const text = normalizeActionText(input?.text);
  const lowered = lower(text);

  let actionClass = "unknown";
  let targetType = "unknown";
  let targetRef = "";

  if (lowered.startsWith("write file ")) {
    actionClass = "file.write";
    targetType = "file";
    targetRef = text.slice("write file ".length).trim();
  } else if (lowered.startsWith("delete file ")) {
    actionClass = "file.delete";
    targetType = "file";
    targetRef = text.slice("delete file ".length).trim();
  } else if (lowered.includes("env")) {
    actionClass = "env.modify";
    targetType = "env";
  } else if (lowered.includes("policy")) {
    actionClass = "policy.change";
    targetType = "policy";
  } else {
    const fallbackTarget = fileTargetFromText(text);
    if (fallbackTarget) {
      actionClass = lowered.includes("delete") ? "file.delete" : lowered.includes("write") ? "file.write" : "unknown";
      targetType = actionClass.startsWith("file.") ? "file" : "unknown";
      targetRef = actionClass.startsWith("file.") ? fallbackTarget : "";
    }
  }

  const builtin = BUILTIN_ACTIONS[actionClass] || {};

  return {
    input: {
      text,
    },
    action: {
      action_class: actionClass,
      canonical_label: actionClass,
      target_type: targetType,
      target_ref: targetRef,
      attributes: {
        surface: builtin.surface || "unknown",
        risk_hint: builtin.risk_hint || "unknown",
      },
    },
  };
}
