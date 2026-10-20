import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Icon from "./icons";

const categories = ["Support", "Wellbeing", "Mindfulness"];

const iconChoices = [
  { name: "graduationCap", accent: "bg-mint-soft text-mint-deep" },
  { name: "wind", accent: "bg-lavender-soft text-lavender-deep" },
  { name: "flower2", accent: "bg-blossom-soft text-blossom-deep" },
  { name: "usersRound", accent: "bg-peach-soft text-peach-deep" },
  { name: "sparkles", accent: "bg-sun-soft text-sun-deep" },
  { name: "cloudRain", accent: "bg-lavender-soft text-lavender-deep" },
  { name: "smile", accent: "bg-blossom-soft text-blossom-deep" },
  { name: "compass", accent: "bg-mint-soft text-mint-deep" },
];

export default function CreateCommunityModal({ open, onClose, onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Support");
  const [choice, setChoice] = useState(iconChoices[0]);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setCategory("Support");
      setChoice(iconChoices[0]);
    }
  }, [open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || submitting) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      icon: choice.name,
      accent: choice.accent,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line/70 px-6 py-4">
          <h3 className="text-base font-bold text-ink">Create Community</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-cream hover:text-ink"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="text-[12px] font-semibold text-muted">
              Community name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. New Parents United"
              autoFocus
              maxLength={80}
              className="mt-1 w-full rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={300}
              placeholder="What is this community about?"
              className="mt-1 w-full resize-none rounded-xl border border-line bg-cream/50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-mint-deep focus:ring-2 focus:ring-mint/40"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-muted">
              Category
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-xl border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    category === item
                      ? "border-navy bg-navy text-white"
                      : "border-line bg-white text-muted hover:bg-cream hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-muted">Icon</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {iconChoices.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setChoice(item)}
                  aria-label={item.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent} transition-all ${
                    choice.name === item.name
                      ? "ring-2 ring-navy ring-offset-1"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Icon name={item.name} size={18} strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={15} />
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
