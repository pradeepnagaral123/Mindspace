import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import Card from "./Card";
import Icon from "./icons";
import { events } from "../data/mockData";

export default function UpcomingEvents() {
  const [joined, setJoined] = useState({});

  const toggleJoin = (id) => {
    setJoined((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Upcoming Events</h3>
        <Link
          to="/events"
          className="flex items-center gap-1 text-[12px] font-semibold text-mint-deep hover:text-mint-deep/80"
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-2.5">
        {events.map((event) => {
          const isJoined = joined[event.id];
          return (
            <div
              key={event.id}
              className="rounded-xl border border-line/80 bg-cream/50 p-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl ${event.color}`}
                >
                  <span className="text-[9px] font-bold uppercase leading-none opacity-70">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-[12px] font-bold leading-tight">
                    {event.day.split(" ")[1]}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">
                    {event.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                    <CalendarDays size={10} />
                    {event.time}
                    <span className="mx-0.5">·</span>
                    <span className={`font-semibold ${event.color.split(" ")[1]}`}>
                      {event.mode}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${event.color}`}
                >
                  {event.type}
                </span>
                <button
                  onClick={() => toggleJoin(event.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                    isJoined
                      ? "bg-mint-soft text-mint-deep"
                      : "bg-navy text-white hover:bg-navy-2"
                  }`}
                >
                  {isJoined && <Check size={12} />}
                  {isJoined ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
