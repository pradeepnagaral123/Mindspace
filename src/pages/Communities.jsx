import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Check, Plus, Search, Trash2, Users } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import CreateCommunityModal from "../components/CreateCommunityModal";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const tabs = ["All", "By You", "Support", "Wellbeing", "Mindfulness"];

const shapeCommunity = (community) => ({
  id: community._id,
  realId: community._id,
  name: community.name,
  description: community.description,
  category: community.category,
  icon: community.icon,
  accent: community.accent,
  members: String(community.memberCount),
  joined: community.joinedByMe,
  createdByMe: community.createdByMe,
});

export default function Communities() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [savedIds, setSavedIds] = useState(() => new Set());
  const { query, setQuery } = useSearch();

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const [res, savedRes] = await Promise.all([
        fetch(`${API_URL}/communities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (res.ok) {
        const data = await res.json();
        setCommunities((data.communities || []).map(shapeCommunity));
      }
      if (savedRes.ok) {
        const data = await savedRes.json();
        setSavedIds(
          new Set(
            (data.items || [])
              .filter((item) => item.itemType === "community")
              .map((item) => item.refId)
          )
        );
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
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "By You"
          ? community.createdByMe
          : community.category === activeTab;
    const matchesQuery = term
      ? community.name.toLowerCase().includes(term) ||
        community.description.toLowerCase().includes(term)
      : true;
    return matchesTab && matchesQuery;
  });

  const toggleJoin = async (community) => {
    setTogglingId(community.id);
    try {
      const res = await fetch(
        `${API_URL}/communities/${community.realId}/${
          community.joined ? "leave" : "join"
        }`,
        {
          method: community.joined ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.ok ? await res.json() : null;
      if (data) {
        setCommunities((current) =>
          current.map((item) =>
            item.id === community.id
              ? {
                  ...item,
                  joined: data.joined,
                  members: String(data.memberCount),
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

  const openCommunity = (community) => {
    navigate(`/communities/${community.realId}`);
  };

  const deleteCommunity = async (community) => {
    if (
      !window.confirm(
        `Delete "${community.name}"? This will remove the community and its posts.`
      )
    ) {
      return;
    }
    setDeletingId(community.id);
    try {
      const res = await fetch(`${API_URL}/communities/${community.realId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCommunities((current) =>
          current.filter((item) => item.id !== community.id)
        );
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const createCommunity = async (payload) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch(`${API_URL}/communities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }
      const c = data?.community;
      if (c) {
        setCommunities((current) => [shapeCommunity(c), ...current]);
        setModalOpen(false);
        setActiveTab("All");
        navigate(`/communities/${c._id}`);
      }
    } catch (error) {
      setCreateError(error.message || "Could not create community");
    } finally {
      setCreating(false);
    }
  };

  const toggleSave = async (community) => {
    const isSaved = savedIds.has(community.id);
    setSavedIds((current) => {
      const next = new Set(current);
      if (isSaved) next.delete(community.id);
      else next.add(community.id);
      return next;
    });
    try {
      if (isSaved) {
        await fetch(`${API_URL}/saved/community/${community.realId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`${API_URL}/saved`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemType: "community",
            refId: community.realId,
            title: community.name,
            description: community.description,
            category: community.category,
            meta: `${community.members} members`,
            icon: community.icon,
            accent: community.accent,
          }),
        });
      }
    } catch {
      // ignore
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
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
        >
          <Plus size={16} />
          Create Community
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl border px-4 py-2 text-[13px] font-semibold shadow-sm transition-colors ${
                activeTab === tab
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-muted hover:bg-cream hover:text-ink"
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
          {visible.map((community) => {
            const joinedStatus = community.joined;
            return (
              <Card
                key={community.id}
                className="group flex flex-col p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${community.accent}`}
                  >
                    <Icon name={community.icon} size={22} strokeWidth={2} />
                  </span>
                  <button
                    onClick={() => toggleSave(community)}
                    aria-label={
                      savedIds.has(community.id)
                        ? "Remove from saved"
                        : "Save community"
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      savedIds.has(community.id)
                        ? "border-mint/40 bg-mint-soft text-mint-deep hover:bg-mint-soft/70"
                        : "border-line bg-white text-muted hover:bg-cream hover:text-ink"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      className={
                        savedIds.has(community.id) ? "fill-current" : ""
                      }
                    />
                  </button>
                </div>

                <button
                  onClick={() => openCommunity(community)}
                  className="mt-4 text-left text-base font-extrabold text-ink group-hover:text-mint-deep"
                >
                  {community.name}
                </button>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
                  <Users size={11} />
                  {community.members} members
                </p>
                {community.createdByMe && (
                  <span className="mt-2 inline-flex w-fit items-center rounded-full bg-mint-soft px-2.5 py-0.5 text-[11px] font-semibold text-mint-deep">
                    Created by you
                  </span>
                )}
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
                  {community.createdByMe && (
                    <button
                      onClick={() => deleteCommunity(community)}
                      disabled={deletingId === community.id}
                      aria-label="Delete community"
                      className="flex items-center justify-center rounded-xl border border-blossom/40 bg-white px-3 py-2 text-blossom-deep transition-colors hover:bg-blossom-soft disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
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
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <Plus size={15} />
            Start your own
          </button>
        </div>
      </Card>

      <CreateCommunityModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCreateError("");
        }}
        onSubmit={createCommunity}
        submitting={creating}
        error={createError}
      />
    </div>
  );
}
