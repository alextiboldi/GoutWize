"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UpvoteButtonProps {
  postId?: string;
  commentId?: string;
  initialUpvotes: number;
  initialVoted: boolean;
}

export function UpvoteButton({
  postId,
  commentId,
  initialUpvotes,
  initialVoted,
}: UpvoteButtonProps) {
  const [voted, setVoted] = useState(initialVoted);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isPending, setIsPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (isPending) return;

    // Optimistic update
    const prevVoted = voted;
    const prevUpvotes = upvotes;
    setVoted(!voted);
    setUpvotes(voted ? Math.max(upvotes - 1, 0) : upvotes + 1);
    setIsPending(true);

    try {
      const supabase = createClient();

      const { data, error } = commentId
        ? await supabase.rpc("toggle_comment_vote", { p_comment_id: commentId })
        : await supabase.rpc("toggle_post_vote", { p_post_id: postId! });

      if (error) {
        setVoted(prevVoted);
        setUpvotes(prevUpvotes);
        console.error("Vote toggle failed:", error.message);
      } else if (data) {
        setVoted(data.voted);
        setUpvotes(data.upvotes);
      }
    } catch {
      setVoted(prevVoted);
      setUpvotes(prevUpvotes);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1 transition-colors ${
        voted ? "text-gw-blue" : "text-gw-text-gray"
      }`}
      aria-label={voted ? "Remove upvote" : "Upvote"}
    >
      <ThumbsUp className={`w-3.5 h-3.5 ${voted ? "fill-current" : ""}`} />
      {upvotes}
    </button>
  );
}
