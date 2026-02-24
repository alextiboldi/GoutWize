"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Step {
  key: string;
  question: string;
  subtitle: string;
  options: { label: string; value: string }[];
}

const STEPS: Step[] = [
  {
    key: "goutDuration",
    question: "How long have you had gout?",
    subtitle: "This helps us personalize your experience",
    options: [
      { label: "New to it", value: "new" },
      { label: "1\u20133 years", value: "1-3" },
      { label: "3\u201310 years", value: "3-10" },
      { label: "10+ years", value: "10+" },
    ],
  },
  {
    key: "flareFrequency",
    question: "How often do you flare?",
    subtitle: "Everyone\u2019s pattern is different",
    options: [
      { label: "Monthly", value: "monthly" },
      { label: "Every few months", value: "few_months" },
      { label: "Yearly", value: "yearly" },
      { label: "Unpredictable", value: "unpredictable" },
    ],
  },
  {
    key: "approach",
    question: "What\u2019s your approach?",
    subtitle: "There\u2019s no wrong answer here",
    options: [
      { label: "Strict diet", value: "diet" },
      { label: "Medication", value: "medication" },
      { label: "Both", value: "both" },
      { label: "Living freely & managing", value: "freestyle" },
    ],
  },
  {
    key: "reason",
    question: "What brought you here?",
    subtitle: "We\u2019ll help you find what you need",
    options: [
      { label: "Want answers", value: "answers" },
      { label: "Need support", value: "support" },
      { label: "Just diagnosed", value: "diagnosed" },
      { label: "Curious", value: "curious" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const selectedValue = answers[step.key] ?? null;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + (selectedValue ? 1 : 0)) / totalSteps) * 100;

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  function goNext() {
    if (!selectedValue) return;
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleSubmit() {
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

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          gout_duration: answers.goutDuration,
          flare_frequency: answers.flareFrequency,
          approach: answers.approach,
          reason: answers.reason,
        })
        .eq("id", user.id);

      if (updateError) {
        setError("Failed to save your profile. Please try again.");
      } else {
        router.push("/feed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gw-bg-light to-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gw-border">
          <div
            className="h-full bg-gw-blue transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gw-text-gray hover:text-gw-navy hover:bg-gw-bg-light transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-gw-blue"
                    : i < currentStep
                      ? "w-2 bg-gw-green"
                      : "w-2 bg-gw-border"
                }`}
              />
            ))}
          </div>

          <span className="text-sm text-gw-text-gray tabular-nums">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-32">
        <div className="max-w-lg mx-auto w-full">
          <div className="mb-10">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gw-navy">
              {step.question}
            </h1>
            <p className="mt-3 text-gw-text-gray text-lg">{step.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {step.options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => selectOption(option.value)}
                  className={`relative px-6 py-5 rounded-2xl text-left font-medium text-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-gw-blue text-white shadow-lg shadow-gw-blue/25 scale-[1.02]"
                      : "bg-white text-gw-navy border-2 border-gw-border hover:border-gw-blue/40 hover:shadow-md"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {option.label}
                    {isSelected && (
                      <Check className="w-5 h-5 text-white/80" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-white/0">
        <div className="max-w-lg mx-auto">
          <button
            onClick={goNext}
            disabled={!selectedValue || isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedValue
                ? "bg-gw-blue text-white hover:bg-gw-blue-dark shadow-lg shadow-gw-blue/25 transform hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gw-border text-gw-text-gray/50 cursor-not-allowed"
            }`}
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
                Saving...
              </span>
            ) : isLastStep ? (
              "Let\u2019s Go!"
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
