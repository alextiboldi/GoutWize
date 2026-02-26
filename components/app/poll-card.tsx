"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Check, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

export interface PollOptionRow {
  id: string;
  label: string;
  vote_count: number;
  display_order: number;
}

export interface PollCardProps {
  id: string;
  question: string;
  authorUsername: string;
  createdAt: string;
  commentCount: number;
  options: PollOptionRow[];
  votedOptionId: string | null;
}

export function PollCard({
  id,
  question,
  authorUsername,
  createdAt,
  commentCount,
  options: initialOptions,
  votedOptionId: initialVotedOptionId,
}: PollCardProps) {
  const router = useRouter();
  const [options, setOptions] = useState(initialOptions);
  const [votedOptionId, setVotedOptionId] = useState(initialVotedOptionId);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = options.reduce((sum, o) => sum + o.vote_count, 0);
  const hasVoted = votedOptionId !== null;

  async function handleVote(optionId: string) {
    if (hasVoted || isVoting) return;
    setIsVoting(true);

    // Optimistic update
    setVotedOptionId(optionId);
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId ? { ...o, vote_count: o.vote_count + 1 } : o,
      ),
    );

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("cast_poll_vote", {
        p_poll_id: id,
        p_option_id: optionId,
      });

      if (error) {
        // Revert optimistic update
        setVotedOptionId(null);
        setOptions(initialOptions);
        console.error("Vote error:", error);
      } else if (data) {
        // Use server response
        setOptions(data.options);
        setVotedOptionId(data.voted_option_id);
      }
    } catch {
      setVotedOptionId(null);
      setOptions(initialOptions);
    } finally {
      setIsVoting(false);
    }
  }

  function handleCardClick(e: React.MouseEvent) {
    // Don't navigate if clicking a vote button
    if ((e.target as HTMLElement).closest("[data-vote-button]")) return;
    router.push(`/poll/${id}`);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/poll/${id}`);
        }
      }}
      className="block bg-white rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Poll badge */}
      <span className="inline-flex items-center gap-1 bg-gw-blue/10 text-gw-blue text-xs font-medium px-2.5 py-1 rounded-full mb-2">
        <BarChart3 className="w-3 h-3" />
        Poll
      </span>

      {/* Question */}
      <h3 className="font-bold text-[15px] text-gw-navy leading-snug">
        {question}
      </h3>

      {/* Options */}
      <div className="mt-3 space-y-2">
        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="voting"
              initial={false}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {[...options]
                .sort((a, b) => a.display_order - b.display_order)
                .map((option) => (
                  <button
                    key={option.id}
                    data-vote-button
                    onClick={() => handleVote(option.id)}
                    disabled={isVoting}
                    className="w-full text-left px-4 py-2.5 rounded-xl border-2 border-gw-border text-sm font-medium text-gw-navy hover:border-gw-blue hover:bg-gw-blue/5 transition-all disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {[...options]
                .sort((a, b) => a.display_order - b.display_order)
                .map((option) => {
                  const pct =
                    totalVotes > 0
                      ? Math.round((option.vote_count / totalVotes) * 100)
                      : 0;
                  const isUserChoice = option.id === votedOptionId;

                  return (
                    <div
                      key={option.id}
                      className={`relative overflow-hidden rounded-xl px-4 py-2.5 ${
                        isUserChoice
                          ? "border-l-4 border-gw-blue bg-gw-blue/5"
                          : "bg-gw-bg-light"
                      }`}
                    >
                      {/* Background fill bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-gw-blue/10 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                      {/* Content */}
                      <div className="relative flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gw-navy">
                          {isUserChoice && (
                            <Check className="w-3.5 h-3.5 text-gw-blue" />
                          )}
                          {option.label}
                        </span>
                        <span className="text-xs font-semibold text-gw-text-gray">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              <p className="text-xs text-gw-text-gray pt-1">
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center gap-3 text-xs text-gw-text-gray">
        <span className="font-medium">{authorUsername}</span>
        <span>&middot;</span>
        <span>{timeAgo(createdAt)}</span>
        <span className="ml-auto flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          {commentCount}
        </span>
      </div>
    </div>
  );
}
