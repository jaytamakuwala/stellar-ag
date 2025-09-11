export function reconcileByIndex(prev, incoming, keyFn, fieldsToCheck = []) {
  if (!prev || prev.length === 0) return incoming;

  const next = [...prev];
  const maxLen = Math.max(prev.length, incoming.length);
  console.log(prev.length, incoming.length);
  try {
    for (let i = 0; i < maxLen; i++) {
      const newRow = incoming[i];

      // if new array ended early → truncate
      if (newRow === undefined) {
        if (next.length > i) next.splice(i);
        break;
      }

      // if old array shorter → append
      if (i >= prev.length) {
        next.unshift(newRow);
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
  } catch (ex) {
    console.log("next", ex.message);
  }
  return next;
}

const NY_TZ = "America/New_York";

/** Format a Date as YYYY/MM/DD in New York time */
export function formatUS(d) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const dd = parts.find((p) => p.type === "day").value;
  return `${y}/${m}/${dd}`;
}

/** 0..6 for Sun..Sat in New York */
export function nyWeekday(d) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    weekday: "short",
  }).format(d);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[name] ?? 0;
}

/** Minutes since midnight in New York */
export function nyMinutesNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const H = Number(parts.find((p) => p.type === "hour").value);
  const M = Number(parts.find((p) => p.type === "minute").value);
  return H * 60 + M;
}

/** Previous trading day (Mon–Fri), ignoring US market holidays */
export function prevTradingDate(fromDate = new Date()) {
  const dt = new Date(fromDate);
  for (let i = 0; i < 7; i++) {
    dt.setUTCDate(dt.getUTCDate() - 1);
    const wd = nyWeekday(dt);
    if (wd >= 1 && wd <= 5) return dt;
  }
  return fromDate;
}

export function buildPayloadUS(d, type = "Bull") {
  const us = formatUS(d); // YYYY/MM/DD
  return {
    executionDate: `${us}T00:00:00`,
    intervalStart: `${us}T09:00:00`,
    intervalEnd: `${us}T16:45:00`,
    minsWindows: 5,
    type,
  };
}
