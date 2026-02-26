import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendReengagementEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://goutwize.com";
  const checkinUrl = `${appUrl}/checkin`;

  try {
    // Find users eligible for re-engagement:
    // - 3+ historical check-ins
    // - no check-in in 3+ days
    // - last_emailed_at is null or > 7 days ago
    // - email_notifications = true
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Find eligible profiles: email_notifications on, not emailed recently
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email_notifications", true)
      .or(`last_emailed_at.is.null,last_emailed_at.lt.${sevenDaysAgo}`)
      .limit(50);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ processed: 0 });
    }

    // Filter to users with 3+ check-ins and no recent check-in
    const users: { id: string }[] = [];
    for (const profile of profiles) {
      const { count } = await supabaseAdmin
        .from("checkins")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id);

      if ((count ?? 0) < 3) continue;

      const { data: recentCheckin } = await supabaseAdmin
        .from("checkins")
        .select("id")
        .eq("user_id", profile.id)
        .gte("created_at", threeDaysAgo)
        .limit(1);

      if (recentCheckin && recentCheckin.length > 0) continue;

      users.push(profile);
    }

    if (users.length === 0) {
      return NextResponse.json({ processed: 0 });
    }

    let processed = 0;

    for (const profile of users) {
      try {
        // Get email via admin API
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
          profile.id,
        );
        if (!authUser?.user?.email) continue;

        // Get streak via RPC
        const { data: streak } = await supabaseAdmin.rpc("get_checkin_streak", {
          p_user_id: profile.id,
        });

        await sendReengagementEmail(
          authUser.user.email,
          (streak as number) ?? 0,
          checkinUrl,
        );

        // Update last_emailed_at
        await supabaseAdmin
          .from("profiles")
          .update({ last_emailed_at: new Date().toISOString() })
          .eq("id", profile.id);

        processed++;
      } catch (err) {
        console.error(`Re-engagement email failed for ${profile.id}:`, err);
      }
    }

    return NextResponse.json({ processed });
  } catch (err) {
    console.error("Re-engagement cron error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
