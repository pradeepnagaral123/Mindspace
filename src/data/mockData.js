export const user = {
  name: "pradeep nagaral",
  initials: "PN",
  handle: "@pradeep",
  role: "Student · Final Year",
};

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

export const quote = {
  text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
  source: "Unknown",
};
