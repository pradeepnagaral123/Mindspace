import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const fallbackConnections = [
  {
    id: "c1",
    name: "Maya Kapoor",
    message: "You're not alone — I felt the exact same way.",
    status: "online",
    time: "2m ago",
    gradient: "from-mint to-lavender",
  },
  {
    id: "c2",
    name: "Daniel Fernandes",
    message: "Thanks for sharing that. It helped me today.",
    status: "online",
    time: "18m ago",
    gradient: "from-lavender to-blossom",
  },
  {
    id: "c3",
    name: "Riya Mehta",
    message: "Sending you a warm hug today",
    status: "away",
    time: "1h ago",
    gradient: "from-peach to-sun",
  },
];

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ConnectionsCard() {
  const { token } = useAuth();
  const [connections, setConnections] = useState(fallbackConnections);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/connections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data?.connections?.length > 0) {
          setConnections(
            data.connections.map((c, i) => ({
              id: c._id,
              name: c.peer?.name || `Peer ${i + 1}`,
              initials: c.peer?.name
                ? c.peer.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                : "?",
              message: c.lastMessage || "Connected",
              status: "online",
              time: timeAgo(c.updatedAt),
              gradient: ["from-mint to-lavender", "from-lavender to-blossom", "from-peach to-sun", "from-sun to-mint", "from-blossom to-peach"][i % 5],
            }))
          );
        }
      })
      .catch(() => {});
  }, [token]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-br from-mint-soft/80 via-white to-sun-soft/40 p-5 shadow-[0_4px_24px_rgba(165,240,210,0.14),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(165,240,210,0.2),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-mint/12 blur-2xl" />
      <div className="absolute -bottom-8 left-1/3 h-20 w-20 rounded-full bg-sun/10 blur-2xl" />

      <div className="relative mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Connections</h3>
        <Link
          to="/messages"
          className="flex items-center gap-1 text-[11px] font-semibold text-mint-deep hover:text-mint-deep/80"
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      <div className="relative space-y-1">
        {connections.map((peer) => (
          <Link
            to="/messages"
            key={peer.id}
            className="group flex items-start gap-2.5 rounded-xl bg-white/50 p-2 transition-all hover:bg-white hover:shadow-sm"
          >
            <Avatar
              name={peer.name}
              gradient={peer.gradient}
              status={peer.status}
              size={32}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[12px] font-semibold text-ink">
                  {peer.name}
                </p>
                <span className="shrink-0 text-[10px] text-muted/50">
                  {peer.time}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-muted/65">
                {peer.message}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
