import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { seedPosts } from "@/lib/seed-posts";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if posts already exist to prevent double-seeding
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id);

  if (count && count >= 10) {
    return NextResponse.json(
      { error: "Posts already seeded", count },
      { status: 409 },
    );
  }

  const results = { posts: 0, comments: 0, errors: [] as string[] };

  for (const seedPost of seedPosts) {
    // Insert post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        title: seedPost.title,
        body: seedPost.body,
        category: seedPost.category,
        upvotes: seedPost.upvotes,
        comment_count: seedPost.comments.length,
      })
      .select("id")
      .single();

    if (postError) {
      results.errors.push(`Post "${seedPost.title}": ${postError.message}`);
      continue;
    }

    results.posts++;

    // Insert comments for this post
    for (const seedComment of seedPost.comments) {
      const { error: commentError } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          author_id: user.id,
          body: seedComment.body,
          tried_it: seedComment.tried_it,
          upvotes: seedComment.upvotes,
        });

      if (commentError) {
        results.errors.push(
          `Comment on "${seedPost.title}": ${commentError.message}`,
        );
      } else {
        results.comments++;
      }
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.posts} posts and ${results.comments} comments`,
    ...results,
  });
}
