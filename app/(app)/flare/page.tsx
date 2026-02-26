"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/lib/toast-store";
import { FLARE_JOINTS } from "@/lib/constants";
import { reliefTips } from "@/lib/seed-data";

export default function FlarePage() {
  const router = useRouter();
  const [joint, setJoint] = useState("big_toe");
  const [severity, setSeverity] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  async function handleSubmit() {
    if (!severity) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: insertError } = await supabase.from("flares").insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        joint,
        severity,
        status: "active",
      });

      if (insertError) {
        console.error("Flare insert error:", insertError);
        setError(insertError.message || "Failed to log flare.");
      } else {
        useToastStore.getState().add("Flare logged. Hang in there.");
        setLogged(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedJoint = FLARE_JOINTS.find((j) => j.value === joint);

  if (logged) {
    return (
      <div className="pt-2">
        {/* Confirmation */}
        <div className="bg-gw-green/10 rounded-2xl p-5 flex items-start gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-gw-green shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gw-navy">Flare logged</p>
            <p className="text-sm text-gw-text-gray mt-0.5">
              {selectedJoint?.emoji} {selectedJoint?.label} &middot; Severity{" "}
              {severity}/10
            </p>
          </div>
        </div>

        {/* Relief tips */}
        <h2 className="font-heading text-xl font-bold text-gw-navy mb-1">
          Relief Tips
        </h2>
        <p className="text-sm text-gw-text-gray mb-4">
          From the community — what&apos;s helped others during a flare
        </p>

        <div className="space-y-3">
          {reliefTips.map((tip) => (
            <div
              key={tip.tip}
              className="bg-white rounded-xl p-4 flex items-start gap-3"
            >
              <span className="text-2xl shrink-0">{tip.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gw-navy">{tip.tip}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gw-bg-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gw-green rounded-full"
                      style={{ width: `${tip.helpfulPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gw-text-gray shrink-0">
                    {tip.helpfulPct}% helpful
                  </span>
                </div>
                <p className="text-[11px] text-gw-text-gray/60 mt-1">
                  {tip.memberCount.toLocaleString()} members
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Medical disclaimer */}
        <p className="mt-4 text-xs text-gw-text-gray/70 bg-amber-50 px-3 py-2 rounded-lg">
          These tips are from community members sharing personal experiences. They are not medical advice. Always consult your doctor before trying new treatments or changing your medication.
        </p>

        {/* CTA to vent */}
        <Link
          href="/post/new?category=just_venting"
          className="mt-6 flex items-center justify-center gap-2 w-full bg-white border-2 border-gw-border text-gw-navy py-3 rounded-xl font-semibold text-sm hover:border-gw-blue/40 transition-all"
        >
          Want to talk about it? Start a discussion
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/feed"
          className="mt-3 block text-center text-sm text-gw-text-gray hover:text-gw-navy transition-colors"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-1">
        Log a Flare
      </h1>
      <p className="text-sm text-gw-text-gray mb-6">
        We&apos;ll get you help right away.
      </p>

      {/* Joint selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gw-navy mb-3">
          Where does it hurt?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FLARE_JOINTS.map((j) => (
            <button
              key={j.value}
              type="button"
              onClick={() => setJoint(j.value)}
              className={`flex flex-col items-center gap-1 py-4 px-2 rounded-xl text-center transition-all ${
                joint === j.value
                  ? "bg-gw-blue text-white shadow-md"
                  : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
              }`}
            >
              <span className="text-2xl">{j.emoji}</span>
              <span className="text-xs font-medium">{j.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Severity selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gw-navy mb-3">
          How bad is it?{" "}
          {severity && (
            <span className="text-gw-text-gray font-normal">
              ({severity}/10)
            </span>
          )}
        </label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSeverity(n)}
              className={`w-full aspect-square rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                severity === n
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110"
                  : n <= (severity ?? 0)
                    ? "bg-red-100 text-red-500"
                    : "bg-white text-gw-navy border border-gw-border hover:border-red-300"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!severity || isSubmitting}
        className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          "Logging..."
        ) : (
          <>
            Get Help Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
