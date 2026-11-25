// All expiry rules live in this one file, so the status shown in a table,
// a status filter and the dashboard counts can never disagree.
//
// An expiry date has no time of day, so every date is handled as midnight UTC
// of that calendar day. "Today" is worked out from Nepal's calendar, because
// the server's own timezone could be different.

const TIME_ZONE = "Asia/Kathmandu";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const EXPIRING_SOON_DAYS = 7;
export const EXPIRY_STATUSES = ["Expired", "Expiring Soon", "Safe"];

// Returns today's calendar date in Nepal as midnight UTC.
export const getToday = (now = new Date()) => {
  const nepalDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // en-CA formats as YYYY-MM-DD

  return new Date(`${nepalDate}T00:00:00.000Z`);
};

export const addDays = (date, days) =>
  new Date(date.getTime() + days * MS_PER_DAY);

// Turns "YYYY-MM-DD" into a Date. Returns null if it is not a real date.
export const parseDateOnly = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;

  // JavaScript quietly rolls 2026-02-31 over to March, so check it came back unchanged.
  return date.toISOString().slice(0, 10) === value ? date : null;
};

export const getDaysLeft = (expiryDate, today = getToday()) =>
  Math.round((new Date(expiryDate).getTime() - today.getTime()) / MS_PER_DAY);

export const getExpiryStatus = (daysLeft) => {
  if (daysLeft < 0) return "Expired";
  if (daysLeft <= EXPIRING_SOON_DAYS) return "Expiring Soon";
  return "Safe";
};

// Mongoose condition that finds the products with a given status.
// Status is never stored, so it is translated into an expiry date range.
export const getStatusCondition = (status, today = getToday()) => {
  const lastExpiringSoonDay = addDays(today, EXPIRING_SOON_DAYS);

  if (status === "Expired") return { expiryDate: { $lt: today } };
  if (status === "Expiring Soon") {
    return { expiryDate: { $gte: today, $lte: lastExpiringSoonDay } };
  }
  return { expiryDate: { $gt: lastExpiringSoonDay } };
};

// Adds the calculated fields to a product just before it is sent to the client.
export const withExpiryInfo = (product, today = getToday()) => {
  const daysLeft = getDaysLeft(product.expiryDate, today);
  return { ...product, daysLeft, status: getExpiryStatus(daysLeft) };
};
