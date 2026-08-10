import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import Card from "./Card";
import Icon from "./icons";
import { recommendedCommunities } from "../data/mockData";
import { useSearch } from "../context/SearchContext";

export default function RecommendedCommunities() {
  const { query } = useSearch();
  const term = query.trim().toLowerCase();

  const filtered = term
    ? recommendedCommunities.filter(
        (community) =>
          community.name.toLowerCase().includes(term) ||
          community.description.toLowerCase().includes(term),
      )
    : recommendedCommunities;

  return (
    <Card className="flex flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-ink">Recommended for you</h3>
        <Link
          to="/communities"
          className="flex items-center gap-1 text-[13px] font-semibold text-mint-deep hover:text-mint-deep/80"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3.5">
        {filtered.map((community) => (
          <Link
            to={`/communities/${community.id}`}
            key={community.id}
            className="group flex items-start gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-cream"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${community.accent}`}
            >
              <Icon name={community.icon} size={21} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink group-hover:text-mint-deep">
                {community.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                {community.description}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted">
                <Users size={11} />
                {community.members}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
