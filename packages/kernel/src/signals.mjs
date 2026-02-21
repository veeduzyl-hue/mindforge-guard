export function computeSignalsFromNumstat(numstatLines) {
    let files_changed = 0;
    let lines_added = 0;
    let lines_deleted = 0;
  
    for (const line of numstatLines) {
      // Binary files may show "-" values
      const [a, d] = line.split("\t");
      files_changed += 1;
  
      const add = a === "-" ? 0 : Number(a || 0);
      const del = d === "-" ? 0 : Number(d || 0);
  
      lines_added += Number.isFinite(add) ? add : 0;
      lines_deleted += Number.isFinite(del) ? del : 0;
    }
  
    const lines_changed_total = lines_added + lines_deleted;
  
    return {
      files_changed,
      lines_added,
      lines_deleted,
      lines_changed_total
    };
  }
  