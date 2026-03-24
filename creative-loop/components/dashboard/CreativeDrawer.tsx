"use client";

import { useState } from "react";
import Image from "next/image";
import { Creative, DAY_NAMES } from "@/lib/supabase/types";
import { X, Copy, Star, Download, Check } from "lucide-react";

interface DrawerProps {
  creative: Creative;
  onClose: () => void;
  onRated: (updated: Creative) => void;
}

export default function CreativeDrawer({ creative, onClose, onRated }: DrawerProps) {
  const [tab, setTab]               = useState<"caption" | "script" | "hashtags">("caption");
  const [rating, setRating]         = useState(creative.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [notes, setNotes]           = useState(creative.feedback_notes || "");
  const [copied, setCopied]         = useState(false);
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [feedbackSaved, setFeedbackSaved]   = useState(false);

  const dayName = DAY_NAMES[creative.day_index];

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submitFeedback(newRating: number) {
    setSavingFeedback(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creativeId: creative.id, rating: newRating, notes }),
      });
      setRating(newRating);
      setFeedbackSaved(true);
      onRated({ ...creative, rating: newRating, feedback_notes: notes });
      setTimeout(() => setFeedbackSaved(false), 2000);
    } finally {
      setSavingFeedback(false);
    }
  }

  const tabContent = {
    caption:  creative.caption,
    script:   creative.video_script,
    hashtags: creative.hashtags.map((h) => `#${h}`).join(" "),
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-slide-up sm:animate-none"
        style={{ background: "#FAFAF7" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b"
          style={{ background: "rgba(250,250,247,0.95)", borderColor: "#E7E5E4" }}
        >
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#E85D04" }}
            >
              {dayName}
            </span>
            <p className="text-sm font-bold capitalize" style={{ color: "#1C1917" }}>
              {creative.post_type.replace(/-/g, " ")} post
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "#78716C" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#FFF7ED";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image */}
          {creative.image_url && (
            <div
              className="relative w-full aspect-square rounded-2xl overflow-hidden"
              style={{ background: "#FFF7ED" }}
            >
              <Image
                src={creative.image_url}
                alt={`${dayName} post`}
                fill
                className="object-cover"
                sizes="448px"
              />
              <a
                href={creative.image_url}
                download={`${dayName.toLowerCase()}-post.png`}
                className="absolute bottom-3 right-3 p-2.5 rounded-xl shadow-md transition-colors"
                style={{ background: "rgba(255,255,255,0.92)", color: "#57534E" }}
                title="Download image"
              >
                <Download size={16} />
              </a>
            </div>
          )}

          {/* Tabs */}
          <div className="flex rounded-xl p-1" style={{ background: "#F5F5F0" }}>
            {(["caption", "script", "hashtags"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all"
                style={{
                  background: tab === t ? "white" : "transparent",
                  color: tab === t ? "#E85D04" : "#78716C",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {t === "script" ? "Video script" : t === "hashtags" ? "Hashtags" : "Caption"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="relative">
            <div
              className="rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-80 overflow-y-auto"
              style={{ background: "white", color: "#44403C", border: "1px solid #E7E5E4" }}
            >
              {tabContent[tab]}
            </div>
            <button
              onClick={() => copy(tabContent[tab])}
              className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors"
              style={{
                background: "white",
                borderColor: "#E7E5E4",
                color: copied ? "#16A34A" : "#78716C",
              }}
            >
              {copied ? (
                <><Check size={12} /> Copied!</>
              ) : (
                <><Copy size={12} /> Copy</>
              )}
            </button>
          </div>

          {/* Feedback */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "white", border: "1px solid #E7E5E4" }}
          >
            <p className="text-sm font-bold heading-serif" style={{ color: "#1C1917" }}>
              Rate this creative
              <span className="font-normal text-xs ml-2" style={{ color: "#A8A29E" }}>
                · helps improve next week
              </span>
            </p>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => submitFeedback(s)}
                  disabled={savingFeedback}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    style={{
                      color:
                        s <= (hoverRating || rating) ? "#F59E0B" : "#E7E5E4",
                      fill:
                        s <= (hoverRating || rating) ? "#F59E0B" : "#E7E5E4",
                    }}
                  />
                </button>
              ))}
              {feedbackSaved && (
                <span
                  className="ml-2 text-xs font-semibold flex items-center gap-1"
                  style={{ color: "#16A34A" }}
                >
                  <Check size={12} /> Saved
                </span>
              )}
            </div>

            {rating > 0 && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-sm px-3 py-2.5 rounded-xl border resize-none outline-none transition-all"
                style={{
                  borderColor: "#E7E5E4",
                  color: "#44403C",
                  background: "#FAFAF7",
                }}
                placeholder="Optional: anything specific to change or keep?"
                rows={2}
                onFocus={(e) => (e.target.style.borderColor = "#E85D04")}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E7E5E4";
                  submitFeedback(rating);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
