import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Plus, Search, Users } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const communityData = [
  { id: "student-support", name: "Student Support Circle", icon: "graduationCap", members: "2.4k", description: "Exams, deadlines and everything in between. We get it.", category: "Support", accent: "bg-mint-soft text-mint-deep", joined: false },
  { id: "anxiety-relief", name: "Anxiety Relief", icon: "wind", members: "1.8k", description: "Gentle practices and kind words for anxious days.", category: "Wellbeing", accent: "bg-lavender-soft text-lavender-deep", joined: false },
  { id: "mindful-moments", name: "Mindful Moments", icon: "flower2", members: "3.1k", description: "Slow down, breathe and notice the small good things.", category: "Mindfulness", accent: "bg-blossom-soft text-blossom-deep", joined: false },
  { id: "new-parents", name: "New Parents United", icon: "usersRound", members: "1.2k", description: "Sleepless nights, big feelings and tiny victories.", category: "Support", accent: "bg-peach-soft text-peach-deep", joined: false },
  { id: "sleep-better", name: "Sleep Better Together", icon: "sparkles", members: "2.9k", description: "Wind-down rituals and stories to help you rest.", category: "Wellbeing", accent: "bg-sun-soft text-sun-deep", joined: false },
  { id: "breathwork-circle", name: "Breathwork Circle", icon: "wind", members: "860", description: "Five minutes a day to reset your nervous system.", category: "Mindfulness", accent: "bg-mint-soft text-mint-deep", joined: false },
  { id: "grief-and-loss", name: "Grief & Loss", icon: "cloudRain", members: "1.5k", description: "A soft place to sit with loss — at your own pace.", category: "Support", accent: "bg-lavender-soft text-lavender-deep", joined: false },
  { id: "self-care-daily", name: "Self-Care Daily", icon: "smile", members: "4.2k", description: "Small habits, gentle reminders, one day at a time.", category: "Wellbeing", accent: "bg-blossom-soft text-blossom-deep", joined: false },
  { id: "meditation-pals", name: "Meditation Pals", icon: "compass", members: "2.1k", description: "Guided sits and shared quiet — together is easier.", category: "Mindfulness", accent: "bg-mint-soft text-mint-deep", joined: false },
];

const tabs = ["All", "Support", "Wellbeing", "Mindfulness"];

export default function Communities() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [real, setReal] = useState(null);
  const [joined, setJoined] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const { query, setQuery } = useSearch();

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/communities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReal((data.communities || [])[0] || null);
      }
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const term = query.trim().toLowerCase();

  const cards = communityData.map((community) => {
    if (community.id === "student-support" && real) {
      return {
        ...community,
        realId: real._id,
        name: real.name,
        description: real.description,
        members: String(real.memberCount),
        joined: real.joinedByMe,
      };
    }
    return community;
  });

  const visible = cards.filter((community) => {
    const matchesTab = activeTab === "All" || community.category === activeTab;
    const matchesQuery = term
      ? community.name.toLowerCase().includes(term) ||
        community.description.toLowerCase().includes(term)
      : true;
    return matchesTab && matchesQuery;
  });

  const isJoined = (community) => joined[community.id] ?? community.joined;

  const toggleJoin = async (community) => {
    if (community.realId) {
      setTogglingId(community.id);
      try {
        const res = await fetch(
          `${API_URL}/communities/${community.realId}/${
            isJoined(community) ? "leave" : "join"
          }`,
          {
            method: isJoined(community) ? "DELETE" : "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.ok ? await res.json() : null;
        if (data) {
          setReal((current) =>
            current
              ? {
                  ...current,
                  joinedByMe: data.joined,
                  memberCount: data.memberCount,
                }
              : current
          );
        }
      } catch {
        // ignore
      } finally {
        setTogglingId(null);
      }
      return;
    }
    setJoined((current) => ({ ...current, [community.id]: !isJoined(community) }));
  };

  const openCommunity = (community) => {
    if (community.realId) {
      navigate(`/communities/${community.realId}`);
    } else {
      navigate(`/communities/${community.id}`);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Communities
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Safe, moderated spaces to connect with peers who understand what
            you're going through.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2">
          <Plus size={16} />
          Create Community
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-line bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-navy text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search communities..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pr-3 pl-10 text-sm text-ink shadow-sm outline-none placeholder:text-muted/70 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-ink">Nothing found yet</p>
          <p className="mt-1 text-[13px] text-muted">
            Try a different category or search term.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((community) => {
            const joinedStatus = isJoined(community);
            return (
              <Card
                key={community.id}
                className="group flex flex-col p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${community.accent}`}
                  >
                    <Icon name={community.icon} size={22} strokeWidth={2} />
                  </span>
                  <span className="flex items-center gap-1.5">
                    {community.realId && (
                      <span className="rounded-full bg-mint-deep px-2 py-0.5 text-[10px] font-bold text-white">
                        Live
                      </span>
                    )}
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                      {community.category}
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => openCommunity(community)}
                  className="mt-4 text-left text-[15px] font-bold text-ink group-hover:text-mint-deep"
                >
                  {community.name}
                </button>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
                  <Users size={11} />
                  {community.members} members
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {community.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleJoin(community)}
                    disabled={togglingId === community.id}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60 ${
                      joinedStatus
                        ? "bg-mint-soft text-mint-deep hover:bg-mint-soft/70"
                        : "bg-navy text-white hover:bg-navy-2"
                    }`}
                  >
                    {joinedStatus && <Check size={14} />}
                    {joinedStatus ? "Joined" : "Join"}
                  </button>
                  <button
                    onClick={() => openCommunity(community)}
                    className="rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
                  >
                    View
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="relative overflow-hidden border-mint/40 bg-gradient-to-br from-mint-soft/70 to-cream p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-mint">
              <Icon name="sparkles" size={22} />
            </span>
            <div>
              <h3 className="text-[15px] font-bold text-ink">
                Don't see your people yet?
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                Start a community around anything that matters to you.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white">
            <Plus size={15} />
            Start your own
          </button>
        </div>
      </Card>
    </div>
  );
}
