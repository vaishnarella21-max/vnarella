import { createClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import PackageGrid from "@/components/dashboard/PackageGrid";
import GeneratingState from "@/components/dashboard/GeneratingState";
import EmptyState from "@/components/dashboard/EmptyState";

export const revalidate = 30;

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: packages } = await supabase
    .from("weekly_packages")
    .select(`
      id, week_start, status, created_at,
      creatives (
        id, day_index, post_type, caption, hashtags,
        video_script, image_url, rating, feedback_notes
      )
    `)
    .eq("business_id", business!.id)
    .order("week_start", { ascending: false })
    .limit(1);

  const latestPackage = packages?.[0];

  if (!latestPackage) {
    return <EmptyState businessName={business!.name} />;
  }

  if (latestPackage.status === "generating") {
    return <GeneratingState />;
  }

  const weekLabel = format(parseISO(latestPackage.week_start), "MMMM d, yyyy");
  const creatives = [...(latestPackage.creatives || [])].sort(
    (a: any, b: any) => a.day_index - b.day_index
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#E85D04" }}>
          This week
        </p>
        <h1 className="text-3xl font-bold heading-serif" style={{ color: "#1C1917" }}>
          Your creatives are ready
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
          Week of {weekLabel} · {creatives.length} posts ready to post
        </p>
      </div>
      <PackageGrid creatives={creatives as any} packageId={latestPackage.id} />
    </div>
  );
}
