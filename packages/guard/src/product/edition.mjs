function canonicalize(v) {
  const value = String(v || "").trim().toLowerCase();
  if (value === "pro+" || value === "proplus" || value === "pro_plus") return "pro_plus";
  if (value === "enterprise") return "enterprise";
  if (value === "pro") return "pro";
  return "community";
}

export function normalizeEdition(v) {
  return canonicalize(v);
}

export function normalizeTier(v) {
  return canonicalize(v);
}

export function allowedTiersForEdition(edition) {
  switch (canonicalize(edition)) {
    case "community":
      return ["community"];
    case "pro":
      return ["community", "pro"];
    case "pro_plus":
      return ["community", "pro", "pro_plus"];
    case "enterprise":
      return ["community", "pro", "pro_plus", "enterprise"];
    default:
      return ["community"];
  }
}
