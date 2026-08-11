import { useState } from "react";
import { MoreVertical, Paperclip, Search, Send, Smile } from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";

const initialThreads = [
  {
    id: "maya",
    name: "Maya Kapoor",
    initials: "MK",
    gradient: "mint",
    status: "online",
    preview: "You're not alone — I felt the exact same way last semester.",
    time: "2m",
    unread: 1,
    messages: [
      { from: "peer", text: "Hey! How's your week going? 🌿" },
      { from: "me", text: "Honestly a little overwhelmed with assignments." },
      { from: "peer", text: "You're not alone — I felt the exact same way last semester." },
    ],
  },
  {
    id: "daniel",
    name: "Daniel Fernandes",
    initials: "DF",
    gradient: "lavender",
    status: "online",
    preview: "Thanks for sharing that. It really helped me today.",
    time: "18m",
    unread: 0,
    messages: [
      { from: "peer", text: "Thanks for sharing that. It really helped me today." },
      { from: "me", text: "That means a lot. We've got each other's backs." },
    ],
  },
  {
    id: "riya",
    name: "Riya Mehta",
    initials: "RM",
    gradient: "peach",
    status: "away",
    preview: "Sending you a warm hug today 🌷",
    time: "1h",
    unread: 2,
    messages: [
      { from: "peer", text: "Sending you a warm hug today 🌷" },
      { from: "peer", text: "Take a break if you need to, okay?" },
    ],
  },
  {
    id: "arjun",
    name: "Arjun Nair",
    initials: "AN",
    gradient: "sun",
    status: "online",
    preview: "The breathwork session helped a lot, thank you!",
    time: "Yesterday",
    unread: 0,
    messages: [
      { from: "peer", text: "The breathwork session helped a lot, thank you!" },
      { from: "me", text: "So glad to hear it. Same time next week?" },
    ],
  },
];

export default function Messages() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeId, setActiveId] = useState(initialThreads[0].id);
  const [draft, setDraft] = useState("");

  const activeThread = threads.find((thread) => thread.id === activeId);

  const openThread = (id) => {
    setActiveId(id);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === id ? { ...thread, unread: 0 } : thread,
      ),
    );
  };

  const sendMessage = () => {
    if (!draft.trim()) return;
    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeId
          ? {
              ...thread,
              messages: [...thread.messages, { from: "me", text: draft.trim() }],
              preview: draft.trim(),
              time: "Now",
            }
          : thread,
      ),
    );
    setDraft("");
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your supportive conversations, all in one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
        <Card className="flex flex-col p-2">
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
              />
              <input
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-line bg-cream py-2.5 pr-3 pl-10 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-mint-deep focus:bg-white focus:ring-2 focus:ring-mint/40"
              />
            </div>
          </div>

          <div className="space-y-1 overflow-y-auto p-1.5">
            {threads.map((thread) => {
              const active = thread.id === activeId;
              return (
                <button
                  key={thread.id}
                  onClick={() => openThread(thread.id)}
                  className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors ${
                    active ? "bg-navy" : "hover:bg-cream"
                  }`}
                >
                  <Avatar
                    name={thread.name}
                    size={40}
                    gradient={thread.gradient}
                    status={thread.status}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-[13px] font-bold ${
                          active ? "text-white" : "text-ink"
                        }`}
                      >
                        {thread.name}
                      </p>
                      <span
                        className={`shrink-0 text-[11px] ${
                          active ? "text-white/50" : "text-muted"
                        }`}
                      >
                        {thread.time}
                      </span>
                    </div>
                    <p
                      className={`mt-0.5 truncate text-[13px] ${
                        active ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {thread.preview}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blossom px-1.5 text-[10.5px] font-semibold text-white">
                      {thread.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex min-h-[540px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={activeThread.name}
                size={38}
                gradient={activeThread.gradient}
                status={activeThread.status}
              />
              <div>
                <p className="text-sm font-bold text-ink">
                  {activeThread.name}
                </p>
                <p
                  className={`text-xs ${
                    activeThread.status === "online"
                      ? "text-mint-deep"
                      : "text-muted"
                  }`}
                >
                  {activeThread.status === "online" ? "Online now" : "Away"}
                </p>
              </div>
            </div>
            <button
              className="rounded-lg p-2 text-muted hover:bg-cream hover:text-ink"
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 px-5 py-5">
            {activeThread.messages.map((message, index) => {
              const mine = message.from === "me";
              return (
                <div
                  key={index}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      mine
                        ? "rounded-br-md bg-navy text-white"
                        : "rounded-bl-md border border-line bg-white text-ink"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-line/70 bg-white px-4 py-3">
            <button
              className="rounded-lg p-2 text-muted hover:bg-cream hover:text-mint-deep"
              aria-label="Add attachment"
            >
              <Paperclip size={18} />
            </button>
            <button
              className="rounded-lg p-2 text-muted hover:bg-cream hover:text-mint-deep"
              aria-label="Add emoji"
            >
              <Smile size={18} />
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              placeholder="Write a kind message..."
              className="flex-1 rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-mint-deep focus:bg-white focus:ring-2 focus:ring-mint/40"
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
              Send
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
