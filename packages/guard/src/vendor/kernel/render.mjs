export function renderHumanSummary(audit) {
    const v = audit.evaluation.verdict;
    const ds = audit.inputs.diff_summary;
    const reasons = audit.evaluation.reasons || [];
  
    const lines = [];
    lines.push(`# MindForge Audit`);
    lines.push(`- verdict: **${v}**`);
    lines.push(`- head: \`${audit.run.git.head}\``);
    if (audit.run.git.base) lines.push(`- base: \`${audit.run.git.base}\``);
    if (audit.run.git.branch) lines.push(`- branch: \`${audit.run.git.branch}\``);
    lines.push(`- files_changed: ${ds.files_changed}`);
    lines.push(`- lines_added: ${ds.lines_added}`);
    lines.push(`- lines_deleted: ${ds.lines_deleted}`);
    lines.push("");
  
    if (reasons.length) {
      lines.push(`## Reasons`);
      for (const r of reasons) {
        lines.push(`- [${r.code}] ${r.message}${r.severity ? ` (${r.severity})` : ""}`);
      }
      lines.push("");
    }
  
    lines.push(`## Policy`);
    lines.push(`- policy_version: ${audit.policy.policy_version}`);
    lines.push(`- policy_hash: \`${audit.policy.policy_hash}\``);
  
    return lines.join("\n");
  }
  