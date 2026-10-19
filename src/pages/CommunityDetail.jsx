import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Globe,
  Heart,
  LifeBuoy,
  MessageCircle,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Scale,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import Avatar from "../components/Avatar";
import sittingWomen from "../images/sitting_women.png";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const filterPills = ["All", "Questions", "Wins", "Venting", "Resources"];

const rules = [
  { icon: Heart, text: "Be kind — everyone here is doing their best." },
  { icon: Scale, text: "No medical advice or diagnosis." },
  { icon: ShieldCheck, text: "In a crisis, contact helplines immediately." },
];

const resourceRows = [
  { icon: BookOpen, label: "Browse resources", to: "/resources" },
  { icon: LifeBuoy, label: "Crisis helplines", to: "/helplines" },
  { icon: ShieldCheck, label: "Safety centre", to: "/safety" },
  { icon: NotebookPen, label: "Your journal", to: "/journal" },
];

const hoursAgo = (hours) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const mockPosts = [
  {
    _id: "mock-1",
    author: { _id: "mock-u1", name: "Aarav Menon" },
    text: "Finals week is next week and I keep freezing every time I open my notes. Does anyone have a routine that actually helps with exam anxiety? Even small things would help.",
    likeCount: 18,
    likedByMe: false,
    createdAt: hoursAgo(2),
  },
  {
    _id: "mock-2",
    author: { _id: "mock-u2", name: "Mira Kapoor" },
    text: "Small win: I finally went to the library for two hours without checking my phone every five minutes. Two hours felt like a whole day, but I'll take it. 🌱",
    likeCount: 34,
    likedByMe: true,
    createdAt: hoursAgo(5),
  },
  {
    _id: "mock-3",
    author: { _id: "mock-u3", name: "Sam Iyer" },
    text: "Reminder that a 60% semester is still a semester passed. I used to think anything below perfect was a failure, and I'm slowly learning that rest is part of the work too.",
    likeCount: 42,
    likedByMe: false,
    createdAt: hoursAgo(9),
  },
  {
    _id: "mock-4",
    author: { _id: "mock-u4", name: "Priya Nair" },
    text: "Does anyone else feel more anxious after scrolling through everyone's 'productive morning routine' posts? Trying to swap the comparison spiral for a 10-minute walk instead.",
    likeCount: 27,
    likedByMe: false,
    createdAt: hoursAgo(20),
  },
];

function WorkspaceArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 340 180"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMaxYMax meet"
    >
      <rect x="222" y="16" width="100" height="114" rx="12" fill="#ffffff" fillOpacity="0.45" />
      <rect
        x="222"
        y="16"
        width="100"
        height="114"
        rx="12"
        stroke="#7c5cd0"
        strokeOpacity="0.14"
        strokeWidth="2"
      />
      <path d="M272 16v114" stroke="#7c5cd0" strokeOpacity="0.12" strokeWidth="2" />
      <path d="M222 73h100" stroke="#7c5cd0" strokeOpacity="0.12" strokeWidth="2" />
      <circle cx="249" cy="44" r="11" fill="#f4d66d" fillOpacity="0.45" />
      <path
        d="M158 156c-18-8-29-28-24-48 18 2 33 16 37 35"
        fill="#2fae7f"
        fillOpacity="0.16"
      />
      <path
        d="M158 156c15-11 22-32 13-50-15 7-26 22-26 39"
        fill="#2fae7f"
        fillOpacity="0.24"
      />
      <path
        d="M158 156v-36"
        stroke="#2fae7f"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M138 154h40l-5 26h-30l-5-26Z" fill="#dc7a49" fillOpacity="0.26" />
      <rect x="250" y="144" width="66" height="10" rx="3" fill="#ff9dbb" fillOpacity="0.38" />
      <rect x="256" y="156" width="60" height="10" rx="3" fill="#c7a8ff" fillOpacity="0.38" />
      <rect x="262" y="168" width="54" height="10" rx="3" fill="#a5f0d2" fillOpacity="0.5" />
    </svg>
  );
}

