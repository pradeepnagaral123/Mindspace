import { useState } from "react";
import {
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  UserPlus,
  Zap,
} from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";

const peers = [
  {
    id: "maya",
    name: "Maya Kapoor",
    initials: "MK",
    gradient: "mint",
    role: "Student · 3rd year",
    bio: "Been through the exam anxiety rollercoaster more times than I can count. Happy to just listen, always.",
    tags: ["#exams", "#anxiety", "#listener"],
    match: 94,
    status: "online",
  },
  {
    id: "daniel",
    name: "Daniel Fernandes",
    initials: "DF",
    gradient: "lavender",
    role: "Designer · 26",
    bio: "I use sketching and long walks to quiet my mind. Open to swapping coping strategies that actually work.",
    tags: ["#selfcare", "#creativity", "#cbt"],
    match: 88,
    status: "online",
  },
  {
    id: "riya",
    name: "Riya Mehta",
    initials: "RM",
    gradient: "peach",
    role: "Graduate student",
    bio: "Looking for a supportive conversation buddy. I believe small check-ins make a big difference.",
    tags: ["#mindfulness", "#journaling", "#peer-support"],
    match: 81,
    status: "away",
  },
  {
    id: "arjun",
    name: "Arjun Nair",
    initials: "AN",
    gradient: "sun",
    role: "Software engineer",
    bio: "Work stress got the better of me last year. Now I pay it forward by being there for others.",
    tags: ["#burnout", "#boundaries", "#listener"],
    match: 76,
    status: "online",
  },
  {
    id: "sofia",
    name: "Sofia D'Souza",
    initials: "SD",
    gradient: "blossom",
    role: "Teacher",
    bio: "Quiet voice, patient ear. I love discussing books and breathing exercises to unwind together.",
    tags: ["#breathwork", "#reading", "#wellbeing"],
    match: 72,
    status: "away",
  },
];

const intentOptions = [
  { id: "listen", label: "I mostly want to listen", icon: ThumbsUp },
  { id: "share", label: "I mostly want to share", icon: MessageCircle },
  { id: "both", label: "A bit of both", icon: Zap },
];

const topicChips = ["Anxiety", "Exams", "Sleep", "Burnout", "Grief", "Relationships", "Self-care"];

export default function FindAPeer() {
  const [intent, setIntent] = useState("both");
  const [topics, setTopics] = useState(["Anxiety"]);
  const [connected, setConnected] = useState({});
  const [matched, setMatched] = useState(peers[0].id);
  const [currentPeer, setCurrentPeer] = useState(peers[0]);

  const toggleTopic = (topic) => {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  };

  const toggleConnect = (id) => {
    setConnected((current) => ({ ...current, [id]: !current[id] }));
  };

  const handleMatch = () => {
    const next =
      peers[(peers.findIndex((peer) => peer.id === matched) + 1) % peers.length];
    setMatched(next.id);
    setCurrentPeer(next);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Find a Peer
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          We'll match you with someone who shares similar experiences — one
          supportive conversation at a time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card className="overflow-hidden p-0">
          <div className="bg-navy p-6 text-white">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-mint uppercase">
              <Sparkles size={14} />
              Your match
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Avatar
                name={currentPeer.name}
                size={56}
                gradient={currentPeer.gradient}
                status={currentPeer.status}
              />
              <div>
                <p className="text-base font-bold">{currentPeer.name}</p>
                <p className="text-[13px] text-white/60">{currentPeer.role}</p>
                <p className="mt-0.5 text-xs font-semibold text-mint">
                  {currentPeer.match}% compatible
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm leading-relaxed text-muted">
              {currentPeer.bio}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {currentPeer.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-mint-deep"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => toggleConnect(currentPeer.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                  connected[currentPeer.id]
                    ? "bg-mint-soft text-mint-deep"
                    : "bg-navy text-white hover:bg-navy-2"
                }`}
              >
                {connected[currentPeer.id] ? (
                  "Connected"
                ) : (
                  <>
                    <UserPlus size={15} />
                    Connect
                  </>
                )}
              </button>
              <button
                onClick={handleMatch}
                className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
              >
                <RefreshCw size={15} />
                New match
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-[15px] font-bold text-ink">
              What are you looking for?
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {intentOptions.map((option) => {
                const active = intent === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setIntent(option.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[13px] font-semibold transition-colors ${
                      active
                        ? "border-mint-deep/50 bg-mint-soft text-mint-deep"
                        : "border-line bg-white text-muted hover:bg-cream"
                    }`}
                  >
                    <Icon size={17} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <h2 className="mt-5 text-[15px] font-bold text-ink">
              Topics you relate to
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topicChips.map((topic) => {
                const active = topics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? "bg-navy text-white"
                        : "border border-line bg-white text-muted hover:bg-cream"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-lavender-soft px-3.5 py-2.5 text-[13px] font-medium text-lavender-deep">
              <ShieldCheck size={15} />
              Matches are always anonymous until you choose to reveal yourself.
              You stay in control.
            </div>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-ink">
                Suggested peers
              </h2>
              <span className="text-[12px] text-muted">
                Sorted by compatibility
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {peers.slice(1).map((peer) => {
                const isConnected = connected[peer.id];
                return (
                  <Card key={peer.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={peer.name}
                        size={40}
                        gradient={peer.gradient}
                        status={peer.status}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-ink">
                          {peer.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {peer.role} · {peer.match}% match
                        </p>
                      </div>
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {peer.bio}
                    </p>
                    <button
                      onClick={() => toggleConnect(peer.id)}
                      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                        isConnected
                          ? "bg-mint-soft text-mint-deep"
                          : "border border-line bg-white text-ink hover:bg-cream"
                      }`}
                    >
                      {isConnected ? (
                        "Connected"
                      ) : (
                        <>
                          <UserPlus size={14} />
                          Connect
                        </>
                      )}
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
