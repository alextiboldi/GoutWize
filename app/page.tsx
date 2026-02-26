import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Heart,
  TrendingUp,
  Check,
  Star,
  Stethoscope,
  CircleHelp,
  UsersRound,
} from "lucide-react";
import { MobileNav } from "@/components/landing/mobile-nav";
import { seedInsights } from "@/lib/seed-data";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#community", label: "Community" },
];

const PAIN_POINTS = [
  {
    icon: Stethoscope,
    iconBg: "bg-gw-blue/20",
    iconColor: "text-gw-blue",
    title: "Conflicting Advice",
    description:
      "Doctors give general guidelines, but what works for one person may not work for you. Everyone's body is different.",
  },
  {
    icon: CircleHelp,
    iconBg: "bg-gw-orange/20",
    iconColor: "text-gw-orange",
    title: "Trial & Error",
    description:
      "Most of us spend years trying different diets, medications, and remedies\u2014often alone\u2014before finding what actually works.",
  },
  {
    icon: UsersRound,
    iconBg: "bg-gw-green/20",
    iconColor: "text-gw-green",
    title: "Feeling Misunderstood",
    description:
      'Friends and family don\'t get it. They think it\'s just "a rich man\'s disease" or "just a swollen toe." We understand.',
  },
];

const COMMUNITY_POINTS = [
  {
    title: "Pattern Discovery",
    description:
      "Learn what triggers YOUR gout through community-shared insights",
  },
  {
    title: "Real Experiences",
    description:
      "Read authentic stories from people who\u2019ve been where you are",
  },
  {
    title: "24/7 Support",
    description:
      "Never feel alone\u2014connect with understanding people anytime",
  },
];

const STEPS = [
  {
    number: 1,
    bg: "bg-gw-blue",
    title: "Join the Community",
    description:
      "Create your free profile and instantly connect with thousands who understand what you\u2019re going through.",
  },
  {
    number: 2,
    bg: "bg-gw-orange",
    title: "Track & Share",
    description:
      "Log your symptoms, diet, and flare-ups. Share your experiences and discover patterns that work.",
  },
  {
    number: 3,
    bg: "bg-gw-green",
    title: "Find Your Formula",
    description:
      "Discover what triggers your gout and what works for you through community insights and pattern analysis.",
  },
];

const FEATURES = [
  {
    icon: Shield,
    iconBg: "bg-gw-blue/10",
    iconColor: "text-gw-blue",
    title: "Privacy First",
    description:
      "Your health data stays yours. We never sell your information and give you full control.",
  },
  {
    icon: UsersRound,
    iconBg: "bg-gw-orange/10",
    iconColor: "text-gw-orange",
    title: "Moderated Community",
    description:
      "We maintain a safe, supportive environment with active moderation against spam and misinformation.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-gw-green/10",
    iconColor: "text-gw-green",
    title: "Evidence-Based",
    description:
      "While we value real experiences, we also cite scientific sources and encourage consulting your doctor.",
  },
];

const STATS = [
  {
    value: "10K+",
    label: "Active Members",
    bg: "bg-gw-bg-light",
    textColor: "text-gw-blue",
  },
  {
    value: "5K+",
    label: "Success Stories",
    bg: "bg-gw-blue",
    textColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    value: "50K+",
    label: "Posts Shared",
    bg: "bg-gw-orange/10",
    textColor: "text-gw-orange",
  },
  {
    value: "24/7",
    label: "Community Support",
    bg: "bg-gw-green/10",
    textColor: "text-gw-green",
  },
];

