import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { seedPosts } from "@/lib/seed-posts";
import { seedPolls } from "@/lib/seed-polls";

export { seed as GET, seed as POST };

async function seed() {
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

  const results = { posts: 0, comments: 0, polls: 0, errors: [] as string[] };

  for (const seedPost of seedPosts) {
    // Insert post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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

  // Seed polls
  for (const seedPoll of seedPolls) {
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        id: crypto.randomUUID(),
        author_id: user.id,
        question: seedPoll.question,
      })
      .select("id")
      .single();

    if (pollError) {
      results.errors.push(
        `Poll "${seedPoll.question}": ${pollError.message}`,
      );
      continue;
    }

    const optionRows = seedPoll.options.map((label, i) => ({
      id: crypto.randomUUID(),
      poll_id: poll.id,
      label,
      display_order: i,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionRows);

    if (optionsError) {
      results.errors.push(
        `Poll options for "${seedPoll.question}": ${optionsError.message}`,
      );
    } else {
      results.polls++;
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.posts} posts, ${results.comments} comments, and ${results.polls} polls`,
    ...results,
  });
}
