const MS_PER_DAY = 86400000;

export const MOOD_SCORES = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
};

// The client sends its UTC offset in minutes (Date.getTimezoneOffset() negated)
// so day buckets, streaks and weekly averages line up with the user's calendar.
// The timestamp is shifted forward by the offset, then read with UTC getters —
// that yields the user's local calendar date regardless of the server's zone.
export const shiftToLocal = (date, tz) =>
  new Date(new Date(date).getTime() + tz * 60000);

export const dateKey = (date, tz) => {
  const d = shiftToLocal(date, tz);
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${month}-${day}`;
};

export const startOfLocalDay = (date, tz) => {
  const d = shiftToLocal(date, tz);
  const midnight = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
  );
  return new Date(midnight - tz * 60000);
};

export const weekdayLabel = (date, tz) =>
  shiftToLocal(date, tz).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });

export const scoreOf = (entry) =>
  entry.moodScore || MOOD_SCORES[entry.mood] || MOOD_SCORES.okay;

export const average = (values) => {
  const list = values.filter(
    (value) => typeof value === "number" && !Number.isNaN(value),
  );
  if (!list.length) return null;
  return list.reduce((sum, value) => sum + value, 0) / list.length;
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const buildStats = (entries, tz, now = new Date()) => {
  const weekAgo = startOfLocalDay(now, tz);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const weekEntries = entries.filter(
    (entry) => startOfLocalDay(entry.createdAt, tz) >= weekAgo,
  );

  return {
    stress: average(weekEntries.map((entry) => entry.stress)),
    energy: average(weekEntries.map((entry) => entry.energy)),
    mood: average(weekEntries.map(scoreOf)),
    totalCheckIns: entries.length,
    thisWeek: weekEntries.length,
  };
};

export const buildStreak = (activeDayKeys, tz, today = new Date()) => {
  const keys = [...activeDayKeys].sort();
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of keys) {
    const date = new Date(`${key}T00:00:00Z`);
    if (previous && (date - previous) / MS_PER_DAY === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = date;
  }

  const has = new Set(keys);
  let current = 0;
  const cursor = startOfLocalDay(today, tz);
  if (!has.has(dateKey(cursor, tz))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (has.has(dateKey(cursor, tz))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, longest };
};