const FOOTER_LINKS = {
  Product: [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/login", label: "Get Started" },
    { href: "#community", label: "Success Stories" },
  ],
  Company: [
    { href: "#", label: "About Us" },
    { href: "#community", label: "Community" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Contact" },
  ],
  Support: [
    { href: "#", label: "FAQ" },
    { href: "#", label: "Resources" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icons/foot_logo.png"
                alt="GoutWize logo"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <span className="font-heading text-2xl font-bold text-gw-navy">
                Gout<span className="text-gw-blue">Wize</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gw-navy hover:text-gw-blue font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                className="bg-gw-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-gw-blue-dark transition-colors"
              >
                Join the Community
              </Link>
            </nav>

            <MobileNav />
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-gw-bg-light via-gw-bg-mid to-gw-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gw-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gw-orange/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-gw-blue/10 text-gw-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Trusted by 10,000+ Gout Sufferers
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gw-navy leading-tight mb-6">
                Stop Guessing. Start{" "}
                <span className="text-gw-blue">Connecting.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gw-text-gray mb-8 max-w-xl mx-auto lg:mx-0">
                Discover what actually works for gout from people who&apos;ve
                been there. Real experiences. Real patterns. Real support from a
                community that understands.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="bg-gw-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gw-blue-dark transition-all transform hover:scale-105 shadow-lg"
                >
                  Join the Community
                </Link>
                <a
                  href="#how-it-works"
                  className="border-2 border-gw-blue text-gw-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gw-blue hover:text-white transition-all"
                >
                  See How It Works
                </a>
              </div>
              <p className="mt-4 text-sm text-gw-text-gray">
                <CheckCircle className="inline w-4 h-4 text-gw-green mr-1" />{" "}
                Free to join &bull; No credit card required
              </p>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
                  alt="Community support and connection"
                  width={800}
                  height={600}
                  className="w-full h-80 lg:h-96 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="bg-gw-green/20 p-2 rounded-full">
                    <Heart className="w-5 h-5 text-gw-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gw-text-gray">Active Members</p>
                    <p className="font-bold text-gw-navy">10,247 Online Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 sm:h-24"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ===== PAIN POINTS ===== */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gw-orange/10 text-gw-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
              The Struggle Is Real
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gw-navy mb-6">
              You&apos;re Not Alone in This Fight
            </h2>
            <p className="text-lg text-gw-text-gray max-w-2xl mx-auto">
              Living with gout can feel isolating. But here&apos;s what
              we&apos;ve learned from thousands of community members.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((point) => (
              <div
                key={point.title}
                className="bg-gw-bg-light rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-14 h-14 ${point.iconBg} rounded-xl flex items-center justify-center mb-6`}
                >
                  <point.icon className={`w-7 h-7 ${point.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gw-navy mb-4">
                  {point.title}
                </h3>
                <p className="text-gw-text-gray">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY INSIGHTS ===== */}
      <section className="bg-gw-bg-light py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gw-blue/10 text-gw-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Community Insights
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gw-navy mb-6">
              What 10,000+ Members Have Discovered
            </h2>
            <p className="text-lg text-gw-text-gray max-w-2xl mx-auto">
              Real patterns surfaced from real experiences. These insights come
              from our community&apos;s collective knowledge.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seedInsights.slice(0, 6).map((insight) => (
              <div
                key={insight.stat}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{insight.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-gw-blue">
                      {insight.stat}
                    </p>
                    <p className="mt-1 text-sm text-gw-text-gray">
                      {insight.text}
                    </p>
                    <p className="mt-2 text-xs text-gw-text-gray/60">
                      {insight.source}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section
        id="community"
        className="bg-gradient-to-br from-gw-navy to-gw-navy-deep py-20 lg:py-28 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gw-blue rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gw-orange rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop"
                  alt="Unity and community connection"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gw-navy/70 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white rounded-xl shadow-2xl p-6 hidden sm:block">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-gw-blue">10K+</p>
                    <p className="text-sm text-gw-text-gray">Members</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gw-green">500+</p>
                    <p className="text-sm text-gw-text-gray">Tips Shared</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 text-center lg:text-left">
              <span className="inline-block bg-gw-blue/20 text-gw-cyan px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Enter GoutWize
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Finally, a Community That{" "}
                <span className="text-gw-cyan">Gets It</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                GoutWize is more than an app&mdash;it&apos;s a movement. We
                believe in the power of shared experiences to transform how we
                manage gout.
              </p>

              <div className="space-y-4 text-left">
                {COMMUNITY_POINTS.map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gw-green rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {point.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="inline-block mt-8 bg-gw-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gw-blue-dark transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-gw-bg-light py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gw-blue/10 text-gw-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Simple &amp; Powerful
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gw-navy mb-6">
              How GoutWize Works
            </h2>
            <p className="text-lg text-gw-text-gray max-w-2xl mx-auto">
              Three simple steps to take control of your gout journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-1 bg-gw-border -z-10" />

            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center relative z-10">
                  <div
                    className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gw-navy mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gw-text-gray">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#features"
              className="inline-flex items-center text-gw-blue font-semibold hover:text-gw-blue-dark transition-colors"
            >
              Learn more about how it works
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-gw-gold/20 text-gw-gold-dark px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Why GoutWize?
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gw-navy mb-6">
                More Than Just an App
              </h2>
              <p className="text-lg text-gw-text-gray mb-8">
                We built GoutWize because we knew there had to be a better way.
                Here&apos;s what makes us different:
              </p>

              <div className="space-y-6">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div
                      className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center shrink-0`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${feature.iconColor}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gw-navy text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gw-text-gray">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {STATS.slice(0, 2).map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.bg} rounded-2xl p-6 text-center`}
                    >
                      <p
                        className={`text-4xl font-bold ${stat.textColor}`}
                      >
                        {stat.value}
                      </p>
                      <p
                        className={stat.labelColor ?? "text-gw-text-gray"}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-8">
                  {STATS.slice(2).map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.bg} rounded-2xl p-6 text-center`}
                    >
                      <p
                        className={`text-4xl font-bold ${stat.textColor}`}
                      >
                        {stat.value}
                      </p>
                      <p
                        className={stat.labelColor ?? "text-gw-text-gray"}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-gw-blue to-gw-blue-dark py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gw-orange rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Gout?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are discovering what actually works.
            Your solution might be just one conversation away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white text-gw-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#community"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>
          <p className="mt-6 text-sm text-white/70">
            <Star className="inline w-4 h-4 text-gw-gold mr-1" /> 4.9/5 stars
            from 2,000+ reviews &bull; Free forever plan available
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gw-navy text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <span className="font-heading text-2xl font-bold text-white">
                  Gout<span className="text-gw-blue">Wize</span>
                </span>
              </Link>
              <p className="text-white/70 mb-4">
                The community for gout sufferers to share what actually works.
                Real experiences. Real patterns. Real support.
              </p>
            </div>

            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-bold text-lg mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              &copy; 2026 GoutWize. All rights reserved.
            </p>
            <p className="text-white/50 text-sm">
              <Heart className="inline w-4 h-4 text-gw-orange mr-1" /> Made
              with love for the gout community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
