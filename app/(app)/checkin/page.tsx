"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MOOD_OPTIONS,
  HYDRATION_OPTIONS,
  ALCOHOL_OPTIONS,
} from "@/lib/constants";

const STRESS_LEVELS = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Very high" },
];

export default function CheckinPage() {
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [hydration, setHydration] = useState<string | null>(null);
  const [alcohol, setAlcohol] = useState<string | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = mood && hydration && alcohol && stress;

  async function handleSubmit() {
    if (!canSubmit) return;

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

      const today = new Date().toISOString().split("T")[0];

      const { error: upsertError } = await supabase.from("checkins").upsert(
        {
          id: crypto.randomUUID(),
          user_id: user.id,
          date: today,
          mood,
          hydration,
          alcohol,
          stress,
          note: note.trim() || null,
        },
        { onConflict: "user_id,date", ignoreDuplicates: false },
      );

      if (upsertError) {
        console.error("Checkin upsert error:", upsertError);
        setError(upsertError.message || "Failed to save check-in.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/feed"), 1200);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center pt-32">
        <div className="w-16 h-16 bg-gw-green/10 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-gw-green" />
        </div>
        <p className="font-heading text-2xl font-bold text-gw-navy">
          Logged!
        </p>
        <p className="text-sm text-gw-text-gray mt-1">
          Taking you back to your feed...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-1">
        Daily Check-in
      </h1>
      <p className="text-sm text-gw-text-gray mb-6">
        10 seconds. Helps you and the community spot patterns.
      </p>

      <div className="space-y-8">
        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-3">
            How are you feeling?
          </label>
          <div className="flex gap-3">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl transition-all ${
                  mood === option.value
                    ? "bg-gw-blue text-white shadow-md scale-105"
                    : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
                }`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hydration */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-3">
            Hydration
          </label>
          <div className="flex gap-2">
            {HYDRATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setHydration(option.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  hydration === option.value
                    ? "bg-gw-blue text-white shadow-sm"
                    : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alcohol */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-3">
            Alcohol yesterday?
          </label>
          <div className="flex gap-2">
            {ALCOHOL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAlcohol(option.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  alcohol === option.value
                    ? "bg-gw-blue text-white shadow-sm"
                    : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stress */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-3">
            Stress level
          </label>
          <div className="flex gap-2">
            {STRESS_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setStress(level.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                  stress === level.value
                    ? "bg-gw-blue text-white shadow-sm"
                    : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
                }`}
              >
                <span className="text-sm font-bold">{level.value}</span>
                <span className="text-[9px] font-medium leading-tight">
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gw-navy mb-2"
          >
            Note{" "}
            <span className="text-gw-text-gray font-normal">(optional)</span>
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything unusual? Travel, bad sleep, new food..."
            className="w-full px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
            canSubmit
              ? "bg-gw-green text-white hover:bg-gw-green/90 shadow-lg shadow-gw-green/25"
              : "bg-gw-border text-gw-text-gray/50 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              Done
              <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
