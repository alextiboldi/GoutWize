"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Share2, Check, Trash2, MoreHorizontal, Flag } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POST_CATEGORIES, TRIED_IT_OPTIONS, REPORT_REASONS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { useToastStore } from "@/lib/toast-store";
import { TriedItBadge } from "@/components/app/tried-it-badge";
import {
  TriedItSummary,
  computeTriedItCounts,
} from "@/components/app/tried-it-summary";
import { UpvoteButton } from "@/components/app/upvote-button";

export interface PostDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  author_id: string;
  profiles: { username: string };
}

export interface CommentRow {
  id: string;
  body: string;
  tried_it: string | null;
  upvotes: number;
  created_at: string;
  author_id: string;
  profiles: { username: string };
}

interface PostDetailClientProps {
  post: PostDetail;
  initialComments: CommentRow[];
  hasVoted: boolean;
  votedCommentIds: string[];
  isAuthenticated: boolean;
  currentUserId: string | null;
}

function DropdownMenu({
  isOwner,
  onReport,
  onDelete,
}: {
  isOwner: boolean;
  onReport: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gw-text-gray hover:text-gw-navy transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-6 bg-white rounded-xl shadow-lg border border-gw-border py-1 z-40 min-w-[140px]">
          <button
            onClick={() => {
              setOpen(false);
              onReport();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gw-navy hover:bg-gw-bg-light transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Report
          </button>
          {isOwner && (
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ReportModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}) {
  const [reason, setReason] = useState<string>(REPORT_REASONS[0].value);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await onSubmit(reason, details);
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <p className="font-semibold text-gw-navy text-center">
          Report content
        </p>
        <p className="text-sm text-gw-text-gray text-center mt-1">
          Why are you reporting this?
        </p>

        <div className="mt-4 space-y-2">
          {REPORT_REASONS.map((r) => (
            <label
              key={r.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                reason === r.value
                  ? "bg-gw-blue/10 border border-gw-blue"
                  : "bg-gw-bg-light border border-transparent hover:bg-gw-bg-mid"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="accent-gw-blue"
              />
              <span className="text-sm text-gw-navy">{r.label}</span>
            </label>
          ))}
        </div>

        {reason === "other" && (
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please describe the issue..."
            rows={3}
            className="w-full mt-3 px-4 py-3 bg-gw-bg-light border-2 border-transparent rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:bg-white focus:ring-4 focus:ring-gw-blue/10 transition-all resize-none"
          />
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gw-navy bg-gw-bg-light hover:bg-gw-bg-mid transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailClient({
  post,
  initialComments,
  hasVoted,
  votedCommentIds,
  isAuthenticated,
  currentUserId,
}: PostDetailClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentRow[]>(initialComments);

  // Comment form state
  const [commentBody, setCommentBody] = useState("");
  const [triedIt, setTriedIt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);
  const [confirmDeleteComment, setConfirmDeleteComment] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{ type: "post"; id: string } | { type: "comment"; id: string } | null>(null);

  async function handleDeletePost() {
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (!error) {
      useToastStore.getState().add("Post deleted");
      router.push("/feed");
    }
  }

  async function handleDeleteComment(commentId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      useToastStore.getState().add("Comment deleted");
    }
    setConfirmDeleteComment(null);
  }

  async function handleReport(reason: string, details: string) {
    if (!reportTarget) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("reports").insert({
      id: crypto.randomUUID(),
      reporter_id: user.id,
      post_id: reportTarget.type === "post" ? reportTarget.id : null,
      comment_id: reportTarget.type === "comment" ? reportTarget.id : null,
      reason,
      details: details || null,
    });

    setReportTarget(null);
    useToastStore.getState().add("Thanks for reporting");
  }

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
          id: crypto.randomUUID(),
          post_id: post.id,
          author_id: user.id,
          body: commentBody.trim(),
          tried_it: triedIt,
        })
        .select("id, body, tried_it, upvotes, created_at, author_id, profiles(username)")
        .single();

      if (insertError) {
        console.error("Comment insert error:", insertError);
        setError(insertError.message || "Failed to post comment.");
      } else if (data) {
        setComments((prev) => [data as unknown as CommentRow, ...prev]);
        setCommentBody("");
        setTriedIt(null);
        useToastStore.getState().add("Comment posted!");

        // Fire-and-forget email notification to post author
        fetch("/api/email/comment-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id }),
        }).catch(() => {});
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const cat = POST_CATEGORIES.find((c) => c.value === post.category);
  const showDisclaimer = post.category === "has_anyone_tried" || post.category === "tip";

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

        {showDisclaimer && (
          <p className="mt-3 text-xs text-gw-text-gray/70 bg-amber-50 px-3 py-2 rounded-lg">
            This post may contain personal health experiences. Always consult your doctor before trying new treatments or changing your medication.
          </p>
        )}

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
            {isAuthenticated && (
              <DropdownMenu
                isOwner={currentUserId === post.author_id}
                onReport={() => setReportTarget({ type: "post", id: post.id })}
                onDelete={() => setConfirmDeletePost(true)}
              />
            )}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gw-border" />

      {/* Tried-it summary */}
      <TriedItSummary
        counts={computeTriedItCounts(comments.map((c) => c.tried_it))}
      />

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
                <span className="ml-auto flex items-center gap-3">
                  <UpvoteButton
                    commentId={comment.id}
                    initialUpvotes={comment.upvotes}
                    initialVoted={votedCommentIds.includes(comment.id)}
                  />
                  {isAuthenticated && (
                    <DropdownMenu
                      isOwner={currentUserId === comment.author_id}
                      onReport={() => setReportTarget({ type: "comment", id: comment.id })}
                      onDelete={() => setConfirmDeleteComment(comment.id)}
                    />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-semibold text-gw-navy">No replies yet</p>
          <p className="text-sm text-gw-text-gray mt-1">
            Share your experience below.
          </p>
        </div>
      )}

      {/* Comment form or CTA */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmitComment}
          className="mt-6 bg-white rounded-2xl p-4 space-y-4"
        >
          {/* Tried-it selector */}
          <div>
            {(post.category === "has_anyone_tried" || post.category === "tip") && (
              <p className="text-xs text-gw-blue bg-gw-blue/5 px-3 py-2 rounded-lg mb-2">
                Have you tried this? Your experience helps the community.
              </p>
            )}
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

      {/* Delete post confirmation */}
      {confirmDeletePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="font-semibold text-gw-navy text-center">
              Delete this post?
            </p>
            <p className="text-sm text-gw-text-gray text-center mt-1">
              This can&apos;t be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDeletePost(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gw-navy bg-gw-bg-light hover:bg-gw-bg-mid transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete comment confirmation */}
      {confirmDeleteComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="font-semibold text-gw-navy text-center">
              Delete this comment?
            </p>
            <p className="text-sm text-gw-text-gray text-center mt-1">
              This can&apos;t be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDeleteComment(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gw-navy bg-gw-bg-light hover:bg-gw-bg-mid transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(confirmDeleteComment)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report modal */}
      {reportTarget && (
        <ReportModal
          onClose={() => setReportTarget(null)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
}
