"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FLARE_JOINTS } from "@/lib/constants";

const STATUS_OPTIONS = [
  { value: "active", label: "Still active", emoji: "🔴" },
  { value: "improving", label: "Improving", emoji: "🟡" },
  { value: "resolved", label: "Resolved", emoji: "🟢" },
];

interface FlareData {
  id: string;
  joint: string;
  severity: number;
  status: string;
  started_at: string;
}

export default function FlareUpdatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const flareId = params.id;

  const [flare, setFlare] = useState<FlareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("active");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function loadFlare() {
      const supabase = createClient();
      const { data } = await supabase
        .from("flares")
        .select("id, joint, severity, status, started_at")
        .eq("id", flareId)
        .single();

      if (data) {
        const f = data as FlareData;
        setFlare(f);
        setSeverity(f.severity);
        setStatus(f.status);
      }
      setLoading(false);
    }
    loadFlare();
  }, [flareId]);

  async function handleSubmit() {
    if (!severity || !flare) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const updateData: Record<string, unknown> = {
        severity,
        status,
      };

      if (status === "resolved") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("flares")
        .update(updateData)
        .eq("id", flare.id);

      if (updateError) {
        console.error("Flare update error:", updateError);
        setError(updateError.message || "Failed to update flare.");
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

  if (loading) {
    return (
      <div className="pt-16 text-center">
        <p className="text-sm text-gw-text-gray">Loading flare...</p>
      </div>
    );
  }

  if (!flare) {
    return (
      <div className="pt-16 text-center">
        <p className="font-semibold text-gw-navy">Flare not found</p>
        <Link
          href="/feed"
          className="mt-4 inline-block text-sm text-gw-blue hover:underline"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center pt-32">
        <div className="w-16 h-16 bg-gw-green/10 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-gw-green" />
        </div>
        <p className="font-heading text-2xl font-bold text-gw-navy">
          {status === "resolved" ? "Glad it's better!" : "Updated!"}
        </p>
        <p className="text-sm text-gw-text-gray mt-1">
          Taking you back to your feed...
        </p>
      </div>
    );
  }

  const jointInfo = FLARE_JOINTS.find((j) => j.value === flare.joint);
  const startedDate = new Date(flare.started_at).toLocaleDateString();

  return (
    <div className="pt-2">
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-sm text-gw-text-gray hover:text-gw-navy transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-1">
        Update Flare
      </h1>
      <p className="text-sm text-gw-text-gray mb-6">
        {jointInfo?.emoji} {jointInfo?.label} &middot; Started {startedDate}
      </p>

      {/* Current severity */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gw-navy mb-3">
          Current severity{" "}
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

      {/* Status change */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gw-navy mb-3">
          How&apos;s it going?
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-xl transition-all ${
                status === option.value
                  ? "bg-gw-blue text-white shadow-md"
                  : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <label
          htmlFor="flare-note"
          className="block text-sm font-medium text-gw-navy mb-2"
        >
          Notes{" "}
          <span className="text-gw-text-gray font-normal">(optional)</span>
        </label>
        <textarea
          id="flare-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What have you tried? How's it going?"
          rows={3}
          className="w-full px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-sm text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all resize-none"
        />
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
        className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          status === "resolved"
            ? "bg-gw-green text-white hover:bg-gw-green/90 shadow-lg shadow-gw-green/25"
            : "bg-gw-blue text-white hover:bg-gw-blue-dark shadow-lg shadow-gw-blue/25"
        }`}
      >
        {isSubmitting ? (
          "Saving..."
        ) : (
          <>
            {status === "resolved" ? "Mark as Resolved" : "Update Flare"}
            <Check className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
