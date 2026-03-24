// Shared validation helpers

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // optional unless marked required
  return /^[+\d\s()\-]+$/.test(phone) && phone.replace(/[^\d]/g, "").length >= 7;
};

export const isValidUrl = (url) => {
  if (!url || url === "https://") return true;
  return /^https?:\/\/.+\..+/.test(url);
};

export const isValidHandle = (handle) => {
  if (!handle) return true;
  return /^@?[\w.]+$/.test(handle);
};

export const isMinAge = (dateStr, minAge) => {
  if (!dateStr) return false;
  const dob = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= minAge;
};

export const isNotEmpty = (value) => {
  return typeof value === "string" ? value.trim().length > 0 : !!value;
};

export const isMinLength = (value, min) => {
  return typeof value === "string" && value.trim().length >= min;
};

export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

export const isValidDate = (dateStr) => {
  if (!dateStr) return true;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return false;
  const year = parseInt(parts[0], 10);
  return year >= 1900 && year <= 2100;
};

export const isNumericOrFormatted = (value) => {
  if (!value) return true;
  return /^[\d,.\s]+$/.test(value);
};

export const isValidHexColor = (value) => {
  if (!value) return true;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
};

export const isFutureOrToday = (dateStr) => {
  if (!dateStr) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today;
};
