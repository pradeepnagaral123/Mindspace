import { useState } from "react";
import { PenLine, SlidersHorizontal } from "lucide-react";
import PostCard from "./PostCard";
import PostComposerModal from "./PostComposerModal";
import { feedPosts } from "../data/mockData";

const tabs = ["For You", "Following", "Popular"];

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState("For You");
  const [posts, setPosts] = useState(feedPosts);
  const [composerOpen, setComposerOpen] = useState(false);

  const handleCreate = (newPost) => {
    setPosts((current) => [
      {
        id: `p${Date.now()}`,
        author: "You",
        initials: "YO",
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink">Community Feed</h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-line bg-white p-0.5 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-navy text-white"
                    : "text-muted/60 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <button className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[11px] font-medium text-ink/80 shadow-sm transition-colors hover:bg-cream">
          <SlidersHorizontal size={12} />
          Filter
        </button>
        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-navy/90 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-navy"
        >
          <PenLine size={12} />
          Create Post
        </button>
      </div>

      <div className="space-y-2.5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <PostComposerModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}
