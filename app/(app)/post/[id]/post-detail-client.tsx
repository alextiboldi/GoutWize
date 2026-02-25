"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Share2, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POST_CATEGORIES, TRIED_IT_OPTIONS } from "@/lib/constants";
import { TriedItBadge } from "@/components/app/tried-it-badge";
import { UpvoteButton } from "@/components/app/upvote-button";

export interface PostDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  profiles: { username: string };
}

export interface CommentRow {
  id: string;
  body: string;
  tried_it: string | null;
  upvotes: number;
  created_at: string;
  profiles: { username: string };
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface PostDetailClientProps {
  post: PostDetail;
  initialComments: CommentRow[];
  hasVoted: boolean;
  votedCommentIds: string[];
  isAuthenticated: boolean;
}

export default function PostDetailClient({
  post,
  initialComments,
  hasVoted,
  votedCommentIds,
  isAuthenticated,
}: PostDetailClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentRow[]>(initialComments);

  // Comment form state
  const [commentBody, setCommentBody] = useState("");
  const [triedIt, setTriedIt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/post/${post.id}`;
    const text =
      post.body.length > 100
        ? post.body.slice(0, 100) + "..."
        : post.body;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `${text} — from the GoutWize community`,
          url,
        });
      } catch {
        // User cancelled share — ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          author_id: user.id,
          body: commentBody.trim(),
          tried_it: triedIt,
        })
        .select("id, body, tried_it, upvotes, created_at, profiles(username)")
        .single();

      if (insertError) {
        console.error("Comment insert error:", insertError);
        setError(insertError.message || "Failed to post comment.");
      } else if (data) {
        setComments((prev) => [data as unknown as CommentRow, ...prev]);
        setCommentBody("");
        setTriedIt(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const cat = POST_CATEGORIES.find((c) => c.value === post.category);

  return (
    <div>
      {/* Back button */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-sm text-gw-text-gray hover:text-gw-navy transition-colors mb-4 pt-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Full post */}
      <div className="bg-white rounded-2xl p-5">
        {cat && (
          <span className="inline-block bg-gw-bg-light text-gw-navy text-xs font-medium px-2.5 py-1 rounded-full mb-3">
            {cat.emoji} {cat.label}
          </span>
        )}

        <h1 className="font-heading text-xl font-bold text-gw-navy leading-snug">
          {post.title}
        </h1>

        <p className="mt-3 text-sm text-gw-navy leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-gw-text-gray">
          <span className="font-medium">
            {post.profiles?.username ?? "Anonymous"}
          </span>
          <span>&middot;</span>
          <span>{timeAgo(post.created_at)}</span>
          <span className="ml-auto flex items-center gap-3">
            <UpvoteButton
              postId={post.id}
              initialUpvotes={post.upvotes}
              initialVoted={hasVoted}
            />
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gw-text-gray hover:text-gw-blue transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-gw-green" />
                  <span className="text-gw-green text-xs">Copied!</span>
                </>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gw-border" />

      {/* Comments header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm text-gw-navy">
          {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
        </h2>
        {comments.length > 1 && (
          <span className="text-xs text-gw-text-gray">
            Sorted by most helpful
          </span>
        )}
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl p-4">
              {comment.tried_it && (
                <div className="mb-2">
                  <TriedItBadge value={comment.tried_it} />
                </div>
              )}
              <p className="text-sm text-gw-navy leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gw-text-gray">
                <span className="font-medium">
                  {comment.profiles?.username ?? "Anonymous"}
                </span>
                <span>&middot;</span>
                <span>{timeAgo(comment.created_at)}</span>
                <span className="ml-auto">
                  <UpvoteButton
                    commentId={comment.id}
                    initialUpvotes={comment.upvotes}
                    initialVoted={votedCommentIds.includes(comment.id)}
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gw-text-gray text-center py-4">
          No replies yet. Be the first!
        </p>
      )}

      {/* Comment form or CTA */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmitComment}
          className="mt-6 bg-white rounded-2xl p-4 space-y-4"
        >
          {/* Tried-it selector */}
          <div>
            <p className="text-xs font-medium text-gw-text-gray mb-2">
              Did you try this? (optional)
            </p>
            <div className="flex gap-2">
              {TRIED_IT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTriedIt(triedIt === option.value ? null : option.value)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    triedIt === option.value
                      ? "bg-gw-blue text-white"
                      : "bg-gw-bg-light text-gw-navy hover:bg-gw-bg-mid"
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment textarea */}
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Share your experience..."
            required
            rows={3}
            className="w-full px-4 py-3 bg-gw-bg-light border-2 border-transparent rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:bg-white focus:ring-4 focus:ring-gw-blue/10 transition-all resize-none"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !commentBody.trim()}
            className="w-full bg-gw-blue text-white py-3 rounded-xl font-semibold text-sm hover:bg-gw-blue-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Posting..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Reply
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="mt-6 bg-white rounded-2xl p-6 text-center">
          <p className="font-heading text-lg font-bold text-gw-navy">
            Join the conversation
          </p>
          <p className="text-sm text-gw-text-gray mt-1">
            Sign up to share your experience &mdash; it&apos;s free.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 bg-gw-blue text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gw-blue-dark transition-colors"
          >
            Get started
          </Link>
        </div>
      )}
    </div>
  );
}
