import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostDetailClient, {
  type PostDetail,
  type CommentRow,
} from "./post-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("title, body")
    .eq("id", postId)
    .single();

  if (!data) return {};

  const description =
    data.body.length > 150
      ? data.body.slice(0, 150) + "..."
      : data.body;

  return {
    title: `${data.title} — GoutWize`,
    description,
    openGraph: {
      title: data.title,
      description,
      type: "article",
      siteName: "GoutWize",
      images: [{ url: "/icons/foot_text_logo.png", width: 546, height: 158 }],
    },
    twitter: {
      card: "summary",
      title: data.title,
      description,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [postRes, commentsRes, voteRes, commentVotesRes] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, body, category, upvotes, comment_count, created_at, profiles(username)",
      )
      .eq("id", postId)
      .single(),
    supabase
      .from("comments")
      .select(
        "id, body, tried_it, upvotes, created_at, profiles(username)",
      )
      .eq("post_id", postId)
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false }),
    user
      ? supabase
          .from("votes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("votes")
          .select("comment_id")
          .eq("user_id", user.id)
          .not("comment_id", "is", null)
      : Promise.resolve({ data: [] }),
  ]);

  if (!postRes.data) notFound();

  const votedCommentIds = (commentVotesRes.data ?? []).map(
    (v) => v.comment_id as string,
  );

  return (
    <PostDetailClient
      post={postRes.data as unknown as PostDetail}
      initialComments={
        (commentsRes.data as unknown as CommentRow[]) ?? []
      }
      hasVoted={!!voteRes.data}
      votedCommentIds={votedCommentIds}
      isAuthenticated={!!user}
    />
  );
}
