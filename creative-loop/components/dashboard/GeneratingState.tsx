"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function GeneratingState() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      {/* Animated icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-pulse-slow"
        style={{
          background: "linear-gradient(135deg, #E85D04, #F59E0B)",
          boxShadow: "0 0 40px rgba(232,93,4,0.3)",
        }}
      >
        <Sparkles size={36} className="text-white" />
      </div>

      <h2
        className="text-3xl font-bold heading-serif mb-3"
        style={{ color: "#1C1917" }}
      >
        Crafting your creatives…
      </h2>
      <p className="max-w-sm leading-relaxed" style={{ color: "#78716C" }}>
        Our AI is generating 7 branded posts tailored to your business. This
        usually takes about 2–3 minutes. This page updates automatically.
      </p>

      {/* Bouncing dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              background: "#FDBA74",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
