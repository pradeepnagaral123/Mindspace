import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  ShieldCheck,
  ThumbsUp,
  UserPlus,
  Zap,
} from "lucide-react";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const memberGradients = ["mint", "lavender", "peach", "blossom", "sun"];

const intentOptions = [
  { id: "listen", label: "I mostly want to listen", icon: ThumbsUp },
  { id: "share", label: "I mostly want to share", icon: MessageCircle },
  { id: "both", label: "A bit of both", icon: Zap },
];

const topicChips = ["Anxiety", "Exams", "Sleep", "Burnout", "Grief", "Relationships", "Self-care"];

function joinedLabel(date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

export default function FindAPeer() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [intent, setIntent] = useState("both");
  const [topics, setTopics] = useState(["Anxiety"]);
  const [connected, setConnected] = useState({});
  const [members, setMembers] = useState([]);
  const [connecting, setConnecting] = useState({});
  const [memberConnectionIds, setMemberConnectionIds] = useState({});

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/connections/suggestions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (Array.isArray(data?.users)) {
          setMembers(data.users);
          setConnected((current) => {
            const next = { ...current };
            data.users.forEach((u) => {
              if (u.connected) next[u._id] = true;
            });
            return next;
          });
          setMemberConnectionIds((current) => {
            const next = { ...current };
            data.users.forEach((u) => {
              if (u.connectionId) next[u._id] = u.connectionId;
            });
            return next;
          });
        }
      })
      .catch(() => {});
  }, [token]);

  const connectToMember = async (member) => {
    if (connected[member._id] || connecting[member._id]) return;
    setConnecting((current) => ({ ...current, [member._id]: true }));
    try {
      const res = await fetch(`${API_URL}/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ peerId: member._id }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        setConnected((current) => ({ ...current, [member._id]: true }));
        if (data?.connection?._id) {
          setMemberConnectionIds((current) => ({
            ...current,
            [member._id]: data.connection._id,
          }));
        }
      }
    } catch {
      // network failure — leave button unchanged
    } finally {
      setConnecting((current) => ({ ...current, [member._id]: false }));
    }
  };

  const toggleTopic = (topic) => {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
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
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-[15px] font-bold text-ink">
              What are you looking for?
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {intentOptions.map((option) => {
                const active = intent === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setIntent(option.id)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
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

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-lavender-soft px-3.5 py-2.5 text-[13px] font-medium text-lavender-deep">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              Matches are always anonymous until you choose to reveal yourself.
              You stay in control.
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">Verified members</h2>
            <span className="text-[12px] text-muted">
              Real accounts from the MindSpace community
            </span>
          </div>

          {members.length === 0 ? (
            <Card className="px-6 py-10 text-center">
              <ShieldCheck size={22} className="mx-auto text-muted" />
              <p className="mt-2 text-[13px] font-semibold text-ink">
                No members to show yet
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Verified members will appear here as the community grows.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {members.map((member, index) => {
                const isConnected = connected[member._id];
                const isConnecting = connecting[member._id];
                return (
                  <Card key={member._id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.name}
                        size={40}
                        gradient={memberGradients[index % memberGradients.length]}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-ink">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          Joined {joinedLabel(member.createdAt)}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-semibold text-mint-deep">
                        <ShieldCheck size={11} />
                        Verified
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => connectToMember(member)}
                        disabled={isConnecting || isConnected}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold transition-colors ${
                          isConnected
                            ? "bg-mint-soft text-mint-deep"
                            : "border border-line bg-white text-ink hover:bg-cream disabled:opacity-60"
                        }`}
                      >
                        {isConnected ? (
                          "Connected"
                        ) : (
                          <>
                            <UserPlus size={14} />
                            {isConnecting ? "Connecting..." : "Connect"}
                          </>
                        )}
                      </button>
                      {isConnected && memberConnectionIds[member._id] && (
                        <button
                          onClick={() =>
                            navigate(
                              `/messages?connection=${memberConnectionIds[member._id]}`,
                            )
                          }
                          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-navy-2"
                        >
                          <Send size={14} />
                          Message
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
