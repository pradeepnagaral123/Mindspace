import { useNavigate } from "react-router-dom";
import { PenLine, Smile } from "lucide-react";
import Card from "./Card";
import { checkInMetrics } from "../data/mockData";

export default function DailyCheckIn() {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink">Today's Check-in</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-lavender-soft px-2.5 py-0.5 text-[10.5px] font-semibold text-lavender-deep">
          <Smile size={12} />
          Feeling good
        </span>
      </div>

      <div className="space-y-3">
        {checkInMetrics.map((metric) => {
          const pct = Math.round((metric.value / metric.max) * 100);
          return (
            <div key={metric.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] font-medium text-ink">
                  {metric.label}
                </span>
                <span className="text-[11px] text-muted">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
                <div
                  className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/journal")}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
      >
        <PenLine size={15} />
        Write in Journal
      </button>
    </Card>
  );
}
