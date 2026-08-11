import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Check, PenLine } from "lucide-react";
import Card from "../components/Card";
import MoodCheckIn from "../components/MoodCheckIn";
import { checkInMetrics, moodOptions } from "../data/mockData";
import Icon from "../components/icons";

const weekTrend = [
  { day: "Mon", mood: "okay", value: 3 },
  { day: "Tue", mood: "good", value: 4 },
  { day: "Wed", mood: "low", value: 2 },
  { day: "Thu", mood: "good", value: 4 },
  { day: "Fri", mood: "great", value: 5 },
  { day: "Sat", mood: "okay", value: 3 },
  { day: "Sun", mood: "good", value: 4 },
];

const history = [
  { date: "Today · 8:42 AM", mood: "good", note: "Slept better than usual. Felt ready for the day." },
  { date: "Yesterday · 9:15 PM", mood: "low", note: "A heavy day. Took a walk in the evening and it helped." },
  { date: "Aug 8 · 7:30 PM", mood: "okay", note: "Neutral day. Wrapped up a tough assignment." },
  { date: "Aug 7 · 8:05 PM", mood: "great", note: "Met a friend after a long time. Felt light." },
];

const reflections = [
  "What's one thing you're grateful for today?",
  "What's been taking up most of your energy lately?",
  "What would be a kind thing to do for yourself tonight?",
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(
    Object.fromEntries(checkInMetrics.map((metric) => [metric.label, metric.value])),
  );
  const [mood, setMood] = useState("good");
  const [reflection, setReflection] = useState(0);

  const activeMood = moodOptions.find((option) => option.id === mood);

  const moodColorFor = (id) =>
    moodOptions.find((option) => option.id === id)?.text || "text-muted";

  const setMetric = (label, value) => {
    setMetrics((current) => ({ ...current, [label]: value }));
  };

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

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <MoodCheckIn
          className="lg:col-span-2"
          onCheckIn={(id) => setMood(id)}
        />

        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarHeart size={17} className="text-mint-deep" />
            <h3 className="text-[15px] font-bold text-ink">Your streak</h3>
          </div>
          <p className="font-display text-4xl font-semibold text-ink">9 days</p>
          <p className="mt-1 text-[13px] text-muted">
            of showing up for yourself. Keep going — you're doing amazing.
          </p>
          <div className="mt-4 flex gap-1.5">
            {Array.from({ length: 14 }).map((_, index) => (
              <span
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index < 9 ? "bg-mint-deep" : "bg-cream"
                }`}
              />
            ))}
          </div>
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
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    {metric.label}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {metrics[metric.label]}/5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={metrics[metric.label]}
                  onChange={(event) => setMetric(metric.label, Number(event.target.value))}
                  className="w-full accent-[#2fae7f]"
                />
                <div className="mt-0.5 flex justify-between px-0.5 text-[11px] text-muted">
                  <span>Hard</span>
                  <span>Gentle</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-mint-soft px-3.5 py-2.5 text-[12px] font-medium text-mint-deep">
            <Check size={14} />
            All saved — you can update this anytime.
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <h3 className="text-[15px] font-bold text-ink">
            This week at a glance
          </h3>
          <div className="mt-4 flex flex-1 items-end justify-between gap-2">
            {weekTrend.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <Icon name={day.mood} size={16} className={moodColorFor(day.mood)} />
                <span className="h-24 w-full max-w-[18px] rounded-full bg-cream">
                  <span
                    className={`block w-full rounded-full ${
                      day.mood === "great"
                        ? "bg-mint"
                        : day.mood === "good"
                          ? "bg-lavender"
                          : day.mood === "okay"
                            ? "bg-sun"
                            : "bg-blossom"
                    }`}
                    style={{ height: `${(day.value / 5) * 100}%` }}
                  />
                </span>
                <span className="text-[11px] font-medium text-muted">
                  {day.day}
                </span>
              </div>
            ))}
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
              {reflections[reflection]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReflection((value) => (value + 1) % reflections.length)}
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
        <h3 className="mb-3 text-[15px] font-bold text-ink">Recent check-ins</h3>
        <div className="space-y-3">
          {history.map((entry) => {
            const entryMood = moodOptions.find((option) => option.id === entry.mood);
            return (
              <Card key={entry.date} className="flex items-start gap-3.5 p-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${entryMood.circle}`}
                >
                  <Icon name={entryMood.icon} size={18} className={entryMood.text} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-bold text-ink">{entryMood.label}</p>
                    <span className="text-xs text-muted">{entry.date}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {entry.note}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
