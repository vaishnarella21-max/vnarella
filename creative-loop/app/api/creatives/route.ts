import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get this user's business
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ packages: [] });
  }

  // Fetch packages with creatives
  const { data: packages, error } = await supabase
    .from("weekly_packages")
    .select(`
      id, week_start, status, created_at,
      creatives (
        id, day_index, post_type, caption, hashtags,
        video_script, image_url, rating, feedback_notes, created_at
      )
    `)
    .eq("business_id", business.id)
    .order("week_start", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sort creatives by day_index within each package
  const sorted = packages?.map((pkg) => ({
    ...pkg,
    creatives: (pkg.creatives as any[])?.sort((a, b) => a.day_index - b.day_index) || [],
  }));

  return NextResponse.json({ packages: sorted, businessId: business.id });
}
