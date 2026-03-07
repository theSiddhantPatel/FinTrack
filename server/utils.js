export const isValidEmail = (email = "") => /\S+@\S+\.\S+/.test(email);

export const isValidMonth = (month = "") => /^\d{4}-\d{2}$/.test(month);

export const getMonthRange = (month) => {
  const [year, mon] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end = new Date(Date.UTC(year, mon, 1));
  return { start, end };
};

export const currentMonth = () => {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};
