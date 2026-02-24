"use client";

import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import type { Insight } from "@/lib/types";
import { PostCard } from "@/components/app/post-card";

export interface PostRow {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  profiles: { username: string };
}

interface FeedClientProps {
  checkedInToday: boolean;
  activeFlareCount: number;
  posts: PostRow[];
  randomInsight: Insight;
  votedPostIds: string[];
}

export default function FeedClient({
  checkedInToday,
  activeFlareCount,
  posts,
  randomInsight,
  votedPostIds,
}: FeedClientProps) {

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div className="pt-2">
        <h1 className="font-heading text-2xl font-bold text-gw-navy">
          Your Feed
        </h1>
      </div>

      {/* Check-in nudge */}
      {!checkedInToday && (
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
                hasVoted={votedPostIds.includes(post.id)}
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
