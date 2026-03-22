// Shared validation helpers

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // optional unless marked required
  return /^[+\d\s()\-]+$/.test(phone) && phone.replace(/[^\d]/g, "").length >= 7;
};

export const isValidUrl = (url) => {
  if (!url) return true;
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
