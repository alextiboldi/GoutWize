import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendCommentNotificationEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    // Auth: validate current user via cookies
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId, pollId } = body as { postId?: string; pollId?: string };

    let authorId: string;
    let title: string;
    let contentUrl: string;

    if (postId) {
      const { data: post } = await supabase
        .from("posts")
        .select("title, author_id")
        .eq("id", postId)
        .single();
      if (!post) return NextResponse.json(null, { status: 204 });
      authorId = post.author_id;
      title = post.title;
      contentUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://goutwize.com"}/post/${postId}`;
    } else if (pollId) {
      const { data: poll } = await supabase
        .from("polls")
        .select("question, author_id")
        .eq("id", pollId)
        .single();
      if (!poll) return NextResponse.json(null, { status: 204 });
      authorId = poll.author_id;
      title = poll.question;
      contentUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://goutwize.com"}/poll/${pollId}`;
    } else {
      return NextResponse.json({ error: "Missing postId or pollId" }, { status: 400 });
    }

    // Don't email yourself
    if (authorId === user.id) {
      return NextResponse.json(null, { status: 204 });
    }

    // Check author's email preferences and rate limit
    const { data: authorProfile } = await supabase
      .from("profiles")
      .select("email_notifications, last_emailed_at, username")
      .eq("id", authorId)
      .single();

    if (!authorProfile || !authorProfile.email_notifications) {
      return NextResponse.json(null, { status: 204 });
    }

    // Rate limit: skip if emailed in the last hour
    if (authorProfile.last_emailed_at) {
      const lastEmailed = new Date(authorProfile.last_emailed_at).getTime();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (lastEmailed > oneHourAgo) {
        return NextResponse.json(null, { status: 204 });
      }
    }

    // Get author's email via admin API
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(authorId);
    if (!authUser?.user?.email) {
      return NextResponse.json(null, { status: 204 });
    }

    // Get commenter's username
    const { data: commenterProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const commenterName = commenterProfile?.username ?? "Someone";

    await sendCommentNotificationEmail(
      authUser.user.email,
      title,
      commenterName,
      "", // No preview needed — keeps it simple
      contentUrl,
    );

    // Update last_emailed_at
    await supabaseAdmin
      .from("profiles")
      .update({ last_emailed_at: new Date().toISOString() })
      .eq("id", authorId);

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Comment notification email error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
