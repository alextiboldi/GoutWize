"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { seedInsights } from "@/lib/seed-data";
import { PostCard } from "@/components/app/post-card";

interface PostRow {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  profiles: { username: string };
}

export default function FeedPage() {
  const [checkedInToday, setCheckedInToday] = useState<boolean | null>(null);
  const [activeFlareCount, setActiveFlareCount] = useState(0);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [randomInsight, setRandomInsight] = useState(seedInsights[0]);

  useEffect(() => {
    setRandomInsight(seedInsights[Math.floor(Math.random() * seedInsights.length)]);
  }, []);

  useEffect(() => {
    async function loadFeed() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const today = new Date().toISOString().split("T")[0];

      const [checkinRes, flareRes, postsRes] = await Promise.all([
        supabase
          .from("checkins")
          .select("id")
          .eq("user_id", user.id)
          .eq("date", today)
          .maybeSingle(),
        supabase
          .from("flares")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("posts")
          .select("id, title, body, category, upvotes, comment_count, created_at, profiles(username)")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      setCheckedInToday(!!checkinRes.data);
      setActiveFlareCount(flareRes.count ?? 0);
      setPosts((postsRes.data as unknown as PostRow[]) ?? []);
    }

    loadFeed();
  }, []);

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div className="pt-2">
        <h1 className="font-heading text-2xl font-bold text-gw-navy">
          Your Feed
        </h1>
      </div>

      {/* Check-in nudge */}
      {checkedInToday === false && (
        <Link
          href="/checkin"
          className="flex items-center gap-3 bg-white rounded-2xl p-4 border-l-4 border-gw-blue hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-gw-blue/10 rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-gw-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gw-navy">
              How are you today?
            </p>
            <p className="text-xs text-gw-text-gray">
              Complete your 10-second check-in
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gw-text-gray shrink-0" />
        </Link>
      )}

      {/* Insight card */}
      <div className="bg-white rounded-2xl p-4 border-l-4 border-gw-gold">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{randomInsight.icon}</span>
          <div>
            <p className="text-sm text-gw-navy">
              <span className="font-bold text-gw-blue">
                {randomInsight.stat}
              </span>{" "}
              {randomInsight.text}
            </p>
            <p className="mt-1 text-[11px] text-gw-text-gray/60">
              {randomInsight.source}
            </p>
          </div>
        </div>
      </div>

      {/* Active flares banner */}
      {activeFlareCount > 0 && (
        <Link
          href="/flare"
          className="flex items-center gap-3 bg-gradient-to-r from-gw-orange/10 to-red-50 rounded-2xl p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-gw-orange/20 rounded-full flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-gw-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gw-navy">
              {activeFlareCount} member{activeFlareCount !== 1 && "s"} flaring
              right now
            </p>
            <p className="text-xs text-gw-text-gray">Send support</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gw-text-gray shrink-0" />
        </Link>
      )}

      {/* Discussion list */}
      <div>
        <h2 className="font-heading text-lg font-bold text-gw-navy mb-3">
          Discussions
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                body={post.body}
                category={post.category}
                authorUsername={post.profiles?.username ?? "Anonymous"}
                createdAt={post.created_at}
                commentCount={post.comment_count}
                upvotes={post.upvotes}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">💬</p>
            <p className="font-semibold text-gw-navy">No discussions yet</p>
            <p className="mt-1 text-sm text-gw-text-gray">
              Be the first to start a conversation!
            </p>
            <Link
              href="/post/new"
              className="inline-block mt-4 bg-gw-blue text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gw-blue-dark transition-colors"
            >
              Create a Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
