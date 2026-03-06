import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  body: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  category: z.string().min(1).max(100),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  read_time: z.number().int().min(1),
  meta_description: z.string().min(1).max(160),
});

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.BOT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    const text = await request.text();
    rawBody = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = articleSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { title, body, excerpt, category, image_url, tags, read_time, meta_description } = parsed.data;
  const slug = parsed.data.slug ?? slugify(title);

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({
      id: crypto.randomUUID(),
      slug,
      title: title.trim(),
      body: body.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
      image_url: image_url ?? null,
      tags,
      read_time,
      meta_description: meta_description.trim(),
      updated_at: new Date().toISOString(),
    })
    .select("id, slug, title, published_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 },
      );
    }
    console.error("Bot article insert error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }

  return NextResponse.json({ article: data }, { status: 201 });
}