function timeAgo(dateStr) {  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommunityDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState(mockPosts);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [communityRes, postsRes, membersRes] = await Promise.all([
        fetch(`${API_URL}/communities/${id}`, { headers }),
        fetch(`${API_URL}/communities/${id}/posts`, { headers }),
        fetch(`${API_URL}/communities/${id}/members`, { headers }),
      ]);
      if (communityRes.status === 404) {
        setNotFound(true);
        return;
      }
      if (communityRes.ok) {
        const data = await communityRes.json();
        setCommunity(data.community);
      }
      if (postsRes.ok) {
        const data = await postsRes.json();
        if (data.posts?.length) setPosts(data.posts);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!menuOpenId) return;
    const onPointerDown = (event) => {
      if (!event.target.closest("[data-post-menu]")) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpenId]);

  const isOwnPost = (post) =>
    Boolean(user?.id && post.author?._id === user.id);

  const copyPost = async (post) => {
    setMenuOpenId(null);
    try {
      await navigator.clipboard.writeText(post.text);
      setCopiedId(post._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  const startEdit = (post) => {
    setMenuOpenId(null);
    setEditingId(post._id);
    setEditText(post.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (post) => {
    if (!editText.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${API_URL}/communities/posts/${post._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      });
      const data = res.ok ? await res.json() : null;
      if (data) {
        setPosts((current) =>
          current.map((item) =>
            item._id === post._id ? { ...item, text: data.post.text } : item
          )
        );
        cancelEdit();
      }
    } catch {
      // ignore
    } finally {
      setSavingEdit(false);
    }
  };

  const deletePost = async (post) => {
    setMenuOpenId(null);
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_URL}/communities/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((current) => current.filter((item) => item._id !== post._id));
      }
    } catch {
      // ignore
    }
  };

  const toggleJoin = async () => {
    if (!community) return;
    setToggling(true);
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
        setCommunity((current) => ({
          ...current,
          joinedByMe: data.joined,
          memberCount: data.memberCount,
        }));
        const membersRes = await fetch(
          `${API_URL}/communities/${id}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData.members || []);
        }
      }
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  };

  const submitPost = async (event) => {
    event.preventDefault();
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`${API_URL}/communities/${id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = res.ok ? await res.json() : null;
      if (data) {
        setPosts((current) => [data.post, ...current]);
        setText("");
      }
    } catch {
      // ignore
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (post) => {
    if (post._id.startsWith("mock-")) {
      setPosts((current) =>
        current.map((item) =>
          item._id === post._id
            ? {
                ...item,
                likedByMe: !item.likedByMe,
                likeCount: item.likeCount + (item.likedByMe ? -1 : 1),
              }
            : item
        )
      );
      return;
    }
    const previous = post.likedByMe;
    setPosts((current) =>
      current.map((item) =>
        item._id === post._id
          ? {
              ...item,
              likedByMe: !previous,
              likeCount: item.likeCount + (previous ? -1 : 1),
            }
          : item
      )
    );
    try {
      const res = await fetch(`${API_URL}/communities/posts/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((current) =>
          current.map((item) =>
            item._id === post._id
              ? { ...item, likedByMe: data.liked, likeCount: data.likeCount }
              : item
          )
        );
      } else {
        setPosts((current) =>
          current.map((item) =>
            item._id === post._id
              ? {
                  ...item,
                  likedByMe: previous,
                  likeCount: item.likeCount + (previous ? 1 : -1),
                }
              : item
          )
        );
      }
    } catch {
      setPosts((current) =>
        current.map((item) =>
          item._id === post._id
            ? {
                ...item,
                likedByMe: previous,
                likeCount: item.likeCount + (previous ? 1 : -1),
              }
            : item
        )
      );
    }
  };

  if (loading) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-muted">Loading community...</p>
      </Card>
    );
  }

  if (notFound || !community) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm font-semibold text-ink">Community not found</p>
        <button
          onClick={() => navigate("/communities")}
          className="mt-3 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
        >
          Back to communities
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <div>
        <button
          onClick={() => navigate("/communities")}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} />
          All communities
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0 space-y-5 lg:space-y-6">
          <Card className="relative overflow-hidden">
            <div className="relative flex min-h-[176px] flex-col items-start gap-4 overflow-hidden bg-gradient-to-br from-mint-soft via-lavender-soft to-blossom-soft px-5 py-6 sm:flex-row sm:items-center sm:gap-5 sm:px-7">
              <WorkspaceArt className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] sm:block" />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] bg-gradient-to-r from-white/0 via-white/10 to-white/40 sm:block" />

              <span
                className={`relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-lg ring-4 ring-white sm:h-24 sm:w-24 ${community.accent}`}
              >
                <Icon name={community.icon} size={34} strokeWidth={2} />
              </span>

              <div className="relative z-10 min-w-0 flex-1 sm:pr-10">
                <h1 className="truncate font-display text-xl font-semibold text-ink sm:text-2xl">
                  {community.name}
                </h1>
                <p className="mt-1 line-clamp-1 max-w-md text-xs text-muted sm:text-[13px]">
                  {community.description}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-muted sm:text-xs">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {community.memberCount}{" "}
                    {community.memberCount === 1 ? "member" : "members"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe size={12} />
                    Public group
                  </span>
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-muted">
                    {community.category}
                  </span>
                </div>
              </div>

              <button
                onClick={toggleJoin}
                disabled={toggling}
                className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors disabled:opacity-60 sm:ml-auto ${
                  community.joinedByMe
                    ? "border border-white/70 bg-white/80 text-ink backdrop-blur-sm hover:bg-white"
                    : "bg-navy text-white hover:bg-navy-2"
                }`}
              >
                {community.joinedByMe && <Check size={14} />}
                {community.joinedByMe ? "Leave group" : "Join group"}
              </button>
            </div>
          </Card>

          {community.joinedByMe ? (
            <Card className="p-5">
              <form onSubmit={submitPost} className="flex items-start gap-3">
                <Avatar name={user?.name || ""} size={40} gradient="blossom" />
                <div className="min-w-0 flex-1">
                  <textarea
                    rows={3}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full resize-none rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!text.trim() || posting}
                      className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:opacity-50"
                    >
                      <Send size={13} />
                      {posting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="border-mint/40 bg-gradient-to-br from-mint-soft/70 to-cream p-5 text-center">
              <p className="text-sm font-semibold text-ink">Join to post</p>
              <p className="mt-1 text-[13px] text-muted">
                Only members can share and react in this community.
              </p>
            </Card>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  activeFilter === pill
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-white text-muted hover:bg-cream hover:text-ink"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-sm font-semibold text-ink">No posts yet</p>
              <p className="mt-1 text-[13px] text-muted">
                Be the first to share something kind.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={post.author?.name || "Member"}
                        size={36}
                        gradient="lavender"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-ink">
                          {post.author?.name || "Member"}
                        </p>
                        <p className="text-[11px] text-muted">
                          {timeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="relative" data-post-menu>
                      <button
                        onClick={() =>
                          setMenuOpenId((current) =>
                            current === post._id ? null : post._id
                          )
                        }
                        aria-label="Post options"
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-cream hover:text-ink"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpenId === post._id && (
                        <div className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_8px_24px_rgba(7,21,34,0.14)]">
                          <button
                            onClick={() => copyPost(post)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-cream"
                          >
                            <Copy size={13} />
                            {copiedId === post._id ? "Copied!" : "Copy"}
                          </button>
                          {isOwnPost(post) && (
                            <>
                              <button
                                onClick={() => startEdit(post)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-cream"
                              >
                                <Pencil size={13} />
                                Edit
                              </button>
                              <button
                                onClick={() => deletePost(post)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-blossom-deep transition-colors hover:bg-blossom-soft"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {editingId === post._id ? (
                    <div className="mt-3">
                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        autoFocus
                        className="w-full resize-none rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-cream"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(post)}
                          disabled={!editText.trim() || savingEdit}
                          className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:opacity-50"
                        >
                          <Check size={12} />
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                      {post.text}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
                    <button
                      onClick={() => toggleLike(post)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                        post.likedByMe
                          ? "bg-blossom-soft text-blossom-deep"
                          : "text-muted hover:bg-blossom-soft/50 hover:text-blossom-deep"
                      }`}
                    >
                      <Heart
                        size={14}
                        className={post.likedByMe ? "fill-current" : ""}
                      />
                      {post.likeCount}
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-muted transition-colors hover:bg-cream hover:text-ink">
                      <MessageCircle size={14} />
                      Comment
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-muted transition-colors hover:bg-cream hover:text-ink">
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="relative p-4">
            <button
              aria-label="Community info"
              className="absolute top-3 right-3 rounded-lg p-1 text-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <Sparkles size={13} />
            </button>
            <h2 className="pr-7 text-[13px] font-bold text-ink">About</h2>
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted">
              {community.description}
            </p>
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-muted">
              <Users size={12} />
              {community.memberCount}{" "}
              {community.memberCount === 1 ? "member" : "members"} ·{" "}
              {community.category}
            </p>
          </Card>

          <Card className="p-5">
            <h2 className="text-[15px] font-bold text-ink">Community rules</h2>
            <div className="mt-3 space-y-3">
              {rules.map((rule) => {
                const RuleIcon = rule.icon;
                return (
                  <div key={rule.text} className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-soft text-mint-deep">
                      <RuleIcon size={13} />
                    </span>
                    <p className="text-xs leading-relaxed text-muted">
                      {rule.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[15px] font-bold text-ink">Members</h2>
            <div className="mt-3 divide-y divide-line/70">
              {members.length === 0 ? (
                <p className="py-3 text-xs text-muted">
                  No members yet — be the first to join.
                </p>
              ) : (
                members.map((member) => (
                  <div key={member._id} className="flex items-center gap-2.5 py-2.5">
                    <Avatar name={member.name} size={28} gradient="lavender" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-ink">
                        {member.name}
                      </p>
                      <p className="text-[10px] capitalize text-muted">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[15px] font-bold text-ink">Resources</h2>
            <div className="mt-2 divide-y divide-line/70">
              {resourceRows.map((row) => {
                const RowIcon = row.icon;
                return (
                  <button
                    key={row.label}
                    onClick={() => navigate(row.to)}
                    className="flex w-full items-center gap-2.5 py-2.5 text-left transition-colors hover:text-mint-deep"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cream text-muted">
                      <RowIcon size={13} />
                    </span>
                    <span className="flex-1 text-[12px] font-semibold text-ink">
                      {row.label}
                    </span>
                    <ChevronRight size={13} className="shrink-0 text-line" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="relative overflow-hidden border-mint/40 bg-gradient-to-br from-mint-soft/70 to-cream p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-ink">
                  Find your people
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Connect one-on-one with peers who get it.
                </p>
              </div>
              <img
                src={sittingWomen}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
            </div>
            <button
              onClick={() => navigate("/find-a-peer")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2"
            >
              Find a peer
              <ChevronRight size={13} />
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
