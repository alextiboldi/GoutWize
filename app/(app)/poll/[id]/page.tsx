import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PollDetailClient, {
  type PollDetail,
  type PollCommentRow,
} from "./poll-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: pollId } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("polls")
    .select("question")
    .eq("id", pollId)
    .single();

  if (!data) return {};

  return {
    title: `${data.question} — GoutWize Poll`,
    description: data.question,
    openGraph: {
      title: data.question,
      description: "Vote on this community poll",
      type: "article",
      siteName: "GoutWize",
      images: [{ url: "/icons/foot_text_logo.png", width: 546, height: 158 }],
    },
    twitter: {
      card: "summary",
      title: data.question,
      description: "Vote on this community poll",
    },
  };
}

export default async function PollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pollId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [pollRes, commentsRes, userVoteRes] = await Promise.all([
    supabase
      .from("polls")
      .select(
        "id, question, closed, comment_count, created_at, author_id, profiles(username), poll_options(id, label, vote_count, display_order)",
      )
      .eq("id", pollId)
      .single(),
    supabase
      .from("comments")
      .select(
        "id, body, tried_it, upvotes, created_at, author_id, profiles(username)",
      )
      .eq("poll_id", pollId)
      .order("created_at", { ascending: false }),
    user
      ? supabase
          .from("poll_votes")
          .select("option_id")
          .eq("poll_id", pollId)
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!pollRes.data) notFound();

  return (
    <PollDetailClient
      poll={pollRes.data as unknown as PollDetail}
      initialComments={(commentsRes.data as unknown as PollCommentRow[]) ?? []}
      votedOptionId={(userVoteRes.data as { option_id: string } | null)?.option_id ?? null}
      isAuthenticated={!!user}
      currentUserId={user?.id ?? null}
    />
  );
}
