"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POST_CATEGORIES, TRIED_IT_OPTIONS } from "@/lib/constants";
import { TriedItBadge } from "@/components/app/tried-it-badge";

interface PostDetail {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  profiles: { username: string };
}

interface CommentRow {
  id: string;
  body: string;
  tried_it: string | null;
  upvotes: number;
  created_at: string;
  profiles: { username: string };
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Comment form state
  const [commentBody, setCommentBody] = useState("");
  const [triedIt, setTriedIt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      const supabase = createClient();

      const [postRes, commentsRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id, title, body, category, upvotes, comment_count, created_at, profiles(username)")
          .eq("id", postId)
          .single(),
        supabase
          .from("comments")
          .select("id, body, tried_it, upvotes, created_at, profiles(username)")
          .eq("post_id", postId)
          .order("upvotes", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      if (postRes.data) {
        setPost(postRes.data as unknown as PostDetail);
      }
      setComments((commentsRes.data as unknown as CommentRow[]) ?? []);
      setLoading(false);
    }

    loadPost();
  }, [postId]);

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
          post_id: postId,
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

  if (loading) {
    return (
      <div className="pt-8 text-center text-gw-text-gray">Loading...</div>
    );
  }

  if (!post) {
    return (
      <div className="pt-8 text-center">
        <p className="text-gw-navy font-semibold">Post not found</p>
        <Link href="/feed" className="text-sm text-gw-blue mt-2 inline-block">
          Back to feed
        </Link>
      </div>
    );
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
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gw-border" />

      {/* Comments header */}
      <h2 className="font-semibold text-sm text-gw-navy mb-3">
        {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
      </h2>

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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gw-text-gray text-center py-4">
          No replies yet. Be the first!
        </p>
      )}

      {/* Comment form */}
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
    </div>
  );
}
