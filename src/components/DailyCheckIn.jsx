import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Smile } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function DailyCheckIn() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState({ stress: 2, energy: 3, mood: 4 });
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/moods/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data) setStats({ stress: data.stress, energy: data.energy, mood: data.mood });
      })
      .catch(() => {});

    fetch(`${API_URL}/journals/count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => { if (data) setJournalCount(data.count); })
      .catch(() => {});
  }, [token]);

  const metrics = [
    { label: "Stress", value: stats.stress, max: 5, color: "bg-gradient-to-r from-peach to-peach-deep" },
    { label: "Energy", value: stats.energy, max: 5, color: "bg-gradient-to-r from-sun to-sun-deep" },
    { label: "Mood", value: stats.mood, max: 5, color: "bg-gradient-to-r from-lavender to-lavender-deep" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sun/30 bg-gradient-to-br from-sun-soft/60 via-white to-peach-soft/40 p-5 shadow-[0_4px_24px_rgba(244,214,109,0.14),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(244,214,109,0.2),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-sun/12 blur-2xl" />
      <div className="absolute -bottom-8 left-1/4 h-20 w-20 rounded-full bg-peach/10 blur-2xl" />

      <div className="relative mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Today&rsquo;s Summary</h3>
        <span className="flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold text-lavender-deep shadow-sm">
          <Smile size={11} />
          {stats.mood >= 4 ? "Good" : stats.mood >= 3 ? "Okay" : "Care"}
        </span>
      </div>

      <div className="relative space-y-3">
        {metrics.map((metric) => {
          const pct = Math.round((metric.value / metric.max) * 100);
          return (
            <div key={metric.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ink/80">
                  {metric.label}
                </span>
                <span className="text-[10px] text-muted/50">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/60">
                <div
                  className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {journalCount > 0 && (
        <p className="relative mt-2.5 text-[10px] text-muted/50">
          {journalCount} journal {journalCount === 1 ? "entry" : "entries"} so far
        </p>
      )}

      <button
        onClick={() => navigate("/journal")}
        className="relative mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-navy to-navy-2 px-4 py-2 text-[11px] font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
      >
        <PenLine size={13} />
        Write in Journal
      </button>
    </div>
  );
}
