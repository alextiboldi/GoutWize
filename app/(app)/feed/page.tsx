import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seedInsights } from "@/lib/seed-data";
import FeedClient, { type PostRow } from "./feed-client";

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

  const [checkinRes, flareRes, postsRes, votesRes] = await Promise.all([
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
  ]);

  const randomInsight = pickRandomInsight();
  const votedPostIds = (votesRes.data ?? []).map((v) => v.post_id as string);

  return (
    <FeedClient
      checkedInToday={!!checkinRes.data}
      activeFlareCount={flareRes.count ?? 0}
      posts={(postsRes.data as unknown as PostRow[]) ?? []}
      randomInsight={randomInsight}
      votedPostIds={votedPostIds}
    />
  );
}
