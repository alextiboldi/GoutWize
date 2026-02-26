"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Search,
  Flame,
  Droplets,
  Wine,
  Brain,
} from "lucide-react";
import { FLARE_JOINTS } from "@/lib/constants";

export interface CheckinRow {
  id: string;
  date: string;
  mood: string;
  hydration: string;
  alcohol: string;
  stress: number;
}

export interface FlareRow {
  id: string;
  joint: string;
  severity: number;
  status: string;
  started_at: string;
  resolved_at: string | null;
}

interface DashboardClientProps {
  recentCheckins: CheckinRow[];
  allCheckins: CheckinRow[];
  flares: FlareRow[];
  totalCheckins: number;
  checkinStreak: number;
}

// -- Helpers --

function getMoodColor(mood: string): string {
  switch (mood) {
    case "good":
      return "bg-green-400";
    case "okay":
      return "bg-yellow-400";
    case "bad":
      return "bg-red-400";
    default:
      return "bg-gw-bg-mid";
  }
}

function getMoodBorderColor(mood: string): string {
  switch (mood) {
    case "good":
      return "ring-green-400/40";
    case "okay":
      return "ring-yellow-400/40";
    case "bad":
      return "ring-red-400/40";
    default:
      return "";
  }
}

function daysBetween(a: Date, b: Date): number {
  return Math.round(
    Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24),
  );
}

// -- Component --

