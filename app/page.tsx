import Link from "next/link";

const INSIGHTS = [
  {
    emoji: "😤",
    stat: "68%",
    text: "of gout sufferers report stress as a significant trigger — often more impactful than diet alone",
  },
  {
    emoji: "💧",
    stat: "34%",
    text: "fewer flares reported by members who actively track their hydration",
  },
  {
    emoji: "📅",
    stat: "#1",
    text: "Most common flare onset day: Monday. Weekend lifestyle changes may be a factor",
  },
];

const FEATURES = [
  {
    emoji: "📊",
    title: "Pattern Intelligence",
    description:
      "Discover triggers you never suspected, surfaced from real community data",
  },
  {
    emoji: "💬",
    title: "Ask the Community",
    description:
      "Get answers from people who actually live with gout every day",
  },
  {
    emoji: "🔥",
    title: "Flare Support",
    description:
      "One tap when you're in pain. Get crowdsourced relief tips and support instantly",
  },
  {
    emoji: "✅",
    title: "10-Second Check-in",
    description:
      "Quick daily log that helps you and everyone else spot hidden patterns",
  },
];

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-6">
      {/* Section 1: Hero */}
      <section className="pt-12 text-center">
        <p className="text-5xl">🤝</p>
        <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight">
          You&apos;re not alone
          <br />
          with gout.
        </h1>
        <p className="mt-4 leading-relaxed text-gw-muted">
          A community sharing what actually works.
          <br />
          Real experiences. Real patterns.
          <br />
          Real support.
        </p>
      </section>

      {/* Section 2: Community Insights Preview */}
      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gw-blue">
          Community Insights
        </p>
        <div className="mt-3 space-y-3">
          {INSIGHTS.map((insight) => (
            <div
              key={insight.stat}
              className="flex items-start gap-3 rounded-xl bg-white/[0.04] p-4"
            >
              <span className="text-2xl">{insight.emoji}</span>
              <p className="text-sm text-gw-muted">
                <span className="font-bold text-gw-blue">{insight.stat}</span>{" "}
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Primary CTA */}
      <section className="mt-10">
        <Link
          href="/login"
          className="block w-full rounded-xl bg-gw-blue py-4 text-center text-lg font-bold text-white transition-colors hover:bg-gw-blue/90"
        >
          Join the Community
        </Link>
        <p className="mt-3 text-center text-xs text-[#556]">
          Free. Anonymous by default. Your data stays private.
        </p>
      </section>

      {/* Section 4: Social Proof Numbers */}
      <section className="mt-10 grid grid-cols-3 text-center">
        <div>
          <p className="text-2xl font-bold text-gw-blue">12K+</p>
          <p className="mt-1 text-xs text-gw-muted">Members</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gw-green">850+</p>
          <p className="mt-1 text-xs text-gw-muted">Discussions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gw-orange">47</p>
          <p className="mt-1 text-xs text-gw-muted">Patterns found</p>
        </div>
      </section>

      {/* Section 5: Value Proposition */}
      <section className="mt-12">
        <h2 className="text-lg font-bold">Not another food tracker.</h2>
        <p className="mt-2 text-sm leading-relaxed text-gw-muted">
          Every gout app tracks purines. None of them help you learn from
          thousands of others who share your condition. We&apos;re different.
        </p>
        <div className="mt-5 space-y-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-4"
            >
              <span className="text-xl">{feature.emoji}</span>
              <div>
                <p className="text-sm font-bold">{feature.title}</p>
                <p className="mt-0.5 text-xs text-gw-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Bottom CTA */}
      <section className="mt-10 pb-6">
        <Link
          href="/login"
          className="block w-full rounded-xl bg-gw-blue py-4 text-center text-lg font-bold text-white transition-colors hover:bg-gw-blue/90"
        >
          Get Started — It&apos;s Free
        </Link>
      </section>
    </div>
  );
}
