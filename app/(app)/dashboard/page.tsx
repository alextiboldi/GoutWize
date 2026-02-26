import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient, {
  type CheckinRow,
  type FlareRow,
} from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get last 30 days date range
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fromDate = thirtyDaysAgo.toISOString().split("T")[0];

  const [checkinsRes, allCheckinsCountRes, flaresRes, streakRes] =
    await Promise.all([
      // Last 30 days of checkins
      supabase
        .from("checkins")
        .select("id, date, mood, hydration, alcohol, stress")
        .eq("user_id", user.id)
        .gte("date", fromDate)
        .order("date", { ascending: true }),
      // Total checkin count (to decide if we show dashboard)
      supabase
        .from("checkins")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      // All flares for correlation analysis
      supabase
        .from("flares")
        .select("id, joint, severity, status, started_at, resolved_at")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false }),
      supabase.rpc("get_checkin_streak", { p_user_id: user.id }),
    ]);

  // Also fetch ALL checkins for flare correlation (not just last 30 days)
  const { data: allCheckins } = await supabase
    .from("checkins")
    .select("id, date, mood, hydration, alcohol, stress")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const totalCheckins = allCheckinsCountRes.count ?? 0;

  return (
    <DashboardClient
      recentCheckins={(checkinsRes.data as unknown as CheckinRow[]) ?? []}
      allCheckins={(allCheckins as unknown as CheckinRow[]) ?? []}
      flares={(flaresRes.data as unknown as FlareRow[]) ?? []}
      totalCheckins={totalCheckins}
      checkinStreak={(streakRes.data as number) ?? 0}
    />
  );
}
