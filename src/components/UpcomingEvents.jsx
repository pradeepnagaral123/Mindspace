import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { events } from "../data/mockData";

export default function UpcomingEvents() {
  const [joined, setJoined] = useState({});

  const toggleJoin = (id) => {
    setJoined((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blossom/25 bg-gradient-to-br from-blossom-soft/50 via-white to-peach-soft/30 p-5 shadow-[0_4px_24px_rgba(255,157,187,0.12),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,157,187,0.18),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blossom/10 blur-2xl" />
      <div className="absolute -bottom-8 left-1/3 h-20 w-20 rounded-full bg-peach/8 blur-2xl" />

      <div className="relative mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Events</h3>
        <Link
          to="/events"
          className="flex items-center gap-1 text-[11px] font-semibold text-blossom-deep hover:text-blossom-deep/80"
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      <div className="relative space-y-2.5">
        {events.map((event) => {
          const isJoined = joined[event.id];
          return (
            <div
              key={event.id}
              className="rounded-xl bg-white/60 p-3 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl shadow-sm ${event.color}`}
                >
                  <span className="text-[8px] font-bold uppercase leading-none opacity-60">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-[12px] font-bold leading-tight">
                    {event.day.split(" ")[1]}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-ink">
                    {event.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted/60">
                    <CalendarDays size={9} />
                    {event.time}
                    <span className="mx-0.5">&middot;</span>
                    <span className={`font-semibold ${event.color.split(" ")[1]}`}>
                      {event.mode}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${event.color}`}
                >
                  {event.type}
                </span>
                <button
                  onClick={() => toggleJoin(event.id)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all ${
                    isJoined
                      ? "bg-mint-soft text-mint-deep shadow-sm"
                      : "bg-gradient-to-r from-navy to-navy-2 text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  {isJoined && <Check size={10} />}
                  {isJoined ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
