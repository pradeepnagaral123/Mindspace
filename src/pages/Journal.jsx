import { useState } from "react";
import { Lock, PenLine, Plus, Send } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { moodOptions } from "../data/mockData";

const initialEntries = [
  {
    id: "j1",
    date: "Today · 8:40 AM",
    mood: "good",
    title: "A calmer morning",
    text: "I woke up before my alarm and took five minutes just to sit by the window. No phone, no noise. It's a small thing, but it set a softer tone for the whole day.",
  },
  {
    id: "j2",
    date: "Yesterday · 9:15 PM",
    mood: "low",
    title: "Heavy, but honest",
    text: "Today was hard. I felt low most of the afternoon and didn't want to talk to anyone. I went for a walk in the evening and it helped a little. I'm trying to be gentle with myself about it.",
  },
  {
    id: "j3",
    date: "Aug 8 · 7:30 PM",
    mood: "okay",
    title: "Assignment done",
    text: "Finally wrapped up the project that's been hanging over me. I feel neutral rather than relieved — but neutral is okay. One step at a time.",
  },
  {
    id: "j4",
    date: "Aug 7 · 8:05 PM",
    mood: "great",
    title: "Reconnected with Maya",
    text: "Met Maya after a long time. We just talked and laughed for an hour. I forgot how much connection fills my tank. I want more of this.",
  },
];

export default function Journal() {
  const [entries, setEntries] = useState(initialEntries);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState("okay");

  const submit = () => {
    if (!text.trim()) return;
    setEntries((current) => [
      {
        id: `j${Date.now()}`,
        date: "Just now",
        mood,
        title: title.trim() || "Untitled entry",
        text: text.trim(),
      },
      ...current,
    ]);
    setTitle("");
    setText("");
    setMood("okay");
    setComposing(false);
  };

  const moodFor = (id) =>
    moodOptions.find((option) => option.id === id) || moodOptions[2];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Journal
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            A private space to put your thoughts into words — your words, your
            pace.
          </p>
        </div>
        <button
          onClick={() => setComposing((value) => !value)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
        >
          {composing ? <Plus size={16} /> : <PenLine size={16} />}
          {composing ? "Close" : "New entry"}
        </button>
      </div>

      <Card className="border-mint/40 bg-gradient-to-br from-mint-soft/60 to-cream p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-mint">
            <Lock size={18} />
          </span>
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">Only you can see this.</span>{" "}
            Your journal is never shared with communities, peers or anyone else.
          </p>
        </div>
      </Card>

      {composing && (
        <Card className="p-5 sm:p-6">
          <h2 className="text-[15px] font-bold text-ink">New entry</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-muted">
              How were you feeling?
            </span>
            {moodOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setMood(option.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  mood === option.id
                    ? `${option.circle} ${option.text} ring-2 ${option.ring} ring-offset-2`
                    : "border border-line bg-white text-muted hover:bg-cream"
                }`}
              >
                <Icon name={option.icon} size={14} />
                {option.label}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your entry a title..."
            className="mt-4 w-full border-0 text-[15px] font-semibold text-ink outline-none placeholder:text-muted/60"
          />
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            placeholder="What's on your mind? There's no wrong way to write..."
            className="mt-2 w-full resize-none border-0 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/60"
          />
          <div className="mt-2 flex items-center justify-end border-t border-line/70 pt-3">
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
              Save entry
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {entries.map((entry) => {
          const entryMood = moodFor(entry.mood);
          return (
            <Card key={entry.id} className="p-5">
              <div className="flex items-start gap-3.5">
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
                    <h3 className="text-[15px] font-bold text-ink">
                      {entry.title}
                    </h3>
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-muted">
                      {entryMood.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{entry.date}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {entry.text}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
