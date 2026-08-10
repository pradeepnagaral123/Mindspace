import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "./Card";
import Avatar from "./Avatar";
import { connections } from "../data/mockData";

export default function ConnectionsCard() {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-ink">Your Connections</h3>
        <Link
          to="/messages"
          className="flex items-center gap-1 text-[13px] font-semibold text-mint-deep hover:text-mint-deep/80"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {connections.map((peer) => (
          <Link
            to="/messages"
            key={peer.id}
            className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-cream"
          >
            <Avatar
              name={peer.name}
              gradient={peer.gradient}
              status={peer.status}
              size={42}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-ink">
                  {peer.name}
                </p>
                <span className="shrink-0 text-[11px] text-muted">
                  {peer.time}
                </span>
              </div>
              <p
                className={`text-[12px] leading-relaxed ${
                  peer.status === "online"
                    ? "text-mint-deep"
                    : "text-muted"
                }`}
              >
                {peer.status === "online" ? "Online now" : "Away"}
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] text-muted">
                {peer.message}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
