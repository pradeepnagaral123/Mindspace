import { Leaf, Flower2 } from "lucide-react";
import Card from "./Card";
import { quote } from "../data/mockData";

export default function QuoteCard() {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-lavender-soft" />
      <div className="absolute -right-3 -bottom-10 h-28 w-28 rounded-full bg-mint-soft" />

      <div className="relative">
        <span className="font-display text-6xl leading-none text-mint-deep">
          “
        </span>
        <blockquote className="-mt-4 font-display text-[17px] leading-relaxed text-ink">
          {quote.text}
        </blockquote>
        <p className="mt-3 text-xs font-medium text-muted">
          — {quote.source === "Unknown" ? "A gentle reminder for today" : quote.source}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div className="flex -space-x-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-mint-deep ring-2 ring-white">
              <Leaf size={16} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blossom text-blossom-deep ring-2 ring-white">
              <Flower2 size={16} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun text-sun-deep ring-2 ring-white">
              <Leaf size={16} />
            </span>
          </div>
          <span className="rounded-full bg-mint-soft px-3 py-1 text-[11px] font-semibold text-mint-deep">
            Daily Dose of Calm
          </span>
        </div>
      </div>
    </Card>
  );
}
