import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Check, PenLine } from "lucide-react";
import Card from "../components/Card";
import MoodCheckIn from "../components/MoodCheckIn";
import {
  CHART_DAYS,
  RECENT_CHECK_IN_LIMIT,
  checkInMetrics,
  moodOptionFor,
  reflectionPrompts,
} from "../data/checkInConfig";
import {
  formatCheckInTimestamp,
  initialMetricValues,
  timezoneOffset,
} from "../utils/checkIn";
import Icon from "../components/icons";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function CheckIn() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [mood, setMood] = useState(null);
  const [metrics, setMetrics] = useState(() => initialMetricValues(null, null));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [reflection, setReflection] = useState(0);

  const fetchOverview = useCallback(async () => {
    if (!token) return null;
    const res = await fetch(
      `${API_URL}/moods/overview?tz=${timezoneOffset()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let active = true;

    (async () => {
      try {
        const data = await fetchOverview();
        if (!active) return;
        setOverview(data);
        setMood(data.latest?.mood ?? null);
        setMetrics(initialMetricValues(data.latest, data.stats));
        setLoadError("");
      } catch {
        if (active) {
          setLoadError("We couldn't load your check-ins right now.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [token, fetchOverview]);

  const stats = overview?.stats ?? null;
  const streak = overview?.streak ?? { current: 0, longest: 0 };
  const days = overview?.days ?? [];
  const chartDays = useMemo(
    () => days.slice(-CHART_DAYS),
    [days],
  );
  const recent = useMemo(
    () => (overview?.entries ?? []).slice(0, RECENT_CHECK_IN_LIMIT),
    [overview],
  );

  const setMetric = (key, value) => {
    setMetrics((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const selectMood = (id) => {
    setMood(id);
    setSaved(false);
  };

  const saveCheckIn = async () => {
    if (!token || saving || !mood) return;
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const res = await fetch(`${API_URL}/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood,
          stress: metrics.stress,
          energy: metrics.energy,
          moodScore: metrics.moodScore,
          note: note.trim(),
        }),
      });
      if (!res.ok) throw new Error("Save failed");

      setSaved(true);
      setNote("");
      try {
        const data = await fetchOverview();
        if (data) setOverview(data);
      } catch {
        // the check-in saved fine; only the refresh failed
      }
    } catch {
      setSaveError("Couldn't save your check-in. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Loading your check-ins...
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Check-in
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          A quick, gentle way to tune into how you're feeling and track your
          journey over time.
        </p>
      </div>

      {loadError && (
        <Card className="border-blossom/40 bg-blossom-soft/40 p-4 text-[13px] font-medium text-blossom-deep">
          {loadError}
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <MoodCheckIn
          className="lg:col-span-2"
          value={mood}
          onChange={selectMood}
          loadLatest={false}
        />

        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarHeart size={17} className="text-mint-deep" />
            <h3 className="text-[15px] font-bold text-ink">Your streak</h3>
          </div>
          <p className="font-display text-4xl font-semibold text-ink">
            {streak.current} {streak.current === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {streak.current > 0
              ? "of showing up for yourself. Keep going — you're doing amazing."
              : "Check in today to start your streak."}
          </p>
          <div className="mt-4 flex gap-1.5">
            {days.map((day) => (
              <span
                key={day.date}
                title={day.date}
                className={`h-2 flex-1 rounded-full ${
                  day.hasEntry ? "bg-mint-deep" : "bg-cream"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Last {days.length} days · longest streak {streak.longest}{" "}
            {streak.longest === 1 ? "day" : "days"}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">
              How did today feel?
            </h3>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
              Drag to adjust
            </span>
          </div>
          <div className="space-y-4">
            {checkInMetrics.map((metric) => (
              <div key={metric.key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    {metric.label}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {metrics[metric.key]}/{metric.max}
                  </span>
                </div>
                <input
                  type="range"
                  min={metric.min}
                  max={metric.max}
                  step={1}
                  value={metrics[metric.key]}
                  onChange={(event) =>
                    setMetric(metric.key, Number(event.target.value))
                  }
                  style={{ accentColor: metric.accent }}
                  className="w-full"
                />
                <div className="mt-0.5 flex justify-between px-0.5 text-[11px] text-muted">
                  <span>{metric.low}</span>
                  <span>{metric.high}</span>
                </div>
              </div>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setSaved(false);
            }}
            maxLength={280}
            rows={2}
            placeholder="Add a note about today (optional)"
            className="mt-4 w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={saveCheckIn}
              disabled={saving || !mood}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:opacity-50"
            >
              {saved ? <Check size={14} /> : null}
              {saving ? "Saving..." : saved ? "Saved!" : "Save check-in"}
            </button>
            {!mood && (
              <span className="text-[12px] text-muted">
                Pick how you're feeling to save.
              </span>
            )}
            {saveError && (
              <span className="text-[12px] font-medium text-blossom-deep">
                {saveError}
              </span>
            )}
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">
              This week at a glance
            </h3>
            {stats?.thisWeek > 0 && (
              <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                {stats.thisWeek} check-in{stats.thisWeek === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-1 items-end justify-between gap-2">
            {chartDays.map((day) => {
              const option = moodOptionFor(day.mood);
              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  {day.hasEntry ? (
                    <Icon
                      name={option.icon}
                      size={16}
                      className={option.text}
                    />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-dashed border-line" />
                  )}
                  <span className="h-24 w-full max-w-[18px] rounded-full bg-cream">
                    {day.hasEntry && (
                      <span
                        className={`block w-full rounded-full ${option.bar}`}
                        style={{ height: `${(day.value / 5) * 100}%` }}
                      />
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-muted">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-ink">
              Journaling prompt
            </h3>
            <p className="mt-1 font-display text-base text-ink/80 italic">
              {reflectionPrompts[reflection % reflectionPrompts.length]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setReflection((value) => (value + 1) % reflectionPrompts.length)
              }
              className="rounded-xl border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-cream"
            >
              Another prompt
            </button>
            <button
              onClick={() => navigate("/journal")}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
            >
              <PenLine size={15} />
              Write it down
            </button>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-ink">Recent check-ins</h3>
          <button
            onClick={() => navigate("/check-in-history")}
            className="text-[12px] font-semibold text-mint-deep transition-colors hover:text-mint"
          >
            View all
          </button>
        </div>
        <div className="space-y-3">
          {recent.length === 0 ? (
            <Card className="py-10 text-center">
              <p className="text-sm font-semibold text-ink">
                No check-ins yet
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Save your first check-in and it'll show up here.
              </p>
            </Card>
          ) : (
            recent.map((entry) => {
              const option = moodOptionFor(entry.mood);
              return (
                <Card key={entry._id} className="flex items-start gap-3.5 p-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${option.circle}`}
                  >
                    <Icon name={option.icon} size={18} className={option.text} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-bold text-ink">
                        {option.label}
                      </p>
                      <span className="text-xs text-muted">
                        {formatCheckInTimestamp(entry.createdAt)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {entry.note}
                      </p>
                    )}
                    {(entry.stress || entry.energy) && (
                      <div className="mt-2 flex flex-wrap gap-3">
                        {entry.stress && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-muted">
                              Stress
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 w-4 rounded-full ${
                                    i < entry.stress
                                      ? "bg-peach-deep"
                                      : "bg-cream"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {entry.energy && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-muted">
                              Energy
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 w-4 rounded-full ${
                                    i < entry.energy
                                      ? "bg-sun-deep"
                                      : "bg-cream"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
