export const BUILTIN_ACTIONS = {
  "file.write": {
    surface: "repo",
    risk_hint: "mutation"
  },
  "file.delete": {
    surface: "repo",
    risk_hint: "destructive"
  },
  "env.modify": {
    surface: "runtime",
    risk_hint: "configuration"
  },
  "policy.change": {
    surface: "governance",
    risk_hint: "authority"
  }
}