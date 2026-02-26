"use client";

import { useMemo } from "react";

interface TriedItCounts {
  worked: number;
  didnt_work: number;
  mixed: number;
}

interface TriedItSummaryProps {
  counts: TriedItCounts;
  variant?: "full" | "mini";
}

export function TriedItSummary({
  counts,
  variant = "full",
}: TriedItSummaryProps) {
  const total = counts.worked + counts.didnt_work + counts.mixed;

  const segments = useMemo(() => {
    if (total === 0) return [];
    return [
      {
        key: "worked",
        label: "worked",
        emoji: "\u2705",
        count: counts.worked,
        pct: Math.round((counts.worked / total) * 100),
        color: "bg-green-400",
      },
      {
        key: "mixed",
        label: "mixed",
        emoji: "\u26a0\ufe0f",
        count: counts.mixed,
        pct: Math.round((counts.mixed / total) * 100),
        color: "bg-yellow-400",
      },
      {
        key: "didnt_work",
        label: "didn\u2019t work",
        emoji: "\u274c",
        count: counts.didnt_work,
        pct: Math.round((counts.didnt_work / total) * 100),
        color: "bg-red-400",
      },
    ].filter((s) => s.count > 0);
  }, [counts, total]);

  if (total < 3) return null;

  if (variant === "mini") {
    return (
      <div className="flex items-center gap-2 text-[11px] text-gw-text-gray mt-1.5">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-0.5">
            {s.emoji} {s.count}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gw-bg-light rounded-xl p-4 mb-3">
      <p className="text-xs font-semibold text-gw-navy mb-2">
        {total} members shared their experience:
      </p>
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-2">
        {segments.map((s) => (
          <div
            key={s.key}
            className={`${s.color} transition-all duration-300`}
            style={{ width: `${s.pct}%` }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex items-center gap-3 text-[11px] text-gw-text-gray">
        {segments.map((s) => (
          <span key={s.key}>
            {s.emoji} {s.count} {s.label} ({s.pct}%)
          </span>
        ))}
      </div>
    </div>
  );
}

/** Helper to compute counts from an array of tried_it values */
export function computeTriedItCounts(
  triedItValues: (string | null)[],
): TriedItCounts {
  const counts: TriedItCounts = { worked: 0, didnt_work: 0, mixed: 0 };
  for (const v of triedItValues) {
    if (v === "worked") counts.worked++;
    else if (v === "didnt_work") counts.didnt_work++;
    else if (v === "mixed") counts.mixed++;
  }
  return counts;
}
