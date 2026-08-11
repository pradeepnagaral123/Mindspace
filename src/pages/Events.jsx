import { useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Video,
} from "lucide-react";
import Card from "../components/Card";
import Icon from "../components/icons";
import { events } from "../data/mockData";

const extraEvents = [
  {
    id: "e4",
    title: "Morning Gratitude Circle",
    type: "Talk Circle",
    date: "Sun",
    day: "Aug 16",
    time: "8:00 AM",
    mode: "Online",
    color: "bg-mint-soft text-mint-deep",
    icon: "sparkles",
  },
  {
    id: "e5",
    title: "Journaling for Beginners",
    type: "Workshop",
    date: "Mon",
    day: "Aug 17",
    time: "7:00 PM",
    mode: "Online",
    color: "bg-lavender-soft text-lavender-deep",
    icon: "flower2",
  },
  {
    id: "e6",
    title: "Nature Walk & Connect",
    type: "Meetup",
    date: "Sat",
    day: "Aug 22",
    time: "9:00 AM",
    mode: "In-person",
    color: "bg-sun-soft text-sun-deep",
    icon: "compass",
  },
  {
    id: "e7",
    title: "Sleep & Wind-Down Session",
    type: "Meditation",
    date: "Wed",
    day: "Aug 19",
    time: "9:30 PM",
    mode: "Online",
    color: "bg-blossom-soft text-blossom-deep",
    icon: "cloudRain",
  },
];

const allEvents = [...events, ...extraEvents];

const filters = ["All", "Meditation", "Support Circle", "Workshop", "Meetup"];

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [joined, setJoined] = useState({});

  const visible = allEvents.filter(
    (event) => activeFilter === "All" || event.type === activeFilter,
  );

  const toggleJoin = (id) => {
    setJoined((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Events
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Meditations, talk circles and workshops hosted by real people who
            get it.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2">
          <Sparkles size={16} />
          Host an event
        </button>
      </div>

      <Card className="relative overflow-hidden border-lavender/40 bg-gradient-to-br from-lavender-soft/70 to-cream p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-lavender">
              <CalendarDays size={22} />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-lavender-deep uppercase">
                Happening today
              </p>
              <h3 className="mt-0.5 text-[15px] font-bold text-ink">
                Mindfulness Meditation · 6:30 PM
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                128 people have joined · Online
              </p>
            </div>
          </div>
          <button className="rounded-xl bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2">
            Join now
          </button>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
              activeFilter === filter
                ? "bg-navy text-white"
                : "border border-line bg-white text-muted hover:bg-cream"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((event) => {
          const isJoined = joined[event.id];
          return (
            <Card
              key={event.id}
              className="group flex flex-col p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl ${event.color}`}
                  >
                    <span className="text-[9px] font-bold uppercase leading-none opacity-70">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      {event.day.split(" ")[1]}
                    </span>
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl ${event.color}`}
                  >
                    <Icon name={event.icon} size={17} strokeWidth={2} />
                  </span>
                </div>
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {event.type}
                </span>
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-ink group-hover:text-mint-deep">
                {event.title}
              </h3>

              <div className="mt-2.5 space-y-1.5 text-[13px] text-muted">
                <p className="flex items-center gap-2">
                  <Clock size={13} />
                  {event.time}
                </p>
                <p className="flex items-center gap-2">
                  {event.mode === "Online" ? (
                    <Video size={13} />
                  ) : (
                    <MapPin size={13} />
                  )}
                  {event.mode}
                </p>
              </div>

              <div className="mt-4 flex flex-1 items-end justify-between gap-3">
                <span className="text-xs text-muted">
                  {event.mode === "Online"
                    ? "Live on MindSpace"
                    : "Central Library, Room 3"}
                </span>
                <button
                  onClick={() => toggleJoin(event.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                    isJoined
                      ? "bg-mint-soft text-mint-deep"
                      : "bg-navy text-white hover:bg-navy-2"
                  }`}
                >
                  {isJoined && <Check size={13} />}
                  {isJoined ? "Joined" : "Join"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-peach-soft text-peach-deep">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-ink">
              Prefer a calmer, 1-on-1 space?
            </p>
            <p className="text-[13px] text-muted">
              You can also schedule a private peer conversation anytime.
            </p>
          </div>
        </div>
        <button className="rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-cream">
          Find a peer
        </button>
      </Card>
    </div>
  );
}
