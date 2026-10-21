import { checkInMetrics } from "../data/checkInConfig";

const MS_PER_DAY = 86400000;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Minutes east of UTC, so the API can bucket days in the user's timezone.
export const timezoneOffset = () => -new Date().getTimezoneOffset();

const pad2 = (value) => String(value).padStart(2, "0");

// Local calendar day for a timestamp, matching the server's tz-shifted buckets.
export const dateKeyFor = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const shifted = new Date(d.getTime() + timezoneOffset() * 60000);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
};

// "YYYY-MM" key for the month a day belongs to.
export const monthKeyFor = (date) => dateKeyFor(date).slice(0, 7);

export const currentMonthKey = () => monthKeyFor(new Date());

export const shiftMonthKey = (monthKey, delta) => {
  const [year, month] = monthKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}`;
};

export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

// Turns a "YYYY-MM-DD" key into a Date anchored to local noon, so
// toLocaleDateString never rolls the day over on either side of UTC.
export const dateFromKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};

export const formatDateKey = (key) =>
  dateFromKey(key).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const formatFullDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatCheckInTimestamp = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round((startOfToday - startOfDate) / MS_PER_DAY);

  if (dayDiff === 0) return `Today · ${time}`;
  if (dayDiff === 1) return `Yesterday · ${time}`;

  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
  return `${label} · ${time}`;
};

export const initialMetricValues = (latest, stats) => {
  const values = {};
  for (const metric of checkInMetrics) {
    const statsKey = metric.key === "moodScore" ? "mood" : metric.key;
    const fromEntry = latest?.[metric.key];
    const fromStats = stats?.[statsKey];
    const fallback = metric.min + Math.floor((metric.max - metric.min) / 2);
    const value =
      typeof fromEntry === "number"
        ? fromEntry
        : typeof fromStats === "number"
          ? Math.round(fromStats)
          : fallback;
    values[metric.key] = clamp(value, metric.min, metric.max);
  }
  return values;
};
