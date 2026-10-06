import { useNavigate } from "react-router-dom";
import { HeartHandshake, PhoneCall } from "lucide-react";

export default function EmergencySupportCard() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blossom/35 bg-gradient-to-br from-blossom-soft/60 via-white to-sun-soft/30 p-5 shadow-[0_4px_24px_rgba(255,157,187,0.14),0_1px_4px_rgba(7,21,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,157,187,0.2),0_2px_6px_rgba(7,21,34,0.08)]">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blossom/12 blur-2xl" />
      <div className="absolute -bottom-8 left-1/4 h-20 w-20 rounded-full bg-sun/8 blur-2xl" />

      <div className="relative flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blossom/20 text-blossom-deep shadow-sm">
          <HeartHandshake size={18} />
        </span>
        <div>
          <h3 className="text-[13px] font-bold text-ink">Need help now?</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-muted/70">
            If you&apos;re in crisis, reach out to a professional crisis line.
            You deserve immediate, compassionate care.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/helplines")}
        className="relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blossom-deep/25 bg-white/70 px-4 py-2 text-[11px] font-semibold text-blossom-deep shadow-sm transition-all hover:bg-white hover:shadow-md"
      >
        <PhoneCall size={13} />
        View Helplines
      </button>
    </div>
  );
}
