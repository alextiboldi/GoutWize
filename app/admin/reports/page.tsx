import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminReportsClient, { type ReportRow } from "./admin-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUsername(profiles: any): string {
  if (!profiles) return "Unknown";
  if (Array.isArray(profiles)) return profiles[0]?.username ?? "Unknown";
  return profiles.username ?? "Unknown";
}

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") ?? [];
  if (!adminIds.includes(user.id)) redirect("/feed");

  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { data: reports } = await supabase
    .from("reports")
    .select(
      "id, reporter_id, post_id, comment_id, reason, details, status, created_at, profiles!reports_reporter_id_fkey(username)"
    )
    .order("created_at", { ascending: false });

  // Fetch related post/comment content for previews
  const postIds = (reports ?? []).filter((r) => r.post_id).map((r) => r.post_id!);
  const commentIds = (reports ?? []).filter((r) => r.comment_id).map((r) => r.comment_id!);

  const [postsRes, commentsRes] = await Promise.all([
    postIds.length > 0
      ? supabase.from("posts").select("id, title, body, author_id, profiles(username)").in("id", postIds)
      : { data: [] },
    commentIds.length > 0
      ? supabase.from("comments").select("id, body, author_id, profiles(username)").in("id", commentIds)
      : { data: [] },
  ]);

  const postsMap = new Map(
    (postsRes.data ?? []).map((p) => [p.id, p])
  );
  const commentsMap = new Map(
    (commentsRes.data ?? []).map((c) => [c.id, c])
  );

  const enrichedReports: ReportRow[] = (reports ?? []).map((r) => {
    const post = r.post_id ? postsMap.get(r.post_id) : null;
    const comment = r.comment_id ? commentsMap.get(r.comment_id) : null;
    return {
      id: r.id,
      reporter_id: r.reporter_id,
      post_id: r.post_id,
      comment_id: r.comment_id,
      reason: r.reason,
      details: r.details,
      status: r.status,
      created_at: r.created_at,
      reporter_username: extractUsername(r.profiles),
      content_preview: post
        ? post.title ?? post.body?.slice(0, 120)
        : comment
          ? comment.body?.slice(0, 120)
          : "[Deleted content]",
      content_author: post
        ? extractUsername(post.profiles)
        : comment
          ? extractUsername(comment.profiles)
          : "Unknown",
      content_author_id: post?.author_id ?? comment?.author_id ?? null,
    };
  });

  return (
    <div className="min-h-screen bg-gw-bg-light">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1 text-sm text-gw-orange font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>
        <h1 className="font-heading text-2xl font-bold text-gw-navy mb-2">
          Admin &mdash; Reports
        </h1>
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl font-bold text-gw-navy">{userCount ?? 0}</span>
          <span className="text-sm text-gw-text-gray">registered users</span>
        </div>
        <AdminReportsClient reports={enrichedReports} />
      </div>
    </div>
  );
}
