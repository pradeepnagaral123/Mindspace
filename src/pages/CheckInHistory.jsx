import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { moodOptions } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatFullDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CheckInHistory() {
  const { token } = useAuth();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/moods/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data) setMoods(data.moods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const moodFor = (id) =>
    moodOptions.find((option) => option.id === id) || moodOptions[2];

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/moods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMoods((current) => current.filter((m) => m._id !== id));
      }
    } catch {
      // silently fail
    }
  };

  const total = moods.length;
  const last7 = moods.filter((m) => {
    const d = new Date(m.createdAt);
    const week = new Date();
    week.setDate(week.getDate() - 7);
    return d >= week;
  }).length;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Check-in History
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Your daily mood check-ins, tracked over time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 text-center">
          <p className="font-display text-3xl font-semibold text-ink">
            {total}
          </p>
          <p className="mt-1 text-[12px] font-medium text-muted">
            Total check-ins
          </p>
        </Card>
        <Card className="p-5 text-center">
          <p className="font-display text-3xl font-semibold text-mint-deep">
            {last7}
          </p>
          <p className="mt-1 text-[12px] font-medium text-muted">
            This week
          </p>
        </Card>
        <Card className="p-5 text-center">
          <p className="font-display text-3xl font-semibold text-lavender-deep">
            {moods.length > 0 ? moodFor(moods[0].mood).label : "—"}
          </p>
          <p className="mt-1 text-[12px] font-medium text-muted">
            Latest mood
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted">
          Loading your check-ins...
        </div>
      ) : moods.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm font-semibold text-ink">No check-ins yet</p>
          <p className="mt-1 text-[13px] text-muted">
            Start your first check-in from the Dashboard or Check-in page.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {moods.map((entry) => {
            const entryMood = moodFor(entry.mood);
            return (
              <Card key={entry._id} className="flex items-start gap-3.5 p-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${entryMood.circle}`}
                >
                  <Icon
                    name={entryMood.icon}
                    size={18}
                    className={entryMood.text}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-bold text-ink">
                      {entryMood.label}
                    </p>
                    <span className="text-xs text-muted">
                      {formatRelativeDate(entry.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted/60">
                    {formatFullDate(entry.createdAt)}
                  </p>
                  {(entry.stress || entry.energy) && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {entry.stress && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-muted">Stress</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 w-4 rounded-full ${
                                  i < entry.stress ? "bg-peach-deep" : "bg-cream"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {entry.energy && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-muted">Energy</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 w-4 rounded-full ${
                                  i < entry.energy ? "bg-sun-deep" : "bg-cream"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {entry.note && (
                    <p className="mt-2 text-[12px] leading-relaxed text-muted italic">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry(entry._id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted/50 transition-colors hover:bg-blossom-soft hover:text-blossom-deep"
                  title="Delete check-in"
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
