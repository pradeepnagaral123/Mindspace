import { useState, useEffect } from "react";
import { Lock, PenLine, Plus, Send, Trash2 } from "lucide-react";
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

export default function Journal() {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState("okay");
  const [saving, setSaving] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/journals`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.journals);
      }
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/journals`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: title.trim() || "Untitled entry",
          text: text.trim(),
          mood,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntries((current) => [data.journal, ...current]);
        setTitle("");
        setText("");
        setMood("okay");
        setComposing(false);
      }
    } catch (error) {
      console.error("Failed to save journal:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/journals/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setEntries((current) => current.filter((e) => e._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete journal:", error);
    }
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
              disabled={!text.trim() || saving}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
              {saving ? "Saving..." : "Save entry"}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted">Loading your journals...</div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted">
          No entries yet. Start writing to capture your thoughts.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const entryMood = moodFor(entry.mood);
            return (
              <Card key={entry._id} className="p-5">
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
                    <p className="mt-0.5 text-xs text-muted">
                      {formatRelativeDate(entry.createdAt)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {entry.text}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted/50 transition-colors hover:bg-blossom-soft hover:text-blossom-deep"
                    title="Delete entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
