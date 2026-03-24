"use client";

import { useState } from "react";
import Image from "next/image";
import { Creative, DAY_NAMES } from "@/lib/supabase/types";
import CreativeDrawer from "./CreativeDrawer";
import { Star, ImageOff, Download } from "lucide-react";

interface PackageGridProps {
  creatives: Creative[];
  packageId: string;
}

export default function PackageGrid({ creatives, packageId }: PackageGridProps) {
  const [selected, setSelected] = useState<Creative | null>(null);

  return (
    <>
      {/* Download all */}
      <div className="flex justify-end mb-5">
        <a
          href={`/api/creatives/${packageId}/download`}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors"
          style={{
            color: "#E85D04",
            borderColor: "#FED7AA",
            background: "#FFF7ED",
          }}
        >
          <Download size={15} />
          Download all assets
        </a>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {creatives.map((creative) => (
          <CreativeCard
            key={creative.id}
            creative={creative}
            onClick={() => setSelected(creative)}
          />
        ))}
      </div>

      {/* Drawer */}
      {selected && (
        <CreativeDrawer
          creative={selected}
          onClose={() => setSelected(null)}
          onRated={(updatedCreative) => setSelected(updatedCreative)}
        />
      )}
    </>
  );
}

function CreativeCard({ creative, onClick }: { creative: Creative; onClick: () => void }) {
  const dayName = DAY_NAMES[creative.day_index];

  return (
    <button
      onClick={onClick}
      className="group rounded-2xl overflow-hidden text-left w-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: "white", border: "1px solid #E7E5E4" }}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{ background: "#FFF7ED" }}
      >
        {creative.image_url ? (
          <Image
            src={creative.image_url}
            alt={`${dayName} post`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ color: "#FDBA74" }}
          >
            <ImageOff size={28} />
            <span className="text-xs">Generating image…</span>
          </div>
        )}

        {/* Day badge */}
        <div
          className="absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
          style={{ background: "rgba(255,255,255,0.92)", color: "#44403C" }}
        >
          {dayName}
        </div>

        {/* Post type badge */}
        <div
          className="absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full capitalize"
          style={{ background: "rgba(194,65,12,0.88)" }}
        >
          {creative.post_type.replace(/-/g, " ")}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "#57534E" }}>
          {creative.caption}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs" style={{ color: "#A8A29E" }}>
            {creative.hashtags.length} hashtags
          </span>
          {creative.rating ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  style={{
                    color: s <= creative.rating! ? "#F59E0B" : "#E7E5E4",
                    fill: s <= creative.rating! ? "#F59E0B" : "#E7E5E4",
                  }}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs font-semibold" style={{ color: "#FDBA74" }}>
              Rate this
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
