"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Search, Sparkles } from "lucide-react";
import type { Insight } from "@/lib/types";
import { PostCard } from "@/components/app/post-card";
import { PollCard, type PollOptionRow } from "@/components/app/poll-card";
import { InstallPrompt } from "@/components/app/install-prompt";
import { POST_CATEGORIES, FLARE_JOINTS } from "@/lib/constants";

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

export interface PollRow {
  id: string;
  question: string;
  comment_count: number;
  created_at: string;
  author_id: string;
  profiles: { username: string };
  poll_options: PollOptionRow[];
}

export interface PollVoteRow {
  poll_id: string;
  option_id: string;
}

type FeedItem =
  | { type: "post"; data: PostRow }
  | { type: "poll"; data: PollRow };

interface UserActiveFlare {
  id: string;
  joint: string;
  severity: number;
}

interface FeedClientProps {
  checkedInToday: boolean;
  activeFlareCount: number;
  posts: PostRow[];
  polls: PollRow[];
  randomInsight: Insight;
  votedPostIds: string[];
  userPollVotes: PollVoteRow[];
  checkinStreak: number;
  userActiveFlare: UserActiveFlare | null;
}

export default function FeedClient({
  checkedInToday,
  activeFlareCount,
  posts,
  polls,
  randomInsight,
  votedPostIds,
  userPollVotes,
  checkinStreak,
  userActiveFlare,
}: FeedClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "discussed">("newest");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput.trim().toLowerCase());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const feedItems = useMemo(() => {
    // Build merged feed items
    let items: FeedItem[] = [
      ...posts.map((p) => ({ type: "post" as const, data: p })),
      ...polls.map((p) => ({ type: "poll" as const, data: p })),
    ];

    // Category filter: hide polls when category is active (polls have no category)
    if (activeCategory) {
      items = items.filter(
        (item) =>
          item.type === "post" && item.data.category === activeCategory,
      );
    }

    // Search filter: match post title/body or poll question
    if (searchQuery) {
      items = items.filter((item) => {
        if (item.type === "post") {
          return (
            item.data.title.toLowerCase().includes(searchQuery) ||
            item.data.body.toLowerCase().includes(searchQuery)
          );
        }
        return item.data.question.toLowerCase().includes(searchQuery);
      });
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === "discussed") {
        return (
          ("comment_count" in b.data ? b.data.comment_count : 0) -
          ("comment_count" in a.data ? a.data.comment_count : 0)
        );
      }
      return (
        new Date(b.data.created_at).getTime() -
        new Date(a.data.created_at).getTime()
      );
    });

    return items;
  }, [posts, polls, activeCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* User active flare banner */}
      {userActiveFlare && (
        <Link
          href={`/flare/${userActiveFlare.id}`}
          className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-gw-orange/10 rounded-2xl p-4 border-l-4 border-red-400 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gw-navy">
              You&apos;re flaring &mdash;{" "}
              {FLARE_JOINTS.find((j) => j.value === userActiveFlare.joint)?.label ?? userActiveFlare.joint}
              , severity {userActiveFlare.severity}
            </p>
            <p className="text-xs text-gw-text-gray">
              How are you now? Update &rarr;
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gw-text-gray shrink-0" />
        </Link>
      )}

      {/* Greeting */}
      <div className="pt-2">
        <h1 className="font-heading text-2xl font-bold text-gw-navy">
          Your Feed
        </h1>
      </div>

      {/* Install prompt */}
      <InstallPrompt />

      {/* Check-in nudge or streak card */}
      {!checkedInToday ? (
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
      ) : (
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border-l-4 border-gw-orange">
          <div className="w-10 h-10 bg-gw-orange/10 rounded-full flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-gw-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gw-navy">
              {checkinStreak <= 1
                ? "First check-in today! Start building your streak."
                : `${checkinStreak}-day check-in streak!`}
            </p>
            <p className="text-xs text-gw-text-gray">
              {checkinStreak <= 1
                ? "Come back tomorrow to keep it going"
                : "Keep it up — consistency is key"}
            </p>
          </div>
        </div>
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

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gw-text-gray/50" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gw-border rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === null
                ? "bg-gw-blue text-white"
                : "bg-gw-bg-light text-gw-navy hover:bg-gw-bg-mid"
            }`}
          >
            All
          </button>
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.value ? null : cat.value,
                )
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.value
                  ? "bg-gw-blue text-white"
                  : "bg-gw-bg-light text-gw-navy hover:bg-gw-bg-mid"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <div className="flex gap-1 mb-3 bg-gw-bg-light rounded-lg p-0.5 w-fit">
          <button
            type="button"
            onClick={() => setSortBy("newest")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              sortBy === "newest"
                ? "bg-white text-gw-navy shadow-sm"
                : "text-gw-text-gray hover:text-gw-navy"
            }`}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => setSortBy("discussed")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              sortBy === "discussed"
                ? "bg-white text-gw-navy shadow-sm"
                : "text-gw-text-gray hover:text-gw-navy"
            }`}
          >
            Most discussed
          </button>
        </div>

        {feedItems.length > 0 ? (
          <div className="space-y-3">
            {feedItems.map((item) =>
              item.type === "post" ? (
                <PostCard
                  key={`post-${item.data.id}`}
                  id={item.data.id}
                  title={item.data.title}
                  body={item.data.body}
                  category={item.data.category}
                  authorUsername={item.data.profiles?.username ?? "Anonymous"}
                  createdAt={item.data.created_at}
                  commentCount={item.data.comment_count}
                  upvotes={item.data.upvotes}
                  hasVoted={votedPostIds.includes(item.data.id)}
                />
              ) : (
                <PollCard
                  key={`poll-${item.data.id}`}
                  id={item.data.id}
                  question={item.data.question}
                  authorUsername={item.data.profiles?.username ?? "Anonymous"}
                  createdAt={item.data.created_at}
                  commentCount={item.data.comment_count}
                  options={item.data.poll_options ?? []}
                  votedOptionId={
                    userPollVotes.find((v) => v.poll_id === item.data.id)
                      ?.option_id ?? null
                  }
                />
              ),
            )}
          </div>
        ) : activeCategory ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-semibold text-gw-navy">No posts in this category</p>
            <p className="mt-1 text-sm text-gw-text-gray">
              Try a different filter or start a new discussion!
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="inline-block mt-4 bg-gw-blue text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gw-blue-dark transition-colors"
            >
              Show All
            </button>
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
