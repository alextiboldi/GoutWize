"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/lib/toast-store";

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function NewPollPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addOption() {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, ""]);
    }
  }

  function removeOption(index: number) {
    if (options.length > MIN_OPTIONS) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  function updateOption(index: number, value: string) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  const filledOptions = options.filter((o) => o.trim());
  const canSubmit =
    question.trim() && filledOptions.length >= MIN_OPTIONS && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      // Insert poll
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          author_id: user.id,
          question: question.trim(),
        })
        .select("id")
        .single();

      if (pollError || !poll) {
        setError(pollError?.message || "Failed to create poll.");
        return;
      }

      // Insert options
      const optionRows = filledOptions.map((label, i) => ({
        poll_id: poll.id,
        label: label.trim(),
        display_order: i,
      }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionRows);

      if (optionsError) {
        setError(optionsError.message || "Failed to create poll options.");
        return;
      }

      useToastStore.getState().add("Poll created!");
      router.push(`/poll/${poll.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gw-navy pt-2 mb-6">
        New Poll
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question */}
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gw-navy mb-2"
          >
            Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the community something..."
            required
            className="w-full px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-2">
            Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
                />
                {options.length > MIN_OPTIONS && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-gw-text-gray hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gw-blue hover:text-gw-blue-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add option
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-gw-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-gw-blue-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-gw-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Create Poll
            </>
          )}
        </button>
      </form>
    </div>
  );
}
