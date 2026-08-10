import { useNavigate } from "react-router-dom";
import { HeartHandshake, PhoneCall } from "lucide-react";
import Card from "./Card";

export default function EmergencySupportCard() {
  const navigate = useNavigate();

  return (
    <Card className="border-blossom/30 bg-gradient-to-br from-blossom-soft/70 to-cream p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blossom/20 text-blossom-deep">
          <HeartHandshake size={22} />
        </span>
        <div>
          <h3 className="text-base font-bold text-ink">Need immediate help?</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            If you're experiencing a crisis or need urgent support right now,
            please reach out to a professional crisis line. You deserve
            immediate, compassionate care — we're here, and so are they.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/helplines")}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blossom-deep/30 bg-white px-4 py-2.5 text-sm font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft"
      >
        <PhoneCall size={16} />
        View Helplines
      </button>
    </Card>
  );
}
