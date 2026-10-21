export const moodOptions = [
  {
    id: "great",
    label: "Great",
    score: 5,
    icon: "sparkles",
    circle: "bg-mint-soft",
    text: "text-mint-deep",
    ring: "ring-mint-deep",
    bar: "bg-mint",
    hint: "Feeling light, present and grounded.",
  },
  {
    id: "good",
    label: "Good",
    score: 4,
    icon: "smile",
    circle: "bg-lavender-soft",
    text: "text-lavender-deep",
    ring: "ring-lavender-deep",
    bar: "bg-lavender",
    hint: "Mostly okay, with a few ups and downs.",
  },
  {
    id: "okay",
    label: "Okay",
    score: 3,
    icon: "meh",
    circle: "bg-sun-soft",
    text: "text-sun-deep",
    ring: "ring-sun-deep",
    bar: "bg-sun",
    hint: "Neutral — taking it one moment at a time.",
  },
  {
    id: "low",
    label: "Low",
    score: 2,
    icon: "frown",
    circle: "bg-peach-soft",
    text: "text-peach-deep",
    ring: "ring-peach-deep",
    bar: "bg-peach",
    hint: "A little heavy today. That's okay too.",
  },
  {
    id: "struggling",
    label: "Struggling",
    score: 1,
    icon: "cloudRain",
    circle: "bg-blossom-soft",
    text: "text-blossom-deep",
    ring: "ring-blossom-deep",
    bar: "bg-blossom",
    hint: "Things feel hard right now. We're here.",
  },
];

export const moodOptionFor = (id) =>
  moodOptions.find((option) => option.id === id) || moodOptions[2];

export const checkInMetrics = [
  {
    key: "stress",
    label: "Stress",
    min: 1,
    max: 5,
    low: "Low",
    high: "High",
    accent: "var(--color-peach-deep)",
  },
  {
    key: "energy",
    label: "Energy",
    min: 1,
    max: 5,
    low: "Low",
    high: "High",
    accent: "var(--color-sun-deep)",
  },
  {
    key: "moodScore",
    label: "Mood",
    min: 1,
    max: 5,
    low: "Low",
    high: "High",
    accent: "var(--color-lavender-deep)",
  },
];

export const reflectionPrompts = [
  "What's one thing you're grateful for today?",
  "What's been taking up most of your energy lately?",
  "What would be a kind thing to do for yourself tonight?",
];

export const RECENT_CHECK_IN_LIMIT = 4;
export const CHART_DAYS = 7;
export const STREAK_DAYS = 14;
