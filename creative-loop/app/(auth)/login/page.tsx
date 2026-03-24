"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#FAFAF7" }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{
          background: "linear-gradient(160deg, #FFF7ED 0%, #FFEDD5 60%, #FED7AA 100%)",
        }}
      >
        <Link href="/" className="text-2xl font-bold gradient-text heading-serif">
          CreativeLoop
        </Link>

        <div>
          <p
            className="text-4xl font-bold leading-snug heading-serif mb-6"
            style={{ color: "#1C1917" }}
          >
            &ldquo;I went from spending Sunday nights on content, to opening my inbox on Monday.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: "rgba(232,93,4,0.15)" }}
            >
              🧁
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#1C1917" }}>
                Priya R.
              </p>
              <p className="text-xs" style={{ color: "#78716C" }}>
                Sunrise Bakery
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: "#A8A29E" }}>
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
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "#78716C" }}>
            Sign in to see this week&apos;s creatives
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="••••••••"
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#78716C" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold hover:underline"
              style={{ color: "#E85D04" }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
