export const HOOK_STATUS = Object.freeze({
    PASS: "PASS",
    SOFT_OVERRIDE: "SOFT_OVERRIDE",
    BLOCK: "BLOCK",
  });
  
  export const DEFAULT_TIMEOUT_MS = 3000;
  
  export function isValidHookStatus(s) {
    return s === HOOK_STATUS.PASS || s === HOOK_STATUS.SOFT_OVERRIDE || s === HOOK_STATUS.BLOCK;
  }
  
