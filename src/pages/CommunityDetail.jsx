import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Heart, Send, Users } from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [communityRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/communities/${id}`, { headers }),
        fetch(`${API_URL}/communities/${id}/posts`, { headers }),
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
        setPosts(data.posts || []);
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
    <div className="space-y-6 lg:space-y-8">
      <button
        onClick={() => navigate("/communities")}
        className="flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        All communities
      </button>

      <Card className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-mint via-lavender to-blossom">
          <div className="absolute -top-12 -right-6 h-36 w-36 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/45 to-transparent" />
        </div>
        <div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span
                className={`flex h-20 w-20 items-center justify-center rounded-2xl ring-4 ring-white ${community.accent}`}
              >
                <Icon name={community.icon} size={34} strokeWidth={2} />
              </span>
              <div className="pb-1">
                <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                  {community.name}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted">
                  <Users size={12} />
                  {community.memberCount}{" "}
                  {community.memberCount === 1 ? "member" : "members"}
                  <span className="mx-1 text-line">·</span>
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {community.category}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={toggleJoin}
              disabled={toggling}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors disabled:opacity-60 ${
                community.joinedByMe
                  ? "border border-line bg-white text-ink hover:bg-cream"
                  : "bg-navy text-white hover:bg-navy-2"
              }`}
            >
              {community.joinedByMe && <Check size={14} />}
              {community.joinedByMe ? "Leave group" : "Join group"}
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {community.description}
          </p>
        </div>
      </Card>

      {community.joinedByMe ? (
        <Card className="p-5">
          <form onSubmit={submitPost} className="flex items-start gap-3">
            <Avatar name={user?.name || ""} size={40} gradient="blossom" />
            <div className="flex-1">
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
              <div className="flex items-center gap-3">
                <Avatar name={post.author?.name || "Member"} size={36} gradient="lavender" />
                <div>
                  <p className="text-[13px] font-bold text-ink">
                    {post.author?.name || "Member"}
                  </p>
                  <p className="text-[11px] text-muted">
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                {post.text}
              </p>
              <button
                onClick={() => toggleLike(post)}
                className={`mt-3 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  post.likedByMe
                    ? "bg-blossom-soft text-blossom-deep"
                    : "bg-cream text-muted hover:bg-blossom-soft/50 hover:text-blossom-deep"
                }`}
              >
                <Heart
                  size={13}
                  className={post.likedByMe ? "fill-current" : ""}
                />
                {post.likeCount}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
