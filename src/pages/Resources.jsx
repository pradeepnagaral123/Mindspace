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
import ArticleReaderModal from "../components/ArticleReaderModal";
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
    body: [
      {
        type: "lead",
        text: "Anxiety isn't a flaw or a weakness — it's your mind's alarm system trying to protect you. Understanding how it works is the first step toward meeting it with kindness instead of fear.",
      },
      {
        type: "p",
        text: "Yet the moment it shows up, it's easy to feel like something is wrong with you. Everyone else looks calm. Your thoughts feel loud, your chest feels tight, and the day ahead suddenly feels too big. The good news is that anxiety follows patterns — and patterns can be understood, and gently reshaped, one step at a time.",
      },
      {
        type: "h3",
        text: "What anxiety actually feels like",
      },
      {
        type: "p",
        text: "Anxiety rarely feels like one single thing. It can be a tightness in your chest, a churning in your stomach, or a restless feeling that you can't quite sit still. It can be a thought that keeps circling no matter how many times you try to push it away, or the quiet dread that arrives before you even know what it's about.",
      },
      {
        type: "p",
        text: "Some people feel it most in their body — shaking hands, a hot face, tense shoulders. Others feel it most in their mind — a fog of 'what if' questions, replaying conversations, imagining the worst. However it shows up for you, it's real, and it deserves to be taken seriously rather than dismissed or laughed off.",
      },
      {
        type: "h3",
        text: "Why it shows up",
      },
      {
        type: "p",
        text: "Anxiety is, at its heart, your body's alarm system. It scans for danger, and when it finds something uncertain, it turns the volume up so you'll pay attention. That was brilliant when the danger was a predator and the answer was to run. It's less helpful when the 'danger' is an email, a deadline or a crowded room.",
      },
      {
        type: "p",
        text: "Anxiety also grows quietly. A late night here, a skipped meal there, a week of overcommitting — these pile up until your nervous system is running on empty. That's why anxiety can feel like it 'comes out of nowhere', even when it's been building for weeks.",
      },
      {
        type: "p",
        text: "Notice the gap between the demands you're facing and the resources you feel you have. Deadlines, uncertainty and big changes all widen that gap. When the gap grows, your mind starts scanning for threat — not because you're weak, but because that's what a protective mind does.",
      },
      {
        type: "h3",
        text: "The difference between helpful and unhelpful anxiety",
      },
      {
        type: "p",
        text: "A little anxiety is useful. It sharpens you before an exam, reminds you to prepare, and keeps you safe in genuinely risky situations. It's a signal with a purpose.",
      },
      {
        type: "p",
        text: "It becomes unhelpful when it shows up without a real threat, when it stays long after the moment has passed, or when it shrinks your world — stopping you from doing things you actually want to do. Learning to tell the two apart helps you stop fighting every anxious feeling and start responding only to the ones that matter.",
      },
      {
        type: "h3",
        text: "How the body and mind get tangled",
      },
      {
        type: "p",
        text: "Once your alarm system fires, the body and mind feed each other. Your heart races, so your thoughts decide something must be wrong. Your thoughts find something to worry about, so your heart races a little more. Round and round it goes, and the longer it runs, the harder it is to step out of.",
      },
      {
        type: "p",
        text: "Breaking this loop is usually easier from the body than from the thoughts — because the body responds to simple, predictable signals, while thoughts can argue with themselves forever.",
      },
      {
        type: "h3",
        text: "First steps that help",
      },
      {
        type: "p",
        text: "You don't need to fix everything at once. Start small: name what you're feeling, slow your breathing, or take a short walk. Simply saying 'this is anxiety, this is my alarm system' can shrink it from a monster into a feeling — and feelings pass.",
      },
      {
        type: "p",
        text: "Breathing deserves special mention. Slow, long exhales tell your nervous system that you're safe, and it responds within a minute or two. Try breathing in for four, holding gently for four, and breathing out for six. The out-breath is the one that calms.",
      },
      {
        type: "p",
        text: "Grounding your senses works too. Look for five things you can see, four you can feel, three you can hear, two you can smell and one you can taste. It sounds simple, but it redirects your attention from the story your mind is spinning to the room you're actually in.",
      },
      {
        type: "h3",
        text: "A gentle toolkit for anxious moments",
      },
      {
        type: "p",
        text: "It helps to have a few tools ready before you need them. When anxiety is loud, try one of these: step outside and look at the sky; put a hand on your chest and notice your heartbeat slow; write the worry down and close the notebook; call someone who listens without fixing.",
      },
      {
        type: "p",
        text: "You don't have to do all of them, and you don't have to do them perfectly. The goal isn't to make anxiety disappear — it's to show yourself that it can pass, and that you can be with it without being controlled by it.",
      },
      {
        type: "h3",
        text: "When it becomes a pattern",
      },
      {
        type: "p",
        text: "Everyone feels anxious sometimes. It becomes a bigger deal when it starts shaping your life — avoiding classes or plans, sleeping poorly, feeling on edge most of the day, or dreading things you used to enjoy.",
      },
      {
        type: "p",
        text: "When anxiety shows up this often, it's not a sign that something is wrong with you; it's a sign that your nervous system needs more support. Patterns can be unlearned, but it takes time and repetition. Be patient with yourself. Every small practice you repeat is telling your brain a new, kinder story about what to expect.",
      },
      {
        type: "h3",
        text: "Building a calmer baseline",
      },
      {
        type: "p",
        text: "Anxiety is easier to meet when your baseline is low. That means protecting the basics: sleep, food, movement and daylight. It also means noticing the small things that quietly drain you — the news before bed, the friendship that exhausts you, the constant notifications — and giving yourself permission to set them down.",
      },
      {
        type: "p",
        text: "Add things that refill you, too. A favourite song, a warm drink, a few minutes of noticing something beautiful. These are not luxuries; they are maintenance. The calmest people you know are not people without stress — they're people with good daily habits around it.",
      },
      {
        type: "h3",
        text: "When to seek more support",
      },
      {
        type: "p",
        text: "If anxiety is making it hard to live your days, you deserve more than self-help tools. Talking to a counsellor or therapist is a normal, sensible step — not a last resort. In the meantime, peer support can help: other people who get it, who can sit with you in the messy middle, can make a real difference.",
      },
      {
        type: "p",
        text: "Whatever you choose, remember this: you are not a problem to be solved. You are a person learning to live with a nervous system that cares too much. That's something you can work with — gently, kindly, and one breath at a time.",
      },
      {
        type: "tip",
        text: "Anxiety is common, and it's something you can learn to work with — one step at a time. You're not alone in this.",
      },
    ],
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
    body: [
      {
        type: "lead",
        text: "You're exhausted, your body is heavy — but the moment your head hits the pillow, your mind decides to run a full meeting. Sleep struggles are draining in a very particular way, and they're far more common than you might think.",
      },
      {
        type: "p",
        text: "There's something uniquely frustrating about lying in the dark, completely tired, and still unable to drift off. The harder you try to sleep, the more awake you feel. That's not a personal failure — it's the way the brain works. Sleep can't be forced; it has to be invited.",
      },
      {
        type: "h3",
        text: "Why sleep runs away",
      },
      {
        type: "p",
        text: "The problem is often that the day doesn't end when you close your eyes. Unfinished tasks, worries and half-formed thoughts keep circulating. Your brain, still scanning for unfinished business, refuses to power down.",
      },
      {
        type: "p",
        text: "Modern habits make it worse. Screens flood your eyes with bright light well into the night, caffeine lingers for hours, and the line between 'day' and 'night' blurs. Your body is getting the message to stay alert, even while you're begging it to rest.",
      },
      {
        type: "h3",
        text: "The power of a wind-down routine",
      },
      {
        type: "p",
        text: "The key isn't to 'try harder' to sleep — it's to give your mind a clear signal that the day is over. That's what a wind-down routine is for. It doesn't need to be long or elaborate. Thirty to sixty minutes of predictable, calming activity is enough.",
      },
      {
        type: "p",
        text: "Set a 'closing time' for your brain about an hour before bed. Dim the lights, put the phone in another room and do something repetitive and calm — gentle stretches, warm chamomile, a few pages of a light book. The repetition matters more than the activity itself.",
      },
      {
        type: "p",
        text: "Do the same things, in the same order, around the same time each night. Your brain learns the pattern, and over time it starts winding down almost by itself.",
      },
      {
        type: "h3",
        text: "Making your bedroom sleep-friendly",
      },
      {
        type: "p",
        text: "Your room sends your brain signals. If you study, scroll or argue in bed, your brain learns to associate the bed with alertness. Try to keep your bedroom for sleeping as much as you can.",
      },
      {
        type: "p",
        text: "Keep it cool, dark and quiet. If you can't make the room fully dark, an eye mask helps. If noise bothers you, try soft background sound or earplugs. And if you can, let daylight in during the morning — it sets your internal clock for the day ahead.",
      },
      {
        type: "h3",
        text: "If your mind won't switch off",
      },
      {
        type: "p",
        text: "Even with a good routine, some nights your mind will refuse to cooperate. When that happens, don't lie there fighting it. Getting frustrated raises your heart rate and makes sleep even harder.",
      },
      {
        type: "p",
        text: "Get up, go somewhere dimly lit and write the racing thoughts down on paper — a 'brain dump'. List the worries, the to-do items, the things you're afraid you'll forget. Then promise yourself you'll look at them tomorrow. Giving the thoughts a home outside your head can give your mind permission to let go for the night.",
      },
      {
        type: "p",
        text: "Return to bed only when you feel a little drowsy again. If you can't sleep after twenty minutes, repeat the process rather than forcing it.",
      },
      {
        type: "h3",
        text: "Daytime habits that help at night",
      },
      {
        type: "p",
        text: "Great sleep is often built during the day. Move your body — even a twenty-minute walk helps your sleep pressure build. See daylight early in the morning. And be mindful of caffeine: it can stay in your system for hours, so try to have your last cup before mid-afternoon.",
      },
      {
        type: "p",
        text: "Naps are fine if they're short and early. A twenty-minute nap before 3pm can refresh you without stealing from the night. Anything longer, or later in the day, can leave you wide awake at midnight.",
      },
      {
        type: "h3",
        text: "A gentle evening routine",
      },
      {
        type: "p",
        text: "If you're not sure where to start, here's a simple template. An hour before bed: dim the lights and put screens away. Twenty minutes before bed: stretch gently or do a short body scan. Ten minutes before bed: make a note of tomorrow's top three priorities so they stop nagging you. Five minutes before bed: try the 4-7-8 breath — in for four, hold for seven, out for eight — for a few rounds.",
      },
      {
        type: "h3",
        text: "A few myths to let go of",
      },
      {
        type: "p",
        text: "You don't have to sleep for eight hours to be okay — most adults need somewhere between seven and nine, and what matters is how you feel during the day. You also don't need to stay in bed if you're wide awake; getting up and doing something quiet is kinder than lying there frustrated.",
      },
      {
        type: "h3",
        text: "A gentle note about worry",
      },
      {
        type: "p",
        text: "It's very common to lie awake worrying about not sleeping. You think about the meeting tomorrow, count the hours left, and feel your heart sink. Try to catch that spiral and soften it. Remind yourself that even a rough night is survivable, and that your body will find a way to rest when it needs to.",
      },
      {
        type: "p",
        text: "Worrying about sleep makes sleep harder. The more you can make peace with wakefulness — 'okay, I'm awake, I'll rest here quietly' — the less powerful the anxiety becomes, and the more likely rest will come on its own.",
      },
      {
        type: "h3",
        text: "When to talk to someone",
      },
      {
        type: "p",
        text: "If poor sleep has been going on for weeks and is affecting your energy, mood or concentration, it's worth talking to someone. A doctor can check for things like stress, anxiety or other causes, and can help you find the right support. Struggling to sleep is not something you should have to manage alone.",
      },
      {
        type: "tip",
        text: "Sleep is a skill and a rhythm, not a switch. A few rough nights don't erase the progress you've made — keep going, gently.",
      },
    ],
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
  const [reading, setReading] = useState(null);
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

      <Card className="relative overflow-hidden bg-navy! text-white">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-mint/10" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-lavender/10" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[10.5px] font-semibold text-mint">
                <Sparkles size={12} />
                Featured this week
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/85 ring-1 ring-white/15">
                {featured.category}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/85">
              {featured.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-mint">
                <Clock size={13} />
                {featured.readTime}
              </span>
              <button
                onClick={() => setReading(featured)}
                className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-mint/90"
              >
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
                  <button
                    onClick={() => resource.body && setReading(resource)}
                    disabled={!resource.body}
                    className="flex items-center gap-1 text-[12px] font-semibold text-mint-deep transition-colors hover:text-mint-deep/80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
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

      <ArticleReaderModal
        resource={reading}
        onClose={() => setReading(null)}
      />
    </div>
  );
}
