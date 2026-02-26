import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seedInsights } from "@/lib/seed-data";
import FeedClient, { type PostRow, type PollRow } from "./feed-client";

function pickRandomInsight() {
  return seedInsights[Math.floor(Math.random() * seedInsights.length)];
}

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [checkinRes, flareRes, postsRes, votesRes, streakRes, userFlareRes, pollsRes, pollVotesRes, triedItRes] = await Promise.all([
    supabase
      .from("checkins")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("flares")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("posts")
      .select(
        "id, title, body, category, upvotes, comment_count, created_at, profiles(username)",
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("votes")
      .select("post_id")
      .eq("user_id", user.id)
      .not("post_id", "is", null),
    supabase.rpc("get_checkin_streak", { p_user_id: user.id }),
    supabase
      .from("flares")
      .select("id, joint, severity")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("polls")
      .select(
        "id, question, comment_count, created_at, author_id, profiles(username), poll_options(id, label, vote_count, display_order)",
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("poll_votes")
      .select("poll_id, option_id")
      .eq("user_id", user.id),
    supabase
      .from("comments")
      .select("post_id, tried_it")
      .not("tried_it", "is", null)
      .not("post_id", "is", null),
  ]);

  const randomInsight = pickRandomInsight();
  const votedPostIds = (votesRes.data ?? []).map((v) => v.post_id as string);

  const userPollVotes = (pollVotesRes.data ?? []) as Array<{
    poll_id: string;
    option_id: string;
  }>;

  const userActiveFlare = userFlareRes.data as
    | { id: string; joint: string; severity: number }
    | null;

  // Aggregate tried-it counts per post
  const triedItByPost: Record<string, { worked: number; didnt_work: number; mixed: number }> = {};
  for (const row of (triedItRes.data ?? []) as Array<{ post_id: string; tried_it: string }>) {
    if (!triedItByPost[row.post_id]) {
      triedItByPost[row.post_id] = { worked: 0, didnt_work: 0, mixed: 0 };
    }
    const counts = triedItByPost[row.post_id];
    if (row.tried_it === "worked") counts.worked++;
    else if (row.tried_it === "didnt_work") counts.didnt_work++;
    else if (row.tried_it === "mixed") counts.mixed++;
  }

  return (
    <FeedClient
      checkedInToday={!!checkinRes.data}
      activeFlareCount={flareRes.count ?? 0}
      posts={(postsRes.data as unknown as PostRow[]) ?? []}
      polls={(pollsRes.data as unknown as PollRow[]) ?? []}
      randomInsight={randomInsight}
      votedPostIds={votedPostIds}
      userPollVotes={userPollVotes}
      triedItByPost={triedItByPost}
      checkinStreak={(streakRes.data as number) ?? 0}
      userActiveFlare={userActiveFlare}
    />
  );
}
