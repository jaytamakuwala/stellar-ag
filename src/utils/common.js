import { cellBase, COLORS } from "./constants";
import { useMemo } from "react";
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateFormData = (formData, validateFor = null) => {
  const validationRules = {
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email address",
    },
    otp: {
      pattern: /^.{4,}$/,
      message: "Password must be at least 4 characters",
    },
  };

  const passwordRule = {
    pattern: /^.{6,}$/,
    message: "Password must be at least 6 characters",
  };

  const errors = {};
  const fieldsToValidate = validateFor ? [validateFor] : Object.keys(formData);

  for (const field of fieldsToValidate) {
    const value = formData[field];

    if (!value || value.toString().trim() === "") {
      errors[field] = `${capitalize(field)} is required`;
      continue;
    }

    let rule = validationRules[field];

    if (!rule && field.toLowerCase().includes("password")) {
      rule = passwordRule;
    }

    if (rule?.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${capitalize(field)} is invalid`;
    } else {
      errors[field] = "";
    }
  }

  const isValidated = Object.values(errors).every((val) => val === "");

  return {
    errors,
    isValidated,
  };
};

const capitalize = (str) =>
  str.charAt(0).toUpperCase() +
  str
    .slice(1)
    .replace(/([A-Z])/g, " $1")
    .trim();

export const formatNumberToCurrency = (num) => {
  const cleanNum = Number(String(num || "0").replace(/,/g, ""));
  if (isNaN(cleanNum)) return "$0";
  if (cleanNum >= 1000000) {
    return `$${(cleanNum / 1000000).toFixed(1)}M`;
  } else if (cleanNum >= 1000) {
    return `$${(cleanNum / 1000).toFixed(0)}K`;
  } else {
    return `$${cleanNum}`;
  }
};

export const USADateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const USATimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const getFormatedDateStrForUSA = (date) => {
  const parts = USADateFormatter.formatToParts(date);
  const yyyy = parts.find((p) => p.type === "year")?.value;
  const mm = parts.find((p) => p.type === "month")?.value;
  const dd = parts.find((p) => p.type === "day")?.value;
  return `${yyyy}-${mm}-${dd}`;
};

export const isAuthenticated = () => !!sessionStorage.getItem("token");

export const formatNumberToCurrencyWithComma = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "-";
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
};

export const stripMoney = (v) => Number(String(v ?? "").replace(/[$,]/g, ""));
export const percentToNumber = (v) =>
  Number(String(v ?? "").replace("%", "")) || 0;

export const safeGetDefsCount = (api) => {
  const defs = api?.getColumnDefs?.();
  return Array.isArray(defs) ? defs.length : 1;
};

export const getParentRowId = (d, idx) =>
  d?.Tick && d?.Time ? `${d.Tick}-${d.Time}` : d?.Tick ?? `row-${idx ?? 0}`;

export const stableParentId = (row) =>
  row?.Id ||
  row?.UniqueKey ||
  row?.Tick ||
  `${row?.Tick ?? "?"}-${row?.Time ?? "?"}`;

export function toDDMMYYYY(input) {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d)) return String(input);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function toLocalISOString(date) {
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

export function isSameDay(a, b) {
  if (!a) return true; // if no date selected, treat as today
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function to12hUpper(val) {
  if (val == null || val === "") return "";

  let d;

  if (val instanceof Date) {
    d = val;
  } else if (typeof val === "number") {
    d = new Date(val < 1e12 ? val * 1000 : val);
  } else if (typeof val === "string") {
    const s = val.trim();

    const ap = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)$/i.exec(s);
    if (ap) {
      const h = +ap[1] % 12 || 12;
      const m = String(ap[2] ?? "00").padStart(2, "0");
      const ampm = ap[4].toUpperCase();
      return `${h}:${m} ${ampm}`;
    }

    const hm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
    if (hm) {
      const H = +hm[1],
        M = +hm[2],
        S = +(hm[3] || 0);
      d = new Date();
      d.setHours(H, M, S, 0);
    } else {
      const tryDate = new Date(s);
      if (!isNaN(tryDate)) d = tryDate;
      else return String(val);
    }
  }

  if (!d || isNaN(d)) return String(val);

  const H = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = H >= 12 ? "PM" : "AM";
  const h12 = H % 12 || 12;

  return `${h12}:${m} ${ampm}`;
}
export function to12h(val) {
  if (!val) return "";
  if (typeof val !== "string" || val.includes("T")) {
    const d = new Date(val);

    return isNaN(d)
      ? String(val)
      : d.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
  }
  const parts = val.split(":").map(Number);
  if (Number.isNaN(parts[0])) return val;
  const [H, M = 0, S = 0] = parts;
  const d = new Date();
  d.setHours(H, M, S, 0);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
export const parsePct = (x) => {
  if (x == null) return NaN;
  if (typeof x === "number") return x;
  const m = String(x).match(/-?\d+(?:\.\d+)?/); // grabs 3 or 3.5 from "3.5%"
  return m ? parseFloat(m[0]) : NaN;
};

export const currencyColorStyle = (p) => {
  const v = Number(String(p ?? "").replace(/[$,]/g, ""));
  if (v > 1000000) return { ...cellBase, color: COLORS.lime };
  if (v > 500000) return { ...cellBase, color: COLORS.yellow };
  return { ...cellBase, color: COLORS.white };
};
export const DteColorStyle = (p) => {
  const v = Number(String(p ?? "").replace(/[$,]/g, ""));
  if (v < 3 && v > 0) return { ...cellBase, color: COLORS.cyan };
  if (3 <= v && v <= 10) return { ...cellBase, color: COLORS.yellow };
  return { ...cellBase, color: COLORS.white };
};
export const getRowStyle = (params) => {
  const isEvenRow = params.node.rowIndex % 2 === 0;
  const rowOverlay = isEvenRow ? COLORS.dark4 : COLORS.dark3;

  return {
    background: `${rowOverlay}`,
    color: COLORS.white,
    transition: "opacity 0.3s ease-in-out",
  };
};

export const getCurrentUSADate = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date || new Date());

  const getPart = (type) => parts.find((p) => p.type === type)?.value;

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};
