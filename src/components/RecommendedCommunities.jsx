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
    <Card className="flex flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Recommended for you</h3>
        <Link
          to="/communities"
          className="flex items-center gap-1 text-[12px] font-semibold text-mint-deep hover:text-mint-deep/80"
        >
          View all
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="space-y-1.5">
        {filtered.map((community) => (
          <Link
            to={`/communities/${community.id}`}
            key={community.id}
            className="group flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-cream"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${community.accent}`}
            >
              <Icon name={community.icon} size={17} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink group-hover:text-mint-deep">
                {community.name}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[12px] leading-relaxed text-muted">
                {community.description}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-muted">
                <Users size={10} />
                {community.members}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
