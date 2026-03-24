"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TONES, PLATFORMS } from "@/lib/supabase/types";
import type { Tone, Platform } from "@/lib/supabase/types";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = [
  "Bakery / Food", "Fitness / Wellness", "Beauty / Salon", "Real Estate",
  "Retail / E-commerce", "Restaurant / Café", "Photography", "Coaching / Consulting",
  "SaaS / Tech", "Healthcare", "Education", "Home Services", "Fashion", "Other",
];

interface FormData {
  name: string;
  industry: string;
  tagline: string;
  tone: Tone;
  brand_color_1: string;
  brand_color_2: string;
  target_audience: string;
  platforms: Platform[];
  avoid_content: string;
}

const STEPS = [
  { title: "About your business", subtitle: "Let's get to know your brand" },
  { title: "Brand personality",   subtitle: "How should your content feel?" },
  { title: "Your audience",        subtitle: "Who are you talking to?" },
  { title: "Final touches",        subtitle: "Almost there — you're all set" },
];

const defaultForm: FormData = {
  name: "", industry: "", tagline: "",
  tone: "professional",
  brand_color_1: "#E85D04", brand_color_2: "#F59E0B",
  target_audience: "", platforms: ["instagram"], avoid_content: "",
};

/* Shared input style */
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1.5px solid #E7E5E4",
  background: "white",
  color: "#1C1917",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.15s",
};

