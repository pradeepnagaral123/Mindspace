import { useState } from "react";
import { Hash, Image, Paperclip, Send, Smile, X } from "lucide-react";
import Avatar from "./Avatar";
import { user } from "../data/mockData";

export default function PostComposerModal({ open, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [community, setCommunity] = useState("Student Support Circle");

  if (!open) return null;

  const submit = () => {
    if (!content.trim()) return;
    onSubmit({ title: title.trim() || "Sharing something with the community", content: content.trim(), community });
    setContent("");
    setTitle("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line/70 px-6 py-4">
          <h3 className="text-base font-bold text-ink">Create Post</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-cream hover:text-ink"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size={40} gradient="blossom" />
            <div>
              <p className="text-sm font-semibold text-ink">{user.name}</p>
              <select
                value={community}
                onChange={(event) => setCommunity(event.target.value)}
                className="mt-0.5 rounded-lg border border-line bg-cream px-2 py-1 text-[12px] font-medium text-mint-deep outline-none"
              >
                <option>Student Support Circle</option>
                <option>Anxiety Relief</option>
                <option>Mindful Moments</option>
              </select>
            </div>
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your post a title..."
            className="mt-4 w-full border-0 text-[15px] font-semibold text-ink outline-none placeholder:text-muted/60"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            placeholder="Share what's on your mind. You're in a safe, judgment-free space..."
            className="mt-2 w-full resize-none border-0 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/60"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cream px-3 py-2.5">
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 text-muted hover:bg-white hover:text-mint-deep" aria-label="Add image">
                <Image size={18} />
              </button>
              <button className="rounded-lg p-2 text-muted hover:bg-white hover:text-mint-deep" aria-label="Add attachment">
                <Paperclip size={18} />
              </button>
              <button className="rounded-lg p-2 text-muted hover:bg-white hover:text-mint-deep" aria-label="Add emoji">
                <Smile size={18} />
              </button>
              <button className="hidden items-center gap-1 rounded-lg p-2 text-muted hover:bg-white hover:text-mint-deep sm:flex" aria-label="Add hashtag">
                <Hash size={18} />
              </button>
            </div>
            <button
              onClick={submit}
              disabled={!content.trim()}
              className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
