import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Vercel Cron: runs every Monday at 7:00 AM (configured in vercel.json)
 * Triggers generation for every active business.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fetch all active businesses
  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("active", true);

  if (error) {
    console.error("Cron: failed to fetch businesses", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!businesses?.length) {
    return NextResponse.json({ message: "No active businesses", triggered: 0 });
  }

  // Trigger generation for each business (fire and forget)
  const results = await Promise.allSettled(
    businesses.map((b) =>
      fetch(`${appUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: b.id }),
      })
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`Cron complete: ${succeeded} succeeded, ${failed} failed`);

  return NextResponse.json({
    message: "Weekly generation triggered",
    total: businesses.length,
    succeeded,
    failed,
  });
}
