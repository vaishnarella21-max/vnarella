"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowRight, Check } from "lucide-react";

const PERKS = [
  "7 branded posts delivered every Monday",
  "Images, captions, scripts & hashtags included",
  "Learns and improves from your feedback",
  "No templates, no manual work",
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF7" }}>

      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "linear-gradient(160deg, #7C2D12 0%, #C2410C 50%, #E85D04 100%)",
        }}
      >
        <Link href="/" className="text-2xl font-bold text-white heading-serif">
          CreativeLoop
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white heading-serif mb-8 leading-snug">
            Everything your social media needs, every week.
          </h2>
          <ul className="space-y-4">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <Check size={13} className="text-white" />
                </div>
                <span className="text-sm" style={{ color: "#FFEDD5" }}>
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2026 CreativeLoop
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-2xl font-bold gradient-text heading-serif">
              CreativeLoop
            </Link>
          </div>

          <h1
            className="text-3xl font-bold heading-serif mb-2"
            style={{ color: "#1C1917" }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: "#78716C" }}>
            Start getting weekly creatives in minutes — no card needed
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#44403C" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: "white",
                  borderColor: "#E7E5E4",
                  color: "#1C1917",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                placeholder="you@yourbusiness.com"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#44403C" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: "white",
                  borderColor: "#E7E5E4",
                  color: "#1C1917",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            {error && (
              <div
                className="text-sm rounded-xl px-4 py-3"
                style={{
                  background: "#FFF1F0",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              style={{ boxShadow: "0 4px 14px rgba(232, 93, 4, 0.3)" }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create free account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-3 text-center text-xs" style={{ color: "#A8A29E" }}>
            No credit card required. No templates. Just your brand details.
          </p>

          <p className="mt-5 text-center text-sm" style={{ color: "#78716C" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: "#E85D04" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
