import { useNavigate } from "react-router-dom";
import { HeartHandshake, PhoneCall } from "lucide-react";
import Card from "./Card";

export default function EmergencySupportCard() {
  const navigate = useNavigate();

  return (
    <Card className="border-blossom/30 bg-gradient-to-br from-blossom-soft/70 to-cream p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blossom/20 text-blossom-deep">
          <HeartHandshake size={18} />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-ink">Need immediate help?</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            If you're experiencing a crisis or need urgent support right now,
            please reach out to a professional crisis line. You deserve
            immediate, compassionate care — we're here, and so are they.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/helplines")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blossom-deep/30 bg-white px-4 py-2 text-[13px] font-semibold text-blossom-deep transition-colors hover:bg-blossom-soft"
      >
        <PhoneCall size={15} />
        View Helplines
      </button>
    </Card>
  );
}
