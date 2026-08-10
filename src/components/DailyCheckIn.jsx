import { useNavigate } from "react-router-dom";
import { PenLine, Smile } from "lucide-react";
import Card from "./Card";
import { checkInMetrics } from "../data/mockData";

export default function DailyCheckIn() {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-ink">Today's Check-in</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-lavender-soft px-3 py-1 text-[11px] font-semibold text-lavender-deep">
          <Smile size={13} />
          Feeling good
        </span>
      </div>

      <div className="space-y-4">
        {checkInMetrics.map((metric) => {
          const pct = Math.round((metric.value / metric.max) * 100);
          return (
            <div key={metric.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink">
                  {metric.label}
                </span>
                <span className="text-xs text-muted">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream">
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
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
      >
        <PenLine size={16} />
        Write in Journal
      </button>
    </Card>
  );
}
