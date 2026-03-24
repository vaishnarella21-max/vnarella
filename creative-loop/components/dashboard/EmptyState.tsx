"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmptyState({ businessName }: { businessName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function trigger() {
    setLoading(true);
    await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: "me" }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      {/* Icon */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 text-5xl"
        style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
      >
        🌱
      </div>

      <h2
        className="text-3xl font-bold heading-serif mb-3"
        style={{ color: "#1C1917" }}
      >
        Welcome, {businessName}!
      </h2>
      <p className="max-w-sm leading-relaxed mb-8" style={{ color: "#78716C" }}>
        You&apos;re all set. Generate your first batch of weekly creatives now,
        and every Monday you&apos;ll receive fresh content automatically.
      </p>

      <button
        onClick={trigger}
        disabled={loading}
        className="gradient-brand text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
        style={{ boxShadow: "0 4px 14px rgba(232,93,4,0.3)" }}
      >
        <Sparkles size={16} />
        {loading ? "Generating…" : "Generate my first week"}
      </button>
    </div>
  );
}
