import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GUIDELINES = [
  {
    title: "Be kind and supportive",
    description:
      "We're all dealing with gout. Treat others how you'd want to be treated during a flare.",
  },
  {
    title: "No dangerous medical advice",
    description:
      "Share your experience, but don't tell others to stop medications or ignore their doctor. Always recommend consulting a healthcare provider.",
  },
  {
    title: "Keep it honest",
    description:
      "Share what actually worked or didn't work for you. The community relies on real experiences.",
  },
  {
    title: "No spam or self-promotion",
    description:
      "Don't post advertisements, affiliate links, or promote products. This is a support community, not a marketplace.",
  },
  {
    title: "Respect privacy",
    description:
      "Don't share other people's personal information. What's shared in the community stays in the community.",
  },
  {
    title: "No harassment",
    description:
      "Disagreement is fine, but personal attacks, bullying, and discriminatory language are not tolerated.",
  },
];

export default function GuidelinesPage() {
  return (
    <div className="pt-2">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gw-text-gray hover:text-gw-navy transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-2">
        Community Guidelines
      </h1>
      <p className="text-sm text-gw-text-gray mb-6">
        GoutWize is a supportive community. Please follow these guidelines to
        keep it that way.
      </p>

      <div className="space-y-3">
        {GUIDELINES.map((guideline, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <p className="font-semibold text-sm text-gw-navy">
              {i + 1}. {guideline.title}
            </p>
            <p className="text-sm text-gw-text-gray mt-1 leading-relaxed">
              {guideline.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