export default function DashboardClient({
  recentCheckins,
  allCheckins,
  flares,
  totalCheckins,
  checkinStreak,
}: DashboardClientProps) {
  // If fewer than 3 checkins, show encouragement
  if (totalCheckins < 3) {
    const remaining = 3 - totalCheckins;
    return (
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-gw-text-gray hover:text-gw-navy transition-colors mb-4 pt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="bg-white rounded-2xl p-8 text-center mt-4">
          <div className="w-16 h-16 bg-gw-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gw-blue" />
          </div>
          <h1 className="font-heading text-xl font-bold text-gw-navy">
            Almost there!
          </h1>
          <p className="text-sm text-gw-text-gray mt-2 leading-relaxed">
            Complete {remaining} more check-in{remaining !== 1 ? "s" : ""} to
            start seeing your patterns. You&apos;re {totalCheckins} of 3!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < totalCheckins
                    ? "bg-gw-green text-white"
                    : "bg-gw-bg-light text-gw-text-gray"
                }`}
              >
                {i < totalCheckins ? "\u2713" : i + 1}
              </div>
            ))}
          </div>
          <Link
            href="/checkin"
            className="inline-block mt-6 bg-gw-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gw-blue-dark transition-colors"
          >
            Check in now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gw-text-gray hover:text-gw-navy transition-colors mb-4 pt-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-4">
        My Dashboard
      </h1>

      {/* Flare-free streak */}
      <FlareStreakCard flares={flares} />

      {/* Check-in history grid */}
      <CheckinGrid checkins={recentCheckins} />

      {/* Flare correlations */}
      <FlareCorrelations allCheckins={allCheckins} flares={flares} />
    </div>
  );
}

// ===== Flare-Free Streak Card (Story 21.4) =====

function FlareStreakCard({ flares }: { flares: FlareRow[] }) {
  const { flareFreedays, personalBest } = useMemo(() => {
    // Find most recent resolved or active flare
    const resolvedFlares = flares.filter((f) => f.resolved_at);
    if (resolvedFlares.length === 0 && flares.length === 0) {
      return { flareFreedays: 0, personalBest: 0 };
    }

    // Current streak: days since last flare resolved
    const now = new Date();
    let flareFreedays = 0;

    if (resolvedFlares.length > 0) {
      // Sort by resolved_at desc
      const sorted = [...resolvedFlares].sort(
        (a, b) =>
          new Date(b.resolved_at!).getTime() -
          new Date(a.resolved_at!).getTime(),
      );
      // Check if there's an active flare — if so, streak is 0
      const hasActive = flares.some((f) => f.status === "active");
      if (hasActive) {
        flareFreedays = 0;
      } else {
        flareFreedays = daysBetween(now, new Date(sorted[0].resolved_at!));
      }
    }

    // Personal best: longest gap between resolved_at and next started_at
    let personalBest = flareFreedays;
    if (resolvedFlares.length >= 2) {
      const allSorted = [...flares].sort(
        (a, b) =>
          new Date(a.started_at).getTime() - new Date(b.started_at).getTime(),
      );
      for (let i = 0; i < allSorted.length - 1; i++) {
        if (allSorted[i].resolved_at) {
          const gap = daysBetween(
            new Date(allSorted[i].resolved_at!),
            new Date(allSorted[i + 1].started_at),
          );
          personalBest = Math.max(personalBest, gap);
        }
      }
    }

    return { flareFreedays, personalBest };
  }, [flares]);

  if (flares.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gw-green/10 rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-gw-green" />
          </div>
          <div>
            <p className="font-semibold text-gw-navy">No flares logged</p>
            <p className="text-xs text-gw-text-gray mt-0.5">
              Tracking your clear days starts when you log your first flare.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pct =
    personalBest > 0
      ? Math.min(100, Math.round((flareFreedays / personalBest) * 100))
      : 100;

  return (
    <div className="bg-white rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gw-green/10 rounded-full flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-gw-green" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gw-navy">
            {flareFreedays}
            <span className="text-base font-medium text-gw-text-gray ml-1.5">
              days flare-free
            </span>
          </p>
          {personalBest > 0 && (
            <p className="text-xs text-gw-text-gray">
              Personal best: {personalBest} days
            </p>
          )}
        </div>
      </div>
      {/* Progress bar */}
      {personalBest > 0 && (
        <div className="w-full h-2.5 bg-gw-bg-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gw-green rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ===== Check-in History Grid (Story 21.2) =====

function CheckinGrid({ checkins }: { checkins: CheckinRow[] }) {
  const days = useMemo(() => {
    const now = new Date();
    const grid: Array<{
      date: string;
      dayLabel: string;
      mood: string | null;
      hasFlare: boolean;
    }> = [];

    // Build a map for quick lookup
    const checkinMap = new Map<string, CheckinRow>();
    for (const c of checkins) {
      checkinMap.set(c.date, c);
    }

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const checkin = checkinMap.get(dateStr);

      grid.push({
        date: dateStr,
        dayLabel: d.getDate().toString(),
        mood: checkin?.mood ?? null,
        hasFlare: false, // Will be set by parent if needed
      });
    }

    return grid;
  }, [checkins]);

  return (
    <div className="bg-white rounded-2xl p-5 mb-4">
      <h2 className="font-semibold text-sm text-gw-navy mb-3">
        Last 30 Days
      </h2>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="relative flex flex-col items-center"
            title={`${day.date}: ${day.mood ?? "No check-in"}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-medium ${
                day.mood
                  ? `${getMoodColor(day.mood)} text-white ring-2 ${getMoodBorderColor(day.mood)}`
                  : "bg-gw-bg-light text-gw-text-gray/40"
              }`}
            >
              {day.dayLabel}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-gw-text-gray">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-400" /> Good
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-400" /> Okay
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400" /> Bad
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gw-bg-light" /> No data
        </span>
      </div>
    </div>
  );
}

// ===== Flare Correlations (Story 21.3) =====

interface Correlation {
  factor: string;
  icon: React.ReactNode;
  count: number;
  total: number;
  overallPct: number;
  severity: "strong" | "possible";
}

function FlareCorrelations({
  allCheckins,
  flares,
}: {
  allCheckins: CheckinRow[];
  flares: FlareRow[];
}) {
  const correlations = useMemo(() => {
    // Need at least 2 flares to show correlations
    if (flares.length < 2 || allCheckins.length < 3) return [];

    const checkinMap = new Map<string, CheckinRow>();
    for (const c of allCheckins) {
      checkinMap.set(c.date, c);
    }

    // For each flare, get check-ins from the 7 days before it started
    const preFlareCheckins: CheckinRow[][] = [];

    for (const flare of flares) {
      const flareDate = new Date(flare.started_at);
      const preFlareDays: CheckinRow[] = [];

      for (let i = 1; i <= 7; i++) {
        const d = new Date(flareDate);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const checkin = checkinMap.get(dateStr);
        if (checkin) preFlareDays.push(checkin);
      }

      if (preFlareDays.length > 0) {
        preFlareCheckins.push(preFlareDays);
      }
    }

    if (preFlareCheckins.length < 2) return [];

    const flaresWithData = preFlareCheckins.length;

    // Aggregate pre-flare factors
    let preFlareHighStress = 0;
    let preFlareHeavyAlcohol = 0;
    let preFlareLowHydration = 0;
    let preFlareBadMood = 0;

    for (const days of preFlareCheckins) {
      if (days.some((d) => d.stress >= 4)) preFlareHighStress++;
      if (days.some((d) => d.alcohol === "heavy")) preFlareHeavyAlcohol++;
      if (days.some((d) => d.hydration === "low")) preFlareLowHydration++;
      if (days.some((d) => d.mood === "bad")) preFlareBadMood++;
    }

    // Overall averages (all check-ins)
    const total = allCheckins.length;
    const overallHighStressPct =
      (allCheckins.filter((c) => c.stress >= 4).length / total) * 100;
    const overallHeavyAlcoholPct =
      (allCheckins.filter((c) => c.alcohol === "heavy").length / total) * 100;
    const overallLowHydrationPct =
      (allCheckins.filter((c) => c.hydration === "low").length / total) * 100;
    const overallBadMoodPct =
      (allCheckins.filter((c) => c.mood === "bad").length / total) * 100;

    const results: Correlation[] = [];

    // Check if pre-flare % is significantly higher than overall
    const factors = [
      {
        factor: "High stress",
        icon: <Brain className="w-4 h-4" />,
        count: preFlareHighStress,
        overallPct: overallHighStressPct,
      },
      {
        factor: "Heavy alcohol",
        icon: <Wine className="w-4 h-4" />,
        count: preFlareHeavyAlcohol,
        overallPct: overallHeavyAlcoholPct,
      },
      {
        factor: "Low hydration",
        icon: <Droplets className="w-4 h-4" />,
        count: preFlareLowHydration,
        overallPct: overallLowHydrationPct,
      },
      {
        factor: "Bad mood",
        icon: <Flame className="w-4 h-4" />,
        count: preFlareBadMood,
        overallPct: overallBadMoodPct,
      },
    ];

    for (const f of factors) {
      const preFlareRate = (f.count / flaresWithData) * 100;

      // Only show if it appears in at least 50% of pre-flare periods
      // OR if it's significantly higher than overall average
      if (f.count >= 2 || (preFlareRate > 50 && preFlareRate > f.overallPct * 1.5)) {
        results.push({
          factor: f.factor,
          icon: f.icon,
          count: f.count,
          total: flaresWithData,
          overallPct: f.overallPct,
          severity:
            preFlareRate >= 66 ? "strong" : "possible",
        });
      }
    }

    // Sort by count descending
    results.sort((a, b) => b.count - a.count);
    return results;
  }, [allCheckins, flares]);

  if (flares.length < 2) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-sm text-gw-navy mb-2">
          Flare Correlations
        </h2>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-gw-bg-light rounded-full flex items-center justify-center mx-auto mb-2">
            <Search className="w-6 h-6 text-gw-text-gray" />
          </div>
          <p className="text-sm text-gw-text-gray">
            Log more flares to start seeing your personal trigger patterns.
            Every data point helps.
          </p>
        </div>
      </div>
    );
  }

  if (correlations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-sm text-gw-navy mb-2">
          Flare Correlations
        </h2>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-gw-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-6 h-6 text-gw-green" />
          </div>
          <p className="text-sm text-gw-text-gray">
            No strong patterns found yet. Keep checking in &mdash; patterns
            emerge over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-4">
      <h2 className="font-semibold text-sm text-gw-navy mb-3">
        Flare Correlations
      </h2>
      <p className="text-xs text-gw-text-gray mb-3">
        Based on your check-ins in the 7 days before each flare.
      </p>
      <div className="space-y-2">
        {correlations.map((c) => (
          <div
            key={c.factor}
            className={`flex items-start gap-3 p-3 rounded-xl ${
              c.severity === "strong"
                ? "bg-red-50 border-l-4 border-red-400"
                : "bg-yellow-50 border-l-4 border-yellow-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                c.severity === "strong"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {c.severity === "strong" ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                c.icon
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gw-navy">
                {c.count} of {c.total} flares preceded by {c.factor.toLowerCase()}
              </p>
              <p className="text-xs text-gw-text-gray mt-0.5">
                {c.severity === "strong"
                  ? "Strong correlation"
                  : "Possible connection"}{" "}
                &middot; Overall rate: {Math.round(c.overallPct)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
