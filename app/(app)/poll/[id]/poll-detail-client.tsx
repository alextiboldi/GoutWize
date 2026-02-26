"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Check,
  MessageCircle,
  Send,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";
import { useToastStore } from "@/lib/toast-store";
import { UpvoteButton } from "@/components/app/upvote-button";

interface PollOptionDetail {
  id: string;
  label: string;
  vote_count: number;
  display_order: number;
}

export interface PollDetail {
  id: string;
  question: string;
  closed: boolean;
  comment_count: number;
  created_at: string;
  author_id: string;
  profiles: { username: string };
  poll_options: PollOptionDetail[];
}

export interface PollCommentRow {
  id: string;
  body: string;
  tried_it: string | null;
  upvotes: number;
  created_at: string;
  author_id: string;
  profiles: { username: string };
}

interface PollDetailClientProps {
  poll: PollDetail;
  initialComments: PollCommentRow[];
  votedOptionId: string | null;
  isAuthenticated: boolean;
  currentUserId: string | null;
}

export default function PollDetailClient({
  poll,
  initialComments,
  votedOptionId: initialVotedOptionId,
  isAuthenticated,
  currentUserId,
}: PollDetailClientProps) {
  const router = useRouter();
  const [options, setOptions] = useState(poll.poll_options);
  const [votedOptionId, setVotedOptionId] = useState(initialVotedOptionId);
  const [isVoting, setIsVoting] = useState(false);
  const [comments, setComments] = useState<PollCommentRow[]>(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDeletePoll, setConfirmDeletePoll] = useState(false);
  const [confirmDeleteComment, setConfirmDeleteComment] = useState<
    string | null
  >(null);

  const totalVotes = options.reduce((sum, o) => sum + o.vote_count, 0);
  const hasVoted = votedOptionId !== null;

  async function handleVote(optionId: string) {
    if (hasVoted || isVoting) return;
    setIsVoting(true);

    setVotedOptionId(optionId);
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId ? { ...o, vote_count: o.vote_count + 1 } : o,
      ),
    );

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("cast_poll_vote", {
        p_poll_id: poll.id,
        p_option_id: optionId,
      });

      if (error) {
        setVotedOptionId(null);
        setOptions(poll.poll_options);
        console.error("Vote error:", error);
      } else if (data) {
        setOptions(data.options);
        setVotedOptionId(data.voted_option_id);
      }
    } catch {
      setVotedOptionId(null);
      setOptions(poll.poll_options);
    } finally {
      setIsVoting(false);
    }
  }

  async function handleDeletePoll() {
    const supabase = createClient();
    const { error } = await supabase.from("polls").delete().eq("id", poll.id);
    if (!error) {
      useToastStore.getState().add("Poll deleted");
      router.push("/feed");
    }
  }

  async function handleDeleteComment(commentId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      useToastStore.getState().add("Comment deleted");
    }
    setConfirmDeleteComment(null);
  }

  async function handleShare() {
    const url = `${window.location.origin}/poll/${poll.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: poll.question,
          text: `${poll.question} — from the GoutWize community`,
          url,
        });
      } catch {
        // User cancelled share
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
          poll_id: poll.id,
          author_id: user.id,
          body: commentBody.trim(),
        })
        .select(
          "id, body, tried_it, upvotes, created_at, author_id, profiles(username)",
        )
        .single();

      if (insertError) {
        console.error("Comment insert error:", insertError);
        setError(insertError.message || "Failed to post comment.");
      } else if (data) {
        setComments((prev) => [data as unknown as PollCommentRow, ...prev]);
        setCommentBody("");
        useToastStore.getState().add("Comment posted!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const sortedOptions = [...options].sort(
    (a, b) => a.display_order - b.display_order,
  );

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

      {/* Poll content */}
      <div className="bg-white rounded-2xl p-5">
        <span className="inline-flex items-center gap-1 bg-gw-blue/10 text-gw-blue text-xs font-medium px-2.5 py-1 rounded-full mb-3">
          <BarChart3 className="w-3 h-3" />
          Poll
        </span>

        <h1 className="font-heading text-xl font-bold text-gw-navy leading-snug">
          {poll.question}
        </h1>

        {/* Options / Results */}
        <div className="mt-4 space-y-2">
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div
                key="voting"
                initial={false}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {sortedOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={isVoting}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-gw-border text-sm font-medium text-gw-navy hover:border-gw-blue hover:bg-gw-blue/5 transition-all disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {sortedOptions.map((option) => {
                  const pct =
                    totalVotes > 0
                      ? Math.round((option.vote_count / totalVotes) * 100)
                      : 0;
                  const isUserChoice = option.id === votedOptionId;

                  return (
                    <div
                      key={option.id}
                      className={`relative overflow-hidden rounded-xl px-4 py-3 ${
                        isUserChoice
                          ? "border-l-4 border-gw-blue bg-gw-blue/5"
                          : "bg-gw-bg-light"
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-gw-blue/10 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gw-navy">
                          {isUserChoice && (
                            <Check className="w-3.5 h-3.5 text-gw-blue" />
                          )}
                          {option.label}
                        </span>
                        <span className="text-xs font-semibold text-gw-text-gray">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-gw-text-gray pt-1">
                  {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gw-text-gray">
          <span className="font-medium">
            {poll.profiles?.username ?? "Anonymous"}
          </span>
          <span>&middot;</span>
          <span>{timeAgo(poll.created_at)}</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {comments.length}
            </span>
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
            {currentUserId === poll.author_id && (
              <button
                onClick={() => setConfirmDeletePoll(true)}
                className="text-gw-text-gray hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gw-border" />

      {/* Comments header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm text-gw-navy">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl p-4">
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
                    initialVoted={false}
                  />
                  {currentUserId === comment.author_id && (
                    <button
                      onClick={() => setConfirmDeleteComment(comment.id)}
                      className="text-gw-text-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-semibold text-gw-navy">No comments yet</p>
          <p className="text-sm text-gw-text-gray mt-1">
            Share your thoughts below.
          </p>
        </div>
      )}

      {/* Comment form or CTA */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmitComment}
          className="mt-6 bg-white rounded-2xl p-4 space-y-4"
        >
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Share your thoughts..."
            required
            rows={3}
            className="w-full px-4 py-3 bg-gw-bg-light border-2 border-transparent rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:bg-white focus:ring-4 focus:ring-gw-blue/10 transition-all resize-none"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

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
                Comment
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
            Sign up to share your thoughts &mdash; it&apos;s free.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 bg-gw-blue text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gw-blue-dark transition-colors"
          >
            Get started
          </Link>
        </div>
      )}

      {/* Delete poll confirmation */}
      {confirmDeletePoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="font-semibold text-gw-navy text-center">
              Delete this poll?
            </p>
            <p className="text-sm text-gw-text-gray text-center mt-1">
              This can&apos;t be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDeletePoll(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gw-navy bg-gw-bg-light hover:bg-gw-bg-mid transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePoll}
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
    </div>
  );
}
