"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Clock, TrendingUp, Zap, Star } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: "✏️",
    title: "Fill the form once",
    desc: "Tell us your brand name, industry, colors, and voice. Five minutes. Never again.",
  },
  {
    num: "02",
    icon: "✨",
    title: "AI crafts everything",
    desc: "Every Monday, GPT-4 and DALL·E generate a full week of branded content — just for you.",
  },
  {
    num: "03",
    icon: "📬",
    title: "Open & post",
    desc: "Your creatives land in your inbox Monday morning. Download and post — done for the week.",
  },
];

const INCLUDES = [
  {
    emoji: "🖼️",
    label: "AI-generated images",
    desc: "Brand-colored visuals sized for Instagram, Facebook & LinkedIn",
    bg: "bg-orange-50",
  },
  {
    emoji: "✍️",
    label: "Captions + hashtags",
    desc: "Platform-optimized copy with 15–20 targeted hashtags per post",
    bg: "bg-amber-50",
  },
  {
    emoji: "🎬",
    label: "Video scripts",
    desc: "30–60 second hook → content → CTA scripts for Reels and TikTok",
    bg: "bg-yellow-50",
  },
  {
    emoji: "📦",
    label: "Full post packages",
    desc: "Everything bundled by day — Monday through Sunday, every week",
    bg: "bg-orange-50",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya R.",
    biz: "Sunrise Bakery",
    avatar: "🧁",
    quote:
      "I used to spend Sunday nights writing captions. Now I just open my email Monday morning.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    biz: "FitWith Marcus",
    avatar: "💪",
    quote:
      "The content quality genuinely surprised me. It knows my audience better than I do.",
    stars: 5,
  },
  {
    name: "Anika S.",
    biz: "Bloom & Co.",
    avatar: "🌸",
    quote:
      "Three months in and my engagement is up 40%. It just runs itself.",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{ background: "rgba(250,250,247,0.88)", borderColor: "#E7E5E4" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold gradient-text heading-serif">
            CreativeLoop
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium"
              style={{ color: "#57534E" }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
              style={{ boxShadow: "0 4px 14px rgba(232, 93, 4, 0.3)" }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="gradient-hero pt-24 pb-28 px-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, #FBBF24 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle, #E85D04 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-8"
            style={{ background: "#FFEDD5", color: "#C2410C" }}
          >
            <Sparkles size={14} />
            7 ready-to-post creatives, every Monday
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 heading-serif"
            style={{ color: "#1C1917" }}
          >
            Your content,{" "}
            <span className="gradient-text">created for you.</span>
            <br />
            Every single week.
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: "#78716C" }}
          >
            Fill out one short form. Every Monday, CreativeLoop generates a
            full week of branded social media posts — images, captions,
            hashtags, and video scripts — and delivers them to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="gradient-brand text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: "0 8px 30px rgba(232, 93, 4, 0.35)" }}
            >
              Start free — no card needed <ArrowRight size={18} />
            </Link>
            <Link
              href="#how-it-works"
              className="font-semibold text-lg px-8 py-4 rounded-2xl border-2 hover:border-brand-400 transition-colors flex items-center justify-center gap-2"
              style={{
                color: "#57534E",
                borderColor: "#E7E5E4",
                background: "white",
              }}
            >
              See how it works
            </Link>
          </div>

          <p className="mt-6 text-sm" style={{ color: "#A8A29E" }}>
            No templates. No manual work. Content made specifically for your brand.
          </p>

          {/* Floating stat cards */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { num: "7", label: "posts per week" },
              { num: "5 min", label: "setup time" },
              { num: "100%", label: "hands-free" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-center"
                style={{ background: "white", border: "1px solid #E7E5E4" }}
              >
                <div
                  className="text-2xl font-bold heading-serif"
                  style={{ color: "#E85D04" }}
                >
                  {num}
                </div>
                <div className="text-xs mt-1" style={{ color: "#78716C" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section className="py-12 px-6 border-y" style={{ borderColor: "#E7E5E4", background: "white" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              label: "5–10 hrs/week saved",
              desc: "Average time SMBs spend on content creation — gone",
            },
            {
              icon: TrendingUp,
              label: "3× more engagement",
              desc: "Consistent weekly posting drives 3× more follower growth",
            },
            {
              icon: Zap,
              label: "Zero effort after setup",
              desc: "One onboarding form. Everything else runs on its own.",
            },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-4 p-6 rounded-2xl"
              style={{ background: "#FFF7ED" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FFEDD5" }}
              >
                <Icon size={20} style={{ color: "#E85D04" }} />
              </div>
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: "#1C1917" }}>
                  {label}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "#78716C" }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: "#FAFAF7" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#E85D04" }}
            >
              How it works
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold heading-serif mb-4"
              style={{ color: "#1C1917" }}
            >
              Three steps, then it runs itself.
            </h2>
            <p style={{ color: "#78716C" }}>
              The entire setup takes five minutes. After that, it&apos;s automatic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-full w-full h-px z-0"
                    style={{
                      background:
                        "linear-gradient(90deg, #FDBA74, transparent)",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
                <div
                  className="relative z-10 rounded-3xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: "white",
                    border: "1px solid #E7E5E4",
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold mb-5"
                    style={{ background: "#FFF7ED", color: "#E85D04" }}
                  >
                    {step.num}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3
                    className="font-bold mb-3 heading-serif text-lg"
                    style={{ color: "#1C1917" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#E85D04" }}
            >
              What you get
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold heading-serif mb-4"
              style={{ color: "#1C1917" }}
            >
              A full creative package,
              <br />
              every Monday morning.
            </h2>
            <p style={{ color: "#78716C" }}>
              7 complete post packages. Monday through Sunday. Without lifting a finger.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {INCLUDES.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{
                  background: "#FFF7ED",
                  border: "1px solid #FED7AA",
                }}
              >
                <div className="text-4xl mb-5">{item.emoji}</div>
                <h3
                  className="font-bold mb-2 heading-serif"
                  style={{ color: "#1C1917" }}
                >
                  {item.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{
          background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#FDBA74" }}
            >
              Real results
            </p>
            <h2
              className="text-4xl font-bold heading-serif"
              style={{ color: "white" }}
            >
              Businesses that run on CreativeLoop
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl p-7"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      style={{ color: "#F59E0B", fill: "#F59E0B" }}
                    />
                  ))}
                </div>

                <p
                  className="text-sm leading-relaxed mb-6 italic"
                  style={{ color: "#D6D3D1" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(232,93,4,0.2)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "white" }}>
                      {t.name}
                    </div>
                    <div className="text-xs" style={{ color: "#A8A29E" }}>
                      {t.biz}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-28 px-6 gradient-cta text-center relative overflow-hidden">
        {/* Decorative blob */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.25) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <h2
            className="text-4xl md:text-5xl font-bold heading-serif text-white mb-5"
          >
            Ready to reclaim your Sundays?
          </h2>
          <p className="text-lg mb-10" style={{ color: "#FDBA74" }}>
            Fill in your brand details once. Your first week of creatives
            arrives in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-amber-50 transition-colors shadow-2xl"
            style={{ color: "#E85D04" }}
          >
            Get my first week free <ArrowRight size={18} />
          </Link>
          <p className="mt-5 text-sm" style={{ color: "#FDBA74", opacity: 0.7 }}>
            No credit card. No templates. Just your brand.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        className="py-10 px-6 text-center"
        style={{ background: "#1C1917", color: "#78716C" }}
      >
        <p className="text-sm">
          © 2026 CreativeLoop · Built with Next.js, OpenAI & Supabase
        </p>
      </footer>
    </div>
  );
}
