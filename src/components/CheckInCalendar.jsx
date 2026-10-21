import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import Icon from "./icons";
import { moodOptionFor, moodOptions } from "../data/checkInConfig";
import {
  currentMonthKey,
  dateKeyFor,
  formatDateKey,
  formatMonthLabel,
  shiftMonthKey,
  timezoneOffset,
} from "../utils/checkIn";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CheckInCalendar({ className = "", refreshKey = 0 }) {
  const { token } = useAuth();
  const [monthKey, setMonthKey] = useState(() => currentMonthKey());
  const [calendar, setCalendar] = useState(null);
  const [loadedMonth, setLoadedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const todayKey = useMemo(() => dateKeyFor(new Date()), []);

  const fetchMonth = useCallback(
    async (key, signal) => {
      const res = await fetch(
        `${API_URL}/moods/calendar?month=${key}&tz=${timezoneOffset()}`,
        { headers: { Authorization: `Bearer ${token}` }, signal },
      );
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    },
    [token],
  );

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const data = await fetchMonth(monthKey, controller.signal);
        if (!active) return;
        setCalendar(data);
        setLoadedMonth(monthKey);
        setError("");
      } catch (err) {
        if (err.name === "AbortError" || !active) return;
        setError("We couldn't load your calendar right now.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [token, monthKey, refreshKey, fetchMonth]);

  // Only surface a month's grid once its data actually belongs to that month,
  // so navigating never shows the previous month's days.
  const isLoaded = loadedMonth === monthKey;
  const days = isLoaded ? (calendar?.days ?? []) : [];
  const summary = isLoaded ? (calendar?.summary ?? null) : null;

  const loggedDays = useMemo(
    () => days.filter((day) => day.inMonth && day.hasEntry),
    [days],
  );

  // Highlight a sensible day once per visible month, without stomping on
  // a day the user picked by hand.
  const autoSelectedFor = useRef(null);
  useEffect(() => {
    if (!days.length) return;
    if (autoSelectedFor.current === monthKey) return;
    autoSelectedFor.current = monthKey;
    const todayInMonth = days.find((day) => day.date === todayKey);
    const mostRecentLogged = loggedDays[loggedDays.length - 1];
    setSelectedDate(
      todayInMonth?.date || mostRecentLogged?.date || null,
    );
  }, [days, loggedDays, monthKey, todayKey]);

  const selected = useMemo(
    () => days.find((day) => day.date === selectedDate) ?? null,
    [days, selectedDate],
  );

  const goToMonth = (delta) => setMonthKey((key) => shiftMonthKey(key, delta));

  const isCurrentMonth = monthKey === currentMonthKey();

  const monthLabel = formatMonthLabel(monthKey);

  return (
    <Card className={`flex flex-col p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarHeart size={17} className="text-mint-deep" />
          <h3 className="text-[15px] font-bold text-ink">Your calendar</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-mint-deep hover:bg-mint-soft"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[130px] text-center text-[13px] font-bold text-ink">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-mint-deep hover:bg-mint-soft"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMonthKey(currentMonthKey())}
            disabled={isCurrentMonth}
            className="ml-1 rounded-xl border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-mint-deep hover:bg-mint-soft disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-white"
          >
            Today
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-blossom-soft/60 px-3 py-2 text-[12px] font-medium text-blossom-deep">
          {error}
        </p>
      )}

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((label) => (
              <span
                key={label}
                className="pb-1 text-center text-[10px] font-bold tracking-wide text-muted/70 uppercase"
              >
                {label}
              </span>
            ))}
          </div>

          {loading && days.length === 0 ? (
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 35 }).map((_, index) => (
                <span
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-cream"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day) => {
                const option = day.hasEntry ? moodOptionFor(day.mood) : null;
                const isToday = day.date === todayKey;
                const isSelected = day.date === selectedDate;
                const isFuture = day.date > todayKey;

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    aria-label={`${formatDateKey(day.date)}${
                      day.hasEntry ? ` — ${option.label}` : " — no check-in"
                    }`}
                    aria-pressed={isSelected}
                    className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl border text-[12px] font-semibold transition-all ${
                      isSelected
                        ? "border-mint-deep bg-mint-soft text-ink shadow-[0_2px_8px_rgba(47,174,127,0.18)]"
                        : "border-transparent bg-white text-ink hover:border-line hover:bg-cream"
                    } ${!day.inMonth ? "opacity-35" : ""} ${
                      isFuture ? "opacity-45" : ""
                    }`}
                  >
                    <span
                      className={`leading-none ${
                        isToday
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[11px] text-white"
                          : isSelected
                            ? "text-[13px]"
                            : "text-[12px]"
                      }`}
                    >
                      {day.dayOfMonth}
                    </span>
                    {day.hasEntry ? (
                      <Icon
                        name={option.icon}
                        size={13}
                        strokeWidth={1.9}
                        className={option.text}
                      />
                    ) : (
                      <span className="h-[13px] w-[13px] rounded-full border border-dashed border-line" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {moodOptions.map((option) => (
              <span
                key={option.id}
                className="flex items-center gap-1.5 text-[11px] font-medium text-muted"
              >
                <span
                  className={`h-2 w-2 rounded-full ${option.bar}`}
                  aria-hidden="true"
                />
                {option.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-cream p-4">
            <p className="text-[11px] font-bold tracking-wide text-muted/70 uppercase">
              This month
            </p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">
              {summary?.checkIns ?? 0}
            </p>
            <p className="text-[12px] text-muted">
              check-in{summary?.checkIns === 1 ? "" : "s"} across{" "}
              {summary?.daysLogged ?? 0} day
              {summary?.daysLogged === 1 ? "" : "s"}
            </p>
            {summary?.avgMood != null && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-[12px] text-muted">
                  Average mood{" "}
                  <span className="font-bold text-ink">
                    {summary.avgMood.toFixed(1)}/5
                  </span>
                </p>
                {summary?.avgStress != null && (
                  <p className="mt-0.5 text-[12px] text-muted">
                    Average stress{" "}
                    <span className="font-bold text-ink">
                      {summary.avgStress.toFixed(1)}/5
                    </span>
                  </p>
                )}
                {summary?.avgEnergy != null && (
                  <p className="mt-0.5 text-[12px] text-muted">
                    Average energy{" "}
                    <span className="font-bold text-ink">
                      {summary.avgEnergy.toFixed(1)}/5
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line p-4">
            <p className="text-[11px] font-bold tracking-wide text-muted/70 uppercase">
              {selected ? formatDateKey(selected.date) : "Select a day"}
            </p>
            {selected?.hasEntry ? (
              <div className="mt-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${moodOptionFor(selected.mood).circle}`}
                  >
                    <Icon
                      name={moodOptionFor(selected.mood).icon}
                      size={17}
                      className={moodOptionFor(selected.mood).text}
                    />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">
                      {moodOptionFor(selected.mood).label}
                    </p>
                    <p className="text-[11px] text-muted">
                      {selected.count} check-in
                      {selected.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                {selected.note && (
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
                    {selected.note}
                  </p>
                )}
                {(selected.stress || selected.energy) && (
                  <div className="mt-3 space-y-1.5">
                    {selected.stress ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-muted">
                          Stress
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 w-4 rounded-full ${
                                i < selected.stress
                                  ? "bg-peach-deep"
                                  : "bg-cream"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {selected.energy ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-muted">
                          Energy
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 w-4 rounded-full ${
                                i < selected.energy
                                  ? "bg-sun-deep"
                                  : "bg-cream"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {selected
                  ? "No check-in on this day — that's okay, showing up is what counts."
                  : "Pick any day on the calendar to see what you logged."}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
