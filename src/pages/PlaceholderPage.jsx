import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";
import Card from "../components/Card";

export default function PlaceholderPage({ title, description }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-lavender text-navy">
          <Leaf size={30} strokeWidth={2.2} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {description ||
            "This space is being prepared with care. Check back soon — it'll be worth the wait."}
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cream"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-2"
          >
            Back to dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
