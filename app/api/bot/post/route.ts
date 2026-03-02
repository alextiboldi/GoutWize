import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BOT_USER_ID = "00000000-0000-0000-0000-00000000b070";

const VALID_CATEGORIES = [
  "general",
  "has_anyone_tried",
  "why_do_i",
  "what_would_you_do",
  "just_venting",
  "tip",
] as const;

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, body: postBody, category } = body as {
    title?: string;
    body?: string;
    category?: string;
  };

  if (!title?.trim() || !postBody?.trim()) {
    return NextResponse.json(
      { error: "title and body are required" },
      { status: 400 },
    );
  }

  const postCategory = category ?? "general";
  if (!VALID_CATEGORIES.includes(postCategory as (typeof VALID_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      id: crypto.randomUUID(),
      author_id: BOT_USER_ID,
      title: title.trim(),
      body: postBody.trim(),
      category: postCategory,
      updated_at: new Date().toISOString(),
    })
    .select("id, title, category, created_at")
    .single();

  if (error) {
    console.error("Bot post insert error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
