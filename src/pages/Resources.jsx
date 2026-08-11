import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Ear,
  Flame,
  Play,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import Card from "../components/Card";
import { useSearch } from "../context/SearchContext";

const categories = ["All", "Articles", "Exercises", "Guided Audio", "Guides"];

const resources = [
  {
    id: "r1",
    category: "Articles",
    title: "Understanding your anxiety: a gentle introduction",
    description:
      "What anxiety feels like in the body and mind, why it shows up, and simple first steps to meet it with kindness.",
    readTime: "6 min read",
    accent: "bg-mint-soft text-mint-deep",
    icon: BookOpen,
    featured: true,
  },
  {
    id: "r2",
    category: "Exercises",
    title: "The 4-7-8 breathing reset",
    description:
      "A 3-minute breath pattern to calm a racing nervous system. Great before bed or before a big moment.",
    readTime: "3 min practice",
    accent: "bg-lavender-soft text-lavender-deep",
    icon: Ear,
  },
  {
    id: "r3",
    category: "Guided Audio",
    title: "10-minute body scan for sleep",
    description:
      "A slow, guided journey through the body to release tension and drift toward rest.",
    readTime: "10 min audio",
    accent: "bg-blossom-soft text-blossom-deep",
    icon: Play,
  },
  {
    id: "r4",
    category: "Guides",
    title: "Surviving exam season, together",
    description:
      "A practical guide to deadlines, revision plans and protecting your wellbeing when pressure peaks.",
    readTime: "12 min guide",
    accent: "bg-sun-soft text-sun-deep",
    icon: Flame,
  },
  {
    id: "r5",
    category: "Articles",
    title: "Sleep hygiene when your mind won't switch off",
    description:
      "Why you can't sleep even when you're exhausted, and gentle routines that actually help.",
    readTime: "5 min read",
    accent: "bg-mint-soft text-mint-deep",
    icon: BookOpen,
  },
  {
    id: "r6",
    category: "Exercises",
    title: "Grounding with the 5-4-3-2-1 technique",
    description:
      "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell and 1 you taste. A five-senses reset.",
    readTime: "5 min practice",
    accent: "bg-peach-soft text-peach-deep",
    icon: Sparkles,
  },
  {
    id: "r7",
    category: "Guided Audio",
    title: "Morning calm: a gentle wake-up meditation",
    description:
      "Start the day with 7 minutes of soft focus and intention, guided in a warm voice.",
    readTime: "7 min audio",
    accent: "bg-lavender-soft text-lavender-deep",
    icon: Play,
  },
  {
    id: "r8",
    category: "Guides",
    title: "Talking to someone about your feelings",
    description:
      "Words can feel hard to find. Here are scripts and prompts to help you open up to people you trust.",
    readTime: "8 min guide",
    accent: "bg-blossom-soft text-blossom-deep",
    icon: BookOpen,
  },
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { query, setQuery } = useSearch();

  const term = query.trim().toLowerCase();

  const visible = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "All" || resource.category === activeCategory;
    const matchesQuery = term
      ? resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term)
      : true;
    return matchesCategory && matchesQuery;
  });

  const featured = resources.find((resource) => resource.featured);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Resources
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Articles, exercises and guided tools to support your wellbeing,
            written with care.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pr-3 pl-10 text-sm text-ink shadow-sm outline-none placeholder:text-muted/70 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
          />
        </div>
      </div>

      <Card className="relative overflow-hidden bg-navy text-white">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-mint/10" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-lavender/10" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[10.5px] font-semibold text-mint">
              <Sparkles size={12} />
              Featured this week
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold">
              {featured.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
              {featured.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-mint">
                <Clock size={13} />
                {featured.readTime}
              </span>
              <button className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-mint/90">
                Read now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-lavender text-navy">
              <BookOpen size={38} strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
              activeCategory === category
                ? "bg-navy text-white"
                : "border border-line bg-white text-muted hover:bg-cream"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-semibold text-ink">
            No resources match "{query}"
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Try a different word or category.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card
                key={resource.id}
                className="group flex flex-col p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${resource.accent}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {resource.category}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-bold leading-snug text-ink group-hover:text-mint-deep">
                  {resource.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted">
                  {resource.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-medium text-muted">
                    <Clock size={11} />
                    {resource.readTime}
                  </span>
                  <button className="flex items-center gap-1 text-[12px] font-semibold text-mint-deep transition-colors hover:text-mint-deep/80">
                    Open
                    <ArrowRight size={12} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-soft text-lavender-deep">
            <Tag size={18} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink">
              Looking for something specific?
            </p>
            <p className="text-[13px] text-muted">
              Our library grows every week. Request a topic and we'll cover it
              with care.
            </p>
          </div>
        </div>
        <button className="rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2">
          Request a topic
        </button>
      </Card>
    </div>
  );
}
