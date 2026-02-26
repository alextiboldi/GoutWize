import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient, {
  type ProfileData,
  type Stats,
  type FlareHistoryRow,
} from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, flaresRes, checkinsRes, commentsRes, streakRes, flareHistoryRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, gout_duration, flare_frequency, approach, reason, longest_streak, email_notifications")
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
    supabase
      .from("flares")
      .select("id, joint, severity, status, started_at, resolved_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(20),
  ]);

  if (!profileRes.data) redirect("/onboarding");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];
  const isAdmin = adminIds.includes(user.id);

  const stats: Stats = {
    flares: flaresRes.count ?? 0,
    checkins: checkinsRes.count ?? 0,
    comments: commentsRes.count ?? 0,
    currentStreak: (streakRes.data as number) ?? 0,
    longestStreak: (profileRes.data as unknown as { longest_streak: number }).longest_streak ?? 0,
  };

  const emailNotifications = (profileRes.data as unknown as { email_notifications: boolean }).email_notifications ?? true;

  return (
    <ProfileClient
      profile={profileRes.data as ProfileData}
      stats={stats}
      flareHistory={(flareHistoryRes.data as unknown as FlareHistoryRow[]) ?? []}
      isAdmin={isAdmin}
      emailNotifications={emailNotifications}
    />
  );
}
