import { useState } from "react";
import { Bookmark, Clock, Users } from "lucide-react";
import Card from "../components/Card";
import PostCard from "../components/PostCard";
import Icon from "../components/icons";
import { feedPosts, recommendedCommunities } from "../data/mockData";

const savedResources = [
  {
    id: "sr1",
    title: "The 4-7-8 breathing reset",
    category: "Exercise",
    readTime: "3 min",
    accent: "bg-lavender-soft text-lavender-deep",
    icon: "wind",
  },
  {
    id: "sr2",
    title: "10-minute body scan for sleep",
    category: "Guided audio",
    readTime: "10 min",
    accent: "bg-blossom-soft text-blossom-deep",
    icon: "sparkles",
  },
  {
    id: "sr3",
    title: "Surviving exam season, together",
    category: "Guide",
    readTime: "12 min",
    accent: "bg-sun-soft text-sun-deep",
    icon: "graduationCap",
  },
  {
    id: "sr4",
    title: "Grounding with the 5-4-3-2-1 technique",
    category: "Exercise",
    readTime: "5 min",
    accent: "bg-mint-soft text-mint-deep",
    icon: "flower2",
  },
];

const tabs = [
  { id: "posts", label: "Posts", count: 3 },
  { id: "resources", label: "Resources", count: 4 },
  { id: "communities", label: "Communities", count: 2 },
];

export default function Saved() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Saved
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Posts, resources and moments you've kept close for later.
        </p>
      </div>

      <div className="flex rounded-xl border border-line bg-white p-1 shadow-sm sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors sm:flex-none ${
              activeTab === tab.id
                ? "bg-navy text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 text-[10.5px] font-semibold ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-cream text-muted"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === "posts" && (
        <div className="space-y-3">
          {feedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedResources.map((resource) => (
            <Card
              key={resource.id}
              className="group flex flex-col p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${resource.accent}`}
                >
                  <Icon name={resource.icon} size={20} strokeWidth={2} />
                </span>
                <button
                  className="rounded-lg p-1.5 text-blossom-deep hover:bg-blossom-soft"
                  aria-label="Remove from saved"
                >
                  <Bookmark size={16} className="fill-blossom-deep" />
                </button>
              </div>
              <h3 className="mt-4 text-[15px] font-bold leading-snug text-ink group-hover:text-mint-deep">
                {resource.title}
              </h3>
              <div className="mt-auto flex items-center gap-3 pt-4 text-xs font-medium text-muted">
                <span className="rounded-full bg-cream px-2 py-0.5 font-semibold">
                  {resource.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {resource.readTime}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "communities" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendedCommunities.slice(0, 2).map((community) => (
            <Card
              key={community.id}
              className="group flex items-start gap-3.5 p-5 transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${community.accent}`}
              >
                <Icon name={community.icon} size={22} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-ink group-hover:text-mint-deep">
                  {community.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-muted">
                  <Users size={11} />
                  {community.members}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {community.description}
                </p>
                <button className="mt-3 rounded-xl border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-cream">
                  Open community
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "posts" && (
        <Card className="p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-soft text-mint-deep">
            <Bookmark size={22} />
          </span>
          <p className="mt-3 text-[14px] font-bold text-ink">
            Your saved posts live here
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Tap the bookmark on any post to keep it close for later.
          </p>
        </Card>
      )}
    </div>
  );
}