export default function OnboardingPage() {
  const router  = useRouter();
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [done, setDone]     = useState(false);

  function update(field: keyof FormData, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function togglePlatform(p: Platform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  }

  function canAdvance() {
    if (step === 0) return form.name.trim() && form.industry;
    if (step === 1) return form.tone;
    if (step === 2) return form.target_audience.trim() && form.platforms.length > 0;
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  /* ── Success state ─────────────────────────────────────── */
  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#FAFAF7" }}
      >
        <div className="text-center max-w-md animate-fade-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#FFF7ED" }}
          >
            <CheckCircle2 size={44} style={{ color: "#E85D04" }} />
          </div>
          <h1
            className="text-4xl font-bold heading-serif mb-3"
            style={{ color: "#1C1917" }}
          >
            You&apos;re all set! 🎉
          </h1>
          <p className="mb-2" style={{ color: "#78716C" }}>
            We&apos;re generating your first week of creatives right now.
          </p>
          <p className="mb-10" style={{ color: "#78716C" }}>
            Check your inbox in a few minutes, or head to your dashboard to see
            them as they&apos;re ready.
          </p>
          <Link
            href="/dashboard"
            className="gradient-brand text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ boxShadow: "0 4px 14px rgba(232,93,4,0.3)" }}
          >
            Go to dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main form ─────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#FAFAF7" }}
    >
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold gradient-text heading-serif">
            CreativeLoop
          </Link>
          <p className="text-sm mt-1" style={{ color: "#A8A29E" }}>
            One-time setup · Takes about 5 minutes
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i <= step ? "#E85D04" : "#E7E5E4",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-sm"
          style={{ background: "white", border: "1.5px solid #E7E5E4" }}
        >
          {/* Step header */}
          <div className="mb-7">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#E85D04" }}
            >
              Step {step + 1} of {STEPS.length}
            </p>
            <h2
              className="text-2xl font-bold heading-serif"
              style={{ color: "#1C1917" }}
            >
              {STEPS[step].title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
              {STEPS[step].subtitle}
            </p>
          </div>

          {/* ── Step 0: Business basics ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#44403C" }}>
                  Business name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Sunrise Bakery"
                  onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                  onBlur={(e)  => (e.target.style.borderColor = "#E7E5E4")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#44403C" }}>
                  Industry *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => update("industry", ind)}
                      className="text-sm px-3 py-2.5 rounded-xl border text-left transition-all"
                      style={{
                        borderColor: form.industry === ind ? "#E85D04" : "#E7E5E4",
                        background: form.industry === ind ? "#FFF7ED" : "white",
                        color: form.industry === ind ? "#C2410C" : "#57534E",
                        fontWeight: form.industry === ind ? 600 : 400,
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#44403C" }}>
                  Tagline{" "}
                  <span className="font-normal" style={{ color: "#A8A29E" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Baked fresh, every morning"
                  maxLength={80}
                  onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                  onBlur={(e)  => (e.target.style.borderColor = "#E7E5E4")}
                />
              </div>
            </div>
          )}

          {/* ── Step 1: Brand personality ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "#44403C" }}>
                  Tone of voice *
                </label>
                <div className="space-y-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update("tone", t.value)}
                      className="w-full text-left px-4 py-3.5 rounded-xl border transition-all"
                      style={{
                        borderColor: form.tone === t.value ? "#E85D04" : "#E7E5E4",
                        background: form.tone === t.value ? "#FFF7ED" : "white",
                      }}
                    >
                      <div className="font-semibold text-sm" style={{ color: "#1C1917" }}>
                        {t.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#78716C" }}>
                        {t.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "#44403C" }}>
                  Brand colors
                </label>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="text-xs mb-1.5 block" style={{ color: "#A8A29E" }}>
                      Primary color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.brand_color_1}
                        onChange={(e) => update("brand_color_1", e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer border-2"
                        style={{ borderColor: "#E7E5E4" }}
                      />
                      <span className="text-sm font-mono" style={{ color: "#57534E" }}>
                        {form.brand_color_1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs mb-1.5 block" style={{ color: "#A8A29E" }}>
                      Secondary color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.brand_color_2}
                        onChange={(e) => update("brand_color_2", e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer border-2"
                        style={{ borderColor: "#E7E5E4" }}
                      />
                      <span className="text-sm font-mono" style={{ color: "#57534E" }}>
                        {form.brand_color_2}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 h-10 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, ${form.brand_color_1}, ${form.brand_color_2})`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Audience & platforms ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#44403C" }}>
                  Target audience *
                </label>
                <textarea
                  value={form.target_audience}
                  onChange={(e) => update("target_audience", e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                  placeholder="e.g. Women aged 25–40 in urban areas who are health-conscious and enjoy trying new restaurants"
                  rows={3}
                  onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                  onBlur={(e)  => (e.target.style.borderColor = "#E7E5E4")}
                />
                <p className="text-xs mt-1" style={{ color: "#A8A29E" }}>
                  The more specific, the better the content
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "#44403C" }}>
                  Platforms to post on *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                      style={{
                        borderColor: form.platforms.includes(p.value) ? "#E85D04" : "#E7E5E4",
                        background: form.platforms.includes(p.value) ? "#FFF7ED" : "white",
                        color: form.platforms.includes(p.value) ? "#C2410C" : "#57534E",
                      }}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="font-medium text-sm">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Final touches ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#44403C" }}>
                  Topics or content to avoid{" "}
                  <span className="font-normal" style={{ color: "#A8A29E" }}>(optional)</span>
                </label>
                <textarea
                  value={form.avoid_content}
                  onChange={(e) => update("avoid_content", e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                  placeholder="e.g. Don't mention competitors, avoid pricing discussions, no political content"
                  rows={3}
                  onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                  onBlur={(e)  => (e.target.style.borderColor = "#E7E5E4")}
                />
              </div>

              {/* Brand summary */}
              <div
                className="rounded-2xl p-5 space-y-2.5 text-sm"
                style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
              >
                <p className="font-bold mb-3 heading-serif" style={{ color: "#9A3412" }}>
                  Your brand summary
                </p>
                {[
                  ["Business", form.name],
                  ["Industry", form.industry],
                  ["Tone", form.tone],
                  ["Platforms", form.platforms.join(", ")],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between" style={{ color: "#57534E" }}>
                    <span style={{ color: "#A8A29E" }}>{label}</span>
                    <span className="font-medium capitalize" style={{ color: "#1C1917" }}>
                      {val}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between" style={{ color: "#57534E" }}>
                  <span style={{ color: "#A8A29E" }}>Brand colors</span>
                  <div className="flex gap-2">
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: form.brand_color_1 }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: form.brand_color_2 }}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div
                  className="text-sm rounded-xl px-4 py-3"
                  style={{ background: "#FFF1F0", border: "1px solid #FECACA", color: "#DC2626" }}
                >
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 font-medium text-sm disabled:opacity-30 transition-colors"
              style={{ color: "#78716C" }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="gradient-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2 text-sm"
                style={{ boxShadow: "0 4px 12px rgba(232,93,4,0.25)" }}
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="gradient-brand text-white font-semibold px-8 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2 text-sm"
                style={{ boxShadow: "0 4px 12px rgba(232,93,4,0.25)" }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Setting up…" : "Generate my first week! 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
