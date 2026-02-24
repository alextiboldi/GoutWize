"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, Shield, Users, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TRUST_POINTS = [
  { icon: Shield, text: "Anonymous by default" },
  { icon: Users, text: "10,000+ members" },
  { icon: Sparkles, text: "Free forever" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand atmosphere (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gw-navy to-gw-navy-deep overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gw-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gw-orange/10 rounded-full blur-3xl" />
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gw-cyan/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link
            href="/"
            className="font-heading text-2xl font-bold text-white inline-flex items-center gap-2 w-fit"
          >
            Gout<span className="text-gw-blue">Wize</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight">
                You&apos;re one step away from a community that{" "}
                <span className="text-gw-cyan">gets it.</span>
              </h1>
              <p className="mt-6 text-lg text-white/60 max-w-md">
                Join thousands who are discovering what actually works for gout
                — together.
              </p>
            </div>

            <div className="flex gap-6">
              {TRUST_POINTS.map((point) => (
                <div key={point.text} className="flex items-center gap-2">
                  <point.icon className="w-4 h-4 text-gw-green" />
                  <span className="text-sm text-white/70">{point.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/30">
            &copy; 2026 GoutWize. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-br from-gw-bg-light to-white">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-40 lg:opacity-20">
          <div className="absolute top-10 right-10 w-48 h-48 bg-gw-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-gw-orange/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12">
          {/* Mobile back link + logo */}
          <div className="lg:hidden mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gw-text-gray hover:text-gw-navy transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="font-heading text-2xl font-bold text-gw-navy">
              Gout<span className="text-gw-blue">Wize</span>
            </div>
          </div>

          {!isSent ? (
            /* ===== EMAIL FORM STATE ===== */
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gw-navy">
                Join the Community
              </h2>
              <p className="mt-3 text-gw-text-gray">
                Enter your email and we&apos;ll send you a magic link to sign
                in. No password needed.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gw-navy mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gw-text-gray/50" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gw-border rounded-xl text-gw-navy placeholder:text-gw-text-gray/40 focus:outline-none focus:border-gw-blue focus:ring-4 focus:ring-gw-blue/10 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gw-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-gw-blue-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gw-blue/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
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
                      Sending...
                    </span>
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gw-text-gray/60">
                <Shield className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Anonymous by default. Your data stays private.
              </p>
            </div>
          ) : (
            /* ===== CHECK YOUR EMAIL STATE ===== */
            <div className="text-center">
              <div className="w-20 h-20 bg-gw-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-gw-green" />
              </div>

              <h2 className="font-heading text-3xl font-bold text-gw-navy">
                Check your email!
              </h2>
              <p className="mt-4 text-gw-text-gray max-w-sm mx-auto">
                We sent a magic link to{" "}
                <span className="font-semibold text-gw-navy">{email}</span>.
                Click the link in the email to sign in.
              </p>

              <div className="mt-8 p-4 bg-gw-bg-light rounded-xl">
                <p className="text-sm text-gw-text-gray">
                  Didn&apos;t get it? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setError(null);
                    }}
                    className="text-gw-blue font-semibold hover:text-gw-blue-dark transition-colors"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Mobile trust points */}
          <div className="lg:hidden mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {TRUST_POINTS.map((point) => (
              <div key={point.text} className="flex items-center gap-2">
                <point.icon className="w-3.5 h-3.5 text-gw-green" />
                <span className="text-xs text-gw-text-gray">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
