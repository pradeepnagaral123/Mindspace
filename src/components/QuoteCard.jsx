import { Leaf, Flower2 } from "lucide-react";
import Card from "./Card";
import { quote } from "../data/mockData";

export default function QuoteCard() {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-lavender-soft" />
      <div className="absolute -right-3 -bottom-10 h-20 w-20 rounded-full bg-mint-soft" />

      <div className="relative">
        <span className="font-display text-4xl leading-none text-mint-deep">
          “
        </span>
        <blockquote className="-mt-3 font-display text-[14px] leading-relaxed text-ink">
          {quote.text}
        </blockquote>
        <p className="mt-2 text-[11px] font-medium text-muted">
          — {quote.source === "Unknown" ? "A gentle reminder for today" : quote.source}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex -space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-mint-deep ring-2 ring-white">
              <Leaf size={13} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blossom text-blossom-deep ring-2 ring-white">
              <Flower2 size={13} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sun text-sun-deep ring-2 ring-white">
              <Leaf size={13} />
            </span>
          </div>
          <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-[10px] font-semibold text-mint-deep">
            Daily Dose of Calm
          </span>
        </div>
      </div>
    </Card>
  );
}
