import { BookOpen, Clock, X } from "lucide-react";

export default function ArticleReaderModal({ resource, onClose }) {
  if (!resource) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
        <div className="bg-navy p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[10.5px] font-semibold text-mint">
              <BookOpen size={12} />
              {resource.category}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close article"
            >
              <X size={19} />
            </button>
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
            {resource.title}
          </h2>

          <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-mint">
            <Clock size={13} />
            {resource.readTime}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {resource.body.map((block, index) => {
            if (block.type === "lead") {
              return (
                <p
                  key={index}
                  className="font-display text-lg font-medium leading-relaxed text-ink sm:text-xl"
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === "h3") {
              return (
                <h3
                  key={index}
                  className="mt-6 text-[15px] font-bold text-ink"
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === "tip") {
              return (
                <div
                  key={index}
                  className="mt-6 rounded-2xl bg-mint-soft px-4 py-3.5"
                >
                  <p className="text-sm leading-relaxed text-mint-deep">
                    {block.text}
                  </p>
                </div>
              );
            }
            return (
              <p
                key={index}
                className="mt-4 text-[15px] leading-relaxed text-muted"
              >
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-line/70 px-6 py-4 sm:px-8">
          <p className="text-[12.5px] text-muted">
            Written with care by the MindSpace team.
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
          >
            Done reading
          </button>
        </div>
      </div>
    </div>
  );
}
