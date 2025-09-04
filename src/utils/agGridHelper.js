export function reconcileByIndex(prev, incoming, keyFn, fieldsToCheck = []) {
  if (!prev || prev.length === 0) return incoming;

  const next = [...prev];
  const maxLen = Math.max(prev.length, incoming.length);

  for (let i = 0; i < maxLen; i++) {
    const newRow = incoming[i];

    // if new array ended early → truncate
    if (newRow === undefined) {
      if (next.length > i) next.splice(i);
      break;
    }

    // if old array shorter → append
    if (i >= prev.length) {
      next.push(newRow);
      continue;
    }

    const oldRow = prev[i];
    const oldKey = keyFn(oldRow, i);
    const newKey = keyFn(newRow, i);

    // row identity changed → replace
    if (oldKey !== newKey) {
      next[i] = newRow;
      continue;
    }

    // shallow compare selected fields
    let changed = false;
    if (fieldsToCheck.length > 0) {
      for (const f of fieldsToCheck) {
        if (oldRow[f] !== newRow[f]) {
          changed = true;
          break;
        }
      }
    } else {
      // fallback deep check
      changed = JSON.stringify(oldRow) !== JSON.stringify(newRow);
    }

    if (changed) {
      next[i] = { ...oldRow, ...newRow };
    }
  }

  return next;
}
