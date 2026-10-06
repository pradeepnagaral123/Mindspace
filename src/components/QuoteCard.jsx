import { Leaf, Flower2 } from "lucide-react";
import { quote } from "../data/mockData";

export default function QuoteCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-lavender/35 bg-gradient-to-br from-lavender-soft via-white to-mint-soft p-5 shadow-[0_4px_24px_rgba(199,168,255,0.15),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(199,168,255,0.22),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-lavender/15 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-mint/15 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blossom/8 blur-3xl" />

      <div className="relative">
        <span className="font-display text-4xl leading-none text-lavender-deep/40">
          &ldquo;
        </span>
        <blockquote className="-mt-3 font-display text-[14px] leading-relaxed text-ink/85">
          {quote.text}
        </blockquote>
        <p className="mt-2 text-[11px] font-medium text-muted/60">
          — {quote.source === "Unknown" ? "A gentle reminder" : quote.source}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex -space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-mint-deep ring-2 ring-white shadow-sm">
              <Leaf size={13} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blossom text-blossom-deep ring-2 ring-white shadow-sm">
              <Flower2 size={13} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sun text-sun-deep ring-2 ring-white shadow-sm">
              <Leaf size={13} />
            </span>
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-lavender-deep/70 shadow-sm backdrop-blur-sm">
            Daily Dose
          </span>
        </div>
      </div>
    </div>
  );
}
