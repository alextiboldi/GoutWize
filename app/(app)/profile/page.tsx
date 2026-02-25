import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient, {
  type ProfileData,
  type Stats,
} from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, flaresRes, checkinsRes, commentsRes, streakRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, gout_duration, flare_frequency, approach, reason")
      .eq("id", user.id)
      .single(),
    supabase
      .from("flares")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("checkins")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id),
    supabase.rpc("get_checkin_streak", { p_user_id: user.id }),
  ]);

  if (!profileRes.data) redirect("/onboarding");

  const stats: Stats = {
    flares: flaresRes.count ?? 0,
    checkins: checkinsRes.count ?? 0,
    comments: commentsRes.count ?? 0,
    currentStreak: (streakRes.data as number) ?? 0,
  };

  return (
    <ProfileClient
      profile={profileRes.data as ProfileData}
      stats={stats}
    />
  );
}
