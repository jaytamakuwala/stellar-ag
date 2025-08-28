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

export const getFormatedDateStrForUSA = (date: Date) => {
  const parts = USADateFormatter.formatToParts(date);
  const yyyy = parts.find((p) => p.type === "year")?.value;
  const mm = parts.find((p) => p.type === "month")?.value;
  const dd = parts.find((p) => p.type === "day")?.value;
  return `${yyyy}-${mm}-${dd}`;
};

export const isAuthenticated = () => !!sessionStorage.getItem("token");

export const formatNumberToCurrencyWithComma = (price: number | string) => {
  const num = Number(price);
  if (isNaN(num)) return "-"; 
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, 
  });
};
