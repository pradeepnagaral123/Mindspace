import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Search, Users } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const tabs = ["All", "Support", "Wellbeing", "Mindfulness"];

export default function Communities() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setCommunities(data.communities || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const term = query.trim().toLowerCase();

  const visible = communities.filter((community) => {
    const matchesTab = activeTab === "All" || community.category === activeTab;
    const matchesQuery = term
      ? community.name.toLowerCase().includes(term) ||
        community.description.toLowerCase().includes(term)
      : true;
    return matchesTab && matchesQuery;
  });

  const toggleJoin = async (community) => {
    if (!community.joinedByMe && !window.confirm(`Join "${community.name}"?`)) {
      return;
    }
    setTogglingId(community._id);
    try {
      const res = await fetch(
        `${API_URL}/communities/${community._id}/${
          community.joinedByMe ? "leave" : "join"
        }`,
        {
          method: community.joinedByMe ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.ok ? await res.json() : null;
      if (data) {
        setCommunities((current) =>
          current.map((item) =>
            item._id === community._id
              ? {
                  ...item,
                  joinedByMe: data.joined,
                  memberCount: data.memberCount,
                }
              : item
          )
        );
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Communities
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Safe, moderated spaces to connect with peers who understand what
          you're going through.
        </p>
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

      {loading ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-muted">Loading communities...</p>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-ink">Nothing found yet</p>
          <p className="mt-1 text-[13px] text-muted">
            Try a different category or search term.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((community) => (
            <Card
              key={community._id}
              className="group flex flex-col p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${community.accent}`}
                >
                  <Icon name={community.icon} size={22} strokeWidth={2} />
                </span>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {community.category}
                </span>
              </div>

              <Link
                to={`/communities/${community._id}`}
                className="mt-4 text-[15px] font-bold text-ink group-hover:text-mint-deep"
              >
                {community.name}
              </Link>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
                <Users size={11} />
                {community.memberCount}{" "}
                {community.memberCount === 1 ? "member" : "members"}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {community.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => toggleJoin(community)}
                  disabled={togglingId === community._id}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60 ${
                    community.joinedByMe
                      ? "bg-mint-soft text-mint-deep hover:bg-mint-soft/70"
                      : "bg-navy text-white hover:bg-navy-2"
                  }`}
                >
                  {community.joinedByMe && <Check size={14} />}
                  {community.joinedByMe ? "Joined" : "Join"}
                </button>
                <button
                  onClick={() => navigate(`/communities/${community._id}`)}
                  className="rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
                >
                  View
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
