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
    <article className="rounded-xl border border-line/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(7,21,34,0.04)] sm:p-4">
      <div className="flex items-start gap-2.5">
        <Avatar name={post.author} size={32} gradient="lavender" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-ink">{post.author}</p>
          <p className="text-[10px] text-muted/60">
            in{" "}
            <Link
              to={`/communities/${post.community.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="font-medium text-mint-deep/70 hover:underline"
            >
              {post.community}
            </Link>{" "}
            &middot; {post.time}
          </p>
        </div>
      </div>

      <h4 className="mt-2 text-[13px] font-semibold text-ink">{post.title}</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-muted/80">{post.content}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cream/80 px-1.5 py-0.5 text-[9px] font-medium text-mint-deep/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {post.reply && (
        <div className="mt-2.5 flex gap-2.5 rounded-lg bg-mint-soft/40 p-2.5">
          <Avatar name={post.reply.author} size={22} gradient="mint" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-ink/80">
              {post.reply.author}
              <span className="ml-1.5 font-normal text-muted/50">
                {post.reply.time}
              </span>
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink/70">
              {post.reply.text}
            </p>
          </div>
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-0.5 border-t border-line/50 pt-2">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
            liked ? "text-blossom-deep" : "text-muted/60 hover:text-blossom-deep"
          }`}
        >
          <Heart size={13} className={liked ? "fill-blossom-deep" : ""} />
          {likeCount}
        </button>
        <button
          onClick={() => setReplying((value) => !value)}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
            replying ? "text-lavender-deep" : "text-muted/60 hover:text-lavender-deep"
          }`}
        >
          <MessageSquare size={13} />
          {commentCount}
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
            shared ? "text-mint-deep" : "text-muted/60 hover:text-mint-deep"
          }`}
        >
          <Share2 size={13} />
          {shared ? "Copied" : "Share"}
        </button>
      </div>

      {replying && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submitReply()}
            placeholder="Write a kind reply..."
            className="flex-1 rounded-lg border border-line bg-cream/60 px-2.5 py-1.5 text-[11px] outline-none placeholder:text-muted/50 focus:border-mint-deep focus:bg-white focus:ring-1 focus:ring-mint/30"
          />
          <button
            onClick={submitReply}
            disabled={!replyText.trim()}
            className="rounded-lg bg-navy/90 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reply
          </button>
        </div>
      )}
    </article>
  );
}
