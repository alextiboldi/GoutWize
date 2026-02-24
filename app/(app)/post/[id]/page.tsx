import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostDetailClient, {
  type PostDetail,
  type CommentRow,
} from "./post-detail-client";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;
  const supabase = await createClient();

  const [postRes, commentsRes] = await Promise.all([
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
  ]);

  if (!postRes.data) notFound();

  return (
    <PostDetailClient
      post={postRes.data as unknown as PostDetail}
      initialComments={
        (commentsRes.data as unknown as CommentRow[]) ?? []
      }
    />
  );
}
