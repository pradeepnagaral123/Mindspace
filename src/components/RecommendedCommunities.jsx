import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import Icon from "./icons";
import { recommendedCommunities } from "../data/mockData";

export default function RecommendedCommunities() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-lavender/30 bg-gradient-to-br from-lavender-soft/70 via-white to-blossom-soft/40 p-5 shadow-[0_4px_24px_rgba(199,168,255,0.12),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(199,168,255,0.18),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-lavender/10 blur-2xl" />
      <div className="absolute -bottom-8 left-1/4 h-20 w-20 rounded-full bg-blossom/8 blur-2xl" />

      <div className="relative mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">Communities</h3>
        <Link
          to="/communities"
          className="flex items-center gap-1 text-[11px] font-semibold text-lavender-deep hover:text-lavender-deep/80"
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      <div className="relative space-y-1">
        {recommendedCommunities.map((community) => (
          <Link
            to={`/communities/${community.id}`}
            key={community.id}
            className="group flex items-start gap-2.5 rounded-xl bg-white/50 p-2 transition-all hover:bg-white hover:shadow-sm"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${community.accent} shadow-sm`}
            >
              <Icon name={community.icon} size={16} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink group-hover:text-lavender-deep">
                {community.name}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted/65">
                {community.description}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted/50">
                <Users size={9} />
                {community.members}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
