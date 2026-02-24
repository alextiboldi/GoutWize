"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { POST_CATEGORIES } from "@/lib/constants";

const TITLE_PLACEHOLDERS: Record<string, string> = {
  general: "What's on your mind?",
  has_anyone_tried: "Has anyone tried...?",
  why_do_i: "Why do I...?",
  what_would_you_do: "What would you do if...?",
  just_venting: "I need to get this off my chest...",
  tip: "Here's something that worked for me...",
};

export default function NewPostPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

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

      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title: title.trim(),
          body: body.trim(),
          category,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Post insert error:", insertError);
        setError(insertError.message || "Failed to create post. Please try again.");
      } else if (data) {
        router.push(`/post/${data.id}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gw-navy pt-2 mb-6">
        New Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category picker */}
        <div>
          <label className="block text-sm font-medium text-gw-navy mb-3">
            Category
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-gw-blue text-white shadow-sm"
                    : "bg-white text-gw-navy border border-gw-border hover:border-gw-blue/40"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gw-navy mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={TITLE_PLACEHOLDERS[category] ?? "What's on your mind?"}
            required
            className="w-full px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
          />
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gw-navy mb-2"
          >
            Details
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience, question, or tip..."
            required
            rows={6}
            className="w-full px-4 py-3 bg-white border-2 border-gw-border rounded-xl text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !body.trim()}
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
              Posting...
            </span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Post to Community
            </>
          )}
        </button>
      </form>
    </div>
  );
}
