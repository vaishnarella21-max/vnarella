import { createClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Calendar, Star } from "lucide-react";

export default async function HistoryPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const { data: packages } = await supabase
    .from("weekly_packages")
    .select(`id, week_start, status, created_at, creatives (rating, image_url)`)
    .eq("business_id", business!.id)
    .eq("status", "ready")
    .order("week_start", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#E85D04" }}>
          Archive
        </p>
        <h1 className="text-3xl font-bold heading-serif" style={{ color: "#1C1917" }}>
          Content history
        </h1>
        <p className="text-sm mt-1" style={{ color: "#78716C" }}>
          All your past creative packages
        </p>
      </div>

      {!packages?.length ? (
        <div className="text-center py-24" style={{ color: "#A8A29E" }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#FFF7ED" }}
          >
            <Calendar size={28} style={{ color: "#FDBA74" }} />
          </div>
          <p className="font-medium" style={{ color: "#78716C" }}>
            No past packages yet. Check back next week!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg: any) => {
            const creatives     = pkg.creatives || [];
            const rated         = creatives.filter((c: any) => c.rating !== null);
            const avgRating     = rated.length
              ? (rated.reduce((s: number, c: any) => s + c.rating, 0) / rated.length).toFixed(1)
              : null;
            const previewImages = creatives
              .filter((c: any) => c.image_url)
              .slice(0, 3)
              .map((c: any) => c.image_url);

            return (
              <div
                key={pkg.id}
                className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "white", border: "1px solid #E7E5E4" }}
              >
                {/* Image strip */}
                <div
                  className="flex h-24"
                  style={{ background: "#FFF7ED" }}
                >
                  {previewImages.length > 0 ? (
                    previewImages.map((src: string, i: number) => (
                      <div
                        key={i}
                        className="flex-1 bg-cover bg-center"
                        style={{ backgroundImage: `url(${src})` }}
                      />
                    ))
                  ) : (
                    <div
                      className="flex-1 flex items-center justify-center text-sm"
                      style={{ color: "#FDBA74" }}
                    >
                      No previews
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div
                    className="font-semibold text-sm heading-serif"
                    style={{ color: "#1C1917" }}
                  >
                    Week of {format(parseISO(pkg.week_start), "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs" style={{ color: "#A8A29E" }}>
                      {creatives.length} posts
                    </span>
                    {avgRating && (
                      <div
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: "#F59E0B" }}
                      >
                        <Star size={12} fill="currentColor" />
                        {avgRating}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/history/${pkg.id}`}
                    className="mt-3 block text-center text-xs font-semibold py-2 rounded-xl border transition-colors hover:opacity-90"
                    style={{
                      color: "#E85D04",
                      borderColor: "#FED7AA",
                      background: "#FFF7ED",
                    }}
                  >
                    View package
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
