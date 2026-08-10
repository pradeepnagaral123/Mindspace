export const user = {
  name: "Aarav Sharma",
  initials: "AS",
  handle: "@aarav",
  role: "Student · Final Year",
};

export const moodOptions = [
  {
    id: "great",
    label: "Great",
    icon: "sparkles",
    circle: "bg-mint-soft",
    text: "text-mint-deep",
    ring: "ring-mint-deep",
    hint: "Feeling light, present and grounded.",
  },
  {
    id: "good",
    label: "Good",
    icon: "smile",
    circle: "bg-lavender-soft",
    text: "text-lavender-deep",
    ring: "ring-lavender-deep",
    hint: "Mostly okay, with a few ups and downs.",
  },
  {
    id: "okay",
    label: "Okay",
    icon: "meh",
    circle: "bg-sun-soft",
    text: "text-sun-deep",
    ring: "ring-sun-deep",
    hint: "Neutral — taking it one moment at a time.",
  },
  {
    id: "low",
    label: "Low",
    icon: "frown",
    circle: "bg-peach-soft",
    text: "text-peach-deep",
    ring: "ring-peach-deep",
    hint: "A little heavy today. That's okay too.",
  },
  {
    id: "struggling",
    label: "Struggling",
    icon: "cloudRain",
    circle: "bg-blossom-soft",
    text: "text-blossom-deep",
    ring: "ring-blossom-deep",
    hint: "Things feel hard right now. We're here.",
  },
];

export const connections = [
  {
    id: "c1",
    name: "Maya Kapoor",
    initials: "MK",
    message: "You're not alone — I felt the exact same way last semester.",
    status: "online",
    time: "2m ago",
    gradient: "from-mint to-lavender",
  },
  {
    id: "c2",
    name: "Daniel Fernandes",
    initials: "DF",
    message: "Thanks for sharing that. It really helped me today.",
    status: "online",
    time: "18m ago",
    gradient: "from-lavender to-blossom",
  },
  {
    id: "c3",
    name: "Riya Mehta",
    initials: "RM",
    message: "Sending you a warm hug today 🌷",
    status: "away",
    time: "1h ago",
    gradient: "from-peach to-sun",
  },
];

export const recommendedCommunities = [
  {
    id: "student-support",
    name: "Student Support Circle",
    icon: "graduationCap",
    members: "2.4k members",
    description: "Exams, deadlines and everything in between. We get it.",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    id: "anxiety-relief",
    name: "Anxiety Relief",
    icon: "wind",
    members: "1.8k members",
    description: "Gentle practices and kind words for anxious days.",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    id: "mindful-moments",
    name: "Mindful Moments",
    icon: "flower2",
    members: "3.1k members",
    description: "Slow down, breathe and notice the small good things.",
    accent: "bg-blossom-soft text-blossom-deep",
  },
];

export const feedPosts = [
  {
    id: "p1",
    community: "Student Support Circle",
    author: "Anonymous Member",
    initials: "AM",
    time: "2 hours ago",
    title: "Feeling overwhelmed with exams and expectations",
    content:
      "It's been really hard to keep up with everything. Sometimes I feel like no matter how much I try, it's never enough. Anyone else feeling this way?",
    tags: ["#exams", "#studentlife", "#anxiety"],
    likes: 42,
    comments: 12,
    shares: 4,
    liked: false,
    reply: {
      author: "Maya Kapoor",
      initials: "MK",
      time: "1 hour ago",
      text: "You're not alone in this. I felt the same during finals week — it's okay to take a breath and ask for help. Proud of you for reaching out. 💛",
    },
  },
  {
    id: "p2",
    community: "Anxiety Relief",
    author: "Anonymous Member",
    initials: "AM",
    time: "5 hours ago",
    title: "Small win: I went outside today",
    content:
      "I haven't felt like leaving my room all week, but I made myself go for a 10 minute walk. The air felt good. Just wanted to share a small win with people who understand.",
    tags: ["#smallwins", "#selfcare", "#anxiety"],
    likes: 78,
    comments: 19,
    shares: 6,
    liked: false,
    reply: {
      author: "Daniel Fernandes",
      initials: "DF",
      time: "4 hours ago",
      text: "That's not small — that's a really brave step. Ten minutes outside is ten minutes of taking care of yourself. So happy for you 🌿",
    },
  },
  {
    id: "p3",
    community: "Mindful Moments",
    author: "Priya Nair",
    initials: "PN",
    time: "Yesterday",
    title: "A breathing exercise that actually calms me down",
    content:
      "Sharing in case it helps anyone: breathe in for 4, hold for 4, out for 6. I do it before bed and it honestly shifts my whole evening. What calms you down?",
    tags: ["#grounding", "#breathwork", "#mindfulness"],
    likes: 63,
    comments: 27,
    shares: 14,
    liked: false,
    reply: {
      author: "Riya Mehta",
      initials: "RM",
      time: "Yesterday",
      text: "Trying this tonight, thank you! Mine is a warm cup of chamomile and a guided sleep meditation. Small rituals, big difference.",
    },
  },
];

export const events = [
  {
    id: "e1",
    title: "Mindfulness Meditation",
    type: "Meditation",
    date: "Today",
    day: "Aug 10",
    time: "6:30 PM",
    mode: "Online",
    color: "bg-mint-soft text-mint-deep",
    icon: "flower2",
  },
  {
    id: "e2",
    title: "Student Talk Circle",
    type: "Support Circle",
    date: "Tomorrow",
    day: "Aug 11",
    time: "5:00 PM",
    mode: "In-person",
    color: "bg-lavender-soft text-lavender-deep",
    icon: "usersRound",
  },
  {
    id: "e3",
    title: "Managing Anxiety Workshop",
    type: "Workshop",
    date: "Sat",
    day: "Aug 15",
    time: "10:00 AM",
    mode: "Online",
    color: "bg-peach-soft text-peach-deep",
    icon: "compass",
  },
];

export const checkInMetrics = [
  { label: "Stress", value: 2, max: 5, color: "bg-mint" },
  { label: "Energy", value: 3, max: 5, color: "bg-sun" },
  { label: "Mood", value: 4, max: 5, color: "bg-lavender" },
];

export const quote = {
  text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
  source: "Unknown",
};
