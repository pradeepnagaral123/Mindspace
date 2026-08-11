import { useState } from "react";
import { PenLine, SlidersHorizontal } from "lucide-react";
import PostCard from "./PostCard";
import PostComposerModal from "./PostComposerModal";
import { feedPosts } from "../data/mockData";
import { useSearch } from "../context/SearchContext";

const tabs = ["For You", "Following", "Popular"];

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState("For You");
  const [posts, setPosts] = useState(feedPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const { query } = useSearch();

  const term = query.trim().toLowerCase();

  const visiblePosts = term
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term) ||
          post.community.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    : posts;

  const handleCreate = (newPost) => {
    setPosts((current) => [
      {
        id: `p${Date.now()}`,
        author: "pradeep nagaral",
        initials: "PN",
        time: "Just now",
        tags: ["#newpost"],
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        reply: null,
        ...newPost,
      },
      ...current,
    ]);
  };

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Community Feed</h2>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink shadow-sm transition-colors hover:bg-cream">
          <SlidersHorizontal size={15} />
          Filter
        </button>
        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
        >
          <PenLine size={15} />
          Create Post
        </button>
      </div>

      <div className="space-y-3">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {visiblePosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <p className="text-sm font-semibold text-ink">
              Nothing found for "{query}"
            </p>
            <p className="mt-1 text-[13px] text-muted">
              Try a different word, or browse the whole feed.
            </p>
          </div>
        )}
      </div>

      <PostComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}
