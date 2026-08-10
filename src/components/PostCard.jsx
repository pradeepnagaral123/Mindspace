import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import Avatar from "./Avatar";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [replying, setReplying] = useState(false);
  const [shared, setShared] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [commentCount, setCommentCount] = useState(post.comments);

  const toggleLike = () => {
    setLiked((value) => !value);
    setLikeCount((count) => (liked ? count - 1 : count + 1));
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    setCommentCount((count) => count + 1);
    setReplyText("");
    setReplying(false);
  };

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(7,21,34,0.05)] sm:p-6">
      <div className="flex items-start gap-3">
        <Avatar name={post.author} size={42} gradient="lavender" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">{post.author}</p>
          <p className="text-xs text-muted">
            in{" "}
            <Link
              to={`/communities/${post.community.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="font-semibold text-mint-deep hover:underline"
            >
              {post.community}
            </Link>{" "}
            · {post.time}
          </p>
        </div>
      </div>

      <h4 className="mt-4 text-[15px] font-bold text-ink">{post.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.content}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-mint-deep"
          >
            {tag}
          </span>
        ))}
      </div>

      {post.reply && (
        <div className="mt-4 flex gap-3 rounded-xl bg-mint-soft/60 p-3.5">
          <Avatar name={post.reply.author} size={30} gradient="mint" />
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-ink">
              {post.reply.author}
              <span className="ml-2 font-normal text-muted">
                {post.reply.time}
              </span>
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-ink/80">
              {post.reply.text}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1 border-t border-line/70 pt-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
            liked ? "text-blossom-deep" : "text-muted hover:text-blossom-deep"
          }`}
        >
          <Heart size={16} className={liked ? "fill-blossom-deep" : ""} />
          {likeCount}
        </button>
        <button
          onClick={() => setReplying((value) => !value)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
            replying ? "text-lavender-deep" : "text-muted hover:text-lavender-deep"
          }`}
        >
          <MessageSquare size={16} />
          {commentCount}
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
            shared ? "text-mint-deep" : "text-muted hover:text-mint-deep"
          }`}
        >
          <Share2 size={16} />
          {shared ? "Link copied" : "Share"}
        </button>
      </div>

      {replying && (
        <div className="mt-3 flex items-center gap-2.5">
          <input
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submitReply()}
            placeholder="Write a kind reply..."
            className="flex-1 rounded-xl border border-line bg-cream px-3.5 py-2 text-sm outline-none placeholder:text-muted/70 focus:border-mint-deep focus:bg-white focus:ring-2 focus:ring-mint/40"
          />
          <button
            onClick={submitReply}
            disabled={!replyText.trim()}
            className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reply
          </button>
        </div>
      )}
    </article>
  );
}
