"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import { UpvoteButton } from "@/components/app/upvote-button";

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  category: string;
  authorUsername: string;
  createdAt: string;
  commentCount: number;
  upvotes: number;
  hasVoted: boolean;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function PostCard({
  id,
  title,
  body,
  category,
  authorUsername,
  createdAt,
  commentCount,
  upvotes,
  hasVoted,
}: PostCardProps) {
  const router = useRouter();
  const cat = POST_CATEGORIES.find((c) => c.value === category);
  const truncatedBody =
    body.length > 100 ? body.slice(0, 100).trimEnd() + "\u2026" : body;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/post/${id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/post/${id}`);
        }
      }}
      className="block bg-white rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {cat && (
        <span className="inline-block bg-gw-bg-light text-gw-navy text-xs font-medium px-2.5 py-1 rounded-full mb-2">
          {cat.emoji} {cat.label}
        </span>
      )}

      <h3 className="font-bold text-[15px] text-gw-navy leading-snug">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gw-text-gray leading-relaxed">
        {truncatedBody}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-gw-text-gray">
        <span className="font-medium">{authorUsername}</span>
        <span>&middot;</span>
        <span>{timeAgo(createdAt)}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {commentCount}
          </span>
          <UpvoteButton
            postId={id}
            initialUpvotes={upvotes}
            initialVoted={hasVoted}
          />
        </span>
      </div>
    </div>
  );
}
